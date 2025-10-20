
import { storage } from "./storage";
import { 
  type InsertStrike,
  type InsertUserRestriction,
  type InsertDispute,
  type InsertBehavioralTraining,
  type InsertTrustedBadge
} from "@shared/schema";

// Strike level definitions with strike number increments
interface StrikeDefinition {
  level: number;
  strikeIncrement: number; // How many strike points this level adds
  consequence: string;
  description: string;
  restrictionType?: string;
  restrictionDuration?: number; // in hours
}

const strikeDefinitions: StrikeDefinition[] = [
  { 
    level: 1, 
    strikeIncrement: 1,
    consequence: "Warning", 
    description: "Educational reminder with minimal penalty" 
  },
  { 
    level: 2, 
    strikeIncrement: 2,
    consequence: "Minor Restrictions", 
    description: "Limited features for 3 days",
    restrictionType: "limited_features",
    restrictionDuration: 3 * 24 // 3 days in hours
  },
  { 
    level: 3, 
    strikeIncrement: 3,
    consequence: "Moderate Restrictions", 
    description: "Limited features for 7 days",
    restrictionType: "limited_features",
    restrictionDuration: 7 * 24 // 7 days in hours
  },
  { 
    level: 4, 
    strikeIncrement: 4,
    consequence: "Severe Restrictions", 
    description: "Account suspended for 7 days",
    restrictionType: "suspended",
    restrictionDuration: 7 * 24 // 7 days in hours
  },
  { 
    level: 5, 
    strikeIncrement: 5,
    consequence: "Critical Violation", 
    description: "Account suspended for 30 days",
    restrictionType: "suspended",
    restrictionDuration: 30 * 24 // 30 days in hours
  }
];

// Offense definitions with their severity levels
interface OffenseDefinition {
  offense: string;
  strikeLevel: number; // Maps to strikeDefinitions level
  applicableRoles: string[];
  resolution: string;
}

const clientOffenses: OffenseDefinition[] = [
  {
    offense: "No-show or ghosting after find match",
    strikeLevel: 1,
    applicableRoles: ["client"],
    resolution: "Warning + auto-removal of find"
  },
  {
    offense: "Misleading Request Description",
    strikeLevel: 2,
    applicableRoles: ["client"],
    resolution: "Review + posting restrictions for 3 days"
  },
  {
    offense: "Fake or malicious find",
    strikeLevel: 3,
    applicableRoles: ["client"],
    resolution: "Review + block posting for 7 days"
  },
  {
    offense: "Low review average",
    strikeLevel: 2,
    applicableRoles: ["client"],
    resolution: "3-day review & education period"
  },
  {
    offense: "Refusing payment after confirmed find",
    strikeLevel: 4,
    applicableRoles: ["client"],
    resolution: "Escrow payout to Finder + 7-day suspension"
  },
  {
    offense: "Abuse or harassment of Finders",
    strikeLevel: 5,
    applicableRoles: ["client"],
    resolution: "Investigation by support team + 30-day suspension"
  }
];

const finderOffenses: OffenseDefinition[] = [
  {
    offense: "Low Quality or Incomplete Proposals",
    strikeLevel: 1,
    applicableRoles: ["finder"],
    resolution: "Warning + proposal review"
  },
  {
    offense: "Repeated no-shows",
    strikeLevel: 2,
    applicableRoles: ["finder"],
    resolution: "Limited applications for 3 days"
  },
  {
    offense: "Toxic communication",
    strikeLevel: 2,
    applicableRoles: ["finder"],
    resolution: "Temporarily muted + counseling module"
  },
  {
    offense: "Poor Quality Work Delivery",
    strikeLevel: 3,
    applicableRoles: ["finder"],
    resolution: "Work review + 7-day feature restrictions"
  },
  {
    offense: "Lying about completion",
    strikeLevel: 4,
    applicableRoles: ["finder"],
    resolution: "7-day suspension + mandatory training"
  },
  {
    offense: "Uploading fake proof",
    strikeLevel: 4,
    applicableRoles: ["finder"],
    resolution: "7-day suspension + verification required"
  },
  {
    offense: "Impersonation",
    strikeLevel: 5,
    applicableRoles: ["finder"],
    resolution: "30-day suspension + identity verification"
  },
  {
    offense: "Offering banned/illegal items",
    strikeLevel: 5,
    applicableRoles: ["finder"],
    resolution: "30-day suspension + report to authorities"
  }
];

