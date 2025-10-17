import { db } from './db';
import { contracts, finders, users, transactions } from '@shared/schema';
import { eq, and, lte, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface AutonomousFundConfig {
  holdingPeriodHours: number;
  autoCreditEnabled: boolean;
  minimumRating: number;
  minimumJobsCompleted: number;
}

export class AutonomousFundService {
  private config: AutonomousFundConfig = {
    holdingPeriodHours: 24, // 24 hour holding period
    autoCreditEnabled: true,
    minimumRating: 4.0,
    minimumJobsCompleted: 1
  };

  private isProcessing = false;

  /**
   * Process autonomous fund crediting for completed orders
   * This runs periodically to check and credit funds automatically
   */
  async processAutonomousFundCrediting(): Promise<void> {
    if (this.isProcessing || !this.config.autoCreditEnabled) {
      return;
    }

    this.isProcessing = true;
    console.log('🔄 Processing autonomous fund crediting...');

    try {
      const now = new Date();
      const holdingPeriodEnd = new Date(now.getTime() - (this.config.holdingPeriodHours * 60 * 60 * 1000));

      // Find contracts that are completed and ready for autonomous crediting
      const readyContracts = await db
        .select({
          contractId: contracts.id,
          finderId: contracts.finderId,
          clientId: contracts.clientId,
          amount: contracts.amount,
          completedAt: contracts.completedAt,
          escrowStatus: contracts.escrowStatus,
          isCompleted: contracts.isCompleted
        })
        .from(contracts)
        .where(
          and(
            eq(contracts.isCompleted, true),
            eq(contracts.escrowStatus, 'completed'),
            lte(contracts.completedAt, holdingPeriodEnd),
            sql`${contracts.finderId} IS NOT NULL`
          )
        );

      console.log(`Found ${readyContracts.length} contracts ready for autonomous crediting`);

      let successCount = 0;
      let errorCount = 0;

      for (const contract of readyContracts) {
        try {
          await this.creditFinderEarnings(contract);
          successCount++;
        } catch (error) {
          console.error(`Error crediting contract ${contract.contractId}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Autonomous fund crediting completed: ${successCount} successful, ${errorCount} errors`);

    } catch (error) {
      console.error('❌ Error in autonomous fund crediting:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Credit finder earnings for a completed contract
   */
  private async creditFinderEarnings(contract: any): Promise<void> {
    console.log(`💰 Crediting finder ${contract.finderId} for contract ${contract.contractId}`);

    try {
      // Get finder details
      const finder = await db
        .select({
          id: finders.id,
          userId: finders.userId,
          availableBalance: finders.availableBalance,
          totalEarned: finders.totalEarned,
          jobsCompleted: finders.jobsCompleted,
          averageRating: finders.averageRating
        })
        .from(finders)
        .where(eq(finders.id, contract.finderId))
        .limit(1);

      if (!finder[0]) {
        throw new Error(`Finder ${contract.finderId} not found`);
      }

      const currentFinder = finder[0];
      const contractAmount = parseFloat(contract.amount);

      // Update finder's available balance and total earned
      await db
        .update(finders)
        .set({
          availableBalance: sql`${currentFinder.availableBalance} + ${contractAmount}`,
          totalEarned: sql`${currentFinder.totalEarned} + ${contractAmount}`
        })
        .where(eq(finders.id, contract.finderId));

      // Create transaction record
      await db
        .insert(transactions)
        .values({
          id: uuidv4(),
          userId: contract.clientId,
          finderId: contract.finderId,
          amount: contractAmount,
          type: 'escrow_release',
          description: `Autonomous fund release for completed contract ${contract.contractId}`,
          reference: contract.contractId,
          createdAt: new Date()
        });

      // Update contract escrow status to released
      await db
        .update(contracts)
        .set({
          escrowStatus: 'released'
        })
        .where(eq(contracts.id, contract.contractId));

      console.log(`✅ Successfully credited ${contractAmount} to finder ${contract.finderId}`);

      // Check and update finder level after crediting
      await this.updateFinderLevelIfEligible(contract.finderId);

    } catch (error) {
      console.error(`❌ Error crediting finder ${contract.finderId}:`, error);
      throw error;
    }
  }

  /**
   * Update finder level based on performance metrics
   */
  private async updateFinderLevelIfEligible(finderId: string): Promise<void> {
    try {
      const finder = await db
        .select({
          id: finders.id,
          userId: finders.userId,
          jobsCompleted: finders.jobsCompleted,
          totalEarned: finders.totalEarned,
          averageRating: finders.averageRating,
          currentLevelId: finders.currentLevelId
        })
        .from(finders)
        .where(eq(finders.id, finderId))
        .limit(1);

      if (!finder[0]) {
        return;
      }

      const currentFinder = finder[0];
      const currentJobsCompleted = currentFinder.jobsCompleted || 0;
      const currentRating = parseFloat(currentFinder.averageRating?.toString() || '0');
      const currentEarnings = parseFloat(currentFinder.totalEarned?.toString() || '0');

      // Get all finder levels ordered by requirements
      const levels = await db
        .select({
          id: sql`id`,
          name: sql`name`,
          minJobsCompleted: sql`min_jobs_completed`,
          minRating: sql`min_rating`,
          minEarnedAmount: sql`min_earned_amount`
        })
        .from(sql`finder_levels`)
        .where(sql`is_active = true`)
        .orderBy(sql`order DESC`);

      // Find the highest level the finder qualifies for
      let newLevelId = null;
      for (const level of levels) {
        const minJobs = level.minJobsCompleted || 0;
        const minRating = parseFloat(level.minRating?.toString() || '0');
        const minEarnings = parseFloat(level.minEarnedAmount?.toString() || '0');

        if (
          currentJobsCompleted >= minJobs &&
          currentRating >= minRating &&
          currentEarnings >= minEarnings
        ) {
          newLevelId = level.id;
          break;
        }
      }

      // Update level if different from current
      if (newLevelId && newLevelId !== currentFinder.currentLevelId) {
        await db
          .update(finders)
          .set({
            currentLevelId: newLevelId
          })
          .where(eq(finders.id, finderId));

        console.log(`🎯 Finder ${finderId} level updated to ${newLevelId}`);
      }

    } catch (error) {
      console.error(`❌ Error updating finder level for ${finderId}:`, error);
    }
  }

  /**
   * Start the autonomous fund service scheduler
   */
  startScheduler(): void {
    // Run immediately on server start
    this.processAutonomousFundCrediting();

    // Schedule to run every hour
    setInterval(() => {
      this.processAutonomousFundCrediting();
    }, 60 * 60 * 1000); // Every hour

    console.log('🔄 Autonomous fund service scheduler started');
  }

  /**
   * Get current service configuration
   */
  getConfig(): AutonomousFundConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<AutonomousFundConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Autonomous fund service configuration updated:', this.config);
  }
}

// Export singleton instance
export const autonomousFundService = new AutonomousFundService();