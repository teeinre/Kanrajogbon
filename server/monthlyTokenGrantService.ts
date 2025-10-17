import { storage } from './storage';
import { db } from './db';
import { findertokens, users, finders } from '@shared/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface FinderLevel {
  id: string;
  name: string;
  monthlyTokens: number;
}

const FINDER_LEVEL_TOKENS: Record<string, number> = {
  'GrandMeister': 50,
  'Meister': 30,
  'Novice': 20,
  'Pathfinder': 20,
  'Seeker': 20
};

export class MonthlyTokenGrantService {
  private isRunning = false;

  /**
   * Grant monthly tokens to all active finders based on their level
   * This should be called on the 1st day of every month
   */
  async grantMonthlyTokens(): Promise<void> {
    if (this.isRunning) {
      console.log('Monthly token grant is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting monthly token grant process...');

    try {
      // Get all active finders with their levels
      const activeFinders = await db
        .select({
          finderId: finders.id,
          userId: finders.userId,
          level: finders.level,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email
        })
        .from(finders)
        .innerJoin(users, eq(finders.userId, users.id))
        .where(eq(users.isActive, true));

      console.log(`Found ${activeFinders.length} active finders`);

      let totalGranted = 0;
      let successCount = 0;
      let errorCount = 0;

      // Process each finder
      for (const finder of activeFinders) {
        try {
          const tokenAmount = FINDER_LEVEL_TOKENS[finder.level] || 20; // Default to 20 if level not found
          
          if (tokenAmount <= 0) {
            console.log(`No tokens to grant for ${finder.level} level finder ${finder.email}`);
            continue;
          }

          // Create token grant record
          const tokenRecord = await db
            .insert(findertokens)
            .values({
              id: uuidv4(),
              finderId: finder.finderId,
              amount: tokenAmount,
              type: 'monthly_grant',
              description: `Monthly token grant for ${finder.level} level`,
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
              createdAt: new Date()
            })
            .returning();

          if (tokenRecord[0]) {
            console.log(`Granted ${tokenAmount} tokens to ${finder.email} (${finder.level})`);
            totalGranted += tokenAmount;
            successCount++;
          }

        } catch (error) {
          console.error(`Error granting tokens to finder ${finder.email}:`, error);
          errorCount++;
        }
      }

      console.log(`Monthly token grant completed:`);
      console.log(`- Total finders processed: ${activeFinders.length}`);
      console.log(`- Successful grants: ${successCount}`);
      console.log(`- Errors: ${errorCount}`);
      console.log(`- Total tokens granted: ${totalGranted}`);

    } catch (error) {
      console.error('Error in monthly token grant process:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Check if monthly tokens have already been granted this month
   */
  async hasGrantedTokensThisMonth(): Promise<boolean> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    try {
      const existingGrants = await db
        .select({ count: sql<number>`count(*)` })
        .from(findertokens)
        .where(
          and(
            eq(findertokens.type, 'monthly_grant'),
            gte(findertokens.createdAt, firstDayOfMonth)
          )
        );

      return existingGrants[0]?.count > 0;
    } catch (error) {
      console.error('Error checking monthly token grants:', error);
      return false;
    }
  }

  /**
   * Schedule the monthly token grant to run automatically
   * This should be called when the server starts
   */
  startScheduler(): void {
    // Run immediately on server start if it's the first day of month
    this.checkAndGrantTokens();

    // Check every hour to see if it's time to grant tokens
    setInterval(() => {
      this.checkAndGrantTokens();
    }, 60 * 60 * 1000); // Check every hour

    console.log('Monthly token grant scheduler started');
  }

  /**
   * Check if it's time to grant monthly tokens and do so if needed
   */
  private async checkAndGrantTokens(): Promise<void> {
    const now = new Date();
    
    // Only grant on the 1st day of the month between 00:00 and 02:00
    if (now.getDate() !== 1) {
      return;
    }

    // Check if we've already granted tokens this month
    const hasGranted = await this.hasGrantedTokensThisMonth();
    if (hasGranted) {
      console.log('Monthly tokens have already been granted this month');
      return;
    }

    console.log('It\'s the first day of the month - granting monthly tokens...');
    await this.grantMonthlyTokens();
  }
}

// Export singleton instance
export const monthlyTokenGrantService = new MonthlyTokenGrantService();