import {
  type User,
  type InsertUser,
  type Finder,
  type InsertFinder,
  type Find,
  type InsertFind,
  type Proposal,
  type InsertProposal,
  type Contract,
  type InsertContract,
  type Review,
  type InsertReview,
  type Findertoken,
  type InsertFindertoken,
  type Transaction,
  type InsertTransaction,
  type AdminSetting,
  type InsertAdminSetting,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Category,
  type InsertCategory,
  type WithdrawalRequest,
  type InsertWithdrawalRequest,
  type BlogPost,
  type InsertBlogPost,
  type OrderSubmission,
  type InsertOrderSubmission,
  type FinderLevel,
  type InsertFinderLevel,
  type MonthlyTokenDistribution,
  type InsertMonthlyTokenDistribution,
  type TokenGrant,
  type InsertTokenGrant,
  type Strike,
  type InsertStrike,
  type UserRestriction,
  type InsertUserRestriction,
  type Dispute,
  type InsertDispute,
  type BehavioralTraining,
  type InsertBehavioralTraining,
  type TrustedBadge,
  type InsertTrustedBadge,
  type RestrictedWord,
  type InsertRestrictedWord,
  type TokenPackage,
  type InsertTokenPackage,
  type ClientTokenGrant,
  type InsertClientTokenGrant,
  users,
  finders,
  finds,
  proposals,
  contracts,
  reviews,
  findertokens,
  transactions,
  adminSettings,
  conversations,
  messages,
  categories,
  withdrawalSettings,
  withdrawalRequests,
  orderSubmissions,
  blogPosts,
  finderLevels,
  tokenCharges,
  monthlyTokenDistributions,
  tokenGrants,
  clientTokenGrants,
  restrictedWords,
  strikes,
  userRestrictions,
  disputes,
  behavioralTraining,
  trustedBadges,
  tokenPackages,
  supportAgents,
  supportTickets,
  supportTicketMessages,
  supportDepartments,
  contactSettings,
  faqCategories,
  userVerifications,
  type SupportAgent,
  type SupportTicket,
  type SupportTicketMessage,
  type SupportDepartment,
  type InsertSupportAgent,
  type InsertSupportTicket,
  type InsertSupportDepartment,
  type UserVerification,
  type InsertUserVerification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql as drizzleSql, sql } from "drizzle-orm";
import { generateId } from "@shared/utils";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;

  // Finder operations
  getFinder(id: string): Promise<Finder | undefined>;
  getFinderByUserId(userId: string): Promise<Finder | undefined>;
  createFinder(finder: InsertFinder): Promise<Finder>;
  updateFinder(id: string, updates: Partial<Finder>): Promise<Finder | undefined>;
  getFinderPendingEarnings(finderId: string): Promise<{ pendingAmount: number; contractCount: number; }>;
  calculateFinderProfileCompletion(finderId: string): Promise<{ completionPercentage: number; missingFields: string[]; }>;

  // Find operations
  getFind(id: string): Promise<Find | undefined>;
  getFindsByClientId(clientId: string): Promise<Find[]>;
  getAllActiveFinds(): Promise<Find[]>;
  getAllFinds(): Promise<Find[]>;
  getAvailableFindsForFinders(): Promise<Find[]>;
  getFindsForFinderByCategories(finderCategories: string[]): Promise<Find[]>;
  createFind(find: InsertFind): Promise<Find>;
  updateFind(id: string, updates: Partial<Find>): Promise<Find | undefined>;

  // Proposal operations
  getProposal(id: string): Promise<Proposal | undefined>;
  getProposalsByFindId(findId: string): Promise<Proposal[]>;
  getProposalsByFinderId(finderId: string): Promise<Proposal[]>;
  getAllProposals(): Promise<Proposal[]>;
  getProposalByFinderAndFind(finderId: string, findId: string): Promise<Proposal | undefined>;
  hasAcceptedProposal(findId: string): Promise<boolean>;
  getClientContactForAcceptedProposal(proposalId: string, finderId: string): Promise<{firstName: string, lastName: string, email: string, phone?: string} | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Contract operations
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByClientId(clientId: string): Promise<Contract[]>;
  getContractsByFinderId(finderId: string): Promise<Contract[]>;
  getContractDetails(contractId: string, finderId: string): Promise<any>;
  getCompletedContractsByFinder(finderId: string): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, updates: Partial<Contract>): Promise<Contract | undefined>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByFinderId(finderId: string): Promise<Review[]>;

  // Findertoken operations
  getFindertokenBalance(finderId: string): Promise<Findertoken | undefined>;
  createFindertokenRecord(finderId: string): Promise<Findertoken>;
  updateFindertokenBalance(finderId: string, newBalance: number): Promise<Findertoken | undefined>;
  updateFinderTokenBalance(finderId: string, newBalance: number): Promise<void>;
  syncFinderTokenBalances(): Promise<void>;

  // Transaction operations
  createTransaction(transaction: any): Promise<Transaction>;
  getTransactionsByFinderId(finderId: string): Promise<Transaction[]>;
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getTransactionByReference(reference: string): Promise<Transaction | undefined>;
  getAllTransactionsWithUsers(): Promise<any[]>;
  getAllContractsWithUsers(): Promise<any[]>;
  getAllContractsWithTransactions(): Promise<any[]>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  getAdminSettings(): Promise<{[key: string]: string}>;
  setAdminSetting(key: string, value: string): Promise<AdminSetting>;

  // Client operations
  getClientProfile(clientId: string): Promise<User | undefined>;
  deductClientFindertokens(clientId: string, amount: number, description: string): Promise<void>;
  addClientFindertokens(clientId: string, amount: number, description: string): Promise<{ success: boolean; newBalance: number; }>;
  getClientTokenBalance(clientId: string): Promise<number>;

  // Token charging
  chargeFinderTokens(finderId: string, amount: number, reason: string, chargedBy: string): Promise<boolean>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getActiveCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  // User management operations
  banUser(userId: string, reason: string): Promise<User | undefined>;
  unbanUser(userId: string): Promise<User | undefined>;
  verifyUser(userId: string): Promise<User | undefined>;
  unverifyUser(userId: string): Promise<User | undefined>;
  verifyFinder(finderId: string): Promise<Finder | null>;
  unverifyFinder(finderId: string): Promise<Finder | null>;

  // Withdrawal operations
  createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest>;
  getWithdrawalRequests(): Promise<any[]>;
  updateWithdrawalRequest(id: string, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined>;
  updateFinderBalance(finderId: string, amount: string): Promise<void>;
  releaseFundsToFinder(finderId: string, contractAmount: string): Promise<void>;
  getWithdrawalSettings(finderId: string): Promise<any>;
  updateWithdrawalSettings(finderId: string, settings: any): Promise<any>;
  getWithdrawalsByFinderId(finderId: string): Promise<WithdrawalRequest[]>;
  getPendingEarnings(finderId: string): Promise<{ netAmount: number; grossAmount: number; feeAmount: number; contractCount: number }>;

  // Messaging operations
  getConversation(clientId: string, proposalId: string): Promise<Conversation | undefined>;
  getConversationById(conversationId: string): Promise<Conversation | undefined>;
  getConversationByProposal(proposalId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsByClientId(clientId: string): Promise<Array<Conversation & {
    proposal: { request: { title: string; }; };
    finder: { user: { firstName: string; lastName: string; }; };
    lastMessage?: { content: string; createdAt: Date; senderId: string; };
    unreadCount: number;
  }>>;
  getConversationsByFinderId(finderId: string): Promise<Array<Conversation & {
    proposal: { request: { title: string; }; };
    client: { firstName: string; lastName: string; };
    lastMessage?: { content: string; createdAt: Date; senderId: string; };
    unreadCount: number;
  }>>;
  getMessages(conversationId: string): Promise<Array<Message & { sender: { firstName: string; lastName: string; }; quotedMessage?: { content: string; sender: { firstName: string; lastName: string; } } }>>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  getFinderProfile(finderId: string): Promise<any>;

  // Blog post operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Order submission operations
  createOrderSubmission(submission: InsertOrderSubmission): Promise<OrderSubmission>;
  getOrderSubmissionByContractId(contractId: string): Promise<OrderSubmission | undefined>;
  updateOrderSubmission(id: string, updates: Partial<OrderSubmission>): Promise<OrderSubmission | undefined>;
  getContractWithSubmission(contractId: string): Promise<(Contract & {orderSubmission?: OrderSubmission, finder?: any}) | undefined>;
  createOrUpdateOrderSubmission(data: {
    contractId: string;
    submissionText: string;
    attachmentPaths: string[];
    status: string;
    submittedAt: Date;
  }): Promise<OrderSubmission>;

  // Finder level operations
  getFinderLevels(): Promise<FinderLevel[]>;
  getFinderLevel(id: string): Promise<FinderLevel | undefined>;
  createFinderLevel(level: InsertFinderLevel): Promise<FinderLevel>;
  updateFinderLevel(id: string, updates: Partial<FinderLevel>): Promise<FinderLevel | undefined>;
  deleteFinderLevel(id: string): Promise<boolean>;
  calculateFinderLevel(finderId: string): Promise<FinderLevel | undefined>;
  assignFinderLevel(finderId: string, levelId: string): Promise<void>;

  // Monthly token distribution operations
  distributeMonthlyTokens(): Promise<{ distributed: number; alreadyDistributed: number; }>;
  getMonthlyDistributions(month: number, year: number): Promise<MonthlyTokenDistribution[]>;
  hasReceivedMonthlyTokens(finderId: string, month: number, year: number): Promise<boolean>;
  createMonthlyDistribution(distribution: InsertMonthlyTokenDistribution): Promise<MonthlyTokenDistribution>;

  // Token grant operations
  grantTokensToFinder(finderId: string, amount: number, reason: string, grantedBy: string): Promise<TokenGrant>;
  grantTokensToClient(userId: string, amount: number, reason: string, grantedBy: string): Promise<ClientTokenGrant>;
  getTokenGrants(userId?: string): Promise<any[]>;
  getAllFindersForTokens(): Promise<Finder[]>;

  // Strike System operations
  issueStrike(strike: InsertStrike): Promise<Strike>;
  getStrikesByUserId(userId: string): Promise<Strike[]>;
  getActiveStrikesCount(userId: string): Promise<number>;
  updateStrike(id: string, updates: Partial<Strike>): Promise<Strike | undefined>;
  getUserTotalStrikeCount(userId: string): Promise<number>;

  // User Restrictions operations
  createUserRestriction(restriction: InsertUserRestriction): Promise<UserRestriction>;
  getUserActiveRestrictions(userId: string): Promise<UserRestriction[]>;
  updateUserRestriction(id: string, updates: Partial<UserRestriction>): Promise<UserRestriction | undefined>;

  // Dispute operations
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  getDisputesByUserId(userId: string): Promise<Dispute[]>;
  getAllDisputes(): Promise<Dispute[]>;
  updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute | undefined>;

  // Behavioral Training operations
  assignTraining(training: InsertBehavioralTraining): Promise<BehavioralTraining>;
  getTrainingsByUserId(userId: string): Promise<BehavioralTraining[]>;
  updateTraining(id: string, updates: Partial<BehavioralTraining>): Promise<BehavioralTraining | undefined>;

  // Trusted Badge operations
  awardBadge(badge: InsertTrustedBadge): Promise<TrustedBadge>;
  getUserBadges(userId: string): Promise<TrustedBadge[]>;
  updateBadge(id: string, updates: Partial<TrustedBadge>): Promise<TrustedBadge | undefined>;

  // Strike System Analysis
  getUserStrikeLevel(userId: string): Promise<number>;

  // Token Package operations
  getAllTokenPackages(): Promise<TokenPackage[]>;
  getActiveTokenPackages(): Promise<TokenPackage[]>;
  getTokenPackage(id: string): Promise<TokenPackage | undefined>;
  createTokenPackage(tokenPackage: InsertTokenPackage): Promise<TokenPackage>;
  updateTokenPackage(id: string, updates: Partial<TokenPackage>): Promise<TokenPackage | undefined>;
  deleteTokenPackage(id: string): Promise<boolean>;

  // Restricted Words Management
  addRestrictedWord(word: InsertRestrictedWord): Promise<RestrictedWord>;
  getRestrictedWords(): Promise<RestrictedWord[]>;
  removeRestrictedWord(id: string): Promise<boolean>;
  updateRestrictedWord(id: string, updates: Partial<RestrictedWord>): Promise<RestrictedWord | undefined>;
  checkContentForRestrictedWords(content: string): Promise<string[]>;

  // Support Agent Management
  createSupportAgent(data: InsertSupportAgent & { agentId: string }): Promise<SupportAgent>;
  getSupportAgents(): Promise<Array<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } }>>;
  getSupportAgent(id: string): Promise<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } } | undefined>;
  updateSupportAgent(id: string, data: Partial<InsertSupportAgent>): Promise<SupportAgent | undefined>;
  suspendSupportAgent(id: string, reason: string): Promise<SupportAgent | undefined>;
  reactivateSupportAgent(id: string): Promise<SupportAgent | undefined>;
  deleteSupportAgent(id: string): Promise<boolean>;
  generateAgentId(): Promise<string>;

  // Support Department Management
  getSupportDepartments(): Promise<Array<SupportDepartment & { isActive: boolean; name: string; }>>;
  createSupportDepartment(data: InsertSupportDepartment): Promise<SupportDepartment>;
  updateSupportDepartment(id: string, data: Partial<InsertSupportDepartment>): Promise<SupportDepartment | undefined>;
  deleteSupportDepartment(id: string): Promise<boolean>;

  // Support Agent Check
  getUserSupportAgent(userId: string): Promise<SupportAgent | undefined>;

  // Generate withdrawal request ID
  generateWithdrawalRequestId(): Promise<string>;

  // Contact Settings operations
  getContactSettings(): Promise<any>;
  updateContactSettings(settings: any): Promise<any>;

  // FAQ Categories operations
  getFAQCategories(): Promise<any[]>;
  getFAQCategory(id: string): Promise<any>;
  createFAQCategory(category: any): Promise<any>;
  updateFAQCategory(id: string, updates: any): Promise<any>;
  deleteFAQCategory(id: string): Promise<boolean>;

  // User Verification operations
  submitVerification(verification: any): Promise<any>;
  getVerificationByUserId(userId: string): Promise<any>;
  getPendingVerifications(): Promise<any[]>;
  updateVerificationStatus(id: string, status: string, reviewedBy: string, rejectionReason?: string): Promise<any>;
  getVerificationById(id: string): Promise<any>;
  isVerificationRequired(): Promise<boolean>;

  // Support Ticket operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets(filters?: { status?: string; department?: string; assignedTo?: string; priority?: string }): Promise<Array<SupportTicket & { submitter?: { firstName: string; lastName: string; email: string; }; assignedAgent?: { agentId: string; user: { firstName: string; lastName: string; } }; }>>;
  getSupportTicket(id: string): Promise<SupportTicket & { submitter?: { firstName: string; lastName: string; email: string; }; assignedAgent?: { agentId: string; user: { firstName: string; lastName: string; } }; } | undefined>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: string): Promise<boolean>;
  generateTicketNumber(): Promise<string>;

  // Support Ticket Message operations
  createSupportTicketMessage(message: { ticketId: string; senderId?: string; senderType: string; senderName: string; senderEmail?: string; content: string; attachments?: string[]; isInternal?: boolean; }): Promise<SupportTicketMessage>;
  getSupportTicketMessages(ticketId: string): Promise<Array<SupportTicketMessage & { sender?: { firstName: string; lastName: string; } }>>;
  markTicketMessageAsRead(messageId: string): Promise<void>;

  // New method for proposals
  getProposalsForClient(clientId: string): Promise<Proposal[]>;
  getProposalWithDetails(id: string): Promise<any>;

  // Conversation methods
  getConversationByProposal(proposalId: string): Promise<any>;
  createConversation(data: { clientId: string; finderId: string; proposalId: string }): Promise<any>;
}

