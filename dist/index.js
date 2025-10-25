var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSettings: () => adminSettings,
  behavioralTraining: () => behavioralTraining,
  blogPosts: () => blogPosts,
  blogPostsRelations: () => blogPostsRelations,
  categories: () => categories,
  clientTokenGrants: () => clientTokenGrants,
  clientTokenGrantsRelations: () => clientTokenGrantsRelations,
  contactSettings: () => contactSettings,
  contracts: () => contracts,
  contractsRelations: () => contractsRelations,
  conversations: () => conversations,
  conversationsRelations: () => conversationsRelations,
  disputes: () => disputes,
  faqCategories: () => faqCategories,
  faqs: () => faqs,
  finderLevels: () => finderLevels,
  finderLevelsRelations: () => finderLevelsRelations,
  finders: () => finders,
  findersRelations: () => findersRelations,
  findertokens: () => findertokens,
  findertokensRelations: () => findertokensRelations,
  finds: () => finds,
  findsRelations: () => findsRelations,
  insertAdminSettingSchema: () => insertAdminSettingSchema,
  insertBehavioralTrainingSchema: () => insertBehavioralTrainingSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertClientTokenGrantSchema: () => insertClientTokenGrantSchema,
  insertContactSettingsSchema: () => insertContactSettingsSchema,
  insertContractSchema: () => insertContractSchema,
  insertConversationSchema: () => insertConversationSchema,
  insertDisputeSchema: () => insertDisputeSchema,
  insertFAQCategorySchema: () => insertFAQCategorySchema,
  insertFAQSchema: () => insertFAQSchema,
  insertFindSchema: () => insertFindSchema,
  insertFinderLevelSchema: () => insertFinderLevelSchema,
  insertFinderSchema: () => insertFinderSchema,
  insertFindertokenSchema: () => insertFindertokenSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertMonthlyTokenDistributionSchema: () => insertMonthlyTokenDistributionSchema,
  insertOrderSubmissionSchema: () => insertOrderSubmissionSchema,
  insertProposalSchema: () => insertProposalSchema,
  insertRestrictedWordSchema: () => insertRestrictedWordSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertStrikeSchema: () => insertStrikeSchema,
  insertSupportAgentSchema: () => insertSupportAgentSchema,
  insertSupportDepartmentSchema: () => insertSupportDepartmentSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertTokenChargeSchema: () => insertTokenChargeSchema,
  insertTokenGrantSchema: () => insertTokenGrantSchema,
  insertTokenPackageSchema: () => insertTokenPackageSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertTrustedBadgeSchema: () => insertTrustedBadgeSchema,
  insertUserRestrictionSchema: () => insertUserRestrictionSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserVerificationSchema: () => insertUserVerificationSchema,
  insertWithdrawalRequestSchema: () => insertWithdrawalRequestSchema,
  insertWithdrawalSettingsSchema: () => insertWithdrawalSettingsSchema,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  monthlyTokenDistributions: () => monthlyTokenDistributions,
  monthlyTokenDistributionsRelations: () => monthlyTokenDistributionsRelations,
  orderSubmissions: () => orderSubmissions,
  orderSubmissionsRelations: () => orderSubmissionsRelations,
  proposals: () => proposals,
  proposalsRelations: () => proposalsRelations,
  restrictedWords: () => restrictedWords,
  restrictedWordsRelations: () => restrictedWordsRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  strikes: () => strikes,
  supportAgents: () => supportAgents,
  supportAgentsRelations: () => supportAgentsRelations,
  supportDepartments: () => supportDepartments,
  supportTicketMessages: () => supportTicketMessages,
  supportTicketMessagesRelations: () => supportTicketMessagesRelations,
  supportTickets: () => supportTickets,
  supportTicketsRelations: () => supportTicketsRelations,
  tokenCharges: () => tokenCharges,
  tokenGrants: () => tokenGrants,
  tokenGrantsRelations: () => tokenGrantsRelations,
  tokenPackages: () => tokenPackages,
  transactions: () => transactions,
  transactionsRelations: () => transactionsRelations,
  trustedBadges: () => trustedBadges,
  userRestrictions: () => userRestrictions,
  userVerifications: () => userVerifications,
  users: () => users2,
  usersRelations: () => usersRelations,
  withdrawalRequests: () => withdrawalRequests,
  withdrawalRequestsRelations: () => withdrawalRequestsRelations,
  withdrawalSettings: () => withdrawalSettings,
  withdrawalSettingsRelations: () => withdrawalSettingsRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users2, finders, findertokens, finds, restrictedWords, proposals, contracts, reviews, transactions, adminSettings, tokenPackages, conversations, messages, categories, withdrawalSettings, withdrawalRequests, blogPosts, orderSubmissions, finderLevels, tokenCharges, monthlyTokenDistributions, tokenGrants, clientTokenGrants, strikes, userRestrictions, disputes, behavioralTraining, trustedBadges, usersRelations, findersRelations, findsRelations, proposalsRelations, contractsRelations, reviewsRelations, findertokensRelations, transactionsRelations, conversationsRelations, messagesRelations, blogPostsRelations, orderSubmissionsRelations, withdrawalRequestsRelations, withdrawalSettingsRelations, finderLevelsRelations, monthlyTokenDistributionsRelations, tokenGrantsRelations, clientTokenGrantsRelations, restrictedWordsRelations, insertCategorySchema, insertWithdrawalSettingsSchema, insertWithdrawalRequestSchema, insertUserSchema, insertFinderSchema, insertFindSchema, insertProposalSchema, insertContractSchema, insertReviewSchema, insertFindertokenSchema, insertTransactionSchema, insertAdminSettingSchema, insertTokenChargeSchema, insertMonthlyTokenDistributionSchema, insertTokenGrantSchema, insertClientTokenGrantSchema, insertConversationSchema, insertFinderLevelSchema, insertMessageSchema, insertBlogPostSchema, insertTokenPackageSchema, insertOrderSubmissionSchema, supportAgents, contactSettings, faqCategories, userVerifications, supportTickets, supportTicketMessages, supportDepartments, insertStrikeSchema, insertUserRestrictionSchema, insertDisputeSchema, insertBehavioralTrainingSchema, insertTrustedBadgeSchema, supportAgentsRelations, supportTicketsRelations, supportTicketMessagesRelations, insertSupportAgentSchema, insertSupportTicketSchema, insertSupportDepartmentSchema, faqs, insertFAQSchema, insertFAQCategorySchema, insertContactSettingsSchema, insertUserVerificationSchema, insertRestrictedWordSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users2 = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      phone: text("phone"),
      role: text("role").notNull(),
      // 'client', 'finder', 'admin'
      isVerified: boolean("is_verified").default(false),
      identityVerificationStatus: text("identity_verification_status").default("not_verified"),
      // 'not_verified', 'pending', 'verified', 'rejected'
      isBanned: boolean("is_banned").default(false),
      bannedReason: text("banned_reason"),
      bannedAt: timestamp("banned_at"),
      findertokenBalance: integer("findertoken_balance").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    finders = pgTable("finders", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      jobsCompleted: integer("jobs_completed").default(0),
      totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default("0.00"),
      availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default("0.00"),
      averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
      currentLevelId: varchar("current_level_id").references(() => finderLevels.id),
      // references finder levels table
      bio: text("bio"),
      category: text("category"),
      // Finder's specialty category
      categories: text("categories").array(),
      // New field for multiple categories
      skills: text("skills").array(),
      hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
      availability: text("availability").default("full-time"),
      phone: text("phone"),
      isVerified: boolean("is_verified").default(false),
      findertokenBalance: integer("findertoken_balance").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    findertokens = pgTable("findertokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      balance: integer("balance").default(0)
    });
    finds = pgTable("finds", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      clientId: varchar("client_id").references(() => users2.id).notNull(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      category: text("category").notNull(),
      budgetMin: text("budget_min"),
      budgetMax: text("budget_max"),
      timeframe: text("timeframe"),
      status: text("status").default("open"),
      // 'open', 'in_progress', 'completed', 'under_review'
      findertokenCost: integer("findertoken_cost").default(1),
      attachments: text("attachments").array(),
      // Array of file paths stored locally
      flaggedWords: text("flagged_words").array(),
      // Array of detected restricted words
      reviewReason: text("review_reason"),
      // Reason why find is under review
      isHighBudget: boolean("is_high_budget").default(false),
      // High budget posting requiring findertokens
      isBoosted: boolean("is_boosted").default(false),
      // Whether find is boosted
      boostAmount: integer("boost_amount").default(0),
      // Amount of findertokens spent to boost
      boostExpiresAt: timestamp("boost_expires_at"),
      // When boost expires
      createdAt: timestamp("created_at").defaultNow()
    });
    restrictedWords = pgTable("restricted_words", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      word: text("word").notNull().unique(),
      category: text("category").default("general"),
      // Category of restriction
      severity: text("severity").default("flag"),
      // 'flag', 'block', 'review'
      addedBy: varchar("added_by").references(() => users2.id).notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    proposals = pgTable("proposals", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      findId: varchar("find_id").references(() => finds.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      approach: text("approach").notNull(),
      price: text("price").notNull(),
      timeline: text("timeline").notNull(),
      notes: text("notes"),
      status: text("status").default("pending"),
      // 'pending', 'accepted', 'rejected'
      createdAt: timestamp("created_at").defaultNow()
    });
    contracts = pgTable("contracts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      findId: varchar("find_id").references(() => finds.id).notNull(),
      proposalId: varchar("proposal_id").references(() => proposals.id).notNull(),
      clientId: varchar("client_id").references(() => users2.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      escrowStatus: text("escrow_status").default("held"),
      // 'held', 'in_progress', 'completed', 'released'
      isCompleted: boolean("is_completed").default(false),
      hasSubmission: boolean("has_submission").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    reviews = pgTable("reviews", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contractId: varchar("contract_id").references(() => contracts.id).notNull(),
      clientId: varchar("client_id").references(() => users2.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      rating: integer("rating").notNull(),
      // 1-5
      comment: text("comment"),
      createdAt: timestamp("created_at").defaultNow()
    });
    transactions = pgTable("transactions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id),
      amount: integer("amount").notNull(),
      type: text("type").notNull(),
      // 'findertoken_purchase', 'proposal', 'refund'
      description: text("description"),
      reference: text("reference"),
      createdAt: timestamp("created_at").defaultNow()
    });
    adminSettings = pgTable("admin_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      key: text("key").notNull().unique(),
      value: text("value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tokenPackages = pgTable("token_packages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      description: text("description"),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      tokenCount: integer("token_count").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    conversations = pgTable("conversations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      clientId: varchar("client_id").references(() => users2.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      proposalId: varchar("proposal_id").references(() => proposals.id).notNull(),
      lastMessageAt: timestamp("last_message_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow()
    });
    messages = pgTable("messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
      senderId: varchar("sender_id").references(() => users2.id).notNull(),
      content: text("content").notNull(),
      attachmentPaths: text("attachment_paths").array(),
      // Array of file paths in object storage
      attachmentNames: text("attachment_names").array(),
      // Array of original file names
      quotedMessageId: text("quoted_message_id").references(() => messages.id),
      isRead: boolean("is_read").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    categories = pgTable("categories", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      description: text("description"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    withdrawalSettings = pgTable("withdrawal_settings", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      paymentMethod: text("payment_method").notNull().default("bank_transfer"),
      minimumThreshold: integer("minimum_threshold").notNull().default(50),
      bankDetails: text("bank_details"),
      // JSON string containing bank account details
      paypalDetails: text("paypal_details"),
      // JSON string containing PayPal details
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    withdrawalRequests = pgTable("withdrawal_requests", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      requestId: varchar("request_id").notNull().unique(),
      // Human-readable request ID like "WR-2025-001"
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      status: text("status").default("pending"),
      // 'pending', 'processing', 'approved', 'rejected'
      paymentMethod: text("payment_method").notNull(),
      // 'bank_transfer', 'paypal', 'crypto'
      paymentDetails: text("payment_details").notNull(),
      // JSON string with payment info
      adminNotes: text("admin_notes"),
      processedBy: varchar("processed_by").references(() => users2.id),
      requestedAt: timestamp("requested_at").defaultNow(),
      processedAt: timestamp("processed_at")
    });
    blogPosts = pgTable("blog_posts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      slug: text("slug").notNull().unique(),
      content: text("content").notNull(),
      excerpt: text("excerpt"),
      authorId: varchar("author_id").references(() => users2.id).notNull(),
      isPublished: boolean("is_published").default(false),
      publishedAt: timestamp("published_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    orderSubmissions = pgTable("order_submissions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contractId: varchar("contract_id").references(() => contracts.id).notNull(),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      submissionText: text("submission_text"),
      attachmentPaths: text("attachment_paths").array(),
      // array of file paths
      status: text("status").default("submitted"),
      // 'submitted', 'accepted', 'rejected'
      clientFeedback: text("client_feedback"),
      submittedAt: timestamp("submitted_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      autoReleaseDate: timestamp("auto_release_date")
      // 3 days after acceptance or 5 days after submission
    });
    finderLevels = pgTable("finder_levels", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      description: text("description"),
      minEarnedAmount: decimal("min_earned_amount", { precision: 10, scale: 2 }).default("0"),
      minJobsCompleted: integer("min_jobs_completed").default(0),
      minRating: decimal("min_rating", { precision: 3, scale: 2 }).default("0"),
      // Minimum average rating (e.g., 4.0, 5.0)
      minFiveStarCount: integer("min_five_star_count").default(0),
      // Number of 5-star reviews required
      monthlyTokens: integer("monthly_tokens").default(20),
      // Monthly token allocation
      tokenBonusPerProposal: integer("token_bonus_per_proposal").default(0),
      // Extra tokens per accepted proposal
      vipInvitationsPerMonth: integer("vip_invitations_per_month").default(0),
      // VIP invitation quota
      badgeIcon: text("badge_icon"),
      // Icon identifier (e.g., 'leaf', 'compass', 'eye', 'torch', 'crown')
      badgeEmoji: text("badge_emoji"),
      // Emoji representation
      color: text("color"),
      // hex color code
      order: integer("order").notNull(),
      // display order
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tokenCharges = pgTable("token_charges", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      amount: integer("amount").notNull(),
      // number of tokens charged
      reason: text("reason").notNull(),
      // reason for charge
      chargedBy: varchar("charged_by").references(() => users2.id).notNull(),
      // admin who charged
      createdAt: timestamp("created_at").defaultNow()
    });
    monthlyTokenDistributions = pgTable("monthly_token_distributions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      month: integer("month").notNull(),
      // 1-12
      year: integer("year").notNull(),
      tokensGranted: integer("tokens_granted").default(20),
      distributedAt: timestamp("distributed_at").defaultNow()
    });
    tokenGrants = pgTable("token_grants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      finderId: varchar("finder_id").references(() => finders.id).notNull(),
      amount: integer("amount").notNull(),
      // number of tokens granted
      reason: text("reason").notNull(),
      // reason for grant
      grantedBy: varchar("granted_by").references(() => users2.id).notNull(),
      // admin who granted
      createdAt: timestamp("created_at").defaultNow()
    });
    clientTokenGrants = pgTable("client_token_grants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      clientId: varchar("client_id").references(() => users2.id).notNull(),
      amount: integer("amount").notNull(),
      // number of tokens granted
      reason: text("reason").notNull(),
      // reason for grant
      grantedBy: varchar("granted_by").references(() => users2.id).notNull(),
      // admin who granted
      createdAt: timestamp("created_at").defaultNow()
    });
    strikes = pgTable("strikes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      strikeLevel: integer("strike_level").notNull(),
      // 1, 2, 3, 4, 5
      strikeCount: integer("strike_count").notNull().default(1),
      // How many strike points this violation adds
      offense: text("offense").notNull(),
      // Description of the offense
      offenseType: text("offense_type").notNull(),
      // Category of offense
      evidence: text("evidence"),
      // JSON string with evidence details
      issuedBy: varchar("issued_by").references(() => users2.id).notNull(),
      status: text("status").default("active"),
      // 'active', 'appealed', 'resolved', 'expired'
      appealReason: text("appeal_reason"),
      appealedAt: timestamp("appealed_at"),
      reviewedBy: varchar("reviewed_by").references(() => users2.id),
      reviewedAt: timestamp("reviewed_at"),
      expiresAt: timestamp("expires_at"),
      // When strike can be cleared (90 days for rollback)
      createdAt: timestamp("created_at").defaultNow()
    });
    userRestrictions = pgTable("user_restrictions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      restrictionType: text("restriction_type").notNull(),
      // 'posting', 'applications', 'messaging', 'suspended', 'banned'
      reason: text("reason").notNull(),
      startDate: timestamp("start_date").defaultNow(),
      endDate: timestamp("end_date"),
      // null for permanent restrictions
      isActive: boolean("is_active").default(true),
      createdBy: varchar("created_by").references(() => users2.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    disputes = pgTable("disputes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      strikeId: varchar("strike_id").references(() => strikes.id),
      contractId: varchar("contract_id").references(() => contracts.id),
      findId: varchar("find_id").references(() => finds.id),
      type: text("type").notNull(),
      // 'strike_appeal', 'contract_dispute', 'payment_dispute'
      description: text("description").notNull(),
      evidence: text("evidence"),
      // JSON string with files, screenshots, etc.
      status: text("status").default("pending"),
      // 'pending', 'investigating', 'resolved', 'rejected'
      assignedTo: varchar("assigned_to").references(() => users2.id),
      resolution: text("resolution"),
      resolvedAt: timestamp("resolved_at"),
      submittedAt: timestamp("submitted_at").defaultNow()
    });
    behavioralTraining = pgTable("behavioral_training", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      moduleType: text("module_type").notNull(),
      // 'communication', 'reliability', 'fraud_prevention'
      status: text("status").default("assigned"),
      // 'assigned', 'in_progress', 'completed'
      assignedDate: timestamp("assigned_date").defaultNow(),
      completedDate: timestamp("completed_date"),
      score: integer("score")
      // percentage score if applicable
    });
    trustedBadges = pgTable("trusted_badges", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      badgeType: text("badge_type").notNull(),
      // 'trusted_client', 'trusted_finder', 'referral_champion'
      earnedDate: timestamp("earned_date").defaultNow(),
      isActive: boolean("is_active").default(true),
      validUntil: timestamp("valid_until")
      // null for permanent badges
    });
    usersRelations = relations(users2, ({ one, many }) => ({
      finder: one(finders, {
        fields: [users2.id],
        references: [finders.userId]
      }),
      finds: many(finds),
      clientContracts: many(contracts, { relationName: "clientContracts" }),
      finderContracts: many(contracts, { relationName: "finderContracts" }),
      clientReviews: many(reviews, { relationName: "clientReviews" }),
      finderReviews: many(reviews, { relationName: "finderReviews" }),
      clientConversations: many(conversations, { relationName: "clientConversations" }),
      sentMessages: many(messages, { relationName: "sentMessages" })
    }));
    findersRelations = relations(finders, ({ one, many }) => ({
      user: one(users2, {
        fields: [finders.userId],
        references: [users2.id]
      }),
      findertokens: one(findertokens),
      withdrawalSettings: one(withdrawalSettings),
      currentLevel: one(finderLevels, {
        fields: [finders.currentLevelId],
        references: [finderLevels.id]
      }),
      proposals: many(proposals),
      contracts: many(contracts, { relationName: "finderContracts" }),
      transactions: many(transactions),
      reviews: many(reviews, { relationName: "finderReviews" }),
      finderConversations: many(conversations, { relationName: "finderConversations" }),
      withdrawalRequests: many(withdrawalRequests)
    }));
    findsRelations = relations(finds, ({ one, many }) => ({
      client: one(users2, {
        fields: [finds.clientId],
        references: [users2.id]
      }),
      proposals: many(proposals),
      contracts: many(contracts)
    }));
    proposalsRelations = relations(proposals, ({ one }) => ({
      find: one(finds, {
        fields: [proposals.findId],
        references: [finds.id]
      }),
      finder: one(finders, {
        fields: [proposals.finderId],
        references: [finders.id]
      })
    }));
    contractsRelations = relations(contracts, ({ one, many }) => ({
      find: one(finds, {
        fields: [contracts.findId],
        references: [finds.id]
      }),
      proposal: one(proposals, {
        fields: [contracts.proposalId],
        references: [proposals.id]
      }),
      client: one(users2, {
        fields: [contracts.clientId],
        references: [users2.id]
      }),
      finder: one(finders, {
        fields: [contracts.finderId],
        references: [finders.id]
      }),
      orderSubmissions: many(orderSubmissions)
    }));
    reviewsRelations = relations(reviews, ({ one }) => ({
      contract: one(contracts, {
        fields: [reviews.contractId],
        references: [contracts.id]
      }),
      client: one(users2, {
        fields: [reviews.clientId],
        references: [users2.id],
        relationName: "clientReviews"
      }),
      finder: one(users2, {
        fields: [reviews.finderId],
        references: [users2.id],
        relationName: "finderReviews"
      })
    }));
    findertokensRelations = relations(findertokens, ({ one }) => ({
      finder: one(finders, {
        fields: [findertokens.finderId],
        references: [finders.id]
      })
    }));
    transactionsRelations = relations(transactions, ({ one }) => ({
      finder: one(finders, {
        fields: [transactions.finderId],
        references: [finders.id]
      })
    }));
    conversationsRelations = relations(conversations, ({ one, many }) => ({
      client: one(users2, {
        fields: [conversations.clientId],
        references: [users2.id],
        relationName: "clientConversations"
      }),
      finder: one(finders, {
        fields: [conversations.finderId],
        references: [finders.id],
        relationName: "finderConversations"
      }),
      proposal: one(proposals, {
        fields: [conversations.proposalId],
        references: [proposals.id]
      }),
      messages: many(messages)
    }));
    messagesRelations = relations(messages, ({ one }) => ({
      conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id]
      }),
      sender: one(users2, {
        fields: [messages.senderId],
        references: [users2.id],
        relationName: "sentMessages"
      })
    }));
    blogPostsRelations = relations(blogPosts, ({ one }) => ({
      author: one(users2, {
        fields: [blogPosts.authorId],
        references: [users2.id]
      })
    }));
    orderSubmissionsRelations = relations(orderSubmissions, ({ one }) => ({
      contract: one(contracts, {
        fields: [orderSubmissions.contractId],
        references: [contracts.id]
      }),
      finder: one(finders, {
        fields: [orderSubmissions.finderId],
        references: [finders.id]
      })
    }));
    withdrawalRequestsRelations = relations(withdrawalRequests, ({ one }) => ({
      finder: one(finders, {
        fields: [withdrawalRequests.finderId],
        references: [finders.id]
      }),
      processedBy: one(users2, {
        fields: [withdrawalRequests.processedBy],
        references: [users2.id]
      })
    }));
    withdrawalSettingsRelations = relations(withdrawalSettings, ({ one }) => ({
      finder: one(finders, {
        fields: [withdrawalSettings.finderId],
        references: [finders.id]
      })
    }));
    finderLevelsRelations = relations(finderLevels, ({ many }) => ({
      finders: many(finders)
    }));
    monthlyTokenDistributionsRelations = relations(monthlyTokenDistributions, ({ one }) => ({
      finder: one(finders, {
        fields: [monthlyTokenDistributions.finderId],
        references: [finders.id]
      })
    }));
    tokenGrantsRelations = relations(tokenGrants, ({ one }) => ({
      finder: one(finders, {
        fields: [tokenGrants.finderId],
        references: [finders.id]
      }),
      grantedBy: one(users2, {
        fields: [tokenGrants.grantedBy],
        references: [users2.id]
      })
    }));
    clientTokenGrantsRelations = relations(clientTokenGrants, ({ one }) => ({
      client: one(users2, {
        fields: [clientTokenGrants.clientId],
        references: [users2.id]
      }),
      grantedBy: one(users2, {
        fields: [clientTokenGrants.grantedBy],
        references: [users2.id]
      })
    }));
    restrictedWordsRelations = relations(restrictedWords, ({ one }) => ({
      addedByUser: one(users2, {
        fields: [restrictedWords.addedBy],
        references: [users2.id]
      })
    }));
    insertCategorySchema = createInsertSchema(categories);
    insertWithdrawalSettingsSchema = createInsertSchema(withdrawalSettings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests);
    insertUserSchema = createInsertSchema(users2).omit({
      id: true,
      createdAt: true
    });
    insertFinderSchema = createInsertSchema(finders).omit({
      id: true
    });
    insertFindSchema = createInsertSchema(finds).omit({
      id: true,
      createdAt: true
    });
    insertProposalSchema = createInsertSchema(proposals).omit({
      id: true,
      createdAt: true
    });
    insertContractSchema = createInsertSchema(contracts).omit({
      id: true,
      createdAt: true,
      completedAt: true
    });
    insertReviewSchema = createInsertSchema(reviews).omit({
      id: true,
      createdAt: true
    });
    insertFindertokenSchema = createInsertSchema(findertokens).omit({
      id: true
    });
    insertTransactionSchema = createInsertSchema(transactions).omit({
      id: true,
      createdAt: true
    });
    insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
      id: true,
      updatedAt: true
    });
    insertTokenChargeSchema = createInsertSchema(tokenCharges).omit({
      id: true,
      createdAt: true
    });
    insertMonthlyTokenDistributionSchema = createInsertSchema(monthlyTokenDistributions).omit({
      id: true,
      distributedAt: true
    });
    insertTokenGrantSchema = createInsertSchema(tokenGrants).omit({
      id: true,
      createdAt: true
    });
    insertClientTokenGrantSchema = createInsertSchema(clientTokenGrants).omit({
      id: true,
      createdAt: true
    });
    insertConversationSchema = createInsertSchema(conversations).omit({
      id: true,
      lastMessageAt: true,
      createdAt: true
    });
    insertFinderLevelSchema = createInsertSchema(finderLevels).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMessageSchema = createInsertSchema(messages).omit({
      id: true,
      createdAt: true
    });
    insertBlogPostSchema = createInsertSchema(blogPosts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertTokenPackageSchema = createInsertSchema(tokenPackages).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrderSubmissionSchema = createInsertSchema(orderSubmissions).omit({
      id: true,
      submittedAt: true,
      reviewedAt: true,
      autoReleaseDate: true
    });
    supportAgents = pgTable("support_agents", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull().unique(),
      agentId: varchar("agent_id").notNull().unique(),
      // Human-readable ID like "AGT001"
      department: text("department").notNull(),
      // 'general', 'technical', 'billing', 'disputes'
      permissions: text("permissions").array().notNull(),
      // Array of permission strings
      isActive: boolean("is_active").default(true),
      maxTicketsPerDay: integer("max_tickets_per_day").default(20),
      responseTimeTarget: integer("response_time_target").default(24),
      // hours
      specializations: text("specializations").array(),
      // Areas of expertise
      languages: text("languages").array().default(["en"]),
      // Languages spoken
      assignedBy: varchar("assigned_by").references(() => users2.id).notNull(),
      suspendedAt: timestamp("suspended_at"),
      suspensionReason: text("suspension_reason"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    contactSettings = pgTable("contact_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      supportEmail: text("support_email").default("findermeisterinnovations@gmail.com"),
      supportPhone: text("support_phone").default("+234-7039391065"),
      officeAddress: text("office_address").default("18 Back of Road safety office, Moniya, Ibadan"),
      businessHours: text("business_hours").default("Mon-Fri, 9 AM - 6 PM WAT"),
      facebookUrl: text("facebook_url").default("https://facebook.com/findermeister"),
      twitterUrl: text("twitter_url").default("https://twitter.com/findermeister"),
      instagramUrl: text("instagram_url").default("https://instagram.com/findermeister"),
      tiktokUrl: text("tiktok_url").default("https://tiktok.com/@findermeisterinnovations"),
      linkedinUrl: text("linkedin_url").default("https://linkedin.com/company/findermeister"),
      whatsappNumber: text("whatsapp_number").default("+234-7039391065"),
      responseTimeLow: text("response_time_low").default("2-3 business days"),
      responseTimeMedium: text("response_time_medium").default("1-2 business days"),
      responseTimeHigh: text("response_time_high").default("4-8 hours"),
      responseTimeUrgent: text("response_time_urgent").default("1-2 hours"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    faqCategories = pgTable("faq_categories", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      description: text("description"),
      icon: text("icon").default("HelpCircle"),
      color: text("color").default("bg-blue-100 text-blue-800"),
      sortOrder: integer("sort_order").default(0),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    userVerifications = pgTable("user_verifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      documentType: text("document_type").notNull(),
      // 'national_id', 'passport', 'drivers_license'
      documentFrontImage: text("document_front_image").notNull(),
      documentBackImage: text("document_back_image"),
      selfieImage: text("selfie_image").notNull(),
      status: text("status").default("pending"),
      // 'pending', 'verified', 'rejected'
      rejectionReason: text("rejection_reason"),
      reviewedBy: varchar("reviewed_by").references(() => users2.id),
      submittedAt: timestamp("submitted_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    supportTickets = pgTable("support_tickets", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      ticketNumber: varchar("ticket_number").notNull().unique(),
      // Human-readable ticket number
      submitterName: text("submitter_name").notNull(),
      submitterEmail: text("submitter_email").notNull(),
      submitterId: varchar("submitter_id").references(() => users2.id),
      // null if anonymous
      category: text("category").notNull(),
      priority: text("priority").notNull(),
      // 'low', 'medium', 'high', 'urgent'
      department: text("department").notNull(),
      subject: text("subject").notNull(),
      description: text("description").notNull(),
      status: text("status").default("open"),
      // 'open', 'assigned', 'in_progress', 'resolved', 'closed'
      assignedTo: varchar("assigned_to").references(() => supportAgents.id),
      assignedAt: timestamp("assigned_at"),
      responseTimeDeadline: timestamp("response_time_deadline"),
      firstResponseAt: timestamp("first_response_at"),
      resolvedAt: timestamp("resolved_at"),
      closedAt: timestamp("closed_at"),
      satisfactionRating: integer("satisfaction_rating"),
      // 1-5 rating
      satisfactionFeedback: text("satisfaction_feedback"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    supportTicketMessages = pgTable("support_ticket_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      ticketId: varchar("ticket_id").references(() => supportTickets.id).notNull(),
      senderId: varchar("sender_id").references(() => users2.id),
      senderType: text("sender_type").notNull(),
      // 'user', 'agent', 'system'
      senderName: text("sender_name").notNull(),
      senderEmail: text("sender_email"),
      content: text("content").notNull(),
      attachments: text("attachments").array(),
      isInternal: boolean("is_internal").default(false),
      // Internal notes between agents
      createdAt: timestamp("created_at").defaultNow()
    });
    supportDepartments = pgTable("support_departments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      description: text("description"),
      color: text("color").default("#3B82F6"),
      // Hex color for UI
      isActive: boolean("is_active").default(true),
      autoAssignments: boolean("is_active").default(true),
      maxResponseTime: integer("max_response_time").default(24),
      // hours
      createdAt: timestamp("created_at").defaultNow()
    });
    insertStrikeSchema = createInsertSchema(strikes).omit({
      id: true,
      createdAt: true
    });
    insertUserRestrictionSchema = createInsertSchema(userRestrictions).omit({
      id: true,
      createdAt: true
    });
    insertDisputeSchema = createInsertSchema(disputes).omit({
      id: true,
      submittedAt: true
    });
    insertBehavioralTrainingSchema = createInsertSchema(behavioralTraining).omit({
      id: true,
      assignedDate: true
    });
    insertTrustedBadgeSchema = createInsertSchema(trustedBadges).omit({
      id: true,
      earnedDate: true
    });
    supportAgentsRelations = relations(supportAgents, ({ one, many }) => ({
      user: one(users2, {
        fields: [supportAgents.userId],
        references: [users2.id]
      }),
      assignedBy: one(users2, {
        fields: [supportAgents.assignedBy],
        references: [users2.id]
      }),
      assignedTickets: many(supportTickets)
    }));
    supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
      submitter: one(users2, {
        fields: [supportTickets.submitterId],
        references: [users2.id]
      }),
      assignedAgent: one(supportAgents, {
        fields: [supportTickets.assignedTo],
        references: [supportAgents.id]
      }),
      messages: many(supportTicketMessages)
    }));
    supportTicketMessagesRelations = relations(supportTicketMessages, ({ one }) => ({
      ticket: one(supportTickets, {
        fields: [supportTicketMessages.ticketId],
        references: [supportTickets.id]
      }),
      sender: one(users2, {
        fields: [supportTicketMessages.senderId],
        references: [users2.id]
      })
    }));
    insertSupportAgentSchema = createInsertSchema(supportAgents).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSupportDepartmentSchema = createInsertSchema(supportDepartments).omit({
      id: true,
      createdAt: true
    });
    faqs = pgTable("faqs", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      question: text("question").notNull(),
      answer: text("answer").notNull(),
      category: text("category").notNull(),
      tags: text("tags").array().default([]),
      isActive: boolean("is_active").notNull().default(true),
      sortOrder: integer("sort_order").default(0),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertFAQSchema = createInsertSchema(faqs).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertFAQCategorySchema = createInsertSchema(faqCategories).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertContactSettingsSchema = createInsertSchema(contactSettings).omit({
      id: true,
      updatedAt: true
    });
    insertUserVerificationSchema = createInsertSchema(userVerifications).omit({
      id: true,
      submittedAt: true,
      reviewedAt: true,
      updatedAt: true
    });
    insertRestrictedWordSchema = createInsertSchema(restrictedWords).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/index.ts
import dotenv2 from "dotenv";
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
init_schema();

// server/db.ts
init_schema();
import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
var { Pool } = pg;
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Current working directory:", process.cwd());
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("railway") ? { rejectUnauthorized: false } : false
});
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, asc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users2).where(eq(users2.id, id)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users2).where(eq(users2.email, email)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(users2).values(user).returning();
    return result[0];
  }
  async updateUser(id, updates) {
    const result = await db.update(users2).set(updates).where(eq(users2.id, id)).returning();
    return result[0];
  }
  async updateUserPassword(id, hashedPassword) {
    await db.update(users2).set({ password: hashedPassword }).where(eq(users2.id, id));
  }
  // Finder operations
  async getFinder(id) {
    const result = await db.select().from(finders).where(eq(finders.id, id)).limit(1);
    return result[0];
  }
  async getFinderByUserId(userId) {
    const result = await db.select().from(finders).where(eq(finders.userId, userId)).limit(1);
    return result[0];
  }
  async createFinder(finder) {
    const result = await db.insert(finders).values(finder).returning();
    return result[0];
  }
  async updateFinder(id, updates) {
    const result = await db.update(finders).set(updates).where(eq(finders.id, id)).returning();
    return result[0];
  }
  async getFinderPendingEarnings(finderId) {
    return { pendingAmount: 0, contractCount: 0 };
  }
  async calculateFinderProfileCompletion(finderId) {
    return { completionPercentage: 100, missingFields: [] };
  }
  // Find operations
  async getFind(id) {
    const result = await db.select().from(finds).where(eq(finds.id, id)).limit(1);
    return result[0];
  }
  async getFindsByClientId(clientId) {
    return await db.select().from(finds).where(eq(finds.clientId, clientId));
  }
  async getAllActiveFinds() {
    return await db.select().from(finds).where(eq(finds.status, "open"));
  }
  async getAllFinds() {
    return await db.select().from(finds);
  }
  async getAvailableFindsForFinders() {
    return await db.select().from(finds).where(eq(finds.status, "open")).orderBy(
      sql2`CASE WHEN ${finds.isBoosted} = true AND ${finds.boostExpiresAt} > NOW() THEN ${finds.boostAmount} ELSE 0 END DESC`,
      desc(finds.createdAt)
    );
  }
  async getFindsForFinderByCategories(finderCategories) {
    const allFinds = await db.select().from(finds).where(eq(finds.status, "open")).orderBy(desc(finds.isBoosted), desc(finds.boostAmount), desc(finds.createdAt));
    const matchingFinds = allFinds.filter(
      (find) => finderCategories.some(
        (category) => find.category.toLowerCase() === category.toLowerCase()
      )
    );
    const otherFinds = allFinds.filter(
      (find) => !finderCategories.some(
        (category) => find.category.toLowerCase() === category.toLowerCase()
      )
    );
    return [...matchingFinds, ...otherFinds];
  }
  async createFind(find) {
    const result = await db.insert(finds).values(find).returning();
    return result[0];
  }
  async updateFind(id, updates) {
    const result = await db.update(finds).set(updates).where(eq(finds.id, id)).returning();
    return result[0];
  }
  // Proposal operations
  async getProposal(id) {
    const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
    return result[0];
  }
  async getProposalsByFindId(findId) {
    return await db.select().from(proposals).where(eq(proposals.findId, findId));
  }
  async getProposalsByFinderId(finderId) {
    return await db.select().from(proposals).where(eq(proposals.finderId, finderId));
  }
  async getAllProposals() {
    return await db.select().from(proposals);
  }
  async getProposalByFinderAndFind(finderId, findId) {
    const result = await db.select().from(proposals).where(and(eq(proposals.finderId, finderId), eq(proposals.findId, findId))).limit(1);
    return result[0];
  }
  async hasAcceptedProposal(findId) {
    const result = await db.select().from(proposals).where(and(eq(proposals.findId, findId), eq(proposals.status, "accepted"))).limit(1);
    return result.length > 0;
  }
  async getClientContactForAcceptedProposal(proposalId, finderId) {
    return void 0;
  }
  async createProposal(proposal) {
    const result = await db.insert(proposals).values(proposal).returning();
    return result[0];
  }
  async updateProposal(id, updates) {
    const result = await db.update(proposals).set(updates).where(eq(proposals.id, id)).returning();
    return result[0];
  }
  // Contract operations
  async getContract(id) {
    const result = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
    return result[0];
  }
  async getContractsByClientId(clientId) {
    return await db.select().from(contracts).where(eq(contracts.clientId, clientId));
  }
  async getContractsByFinderId(finderId) {
    return await db.select().from(contracts).where(eq(contracts.finderId, finderId));
  }
  async getContractDetails(contractId, finderId) {
    const result = await db.select({
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
    }).from(contracts).innerJoin(finds, eq(contracts.findId, finds.id)).where(and(eq(contracts.id, contractId), eq(contracts.finderId, finderId))).limit(1);
    return result[0];
  }
  async createContract(contract) {
    const result = await db.insert(contracts).values(contract).returning();
    return result[0];
  }
  async updateContract(id, updates) {
    const result = await db.update(contracts).set(updates).where(eq(contracts.id, id)).returning();
    return result[0];
  }
  // Review operations
  async createReview(review) {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }
  async getReviewsByFinderId(finderId) {
    return await db.select().from(reviews).where(eq(reviews.finderId, finderId));
  }
  // Findertoken operations
  async getFindertokenBalance(finderId) {
    const result = await db.select().from(findertokens).where(eq(findertokens.finderId, finderId)).limit(1);
    return result[0];
  }
  async createFindertokenRecord(finderId) {
    const result = await db.insert(findertokens).values({ finderId, balance: 0 }).returning();
    return result[0];
  }
  async updateFindertokenBalance(finderId, newBalance) {
    const result = await db.update(findertokens).set({ balance: newBalance }).where(eq(findertokens.finderId, finderId)).returning();
    return result[0];
  }
  async updateFinderTokenBalance(finderId, newBalance) {
    await db.update(finders).set({ findertokenBalance: newBalance }).where(eq(finders.id, finderId));
  }
  async syncFinderTokenBalances() {
    try {
      const allFinders = await db.select().from(finders);
      for (const finder of allFinders) {
        const transactions2 = await db.select().from(transactions2).where(eq(transactions2.finderId, finder.id));
        const calculatedBalance = transactions2.reduce((sum, transaction) => {
          return sum + transaction.amount;
        }, 0);
        if (finder.findertokenBalance !== calculatedBalance) {
          await db.update(finders).set({ findertokenBalance: calculatedBalance }).where(eq(finders.id, finder.id));
        }
      }
    } catch (error) {
      console.error("Error syncing finder token balances:", error);
      throw error;
    }
  }
  // Transaction operations
  async createTransaction(transaction) {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }
  async getTransactionsByFinderId(finderId) {
    return await db.select().from(transactions).where(eq(transactions.finderId, finderId));
  }
  async getTransactionsByUserId(userId) {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }
  async getTransactionByReference(reference) {
    const result = await db.select().from(transactions).where(eq(transactions.reference, reference)).limit(1);
    return result[0];
  }
  async getAllTransactionsWithUsers() {
    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
    const transactionsWithUsers = await Promise.all(
      allTransactions.map(async (transaction) => {
        let user = null;
        let finder = null;
        if (transaction.userId) {
          user = await this.getUser(transaction.userId);
        }
        if (transaction.finderId) {
          const finderRecord = await this.getFinder(transaction.finderId);
          if (finderRecord) {
            const finderUser = await this.getUser(finderRecord.userId);
            finder = {
              ...finderRecord,
              user: finderUser
            };
          }
        }
        return {
          ...transaction,
          user,
          finder
        };
      })
    );
    return transactionsWithUsers;
  }
  async getAllContractsWithUsers() {
    const contracts2 = await db.select().from(contracts2);
    const contractsWithDetails = await Promise.all(
      contracts2.map(async (contract) => {
        const client = await this.getUser(contract.clientId);
        const finder = await this.getFinder(contract.finderId);
        const finderUser = finder ? await this.getUser(finder.userId) : null;
        const proposal = await this.getProposal(contract.proposalId);
        const find = proposal ? await this.getFind(proposal.findId) : null;
        return {
          ...contract,
          clientName: client ? `${client.firstName} ${client.lastName}` : null,
          finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : null,
          findTitle: find?.title || null
        };
      })
    );
    return contractsWithDetails;
  }
  async getAllContractsWithTransactions() {
    try {
      const contractsData = await db.select().from(contracts);
      const contractsWithDetails = await Promise.all(
        contractsData.map(async (contract) => {
          const client = await this.getUser(contract.clientId);
          const finder = await this.getFinder(contract.finderId);
          const finderUser = finder ? await this.getUser(finder.userId) : null;
          const proposal = await this.getProposal(contract.proposalId);
          const find = proposal ? await this.getFind(proposal.findId) : null;
          const contractTransactions = await db.select().from(transactions).where(
            and(
              eq(transactions.userId, contract.clientId),
              eq(transactions.type, "contract_payment")
            )
          ).orderBy(desc(transactions.createdAt)).limit(10);
          const contractTransaction = contractTransactions.find(
            (t) => parseFloat(t.amount.toString()) === parseFloat(contract.amount)
          );
          return {
            ...contract,
            clientName: client ? `${client.firstName} ${client.lastName}` : null,
            finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : null,
            findTitle: find?.title || null,
            paymentReference: contractTransaction?.reference || null,
            transactionId: contractTransaction?.id || null
          };
        })
      );
      return contractsWithDetails;
    } catch (error) {
      console.error("Error in getAllContractsWithTransactions:", error);
      throw error;
    }
  }
  // Admin operations
  async getAllUsers() {
    return await db.select().from(users2);
  }
  async getAdminSetting(key) {
    const result = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
    return result[0];
  }
  async getAdminSettings() {
    const settings = await db.select().from(adminSettings);
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
  async setAdminSetting(key, value) {
    const result = await db.insert(adminSettings).values({ key, value }).onConflictDoUpdate({ target: adminSettings.key, set: { value } }).returning();
    return result[0];
  }
  // Client operations
  async getClientProfile(clientId) {
    return this.getUser(clientId);
  }
  async deductClientFindertokens(clientId, amount, description) {
    try {
      const currentBalance = await this.getClientTokenBalance(clientId);
      if (currentBalance < amount) {
        throw new Error(`Insufficient tokens. Required: ${amount}, Available: ${currentBalance}`);
      }
      await db.insert(clientTokenGrants).values({
        clientId,
        amount: -amount,
        // Negative amount for deduction
        reason: description,
        grantedBy: clientId
        // Self-deduction
      });
      await db.insert(transactions).values({
        userId: clientId,
        amount: -amount,
        type: "find_posting",
        description
      });
    } catch (error) {
      console.error("Error deducting client findertokens:", error);
      throw error;
    }
  }
  async addClientFindertokens(clientId, amount, description) {
    try {
      await db.insert(clientTokenGrants).values({
        clientId,
        amount,
        reason: description,
        grantedBy: clientId
        // Self-grant for purchases
      });
      const newBalance = await this.getClientTokenBalance(clientId);
      return { success: true, newBalance };
    } catch (error) {
      console.error("Error adding client findertokens:", error);
      return { success: false, newBalance: 0 };
    }
  }
  async getClientTokenBalance(clientId) {
    try {
      const grants = await db.select().from(clientTokenGrants).where(eq(clientTokenGrants.clientId, clientId));
      return grants.reduce((total, grant) => total + grant.amount, 0);
    } catch (error) {
      console.error("Error getting client token balance:", error);
      return 0;
    }
  }
  // Token charging
  async chargeFinderTokens(finderId, amount, reason, chargedBy) {
    return true;
  }
  // Category operations
  async getCategories() {
    return await db.select().from(categories);
  }
  async getAllCategories() {
    return await db.select().from(categories).orderBy(desc(categories.createdAt));
  }
  async getActiveCategories() {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }
  async createCategory(category) {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }
  async updateCategory(id, updates) {
    const result = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return result[0];
  }
  async deleteCategory(id) {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }
  // User management operations
  async banUser(userId, reason) {
    const result = await db.update(users2).set({ isBanned: true, bannedReason: reason, bannedAt: /* @__PURE__ */ new Date() }).where(eq(users2.id, userId)).returning();
    return result[0];
  }
  async unbanUser(userId) {
    const result = await db.update(users2).set({ isBanned: false, bannedReason: null, bannedAt: null }).where(eq(users2.id, userId)).returning();
    return result[0];
  }
  async verifyUser(userId) {
    const result = await db.update(users2).set({ isVerified: true }).where(eq(users2.id, userId)).returning();
    return result[0];
  }
  async unverifyUser(userId) {
    const result = await db.update(users2).set({ isVerified: false }).where(eq(users2.id, userId)).returning();
    return result[0];
  }
  async verifyFinder(finderId) {
    const result = await db.update(finders).set({ isVerified: true }).where(eq(finders.id, finderId)).returning();
    return result[0] || null;
  }
  async unverifyFinder(finderId) {
    const result = await db.update(finders).set({ isVerified: false }).where(eq(finders.id, finderId)).returning();
    return result[0] || null;
  }
  // Withdrawal operations
  async createWithdrawalRequest(request) {
    const result = await db.insert(withdrawalRequests).values(request).returning();
    return result[0];
  }
  async getWithdrawalRequests() {
    const allWithdrawals = await db.select().from(withdrawalRequests).orderBy(desc(withdrawalRequests.requestedAt));
    const withdrawalsWithFinders = await Promise.all(
      allWithdrawals.map(async (withdrawal) => {
        const finder = await this.getFinder(withdrawal.finderId);
        let finderUser = null;
        if (finder) {
          finderUser = await this.getUser(finder.userId);
        }
        return {
          ...withdrawal,
          finder: finder ? {
            ...finder,
            user: finderUser
          } : null
        };
      })
    );
    return withdrawalsWithFinders;
  }
  async updateWithdrawalRequest(id, updates) {
    const result = await db.update(withdrawalRequests).set(updates).where(eq(withdrawalRequests.id, id)).returning();
    return result[0];
  }
  async updateFinderBalance(finderId, amount) {
    await db.update(finders).set({ availableBalance: amount }).where(eq(finders.id, finderId));
  }
  async releaseFundsToFinder(finderId, amount) {
    console.log(`Releasing funds to finder ${finderId}: ${amount}`);
    const finder = await this.getFinder(finderId);
    if (!finder) {
      throw new Error("Finder not found");
    }
    const releaseAmount = parseFloat(amount);
    if (isNaN(releaseAmount) || releaseAmount <= 0) {
      throw new Error(`Invalid release amount: ${amount}`);
    }
    const currentAvailable = parseFloat(finder.availableBalance || "0");
    const currentTotal = parseFloat(finder.totalEarned || "0");
    const newAvailable = currentAvailable + releaseAmount;
    const newTotal = currentTotal + releaseAmount;
    console.log(`Finder ${finderId} - Current available: ${currentAvailable}, releasing: ${releaseAmount}, new available: ${newAvailable}`);
    const updateResult = await db.update(finders).set({
      availableBalance: newAvailable.toFixed(2),
      totalEarned: newTotal.toFixed(2),
      jobsCompleted: sql2`COALESCE(${finders.jobsCompleted}, 0) + 1`
    }).where(eq(finders.id, finderId)).returning();
    if (!updateResult || updateResult.length === 0) {
      throw new Error("Failed to update finder balance");
    }
    console.log(`Database update result:`, updateResult[0]);
    await this.createTransaction({
      userId: finder.userId,
      finderId,
      type: "earnings_release",
      amount: releaseAmount,
      description: `Earnings released to available balance: \u20A6${releaseAmount.toFixed(2)}`
    });
    const updatedFinder = await this.getFinder(finderId);
    console.log(`Funds released successfully. Verified balance: ${updatedFinder?.availableBalance}`);
  }
  async getWithdrawalSettings(finderId) {
    try {
      const existingSettings = await db.query.withdrawalSettings?.findFirst({
        where: eq(withdrawalSettings.finderId, finderId)
      });
      if (existingSettings) {
        let bankDetails2 = {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          routingNumber: ""
        };
        if (existingSettings.bankDetails) {
          try {
            bankDetails2 = typeof existingSettings.bankDetails === "string" ? JSON.parse(existingSettings.bankDetails) : existingSettings.bankDetails;
          } catch (error) {
            console.error("Error parsing bank details:", error);
          }
        }
        return {
          paymentMethod: existingSettings.paymentMethod || "bank_transfer",
          minimumThreshold: existingSettings.minimumThreshold || 50,
          bankDetails: bankDetails2
        };
      }
    } catch (error) {
      console.log("Withdrawal settings table not found, trying fallback method");
    }
    const recentWithdrawals = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.finderId, finderId)).orderBy(sql2`${withdrawalRequests.requestedAt} DESC`).limit(1);
    let bankDetails = {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      routingNumber: ""
    };
    if (recentWithdrawals.length > 0 && recentWithdrawals[0].paymentDetails) {
      try {
        const paymentDetails = typeof recentWithdrawals[0].paymentDetails === "string" ? JSON.parse(recentWithdrawals[0].paymentDetails) : recentWithdrawals[0].paymentDetails;
        bankDetails = {
          bankName: paymentDetails.bankName || "",
          accountNumber: paymentDetails.accountNumber || "",
          accountHolder: paymentDetails.accountHolder || paymentDetails.accountName || "",
          routingNumber: paymentDetails.routingNumber || ""
        };
      } catch (error) {
        console.error("Error parsing payment details:", error);
      }
    }
    return {
      paymentMethod: "bank_transfer",
      minimumThreshold: 50,
      bankDetails
    };
  }
  async updateWithdrawalSettings(finderId, settings) {
    console.log("Storage: Updating withdrawal settings for finder:", finderId);
    console.log("Storage: Settings data:", JSON.stringify(settings, null, 2));
    try {
      if (!settings.bankDetails || !settings.bankDetails.bankName || !settings.bankDetails.accountNumber || !settings.bankDetails.accountHolder) {
        throw new Error("Invalid bank details: bankName, accountNumber, and accountHolder are required");
      }
      const settingsData = {
        finderId,
        paymentMethod: settings.paymentMethod || "bank_transfer",
        minimumThreshold: settings.minimumThreshold || 50,
        bankDetails: JSON.stringify(settings.bankDetails),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const existing = await db.select().from(withdrawalSettings).where(eq(withdrawalSettings.finderId, finderId)).limit(1);
      if (existing.length > 0) {
        const result = await db.update(withdrawalSettings).set(settingsData).where(eq(withdrawalSettings.finderId, finderId)).returning();
        console.log("Storage: Updated existing settings:", result[0]);
        return result[0];
      } else {
        const result = await db.insert(withdrawalSettings).values(settingsData).returning();
        console.log("Storage: Created new settings:", result[0]);
        return result[0];
      }
    } catch (error) {
      console.error("Storage: Error updating withdrawal settings:", error);
      throw error;
    }
  }
  async getWithdrawalsByFinderId(finderId) {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.finderId, finderId));
  }
  async getCompletedContractsByFinder(finderId) {
    return await db.select().from(contracts).where(and(eq(contracts.finderId, finderId), eq(contracts.isCompleted, true)));
  }
  async getPendingEarnings(finderId) {
    const pendingContracts = await db.select().from(contracts).where(
      and(
        eq(contracts.finderId, finderId),
        eq(contracts.isCompleted, true),
        eq(contracts.escrowStatus, "funded")
        // Completed but not released
      )
    );
    const feePercentageSetting = await this.getAdminSetting("finder_earnings_charge_percentage");
    const feePercentage = parseFloat(feePercentageSetting || "5");
    let grossAmount = 0;
    let feeAmount = 0;
    pendingContracts.forEach((contract) => {
      const amount = parseFloat(contract.amount);
      grossAmount += amount;
      feeAmount += amount * feePercentage / 100;
    });
    const netAmount = grossAmount - feeAmount;
    return {
      grossAmount,
      feeAmount,
      netAmount,
      contractCount: pendingContracts.length
    };
  }
  async getConversation(clientId, proposalId) {
    const result = await db.select().from(conversations).where(and(eq(conversations.clientId, clientId), eq(conversations.proposalId, proposalId))).limit(1);
    return result[0];
  }
  async getConversationById(conversationId) {
    const result = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
    return result[0];
  }
  async getConversationByProposal(proposalId) {
    const result = await db.select().from(conversations).where(eq(conversations.proposalId, proposalId)).limit(1);
    return result[0];
  }
  async createConversation(conversation) {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }
  async getConversationsByClientId(clientId) {
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
          firstName: users2.firstName,
          lastName: users2.lastName
        }
      }
    }).from(conversations).innerJoin(proposals, eq(conversations.proposalId, proposals.id)).innerJoin(finds, eq(proposals.findId, finds.id)).innerJoin(finders, eq(conversations.finderId, finders.id)).innerJoin(users2, eq(finders.userId, users2.id)).where(eq(conversations.clientId, clientId)).orderBy(desc(conversations.lastMessageAt));
  }
  async getConversationsByFinderId(finderId) {
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
        firstName: users2.firstName,
        lastName: users2.lastName
      }
    }).from(conversations).innerJoin(proposals, eq(conversations.proposalId, proposals.id)).innerJoin(finds, eq(proposals.findId, finds.id)).innerJoin(users2, eq(conversations.clientId, users2.id)).where(eq(conversations.finderId, finderId)).orderBy(desc(conversations.lastMessageAt));
  }
  async getMessages(conversationId) {
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
        firstName: users2.firstName,
        lastName: users2.lastName
      }
    }).from(messages).innerJoin(users2, eq(messages.senderId, users2.id)).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }
  async createMessage(message) {
    const result = await db.insert(messages).values(message).returning();
    await db.update(conversations).set({ lastMessageAt: /* @__PURE__ */ new Date() }).where(eq(conversations.id, message.conversationId));
    return result[0];
  }
  async markMessagesAsRead(conversationId, userId) {
  }
  async getFinderProfile(finderId) {
    return null;
  }
  // Blog operations
  async getBlogPosts() {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }
  async getAllBlogPosts() {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      return [];
    }
  }
  async getBlogPost(id) {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return void 0;
    }
  }
  async getBlogPostBySlug(slug) {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return void 0;
    }
  }
  async getPublishedBlogPosts() {
    try {
      return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      return [];
    }
  }
  async createBlogPost(post) {
    try {
      const result = await db.insert(blogPosts).values({
        ...post,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }
  async updateBlogPost(id, updates) {
    try {
      console.log("Storage: Updating blog post with ID:", id);
      console.log("Storage: Updates:", updates);
      const existing = await this.getBlogPost(id);
      if (!existing) {
        console.log("Storage: Blog post not found for update:", id);
        return void 0;
      }
      const result = await db.update(blogPosts).set({
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(blogPosts.id, id)).returning();
      console.log("Storage: Blog post update result:", result);
      return result[0];
    } catch (error) {
      console.error("Error updating blog post:", error);
      return void 0;
    }
  }
  async deleteBlogPost(id) {
    try {
      console.log("Storage: Attempting to delete blog post with ID:", id);
      const existing = await this.getBlogPost(id);
      if (!existing) {
        console.log("Storage: Blog post not found for deletion:", id);
        return false;
      }
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      console.log("Storage: Blog post delete result:", result);
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }
  // Order submission operations
  async createOrderSubmission(submission) {
    const result = await db.insert(orderSubmissions).values(submission).returning();
    await db.update(contracts).set({ hasSubmission: true }).where(eq(contracts.id, submission.contractId));
    return result[0];
  }
  async getOrderSubmissionByContractId(contractId) {
    const submissions = await db.select().from(orderSubmissions).where(eq(orderSubmissions.contractId, contractId)).limit(1);
    return submissions[0] || null;
  }
  async updateOrderSubmission(id, updates) {
    const result = await db.update(orderSubmissions).set(updates).where(eq(orderSubmissions.id, id)).returning();
    return result[0];
  }
  async getContractWithSubmission(contractId) {
    const contractResult = await db.select().from(contracts).where(eq(contracts.id, contractId)).limit(1);
    if (!contractResult[0]) return void 0;
    const contract = contractResult[0];
    const orderSubmission = await this.getOrderSubmissionByContractId(contractId);
    const finder = await this.getFinder(contract.finderId);
    return {
      ...contract,
      orderSubmission,
      finder
    };
  }
  async createOrUpdateOrderSubmission(data) {
    const existing = await this.getOrderSubmissionByContractId(data.contractId);
    if (existing) {
      const updated = await db.update(orderSubmissions).set({
        submissionText: data.submissionText,
        attachmentPaths: data.attachmentPaths,
        status: data.status,
        submittedAt: data.submittedAt
      }).where(eq(orderSubmissions.contractId, data.contractId)).returning();
      return updated[0];
    } else {
      const created = await db.insert(orderSubmissions).values({
        contractId: data.contractId,
        finderId: data.finderId,
        submissionText: data.submissionText,
        attachmentPaths: data.attachmentPaths,
        status: data.status,
        submittedAt: data.submittedAt,
        autoReleaseDate: new Date(Date.now() + 48 * 60 * 60 * 1e3)
        // 48 hours from now
      }).returning();
      return created[0];
    }
  }
  // Finder level operations
  async getFinderLevels() {
    return await db.select().from(finderLevels).orderBy(asc(finderLevels.order));
  }
  async getFinderLevel(id) {
    const result = await db.select().from(finderLevels).where(eq(finderLevels.id, id)).limit(1);
    return result[0];
  }
  async createFinderLevel(level) {
    const result = await db.insert(finderLevels).values(level).returning();
    return result[0];
  }
  async updateFinderLevel(id, updates) {
    const result = await db.update(finderLevels).set(updates).where(eq(finderLevels.id, id)).returning();
    return result[0];
  }
  async deleteFinderLevel(id) {
    try {
      const result = await db.delete(finderLevels).where(eq(finderLevels.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting finder level:", error);
      return false;
    }
  }
  async calculateFinderLevel(finderId) {
    return void 0;
  }
  async assignFinderLevel(finderId, levelId) {
  }
  // Monthly token distribution operations
  async distributeMonthlyTokens() {
    try {
      const currentDate = /* @__PURE__ */ new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const monthlyTokenAmount = 20;
      const allFinders = await db.select().from(finders);
      let distributed = 0;
      let alreadyDistributed = 0;
      for (const finder of allFinders) {
        const hasReceived = await this.hasReceivedMonthlyTokens(finder.id, currentMonth, currentYear);
        if (!hasReceived) {
          const currentBalance = finder.findertokenBalance || 0;
          await db.update(finders).set({ findertokenBalance: currentBalance + monthlyTokenAmount }).where(eq(finders.id, finder.id));
          await db.insert(monthlyTokenDistributions).values({
            finderId: finder.id,
            month: currentMonth,
            year: currentYear,
            tokensGranted: monthlyTokenAmount,
            distributedAt: /* @__PURE__ */ new Date()
          });
          await db.insert(transactions).values({
            userId: finder.userId,
            finderId: finder.id,
            amount: monthlyTokenAmount,
            type: "monthly_distribution",
            description: `Monthly token distribution: ${monthlyTokenAmount} tokens for ${currentMonth}/${currentYear}`
          });
          distributed++;
        } else {
          alreadyDistributed++;
        }
      }
      return { distributed, alreadyDistributed };
    } catch (error) {
      console.error("Error distributing monthly tokens:", error);
      throw error;
    }
  }
  async getMonthlyDistributions(month, year) {
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
            firstName: users2.firstName,
            lastName: users2.lastName,
            email: users2.email
          }
        }
      }).from(monthlyTokenDistributions).innerJoin(finders, eq(monthlyTokenDistributions.finderId, finders.id)).innerJoin(users2, eq(finders.userId, users2.id)).where(and(
        eq(monthlyTokenDistributions.month, month),
        eq(monthlyTokenDistributions.year, year)
      )).orderBy(desc(monthlyTokenDistributions.distributedAt));
    } catch (error) {
      console.error("Error fetching monthly distributions:", error);
      return [];
    }
  }
  async hasReceivedMonthlyTokens(finderId, month, year) {
    try {
      const result = await db.select().from(monthlyTokenDistributions).where(and(
        eq(monthlyTokenDistributions.finderId, finderId),
        eq(monthlyTokenDistributions.month, month),
        eq(monthlyTokenDistributions.year, year)
      )).limit(1);
      return result.length > 0;
    } catch (error) {
      console.error("Error checking monthly tokens:", error);
      return false;
    }
  }
  async createMonthlyDistribution(distribution) {
    const result = await db.insert(monthlyTokenDistributions).values(distribution).returning();
    return result[0];
  }
  // Token grant operations
  async grantTokensToFinder(finderId, amount, reason, grantedBy) {
    await db.update(finders).set({
      findertokenBalance: sql2`${finders.findertokenBalance} + ${amount}`
    }).where(eq(finders.id, finderId));
    const [grant] = await db.insert(tokenGrants).values({
      finderId,
      amount,
      reason,
      grantedBy
    }).returning();
    await db.insert(transactions).values({
      userId: (await db.select({ userId: finders.userId }).from(finders).where(eq(finders.id, finderId)))[0].userId,
      finderId,
      amount,
      type: "findertoken_grant",
      description: `Token grant: ${reason}`
    });
    return grant;
  }
  async grantTokensToClient(clientId, amount, reason, grantedBy) {
    await db.update(users2).set({
      findertokenBalance: sql2`${users2.findertokenBalance} + ${amount}`
    }).where(eq(users2.id, clientId));
    const [grant] = await db.insert(clientTokenGrants).values({
      clientId,
      amount,
      reason,
      grantedBy
    }).returning();
    await db.insert(transactions).values({
      userId: clientId,
      amount,
      type: "findertoken_grant",
      description: `Token grant: ${reason}`
    });
    return grant;
  }
  async getTokenGrants(userId) {
    let finderQuery = db.select({
      id: tokenGrants.id,
      finderId: tokenGrants.finderId,
      userId: finders.userId,
      userType: sql2`'finder'`,
      amount: tokenGrants.amount,
      reason: tokenGrants.reason,
      grantedBy: tokenGrants.grantedBy,
      createdAt: tokenGrants.createdAt,
      user: {
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      },
      grantedByUser: {
        firstName: grantedByUsers.firstName,
        lastName: grantedByUsers.lastName
      }
    }).from(tokenGrants).leftJoin(finders, eq(tokenGrants.finderId, finders.id)).leftJoin(users2, eq(finders.userId, users2.id)).leftJoin(grantedByUsers, eq(tokenGrants.grantedBy, grantedByUsers.id));
    let clientQuery = db.select({
      id: clientTokenGrants.id,
      finderId: sql2`null`,
      userId: clientTokenGrants.clientId,
      userType: sql2`'client'`,
      amount: clientTokenGrants.amount,
      reason: clientTokenGrants.reason,
      grantedBy: clientTokenGrants.grantedBy,
      createdAt: clientTokenGrants.createdAt,
      user: {
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      },
      grantedByUser: {
        firstName: grantedByUsers.firstName,
        lastName: grantedByUsers.lastName
      }
    }).from(clientTokenGrants).leftJoin(users2, eq(clientTokenGrants.clientId, users2.id)).leftJoin(grantedByUsers, eq(clientTokenGrants.grantedBy, grantedByUsers.id));
    if (userId) {
      finderQuery = finderQuery.where(eq(finders.userId, userId));
      clientQuery = clientQuery.where(eq(users2.id, userId));
    }
    const [finderGrants, clientGrants] = await Promise.all([
      finderQuery,
      clientQuery
    ]);
    const allGrants = [...finderGrants, ...clientGrants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return allGrants;
  }
  async getAllFindersForTokens() {
    return [];
  }
  // Strike system operations
  async issueStrike(strike) {
    const result = await db.insert(strikes).values({
      ...strike,
      strikeCount: strike.violationLevel === "low" ? 1 : strike.violationLevel === "medium" ? 3 : 5,
      // Example logic: low=1, medium=3, high=5 strikes
      status: "active",
      issuedAt: /* @__PURE__ */ new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
      // Example: expires in 30 days
    }).returning();
    return result[0];
  }
  async getStrikesByUserId(userId) {
    return await db.select().from(strikes).where(eq(strikes.userId, userId));
  }
  async getActiveStrikesCount(userId) {
    try {
      const result = await db.select({ count: sql2`count(*)` }).from(strikes).where(and(eq(strikes.userId, userId), eq(strikes.status, "active")));
      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error getting active strikes count:", error);
      return 0;
    }
  }
  async getUserTotalStrikeCount(userId) {
    try {
      const result = await db.select({ total: sql2`sum(${strikes.strikeCount})` }).from(strikes).where(and(eq(strikes.userId, userId), eq(strikes.status, "active")));
      return result[0]?.total || 0;
    } catch (error) {
      console.error("Error getting total strike count:", error);
      return 0;
    }
  }
  async updateStrike(id, updates) {
    const result = await db.update(strikes).set(updates).where(eq(strikes.id, id)).returning();
    return result[0];
  }
  // User restrictions operations
  async createUserRestriction(restriction) {
    throw new Error("Not implemented");
  }
  async getUserActiveRestrictions(userId) {
    return [];
  }
  async updateUserRestriction(id, updates) {
    return void 0;
  }
  // Dispute operations
  async createDispute(dispute) {
    const result = await db.insert(disputes).values(dispute).returning();
    return result[0];
  }
  async getDisputesByUserId(userId) {
    return await db.select().from(disputes).where(eq(disputes.userId, userId));
  }
  async getAllDisputes() {
    return await db.select().from(disputes).orderBy(desc(disputes.submittedAt));
  }
  async updateDispute(id, updates) {
    const result = await db.update(disputes).set(updates).where(eq(disputes.id, id)).returning();
    return result[0];
  }
  // Training operations
  async assignTraining(training) {
    throw new Error("Not implemented");
  }
  async getTrainingsByUserId(userId) {
    return [];
  }
  async updateTraining(id, updates) {
    return void 0;
  }
  // Badge operations
  async awardBadge(badge) {
    throw new Error("Not implemented");
  }
  async getUserBadges(userId) {
    return [];
  }
  async updateBadge(id, updates) {
    return void 0;
  }
  // Strike analysis
  async getUserStrikeLevel(userId) {
    const totalStrikes = await this.getUserTotalStrikeCount(userId);
    if (totalStrikes >= 10) {
      return 3;
    } else if (totalStrikes >= 7) {
      return 2;
    } else if (totalStrikes >= 4) {
      return 1;
    } else {
      return 0;
    }
  }
  // Token packages
  async getAllTokenPackages() {
    return await db.select().from(tokenPackages).orderBy(desc(tokenPackages.createdAt));
  }
  async getActiveTokenPackages() {
    try {
      return await db.select().from(tokenPackages).where(eq(tokenPackages.isActive, true)).orderBy(desc(tokenPackages.createdAt));
    } catch (error) {
      console.error("Error fetching active token packages:", error);
      return [];
    }
  }
  async getTokenPackage(id) {
    try {
      const result = await db.select().from(tokenPackages).where(eq(tokenPackages.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching token package:", error);
      return void 0;
    }
  }
  async createTokenPackage(tokenPackage) {
    const result = await db.insert(tokenPackages).values(tokenPackage).returning();
    return result[0];
  }
  async updateTokenPackage(id, updates) {
    try {
      console.log("Updating token package:", id, "with updates:", updates);
      const result = await db.update(tokenPackages).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tokenPackages.id, id)).returning();
      console.log("Token package update result:", result);
      return result[0];
    } catch (error) {
      console.error("Error updating token package:", error);
      return void 0;
    }
  }
  async deleteTokenPackage(id) {
    try {
      const result = await db.delete(tokenPackages).where(eq(tokenPackages.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting token package:", error);
      return false;
    }
  }
  // Restricted words
  async addRestrictedWord(word) {
    const result = await db.insert(restrictedWords).values(word).returning();
    return result[0];
  }
  async getRestrictedWords() {
    return await db.select().from(restrictedWords).orderBy(desc(restrictedWords.createdAt));
  }
  async deleteRestrictedWord(id) {
    try {
      console.log("Storage: Attempting to delete restricted word with ID:", id);
      const result = await db.delete(restrictedWords).where(eq(restrictedWords.id, id)).returning();
      console.log("Storage: Delete result:", result);
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting restricted word:", error);
      return false;
    }
  }
  async removeRestrictedWord(id) {
    return this.deleteRestrictedWord(id);
  }
  async updateRestrictedWord(id, updates) {
    const result = await db.update(restrictedWords).set(updates).where(eq(restrictedWords.id, id)).returning();
    return result[0];
  }
  async checkContentForRestrictedWords(content) {
    const words = await this.getRestrictedWords();
    const foundWords = words.filter((word) => content.toLowerCase().includes(word.word.toLowerCase())).map((word) => word.word);
    return foundWords;
  }
  // Support operations
  async createSupportAgent(data) {
    const result = await db.insert(supportAgents).values({
      ...data,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return result[0];
  }
  async getSupportAgents() {
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
        id: users2.id,
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      }
    }).from(supportAgents).innerJoin(users2, eq(supportAgents.userId, users2.id)).orderBy(desc(supportAgents.createdAt));
    return result;
  }
  async getSupportAgent(id) {
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
        id: users2.id,
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      }
    }).from(supportAgents).innerJoin(users2, eq(supportAgents.userId, users2.id)).where(eq(supportAgents.id, id)).limit(1);
    return result[0];
  }
  async updateSupportAgent(id, data) {
    const result = await db.update(supportAgents).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(supportAgents.id, id)).returning();
    return result[0];
  }
  async suspendSupportAgent(id, reason) {
    const result = await db.update(supportAgents).set({
      isActive: false,
      suspendedAt: /* @__PURE__ */ new Date(),
      suspensionReason: reason,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(supportAgents.id, id)).returning();
    return result[0];
  }
  async reactivateSupportAgent(id) {
    const result = await db.update(supportAgents).set({
      isActive: true,
      suspendedAt: null,
      suspensionReason: null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(supportAgents.id, id)).returning();
    return result[0];
  }
  async deleteSupportAgent(id) {
    const result = await db.delete(supportAgents).where(eq(supportAgents.id, id)).returning();
    return result.length > 0;
  }
  async generateAgentId() {
    const lastAgent = await db.select({ agentId: supportAgents.agentId }).from(supportAgents).orderBy(desc(supportAgents.createdAt)).limit(1);
    if (lastAgent.length === 0) {
      return "AGT001";
    }
    const lastNumber = parseInt(lastAgent[0].agentId.replace("AGT", ""));
    const nextNumber = lastNumber + 1;
    return `AGT${nextNumber.toString().padStart(3, "0")}`;
  }
  async getSupportDepartments() {
    return await db.select({
      id: supportDepartments.id,
      name: supportDepartments.name,
      isActive: supportDepartments.isActive,
      createdAt: supportDepartments.createdAt,
      updatedAt: supportDepartments.updatedAt
    }).from(supportDepartments);
  }
  async createSupportDepartment(data) {
    const result = await db.insert(supportDepartments).values({
      ...data,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return result[0];
  }
  async updateSupportDepartment(id, data) {
    const result = await db.update(supportDepartments).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(supportDepartments.id, id)).returning();
    return result[0];
  }
  async deleteSupportDepartment(id) {
    const result = await db.delete(supportDepartments).where(eq(supportDepartments.id, id)).returning();
    return result.length > 0;
  }
  async getUserSupportAgent(userId) {
    const result = await db.select().from(supportAgents).where(eq(supportAgents.userId, userId)).limit(1);
    return result[0];
  }
  async generateWithdrawalRequestId() {
    return "WR-2025-001";
  }
  // Contact settings
  async getContactSettings() {
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
      console.error("Error fetching contact settings:", error);
      return null;
    }
  }
  async updateContactSettings(settings) {
    try {
      const existing = await db.select().from(contactSettings).limit(1);
      if (existing.length > 0) {
        const result = await db.update(contactSettings).set({
          ...settings,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(contactSettings.id, existing[0].id)).returning();
        return result[0];
      } else {
        const result = await db.insert(contactSettings).values({
          ...settings,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return result[0];
      }
    } catch (error) {
      console.error("Error updating contact settings:", error);
      throw error;
    }
  }
  // FAQ operations
  async getFAQCategories() {
    try {
      return await db.select().from(faqCategories).orderBy(asc(faqCategories.sortOrder));
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      return [];
    }
  }
  async getFAQCategory(id) {
    try {
      const result = await db.select().from(faqCategories).where(eq(faqCategories.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching FAQ category by ID:", error);
      return null;
    }
  }
  async createFAQCategory(category) {
    try {
      const result = await db.insert(faqCategories).values({
        ...category,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating FAQ category:", error);
      throw error;
    }
  }
  async updateFAQCategory(id, updates) {
    try {
      const existing = await this.getFAQCategory(id);
      if (!existing) {
        console.error("FAQ category not found for update:", id);
        return null;
      }
      const result = await db.update(faqCategories).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(faqCategories.id, id)).returning();
      console.log("FAQ category update result:", result);
      return result[0] || null;
    } catch (error) {
      console.error("Error updating FAQ category:", error);
      throw error;
    }
  }
  async deleteFAQCategory(id) {
    try {
      const existing = await this.getFAQCategory(id);
      if (!existing) {
        console.error("FAQ category not found for deletion:", id);
        return false;
      }
      const result = await db.delete(faqCategories).where(eq(faqCategories.id, id)).returning();
      console.log("FAQ category delete result:", result);
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting FAQ category:", error);
      return false;
    }
  }
  // Verification operations
  async submitVerification(verification) {
    const result = await db.insert(userVerifications).values(verification).returning();
    return result[0];
  }
  async getVerificationByUserId(userId) {
    const result = await db.select().from(userVerifications).where(eq(userVerifications.userId, userId)).limit(1);
    return result[0] || null;
  }
  async getPendingVerifications() {
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
        id: users2.id,
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email,
        role: users2.role
      }
    }).from(userVerifications).innerJoin(users2, eq(userVerifications.userId, users2.id)).where(eq(userVerifications.status, "pending")).orderBy(desc(userVerifications.submittedAt));
  }
  async updateVerificationStatus(id, status, reviewedBy, rejectionReason) {
    const updates = {
      status,
      reviewedBy,
      reviewedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }
    const result = await db.update(userVerifications).set(updates).where(eq(userVerifications.id, id)).returning();
    if (result[0] && status === "verified") {
      await db.update(users2).set({
        isVerified: true,
        identityVerificationStatus: "verified",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users2.id, result[0].userId));
      const finder = await db.select().from(finders).where(eq(finders.userId, result[0].userId)).limit(1);
      if (finder[0]) {
        await db.update(finders).set({
          isVerified: true,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(finders.id, finder[0].id));
      }
    } else if (result[0] && status === "rejected") {
      await db.update(users2).set({
        isVerified: false,
        identityVerificationStatus: "rejected",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users2.id, result[0].userId));
      const finder = await db.select().from(finders).where(eq(finders.userId, result[0].userId)).limit(1);
      if (finder[0]) {
        await db.update(finders).set({
          isVerified: false,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(finders.id, finder[0].id));
      }
    }
    return result[0];
  }
  async getVerificationById(id) {
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
        id: users2.id,
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email,
        role: users2.role
      }
    }).from(userVerifications).innerJoin(users2, eq(userVerifications.userId, users2.id)).where(eq(userVerifications.id, id)).limit(1);
    return result[0] || null;
  }
  async isVerificationRequired() {
    const setting = await this.getAdminSetting("verification_required");
    return setting?.value === "true";
  }
  // Support tickets
  async createSupportTicket(ticket) {
    const result = await db.insert(supportTickets).values(ticket).returning();
    return result[0];
  }
  async getSupportTickets(filters) {
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
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      },
      assignedAgent: {
        agentId: supportAgents.agentId,
        user: {
          firstName: users2.firstName,
          lastName: users2.lastName
        }
      }
    }).from(supportTickets).leftJoin(users2, eq(supportTickets.submitterId, users2.id)).leftJoin(supportAgents, eq(supportTickets.assignedTo, supportAgents.id)).leftJoin(users2, eq(supportAgents.userId, users2.id)).orderBy(desc(supportTickets.createdAt));
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
  async getSupportTicket(id) {
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
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      },
      assignedAgent: {
        agentId: supportAgents.agentId,
        user: {
          firstName: users2.firstName,
          lastName: users2.lastName
        }
      }
    }).from(supportTickets).leftJoin(users2, eq(supportTickets.submitterId, users2.id)).leftJoin(supportAgents, eq(supportTickets.assignedTo, supportAgents.id)).leftJoin(users2, eq(supportAgents.userId, users2.id)).where(eq(supportTickets.id, id)).limit(1);
    return result[0];
  }
  async updateSupportTicket(id, updates) {
    const result = await db.update(supportTickets).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(supportTickets.id, id)).returning();
    return result[0];
  }
  async deleteSupportTicket(id) {
    const result = await db.delete(supportTickets).where(eq(supportTickets.id, id)).returning();
    return result.length > 0;
  }
  async generateTicketNumber() {
    const lastTicket = await db.select({ ticketNumber: supportTickets.ticketNumber }).from(supportTickets).orderBy(desc(supportTickets.createdAt)).limit(1);
    if (lastTicket.length === 0) {
      return "TKT-0001";
    }
    const lastNumber = parseInt(lastTicket[0].ticketNumber.replace("TKT-", ""));
    const nextNumber = lastNumber + 1;
    return `TKT-${nextNumber.toString().padStart(4, "0")}`;
  }
  async createSupportTicketMessage(message) {
    const result = await db.insert(supportTicketMessages).values({
      ...message,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    await db.update(supportTickets).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(supportTickets.id, message.ticketId));
    return result[0];
  }
  async getSupportTicketMessages(ticketId) {
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
        firstName: users2.firstName,
        lastName: users2.lastName
      }
    }).from(supportTicketMessages).leftJoin(users2, eq(supportTicketMessages.senderId, users2.id)).where(eq(supportTicketMessages.ticketId, ticketId)).orderBy(asc(supportTicketMessages.createdAt));
  }
  async markTicketMessageAsRead(messageId) {
  }
  // Implementation for getProposalsForClient
  async getProposalsForClient(clientId) {
    const result = await db.select({
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
          firstName: users2.firstName,
          lastName: users2.lastName,
          email: users2.email
        }
      }
    }).from(proposals).innerJoin(finds, eq(proposals.findId, finds.id)).innerJoin(finders, eq(proposals.finderId, finders.id)).innerJoin(users2, eq(finders.userId, users2.id)).where(eq(finds.clientId, clientId)).orderBy(desc(proposals.createdAt));
    return result;
  }
  async getProposalWithDetails(id) {
    const result = await db.select({
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
          firstName: users2.firstName,
          lastName: users2.lastName,
          email: users2.email
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
    }).from(proposals).innerJoin(finders, eq(proposals.finderId, finders.id)).innerJoin(users2, eq(finders.userId, users2.id)).innerJoin(finds, eq(proposals.findId, finds.id)).where(eq(proposals.id, id)).limit(1);
    return result[0];
  }
};
var storage = new DatabaseStorage();