export class StrikeService {
  /**
   * Issue a strike to a user based on offense type
   */
  async issueStrikeByOffense(
    userId: string,
    offenseType: string,
    evidence: string,
    issuedBy: string,
    userRole: string,
    contextId?: string
  ) {
    // Find the offense definition
    const allOffenses = [...clientOffenses, ...finderOffenses];
    const offense = allOffenses.find(o => 
      o.offense === offenseType && o.applicableRoles.includes(userRole)
    );
    
    if (!offense) {
      throw new Error(`Invalid offense type "${offenseType}" for role "${userRole}"`);
    }

    // Get strike definition for this level
    const strikeDefinition = strikeDefinitions.find(s => s.level === offense.strikeLevel);
    if (!strikeDefinition) {
      throw new Error(`Invalid strike level ${offense.strikeLevel}`);
    }

    // Get current total strike count
    const currentStrikeCount = await storage.getUserTotalStrikeCount(userId);
    const newStrikeCount = currentStrikeCount + strikeDefinition.strikeIncrement;
    
    // Issue the strike
    const strike = await storage.issueStrike({
      userId,
      strikeLevel: offense.strikeLevel,
      strikeCount: strikeDefinition.strikeIncrement, // Store how many points this strike added
      offense: offense.offense,
      offenseType,
      evidence,
      issuedBy
    });

    // Apply consequences based on new total strike count
    await this.applyStrikeConsequences(
      userId, 
      newStrikeCount, 
      offense.strikeLevel,
      offense.resolution, 
      issuedBy
    );

    return {
      strike,
      currentStrikeCount: newStrikeCount,
      strikeIncrement: strikeDefinition.strikeIncrement,
      consequences: strikeDefinition,
      isBanned: newStrikeCount >= 10
    };
  }

  /**
   * Apply consequences for strike count and level
   */
  private async applyStrikeConsequences(
    userId: string,
    totalStrikeCount: number,
    strikeLevel: number,
    resolution: string,
    issuedBy: string
  ) {
    // Check if user should be banned (10+ strikes)
    if (totalStrikeCount >= 10) {
      await storage.createUserRestriction({
        userId,
        restrictionType: "banned",
        reason: `Accumulated ${totalStrikeCount} strike points - automatic ban`,
        endDate: null, // permanent
        createdBy: issuedBy
      });

      // Update user record
      await storage.updateUser(userId, {
        isBanned: true,
        bannedReason: `Automatic ban due to ${totalStrikeCount} accumulated strike points`,
        bannedAt: new Date()
      });
      return;
    }

    // Apply level-specific restrictions
    const definition = strikeDefinitions.find(s => s.level === strikeLevel);
    if (!definition || !definition.restrictionType) return;

    const endDate = definition.restrictionDuration 
      ? new Date(Date.now() + definition.restrictionDuration * 60 * 60 * 1000)
      : null;

    await storage.createUserRestriction({
      userId,
      restrictionType: definition.restrictionType,
      reason: `Level ${strikeLevel} violation: ${definition.description} (Total strikes: ${totalStrikeCount})`,
      endDate,
      createdBy: issuedBy
    });

    // Assign behavioral training for levels 2 and above
    if (strikeLevel >= 2) {
      const moduleType = strikeLevel <= 3 ? 'communication' : 'reliability';
      await storage.assignTraining({
        userId,
        moduleType
      });
    }
  }

  /**
   * Check if user has active restrictions
   */
  async getUserRestrictions(userId: string) {
    const restrictions = await storage.getUserActiveRestrictions(userId);
    const strikes = await storage.getStrikesByUserId(userId);
    const activeStrikes = strikes.filter(s => s.status === 'active');
    const totalStrikeCount = await storage.getUserTotalStrikeCount(userId);
    
    return {
      restrictions,
      activeStrikes,
      totalStrikeCount,
      strikeLevel: Math.min(Math.floor(totalStrikeCount / 2) + 1, 5), // Rough level estimation
      canPost: !restrictions.some(r => r.restrictionType === 'posting' || r.restrictionType === 'suspended' || r.restrictionType === 'banned'),
      canApply: !restrictions.some(r => r.restrictionType === 'applications' || r.restrictionType === 'suspended' || r.restrictionType === 'banned'),
      canMessage: !restrictions.some(r => r.restrictionType === 'messaging' || r.restrictionType === 'suspended' || r.restrictionType === 'banned'),
      isSuspended: restrictions.some(r => r.restrictionType === 'suspended'),
      isBanned: restrictions.some(r => r.restrictionType === 'banned') || totalStrikeCount >= 10
    };
  }

  /**
   * Submit a dispute for a strike
   */
  async submitDispute(
    userId: string,
    strikeId: string,
    description: string,
    evidence?: string
  ) {
    return await storage.createDispute({
      userId,
      strikeId,
      type: 'strike_appeal',
      description,
      evidence
    });
  }