class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  // Finder operations
  async getFinder(id: string): Promise<Finder | undefined> {
    const result = await db.select().from(finders).where(eq(finders.id, id)).limit(1);
    return result[0];
  }

  async getFinderByUserId(userId: string): Promise<Finder | undefined> {
    const result = await db.select().from(finders).where(eq(finders.userId, userId)).limit(1);
    return result[0];
  }

  async createFinder(finder: InsertFinder): Promise<Finder> {
    const result = await db.insert(finders).values(finder).returning();
    return result[0];
  }

  async updateFinder(id: string, updates: Partial<Finder>): Promise<Finder | undefined> {
    const result = await db.update(finders).set(updates).where(eq(finders.id, id)).returning();
    return result[0];
  }

  async getFinderPendingEarnings(finderId: string): Promise<{ pendingAmount: number; contractCount: number; }> {
    // Implementation for pending earnings calculation
    return { pendingAmount: 0, contractCount: 0 };
  }

  async calculateFinderProfileCompletion(finderId: string): Promise<{ completionPercentage: number; missingFields: string[]; }> {
    // Implementation for profile completion calculation
    return { completionPercentage: 100, missingFields: [] };
  }

  // Find operations
  async getFind(id: string): Promise<Find | undefined> {
    const result = await db.select().from(finds).where(eq(finds.id, id)).limit(1);
    return result[0];
  }

  async getFindsByClientId(clientId: string): Promise<Find[]> {
    return await db.select().from(finds).where(eq(finds.clientId, clientId));
  }

  async getAllActiveFinds(): Promise<Find[]> {
    return await db.select().from(finds).where(eq(finds.status, 'open'));
  }

  async getAllFinds(): Promise<Find[]> {
    return await db.select().from(finds);
  }

  async getAvailableFindsForFinders(): Promise<Find[]> {
    return await db.select().from(finds)
      .where(eq(finds.status, 'open'))
      .orderBy(
        sql`CASE WHEN ${finds.isBoosted} = true AND ${finds.boostExpiresAt} > NOW() THEN ${finds.boostAmount} ELSE 0 END DESC`,
        desc(finds.createdAt)
      );
  }

  async getFindsForFinderByCategories(finderCategories: string[]): Promise<Find[]> {
    const allFinds = await db.select().from(finds)
      .where(eq(finds.status, 'open'))
      .orderBy(desc(finds.isBoosted), desc(finds.boostAmount), desc(finds.createdAt));

    // Separate finds by category match
    const matchingFinds = allFinds.filter(find =>
      finderCategories.some(category =>
        find.category.toLowerCase() === category.toLowerCase()
      )
    );

    const otherFinds = allFinds.filter(find =>
      !finderCategories.some(category =>
        find.category.toLowerCase() === category.toLowerCase()
      )
    );

    // Return matching categories first, then others
    return [...matchingFinds, ...otherFinds];
  }

  async createFind(find: InsertFind): Promise<Find> {
    const result = await db.insert(finds).values(find).returning();
    return result[0];
  }

  async updateFind(id: string, updates: Partial<Find>): Promise<Find | undefined> {
    const result = await db.update(finds).set(updates).where(eq(finds.id, id)).returning();
    return result[0];
  }

  // Proposal operations
  async getProposal(id: string): Promise<Proposal | undefined> {
    const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
    return result[0];
  }

  async getProposalsByFindId(findId: string): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.findId, findId));
  }

  async getProposalsByFinderId(finderId: string): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.finderId, finderId));
  }

  async getAllProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals);
  }

  async getProposalByFinderAndFind(finderId: string, findId: string): Promise<Proposal | undefined> {
    const result = await db.select().from(proposals)
      .where(and(eq(proposals.finderId, finderId), eq(proposals.findId, findId)))
      .limit(1);
    return result[0];
  }

  async hasAcceptedProposal(findId: string): Promise<boolean> {
    const result = await db.select().from(proposals)
      .where(and(eq(proposals.findId, findId), eq(proposals.status, 'accepted')))
      .limit(1);
    return result.length > 0;
  }

  async getClientContactForAcceptedProposal(proposalId: string, finderId: string): Promise<{firstName: string, lastName: string, email: string, phone?: string} | undefined> {
    // Implementation for getting client contact details
    return undefined;
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const result = await db.insert(proposals).values(proposal).returning();
    return result[0];
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const result = await db.update(proposals).set(updates).where(eq(proposals.id, id)).returning();
    return result[0];
  }

  // Contract operations
  async getContract(id: string): Promise<Contract | undefined> {
    const result = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
    return result[0];
  }

  async getContractsByClientId(clientId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.clientId, clientId));
  }

  async getContractsByFinderId(finderId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.finderId, finderId));
  }

  async getContractDetails(contractId: string, finderId: string): Promise<any> {
    const result = await db
      .select({
        id: contracts.id,
        findId: contracts.findId,
        proposalId: contracts.proposalId,
        clientId: contracts.clientId,
        finderId: contracts.finderId,
        amount: contracts.amount,
        escrowStatus: contracts.escrowStatus,
        isCompleted: contracts.isCompleted,
        hasSubmission: contracts.hasSubmission,
        createdAt: contracts.createdAt,
        completedAt: contracts.completedAt,
        request: {
          title: finds.title,
          description: finds.description,
          category: finds.category,
          timeframe: finds.timeframe
        }
      })
      .from(contracts)
      .innerJoin(finds, eq(contracts.findId, finds.id))
      .where(and(eq(contracts.id, contractId), eq(contracts.finderId, finderId)))
      .limit(1);

    return result[0];
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const result = await db.insert(contracts).values(contract).returning();
    return result[0];
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | undefined> {
    const result = await db.update(contracts).set(updates).where(eq(contracts.id, id)).returning();
    return result[0];
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async getReviewsByFinderId(finderId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.finderId, finderId));
  }

  // Findertoken operations
  async getFindertokenBalance(finderId: string): Promise<Findertoken | undefined> {
    const result = await db.select().from(findertokens).where(eq(findertokens.finderId, finderId)).limit(1);
    return result[0];
  }

  async createFindertokenRecord(finderId: string): Promise<Findertoken> {
    const result = await db.insert(findertokens).values({ finderId, balance: 0 }).returning();
    return result[0];
  }

  async updateFindertokenBalance(finderId: string, newBalance: number): Promise<Findertoken | undefined> {
    const result = await db.update(findertokens).set({ balance: newBalance }).where(eq(findertokens.finderId, finderId)).returning();
    return result[0];
  }

  async updateFinderTokenBalance(finderId: string, newBalance: number): Promise<void> {
    await db.update(finders).set({ findertokenBalance: newBalance }).where(eq(finders.id, finderId));
  }

  async syncFinderTokenBalances(): Promise<void> {
    try {
      // Get all finders
      const allFinders = await db.select().from(finders);

      for (const finder of allFinders) {
        // Calculate balance from transactions
        const transactions = await db.select()
          .from(transactions)
          .where(eq(transactions.finderId, finder.id));

        const calculatedBalance = transactions.reduce((sum, transaction) => {
          return sum + transaction.amount;
        }, 0);

        // Update finder balance if different
        if (finder.findertokenBalance !== calculatedBalance) {
          await db.update(finders)
            .set({ findertokenBalance: calculatedBalance })
            .where(eq(finders.id, finder.id));
        }
      }
    } catch (error) {
      console.error('Error syncing finder token balances:', error);
      throw error;
    }
  }

  // Transaction operations
  async createTransaction(transaction: any): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async getTransactionsByFinderId(finderId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.finderId, finderId));
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionByReference(reference: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.reference, reference)).limit(1);
    return result[0];
  }

  async getAllTransactionsWithUsers(): Promise<any[]> {
    return [];
  }

  async getAllContractsWithUsers() {
    const contracts = await db.select().from(contracts);

    const contractsWithDetails = await Promise.all(
      contracts.map(async (contract) => {
        const client = await this.getUser(contract.clientId);
        const finder = await this.getFinder(contract.finderId);
        const finderUser = finder ? await this.getUser(finder.userId) : null;
        const proposal = await this.getProposal(contract.proposalId);
        const find = proposal ? await this.getFind(proposal.findId) : null;

        return {
          ...contract,
          clientName: client ? `${client.firstName} ${client.lastName}` : null,
          finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : null,
          findTitle: find?.title || null,
        };
      })
    );

    return contractsWithDetails;
  }

  async getAllContractsWithTransactions() {
    const contracts = await db.select().from(contracts);

    const contractsWithDetails = await Promise.all(
      contracts.map(async (contract) => {
        const client = await this.getUser(contract.clientId);
        const finder = await this.getFinder(contract.finderId);
        const finderUser = finder ? await this.getUser(finder.userId) : null;
        const proposal = await this.getProposal(contract.proposalId);
        const find = proposal ? await this.getFind(proposal.findId) : null;

        // Get transaction with payment reference for this contract
        const transactions = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, contract.clientId),
              eq(transactions.type, 'contract_payment')
            )
          )
          .orderBy(desc(transactions.createdAt))
          .limit(10);

        // Find the transaction that matches this contract amount
        const contractTransaction = transactions.find(
          t => parseFloat(t.amount.toString()) === parseFloat(contract.amount)
        );

        return {
          ...contract,
          clientName: client ? `${client.firstName} ${client.lastName}` : null,
          finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : null,
          findTitle: find?.title || null,
          paymentReference: contractTransaction?.reference || null,
          transactionId: contractTransaction?.id || null,
        };
      })
    );

    return contractsWithDetails;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    const result = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
    return result[0];
  }

  async getAdminSettings(): Promise<{[key: string]: string}> {
    const settings = await db.select().from(adminSettings);
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as {[key: string]: string});
  }

  async setAdminSetting(key: string, value: string): Promise<AdminSetting> {
    const result = await db.insert(adminSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: adminSettings.key, set: { value } })
      .returning();
    return result[0];
  }

  // Client operations
  async getClientProfile(clientId: string): Promise<User | undefined> {
    return this.getUser(clientId);
  }

  async deductClientFindertokens(clientId: string, amount: number, description: string): Promise<void> {
    try {
      // Check current balance
      const currentBalance = await this.getClientTokenBalance(clientId);
      if (currentBalance < amount) {
        throw new Error(`Insufficient tokens. Required: ${amount}, Available: ${currentBalance}`);
      }

      // Create negative grant to deduct tokens
      await db.insert(clientTokenGrants).values({
        clientId: clientId,
        amount: -amount, // Negative amount for deduction
        reason: description,
        grantedBy: clientId // Self-deduction
      });

      // Create transaction record
      await db.insert(transactions).values({
        userId: clientId,
        amount: -amount,
        type: 'find_posting',
        description: description
      });
    } catch (error) {
      console.error('Error deducting client findertokens:', error);
      throw error;
    }
  }

  async addClientFindertokens(clientId: string, amount: number, description: string): Promise<{ success: boolean; newBalance: number; }> {
    try {
      // Add tokens to clientTokenGrants table
      await db.insert(clientTokenGrants).values({
        clientId: clientId,
        amount: amount,
        reason: description,
        grantedBy: clientId // Self-grant for purchases
      });

      // Calculate new balance by summing all grants for this client
      const newBalance = await this.getClientTokenBalance(clientId);

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error adding client findertokens:', error);
      return { success: false, newBalance: 0 };
    }
  }

  async getClientTokenBalance(clientId: string): Promise<number> {
    try {
      const grants = await db.select().from(clientTokenGrants).where(eq(clientTokenGrants.clientId, clientId));
      return grants.reduce((total, grant) => total + grant.amount, 0);
    } catch (error) {
      console.error('Error getting client token balance:', error);
      return 0;
    }
  }

  // Token charging
  async chargeFinderTokens(finderId: string, amount: number, reason: string, chargedBy: string): Promise<boolean> {
    // Implementation for charging finder tokens
    return true;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(desc(categories.createdAt));
  }

  async getActiveCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined> {
    const result = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // User management operations
  async banUser(userId: string, reason: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ isBanned: true, bannedReason: reason, bannedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async unbanUser(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ isBanned: false, bannedReason: null, bannedAt: null })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async verifyUser(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async unverifyUser(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ isVerified: false })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async verifyFinder(finderId: string): Promise<Finder | null> {
    const result = await db.update(finders)
      .set({ isVerified: true })
      .where(eq(finders.id, finderId))
      .returning();
    return result[0] || null;
  }

  async unverifyFinder(finderId: string): Promise<Finder | null> {
    const result = await db.update(finders)
      .set({ isVerified: false })
      .where(eq(finders.id, finderId))
      .returning();
    return result[0] || null;
  }

  // Withdrawal operations
  async createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const result = await db.insert(withdrawalRequests).values(request).returning();
    return result[0];
  }

  async getWithdrawalRequests(): Promise<any[]> {
    return [];
  }

  async updateWithdrawalRequest(id: string, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined> {
    const result = await db.update(withdrawalRequests).set(updates).where(eq(withdrawalRequests.id, id)).returning();
    return result[0];
  }

  async updateFinderBalance(finderId: string, amount: string): Promise<void> {
    await db.update(finders).set({ availableBalance: amount }).where(eq(finders.id, finderId));
  }

  async releaseFundsToFinder(finderId: string, amount: string): Promise<void> {
    console.log(`Releasing funds to finder ${finderId}: ${amount}`);

    const finder = await this.getFinder(finderId);
    if (!finder) {
      throw new Error('Finder not found');
    }

    // Parse the contract amount - it might be a decimal string
    const releaseAmount = parseFloat(amount);

    if (isNaN(releaseAmount) || releaseAmount <= 0) {
      throw new Error(`Invalid release amount: ${amount}`);
    }

    const currentAvailable = parseFloat(finder.availableBalance || '0');
    const currentTotal = parseFloat(finder.totalEarned || '0');
    const newAvailable = currentAvailable + releaseAmount;
    const newTotal = currentTotal + releaseAmount;

    console.log(`Finder ${finderId} - Current available: ${currentAvailable}, releasing: ${releaseAmount}, new available: ${newAvailable}`);

    // Update finder balance with explicit values
    const updateResult = await db
      .update(finders)
      .set({
        availableBalance: newAvailable.toFixed(2),
        totalEarned: newTotal.toFixed(2),
        jobsCompleted: sql`COALESCE(${finders.jobsCompleted}, 0) + 1`
      })
      .where(eq(finders.id, finderId))
      .returning();

    if (!updateResult || updateResult.length === 0) {
      throw new Error('Failed to update finder balance');
    }

    console.log(`Database update result:`, updateResult[0]);

    // Create transaction record for the release
    await this.createTransaction({
      userId: finder.userId,
      finderId: finderId,
      type: 'earnings_release',
      amount: releaseAmount,
      description: `Earnings released to available balance: ₦${releaseAmount.toFixed(2)}`
    });

    // Verify the update
    const updatedFinder = await this.getFinder(finderId);
    console.log(`Funds released successfully. Verified balance: ${updatedFinder?.availableBalance}`);
  }

  async getWithdrawalSettings(finderId: string): Promise<any> {
    try {
      // Check if we have a withdrawal_settings table first (from the exports we can see it exists)
      const existingSettings = await db.query.withdrawalSettings?.findFirst({
        where: eq(withdrawalSettings.finderId, finderId)
      });

      if (existingSettings) {
        let bankDetails = {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          routingNumber: ""
        };

        if (existingSettings.bankDetails) {
          try {
            bankDetails = typeof existingSettings.bankDetails === 'string'
              ? JSON.parse(existingSettings.bankDetails)
              : existingSettings.bankDetails;
          } catch (error) {
            console.error('Error parsing bank details:', error);
          }
        }

        return {
          paymentMethod: existingSettings.paymentMethod || "bank_transfer",
          minimumThreshold: existingSettings.minimumThreshold || 50,
          bankDetails: bankDetails
        };
      }
    } catch (error) {
      console.log('Withdrawal settings table not found, trying fallback method');
    }

    // Fallback: Try to get bank details from recent withdrawals
    const recentWithdrawals = await db
      .select()
      .from(withdrawalRequests)
      .where(eq(withdrawalRequests.finderId, finderId))
      .orderBy(sql`${withdrawalRequests.requestedAt} DESC`)
      .limit(1);

    let bankDetails = {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      routingNumber: ""
    };

    if (recentWithdrawals.length > 0 && recentWithdrawals[0].paymentDetails) {
      try {
        const paymentDetails = typeof recentWithdrawals[0].paymentDetails === 'string'
          ? JSON.parse(recentWithdrawals[0].paymentDetails)
          : recentWithdrawals[0].paymentDetails;

        bankDetails = {
          bankName: paymentDetails.bankName || "",
          accountNumber: paymentDetails.accountNumber || "",
          accountHolder: paymentDetails.accountHolder || paymentDetails.accountName || "",
          routingNumber: paymentDetails.routingNumber || ""
        };
      } catch (error) {
        console.error('Error parsing payment details:', error);
      }
    }

    return {
      paymentMethod: "bank_transfer",
      minimumThreshold: 50,
      bankDetails: bankDetails
    };
  }

  async updateWithdrawalSettings(finderId: string, settings: any): Promise<any> {
    console.log('Storage: Updating withdrawal settings for finder:', finderId);
    console.log('Storage: Settings data:', JSON.stringify(settings, null, 2));

    try {
      // Validate settings structure
      if (!settings.bankDetails || !settings.bankDetails.bankName || !settings.bankDetails.accountNumber || !settings.bankDetails.accountHolder) {
        throw new Error('Invalid bank details: bankName, accountNumber, and accountHolder are required');
      }

      // Use upsert pattern with ON CONFLICT
      const settingsData = {
        finderId,
        paymentMethod: settings.paymentMethod || 'bank_transfer',
        minimumThreshold: settings.minimumThreshold || 50,
        bankDetails: JSON.stringify(settings.bankDetails),
        updatedAt: new Date().toISOString()
      };

      // First try to find existing settings
      const existing = await db
        .select()
        .from(withdrawalSettings)
        .where(eq(withdrawalSettings.finderId, finderId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        const result = await db
          .update(withdrawalSettings)
          .set(settingsData)
          .where(eq(withdrawalSettings.finderId, finderId))
          .returning();

        console.log('Storage: Updated existing settings:', result[0]);
        return result[0];
      } else {
        // Insert new
        const result = await db
          .insert(withdrawalSettings)
          .values(settingsData)
          .returning();

        console.log('Storage: Created new settings:', result[0]);
        return result[0];
      }
    } catch (error: any) {
      console.error('Storage: Error updating withdrawal settings:', error);
      throw error;
    }
  }

  async getWithdrawalsByFinderId(finderId: string): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.finderId, finderId));
  }

  async getCompletedContractsByFinder(finderId: string): Promise<Contract[]> {
    return await db.select().from(contracts)
      .where(and(eq(contracts.finderId, finderId), eq(contracts.isCompleted, true)));
  }

  async getPendingEarnings(finderId: string): Promise<{ netAmount: number; grossAmount: number; feeAmount: number; contractCount: number }> {
    // Get all completed contracts that haven't been released yet
    const pendingContracts = await db
      .select()
      .from(contracts)
      .where(
        and(
          eq(contracts.finderId, finderId),
          eq(contracts.isCompleted, true),
          eq(contracts.escrowStatus, 'funded') // Completed but not released
        )
      );

    // Get platform fee percentage
    const feePercentageSetting = await this.getAdminSetting('finder_earnings_charge_percentage');
    const feePercentage = parseFloat(feePercentageSetting || '5'); // Default 5%

    let grossAmount = 0;
    let feeAmount = 0;

    pendingContracts.forEach(contract => {
      const amount = parseFloat(contract.amount);
      grossAmount += amount;
      feeAmount += (amount * feePercentage) / 100;
    });

    const netAmount = grossAmount - feeAmount;

    return {
      grossAmount,
      feeAmount,
      netAmount,
      contractCount: pendingContracts.length
    };
  }


  async getConversation(clientId: string, proposalId: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations)
      .where(and(eq(conversations.clientId, clientId), eq(conversations.proposalId, proposalId)))
      .limit(1);
    return result[0];
  }

  async getConversationById(conversationId: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    return result[0];
  }

  async getConversationByProposal(proposalId: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations)
      .where(eq(conversations.proposalId, proposalId))
      .limit(1);
    return result[0];
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async getConversationsByClientId(clientId: string): Promise<any[]> {
    return await db.select({
      id: conversations.id,
      clientId: conversations.clientId,
      finderId: conversations.finderId,
      proposalId: conversations.proposalId,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
      proposal: {
        request: {
          title: finds.title
        }
      },
      finder: {
        user: {
          firstName: users.firstName,
          lastName: users.lastName
        }
      }
    })
    .from(conversations)
    .innerJoin(proposals, eq(conversations.proposalId, proposals.id))
    .innerJoin(finds, eq(proposals.findId, finds.id))
    .innerJoin(finders, eq(conversations.finderId, finders.id))
    .innerJoin(users, eq(finders.userId, users.id))
    .where(eq(conversations.clientId, clientId))
    .orderBy(desc(conversations.lastMessageAt));
  }

  async getConversationsByFinderId(finderId: string): Promise<any[]> {
    return await db.select({
      id: conversations.id,
      clientId: conversations.clientId,
      finderId: conversations.finderId,
      proposalId: conversations.proposalId,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
      proposal: {
        request: {
          title: finds.title
        }
      },
      client: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(conversations)
    .innerJoin(proposals, eq(conversations.proposalId, proposals.id))
    .innerJoin(finds, eq(proposals.findId, finds.id))
    .innerJoin(users, eq(conversations.clientId, users.id))
    .where(eq(conversations.finderId, finderId))
    .orderBy(desc(conversations.lastMessageAt));
  }

  async getMessages(conversationId: string): Promise<any[]> {
    return await db.select({
      id: messages.id,
      conversationId: messages.conversationId,
      senderId: messages.senderId,
      content: messages.content,
      attachmentPaths: messages.attachmentPaths,
      attachmentNames: messages.attachmentNames,
      quotedMessageId: messages.quotedMessageId,
      createdAt: messages.createdAt,
      sender: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();

    // Update last message timestamp
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));

    return result[0];
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    // Implementation for marking messages as read would depend on your read status tracking
    // For now, this is a placeholder
  }
  async getFinderProfile(finderId: string): Promise<any> { return null; }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return undefined;
    }
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return undefined;
    }
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const result = await db.insert(blogPosts).values({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    try {
      console.log('Storage: Updating blog post with ID:', id);
      console.log('Storage: Updates:', updates);

      // First check if the blog post exists
      const existing = await this.getBlogPost(id);
      if (!existing) {
        console.log('Storage: Blog post not found for update:', id);
        return undefined;
      }

      const result = await db.update(blogPosts)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(blogPosts.id, id))
        .returning();

      console.log('Storage: Blog post update result:', result);
      return result[0];
    } catch (error) {
      console.error('Error updating blog post:', error);
      return undefined;
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      console.log('Storage: Attempting to delete blog post with ID:', id);

      // First check if the blog post exists
      const existing = await this.getBlogPost(id);
      if (!existing) {
        console.log('Storage: Blog post not found for deletion:', id);
        return false;
      }

      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      console.log('Storage: Blog post delete result:', result);
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  // Order submission operations
  async createOrderSubmission(submission: InsertOrderSubmission): Promise<OrderSubmission> {
    const result = await db.insert(orderSubmissions).values(submission).returning();

    // Update the contract's hasSubmission field to true
    await db.update(contracts)
      .set({ hasSubmission: true })
      .where(eq(contracts.id, submission.contractId));

    return result[0];
  }
  async getOrderSubmissionByContractId(contractId: string): Promise<OrderSubmission | undefined> {
    const submissions = await db
      .select()
      .from(orderSubmissions)
      .where(eq(orderSubmissions.contractId, contractId))
      .limit(1);

    return submissions[0] || null;
  }
  async updateOrderSubmission(id: string, updates: Partial<OrderSubmission>): Promise<OrderSubmission | undefined> {
    const result = await db.update(orderSubmissions).set(updates).where(eq(orderSubmissions.id, id)).returning();
    return result[0];
  }
  async getContractWithSubmission(contractId: string): Promise<(Contract & {orderSubmission?: OrderSubmission, finder?: any}) | undefined> {
    const contractResult = await db.select().from(contracts).where(eq(contracts.id, contractId)).limit(1);
    if (!contractResult[0]) return undefined;

    const contract = contractResult[0];

    // Get order submission if exists
    const orderSubmission = await this.getOrderSubmissionByContractId(contractId);

    // Get finder details
    const finder = await this.getFinder(contract.finderId);

    return {
      ...contract,
      orderSubmission,
      finder
    };
  }

  async createOrUpdateOrderSubmission(data: {
    contractId: string;
    finderId: string;
    submissionText: string;
    attachmentPaths: string[];
    status: string;
    submittedAt: Date;
  }) {
    // Check if submission already exists
    const existing = await this.getOrderSubmissionByContractId(data.contractId);

    if (existing) {
      // Update existing submission
      const updated = await db
        .update(orderSubmissions)
        .set({
          submissionText: data.submissionText,
          attachmentPaths: data.attachmentPaths,
          status: data.status,
          submittedAt: data.submittedAt
        })
        .where(eq(orderSubmissions.contractId, data.contractId))
        .returning();

      return updated[0];
    } else {
      // Create new submission
      const created = await db
        .insert(orderSubmissions)
        .values({
          contractId: data.contractId,
          finderId: data.finderId,
          submissionText: data.submissionText,
          attachmentPaths: data.attachmentPaths,
          status: data.status,
          submittedAt: data.submittedAt,
          autoReleaseDate: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
        })
        .returning();

      return created[0];
    }
  }

  // Finder level operations
  async getFinderLevels(): Promise<FinderLevel[]> {
    return await db.select().from(finderLevels).orderBy(asc(finderLevels.order));
  }
  async getFinderLevel(id: string): Promise<FinderLevel | undefined> {
    const result = await db.select().from(finderLevels).where(eq(finderLevels.id, id)).limit(1);
    return result[0];
  }
  async createFinderLevel(level: InsertFinderLevel): Promise<FinderLevel> {
    const result = await db.insert(finderLevels).values(level).returning();
    return result[0];
  }
  async updateFinderLevel(id: string, updates: Partial<FinderLevel>): Promise<FinderLevel | undefined> {
    const result = await db.update(finderLevels).set(updates).where(eq(finderLevels.id, id)).returning();
    return result[0];
  }
  async deleteFinderLevel(id: string): Promise<boolean> {
    try {
      const result = await db.delete(finderLevels).where(eq(finderLevels.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting finder level:', error);
      return false;
    }
  }
  async calculateFinderLevel(finderId: string): Promise<FinderLevel | undefined> {
    // Implementation to calculate finder level based on various metrics
    return undefined;
  }
  async assignFinderLevel(finderId: string, levelId: string): Promise<void> {
    // Implementation to assign a finder level
  }

  // Monthly token distribution operations
  async distributeMonthlyTokens(): Promise<{ distributed: number; alreadyDistributed: number; }> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const monthlyTokenAmount = 20; // Standard monthly token grant

      // Get all active finders
      const allFinders = await db.select().from(finders);

      let distributed = 0;
      let alreadyDistributed = 0;

      for (const finder of allFinders) {
        // Check if finder already received tokens this month
        const hasReceived = await this.hasReceivedMonthlyTokens(finder.id, currentMonth, currentYear);

        if (!hasReceived) {
          // Update finder balance
          const currentBalance = finder.findertokenBalance || 0;
          await db.update(finders)
            .set({ findertokenBalance: currentBalance + monthlyTokenAmount })
            .where(eq(finders.id, finder.id));

          // Create distribution record
          await db.insert(monthlyTokenDistributions).values({
            finderId: finder.id,
            month: currentMonth,
            year: currentYear,
            tokensGranted: monthlyTokenAmount,
            distributedAt: new Date()
          });

          // Create transaction record
          await db.insert(transactions).values({
            userId: finder.userId,
            finderId: finder.id,
            amount: monthlyTokenAmount,
            type: 'monthly_distribution',
            description: `Monthly token distribution: ${monthlyTokenAmount} tokens for ${currentMonth}/${currentYear}`
          });

          distributed++;
        } else {
          alreadyDistributed++;
        }
      }

      return { distributed, alreadyDistributed };
    } catch (error) {
      console.error('Error distributing monthly tokens:', error);
      throw error;
    }
  }

  async getMonthlyDistributions(month: number, year: number): Promise<MonthlyTokenDistribution[]> {
    try {
      return await db.select({
        id: monthlyTokenDistributions.id,
        finderId: monthlyTokenDistributions.finderId,
        month: monthlyTokenDistributions.month,
        year: monthlyTokenDistributions.year,
        tokensGranted: monthlyTokenDistributions.tokensGranted,
        distributedAt: monthlyTokenDistributions.distributedAt,
        finder: {
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
          }
        }
      })
      .from(monthlyTokenDistributions)
      .innerJoin(finders, eq(monthlyTokenDistributions.finderId, finders.id))
      .innerJoin(users, eq(finders.userId, users.id))
      .where(and(
        eq(monthlyTokenDistributions.month, month),
        eq(monthlyTokenDistributions.year, year)
      ))
      .orderBy(desc(monthlyTokenDistributions.distributedAt)) as any;
    } catch (error) {
      console.error('Error fetching monthly distributions:', error);
      return [];
    }
  }

  async hasReceivedMonthlyTokens(finderId: string, month: number, year: number): Promise<boolean> {
    try {
      const result = await db.select()
        .from(monthlyTokenDistributions)
        .where(and(
          eq(monthlyTokenDistributions.finderId, finderId),
          eq(monthlyTokenDistributions.month, month),
          eq(monthlyTokenDistributions.year, year)
        ))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      console.error('Error checking monthly tokens:', error);
      return false;
    }
  }

  async createMonthlyDistribution(distribution: InsertMonthlyTokenDistribution): Promise<MonthlyTokenDistribution> {
    const result = await db.insert(monthlyTokenDistributions).values(distribution).returning();
    return result[0];
  }

  // Token grant operations
  async grantTokensToFinder(finderId: string, amount: number, reason: string, grantedBy: string): Promise<TokenGrant> {
    // Update finder balance
    await db.update(finders)
      .set({
        findertokenBalance: sql`${finders.findertokenBalance} + ${amount}`
      })
      .where(eq(finders.id, finderId));

    // Create grant record
    const [grant] = await db.insert(tokenGrants).values({
      finderId,
      amount,
      reason,
      grantedBy
    }).returning();

    // Create transaction record
    await db.insert(transactions).values({
      userId: (await db.select({ userId: finders.userId }).from(finders).where(eq(finders.id, finderId)))[0].userId,
      finderId,
      amount,
      type: 'findertoken_grant',
      description: `Token grant: ${reason}`,
    });

    return grant;
  }

  async grantTokensToClient(clientId: string, amount: number, reason: string, grantedBy: string) {
    // Update client balance
    await db.update(users)
      .set({
        findertokenBalance: sql`${users.findertokenBalance} + ${amount}`
      })
      .where(eq(users.id, clientId));

    // Create client grant record
    const [grant] = await db.insert(clientTokenGrants).values({
      clientId,
      amount,
      reason,
      grantedBy
    }).returning();

    // Create transaction record
    await db.insert(transactions).values({
      userId: clientId,
      amount,
      type: 'findertoken_grant',
      description: `Token grant: ${reason}`,
    });

    return grant;
  }
  async getTokenGrants(userId?: string) {
    // Get finder grants
    let finderQuery = db
      .select({
        id: tokenGrants.id,
        finderId: tokenGrants.finderId,
        userId: finders.userId,
        userType: sql<'finder'>`'finder'`,
        amount: tokenGrants.amount,
        reason: tokenGrants.reason,
        grantedBy: tokenGrants.grantedBy,
        createdAt: tokenGrants.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        grantedByUser: {
          firstName: grantedByUsers.firstName,
          lastName: grantedByUsers.lastName,
        },
      })
      .from(tokenGrants)
      .leftJoin(finders, eq(tokenGrants.finderId, finders.id))
      .leftJoin(users, eq(finders.userId, users.id))
      .leftJoin(grantedByUsers, eq(tokenGrants.grantedBy, grantedByUsers.id));

    // Get client grants
    let clientQuery = db
      .select({
        id: clientTokenGrants.id,
        finderId: sql<string | null>`null`,
        userId: clientTokenGrants.clientId,
        userType: sql<'client'>`'client'`,
        amount: clientTokenGrants.amount,
        reason: clientTokenGrants.reason,
        grantedBy: clientTokenGrants.grantedBy,
        createdAt: clientTokenGrants.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        grantedByUser: {
          firstName: grantedByUsers.firstName,
          lastName: grantedByUsers.lastName,
        },
      })
      .from(clientTokenGrants)
      .leftJoin(users, eq(clientTokenGrants.clientId, users.id))
      .leftJoin(grantedByUsers, eq(clientTokenGrants.grantedBy, grantedByUsers.id));

    if (userId) {
      finderQuery = finderQuery.where(eq(finders.userId, userId));
      clientQuery = clientQuery.where(eq(users.id, userId));
    }

    // Execute both queries and combine results
    const [finderGrants, clientGrants] = await Promise.all([
      finderQuery,
      clientQuery
    ]);

    // Combine and sort by creation date
    const allGrants = [...finderGrants, ...clientGrants]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allGrants;
  }
  async getAllFindersForTokens(): Promise<Finder[]> { return []; }

  // Strike system operations
  async issueStrike(strike: InsertStrike): Promise<Strike> {
    const result = await db.insert(strikes).values({
      ...strike,
      strikeCount: strike.violationLevel === 'low' ? 1 : (strike.violationLevel === 'medium' ? 3 : 5), // Example logic: low=1, medium=3, high=5 strikes
      status: 'active',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Example: expires in 30 days
    }).returning();
    return result[0];
  }
  async getStrikesByUserId(userId: string): Promise<Strike[]> {
    return await db.select().from(strikes).where(eq(strikes.userId, userId));
  }
  async getActiveStrikesCount(userId: string): Promise<number> {
    try {
      const result = await db.select({ count: sql<number>`count(*)` })
        .from(strikes)
        .where(and(eq(strikes.userId, userId), eq(strikes.status, 'active')));
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting active strikes count:', error);
      return 0;
    }
  }

  async getUserTotalStrikeCount(userId: string): Promise<number> {
    try {
      const result = await db.select({ total: sql<number>`sum(${strikes.strikeCount})` })
        .from(strikes)
        .where(and(eq(strikes.userId, userId), eq(strikes.status, 'active')));
      return result[0]?.total || 0;
    } catch (error) {
      console.error('Error getting total strike count:', error);
      return 0;
    }
  }

  async updateStrike(id: string, updates: Partial<Strike>): Promise<Strike | undefined> {
    const result = await db.update(strikes).set(updates).where(eq(strikes.id, id)).returning();
    return result[0];
  }

  // User restrictions operations
  async createUserRestriction(restriction: InsertUserRestriction): Promise<UserRestriction> { throw new Error('Not implemented'); }
  async getUserActiveRestrictions(userId: string): Promise<UserRestriction[]>{ return []; }
  async updateUserRestriction(id: string, updates: Partial<UserRestriction>): Promise<UserRestriction | undefined> { return undefined; }

  // Dispute operations
  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const result = await db.insert(disputes).values(dispute).returning();
    return result[0];
  }

  async getDisputesByUserId(userId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.userId, userId));
  }

  async getAllDisputes(): Promise<Dispute[]> {
    return await db.select().from(disputes).orderBy(desc(disputes.submittedAt));
  }

  async updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute | undefined> {
    const result = await db.update(disputes).set(updates).where(eq(disputes.id, id)).returning();
    return result[0];
  }

  // Training operations
  async assignTraining(training: InsertBehavioralTraining): Promise<BehavioralTraining> { throw new Error('Not implemented'); }
  async getTrainingsByUserId(userId: string): Promise<BehavioralTraining[]> { return []; }
  async updateTraining(id: string, updates: Partial<BehavioralTraining>): Promise<BehavioralTraining | undefined> { return undefined; }

  // Badge operations
  async awardBadge(badge: InsertTrustedBadge): Promise<TrustedBadge> { throw new Error('Not implemented'); }
  async getUserBadges(userId: string): Promise<TrustedBadge[]> { return []; }
  async updateBadge(id: string, updates: Partial<TrustedBadge>): Promise<TrustedBadge | undefined> { return undefined; }

  // Strike analysis
  async getUserStrikeLevel(userId: string): Promise<number> {
    const totalStrikes = await this.getUserTotalStrikeCount(userId);
    if (totalStrikes >= 10) {
      return 3; // Banned level
    } else if (totalStrikes >= 7) {
      return 2; // High violation level
    } else if (totalStrikes >= 4) {
      return 1; // Medium violation level
    } else {
      return 0; // Low violation level
    }
  }

  // Token packages
  async getAllTokenPackages(): Promise<TokenPackage[]> {
    return await db.select().from(tokenPackages).orderBy(desc(tokenPackages.createdAt));
  }
  async getActiveTokenPackages(): Promise<TokenPackage[]> {
    try {
      return await db.select().from(tokenPackages)
        .where(eq(tokenPackages.isActive, true))
        .orderBy(desc(tokenPackages.createdAt));
    } catch (error) {
      console.error('Error fetching active token packages:', error);
      return [];
    }
  }
  async getTokenPackage(id: string): Promise<TokenPackage | undefined> {
    try {
      const result = await db.select().from(tokenPackages).where(eq(tokenPackages.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching token package:', error);
      return undefined;
    }
  }
  async createTokenPackage(tokenPackage: InsertTokenPackage): Promise<TokenPackage> {
    const result = await db.insert(tokenPackages).values(tokenPackage).returning();
    return result[0];
  }
  async updateTokenPackage(id: string, updates: any): Promise<TokenPackage | undefined> {
    try {
      console.log('Updating token package:', id, 'with updates:', updates);
      const result = await db
        .update(tokenPackages)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(tokenPackages.id, id))
        .returning();

      console.log('Token package update result:', result);
      return result[0];
    } catch (error) {
      console.error('Error updating token package:', error);
      return undefined;
    }
  }

  async deleteTokenPackage(id: string): Promise<boolean> {
    try {
      const result = await db.delete(tokenPackages)
        .where(eq(tokenPackages.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting token package:', error);
      return false;
    }
  }

  // Restricted words
  async addRestrictedWord(word: InsertRestrictedWord): Promise<RestrictedWord> {
    const result = await db.insert(restrictedWords).values(word).returning();
    return result[0];
  }
  async getRestrictedWords(): Promise<RestrictedWord[]> {
    return await db.select().from(restrictedWords).orderBy(desc(restrictedWords.createdAt));
  }
  async deleteRestrictedWord(id: string): Promise<boolean> {
    try {
      console.log('Storage: Attempting to delete restricted word with ID:', id);
      const result = await db
        .delete(restrictedWords)
        .where(eq(restrictedWords.id, id))
        .returning();

      console.log('Storage: Delete result:', result);
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting restricted word:', error);
      return false;
    }
  }

  async removeRestrictedWord(id: string): Promise<boolean> {
    return this.deleteRestrictedWord(id);
  }
  async updateRestrictedWord(id: string, updates: Partial<RestrictedWord>): Promise<RestrictedWord | undefined> {
    const result = await db.update(restrictedWords).set(updates).where(eq(restrictedWords.id, id)).returning();
    return result[0];
  }
  async checkContentForRestrictedWords(content: string): Promise<string[]> {
    const words = await this.getRestrictedWords();
    const foundWords = words.filter(word => content.toLowerCase().includes(word.word.toLowerCase())).map(word => word.word);
    return foundWords;
  }

  // Support operations
  async createSupportAgent(data: InsertSupportAgent & { agentId: string }): Promise<SupportAgent> {
    const result = await db.insert(supportAgents).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async getSupportAgents(): Promise<Array<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } }>> {
    const result = await db.select({
      id: supportAgents.id,
      userId: supportAgents.userId,
      agentId: supportAgents.agentId,
      department: supportAgents.department,
      permissions: supportAgents.permissions,
      isActive: supportAgents.isActive,
      maxTicketsPerDay: supportAgents.maxTicketsPerDay,
      responseTimeTarget: supportAgents.responseTimeTarget,
      specializations: supportAgents.specializations,
      languages: supportAgents.languages,
      assignedBy: supportAgents.assignedBy,
      suspendedAt: supportAgents.suspendedAt,
      suspensionReason: supportAgents.suspensionReason,
      createdAt: supportAgents.createdAt,
      updatedAt: supportAgents.updatedAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      }
    })
    .from(supportAgents)
    .innerJoin(users, eq(supportAgents.userId, users.id))
    .orderBy(desc(supportAgents.createdAt));

    return result as Array<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } }>;
  }

  async getSupportAgent(id: string): Promise<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } } | undefined> {
    const result = await db.select({
      id: supportAgents.id,
      userId: supportAgents.userId,
      agentId: supportAgents.agentId,
      department: supportAgents.department,
      permissions: supportAgents.permissions,
      isActive: supportAgents.isActive,
      maxTicketsPerDay: supportAgents.maxTicketsPerDay,
      responseTimeTarget: supportAgents.responseTimeTarget,
      specializations: supportAgents.specializations,
      languages: supportAgents.languages,
      assignedBy: supportAgents.assignedBy,
      suspendedAt: supportAgents.suspendedAt,
      suspensionReason: supportAgents.suspensionReason,
      createdAt: supportAgents.createdAt,
      updatedAt: supportAgents.updatedAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      }
    })
    .from(supportAgents)
    .innerJoin(users, eq(supportAgents.userId, users.id))
    .where(eq(supportAgents.id, id))
    .limit(1);

    return result[0] as SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } } | undefined;
  }

  async updateSupportAgent(id: string, data: Partial<InsertSupportAgent>): Promise<SupportAgent | undefined> {
    const result = await db.update(supportAgents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(supportAgents.id, id))
      .returning();
    return result[0];
  }

  async suspendSupportAgent(id: string, reason: string): Promise<SupportAgent | undefined> {
    const result = await db.update(supportAgents)
      .set({
        isActive: false,
        suspendedAt: new Date(),
        suspensionReason: reason,
        updatedAt: new Date()
      })
      .where(eq(supportAgents.id, id))
      .returning();
    return result[0];
  }

  async reactivateSupportAgent(id: string): Promise<SupportAgent | undefined> {
    const result = await db.update(supportAgents)
      .set({
        isActive: true,
        suspendedAt: null,
        suspensionReason: null,
        updatedAt: new Date()
      })
      .where(eq(supportAgents.id, id))
      .returning();
    return result[0];
  }

  async deleteSupportAgent(id: string): Promise<boolean> {
    const result = await db.delete(supportAgents)
      .where(eq(supportAgents.id, id))
      .returning();
    return result.length > 0;
  }

  async generateAgentId(): Promise<string> {
    // Get the last agent ID and increment
    const lastAgent = await db.select({ agentId: supportAgents.agentId })
      .from(supportAgents)
      .orderBy(desc(supportAgents.createdAt))
      .limit(1);

    if (lastAgent.length === 0) {
      return 'AGT001';
    }

    // Extract number from last agent ID (e.g., AGT001 -> 1)
    const lastNumber = parseInt(lastAgent[0].agentId.replace('AGT', ''));
    const nextNumber = lastNumber + 1;

    // Pad with zeros to maintain 3-digit format
    return `AGT${nextNumber.toString().padStart(3, '0')}`;
  }

  async getSupportDepartments(): Promise<Array<SupportDepartment & { isActive: boolean; name: string; }>> {
    return await db.select({
      id: supportDepartments.id,
      name: supportDepartments.name,
      isActive: supportDepartments.isActive,
      createdAt: supportDepartments.createdAt,
      updatedAt: supportDepartments.updatedAt,
    }).from(supportDepartments);
  }
  async createSupportDepartment(data: InsertSupportDepartment): Promise<SupportDepartment> {
    const result = await db.insert(supportDepartments).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }
  async updateSupportDepartment(id: string, data: Partial<InsertSupportDepartment>): Promise<SupportDepartment | undefined> {
    const result = await db.update(supportDepartments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(supportDepartments.id, id))
      .returning();
    return result[0];
  }
  async deleteSupportDepartment(id: string): Promise<boolean> {
    const result = await db.delete(supportDepartments)
      .where(eq(supportDepartments.id, id))
      .returning();
    return result.length > 0;
  }

  async getUserSupportAgent(userId: string): Promise<SupportAgent | undefined> {
    const result = await db.select()
      .from(supportAgents)
      .where(eq(supportAgents.userId, userId))
      .limit(1);
    return result[0];
  }
  async generateWithdrawalRequestId(): Promise<string> { return 'WR-2025-001'; }

  // Contact settings
  async getContactSettings(): Promise<any> {
    try {
      const result = await db.select().from(contactSettings).limit(1);
      return result[0] || {
        supportEmail: "",
        supportPhone: "",
        officeAddress: "",
        businessHours: "",
        facebookUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        tiktokUrl: "",
        linkedinUrl: "",
        whatsappNumber: "",
        responseTimeLow: "",
        responseTimeMedium: "",
        responseTimeHigh: "",
        responseTimeUrgent: ""
      };
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      return null;
    }
  }

  async updateContactSettings(settings: any): Promise<any> {
    try {
      // Check if a record exists
      const existing = await db.select().from(contactSettings).limit(1);
      
      if (existing.length > 0) {
        // Update existing record
        const result = await db.update(contactSettings)
          .set({
            ...settings,
            updatedAt: new Date()
          })
          .where(eq(contactSettings.id, existing[0].id))
          .returning();
        return result[0];
      } else {
        // Create new record
        const result = await db.insert(contactSettings)
          .values({
            ...settings,
            updatedAt: new Date()
          })
          .returning();
        return result[0];
      }
    } catch (error) {
      console.error('Error updating contact settings:', error);
      throw error;
    }
  }

  // FAQ operations
  async getFAQCategories(): Promise<any[]> {
    try {
      return await db.select().from(faqCategories).orderBy(asc(faqCategories.sortOrder));
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
      return [];
    }
  }

  async getFAQCategory(id: string): Promise<any> {
    try {
      const result = await db.select().from(faqCategories).where(eq(faqCategories.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching FAQ category by ID:', error);
      return null;
    }
  }

  async createFAQCategory(category: any): Promise<any> {
    try {
      const result = await db.insert(faqCategories).values({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating FAQ category:', error);
      throw error;
    }
  }

  async updateFAQCategory(id: string, updates: any): Promise<any> {
    try {
      // First check if category exists
      const existing = await this.getFAQCategory(id);
      if (!existing) {
        console.error('FAQ category not found for update:', id);
        return null;
      }

      const result = await db.update(faqCategories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(faqCategories.id, id))
        .returning();

      console.log('FAQ category update result:', result);
      return result[0] || null;
    } catch (error) {
      console.error('Error updating FAQ category:', error);
      throw error;
    }
  }

  async deleteFAQCategory(id: string): Promise<boolean> {
    try {
      // First check if category exists
      const existing = await this.getFAQCategory(id);
      if (!existing) {
        console.error('FAQ category not found for deletion:', id);
        return false;
      }

      const result = await db.delete(faqCategories)
        .where(eq(faqCategories.id, id))
        .returning();

      console.log('FAQ category delete result:', result);
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting FAQ category:', error);
      return false;
    }
  }

  // Verification operations
  async submitVerification(verification: any): Promise<any> {
    const result = await db.insert(userVerifications).values(verification).returning();
    return result[0];
  }

  async getVerificationByUserId(userId: string): Promise<any> {
    const result = await db.select().from(userVerifications).where(eq(userVerifications.userId, userId)).limit(1);
    return result[0] || null;
  }

  async getPendingVerifications(): Promise<any[]> {
    return await db.select({
      id: userVerifications.id,
      userId: userVerifications.userId,
      documentType: userVerifications.documentType,
      documentFrontImage: userVerifications.documentFrontImage,
      documentBackImage: userVerifications.documentBackImage,
      selfieImage: userVerifications.selfieImage,
      status: userVerifications.status,
      submittedAt: userVerifications.submittedAt,
      reviewedAt: userVerifications.reviewedAt,
      rejectionReason: userVerifications.rejectionReason,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role
      }
    })
    .from(userVerifications)
    .innerJoin(users, eq(userVerifications.userId, users.id))
    .where(eq(userVerifications.status, 'pending'))
    .orderBy(desc(userVerifications.submittedAt));
  }

  async updateVerificationStatus(id: string, status: string, reviewedBy: string, rejectionReason?: string): Promise<any> {
    const updates: any = {
      status,
      reviewedBy,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };

    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }

    const result = await db.update(userVerifications)
      .set(updates)
      .where(eq(userVerifications.id, id))
      .returning();

    if (result[0] && status === 'verified') {
      // Update user's verification status
      await db.update(users)
        .set({
          isVerified: true,
          identityVerificationStatus: 'verified',
          updatedAt: new Date()
        })
        .where(eq(users.id, result[0].userId));

      // Also update finder verification if user is a finder
      const finder = await db.select().from(finders).where(eq(finders.userId, result[0].userId)).limit(1);
      if (finder[0]) {
        await db.update(finders)
          .set({
            isVerified: true,
            updatedAt: new Date()
          })
          .where(eq(finders.id, finder[0].id));
      }
    } else if (result[0] && status === 'rejected') {
      // Update user's verification status to rejected
      await db.update(users)
        .set({
          isVerified: false,
          identityVerificationStatus: 'rejected',
          updatedAt: new Date()
        })
        .where(eq(users.id, result[0].userId));

      // Also update finder verification if user is a finder
      const finder = await db.select().from(finders).where(eq(finders.userId, result[0].userId)).limit(1);
      if (finder[0]) {
        await db.update(finders)
          .set({
            isVerified: false,
            updatedAt: new Date()
          })
          .where(eq(finders.id, finder[0].id));
      }
    }

    return result[0];
  }

  async getVerificationById(id: string): Promise<any> {
    const result = await db.select({
      id: userVerifications.id,
      userId: userVerifications.userId,
      documentType: userVerifications.documentType,
      documentFrontImage: userVerifications.documentFrontImage,
      documentBackImage: userVerifications.documentBackImage,
      selfieImage: userVerifications.selfieImage,
      status: userVerifications.status,
      submittedAt: userVerifications.submittedAt,
      reviewedAt: userVerifications.reviewedAt,
      rejectionReason: userVerifications.rejectionReason,
      reviewedBy: userVerifications.reviewedBy,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role
      }
    })
    .from(userVerifications)
    .innerJoin(users, eq(userVerifications.userId, users.id))
    .where(eq(userVerifications.id, id))
    .limit(1);

    return result[0] || null;
  }

  async isVerificationRequired(): Promise<boolean> {
    const setting = await this.getAdminSetting('verification_required');
    return setting?.value === 'true';
  }

  // Support tickets
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const result = await db.insert(supportTickets).values(ticket).returning();
    return result[0];
  }
  async getSupportTickets(filters?: any): Promise<any[]> {
    let query = db.select({
      id: supportTickets.id,
      subject: supportTickets.subject,
      description: supportTickets.description,
      status: supportTickets.status,
      priority: supportTickets.priority,
      department: supportTickets.department,
      assignedTo: supportTickets.assignedTo,
      createdAt: supportTickets.createdAt,
      updatedAt: supportTickets.updatedAt,
      submitterId: supportTickets.submitterId,
      submitter: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      },
      assignedAgent: {
        agentId: supportAgents.agentId,
        user: {
          firstName: users.firstName,
          lastName: users.lastName
        }
      }
    })
    .from(supportTickets)
    .leftJoin(users, eq(supportTickets.submitterId, users.id))
    .leftJoin(supportAgents, eq(supportTickets.assignedTo, supportAgents.id))
    .leftJoin(users as any, eq(supportAgents.userId, (users as any).id)) // Alias for assigned agent user
    .orderBy(desc(supportTickets.createdAt));

    if (filters) {
      if (filters.status) {
        query = query.where(eq(supportTickets.status, filters.status));
      }
      if (filters.department) {
        query = query.where(eq(supportTickets.department, filters.department));
      }
      if (filters.assignedTo) {
        query = query.where(eq(supportTickets.assignedTo, filters.assignedTo));
      }
      if (filters.priority) {
        query = query.where(eq(supportTickets.priority, filters.priority));
      }
    }

    return await query;
  }
  async getSupportTicket(id: string): Promise<SupportTicket & { submitter?: { firstName: string; lastName: string; email: string; }; assignedAgent?: { agentId: string; user: { firstName: string; lastName: string; } }; } | undefined> {
    const result = await db.select({
      id: supportTickets.id,
      subject: supportTickets.subject,
      description: supportTickets.description,
      status: supportTickets.status,
      priority: supportTickets.priority,
      department: supportTickets.department,
      assignedTo: supportTickets.assignedTo,
      createdAt: supportTickets.createdAt,
      updatedAt: supportTickets.updatedAt,
      submitterId: supportTickets.submitterId,
      submitter: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      },
      assignedAgent: {
        agentId: supportAgents.agentId,
        user: {
          firstName: users.firstName,
          lastName: users.lastName
        }
      }
    })
    .from(supportTickets)
    .leftJoin(users, eq(supportTickets.submitterId, users.id))
    .leftJoin(supportAgents, eq(supportTickets.assignedTo, supportAgents.id))
    .leftJoin(users as any, eq(supportAgents.userId, (users as any).id)) // Alias for assigned agent user
    .where(eq(supportTickets.id, id))
    .limit(1);

    return result[0];
  }
  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const result = await db.update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return result[0];
  }
  async deleteSupportTicket(id: string): Promise<boolean> {
    const result = await db.delete(supportTickets)
      .where(eq(supportTickets.id, id))
      .returning();
    return result.length > 0;
  }
  async generateTicketNumber(): Promise<string> {
    const lastTicket = await db.select({ ticketNumber: supportTickets.ticketNumber })
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt))
      .limit(1);

    if (lastTicket.length === 0) {
      return 'TKT-0001';
    }

    const lastNumber = parseInt(lastTicket[0].ticketNumber.replace('TKT-', ''));
    const nextNumber = lastNumber + 1;
    return `TKT-${nextNumber.toString().padStart(4, '0')}`;
  }

  async createSupportTicketMessage(message: any): Promise<SupportTicketMessage> {
    const result = await db.insert(supportTicketMessages).values({
      ...message,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Update ticket's updatedAt timestamp
    await db.update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, message.ticketId));

    return result[0];
  }
  async getSupportTicketMessages(ticketId: string): Promise<any[]> {
    return await db.select({
      id: supportTicketMessages.id,
      ticketId: supportTicketMessages.ticketId,
      senderId: supportTicketMessages.senderId,
      senderType: supportTicketMessages.senderType,
      senderName: supportTicketMessages.senderName,
      senderEmail: supportTicketMessages.senderEmail,
      content: supportTicketMessages.content,
      attachments: supportTicketMessages.attachments,
      isInternal: supportTicketMessages.isInternal,
      createdAt: supportTicketMessages.createdAt,
      updatedAt: supportTicketMessages.updatedAt,
      sender: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(supportTicketMessages)
    .leftJoin(users, eq(supportTicketMessages.senderId, users.id))
    .where(eq(supportTicketMessages.ticketId, ticketId))
    .orderBy(asc(supportTicketMessages.createdAt));
  }
  async markTicketMessageAsRead(messageId: string): Promise<void> {
    // This would typically involve a separate table to track read status per user/message
    // For now, this is a placeholder.
  }

  // Implementation for getProposalsForClient
  async getProposalsForClient(clientId: string): Promise<Proposal[]> {
    const result = await db
      .select({
        id: proposals.id,
        findId: proposals.findId,
        finderId: proposals.finderId,
        approach: proposals.approach,
        price: proposals.price,
        timeline: proposals.timeline,
        notes: proposals.notes,
        status: proposals.status,
        createdAt: proposals.createdAt,
        findTitle: finds.title,
        finder: {
          id: finders.id,
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
          }
        }
      })
      .from(proposals)
      .innerJoin(finds, eq(proposals.findId, finds.id))
      .innerJoin(finders, eq(proposals.finderId, finders.id))
      .innerJoin(users, eq(finders.userId, users.id))
      .where(eq(finds.clientId, clientId))
      .orderBy(desc(proposals.createdAt));

    return result as any[];
  }

  async getProposalWithDetails(id: string): Promise<any> {
    const result = await db
      .select({
        id: proposals.id,
        findId: proposals.findId,
        finderId: proposals.finderId,
        approach: proposals.approach,
        price: proposals.price,
        timeline: proposals.timeline,
        notes: proposals.notes,
        status: proposals.status,
        createdAt: proposals.createdAt,
        finder: {
          id: finders.id,
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
          },
          completedJobs: finders.jobsCompleted,
          rating: finders.averageRating
        },
        request: {
          title: finds.title,
          description: finds.description,
          category: finds.category,
          budgetMin: finds.budgetMin,
          budgetMax: finds.budgetMax
        }
      })
      .from(proposals)
      .innerJoin(finders, eq(proposals.finderId, finders.id))
      .innerJoin(users, eq(finders.userId, users.id))
      .innerJoin(finds, eq(proposals.findId, finds.id))
      .where(eq(proposals.id, id))
      .limit(1);

    return result[0];
  }

  async getConversationByProposal(proposalId: string): Promise<any> {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.proposalId, proposalId))
      .limit(1);

    return result[0];
  }

  async createConversation(data: { clientId: string; finderId: string; proposalId: string }): Promise<any> {
    const conversationId = generateId();
    const [conversation] = await db
      .insert(conversations)
      .values({
        id: conversationId,
        clientId: data.clientId,
        finderId: data.finderId,
        proposalId: data.proposalId,
        createdAt: new Date(),
        lastMessageAt: new Date(),
      })
      .returning();

    return conversation;
  }
}

export const storage = new DatabaseStorage();