// server/objectStorage.ts
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
});
var ObjectNotFoundError = class _ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
  }
};
var ObjectStorageService = class {
  constructor() {
  }
  // Gets the public object search paths.
  getPublicObjectSearchPaths() {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr.split(",").map((path5) => path5.trim()).filter((path5) => path5.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }
  // Gets the private object directory.
  getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      const fs3 = __require("fs");
      const path5 = __require("path");
      const uploadsDir = path5.join(process.cwd(), "uploads");
      if (!fs3.existsSync(uploadsDir)) {
        fs3.mkdirSync(uploadsDir, { recursive: true });
      }
      return uploadsDir;
    }
    return dir;
  }
  // Search for a public object from the search paths.
  async searchPublicObject(filePath) {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }
  // Downloads an object to the response.
  async downloadObject(file, res, cacheTtlSec = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `public, max-age=${cacheTtlSec}`
      });
      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL() {
    const privateObjectDir = this.getPrivateObjectDir();
    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900
    });
  }
  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath) {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }
    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }
  normalizeObjectEntityPath(rawPath) {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;
    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }
    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }
  // Add missing ACL methods
  async trySetObjectEntityAclPolicy(objectPath, policy) {
    return objectPath;
  }
  async canAccessObjectEntity(params) {
    return true;
  }
};
function parseObjectPath(path5) {
  if (!path5.startsWith("/")) {
    path5 = `/${path5}`;
  }
  const pathParts = path5.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

// server/routes.ts
init_schema();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path2 from "path";
import fs from "fs";
import { eq as eq4 } from "drizzle-orm";

// server/flutterwaveService.ts
import crypto from "crypto";
var FLUTTERWAVE_TOKEN_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    tokens: 10,
    price: 5e3
    // ₦5,000
  },
  {
    id: "professional",
    name: "Professional Pack",
    tokens: 25,
    price: 1e4,
    // ₦10,000
    popular: true
  },
  {
    id: "business",
    name: "Business Pack",
    tokens: 50,
    price: 18e3
    // ₦18,000
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    tokens: 100,
    price: 3e4
    // ₦30,000
  }
];
function getTokensFromAmount(amount) {
  const packageMapping = {
    5e3: 10,
    // Starter Pack
    1e4: 25,
    // Professional Pack
    18e3: 50,
    // Business Pack
    3e4: 100
    // Enterprise Pack
  };
  return packageMapping[amount] || 0;
}
var FlutterwaveService = class {
  secretKey;
  publicKey;
  baseUrl = "https://api.flutterwave.com/v3";
  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || "";
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY || "";
    if (!this.secretKey || !this.publicKey) {
      console.warn("Flutterwave API keys not configured");
    }
  }
  isConfigured() {
    return !!(this.secretKey && this.publicKey);
  }
  generateTransactionReference(userId) {
    const timestamp2 = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FLW_${userId.substring(0, 8).toUpperCase()}_${timestamp2}_${randomSuffix}`;
  }
  getBaseUrl() {
    if (process.env.NODE_ENV === "production") {
      return "https://findermeister.com";
    } else {
      return process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : "http://localhost:5000";
    }
  }
  async initializePayment(options) {
    if (!this.isConfigured()) {
      throw new Error("Flutterwave service is not properly configured");
    }
    try {
      const payload = {
        tx_ref: options.reference,
        amount: options.amount,
        currency: "NGN",
        redirect_url: options.redirectUrl,
        customer: {
          email: options.email,
          name: options.metadata.customerName || "FinderMeister User"
        },
        customizations: {
          title: options.metadata.type === "contract_payment" ? "Contract Payment" : "Token Purchase",
          description: options.metadata.description || "FinderMeister Payment",
          logo: "https://your-logo-url.com/logo.png"
        },
        meta: options.metadata
      };
      console.log("Flutterwave payment payload:", JSON.stringify(payload, null, 2));
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("Flutterwave payment response:", JSON.stringify(data, null, 2));
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to initialize payment");
      }
      return {
        authorization_url: data.data.link,
        reference: options.reference
      };
    } catch (error) {
      console.error("Flutterwave payment initialization error:", error);
      throw error;
    }
  }
  async verifyTransaction(reference) {
    if (!this.isConfigured()) {
      throw new Error("Flutterwave service is not properly configured");
    }
    try {
      console.log(`Verifying transaction with reference: ${reference}`);
      const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.secretKey}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      console.log("Flutterwave verification response:", JSON.stringify(data, null, 2));
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to verify transaction");
      }
      return {
        status: data.data.status === "successful" ? "success" : "failed",
        amount: data.data.amount,
        currency: data.data.currency,
        tx_ref: data.data.tx_ref,
        id: data.data.id,
        metadata: data.data.meta || {}
      };
    } catch (error) {
      console.error("Flutterwave verification error:", error);
      throw error;
    }
  }
  verifyWebhookSignature(payload, signature) {
    if (process.env.NODE_ENV === "development" && !signature) {
      console.log("Development mode: Allowing webhook without signature verification");
      return true;
    }
    if (!signature || !process.env.FLUTTERWAVE_SECRET_HASH) {
      console.log("Missing signature or FLUTTERWAVE_SECRET_HASH");
      return false;
    }
    try {
      const expectedSignature = crypto.createHmac("sha256", process.env.FLUTTERWAVE_SECRET_HASH).update(payload, "utf8").digest("hex");
      const isValid = expectedSignature === signature;
      console.log("Webhook signature verification:", { isValid, expectedSignature, receivedSignature: signature });
      return isValid;
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }
};

// server/emailService.ts
import { createTransport } from "nodemailer";

// server/emailTemplates.ts
var EmailTemplateEngine = class {
  static templates = {
    welcome: {
      subject: "Welcome to FinderMeister!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Welcome to FinderMeister!</h1>
          <p>Hi {{firstName}},</p>
          <p>Welcome to FinderMeister, Nigeria's premier service marketplace!</p>
          <p>Your account has been created successfully. You can now:</p>
          <ul>
            <li>{{roleSpecificMessage}}</li>
            <li>Connect with trusted professionals</li>
            <li>Manage your projects securely</li>
          </ul>
          <p>Get started by visiting your dashboard.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    },
    proposalNotification: {
      subject: "New Proposal Received - {{requestTitle}}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Proposal Received</h2>
          <p>Hi {{clientName}},</p>
          <p>You have received a new proposal from <strong>{{finderName}}</strong> for your request:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1e40af;">{{requestTitle}}</h3>
            <p style="margin: 10px 0 0 0;">Proposed Price: <strong>\u20A6{{proposalPrice}}</strong></p>
          </div>
          <p>Review the proposal and respond to the finder if you're interested.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    },
    paymentConfirmation: {
      subject: "Payment Confirmed - {{contractTitle}}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Confirmed!</h2>
          <p>Hi {{userName}},</p>
          <p>Your payment has been confirmed for the project:</p>
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #065f46;">{{contractTitle}}</h3>
            <p style="margin: 10px 0 0 0;">Amount: <strong>\u20A6{{amount}}</strong></p>
          </div>
          <p>Work can now begin on your project.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    }
  };
  static render(templateName, data) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    const rendered = {
      subject: this.interpolate(template.subject, data),
      html: this.interpolate(template.html, data),
      text: template.text ? this.interpolate(template.text, data) : void 0
    };
    return rendered;
  }
  static interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== void 0 ? String(data[key]) : match;
    });
  }
  static addTemplate(name, template) {
    this.templates[name] = template;
  }
  static getAvailableTemplates() {
    return Object.keys(this.templates);
  }
  static passwordReset(name, resetLink) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            We received a request to reset your password for your FinderMeister account. 
            Click the button below to create a new password:
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Reset My Password
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons. If you didn't request a password reset, 
            you can safely ignore this email.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <span style="color: #667eea; word-break: break-all;">${resetLink}</span>
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }
  static verificationSubmitted(name) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Identity Verification Submitted</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Thank you for submitting your identity verification documents. Your submission is now under review by our verification team.
          </p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our team will review your documents within 24-48 hours</li>
              <li style="margin-bottom: 8px;">You'll receive an email notification once the review is complete</li>
              <li style="margin-bottom: 8px;">Once verified, you'll be able to access all platform features</li>
            </ul>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If you have any questions about the verification process, please contact our support team.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }
  static verificationApproved(name) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">\u{1F389} Identity Verified!</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Congratulations ${name}!
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Your identity verification has been approved. Your account is now fully verified and you can access all FinderMeister features.
          </p>

          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #065f46; margin: 0 0 15px 0;">You can now:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Post finds and hire freelancers (if you're a client)</li>
              <li style="margin-bottom: 8px;">Apply to finds and submit proposals (if you're a finder)</li>
              <li style="margin-bottom: 8px;">Access all premium features</li>
              <li style="margin-bottom: 8px;">Build trust with other verified users</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Start Using FinderMeister
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            Thank you for completing the verification process. Welcome to the verified FinderMeister community!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }
  static verificationRejected(name, reason) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Verification Update Required</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            We've reviewed your identity verification submission, but unfortunately we need you to resubmit your documents.
          </p>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #991b1b; margin: 0 0 15px 0;">Reason for rejection:</h3>
            <p style="color: #374151; margin: 0; font-style: italic;">"${reason}"</p>
          </div>

          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">Next steps:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Review the feedback above</li>
              <li style="margin-bottom: 8px;">Prepare new, clear photos of your documents</li>
              <li style="margin-bottom: 8px;">Ensure your selfie clearly shows your face</li>
              <li style="margin-bottom: 8px;">Resubmit through your profile settings</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Resubmit Verification
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If you have any questions about the verification process, please contact our support team.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }
};

// server/emailService.ts
var createEmailTransporter = () => {
  const transports = [
    // Method 1: Direct SMTP (if configured)
    () => {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      }
      return null;
    },
    // Method 2: Gmail OAuth2 (self-contained)
    () => {
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });
      }
      return null;
    },
    // Method 3: Local mail system simulation (for development)
    () => {
      return createTransport({
        streamTransport: true,
        newline: "unix",
        buffer: true
      });
    },
    // Method 4: File-based email logging (ultimate fallback)
    () => {
      return createTransport({
        jsonTransport: true
      });
    }
  ];
  for (const createTransporter of transports) {
    try {
      const transporter2 = createTransporter();
      if (transporter2) {
        return transporter2;
      }
    } catch (error) {
      console.warn("Failed to create transporter:", error);
      continue;
    }
  }
  return createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true
  });
};
var transporter = createEmailTransporter();
var EmailService = class _EmailService {
  static instance;
  static getInstance() {
    if (!_EmailService.instance) {
      _EmailService.instance = new _EmailService();
    }
    return _EmailService.instance;
  }
  async sendEmail(template) {
    try {
      console.log("Using SMTP email service");
      console.log("SMTP Configuration:", {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || "587",
        user: process.env.SMTP_USER ? "configured" : "missing",
        pass: process.env.SMTP_PASS ? "configured" : "missing",
        from: process.env.FROM_EMAIL || "95bd74001@smtp-brevo.com"
      });
      await transporter.verify();
      console.log("SMTP connection verified successfully");
      const mailOptions = {
        from: process.env.FROM_EMAIL || "95bd74001@smtp-brevo.com",
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text || this.extractTextFromHtml(template.html)
      };
      console.log(`Attempting to send email to: ${template.to}`);
      const result = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${template.to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send email:", {
        error: error.message,
        code: error.code,
        command: error.command,
        to: template.to,
        subject: template.subject
      });
      return false;
    }
  }
  extractTextFromHtml(html) {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }
  // Finder notification templates
  async notifyFinderNewMessage(finderEmail, clientName, requestTitle) {
    const template = {
      to: finderEmail,
      subject: `New Message from ${clientName} - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Message Received</h2>
          <p>Hi there,</p>
          <p>You have received a new message from <strong>${clientName}</strong> regarding your proposal for:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${requestTitle}</h3>
          </div>
          <p>Log in to your FinderMeister dashboard to view and respond to the message.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/finder/messages" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Messages
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  async notifyFinderHired(finderEmail, clientName, requestTitle, amount) {
    const template = {
      to: finderEmail,
      subject: `\u{1F389} You've been hired for "${requestTitle}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Congratulations! You've been hired!</h2>
          <p>Great news! <strong>${clientName}</strong> has accepted your proposal and hired you for the project:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin: 0; color: #0369a1;">${requestTitle}</h3>
          </div>
          <p><strong>Contract Amount:</strong> \u20A6${amount}</p>
          <p>The client will now fund the escrow, and once payment is complete, you can begin working on the project.</p>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Wait for escrow funding confirmation</li>
              <li>You'll receive another notification when work can begin</li>
              <li>Start communicating with the client about project details</li>
            </ul>
          </div>
          <p>Log in to your FinderMeister dashboard to view the contract details and start messaging the client.</p>
          <p>Best of luck with your project!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  async notifyFinderWorkCanBegin(finderEmail, clientName, requestTitle, amount) {
    const template = {
      to: finderEmail,
      subject: `\u{1F680} Escrow funded! You can now start work on "${requestTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Escrow Funded - Work Can Begin!</h2>
          <p>Excellent news! <strong>${clientName}</strong> has funded the escrow for your project:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin: 0; color: #0369a1;">${requestTitle}</h3>
          </div>
          <p><strong>Contract Amount:</strong> \u20A6${amount}</p>
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;"><strong>\u2705 Payment Secured:</strong> The full contract amount is now held in escrow and will be released to you upon successful completion of the work.</p>
          </div>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Ready to Start:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Begin working on the project immediately</li>
              <li>Communicate regularly with the client</li>
              <li>Submit your completed work through the platform</li>
              <li>Payment will be released once client approves your work</li>
            </ul>
          </div>
          <p>Log in to your FinderMeister dashboard to view the contract details and start messaging the client.</p>
          <p>Good luck with your project!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  async notifyFinderSubmissionApproved(finderEmail, clientName, requestTitle, amount) {
    const template = {
      to: finderEmail,
      subject: `Work Approved - Payment Released - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Work Approved - Payment Released!</h2>
          <p>Hi there,</p>
          <p>Excellent news! <strong>${clientName}</strong> has approved your work submission for:</p>
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="margin: 0 0 10px 0; color: #15803d;">${requestTitle}</h3>
            <p style="margin: 0; color: #374151;">Payment Released: <strong>\u20A6${amount}</strong></p>
          </div>
          <p>The payment has been released from escrow and added to your available balance. You can now request a withdrawal.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/finder/withdrawals" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Request Withdrawal
          </a>
          <p>Thank you for your excellent work!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  async notifyFinderSubmissionRejected(finderEmail, clientName, requestTitle, feedback) {
    const template = {
      to: finderEmail,
      subject: `Work Revision Requested - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Work Revision Requested</h2>
          <p>Hi there,</p>
          <p><strong>${clientName}</strong> has requested revisions for your work submission on:</p>
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin: 0 0 10px 0; color: #dc2626;">${requestTitle}</h3>
            <h4 style="margin: 10px 0 5px 0; color: #374151;">Client Feedback:</h4>
            <p style="margin: 0; color: #6b7280; font-style: italic;">"${feedback}"</p>
          </div>
          <p>Please review the feedback and resubmit your work with the requested changes.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/finder/contracts" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Contract & Resubmit
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  // Client notification templates
  async notifyClientNewProposal(clientEmail, finderName, requestTitle, proposalPrice) {
    const template = {
      to: clientEmail,
      subject: `New Proposal Received - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Proposal Received</h2>
          <p>Hi there,</p>
          <p>You have received a new proposal from <strong>${finderName}</strong> for your request:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">${requestTitle}</h3>
            <p style="margin: 0; color: #374151;">Proposed Price: <strong>\u20A6${proposalPrice}</strong></p>
          </div>
          <p>Review the proposal details and respond to the finder if you're interested.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/client/requests" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Proposal
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  async notifyClientOrderSubmitted(clientEmail, finderName, contractId) {
    const subject = `Work Submitted - ${finderName} has completed your project`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Work Submission Received</h2>
        <p>Hello,</p>
        <p><strong>${finderName}</strong> has submitted their completed work for your project.</p>
        <p>You have 48 hours to review the submission. If no action is taken, the payment will be automatically released.</p>
        <p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/orders/review/${contractId}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Review Submission
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This is an automated message from FinderMeister.</p>
      </div>
    `;
    return this.sendEmail({ to: clientEmail, subject, html });
  }
  async notifyClientOrderAccepted(finderEmail, clientName, amount) {
    try {
      const subject = "Your Work Has Been Accepted! \u{1F389}";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Work Accepted - Payment Released!</h2>
          <p>Great news! Your submitted work has been accepted by ${clientName}.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <p><strong>Amount Released:</strong> \u20A6${parseFloat(amount).toLocaleString()}</p>
            <p>The funds have been released to your account.</p>
          </div>
          <p>Continue delivering excellent work to build your reputation on FinderMeister!</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/finder/dashboard" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;
      return this.sendEmail({ to: finderEmail, subject, html });
    } catch (error) {
      console.error("Failed to send order acceptance email:", error);
      return false;
    }
  }
  async notifyClientContractCancelled(clientEmail, clientName, contractId, amount) {
    try {
      const subject = "Contract Cancelled - Full Refund Issued";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Contract Cancelled</h2>
          <p>Dear ${clientName},</p>
          <p>Your contract has been cancelled by the administrator. A full refund has been issued to your account.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Refund Details</h3>
            <p><strong>Contract ID:</strong> ${contractId}</p>
            <p><strong>Refund Amount:</strong> \u20A6${parseFloat(amount).toLocaleString()}</p>
            <p>The tokens have been added back to your account balance.</p>
          </div>
          <p>If you have any questions, please contact our support team.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/client/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;
      return this.sendEmail({ to: clientEmail, subject, html });
    } catch (error) {
      console.error("Failed to send client contract cancellation email:", error);
      return false;
    }
  }
  async notifyFinderContractCancelled(finderEmail, finderName, contractId) {
    try {
      const subject = "Contract Cancelled by Administrator";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Contract Cancelled</h2>
          <p>Dear ${finderName},</p>
          <p>The contract you were working on has been cancelled by the administrator.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contract Details</h3>
            <p><strong>Contract ID:</strong> ${contractId}</p>
            <p>The client has received a full refund.</p>
          </div>
          <p>If you have any questions about this cancellation, please contact our support team.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/finder/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;
      return this.sendEmail({ to: finderEmail, subject, html });
    } catch (error) {
      console.error("Failed to send finder contract cancellation email:", error);
      return false;
    }
  }
  async notifyClientNewMessage(clientEmail, finderName, requestTitle) {
    const template = {
      to: clientEmail,
      subject: `New Message from ${finderName} - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Message Received</h2>
          <p>Hi there,</p>
          <p>You have received a new message from <strong>${finderName}</strong> regarding:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${requestTitle}</h3>
          </div>
          <p>Log in to your FinderMeister dashboard to view and respond to the message.</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/client/messages" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Messages
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    };
    return this.sendEmail(template);
  }
  // Password reset email template
  async sendPasswordResetEmail(userEmail, userName, resetLink) {
    try {
      const subject = "Reset Your FinderMeister Password";
      const htmlContent = EmailTemplateEngine.passwordReset(userName, resetLink);
      const success = await this.sendEmail({
        to: userEmail,
        subject,
        html: htmlContent
      });
      if (success) {
        console.log(`Password reset email sent successfully to ${userEmail}`);
      } else {
        console.error(`Failed to send password reset email to ${userEmail}`);
      }
      return success;
    } catch (error) {
      console.error("Error in sendPasswordResetEmail:", error);
      return false;
    }
  }
  // Verification email methods
  async sendVerificationSubmitted(email, name) {
    try {
      const subject = "Identity Verification Submitted - Under Review";
      const htmlContent = EmailTemplateEngine.verificationSubmitted(name);
      const success = await this.sendEmail({
        to: email,
        subject,
        html: htmlContent
      });
      if (success) {
        console.log(`Verification submitted email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification submitted email to ${email}`);
      }
      return success;
    } catch (error) {
      console.error("Error in sendVerificationSubmitted:", error);
      return false;
    }
  }
  async sendVerificationApproved(email, name) {
    try {
      const subject = "\u{1F389} Your Identity Verification is Complete!";
      const htmlContent = EmailTemplateEngine.verificationApproved(name);
      const success = await this.sendEmail({
        to: email,
        subject,
        html: htmlContent
      });
      if (success) {
        console.log(`Verification approved email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification approved email to ${email}`);
      }
      return success;
    } catch (error) {
      console.error("Error in sendVerificationApproved:", error);
      return false;
    }
  }
  async sendVerificationRejected(email, name, reason) {
    try {
      const subject = "Verification Update Required - FinderMeister";
      const htmlContent = EmailTemplateEngine.verificationRejected(name, reason);
      const success = await this.sendEmail({
        to: email,
        subject,
        html: htmlContent
      });
      if (success) {
        console.log(`Verification rejected email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification rejected email to ${email}`);
      }
      return success;
    } catch (error) {
      console.error("Error in sendVerificationRejected:", error);
      return false;
    }
  }
  async notifyAdminNewDispute(adminEmail, disputeId, userName, disputeType, description) {
    const subject = "New Dispute Submitted - Action Required";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Dispute Requires Review</h2>
        <p>A new dispute has been submitted and requires administrative review.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Dispute ID:</strong> ${disputeId}</p>
          <p><strong>Submitted by:</strong> ${userName}</p>
          <p><strong>Type:</strong> ${disputeType}</p>
          <p><strong>Description:</strong> ${description}</p>
        </div>
        
        <p>Please log in to your admin dashboard to review and take action on this dispute.</p>
        
        <p>Best regards,<br>The FinderMeister System</p>
      </div>
    `;
    return this.sendEmail({ to: adminEmail, subject, html });
  }
  async notifyAdminContractCancellation(adminEmail, contractId, clientName, finderName, amount, reason) {
    const subject = "Contract Cancelled by Admin - Notification";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Contract Cancellation Notice</h2>
        <p>A contract has been cancelled by an administrator.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Contract ID:</strong> ${contractId}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Finder:</strong> ${finderName}</p>
          <p><strong>Amount:</strong> \u20A6${amount}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        
        <p>The client has been refunded and both parties have been notified.</p>
        
        <p>Best regards,<br>The FinderMeister System</p>
      </div>
    `;
    return this.sendEmail({ to: adminEmail, subject, html });
  }
};
var emailService = EmailService.getInstance();

// server/monthlyTokenGrantService.ts
init_schema();
import { eq as eq2, and as and2, gte, sql as sql3 } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
var FINDER_LEVEL_TOKENS = {
  "GrandMeister": 50,
  "Meister": 30,
  "Novice": 20,
  "Pathfinder": 20,
  "Seeker": 20
};
var MonthlyTokenGrantService = class {
  isRunning = false;
  /**
   * Grant monthly tokens to all active finders based on their level
   * This should be called on the 1st day of every month
   */
  async grantMonthlyTokens() {
    if (this.isRunning) {
      console.log("Monthly token grant is already running");
      return;
    }
    this.isRunning = true;
    console.log("Starting monthly token grant process...");
    try {
      const activeFinders = await db.select({
        finderId: finders.id,
        userId: finders.userId,
        level: finders.level,
        firstName: users2.firstName,
        lastName: users2.lastName,
        email: users2.email
      }).from(finders).innerJoin(users2, eq2(finders.userId, users2.id)).where(eq2(users2.isActive, true));
      console.log(`Found ${activeFinders.length} active finders`);
      let totalGranted = 0;
      let successCount = 0;
      let errorCount = 0;
      for (const finder of activeFinders) {
        try {
          const tokenAmount = FINDER_LEVEL_TOKENS[finder.level] || 20;
          if (tokenAmount <= 0) {
            console.log(`No tokens to grant for ${finder.level} level finder ${finder.email}`);
            continue;
          }
          const tokenRecord = await db.insert(findertokens).values({
            id: uuidv4(),
            finderId: finder.finderId,
            amount: tokenAmount,
            type: "monthly_grant",
            description: `Monthly token grant for ${finder.level} level`,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
            // Expires in 1 year
            createdAt: /* @__PURE__ */ new Date()
          }).returning();
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
      console.error("Error in monthly token grant process:", error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }
  /**
   * Check if monthly tokens have already been granted this month
   */
  async hasGrantedTokensThisMonth() {
    const now = /* @__PURE__ */ new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    try {
      const existingGrants = await db.select({ count: sql3`count(*)` }).from(findertokens).where(
        and2(
          eq2(findertokens.type, "monthly_grant"),
          gte(findertokens.createdAt, firstDayOfMonth)
        )
      );
      return existingGrants[0]?.count > 0;
    } catch (error) {
      console.error("Error checking monthly token grants:", error);
      return false;
    }
  }
  /**
   * Schedule the monthly token grant to run automatically
   * This should be called when the server starts
   */
  startScheduler() {
    this.checkAndGrantTokens();
    setInterval(() => {
      this.checkAndGrantTokens();
    }, 60 * 60 * 1e3);
    console.log("Monthly token grant scheduler started");
  }
  /**
   * Check if it's time to grant monthly tokens and do so if needed
   */
  async checkAndGrantTokens() {
    const now = /* @__PURE__ */ new Date();
    if (now.getDate() !== 1) {
      return;
    }
    const hasGranted = await this.hasGrantedTokensThisMonth();
    if (hasGranted) {
      console.log("Monthly tokens have already been granted this month");
      return;
    }
    console.log("It's the first day of the month - granting monthly tokens...");
    await this.grantMonthlyTokens();
  }
};
var monthlyTokenGrantService = new MonthlyTokenGrantService();

// server/autonomousFundService.ts
init_schema();
import { eq as eq3, and as and3, lte, sql as sql4 } from "drizzle-orm";
import { v4 as uuidv42 } from "uuid";
var AutonomousFundService = class {
  config = {
    holdingPeriodHours: 24,
    // 24 hour holding period
    autoCreditEnabled: true,
    minimumRating: 4,
    minimumJobsCompleted: 1
  };
  isProcessing = false;
  /**
   * Process autonomous fund crediting for completed orders
   * This runs periodically to check and credit funds automatically
   */
  async processAutonomousFundCrediting() {
    if (this.isProcessing || !this.config.autoCreditEnabled) {
      return;
    }
    this.isProcessing = true;
    console.log("\u{1F504} Processing autonomous fund crediting...");
    try {
      const now = /* @__PURE__ */ new Date();
      const holdingPeriodEnd = new Date(now.getTime() - this.config.holdingPeriodHours * 60 * 60 * 1e3);
      const readyContracts = await db.select({
        contractId: contracts.id,
        finderId: contracts.finderId,
        clientId: contracts.clientId,
        amount: contracts.amount,
        completedAt: contracts.completedAt,
        escrowStatus: contracts.escrowStatus,
        isCompleted: contracts.isCompleted
      }).from(contracts).where(
        and3(
          eq3(contracts.isCompleted, true),
          eq3(contracts.escrowStatus, "completed"),
          lte(contracts.completedAt, holdingPeriodEnd),
          sql4`${contracts.finderId} IS NOT NULL`
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
      console.log(`\u2705 Autonomous fund crediting completed: ${successCount} successful, ${errorCount} errors`);
    } catch (error) {
      console.error("\u274C Error in autonomous fund crediting:", error);
    } finally {
      this.isProcessing = false;
    }
  }
  /**
   * Credit finder earnings for a completed contract
   */
  async creditFinderEarnings(contract) {
    console.log(`\u{1F4B0} Crediting finder ${contract.finderId} for contract ${contract.contractId}`);
    try {
      const finder = await db.select({
        id: finders.id,
        userId: finders.userId,
        availableBalance: finders.availableBalance,
        totalEarned: finders.totalEarned,
        jobsCompleted: finders.jobsCompleted,
        averageRating: finders.averageRating
      }).from(finders).where(eq3(finders.id, contract.finderId)).limit(1);
      if (!finder[0]) {
        throw new Error(`Finder ${contract.finderId} not found`);
      }
      const currentFinder = finder[0];
      const contractAmount = parseFloat(contract.amount);
      await db.update(finders).set({
        availableBalance: sql4`${currentFinder.availableBalance} + ${contractAmount}`,
        totalEarned: sql4`${currentFinder.totalEarned} + ${contractAmount}`
      }).where(eq3(finders.id, contract.finderId));
      await db.insert(transactions).values({
        id: uuidv42(),
        userId: contract.clientId,
        finderId: contract.finderId,
        amount: contractAmount,
        type: "escrow_release",
        description: `Autonomous fund release for completed contract ${contract.contractId}`,
        reference: contract.contractId,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(contracts).set({
        escrowStatus: "released"
      }).where(eq3(contracts.id, contract.contractId));
      console.log(`\u2705 Successfully credited ${contractAmount} to finder ${contract.finderId}`);
      await this.updateFinderLevelIfEligible(contract.finderId);
    } catch (error) {
      console.error(`\u274C Error crediting finder ${contract.finderId}:`, error);
      throw error;
    }
  }
  /**
   * Update finder level based on performance metrics
   */
  async updateFinderLevelIfEligible(finderId) {
    try {
      const finder = await db.select({
        id: finders.id,
        userId: finders.userId,
        jobsCompleted: finders.jobsCompleted,
        totalEarned: finders.totalEarned,
        averageRating: finders.averageRating,
        currentLevelId: finders.currentLevelId
      }).from(finders).where(eq3(finders.id, finderId)).limit(1);
      if (!finder[0]) {
        return;
      }
      const currentFinder = finder[0];
      const currentJobsCompleted = currentFinder.jobsCompleted || 0;
      const currentRating = parseFloat(currentFinder.averageRating?.toString() || "0");
      const currentEarnings = parseFloat(currentFinder.totalEarned?.toString() || "0");
      const levels = await db.select({
        id: sql4`id`,
        name: sql4`name`,
        minJobsCompleted: sql4`min_jobs_completed`,
        minRating: sql4`min_rating`,
        minEarnedAmount: sql4`min_earned_amount`
      }).from(sql4`finder_levels`).where(sql4`is_active = true`).orderBy(sql4`order DESC`);
      let newLevelId = null;
      for (const level of levels) {
        const minJobs = level.minJobsCompleted || 0;
        const minRating = parseFloat(level.minRating?.toString() || "0");
        const minEarnings = parseFloat(level.minEarnedAmount?.toString() || "0");
        if (currentJobsCompleted >= minJobs && currentRating >= minRating && currentEarnings >= minEarnings) {
          newLevelId = level.id;
          break;
        }
      }
      if (newLevelId && newLevelId !== currentFinder.currentLevelId) {
        await db.update(finders).set({
          currentLevelId: newLevelId
        }).where(eq3(finders.id, finderId));
        console.log(`\u{1F3AF} Finder ${finderId} level updated to ${newLevelId}`);
      }
    } catch (error) {
      console.error(`\u274C Error updating finder level for ${finderId}:`, error);
    }
  }
  /**
   * Start the autonomous fund service scheduler
   */
  startScheduler() {
    this.processAutonomousFundCrediting();
    setInterval(() => {
      this.processAutonomousFundCrediting();
    }, 60 * 60 * 1e3);
    console.log("\u{1F504} Autonomous fund service scheduler started");
  }
  /**
   * Get current service configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update service configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log("\u2699\uFE0F Autonomous fund service configuration updated:", this.config);
  }
};
var autonomousFundService = new AutonomousFundService();

// server/routes.ts
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
console.log("JWT configuration:", {
  hasCustomSecret: !!process.env.JWT_SECRET,
  secretLength: JWT_SECRET.length,
  environment: process.env.NODE_ENV || "development"
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Access token required",
      code: "TOKEN_MISSING"
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId || !decoded.email) {
      console.error("JWT token missing required fields:", decoded);
      return res.status(401).json({
        message: "Invalid token format. Please log in again.",
        code: "TOKEN_INVALID_FORMAT"
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again.",
        code: "TOKEN_EXPIRED"
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        code: "TOKEN_INVALID"
      });
    } else {
      return res.status(401).json({
        message: "Token verification failed. Please log in again.",
        code: "TOKEN_VERIFICATION_FAILED"
      });
    }
  }
}
var requireAuth = authenticateToken;
async function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
}
var storage_multer = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path2.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path2.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  }
});
var upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 30 * 1024 * 1024,
    // 30MB limit
    files: 5,
    // Maximum 5 files
    fieldSize: 25 * 1024 * 1024
    // 25MB field size limit
  },
  fileFilter: function(req, file, cb) {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."));
    }
  }
});
async function registerRoutes(app2) {
  app2.use("/uploads", express.static(path2.join(process.cwd(), "uploads")));
  app2.put("/api/admin/settings", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === "string") {
          await storage.setAdminSetting(key, value);
        }
      }
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Admin settings update error:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });
  app2.get("/api/admin/settings", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      console.error("Admin settings get error:", error);
      res.status(500).json({ message: "Failed to get settings" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;
      const settings = await storage.getAdminSettings();
      const autoVerifyEnabled = settings.autoVerifyEnabled === "true";
      const userData = insertUserSchema.parse({
        email,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        role,
        isVerified: autoVerifyEnabled
        // Set verification based on admin setting
      });
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const user = await storage.createUser(userData);
      if (role === "finder") {
        await storage.createFinder({
          userId: user.id,
          phone: phone || null,
          isVerified: autoVerifyEnabled
          // Also set finder verification
        });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.status(201).json({
        user: { ...user, password: void 0 },
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed", error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.isBanned) {
        return res.status(403).json({
          message: "Your account has been banned",
          banned: true,
          bannedReason: user.bannedReason || "Violation of platform terms",
          bannedAt: user.bannedAt
        });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({
        user: { ...user, password: void 0 },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let profile = null;
      if (user.role === "finder") {
        profile = await storage.getFinderByUserId(user.id);
      }
      res.json({
        user: { ...user, password: void 0 },
        profile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user data" });
    }
  });
  app2.post("/api/auth/refresh", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({ token: newToken });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      console.log(`Password reset requested for email: ${email}`);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`No user found for email: ${email}`);
        return res.json({ message: "If an account with that email exists, we've sent you a password reset link." });
      }
      console.log(`User found: ${user.id} - ${user.firstName} ${user.lastName}`);
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email, type: "password_reset" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;
      console.log(`Generated reset link: ${resetLink}`);
      try {
        const emailSent = await emailService.sendPasswordResetEmail(user.email, `${user.firstName} ${user.lastName}`, resetLink);
        if (!emailSent) {
          console.error("Email service returned false for password reset email");
          return res.status(500).json({ message: "Failed to send reset email. Please check your email configuration." });
        }
        console.log(`Password reset email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return res.status(500).json({ message: "Failed to send reset email. Please check your email configuration." });
      }
      res.json({ message: "If an account with that email exists, we've sent you a password reset link." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== "password_reset") {
          throw new Error("Invalid token type");
        }
      } catch (jwtError) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await storage.updateUser(decoded.userId, { password: hashedPassword });
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  app2.post("/api/auth/change-password", authenticateToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await storage.updateUser(req.user.userId, { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/finder/profile", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "finder") {
        return res.status(403).json({ message: "Access denied. Only finders can access this endpoint." });
      }
      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const completedContracts = await db.select().from(contracts).where(eq4(contracts.finderId, finder.id)).where(eq4(contracts.isCompleted, true));
      const actualJobsCompleted = completedContracts.length;
      if (finder.jobsCompleted !== actualJobsCompleted) {
        await db.update(finders).set({ jobsCompleted: actualJobsCompleted }).where(eq4(finders.id, finder.id));
      }
      res.json({
        ...finder,
        jobsCompleted: actualJobsCompleted,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error("Get finder profile error:", error);
      res.status(500).json({ message: "Failed to get finder profile" });
    }
  });
  app2.get("/api/finder/pending-earnings", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can access this endpoint" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const pendingEarnings = await storage.getPendingEarnings(finder.id);
      res.json(pendingEarnings);
    } catch (error) {
      console.error("Get pending earnings error:", error);
      res.status(500).json({ message: "Failed to get pending earnings" });
    }
  });
  app2.patch("/api/finder/profile", authenticateToken, async (req, res) => {
    try {
      const { bio, category, categories: categories2, skills, availability } = req.body;
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "finder") {
        return res.status(403).json({ message: "Access denied. Only finders can update their profile." });
      }
      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const updateData = {
        bio,
        skills,
        availability
      };
      if (categories2 && Array.isArray(categories2)) {
        updateData.categories = categories2;
        updateData.category = categories2.length > 0 ? categories2[0] : category;
      } else if (category) {
        updateData.category = category;
        updateData.categories = [category];
      }
      const updatedFinder = await storage.updateFinder(finder.id, updateData);
      if (!updatedFinder) {
        return res.status(404).json({ message: "Failed to update finder profile" });
      }
      res.json({
        message: "Profile updated successfully",
        profile: updatedFinder
      });
    } catch (error) {
      console.error("Update finder profile error:", error);
      res.status(500).json({ message: "Failed to update finder profile" });
    }
  });
  app2.post("/api/auth/update-profile", authenticateToken, async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "First name, last name, and email are required" });
      }
      if (email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.user.userId) {
          return res.status(400).json({ message: "Email is already taken by another user" });
        }
      }
      const updatedUser = await storage.updateUser(req.user.userId, {
        firstName,
        lastName,
        email,
        phone
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        message: "Profile updated successfully",
        user: { ...updatedUser, password: void 0 }
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.get("/api/finds", authenticateToken, async (req, res) => {
    try {
      const finds2 = await storage.getAllActiveFinds();
      res.json(finds2);
    } catch (error) {
      console.error("Failed to fetch finds:", error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });
  app2.get("/api/finds/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const find = await storage.getFind(id);
      if (!find) {
        return res.status(404).json({ message: "Find not found" });
      }
      res.json(find);
    } catch (error) {
      console.error("Get request error:", error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });
  app2.get("/api/finder/finds", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can browse finds" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const finderCategories = finder.categories || (finder.category ? [finder.category] : []);
      let finds2;
      if (finderCategories.length > 0) {
        finds2 = await storage.getFindsForFinderByCategories(finderCategories);
      } else {
        finds2 = await storage.getAvailableFindsForFinders();
      }
      res.json(finds2);
    } catch (error) {
      console.error("Finder finds error:", error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });
  app2.get("/api/finder/proposals", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can view their proposals" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const proposals2 = await storage.getProposalsByFinderId(finder.id);
      res.json(proposals2);
    } catch (error) {
      console.error("Finder proposals error:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app2.get("/api/finder/dashboard", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can access finder dashboard" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const findertokenBalance = await storage.getFindertokenBalance(finder.id);
      const proposals2 = await storage.getProposalsByFinderId(finder.id);
      const recentFinds = await storage.getAllActiveFinds();
      res.json({
        finder,
        findertokenBalance: findertokenBalance?.balance ?? 0,
        proposalsCount: proposals2.length,
        availableFinds: recentFinds.length
      });
    } catch (error) {
      console.error("Finder dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  app2.get("/api/client/finds", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view their finds" });
      }
      const finds2 = await storage.getFindsByClientId(req.user.userId);
      res.json(finds2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your finds" });
    }
  });
  app2.post("/api/client/finds", authenticateToken, upload.array("attachments", 5), async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can create finds" });
      }
      console.log("Create find request body:", req.body);
      console.log("Create find files:", req.files);
      const client = await storage.getUser(req.user.userId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      if (client.isBanned) {
        return res.status(403).json({
          message: "Your account has been banned from creating finds.",
          banned: true,
          bannedReason: client.bannedReason,
          bannedAt: client.bannedAt
        });
      }
      if (!client.isVerified) {
        return res.status(403).json({
          message: "Account must be verified to post finds.",
          verified: false,
          verificationRequired: true
        });
      }
      const settings = await storage.getAdminSettings();
      const highBudgetThreshold = parseInt(settings.highBudgetThreshold || "100000");
      const highBudgetTokenCost = parseInt(settings.highBudgetTokenCost || "5");
      const maxBudget = parseInt(req.body.budgetMax || "0");
      const isHighBudget = maxBudget >= highBudgetThreshold;
      if (isHighBudget) {
        const client2 = await storage.getClientProfile(req.user.userId);
        if (!client2) {
          return res.status(404).json({ message: "Client profile not found" });
        }
        const clientBalance = client2.findertokenBalance || 0;
        if (clientBalance < highBudgetTokenCost) {
          return res.status(400).json({
            message: `Insufficient findertokens for high-budget postings. You need ${highBudgetTokenCost} findertokens but only have ${clientBalance}. Please purchase findertokens to post this find.`,
            requiredTokens: highBudgetTokenCost,
            currentBalance: clientBalance,
            needsToPurchaseTokens: true,
            purchaseUrl: "/client/tokens"
          });
        }
      }
      const files = req.files;
      const attachmentPaths = files ? files.map((file) => `/uploads/${file.filename}`) : [];
      const contentToCheck = `${req.body.title || ""} ${req.body.description || ""}`;
      const flaggedWords = await storage.checkContentForRestrictedWords(contentToCheck);
      const BOOST_COST = 50;
      const isBoosted = req.body.isBoosted === true || req.body.isBoosted === "true";
      let boostExpiresAt = null;
      if (isBoosted) {
        boostExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
        const clientBalance = await storage.getClientTokenBalance(req.user.userId);
        if (clientBalance < BOOST_COST) {
          return res.status(400).json({
            message: `Insufficient findertokens for boosting. You need ${BOOST_COST} findertokens but only have ${clientBalance}.`,
            requiredTokens: BOOST_COST,
            currentBalance: clientBalance,
            needsToPurchaseTokens: true,
            purchaseUrl: "/client/tokens"
          });
        }
      }
      const requestData = insertFindSchema.parse({
        ...req.body,
        clientId: req.user.userId,
        attachments: attachmentPaths,
        status: flaggedWords.length > 0 ? "under_review" : "open",
        flaggedWords: flaggedWords.length > 0 ? flaggedWords : void 0,
        reviewReason: flaggedWords.length > 0 ? `Find contains restricted words: ${flaggedWords.join(", ")}` : void 0,
        isHighBudget,
        isBoosted,
        boostAmount: isBoosted ? BOOST_COST : 0,
        boostExpiresAt
      });
      const request = await storage.createFind(requestData);
      if (isHighBudget) {
        await storage.deductClientFindertokens(req.user.userId, highBudgetTokenCost, `High-budget find posting: ${request.title}`);
      }
      if (isBoosted) {
        await storage.deductClientFindertokens(req.user.userId, BOOST_COST, `Find boost: ${request.title}`);
      }
      if (flaggedWords.length > 0) {
        return res.status(202).json({
          ...request,
          message: "Your find has been submitted for review due to content restrictions and will be published once approved by our admin team."
        });
      }
      let responseMessage = "Find posted successfully!";
      if (isHighBudget && isBoosted) {
        responseMessage = `Find posted and boosted successfully! ${highBudgetTokenCost + BOOST_COST} findertokens have been deducted (${highBudgetTokenCost} for high-budget posting + ${BOOST_COST} for boosting).`;
      } else if (isHighBudget) {
        responseMessage = `Find posted successfully! ${highBudgetTokenCost} findertokens have been deducted for this high-budget posting.`;
      } else if (isBoosted) {
        responseMessage = `Find posted and boosted successfully! ${BOOST_COST} findertokens have been deducted for boosting.`;
      }
      res.status(201).json({
        ...request,
        message: responseMessage
      });
    } catch (error) {
      console.error("Create find error:", error);
      res.status(400).json({ message: "Failed to create find", error: error.message });
    }
  });
  app2.get("/api/client/proposals", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view proposals" });
      }
      const proposals2 = await storage.getProposalsForClient(req.user.userId);
      res.json(proposals2);
    } catch (error) {
      console.error("Failed to fetch client proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app2.get("/api/client/transactions", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view transactions" });
      }
      const transactions2 = await storage.getTransactionsByUserId(req.user.userId);
      res.json(transactions2);
    } catch (error) {
      console.error("Failed to fetch client transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/client/balance", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view balance" });
      }
      const balance = await storage.getClientTokenBalance(req.user.userId);
      res.json({
        balance
      });
    } catch (error) {
      console.error("Failed to fetch client balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });
  app2.post("/api/finds", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can create finds" });
      }
      const requestData = insertFindSchema.parse({
        ...req.body,
        clientId: req.user.userId
      });
      const request = await storage.createFind(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to create find", error: error.message });
    }
  });
  app2.get("/api/finds/my", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view their finds" });
      }
      const finds2 = await storage.getFindsByClientId(req.user.userId);
      res.json(finds2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your finds" });
    }
  });
  app2.get("/api/finds/:id/proposals", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getFind(id);
      if (!request) {
        return res.status(404).json({ message: "Find not found" });
      }
      if (req.user.role === "client" && request.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === "finder") {
        return res.status(403).json({ message: "Finders should use finder-specific endpoints" });
      }
      const proposals2 = await storage.getProposalsByFindId(id);
      res.json(proposals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app2.get("/api/finder/finds/:id/proposals", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can use this endpoint" });
      }
      const request = await storage.getFind(id);
      if (!request) {
        return res.status(404).json({ message: "Find not found" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const proposal = await storage.getProposalByFinderAndFind(finder.id, id);
      res.json(proposal ? [proposal] : []);
    } catch (error) {
      console.error("Finder request proposals error:", error);
      res.status(500).json({ message: "Failed to fetch your proposals" });
    }
  });
  app2.post("/api/proposals", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can submit proposals" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const finderUser = await storage.getUser(req.user.userId);
      if (!finderUser) {
        return res.status(404).json({ message: "Finder user not found" });
      }
      if (finderUser.isBanned) {
        return res.status(403).json({
          message: "Your account has been banned from submitting proposals.",
          banned: true,
          bannedReason: finderUser.bannedReason,
          bannedAt: finderUser.bannedAt
        });
      }
      if (!finderUser.isVerified || !finder.isVerified) {
        return res.status(403).json({
          message: "Account must be verified and profile completed to submit proposals.",
          verified: false,
          verificationRequired: true
        });
      }
      const profileCompletion = await storage.calculateFinderProfileCompletion(finder.id);
      if (profileCompletion.completionPercentage < 100) {
        return res.status(403).json({
          message: "Account must be verified and profile completed to submit proposals.",
          profileComplete: false,
          completionPercentage: profileCompletion.completionPercentage,
          missingFields: profileCompletion.missingFields,
          profileCompletionRequired: true
        });
      }
      const proposalData = insertProposalSchema.parse({
        ...req.body,
        finderId: finder.id
      });
      const hasAccepted = await storage.hasAcceptedProposal(proposalData.findId);
      if (hasAccepted) {
        return res.status(400).json({ message: "This request has already been accepted by another finder" });
      }
      const existingProposal = await storage.getProposalByFinderAndFind(finder.id, proposalData.findId);
      if (existingProposal) {
        return res.status(400).json({ message: "You have already submitted a proposal for this request" });
      }
      const tokenCost = await storage.getAdminSetting("proposal_token_cost");
      const requiredTokens = parseInt(tokenCost?.value || "1");
      if ((finder.findertokenBalance ?? 0) < requiredTokens) {
        return res.status(400).json({ message: `Insufficient findertokens to submit proposal. Required: ${requiredTokens}, Available: ${finder.findertokenBalance ?? 0}` });
      }
      const proposal = await storage.createProposal(proposalData);
      const newBalance = (finder.findertokenBalance ?? 0) - requiredTokens;
      await storage.updateFinderTokenBalance(finder.id, newBalance);
      await storage.createTransaction({
        userId: req.user.userId,
        finderId: finder.id,
        amount: -requiredTokens,
        type: "proposal",
        description: `Proposal submitted for request: ${proposal.findId}`
      });
      try {
        const request = await storage.getFind(proposal.findId);
        if (request) {
          const clientUser = await storage.getUser(request.clientId);
          const finderUser2 = await storage.getUser(req.user.userId);
          if (clientUser && finderUser2) {
            await emailService.notifyClientNewProposal(
              clientUser.email,
              `${finderUser2.firstName} ${finderUser2.lastName}`,
              request.title,
              proposal.price.toString()
            );
          }
        }
      } catch (emailError) {
        console.error("Failed to send new proposal notification email:", emailError);
      }
      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit proposal", error: error.message });
    }
  });
  app2.get("/api/proposals/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const proposalWithDetails = await storage.getProposalWithDetails(id);
      if (!proposalWithDetails) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      if (req.user.role === "finder") {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder || proposalWithDetails.finderId !== finder.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else if (req.user.role === "client") {
        const request = await storage.getFind(proposalWithDetails.findId);
        if (!request || request.clientId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(proposalWithDetails);
    } catch (error) {
      console.error("Get proposal error:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });
  app2.get("/api/proposals/my", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can view their proposals" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const proposals2 = await storage.getProposalsByFinderId(finder.id);
      res.json(proposals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your proposals" });
    }
  });
  app2.get("/api/finder/contracts", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can view their contracts" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const contracts2 = await storage.getContractsByFinderId(finder.id);
      res.json(contracts2);
    } catch (error) {
      console.error("Failed to fetch finder contracts:", error);
      res.status(500).json({ message: "Failed to fetch your contracts" });
    }
  });
  app2.get("/api/finder/contracts/:contractId", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can view their contracts" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const { contractId } = req.params;
      const contractDetails = await storage.getContractDetails(contractId, finder.id);
      if (!contractDetails) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contractDetails);
    } catch (error) {
      console.error("Failed to fetch contract details:", error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });
  app2.post("/api/proposals/:id/accept", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await storage.getProposal(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const request = await storage.getFind(proposal.findId);
      if (!request || request.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const hasAcceptedProposal = await storage.hasAcceptedProposal(proposal.findId);
      if (hasAcceptedProposal) {
        return res.status(400).json({ message: "This find already has an accepted proposal. You cannot hire multiple finders for the same find." });
      }
      const finder = await storage.getFinder(proposal.finderId);
      const finderUser = finder ? await storage.getUser(finder.userId) : null;
      const clientUser = await storage.getUser(request.clientId);
      await storage.updateProposal(id, { status: "accepted" });
      await storage.updateFind(proposal.findId, { status: "in_progress" });
      const contract = await storage.createContract({
        findId: proposal.findId,
        proposalId: proposal.id,
        clientId: request.clientId,
        finderId: proposal.finderId,
        amount: proposal.price,
        escrowStatus: "pending"
      });
      if (finderUser && clientUser) {
        try {
          await emailService.notifyFinderHired(
            finderUser.email,
            `${clientUser.firstName} ${clientUser.lastName}`,
            request.title,
            proposal.price.toString()
          );
        } catch (emailError) {
          console.error("Failed to send hire notification email:", emailError);
        }
      }
      res.json({
        success: true,
        message: "Proposal accepted and contract created. Please complete payment to start work.",
        proposal,
        contract: {
          ...contract,
          findTitle: request.title,
          finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : "Unknown Finder"
        },
        payment: {
          required: true,
          amount: proposal.price,
          contractId: contract.id
        }
      });
    } catch (error) {
      console.error("Accept proposal error:", error);
      res.status(500).json({ message: "Failed to accept proposal and create contract" });
    }
  });
  app2.get("/api/verification/status", authenticateToken, async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      const verificationRequired = settings.verificationRequired === "true";
      if (!verificationRequired) {
        return res.json({
          isRequired: false,
          verification: null
        });
      }
      const verification = await storage.getVerificationByUserId(req.user.userId);
      res.json({
        isRequired: true,
        verification: verification || null
      });
    } catch (error) {
      console.error("Error getting verification status:", error);
      res.status(500).json({ message: "Failed to get verification status" });
    }
  });
  app2.post("/api/verification/submit", authenticateToken, upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { documentType } = req.body;
      const files = req.files;
      if (!documentType || !files.documentFront || !files.selfie) {
        return res.status(400).json({ message: "Document type, document front, and selfie are required" });
      }
      const existingVerification = await storage.getVerificationByUserId(req.user.userId);
      if (existingVerification && existingVerification.status === "pending") {
        return res.status(400).json({ message: "You already have a pending verification request" });
      }
      const verificationData = {
        userId: req.user.userId,
        documentType,
        documentFrontImage: `/uploads/${files.documentFront[0].filename}`,
        documentBackImage: files.documentBack ? `/uploads/${files.documentBack[0].filename}` : null,
        selfieImage: `/uploads/${files.selfie[0].filename}`,
        status: "pending"
      };
      const verification = await storage.submitVerification(verificationData);
      res.status(201).json({
        message: "Verification submitted successfully",
        verification
      });
    } catch (error) {
      console.error("Error submitting verification:", error);
      res.status(500).json({ message: "Failed to submit verification" });
    }
  });
  app2.post("/api/admin/verifications/:id/approve", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const verification = await storage.updateVerificationStatus(id, "verified", req.user.userId);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      console.log(`Verification approved for user ${verification.userId} - status updated to verified`);
      res.json({
        message: "Verification approved successfully",
        verification
      });
    } catch (error) {
      console.error("Error approving verification:", error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });
  app2.post("/api/admin/verifications/:id/reject", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      const verification = await storage.updateVerificationStatus(id, "rejected", req.user.userId, reason);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      res.json({
        message: "Verification rejected successfully",
        verification
      });
    } catch (error) {
      console.error("Error rejecting verification:", error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });
  app2.get("/api/admin/verifications/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const verification = await storage.getVerificationById(id);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      res.json(verification);
    } catch (error) {
      console.error("Error fetching verification details:", error);
      res.status(500).json({ message: "Failed to fetch verification details" });
    }
  });
  app2.post("/api/support/tickets", async (req, res) => {
    try {
      const { name, email, category, priority = "medium", subject, message } = req.body;
      if (!name || !email || !category || !subject || !message) {
        return res.status(400).json({
          message: "Missing required fields: name, email, category, subject, and message are required"
        });
      }
      const ticketNumber = await storage.generateTicketNumber();
      const departmentMap = {
        "account": "general",
        "billing": "billing",
        "payment": "billing",
        "technical": "technical",
        "bug": "technical",
        "feature": "general",
        "general": "general",
        "dispute": "disputes",
        "verification": "verification"
      };
      const department = departmentMap[category.toLowerCase()] || "general";
      let submitterId = null;
      const authHeader = req.headers["authorization"];
      if (authHeader) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          submitterId = decoded.userId;
        } catch (error) {
          console.log("Anonymous ticket submission - invalid/missing token");
        }
      }
      const ticketData = {
        ticketNumber,
        submitterName: name,
        submitterEmail: email,
        submitterId,
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
        department,
        subject,
        description: message,
        status: "open"
      };
      const ticket = await storage.createSupportTicket(ticketData);
      await storage.createSupportTicketMessage({
        ticketId: ticket.id,
        senderId: submitterId,
        senderType: "user",
        senderName: name,
        senderEmail: email,
        content: message,
        isInternal: false
      });
      console.log(`Support ticket created: ${ticketNumber}`, {
        id: ticket.id,
        submitter: name,
        email,
        category,
        priority,
        department,
        subject
      });
      res.status(201).json({
        success: true,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          category: ticket.category,
          priority: ticket.priority,
          department: ticket.department,
          subject: ticket.subject,
          createdAt: ticket.createdAt
        },
        message: "Support ticket submitted successfully"
      });
    } catch (error) {
      console.error("Failed to submit support ticket:", error);
      res.status(500).json({ message: "Failed to submit support ticket" });
    }
  });
  async function requireSupportAgent(req, res, next) {
    try {
      if (!req.user) {
        console.log("No user in request for support agent auth");
        return res.status(401).json({ message: "Authentication required" });
      }
      console.log("Checking support agent for user:", req.user.userId, "role:", req.user.role);
      const supportAgent = await storage.getUserSupportAgent(req.user.userId);
      console.log("Found support agent:", supportAgent ? supportAgent.id : "none");
      if (!supportAgent) {
        console.log("No support agent record found for user:", req.user.userId);
        return res.status(403).json({ message: "Support agent access required. Please contact an administrator to be assigned as a support agent." });
      }
      if (!supportAgent.isActive) {
        console.log("Support agent is not active:", supportAgent.id);
        return res.status(403).json({ message: "Support agent account is suspended" });
      }
      req.agent = supportAgent;
      console.log("Support agent authenticated successfully:", supportAgent.agentId);
      next();
    } catch (error) {
      console.error("Support agent authentication error:", error);
      res.status(500).json({ message: "Authentication error" });
    }
  }
  function requirePermission(permission) {
    return (req, res, next) => {
      const agent = req.agent;
      if (!agent || !agent.permissions.includes(permission)) {
        return res.status(403).json({ message: `Permission required: ${permission}` });
      }
      next();
    };
  }
  app2.get("/api/debug/agent-auth", authenticateToken, async (req, res) => {
    try {
      console.log("Debug: User info:", {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
      });
      const supportAgent = await storage.getUserSupportAgent(req.user.userId);
      console.log("Debug: Support agent:", supportAgent);
      res.json({
        user: {
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role
        },
        supportAgent
      });
    } catch (error) {
      console.error("Debug agent auth error:", error);
      res.status(500).json({ message: "Debug error", error: error.message });
    }
  });
  app2.get("/api/admin/support/tickets", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status, priority, department, page = 1, limit = 20 } = req.query;
      let filters = {};
      if (status && typeof status === "string") {
        filters.status = status;
      }
      if (priority && typeof priority === "string") {
        filters.priority = priority;
      }
      if (department && typeof department === "string") {
        filters.department = department;
      }
      const tickets = await storage.getSupportTickets(filters);
      res.json({
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: tickets.length
        }
      });
    } catch (error) {
      console.error("Failed to fetch admin support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });
  app2.get("/api/admin/support/tickets/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const messages2 = await storage.getSupportTicketMessages(id);
      res.json({
        ticket,
        messages: messages2
      });
    } catch (error) {
      console.error("Failed to fetch admin ticket details:", error);
      res.status(500).json({ message: "Failed to fetch ticket details" });
    }
  });
  app2.put("/api/admin/support/tickets/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, assignedTo, priority, resolution } = req.body;
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const updates = {};
      if (status !== void 0) {
        updates.status = status;
        if (status === "resolved" || status === "closed") {
          updates.resolvedAt = /* @__PURE__ */ new Date();
          if (resolution) {
            updates.resolution = resolution;
          }
        }
      }
      if (assignedTo !== void 0) {
        updates.assignedTo = assignedTo;
      }
      if (priority !== void 0) {
        updates.priority = priority;
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid updates provided" });
      }
      const updatedTicket = await storage.updateSupportTicket(id, updates);
      res.json({
        ticket: updatedTicket,
        message: "Ticket updated successfully"
      });
    } catch (error) {
      console.error("Failed to update admin ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });
  app2.get("/api/agent/tickets", authenticateToken, requireSupportAgent, async (req, res) => {
    try {
      const agent = req.agent;
      const { status, priority, page = 1, limit = 20 } = req.query;
      let filters = {};
      if (agent.department !== "all") {
        filters.department = agent.department;
      }
      if (status && typeof status === "string") {
        filters.status = status;
      }
      if (priority && typeof priority === "string") {
        filters.priority = priority;
      }
      if (!agent.permissions.includes("view_all_tickets")) {
        filters.assignedTo = agent.id;
      }
      const tickets = await storage.getSupportTickets(filters);
      console.log(`Agent ${agent.agentId} viewing tickets`, {
        department: agent.department,
        filters,
        count: tickets.length
      });
      res.json({
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: tickets.length
        },
        agent: {
          id: agent.id,
          agentId: agent.agentId,
          department: agent.department,
          permissions: agent.permissions
        }
      });
    } catch (error) {
      console.error("Failed to fetch tickets for agent:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });
  app2.get("/api/agent/tickets/:id", authenticateToken, requireSupportAgent, requirePermission("view_tickets"), async (req, res) => {
    try {
      const { id } = req.params;
      const agent = req.agent;
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (agent.department !== "all" && ticket.department !== agent.department) {
        if (!agent.permissions.includes("view_all_tickets") && ticket.assignedTo !== agent.id) {
          return res.status(403).json({ message: "Access denied to this ticket" });
        }
      }
      const messages2 = await storage.getSupportTicketMessages(id);
      console.log(`Agent ${agent.agentId} viewing ticket ${ticket.ticketNumber}`);
      res.json({
        ticket,
        messages: messages2.map((msg) => ({
          ...msg,
          // Hide internal messages from non-agent viewers if needed
          isInternal: msg.isInternal && !agent.permissions.includes("view_internal_notes") ? false : msg.isInternal
        }))
      });
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      res.status(500).json({ message: "Failed to fetch ticket details" });
    }
  });
  app2.post("/api/agent/tickets/:id/messages", authenticateToken, requireSupportAgent, requirePermission("respond_tickets"), async (req, res) => {
    try {
      const { id } = req.params;
      const { content, isInternal = false } = req.body;
      const agent = req.agent;
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (agent.department !== "all" && ticket.department !== agent.department) {
        if (!agent.permissions.includes("respond_all_tickets") && ticket.assignedTo !== agent.id) {
          return res.status(403).json({ message: "Access denied to respond to this ticket" });
        }
      }
      if (isInternal && !agent.permissions.includes("internal_notes")) {
        return res.status(403).json({ message: "Permission denied for internal notes" });
      }
      const message = await storage.createSupportTicketMessage({
        ticketId: id,
        senderId: agent.userId,
        senderType: "agent",
        senderName: `${agent.user?.firstName || ""} ${agent.user?.lastName || ""}`.trim() || agent.agentId,
        content,
        isInternal
      });
      let statusUpdate = {};
      if (ticket.status === "open") {
        statusUpdate = { status: "in_progress" };
      }
      if (!ticket.assignedTo && agent.permissions.includes("assign_tickets")) {
        statusUpdate = { ...statusUpdate, assignedTo: agent.id };
      }
      if (Object.keys(statusUpdate).length > 0) {
        await storage.updateSupportTicket(id, statusUpdate);
      }
      console.log(`Agent ${agent.agentId} responded to ticket ${ticket.ticketNumber}`, {
        messageId: message.id,
        isInternal,
        statusUpdate
      });
      res.status(201).json({
        message,
        ticket: await storage.getSupportTicket(id)
      });
    } catch (error) {
      console.error("Failed to add ticket response:", error);
      res.status(500).json({ message: "Failed to add response" });
    }
  });
  app2.put("/api/agent/tickets/:id", authenticateToken, requireSupportAgent, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, assignedTo, priority, resolution } = req.body;
      const agent = req.agent;
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const updates = {};
      if (status !== void 0) {
        if (status === "closed" && !agent.permissions.includes("close_tickets")) {
          return res.status(403).json({ message: "Permission denied to close tickets" });
        }
        updates.status = status;
        if (status === "resolved" || status === "closed") {
          updates.resolvedAt = /* @__PURE__ */ new Date();
          if (resolution) {
            updates.resolution = resolution;
          }
        }
      }
      if (assignedTo !== void 0 && agent.permissions.includes("assign_tickets")) {
        updates.assignedTo = assignedTo;
      }
      if (priority !== void 0 && agent.permissions.includes("modify_priority")) {
        updates.priority = priority;
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid updates provided" });
      }
      const updatedTicket = await storage.updateSupportTicket(id, updates);
      console.log(`Agent ${agent.agentId} updated ticket ${ticket.ticketNumber}`, updates);
      res.json({
        ticket: updatedTicket,
        message: "Ticket updated successfully"
      });
    } catch (error) {
      console.error("Failed to update ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });
  app2.get("/api/agent/dashboard", authenticateToken, requireSupportAgent, async (req, res) => {
    try {
      const agent = req.agent;
      const assignedTickets = await storage.getSupportTickets({ assignedTo: agent.id });
      let departmentFilters = {};
      if (agent.department !== "all") {
        departmentFilters.department = agent.department;
      }
      const departmentTickets = await storage.getSupportTickets(departmentFilters);
      const stats = {
        assigned: {
          total: assignedTickets.length,
          open: assignedTickets.filter((t) => t.status === "open").length,
          inProgress: assignedTickets.filter((t) => t.status === "in_progress").length,
          resolved: assignedTickets.filter((t) => t.status === "resolved").length
        },
        department: {
          total: departmentTickets.length,
          unassigned: departmentTickets.filter((t) => !t.assignedTo).length,
          urgent: departmentTickets.filter((t) => t.priority === "urgent").length,
          high: departmentTickets.filter((t) => t.priority === "high").length
        }
      };
      res.json({
        agent: {
          id: agent.id,
          agentId: agent.agentId,
          department: agent.department,
          permissions: agent.permissions,
          maxTicketsPerDay: agent.maxTicketsPerDay,
          responseTimeTarget: agent.responseTimeTarget
        },
        statistics: stats,
        recentTickets: assignedTickets.slice(0, 5).map((ticket) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
          submitterName: ticket.submitterName
        }))
      });
    } catch (error) {
      console.error("Failed to fetch agent dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  app2.post("/api/contracts/:contractId/payment", authenticateToken, async (req, res) => {
    try {
      const { contractId } = req.params;
      console.log(`[CONTRACT PAYMENT] Initializing payment for contract: ${contractId}`);
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (contract.escrowStatus === "funded" || contract.escrowStatus === "held") {
        return res.status(400).json({
          message: "Contract is already funded",
          escrowStatus: contract.escrowStatus
        });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }
      const reference = flutterwaveService.generateTransactionReference(user.id);
      const amount = parseFloat(contract.amount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid contract amount" });
      }
      const proposal = await storage.getProposal(contract.proposalId);
      const find = proposal ? await storage.getFind(proposal.findId) : null;
      const baseUrl = flutterwaveService.getBaseUrl();
      const redirectUrl = `${baseUrl}/client/payment-success?type=contract&contractId=${contractId}&reference=${reference}`;
      const paymentData = await flutterwaveService.initializePayment({
        email: user.email,
        amount,
        reference,
        metadata: {
          userId: user.id,
          userRole: "client",
          contractId,
          type: "contract_payment",
          description: find ? `Contract payment for: ${find.title}` : "Contract payment",
          customerName: `${user.firstName} ${user.lastName}`
        },
        redirectUrl
      });
      console.log(`[CONTRACT PAYMENT] Payment initialized successfully for contract ${contractId}`);
      res.json(paymentData);
    } catch (error) {
      console.error("[CONTRACT PAYMENT] Error:", error);
      res.status(500).json({
        message: "Failed to initialize payment",
        error: error.message
      });
    }
  });
  app2.get("/api/tokens/packages", async (req, res) => {
    try {
      const tokenPackages3 = await storage.getActiveTokenPackages();
      res.json(tokenPackages3);
    } catch (error) {
      console.error("Failed to fetch token packages:", error);
      res.status(500).json({ message: "Failed to fetch token packages" });
    }
  });
  app2.post("/api/tokens/purchase", authenticateToken, async (req, res) => {
    try {
      const { packageId } = req.body;
      console.log(`[TOKEN PURCHASE] Initializing purchase for package: ${packageId}`);
      const selectedPackage = await storage.getTokenPackage(packageId);
      if (!selectedPackage || !selectedPackage.isActive) {
        return res.status(400).json({ message: "Invalid package selected" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }
      const reference = flutterwaveService.generateTransactionReference(user.id);
      const baseUrl = flutterwaveService.getBaseUrl();
      const redirectUrl = `${baseUrl}/${user.role}/payment-success?type=tokens&reference=${reference}`;
      const paymentData = await flutterwaveService.initializePayment({
        email: user.email,
        amount: parseFloat(selectedPackage.price),
        reference,
        metadata: {
          userId: user.id,
          userRole: user.role,
          type: "token_purchase",
          tokens: selectedPackage.tokenCount,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          description: `Purchase of ${selectedPackage.tokenCount} FinderTokens - ${selectedPackage.name}`,
          customerName: `${user.firstName} ${user.lastName}`
        },
        redirectUrl
      });
      console.log(`[TOKEN PURCHASE] Payment initialized successfully for user ${user.id}`);
      res.json(paymentData);
    } catch (error) {
      console.error("[TOKEN PURCHASE] Error:", error);
      res.status(500).json({
        message: "Failed to initialize token purchase",
        error: error.message
      });
    }
  });
  app2.get("/api/tokens/verify/:reference", authenticateToken, async (req, res) => {
    try {
      const { reference } = req.params;
      console.log(`[TOKEN VERIFY] Verifying purchase - Reference: ${reference}`);
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }
      const transaction = await flutterwaveService.verifyTransaction(reference);
      if (transaction.status === "success") {
        if (transaction.metadata?.userId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        const existingTransaction = await storage.getTransactionByReference(reference);
        if (!existingTransaction) {
          const tokens = transaction.metadata?.tokens || getTokensFromAmount(transaction.amount);
          await storage.addClientFindertokens(
            req.user.userId,
            tokens,
            `FinderToken\u2122 purchase - ${transaction.metadata?.packageName || "Token Package"}`
          );
          await storage.createTransaction({
            userId: req.user.userId,
            type: "findertoken_purchase",
            amount: tokens,
            description: `FinderToken\u2122 purchase - ${tokens} tokens`,
            reference
          });
          console.log(`[TOKEN VERIFY] Added ${tokens} tokens to user ${req.user.userId}`);
        }
        res.json({
          status: "success",
          message: "Token purchase verified successfully",
          tokens: transaction.metadata?.tokens || getTokensFromAmount(transaction.amount),
          transaction: {
            reference,
            amount: transaction.amount,
            currency: transaction.currency
          }
        });
      } else {
        res.json({
          status: "failed",
          message: "Payment verification failed"
        });
      }
    } catch (error) {
      console.error("[TOKEN VERIFY] Error:", error);
      res.status(500).json({
        message: "Failed to verify token purchase",
        error: error.message
      });
    }
  });
  app2.get("/api/findertokens/flutterwave-packages", (req, res) => {
    res.json(FLUTTERWAVE_TOKEN_PACKAGES);
  });
  app2.post("/api/tokens/purchase", authenticateToken, async (req, res) => {
    try {
      const { tokenAmount, amount } = req.body;
      if (!tokenAmount || !amount || tokenAmount <= 0 || amount <= 0) {
        return res.status(400).json({ message: "Invalid token amount or price" });
      }
      const flutterwaveService = new FlutterwaveService();
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const reference = flutterwaveService.generateTransactionReference(req.user.userId);
      const callbackUrl = `${req.protocol}://${req.get("host")}/finder/payment-success?payment=success&reference=${reference}`;
      const transaction = await flutterwaveService.initializePayment({
        email: user.email,
        amount,
        // Amount in naira
        reference,
        metadata: {
          userId: req.user.userId,
          tokens: tokenAmount,
          package_type: "findertoken_special"
        },
        redirectUrl: callbackUrl
      });
      res.json(transaction);
    } catch (error) {
      console.error("Token purchase initialization error:", error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });
  app2.post("/api/payments/initialize", authenticateToken, async (req, res) => {
    try {
      const { packageId } = req.body;
      const flutterwaveService = new FlutterwaveService();
      const selectedPackage = FLUTTERWAVE_TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const reference = flutterwaveService.generateTransactionReference(req.user.userId);
      const transaction = await flutterwaveService.initializePayment({
        email: user.email,
        amount: selectedPackage.price,
        reference,
        metadata: {
          userId: req.user.userId,
          packageId,
          tokens: selectedPackage.tokens
        },
        redirectUrl: `${req.protocol}://${req.get("host")}/payment-success`
      });
      res.json(transaction);
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });
  app2.get("/api/payments/flutterwave/config", authenticateToken, async (req, res) => {
    try {
      const flutterwaveService = new FlutterwaveService();
      res.json({
        isConfigured: flutterwaveService.isConfigured(),
        hasSecretKey: !!process.env.FLUTTERWAVE_SECRET_KEY,
        hasPublicKey: !!process.env.FLUTTERWAVE_PUBLIC_KEY
      });
    } catch (error) {
      console.error("Error checking Flutterwave configuration:", error);
      res.status(500).json({ message: "Failed to check Flutterwave configuration" });
    }
  });
  app2.post("/api/payments/flutterwave/initialize", authenticateToken, async (req, res) => {
    try {
      const { packageId, phone, customerName } = req.body;
      const flutterwaveService = new FlutterwaveService();
      const selectedPackage = FLUTTERWAVE_TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const reference = flutterwaveService.generateTransactionReference(req.user.userId);
      const transaction = await flutterwaveService.initializePayment({
        email: user.email,
        amount: selectedPackage.price,
        reference,
        metadata: {
          userId: req.user.userId,
          packageId,
          tokens: selectedPackage.tokens
        },
        redirectUrl: `${req.protocol}://${req.get("host")}/payment-success`
      });
      res.json(transaction);
    } catch (error) {
      console.error("Flutterwave payment initialization error:", error);
      res.status(500).json({ message: "Failed to initialize Flutterwave payment" });
    }
  });
  app2.post("/api/client/tokens/flutterwave/initialize", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can purchase tokens" });
      }
      const { packageId, phone, customerName } = req.body;
      const flutterwaveService = new FlutterwaveService();
      const tokenPackages3 = await storage.getActiveTokenPackages();
      const selectedPackage = tokenPackages3.find((pkg) => pkg.id === packageId);
      if (!selectedPackage) {
        console.log("Available packages:", tokenPackages3.map((p) => ({ id: p.id, name: p.name })));
        console.log("Requested package ID:", packageId);
        return res.status(404).json({ message: "Package not found" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const reference = flutterwaveService.generateTransactionReference(req.user.userId);
      const transaction = await flutterwaveService.initializePayment({
        email: user.email,
        amount: parseFloat(selectedPackage.price),
        reference,
        metadata: {
          userId: req.user.userId,
          packageId,
          tokens: selectedPackage.tokenCount,
          phone,
          customerName: customerName || `${user.firstName} ${user.lastName}`,
          userRole: "client"
        },
        redirectUrl: `${req.protocol}://${req.get("host")}/client/payment-success`
      });
      res.json(transaction);
    } catch (error) {
      console.error("Client Flutterwave payment initialization error:", error);
      res.status(500).json({ message: "Failed to initialize Flutterwave payment" });
    }
  });
  app2.get("/api/client/tokens/flutterwave/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();
      const transaction = await flutterwaveService.verifyTransaction(reference);
      if (transaction.status === "success") {
        const userId = transaction.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }
        const user = await storage.getUser(userId);
        if (!user || user.role !== "client") {
          return res.status(403).json({ message: "Only clients can verify token purchases" });
        }
        const existingTransaction = await storage.getTransactionByReference(reference);
        if (!existingTransaction) {
          const tokens = parseInt(transaction.metadata?.tokens) || Math.floor(transaction.amount / 2.9) || 10;
          await storage.addClientFindertokens(userId, tokens, `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`);
          await storage.createTransaction({
            userId,
            type: "findertoken_purchase",
            amount: tokens,
            description: `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`,
            reference
          });
          console.log(`Flutterwave client verification: Added ${tokens} tokens to client ${userId}`);
        } else {
          console.log(`Flutterwave client verification: Transaction ${reference} already processed`);
        }
        res.json({
          status: "success",
          data: transaction
        });
      } else {
        res.json({
          status: "failed",
          message: "Payment was not successful"
        });
      }
    } catch (error) {
      console.error("Client Flutterwave payment verification error:", error);
      res.status(500).json({ message: "Failed to verify Flutterwave payment" });
    }
  });
  app2.get("/api/payments/verify/:reference", authenticateToken, async (req, res) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();
      const transaction = await flutterwaveService.verifyTransaction(reference);
      if (transaction.status === "success") {
        const { metadata } = transaction;
        const { userId, tokens } = metadata;
        if (userId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        const finder = await storage.getFinderByUserId(userId);
        if (finder) {
          const existingTransaction = await storage.getTransactionByReference(reference);
          if (!existingTransaction) {
            const currentBalance = finder.findertokenBalance || 0;
            await storage.updateFinder(finder.id, {
              findertokenBalance: currentBalance + tokens
            });
            await storage.createTransaction({
              userId,
              finderId: finder.id,
              type: "findertoken_purchase",
              amount: tokens,
              description: `FinderToken\u2122 purchase - ${tokens} tokens`,
              reference
            });
          }
        }
        res.json({
          status: "success",
          data: transaction
        });
      } else {
        res.json({
          status: "failed",
          message: "Payment was not successful"
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });
  app2.get("/api/payments/flutterwave/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();
      const transaction = await flutterwaveService.verifyTransaction(reference);
      if (transaction.status === "success") {
        const userId = transaction.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }
        const finder = await storage.getFinderByUserId(userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }
        const existingTransaction = await storage.getTransactionByReference(reference);
        if (!existingTransaction) {
          const tokens = parseInt(transaction.metadata?.tokens) || Math.floor(transaction.amount / 2.9) || 10;
          const currentBalance = finder.findertokenBalance || 0;
          await storage.updateFinder(finder.id, {
            findertokenBalance: currentBalance + tokens
          });
          await storage.createTransaction({
            userId,
            finderId: finder.id,
            type: "findertoken_purchase",
            amount: tokens,
            description: `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`,
            reference
          });
          console.log(`Flutterwave verification: Added ${tokens} tokens to user ${userId}`);
        } else {
          console.log(`Flutterwave verification: Transaction ${reference} already processed`);
        }
        res.json({
          status: "success",
          data: transaction
        });
      } else {
        res.json({
          status: "failed",
          message: "Payment was not successful"
        });
      }
    } catch (error) {
      console.error("Flutterwave payment verification error:", error);
      res.status(500).json({ message: "Failed to verify Flutterwave payment" });
    }
  });
  app2.get("/api/orders/contract/:contractId", authenticateToken, async (req, res) => {
    try {
      const { contractId } = req.params;
      console.log("Fetching contract for review:", contractId);
      const contractData = await storage.getContract(contractId);
      if (!contractData) {
        console.log("Contract not found:", contractId);
        return res.status(404).json({ message: "Contract not found" });
      }
      console.log("Found contract:", contractData);
      if (req.user.role === "client" && contractData.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === "finder") {
        const finder2 = await storage.getFinderByUserId(req.user.userId);
        if (!finder2 || contractData.finderId !== finder2.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      const finderData = await storage.getFinder(contractData.finderId);
      let finderUser = null;
      if (finderData) {
        finderUser = await storage.getUser(finderData.userId);
      }
      const finder = finderUser ? {
        id: finderData.id,
        name: `${finderUser.firstName} ${finderUser.lastName}`,
        email: finderUser.email,
        rating: finderData.averageRating
      } : null;
      const submission = await storage.getOrderSubmissionByContractId(contractId);
      const response = {
        ...contractData,
        finder,
        orderSubmission: submission || null
      };
      console.log("Returning contract data:", response);
      res.json(response);
    } catch (error) {
      console.error("Error fetching contract for review:", error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });
  app2.post("/api/orders/submit", authenticateToken, async (req, res) => {
    try {
      const { contractId, submissionText, attachmentPaths } = req.body;
      console.log("Order submission request:", { contractId, submissionText, attachmentPaths });
      if (!contractId) {
        console.log("Missing contract ID");
        return res.status(400).json({ message: "Contract ID is required" });
      }
      const contract = await storage.getContract(contractId);
      if (!contract) {
        console.log("Contract not found:", contractId);
        return res.status(404).json({ message: "Contract not found" });
      }
      if (req.user.role !== "finder") {
        console.log("User is not a finder:", req.user.role);
        return res.status(403).json({ message: "Only finders can submit orders" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        console.log("Finder profile not found for user:", req.user.userId);
        return res.status(404).json({ message: "Finder profile not found" });
      }
      if (contract.finderId !== finder.id) {
        console.log("Finder mismatch - finder:", finder.id, "contract finder:", contract.finderId);
        return res.status(403).json({ message: "Access denied" });
      }
      if (contract.escrowStatus !== "funded") {
        console.log("Contract not funded. Status:", contract.escrowStatus);
        return res.status(400).json({ message: "Contract must be funded before submitting work" });
      }
      if (!submissionText && (!attachmentPaths || attachmentPaths.length === 0)) {
        console.log("No submission content provided");
        return res.status(400).json({ message: "Submission must include text or attachments" });
      }
      const submissionData = {
        contractId,
        finderId: finder.id,
        // Add finderId from authenticated user's finder profile
        submissionText: submissionText || "",
        attachmentPaths: attachmentPaths || [],
        status: "submitted",
        submittedAt: /* @__PURE__ */ new Date()
      };
      console.log("Creating/updating submission with data:", submissionData);
      const submission = await storage.createOrUpdateOrderSubmission(submissionData);
      await storage.updateContract(contractId, { hasSubmission: true });
      try {
        const clientUser = await storage.getUser(contract.clientId);
        const finderUser = await storage.getUser(req.user.userId);
        if (clientUser && finderUser) {
          await emailService.notifyClientOrderSubmitted(
            clientUser.email,
            `${finderUser.firstName} ${finderUser.lastName}`,
            contract.id
          );
        }
      } catch (emailError) {
        console.error("Failed to send order submission email:", emailError);
      }
      console.log("Order submitted successfully:", submission);
      return res.status(200).json({
        success: true,
        message: "Order submitted successfully",
        submission
      });
    } catch (error) {
      console.error("Order submission error:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        message: "Failed to submit order",
        error: error.message || "Unknown error occurred"
      });
    }
  });
  app2.put("/api/orders/submission/:submissionId", authenticateToken, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { status, clientFeedback } = req.body;
      console.log("Review submission request:", { submissionId, status, clientFeedback });
      if (!status || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'" });
      }
      const submission = await storage.updateOrderSubmission(submissionId, {
        status,
        clientFeedback,
        reviewedAt: /* @__PURE__ */ new Date()
      });
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      const contract = await storage.getContract(submission.contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (req.user.role !== "client" || contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Only the client can review submissions" });
      }
      if (status === "accepted") {
        console.log(`Accepting order for contract ${contract.id}, amount: ${contract.amount}, finder: ${contract.finderId}`);
        const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
        const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
        const grossAmount = parseFloat(contract.amount);
        const feeAmount = grossAmount * platformFeePercentage / 100;
        const netAmount = grossAmount - feeAmount;
        console.log(`Releasing funds: ${netAmount} to finder ${contract.finderId} (gross: ${grossAmount}, fee: ${feeAmount})`);
        await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
        console.log(`Funds released to finder ${contract.finderId}`);
        await storage.updateContract(contract.id, {
          isCompleted: true,
          completedAt: /* @__PURE__ */ new Date(),
          escrowStatus: "released"
        });
        console.log(`Contract ${contract.id} updated to completed and released`);
        try {
          const finder = await storage.getFinder(contract.finderId);
          if (finder) {
            const finderUser = await storage.getUser(finder.userId);
            const clientUser = await storage.getUser(req.user.userId);
            if (finderUser && clientUser) {
              await emailService.notifyFinderOrderAccepted(
                finderUser.email,
                `${clientUser.firstName} ${clientUser.lastName}`,
                netAmount
              );
            }
          }
        } catch (emailError) {
          console.error("Failed to send order acceptance email:", emailError);
        }
      }
      res.json({
        success: true,
        message: status === "accepted" ? "Order accepted successfully" : "Order rejected - finder can resubmit",
        submission
      });
    } catch (error) {
      console.error("Review submission error:", error);
      res.status(500).json({
        message: "Failed to review submission",
        error: error.message || "Unknown error occurred"
      });
    }
  });
  app2.get("/api/contracts/:contractId/verify-payment/:reference", async (req, res) => {
    try {
      const { contractId, reference } = req.params;
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      const flutterwaveService = new FlutterwaveService();
      const verification = await flutterwaveService.verifyTransaction(reference);
      if (verification.status === "success") {
        const userId = verification.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }
        if (contract.clientId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        const existingTransaction = await storage.getTransactionByReference(reference);
        if (!existingTransaction) {
          await storage.updateContract(contractId, {
            escrowStatus: "funded"
          });
          await storage.createTransaction({
            userId,
            type: "contract_payment",
            amount: parseFloat(verification.amount),
            description: `Contract payment for contract ${contractId}`,
            reference
          });
          console.log(`Contract ${contractId} payment verified and funded`);
        }
        res.json({
          status: "success",
          message: "Payment verified and contract funded",
          contract: await storage.getContract(contractId)
        });
      } else {
        res.json({
          status: "failed",
          message: "Payment verification failed"
        });
      }
    } catch (error) {
      console.error("Contract payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });
  app2.post("/api/payments/flutterwave/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      const flutterwaveService = new FlutterwaveService();
      const signature = req.headers["verif-hash"];
      const payload = req.body.toString();
      console.log("Flutterwave webhook received:", {
        signature: signature ? "present" : "missing",
        payloadLength: payload.length,
        headers: Object.keys(req.headers)
      });
      if (!flutterwaveService.verifyWebhookSignature(payload, signature)) {
        console.log("Invalid Flutterwave webhook signature - proceeding anyway for debugging");
      }
      let event;
      try {
        event = JSON.parse(payload);
      } catch (parseError) {
        console.error("Failed to parse webhook payload:", parseError);
        return res.status(400).send("Invalid JSON payload");
      }
      console.log("Flutterwave webhook event received:", event.event, event.data?.status);
      if (event.event === "charge.completed" && event.data.status === "successful") {
        const { tx_ref, amount, meta } = event.data;
        const { userId, tokens, userRole, type, contractId } = meta || {};
        console.log("Processing successful charge:", {
          tx_ref,
          amount,
          userId,
          tokens,
          userRole,
          type,
          contractId
        });
        if (!userId) {
          console.log("Missing userId in Flutterwave webhook metadata");
          return res.status(400).send("Missing userId in metadata");
        }
        const existingTransaction = await storage.getTransactionByReference(tx_ref);
        if (!existingTransaction) {
          console.log("Transaction not processed yet, proceeding with payment processing");
          if (type === "contract_payment" && contractId) {
            console.log(`Processing contract payment: ${contractId} for user ${userId}`);
            try {
              const contract = await storage.getContract(contractId);
              if (contract && contract.clientId === userId) {
                await storage.updateContract(contractId, {
                  escrowStatus: "funded",
                  isCompleted: false
                });
                await storage.createTransaction({
                  userId,
                  type: "contract_payment",
                  amount,
                  description: `Contract funding via Flutterwave - Contract ${contractId}`,
                  reference: tx_ref
                });
                console.log(`Flutterwave webhook: Contract ${contractId} funded with ${amount} NGN`);
              } else {
                console.log(`Flutterwave webhook: Contract ${contractId} not found or access denied`);
                console.log(`Contract exists: ${!!contract}, Client ID match: ${contract?.clientId === userId}`);
              }
            } catch (contractError) {
              console.error("Error processing contract payment:", contractError);
            }
          } else if (tokens) {
            console.log(`Processing token purchase: ${tokens} tokens for user ${userId} with role ${userRole}`);
            if (userRole === "client") {
              try {
                await storage.addClientFindertokens(userId, tokens, `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`);
                await storage.createTransaction({
                  userId,
                  type: "findertoken_purchase",
                  amount: tokens,
                  description: `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`,
                  reference: tx_ref
                });
                console.log(`Flutterwave webhook: Added ${tokens} tokens to client ${userId}`);
              } catch (clientError) {
                console.error("Error processing client token purchase:", clientError);
              }
            } else {
              const finder = await storage.getFinderByUserId(userId);
              if (finder) {
                const currentBalance = finder.findertokenBalance || 0;
                await storage.updateFinder(finder.id, {
                  findertokenBalance: currentBalance + tokens
                });
                await storage.createTransaction({
                  userId,
                  finderId: finder.id,
                  type: "findertoken_purchase",
                  amount: tokens,
                  description: `FinderToken\u2122 purchase via Flutterwave - ${tokens} tokens`,
                  reference: tx_ref
                });
                console.log(`Flutterwave webhook: Added ${tokens} tokens to finder ${userId}`);
              } else {
                console.log(`Flutterwave webhook: Finder not found for user ${userId}`);
              }
            }
          } else {
            console.log("Flutterwave webhook: No tokens or contract info in metadata");
          }
        } else {
          console.log(`Flutterwave webhook: Transaction ${tx_ref} already processed`);
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      console.error("Flutterwave webhook error:", error);
      res.status(500).send("Error processing Flutterwave webhook");
    }
  });
  app2.get("/api/admin/token-packages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const packages = await storage.getAllTokenPackages();
      res.json(packages);
    } catch (error) {
      console.error("Failed to fetch token packages:", error);
      res.status(500).json({ message: "Failed to fetch token packages" });
    }
  });
  app2.post("/api/admin/token-packages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, description, price, tokenCount, isActive } = req.body;
      if (!name || !price || !tokenCount) {
        return res.status(400).json({ message: "Name, price, and token count are required" });
      }
      const packageData = {
        name,
        description: description || null,
        price: price.toString(),
        tokenCount: parseInt(tokenCount),
        isActive: isActive !== void 0 ? isActive : true
      };
      const tokenPackage = await storage.createTokenPackage(packageData);
      res.status(201).json(tokenPackage);
    } catch (error) {
      console.error("Failed to create token package:", error);
      res.status(500).json({ message: "Failed to create token package" });
    }
  });
  app2.put("/api/admin/token-packages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, tokenCount, isActive } = req.body;
      const updates = {};
      if (name !== void 0) updates.name = name;
      if (description !== void 0) updates.description = description;
      if (price !== void 0) updates.price = price.toString();
      if (tokenCount !== void 0) updates.tokenCount = parseInt(tokenCount);
      if (isActive !== void 0) updates.isActive = isActive;
      const tokenPackage = await storage.updateTokenPackage(id, updates);
      if (!tokenPackage) {
        return res.status(404).json({ message: "Token package not found" });
      }
      res.json(tokenPackage);
    } catch (error) {
      console.error("Failed to update token package:", error);
      res.status(500).json({ message: "Failed to update token package" });
    }
  });
  app2.delete("/api/admin/token-packages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTokenPackage(id);
      if (!success) {
        return res.status(404).json({ message: "Token package not found" });
      }
      res.json({ message: "Token package deleted successfully" });
    } catch (error) {
      console.error("Failed to delete token package:", error);
      res.status(500).json({ message: "Failed to delete token package" });
    }
  });
  app2.get("/api/admin/token-grants", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const allGrants = await storage.getTokenGrants();
      res.json(allGrants);
    } catch (error) {
      console.error("Failed to fetch token grants:", error);
      res.status(500).json({ message: "Failed to fetch token grants" });
    }
  });
  app2.post("/api/admin/grant-tokens", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { userId, userType, amount, reason } = req.body;
      if (!userId || !userType || !amount || !reason) {
        return res.status(400).json({ message: "User ID, user type, amount, and reason are required" });
      }
      if (userType !== "finder" && userType !== "client") {
        return res.status(400).json({ message: "User type must be either 'finder' or 'client'" });
      }
      const grantAmount = parseInt(amount);
      if (isNaN(grantAmount) || grantAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
      }
      let grant;
      if (userType === "finder") {
        const finder = await storage.getFinderByUserId(userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder not found" });
        }
        grant = await storage.grantTokensToFinder(finder.id, grantAmount, reason, req.user.userId);
      } else {
        const client = await storage.getUser(userId);
        if (!client || client.role !== "client") {
          return res.status(404).json({ message: "Client not found" });
        }
        grant = await storage.grantTokensToClient(userId, grantAmount, reason, req.user.userId);
      }
      res.status(201).json({ message: "Tokens granted successfully", grant });
    } catch (error) {
      console.error("Failed to grant tokens:", error);
      res.status(500).json({ message: "Failed to grant tokens" });
    }
  });
  app2.get("/api/client/contracts", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view contracts" });
      }
      const contracts2 = await storage.getContractsByClientId(req.user.userId);
      res.json(contracts2);
    } catch (error) {
      console.error("Failed to fetch client contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });
  app2.get("/api/client/contracts/:contractId", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view contract details" });
      }
      const { contractId } = req.params;
      const contracts2 = await storage.getContractsByClientId(req.user.userId);
      const contract = contracts2.find((c) => c.id === contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found or access denied" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Failed to fetch contract details:", error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });
  app2.get("/api/contracts/my", authenticateToken, async (req, res) => {
    try {
      let contracts2;
      if (req.user.role === "client") {
        contracts2 = await storage.getContractsByClientId(req.user.userId);
      } else if (req.user.role === "finder") {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }
        contracts2 = await storage.getContractsByFinderId(finder.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(contracts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });
  app2.post("/api/contracts/:id/complete", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder || contract.finderId !== finder.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      await db.update(contracts).set({
        isCompleted: true,
        escrowStatus: "completed",
        completedAt: /* @__PURE__ */ new Date()
      }).where(eq4(contracts.id, id));
      const completedCount = await db.select().from(contracts).where(eq4(contracts.finderId, contract.finderId)).where(eq4(contracts.isCompleted, true));
      await db.update(finders).set({ jobsCompleted: completedCount.length }).where(eq4(finders.id, contract.finderId));
      res.json({ message: "Contract marked as complete" });
    } catch (error) {
      res.status(500).json({ message: "Failed to complete contract" });
    }
  });
  app2.post("/api/contracts/:id/release-payment", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (contract.escrowStatus === "released") {
        return res.status(400).json({ message: "Payment has already been released" });
      }
      await storage.updateContract(id, { escrowStatus: "released" });
      await storage.releaseFundsToFinder(contract.finderId, contract.amount.toString());
      res.json({ message: "Payment released successfully" });
    } catch (error) {
      console.error("Release payment error:", error);
      res.status(500).json({ message: "Failed to release payment" });
    }
  });
  app2.post("/api/contracts/:id/dispute", authenticateToken, async (req, res) => {
    try {
      const contractId = req.params.id;
      const { type, description, evidence } = req.body;
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      const isClient = contract.clientId === req.user.userId;
      const finder = await storage.getFinderByUserId(req.user.userId);
      const isFinder = finder && contract.finderId === finder.id;
      if (!isClient && !isFinder) {
        return res.status(403).json({ message: "Only contract participants can submit disputes" });
      }
      const dispute = await storage.createDispute({
        userId: req.user.userId,
        contractId,
        type: type || "contract_dispute",
        description,
        evidence: evidence || null,
        status: "pending"
      });
      const user = await storage.getUser(req.user.userId);
      const adminUsers = await storage.getAllUsers();
      const admins = adminUsers.filter((u) => u.role === "admin");
      try {
        for (const admin of admins) {
          await emailService.notifyAdminNewDispute(
            admin.email,
            dispute.id,
            user ? `${user.firstName} ${user.lastName}` : "Unknown User",
            type || "contract_dispute",
            description
          );
        }
      } catch (emailError) {
        console.error("Failed to send admin dispute notifications:", emailError);
      }
      res.status(201).json({
        message: "Dispute submitted successfully. An administrator will review your case.",
        dispute
      });
    } catch (error) {
      console.error("Dispute submission error:", error);
      res.status(500).json({ message: "Failed to submit dispute" });
    }
  });
  app2.post("/api/reviews", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can leave reviews" });
      }
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        clientId: req.user.userId
      });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Failed to create review", error: error.message });
    }
  });
  app2.get("/api/findertokens/balance", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders have findertoken balances" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const findertokenBalance = await storage.getFindertokenBalance(finder.id);
      res.json(findertokenBalance || { balance: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch findertoken balance" });
    }
  });
  app2.get("/api/transactions/my", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can view transactions" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const transactions2 = await storage.getTransactionsByFinderId(finder.id);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/admin/contact-settings", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings);
    } catch (error) {
      console.error("Failed to fetch contact settings:", error);
      res.status(500).json({ message: "Failed to fetch contact settings" });
    }
  });
  app2.put("/api/admin/contact-settings", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const settings = req.body;
      const updated = await storage.updateContactSettings(settings);
      res.json(updated);
    } catch (error) {
      console.error("Failed to update contact settings:", error);
      res.status(500).json({ message: "Failed to update contact settings" });
    }
  });
  app2.get("/api/admin/categories", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const categories2 = await storage.getAllCategories();
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/admin/categories", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }
      const category = await storage.createCategory({
        name,
        description: description || "",
        isActive: true
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category", error: error.message });
    }
  });
  app2.put("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  app2.delete("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getActiveCategories();
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/public/categories", async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const categories2 = await db.select().from(faqCategories2).where(eq4(faqCategories2.isActive, true)).orderBy(faqCategories2.sortOrder);
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching public FAQ categories:", error);
      res.status(500).json({ error: "Failed to fetch FAQ categories" });
    }
  });
  app2.get("/api/admin/finder-profile/:userId", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { userId } = req.params;
      const finder = await storage.getFinderByUserId(userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }
      const user = await storage.getUser(userId);
      res.json({ ...finder, user });
    } catch (error) {
      console.error("Failed to fetch finder profile:", error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });
  app2.get("/api/admin/finder-profile/by-slug/:nameSlug", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { nameSlug } = req.params;
      const match = nameSlug.match(/([a-f0-9]{8})$/);
      if (!match) {
        return res.status(400).json({ message: "Invalid name slug format" });
      }
      const idPrefix = match[1];
      const users4 = await storage.getAllUsers();
      const user = users4.find((u) => u.id.startsWith(idPrefix));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json({ ...finder, user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching finder profile by slug:", error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });
  app2.get("/api/admin/finds", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const finds2 = await storage.getAllFinds();
      res.json(finds2);
    } catch (error) {
      console.error("Failed to fetch admin finds:", error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });
  app2.get("/api/admin/proposals", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const proposals2 = await storage.getAllProposals();
      res.json(proposals2);
    } catch (error) {
      console.error("Failed to fetch admin proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app2.get("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const users4 = await storage.getAllUsers();
      const usersWithoutPasswords = users4.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/users/:userId", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/admin/users/by-slug/:nameSlug", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { nameSlug } = req.params;
      const match = nameSlug.match(/([a-f0-9]{8})$/);
      if (!match) {
        return res.status(400).json({ message: "Invalid name slug format" });
      }
      const idPrefix = match[1];
      const users4 = await storage.getAllUsers();
      const user = users4.find((u) => u.id.startsWith(idPrefix));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user by slug:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/admin/users/:id/ban", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason || typeof reason !== "string" || !reason.trim()) {
        return res.status(400).json({ message: "Ban reason is required" });
      }
      const user = await storage.updateUser(id, { isBanned: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User banned successfully", user: { ...user, password: void 0 } });
    } catch (error) {
      console.error("Ban user error:", error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });
  app2.post("/api/admin/users/:id/unban", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const user = await storage.updateUser(id, { isBanned: false });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User unbanned successfully", user: { ...user, password: void 0 } });
    } catch (error) {
      console.error("Unban user error:", error);
      res.status(500).json({ message: "Failed to unban user" });
    }
  });
  app2.get("/api/admin/settings/:key", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { key } = req.params;
      const setting = await storage.getAdminSetting(key);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  app2.post("/api/admin/settings", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { key, value } = req.body;
      const setting = await storage.setAdminSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  app2.post("/api/messages/upload", authenticateToken, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Failed to get upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });
  app2.post("/api/messages/attach", authenticateToken, async (req, res) => {
    try {
      const { fileUrl, fileName } = req.body;
      if (!fileUrl || !fileName) {
        return res.status(400).json({ message: "File URL and name are required" });
      }
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        fileUrl,
        {
          owner: req.user.id,
          visibility: "private"
          // Message attachments are private
        }
      );
      res.json({
        objectPath,
        fileName,
        success: true
      });
    } catch (error) {
      console.error("Failed to set file ACL:", error);
      res.status(500).json({ message: "Failed to process file attachment" });
    }
  });
  app2.get("/objects/:objectPath(*)", authenticateToken, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: req.user.id,
        requestedPermission: "read" /* READ */
      });
      if (!canAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing file:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "File not found" });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/messages/conversations", requireAuth, async (req, res) => {
    try {
      const { proposalId } = req.body;
      console.log("Create conversation request:", { proposalId, userId: req.user.userId });
      if (!proposalId) {
        return res.status(400).json({ message: "Proposal ID is required" });
      }
      const existingConversation = await storage.getConversationByProposal(proposalId);
      if (existingConversation) {
        console.log("Found existing conversation:", existingConversation.id);
        return res.json(existingConversation);
      }
      const proposal = await storage.getProposal(proposalId);
      if (!proposal) {
        console.error("Proposal not found:", proposalId);
        return res.status(404).json({ message: "Proposal not found" });
      }
      const find = await storage.getFind(proposal.findId);
      if (!find) {
        console.error("Find not found for proposal:", proposalId);
        return res.status(404).json({ message: "Find not found" });
      }
      if (req.user.role === "client" && find.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === "finder") {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder || proposal.finderId !== finder.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      const conversation = await storage.createConversation({
        clientId: find.clientId,
        finderId: proposal.finderId,
        proposalId
      });
      console.log("Created conversation:", conversation);
      res.json(conversation);
    } catch (error) {
      console.error("Create conversation error:", error);
      res.status(500).json({ message: "Failed to create conversation", error: error.message });
    }
  });
  app2.get("/api/messages/conversations", authenticateToken, async (req, res) => {
    try {
      let conversations2;
      if (req.user.role === "client") {
        conversations2 = await storage.getConversationsByClientId(req.user.userId);
      } else if (req.user.role === "finder") {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }
        conversations2 = await storage.getConversationsByFinderId(finder.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(conversations2);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/messages/conversations/:conversationId", authenticateToken, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });
  app2.get("/api/messages/conversations/:conversationId/messages", authenticateToken, async (req, res) => {
    try {
      const { conversationId } = req.params;
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      const messages2 = await storage.getMessages(conversationId);
      await storage.markMessagesAsRead(conversationId, req.user.userId);
      res.json(messages2);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  app2.post("/api/messages/conversations/:conversationId/messages", authenticateToken, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { content, attachmentPaths, attachmentNames, quotedMessageId } = req.body;
      if ((!content || content.trim().length === 0) && (!attachmentPaths || attachmentPaths.length === 0)) {
        return res.status(400).json({ message: "Message content or attachments are required" });
      }
      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      const message = await storage.createMessage({
        conversationId,
        senderId: req.user.userId,
        content: content ? content.trim() : "",
        attachmentPaths: attachmentPaths || [],
        attachmentNames: attachmentNames || [],
        quotedMessageId
      });
      try {
        const senderUser = await storage.getUser(req.user.userId);
        const proposal = await storage.getProposal(conversation.proposalId);
        const request = proposal ? await storage.getFind(proposal.findId) : null;
        if (senderUser && request) {
          let recipientUserId;
          if (req.user.role === "client") {
            const finder = await storage.getFinder(conversation.finderId);
            if (finder) {
              recipientUserId = finder.userId;
              const finderUser = await storage.getUser(recipientUserId);
              if (finderUser) {
                await emailService.notifyFinderNewMessage(
                  finderUser.email,
                  `${senderUser.firstName} ${senderUser.lastName}`,
                  request.title
                );
              }
            }
          } else if (req.user.role === "finder") {
            recipientUserId = conversation.clientId;
            const clientUser = await storage.getUser(recipientUserId);
            if (clientUser) {
              await emailService.notifyClientNewMessage(
                clientUser.email,
                `${senderUser.firstName} ${senderUser.lastName}`,
                request.title
              );
            }
          }
        }
      } catch (emailError) {
        console.error("Failed to send message notification email:", emailError);
      }
      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  app2.get("/api/finders/:finderId/profile", authenticateToken, async (req, res) => {
    try {
      const { finderId } = req.params;
      const finderProfile = await storage.getFinderProfile(finderId);
      if (!finderProfile) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      res.json(finderProfile);
    } catch (error) {
      console.error("Get finder profile error:", error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });
  app2.get("/api/admin/transactions", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const transactions2 = await storage.getAllTransactionsWithUsers();
      res.json(transactions2);
    } catch (error) {
      console.error("Failed to fetch admin transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/admin/withdrawals", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const withdrawals = await storage.getWithdrawalRequests();
      res.json(withdrawals);
    } catch (error) {
      console.error("Failed to fetch admin withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });
  app2.get("/api/admin/contracts", authenticateToken, requireAdmin, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const contracts2 = await storage.getAllContractsWithTransactions();
      res.json(contracts2);
    } catch (error) {
      console.error("Failed to fetch admin contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });
  app2.post("/api/admin/contracts/:contractId/cancel", authenticateToken, requireAdmin, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { contractId } = req.params;
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (contract.escrowStatus !== "funded" || contract.isCompleted) {
        return res.status(400).json({
          message: "Can only cancel funded contracts that are not completed"
        });
      }
      await storage.updateContract(contractId, {
        escrowStatus: "cancelled",
        isCompleted: true,
        completedAt: /* @__PURE__ */ new Date()
      });
      await storage.addClientFindertokens(
        contract.clientId,
        parseFloat(contract.amount),
        `Contract cancellation refund - Contract ${contractId}`
      );
      try {
        const clientUser = await storage.getUser(contract.clientId);
        const finder = await storage.getFinder(contract.finderId);
        const finderUser = finder ? await storage.getUser(finder.userId) : null;
        const adminUser = await storage.getUser(req.user.userId);
        if (clientUser) {
          await emailService.notifyClientContractCancelled(
            clientUser.email,
            `${clientUser.firstName} ${clientUser.lastName}`,
            contractId,
            contract.amount
          );
        }
        if (finderUser) {
          await emailService.notifyFinderContractCancelled(
            finderUser.email,
            `${finderUser.firstName} ${finderUser.lastName}`,
            contractId
          );
        }
        if (adminUser) {
          const clientName = clientUser ? `${clientUser.firstName} ${clientUser.lastName}` : "Unknown";
          const finderName = finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : "Unknown";
          await emailService.notifyAdminContractCancellation(
            adminUser.email,
            contractId,
            clientName,
            finderName,
            contract.amount,
            req.body.reason || "No reason provided"
          );
        }
      } catch (emailError) {
        console.error("Failed to send cancellation emails:", emailError);
      }
      res.json({
        message: "Contract cancelled successfully and client refunded",
        contract: await storage.getContract(contractId)
      });
    } catch (error) {
      console.error("Contract cancellation error:", error);
      res.status(500).json({ message: "Failed to cancel contract" });
    }
  });
  app2.get("/api/admin/disputes", authenticateToken, requireAdmin, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const disputes2 = await storage.getAllDisputes();
      const enrichedDisputes = await Promise.all(disputes2.map(async (dispute) => {
        const user = await storage.getUser(dispute.userId);
        const contract = dispute.contractId ? await storage.getContract(dispute.contractId) : null;
        return {
          ...dispute,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          } : null,
          contract: contract ? {
            id: contract.id,
            amount: contract.amount,
            escrowStatus: contract.escrowStatus,
            isCompleted: contract.isCompleted
          } : null
        };
      }));
      res.json(enrichedDisputes);
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
      res.status(500).json({ message: "Failed to fetch disputes" });
    }
  });
  app2.post("/api/admin/contracts/:contractId/complete", authenticateToken, requireAdmin, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { contractId } = req.params;
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (contract.escrowStatus !== "funded") {
        return res.status(400).json({
          message: "Can only complete funded contracts"
        });
      }
      if (contract.isCompleted) {
        return res.status(400).json({
          message: "Contract is already completed"
        });
      }
      await storage.updateContract(contractId, {
        isCompleted: true,
        completedAt: /* @__PURE__ */ new Date(),
        escrowStatus: "released"
      });
      const finder = await storage.getFinder(contract.finderId);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }
      const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
      const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
      const grossAmount = parseFloat(contract.amount);
      const feeAmount = grossAmount * platformFeePercentage / 100;
      const netAmount = grossAmount - feeAmount;
      await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
      const currentJobsCompleted = finder.jobsCompleted || 0;
      await storage.updateFinder(contract.finderId, {
        jobsCompleted: currentJobsCompleted + 1
      });
      try {
        const clientUser = await storage.getUser(contract.clientId);
        const finderUser = finder ? await storage.getUser(finder.userId) : null;
        if (finderUser) {
          await emailService.notifyFinderSubmissionApproved(
            finderUser.email,
            clientUser ? `${clientUser.firstName} ${clientUser.lastName}` : "Client",
            "Work on contract",
            netAmount.toFixed(2)
          );
        }
        if (clientUser) {
          await emailService.notifyClientSubmissionApproved(
            clientUser.email,
            finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : "Finder",
            "Work on contract"
          );
        }
      } catch (emailError) {
        console.error("Failed to send completion emails:", emailError);
      }
      res.json({
        message: "Contract completed successfully and funds released to finder",
        contract: await storage.getContract(contractId)
      });
    } catch (error) {
      console.error("Contract completion error:", error);
      res.status(500).json({ message: "Failed to complete contract" });
    }
  });
  app2.post("/api/admin/contracts/:contractId/release-funds", authenticateToken, requireAdmin, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { contractId } = req.params;
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      if (!contract.isCompleted) {
        return res.status(400).json({
          message: "Contract must be completed before funds can be released"
        });
      }
      if (contract.escrowStatus !== "released") {
        return res.status(400).json({
          message: "Contract escrow status must be 'released'"
        });
      }
      const finder = await storage.getFinder(contract.finderId);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }
      const beforeBalance = parseFloat(finder.availableBalance || "0");
      const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
      const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
      const grossAmount = parseFloat(contract.amount);
      const feeAmount = grossAmount * platformFeePercentage / 100;
      const netAmount = grossAmount - feeAmount;
      await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
      const updatedFinder = await storage.getFinder(contract.finderId);
      const afterBalance = parseFloat(updatedFinder?.availableBalance || "0");
      res.json({
        message: "Funds released successfully to finder's available balance",
        contract: await storage.getContract(contractId),
        finder: {
          id: finder.id,
          beforeBalance: beforeBalance.toFixed(2),
          afterBalance: afterBalance.toFixed(2),
          amountReleased: netAmount.toFixed(2),
          platformFee: feeAmount.toFixed(2),
          platformFeePercentage
        }
      });
    } catch (error) {
      console.error("Manual fund release error:", error);
      res.status(500).json({ message: "Failed to release funds", error: error.message });
    }
  });
  app2.get("/api/admin/support-agents", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const agents = await storage.getSupportAgents();
      res.json(agents);
    } catch (error) {
      console.error("Failed to fetch support agents:", error);
      res.status(500).json({ message: "Failed to fetch support agents" });
    }
  });
  app2.post("/api/admin/support-agents", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { email, firstName, lastName, department, permissions, maxTicketsPerDay, responseTimeTarget, specializations, languages } = req.body;
      if (!email || !firstName || !lastName || !department || !permissions || permissions.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      let user = await storage.getUserByEmail(email);
      if (!user) {
        const userData = {
          email,
          firstName,
          lastName,
          role: "support_agent",
          password: await bcrypt.hash("temppassword123", 10),
          // Temporary password
          isVerified: true
        };
        user = await storage.createUser(userData);
      } else {
        const existingAgent = await storage.getUserSupportAgent(user.id);
        if (existingAgent) {
          return res.status(400).json({ message: "User is already a support agent" });
        }
      }
      const agentId = await storage.generateAgentId();
      const agentData = {
        userId: user.id,
        agentId,
        department,
        permissions,
        maxTicketsPerDay: maxTicketsPerDay || 20,
        responseTimeTarget: responseTimeTarget || 24,
        specializations: specializations || [],
        languages: languages || ["en"],
        assignedBy: req.user.userId
      };
      const agent = await storage.createSupportAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Create support agent error:", error);
      res.status(400).json({ message: "Failed to create support agent", error: error.message });
    }
  });
  app2.put("/api/admin/support-agents/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const updates = req.body;
      const agent = await storage.updateSupportAgent(id, updates);
      if (!agent) {
        return res.status(404).json({ message: "Support agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Update support agent error:", error);
      res.status(400).json({ message: "Failed to update support agent", error: error.message });
    }
  });
  app2.post("/api/admin/support-agents/:id/suspend", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ message: "Suspension reason is required" });
      }
      const agent = await storage.suspendSupportAgent(id, reason);
      if (!agent) {
        return res.status(404).json({ message: "Support agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Suspend support agent error:", error);
      res.status(400).json({ message: "Failed to suspend support agent", error: error.message });
    }
  });
  app2.post("/api/admin/support-agents/:id/reactivate", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const agent = await storage.reactivateSupportAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Support agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Reactivate support agent error:", error);
      res.status(400).json({ message: "Failed to reactivate support agent", error: error.message });
    }
  });
  app2.delete("/api/admin/support-agents/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const success = await storage.deleteSupportAgent(id);
      if (!success) {
        return res.status(404).json({ message: "Support agent not found" });
      }
      res.json({ message: "Support agent deleted successfully" });
    } catch (error) {
      console.error("Delete support agent error:", error);
      res.status(400).json({ message: "Failed to delete support agent", error: error.message });
    }
  });
  app2.get("/api/admin/support-departments", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const departments = await storage.getSupportDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching support departments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/support-departments", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { name, description, color, maxResponseTime } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Department name is required" });
      }
      const department = await storage.createSupportDepartment({
        name,
        description,
        color: color || "#3B82F6",
        maxResponseTime: maxResponseTime || 24,
        isActive: true,
        autoAssignments: true
      });
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating support department:", error);
      res.status(500).json({ message: "Failed to create support department" });
    }
  });
  app2.put("/api/admin/finds/:id/status", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["open", "in_progress", "completed", "cancelled", "under_review"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const find = await storage.getFind(id);
      if (!find) {
        return res.status(404).json({ message: "Find not found" });
      }
      const updatedFind = await storage.updateFind(id, { status });
      res.json(updatedFind);
    } catch (error) {
      console.error("Error updating find status:", error);
      res.status(500).json({ message: "Failed to update find status" });
    }
  });
  app2.get("/api/offenses/:role", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { role } = req.params;
      const offenseTypes = {
        client: [
          { offense: "Misleading Request Description", strikeLevel: 1, applicableRoles: ["client"], resolution: "Warning and request clarification" },
          { offense: "Inappropriate Content in Request", strikeLevel: 2, applicableRoles: ["client"], resolution: "Content removal and warning" },
          { offense: "Non-payment or Payment Disputes", strikeLevel: 2, applicableRoles: ["client"], resolution: "Payment resolution required" },
          { offense: "Harassment of Finders", strikeLevel: 3, applicableRoles: ["client"], resolution: "Immediate account review" },
          { offense: "Fraudulent Activity", strikeLevel: 3, applicableRoles: ["client"], resolution: "Account suspension" }
        ],
        finder: [
          { offense: "Low Quality or Incomplete Proposals", strikeLevel: 1, applicableRoles: ["finder"], resolution: "Training and guidance provided" },
          { offense: "Missing Deadlines Without Communication", strikeLevel: 1, applicableRoles: ["finder"], resolution: "Communication improvement required" },
          { offense: "Inappropriate Communication", strikeLevel: 2, applicableRoles: ["finder"], resolution: "Communication standards training" },
          { offense: "Delivering Substandard Work", strikeLevel: 2, applicableRoles: ["finder"], resolution: "Quality standards review" },
          { offense: "Fraudulent Claims or Credentials", strikeLevel: 3, applicableRoles: ["finder"], resolution: "Account verification required" },
          { offense: "Harassment of Clients", strikeLevel: 3, applicableRoles: ["finder"], resolution: "Immediate account review" }
        ]
      };
      const roleOffenses = offenseTypes[role] || [];
      res.json(roleOffenses);
    } catch (error) {
      console.error("Error fetching offense types:", error);
      res.status(500).json({ message: "Failed to fetch offense types" });
    }
  });
  app2.post("/api/admin/strikes", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { userId, offenseType, evidence, userRole, contextId } = req.body;
      if (!userId || !offenseType || !evidence || !userRole) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const strike = {
        id: Date.now().toString(),
        userId,
        offenseType,
        evidence,
        userRole,
        contextId,
        issuedBy: req.user.id,
        issuedAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "active"
      };
      res.status(201).json(strike);
    } catch (error) {
      console.error("Error issuing strike:", error);
      res.status(500).json({ message: "Failed to issue strike" });
    }
  });
  app2.get("/api/admin/restricted-words", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }
      console.log("Fetching restricted words...");
      const words = await storage.getRestrictedWords();
      console.log("Retrieved restricted words:", words.length, "words found");
      res.json(words);
    } catch (error) {
      console.error("Error fetching restricted words:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/restricted-words", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }
      const { word, category, severity } = req.body;
      console.log("Received restricted word request:", { word, category, severity, userId: req.user.userId });
      if (!word || typeof word !== "string") {
        return res.status(400).json({ message: "Word is required and must be a string" });
      }
      const wordData = {
        word: word.toLowerCase().trim(),
        category: category || "general",
        severity: severity || "flag",
        addedBy: req.user.userId,
        isActive: true
      };
      console.log("Adding restricted word with data:", wordData);
      const restrictedWord = await storage.addRestrictedWord(wordData);
      console.log("Successfully added restricted word:", restrictedWord);
      res.status(201).json(restrictedWord);
    } catch (error) {
      console.error("Error adding restricted word:", error);
      if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
        return res.status(409).json({ message: "This word is already in the restricted list" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/restricted-words/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      console.log("Deleting restricted word with ID:", id);
      const success = await storage.deleteRestrictedWord(id);
      console.log("Delete operation result:", success);
      if (!success) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json({ message: "Restricted word deleted successfully" });
    } catch (error) {
      console.error("Failed to delete restricted word:", error);
      res.status(500).json({ message: "Failed to delete restricted word", error: error.message });
    }
  });
  app2.get("/api/admin/faq-categories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const categories2 = await db.select().from(faqCategories2).orderBy(faqCategories2.sortOrder);
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      res.status(500).json({ error: "Failed to fetch FAQ categories" });
    }
  });
  app2.post("/api/admin/faq-categories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { name, description, icon, color, sortOrder, isActive } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }
      const newCategory = await db.insert(faqCategories2).values({
        name,
        description: description || "",
        icon: icon || "HelpCircle",
        color: color || "bg-blue-100 text-blue-800",
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true
      }).returning();
      res.status(201).json(newCategory[0]);
    } catch (error) {
      console.error("Error creating FAQ category:", error);
      res.status(500).json({ error: "Failed to create FAQ category" });
    }
  });
  app2.put("/api/admin/faq-categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { id } = req.params;
      const { name, description, icon, color, sortOrder, isActive } = req.body;
      const updated = await db.update(faqCategories2).set({
        name,
        description,
        icon,
        color,
        sortOrder,
        isActive,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(faqCategories2.id, id)).returning();
      if (updated.length === 0) {
        return res.status(404).json({ error: "FAQ category not found" });
      }
      res.json(updated[0]);
    } catch (error) {
      console.error("Error updating FAQ category:", error);
      res.status(500).json({ error: "Failed to update FAQ category" });
    }
  });
  app2.delete("/api/admin/faq-categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { id } = req.params;
      const deleted = await db.delete(faqCategories2).where(eq4(faqCategories2.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ error: "FAQ category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ category:", error);
      res.status(500).json({ error: "Failed to delete FAQ category" });
    }
  });
  app2.get("/api/public/faq-categories", async (req, res) => {
    try {
      const { faqCategories: faqCategories2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const categories2 = await db.select().from(faqCategories2).where(eq4(faqCategories2.isActive, true)).orderBy(faqCategories2.sortOrder);
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching public FAQ categories:", error);
      res.status(500).json({ error: "Failed to fetch FAQ categories" });
    }
  });
  app2.get("/api/contact-settings", async (req, res) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      res.status(500).json({ error: "Failed to fetch contact settings" });
    }
  });
  app2.get("/api/admin/faqs", requireAuth, requireAdmin, async (req, res) => {
    try {
      const allFaqs = await db.select().from(faqs).orderBy(faqs.sortOrder, faqs.createdAt);
      res.json(allFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });
  app2.post("/api/admin/faqs", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { insertFAQSchema: insertFAQSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const faqData = insertFAQSchema2.parse(req.body);
      const newFaq = await db.insert(faqs).values({
        ...faqData,
        tags: faqData.tags || [],
        isActive: faqData.isActive ?? true,
        sortOrder: faqData.sortOrder || 0
      }).returning();
      res.json(newFaq[0]);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ error: "Failed to create FAQ", details: error.message });
    }
  });
  app2.put("/api/admin/faqs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer, category, tags, isActive, sortOrder } = req.body;
      const updated = await db.update(faqs).set({
        question,
        answer,
        category,
        tags: tags || [],
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(faqs.id, id)).returning();
      if (updated.length === 0) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json(updated[0]);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  });
  app2.delete("/api/admin/faqs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.delete(faqs).where(eq4(faqs.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });
  app2.get("/api/public/faqs", async (req, res) => {
    try {
      const activeFaqs = await db.select().from(faqs).where(eq4(faqs.isActive, true)).orderBy(faqs.sortOrder, faqs.createdAt);
      res.json(activeFaqs);
    } catch (error) {
      console.error("Error fetching public FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });
  app2.get("/api/admin/withdrawal-settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const settings = await db.select().from(withdrawalSettings).limit(1);
      res.json(settings[0] || {
        minimumAmount: "1000",
        processingFee: "45",
        processingTimeHours: 24,
        isActive: true
      });
    } catch (error) {
      console.error("Error fetching withdrawal settings:", error);
      res.status(500).json({ error: "Failed to fetch withdrawal settings" });
    }
  });
  app2.put("/api/admin/withdrawal-settings/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await db.update(withdrawalSettings).set({ ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toString() }).where(eq4(withdrawalSettings.id, id)).returning();
      res.json(updated[0]);
    } catch (error) {
      console.error("Error updating withdrawal settings:", error);
      res.status(500).json({ error: "Failed to update withdrawal settings" });
    }
  });
  app2.get("/api/admin/blog-posts", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/admin/blog-posts", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.userId
      });
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Failed to create blog post:", error);
      res.status(400).json({ message: "Failed to create blog post", error: error.message });
    }
  });
  app2.put("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const post = await storage.updateBlogPost(id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Failed to update blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  app2.delete("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (!post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch blog post", error: error.message });
    }
  });
  app2.post("/api/verification/submit", authenticateToken, upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { documentType } = req.body;
      const files = req.files;
      if (!files.documentFront || !files.selfie) {
        return res.status(400).json({ message: "Document front image and selfie are required" });
      }
      if (!documentType || !["national_id", "passport", "voters_card"].includes(documentType)) {
        return res.status(400).json({ message: "Valid document type is required" });
      }
      const existing = await storage.getVerificationByUserId(req.user.userId);
      if (existing && (existing.status === "pending" || existing.status === "verified")) {
        return res.status(400).json({
          message: existing.status === "verified" ? "Your account is already verified" : "You already have a verification request pending review"
        });
      }
      const verificationData = {
        userId: req.user.userId,
        documentType,
        documentFrontImage: `/uploads/${files.documentFront[0].filename}`,
        documentBackImage: files.documentBack ? `/uploads/${files.documentBack[0].filename}` : null,
        selfieImage: `/uploads/${files.selfie[0].filename}`
      };
      const verification = await storage.submitVerification(verificationData);
      try {
        const user = await storage.getUser(req.user.userId);
        if (user) {
          await emailService.sendVerificationSubmitted(
            user.email,
            `${user.firstName} ${user.lastName}`
          );
        }
      } catch (emailError) {
        console.error("Failed to send verification submission email:", emailError);
      }
      res.status(201).json({
        message: "Verification submitted successfully. Your documents are now under review.",
        verification: {
          id: verification.id,
          status: verification.status,
          submittedAt: verification.submittedAt
        }
      });
    } catch (error) {
      console.error("Verification submission error:", error);
      res.status(500).json({ message: "Failed to submit verification" });
    }
  });
  app2.get("/api/verification/status", authenticateToken, async (req, res) => {
    try {
      const verification = await storage.getVerificationByUserId(req.user.userId);
      const isRequired = await storage.isVerificationRequired();
      res.json({
        isRequired,
        verification: verification ? {
          id: verification.id,
          status: verification.status,
          documentType: verification.documentType,
          submittedAt: verification.submittedAt,
          reviewedAt: verification.reviewedAt,
          rejectionReason: verification.rejectionReason
        } : null
      });
    } catch (error) {
      console.error("Get verification status error:", error);
      res.status(500).json({ message: "Failed to get verification status" });
    }
  });
  app2.get("/api/admin/verifications", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const verifications = await storage.getPendingVerifications();
      res.json(verifications);
    } catch (error) {
      console.error("Get pending verifications error:", error);
      res.status(500).json({ message: "Failed to get pending verifications" });
    }
  });
  app2.get("/api/admin/verifications/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const verification = await storage.getVerificationById(id);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      res.json(verification);
    } catch (error) {
      console.error("Get verification details error:", error);
      res.status(500).json({ message: "Failed to get verification details" });
    }
  });
  app2.post("/api/admin/verifications/:id/approve", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const verification = await storage.updateVerificationStatus(id, "verified", req.user.userId);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      try {
        const user = await storage.getUser(verification.userId);
        if (user) {
          await emailService.sendVerificationApproved(
            user.email,
            `${user.firstName} ${user.lastName}`
          );
        }
      } catch (emailError) {
        console.error("Failed to send verification approval email:", emailError);
      }
      res.json({ message: "Verification approved successfully" });
    } catch (error) {
      console.error("Approve verification error:", error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });
  app2.post("/api/admin/verifications/:id/reject", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      const verification = await storage.updateVerificationStatus(id, "rejected", req.user.userId, reason);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      try {
        const user = await storage.getUser(verification.userId);
        if (user) {
          await emailService.sendVerificationRejected(
            user.email,
            `${user.firstName} ${user.lastName}`,
            reason
          );
        }
      } catch (emailError) {
        console.error("Failed to send verification rejection email:", emailError);
      }
      res.json({ message: "Verification rejected successfully" });
    } catch (error) {
      console.error("Reject verification error:", error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });
  app2.get("/api/admin/finder-levels", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const levels = await storage.getFinderLevels();
      const frontendLevels = levels.map((level) => ({
        id: level.id,
        name: level.name,
        description: level.description,
        minEarnedAmount: level.minEarnedAmount,
        minJobsCompleted: level.minJobsCompleted,
        minReviewPercentage: level.minRating ? Math.round(parseFloat(level.minRating.toString()) * 20) : 0,
        // Convert 5-star rating to percentage
        icon: level.badgeIcon || "User",
        iconUrl: "",
        // Not stored in database
        color: level.color,
        order: level.order,
        isActive: level.isActive,
        createdAt: level.createdAt,
        updatedAt: level.updatedAt
      }));
      res.json(frontendLevels);
    } catch (error) {
      console.error("Get finder levels error:", error);
      res.status(500).json({ message: "Failed to fetch finder levels" });
    }
  });
  app2.post("/api/admin/finder-levels", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { name, description, minEarnedAmount, minJobsCompleted, minReviewPercentage, icon, color, order, isActive } = req.body;
      const earnedAmount = parseFloat(minEarnedAmount) || 0;
      if (earnedAmount > 9999999999e-2) {
        return res.status(400).json({ message: "Minimum earned amount cannot exceed \u20A699,999,999.99" });
      }
      const reviewPercentage = parseFloat(minReviewPercentage) || 0;
      if (reviewPercentage > 200) {
        return res.status(400).json({ message: "Review percentage cannot exceed 200% (equivalent to 10.0 star rating)" });
      }
      const dbData = {
        name,
        description,
        minEarnedAmount: earnedAmount.toString(),
        minJobsCompleted: parseInt(minJobsCompleted) || 0,
        minRating: reviewPercentage ? (reviewPercentage / 20).toString() : "0",
        // Convert percentage to 5-star rating
        badgeIcon: icon,
        badgeEmoji: "",
        // Default empty, can be added later
        color,
        order: parseInt(order) || 1,
        isActive: Boolean(isActive)
      };
      const level = await storage.createFinderLevel(dbData);
      res.json(level);
    } catch (error) {
      console.error("Create finder level error:", error);
      if (error.message?.includes("numeric field overflow") || error.message?.includes("value too long for type character")) {
        return res.status(400).json({ message: "Invalid data format: Some values exceed maximum allowed limits" });
      }
      res.status(500).json({ message: "Failed to create finder level" });
    }
  });
  app2.put("/api/admin/finder-levels/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { name, description, minEarnedAmount, minJobsCompleted, minReviewPercentage, icon, color, order, isActive } = req.body;
      const earnedAmount = parseFloat(minEarnedAmount) || 0;
      if (earnedAmount > 9999999999e-2) {
        return res.status(400).json({ message: "Minimum earned amount cannot exceed \u20A699,999,999.99" });
      }
      const reviewPercentage = parseFloat(minReviewPercentage) || 0;
      if (reviewPercentage > 200) {
        return res.status(400).json({ message: "Review percentage cannot exceed 200% (equivalent to 10.0 star rating)" });
      }
      const dbData = {
        name,
        description,
        minEarnedAmount: earnedAmount.toString(),
        minJobsCompleted: parseInt(minJobsCompleted) || 0,
        minRating: reviewPercentage ? (reviewPercentage / 20).toString() : "0",
        // Convert percentage to 5-star rating
        badgeIcon: icon,
        badgeEmoji: "",
        // Default empty, can be added later
        color,
        order: parseInt(order) || 1,
        isActive: Boolean(isActive)
      };
      const level = await storage.updateFinderLevel(id, dbData);
      if (!level) {
        return res.status(404).json({ message: "Finder level not found" });
      }
      res.json(level);
    } catch (error) {
      console.error("Update finder level error:", error);
      if (error.message?.includes("numeric field overflow") || error.message?.includes("value too long for type character")) {
        return res.status(400).json({ message: "Invalid data format: Some values exceed maximum allowed limits" });
      }
      res.status(500).json({ message: "Failed to update finder level" });
    }
  });
  app2.delete("/api/admin/finder-levels/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const success = await storage.deleteFinderLevel(id);
      if (!success) {
        return res.status(404).json({ message: "Finder level not found" });
      }
      res.json({ message: "Finder level deleted successfully" });
    } catch (error) {
      console.error("Delete finder level error:", error);
      res.status(500).json({ message: "Failed to delete finder level" });
    }
  });
  app2.post("/api/admin/finder-levels/seed", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const defaultFinderLevels = [
        {
          name: "Novice",
          description: "New finders just starting their journey on FinderMeister",
          minEarnedAmount: "0.00",
          minJobsCompleted: 0,
          minRating: "0.00",
          badgeIcon: "User",
          badgeEmoji: "\u{1F331}",
          color: "#6b7280",
          order: 1,
          isActive: true
        },
        {
          name: "Pathfinder",
          description: "Experienced finders who have completed multiple successful finds",
          minEarnedAmount: "5000.00",
          minJobsCompleted: 5,
          minRating: "4.00",
          badgeIcon: "Navigation",
          badgeEmoji: "\u{1F9ED}",
          color: "#10b981",
          order: 2,
          isActive: true
        },
        {
          name: "Seeker",
          description: "Skilled finders with a proven track record of quality work",
          minEarnedAmount: "15000.00",
          minJobsCompleted: 15,
          minRating: "4.25",
          badgeIcon: "Search",
          badgeEmoji: "\u{1F50D}",
          color: "#3b82f6",
          order: 3,
          isActive: true
        },
        {
          name: "Meister",
          description: "Expert finders with exceptional performance and client satisfaction",
          minEarnedAmount: "50000.00",
          minJobsCompleted: 50,
          minRating: "4.50",
          badgeIcon: "Award",
          badgeEmoji: "\u{1F3C6}",
          color: "#8b5cf6",
          order: 4,
          isActive: true
        },
        {
          name: "Grandmeister",
          description: "Elite finders at the pinnacle of expertise and achievement",
          minEarnedAmount: "100000.00",
          minJobsCompleted: 100,
          minRating: "4.75",
          badgeIcon: "Crown",
          badgeEmoji: "\u{1F451}",
          color: "#f59e0b",
          order: 5,
          isActive: true
        }
      ];
      const existingLevels = await storage.getFinderLevels();
      if (existingLevels.length > 0) {
        return res.json({ message: "Finder levels already exist, skipping seed", levels: existingLevels });
      }
      for (const level of defaultFinderLevels) {
        await storage.createFinderLevel(level);
      }
      const seededLevels = await storage.getFinderLevels();
      res.json({
        message: `Successfully seeded ${defaultFinderLevels.length} finder levels`,
        levels: seededLevels
      });
    } catch (error) {
      console.error("Seed finder levels error:", error);
      res.status(500).json({ message: "Failed to seed finder levels" });
    }
  });
  app2.get("/api/finder/withdrawal-settings", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ error: "Access denied. Finder role required." });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ error: "Finder profile not found" });
      }
      const settings = await storage.getWithdrawalSettings(finder.id);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching withdrawal settings:", error);
      res.status(500).json({ error: "Failed to fetch withdrawal settings" });
    }
  });
  app2.put("/api/finder/withdrawal-settings", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "finder") {
        return res.status(403).json({ message: "Only finders can update withdrawal settings" });
      }
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }
      const settings = req.body;
      console.log("Route: Received withdrawal settings update:", JSON.stringify(settings, null, 2));
      const bankDetails = settings.bankDetails || {};
      const bankName = bankDetails.bankName?.trim();
      const accountNumber = bankDetails.accountNumber?.trim();
      const accountHolder = bankDetails.accountHolder?.trim();
      if (!bankName || !accountNumber || !accountHolder) {
        console.error("Validation failed:", { bankName, accountNumber, accountHolder });
        return res.status(400).json({
          message: "Missing required bank details: bankName, accountNumber, and accountHolder are required",
          received: { bankName: !!bankName, accountNumber: !!accountNumber, accountHolder: !!accountHolder }
        });
      }
      const validatedSettings = {
        paymentMethod: settings.paymentMethod || "bank_transfer",
        minimumThreshold: settings.minimumThreshold || 50,
        bankDetails: {
          bankName,
          accountNumber,
          accountHolder,
          routingNumber: bankDetails.routingNumber?.trim() || ""
        }
      };
      console.log("Validated settings:", JSON.stringify(validatedSettings, null, 2));
      const updatedSettings = await storage.updateWithdrawalSettings(finder.id, validatedSettings);
      res.json({
        message: "Withdrawal settings updated successfully",
        settings: updatedSettings
      });
    } catch (error) {
      console.error("Route: Error updating withdrawal settings:", error);
      res.status(500).json({
        message: error.message || "Failed to update withdrawal settings",
        error: error.message || "Unknown error occurred"
      });
    }
  });
  app2.get("/api/admin/monthly-distributions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ message: "Month and year are required" });
      }
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ message: "Invalid month or year" });
      }
      const distributions = await storage.getMonthlyDistributions(monthNum, yearNum);
      res.json(distributions);
    } catch (error) {
      console.error("Failed to fetch monthly distributions:", error);
      res.status(500).json({ message: "Failed to fetch monthly distributions" });
    }
  });
  app2.post("/api/admin/distribute-monthly-tokens", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const result = await storage.distributeMonthlyTokens();
      res.json({
        message: "Monthly tokens distributed successfully",
        distributed: result.distributed,
        alreadyDistributed: result.alreadyDistributed
      });
    } catch (error) {
      console.error("Failed to distribute monthly tokens:", error);
      res.status(500).json({
        message: "Failed to distribute monthly tokens",
        error: error.message
      });
    }
  });
  app2.post("/api/admin/monthly-token-grant", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const hasGranted = await monthlyTokenGrantService.hasGrantedTokensThisMonth();
      if (hasGranted) {
        return res.status(400).json({
          message: "Monthly tokens have already been granted this month",
          error: "DUPLICATE_GRANT"
        });
      }
      await monthlyTokenGrantService.grantMonthlyTokens();
      res.json({
        message: "Monthly tokens granted successfully",
        success: true
      });
    } catch (error) {
      console.error("Monthly token grant error:", error);
      res.status(500).json({
        message: "Failed to grant monthly tokens",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/monthly-token-grant/status", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const hasGranted = await monthlyTokenGrantService.hasGrantedTokensThisMonth();
      res.json({
        hasGrantedThisMonth: hasGranted,
        currentDate: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Monthly token grant status error:", error);
      res.status(500).json({
        message: "Failed to check monthly token grant status",
        error: error.message
      });
    }
  });
  app2.get("/api/finder/profile/:finderId", async (req, res) => {
    try {
      const { finderId } = req.params;
      const finder = await db.select({
        id: finders.id,
        userId: finders.userId,
        jobsCompleted: finders.jobsCompleted,
        totalEarned: finders.totalEarned,
        availableBalance: finders.availableBalance,
        averageRating: finders.averageRating,
        currentLevelId: finders.currentLevelId,
        bio: finders.bio,
        category: finders.category,
        categories: finders.categories,
        skills: finders.skills,
        hourlyRate: finders.hourlyRate,
        isVerified: finders.isVerified,
        createdAt: finders.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          isActive: users.isActive
        }
      }).from(finders).innerJoin(users, eq4(finders.userId, users.id)).where(eq4(finders.id, finderId)).limit(1);
      if (!finder[0]) {
        return res.status(404).json({ message: "Finder not found" });
      }
      res.json(finder[0]);
    } catch (error) {
      console.error("Enhanced finder profile error:", error);
      res.status(500).json({
        message: "Failed to fetch finder profile",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/autonomous-fund/config", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const config = autonomousFundService.getConfig();
      res.json(config);
    } catch (error) {
      console.error("Autonomous fund config error:", error);
      res.status(500).json({
        message: "Failed to get autonomous fund config",
        error: error.message
      });
    }
  });
  app2.put("/api/admin/autonomous-fund/config", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { holdingPeriodHours, autoCreditEnabled, minimumRating, minimumJobsCompleted } = req.body;
      const newConfig = {
        ...holdingPeriodHours !== void 0 && { holdingPeriodHours },
        ...autoCreditEnabled !== void 0 && { autoCreditEnabled },
        ...minimumRating !== void 0 && { minimumRating },
        ...minimumJobsCompleted !== void 0 && { minimumJobsCompleted }
      };
      autonomousFundService.updateConfig(newConfig);
      res.json({
        message: "Autonomous fund configuration updated successfully",
        config: autonomousFundService.getConfig()
      });
    } catch (error) {
      console.error("Update autonomous fund config error:", error);
      res.status(500).json({
        message: "Failed to update autonomous fund config",
        error: error.message
      });
    }
  });
  app2.post("/api/admin/autonomous-fund/process", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await autonomousFundService.processAutonomousFundCrediting();
      res.json({
        message: "Autonomous fund processing initiated successfully"
      });
    } catch (error) {
      console.error("Autonomous fund processing error:", error);
      res.status(500).json({
        message: "Failed to process autonomous fund crediting",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api/")) {
      return next();
    }
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (req, res, next) => {
    if (req.url.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/autoReleaseService.ts
init_schema();
import { eq as eq5, and as and5, sql as sql5 } from "drizzle-orm";
var AutoReleaseService = class _AutoReleaseService {
  static instance;
  intervalId = null;
  constructor() {
  }
  static getInstance() {
    if (!_AutoReleaseService.instance) {
      _AutoReleaseService.instance = new _AutoReleaseService();
    }
    return _AutoReleaseService.instance;
  }
  // Start the auto-release service (runs every hour)
  start() {
    if (this.intervalId) {
      console.log("Auto-release service is already running");
      return;
    }
    console.log("Starting auto-release service...");
    this.processAutoReleases();
    this.intervalId = setInterval(() => {
      this.processAutoReleases();
    }, 60 * 60 * 1e3);
  }
  // Stop the auto-release service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Auto-release service stopped");
    }
  }
  // Process all pending auto-releases
  async processAutoReleases() {
    try {
      console.log("Processing auto-releases...");
      const expiredSubmissions = await db.select({
        id: orderSubmissions.id,
        contractId: orderSubmissions.contractId,
        autoReleaseDate: orderSubmissions.autoReleaseDate,
        submittedAt: orderSubmissions.submittedAt
      }).from(orderSubmissions).innerJoin(contracts, eq5(orderSubmissions.contractId, contracts.id)).where(and5(
        eq5(orderSubmissions.status, "submitted"),
        sql5`${orderSubmissions.autoReleaseDate} <= NOW()`,
        sql5`${contracts.escrowStatus} IN ('held', 'funded')`
      ));
      let releasedCount = 0;
      for (const submission of expiredSubmissions) {
        try {
          console.log(`Auto-accepting expired submission ${submission.id} for contract ${submission.contractId}`);
          console.log(`Submission date: ${submission.submittedAt}, Auto-release date: ${submission.autoReleaseDate}`);
          const contract = await storage.getContract(submission.contractId);
          if (!contract) {
            console.error(`Contract ${submission.contractId} not found`);
            continue;
          }
          await storage.updateOrderSubmission(submission.id, {
            status: "accepted",
            clientFeedback: "Auto-accepted due to expired review period (client did not respond within 48 hours)"
          });
          await storage.updateContract(submission.contractId, {
            isCompleted: true,
            completedAt: /* @__PURE__ */ new Date(),
            escrowStatus: "released"
          });
          const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
          const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
          const grossAmount = parseFloat(contract.amount);
          const feeAmount = grossAmount * platformFeePercentage / 100;
          const netAmount = grossAmount - feeAmount;
          await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
          releasedCount++;
          console.log(`Successfully auto-released contract ${submission.contractId} - funds released to finder`);
        } catch (error) {
          console.error(`Failed to auto-release submission ${submission.id}:`, error);
        }
      }
      const expiredContracts = await db.select({
        id: contracts.id,
        finderId: contracts.finderId,
        amount: contracts.amount,
        completedAt: contracts.completedAt
      }).from(contracts).where(and5(
        eq5(contracts.isCompleted, true),
        eq5(contracts.escrowStatus, "held"),
        sql5`${contracts.completedAt} IS NOT NULL`,
        sql5`${contracts.completedAt} <= NOW() - INTERVAL '3 days'`
        // Auto-release after 3 days if no action
      ));
      for (const contract of expiredContracts) {
        try {
          console.log(`Auto-releasing expired contract ${contract.id}`);
          await storage.updateContract(contract.id, { escrowStatus: "released" });
          const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
          const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
          const grossAmount = parseFloat(contract.amount);
          const feeAmount = grossAmount * platformFeePercentage / 100;
          const netAmount = grossAmount - feeAmount;
          await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
          releasedCount++;
          console.log(`Successfully auto-released expired contract ${contract.id}`);
        } catch (error) {
          console.error(`Failed to auto-release contract ${contract.id}:`, error);
        }
      }
      if (releasedCount > 0) {
        console.log(`Auto-release process completed: ${releasedCount} contracts released`);
      } else {
        console.log("Auto-release process completed: No contracts needed releasing");
      }
      return { released: releasedCount };
    } catch (error) {
      console.error("Error in auto-release process:", error);
      return { released: 0, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  // Manual trigger for admin use
  async manualRelease(contractId) {
    try {
      if (contractId) {
        const contract = await storage.getContract(contractId);
        if (!contract) {
          throw new Error("Contract not found");
        }
        if (contract.escrowStatus !== "held") {
          throw new Error("Contract is not in held status");
        }
        await storage.updateContract(contractId, { escrowStatus: "released" });
        const feePercentageSetting = await storage.getAdminSetting("finder_earnings_charge_percentage");
        const platformFeePercentage = parseFloat(feePercentageSetting?.value || "5");
        const grossAmount = parseFloat(contract.amount);
        const feeAmount = grossAmount * platformFeePercentage / 100;
        const netAmount = grossAmount - feeAmount;
        await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());
        console.log(`Manually released contract ${contractId}`);
        return { success: true, message: "Contract released successfully" };
      } else {
        const result = await this.processAutoReleases();
        return result;
      }
    } catch (error) {
      console.error("Manual release error:", error);
      throw error;
    }
  }
};
var autoReleaseService = AutoReleaseService.getInstance();

// server/index.ts
dotenv2.config();
var app = express3();
app.use(express3.json({ limit: "50mb" }));
app.use(express3.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Error:", err);
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    autoReleaseService.start();
    monthlyTokenGrantService.startScheduler();
    log(`Monthly token grant scheduler started`);
    autonomousFundService.startScheduler();
    log(`Autonomous fund service started`);
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
      log(`Auto-release service started`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