  /**
   * Award trusted badge to user
   */
  async awardTrustedBadge(userId: string, badgeType: string) {
    // Check if user qualifies for trusted badge (total strikes < 5 and no strikes in last 90 days)
    const totalStrikeCount = await storage.getUserTotalStrikeCount(userId);
    const strikes = await storage.getStrikesByUserId(userId);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const recentStrikes = strikes.filter(s => {
      return s.createdAt && s.createdAt > ninetyDaysAgo;
    });

    if (totalStrikeCount < 5 && recentStrikes.length === 0) {
      return await storage.awardBadge({
        userId,
        badgeType
      });
    }
    
    throw new Error(`User has ${totalStrikeCount} total strikes or recent strikes within the last 90 days`);
  }

  /**
   * Get strike statistics for admin dashboard
   */
  async getStrikeStatistics() {
    const allUsers = await storage.getAllUsers();
    const stats = {
      totalUsers: allUsers.length,
      usersWithActiveStrikes: 0,
      strikeCountBreakdown: { 
        '1-2': 0, 
        '3-5': 0, 
        '6-9': 0, 
        '10+': 0 
      },
      recentStrikes: 0,
      disputesInReview: 0,
      bannedUsers: 0
    };

    // Calculate statistics
    for (const user of allUsers) {
      const totalStrikeCount = await storage.getUserTotalStrikeCount(user.id);
      if (totalStrikeCount > 0) {
        stats.usersWithActiveStrikes++;
        
        if (totalStrikeCount >= 10) {
          stats.strikeCountBreakdown['10+']++;
          stats.bannedUsers++;
        } else if (totalStrikeCount >= 6) {
          stats.strikeCountBreakdown['6-9']++;
        } else if (totalStrikeCount >= 3) {
          stats.strikeCountBreakdown['3-5']++;
        } else {
          stats.strikeCountBreakdown['1-2']++;
        }
      }
    }

    // Get recent strikes (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    for (const user of allUsers) {
      const strikes = await storage.getStrikesByUserId(user.id);
      const recentStrikes = strikes.filter(s => s.createdAt && s.createdAt > thirtyDaysAgo);
      stats.recentStrikes += recentStrikes.length;
    }

    // Get pending disputes
    const disputes = await storage.getAllDisputes();
    stats.disputesInReview = disputes.filter(d => d.status === 'pending' || d.status === 'investigating').length;

    return stats;
  }

  /**
   * Get available offense types for a role
   */
  getOffenseTypes(role: string) {
    if (role === 'client') return clientOffenses;
    if (role === 'finder') return finderOffenses;
    return [];
  }

  /**
   * Expire old strikes and restrictions (should be run as a cron job)
   */
  async cleanupExpiredData() {
    const now = new Date();
    
    // Expire old strikes (90 days)
    const allUsers = await storage.getAllUsers();
    for (const user of allUsers) {
      const strikes = await storage.getStrikesByUserId(user.id);
      for (const strike of strikes) {
        if (strike.expiresAt && strike.expiresAt <= now && strike.status === 'active') {
          await storage.updateStrike(strike.id, { status: 'expired' });
        }
      }
    }

    // Deactivate expired restrictions
    for (const user of allUsers) {
      const restrictions = await storage.getUserActiveRestrictions(user.id);
      for (const restriction of restrictions) {
        if (restriction.endDate && restriction.endDate <= now && restriction.isActive) {
          await storage.updateUserRestriction(restriction.id, { isActive: false });
        }
      }
    }
  }

  /**
   * Get strike level definitions
   */
  getStrikeLevelDefinitions() {
    return strikeDefinitions;
  }

  /**
   * Calculate user's current risk level based on strike count
   */
  getUserRiskLevel(strikeCount: number): { level: number; label: string; color: string } {
    if (strikeCount >= 10) {
      return { level: 5, label: 'Banned', color: 'red' };
    } else if (strikeCount >= 8) {
      return { level: 4, label: 'Critical Risk', color: 'red' };
    } else if (strikeCount >= 5) {
      return { level: 3, label: 'High Risk', color: 'orange' };
    } else if (strikeCount >= 3) {
      return { level: 2, label: 'Medium Risk', color: 'yellow' };
    } else if (strikeCount >= 1) {
      return { level: 1, label: 'Low Risk', color: 'blue' };
    } else {
      return { level: 0, label: 'Good Standing', color: 'green' };
    }
  }
}

export const strikeService = new StrikeService();
