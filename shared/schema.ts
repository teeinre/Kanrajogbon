import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Dummy function for generateId, as it's not provided in the original code
// In a real scenario, this would be imported or defined elsewhere.
const generateId = () => Math.random().toString(36).substring(2, 15);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // 'client', 'finder', 'admin'
  isVerified: boolean("is_verified").default(false),
  identityVerificationStatus: text("identity_verification_status").default("not_verified"), // 'not_verified', 'pending', 'verified', 'rejected'
  isBanned: boolean("is_banned").default(false),
  bannedReason: text("banned_reason"),
  bannedAt: timestamp("banned_at"),
  findertokenBalance: integer("findertoken_balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const finders = pgTable("finders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobsCompleted: integer("jobs_completed").default(0),
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default("0.00"),
  availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default("0.00"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  currentLevelId: varchar("current_level_id").references(() => finderLevels.id), // references finder levels table
  bio: text("bio"),
  category: text("category"), // Finder's specialty category
  categories: text("categories").array(), // New field for multiple categories
  skills: text("skills").array(),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  availability: text("availability").default("full-time"),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  findertokenBalance: integer("findertoken_balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const findertokens = pgTable("findertokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  balance: integer("balance").default(0),
});

export const finds = pgTable("finds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budgetMin: text("budget_min"),
  budgetMax: text("budget_max"),
  timeframe: text("timeframe"),
  status: text("status").default("open"), // 'open', 'in_progress', 'completed', 'under_review'
  findertokenCost: integer("findertoken_cost").default(1),
  attachments: text("attachments").array(), // Array of file paths stored locally
  flaggedWords: text("flagged_words").array(), // Array of detected restricted words
  reviewReason: text("review_reason"), // Reason why find is under review
  isHighBudget: boolean("is_high_budget").default(false), // High budget posting requiring findertokens
  isBoosted: boolean("is_boosted").default(false), // Whether find is boosted
  boostAmount: integer("boost_amount").default(0), // Amount of findertokens spent to boost
  boostExpiresAt: timestamp("boost_expires_at"), // When boost expires
  createdAt: timestamp("created_at").defaultNow(),
});

// Restricted Words table for admin management
export const restrictedWords = pgTable("restricted_words", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull().unique(),
  category: text("category").default("general"), // Category of restriction
  severity: text("severity").default("flag"), // 'flag', 'block', 'review'
  addedBy: varchar("added_by").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  findId: varchar("find_id").references(() => finds.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  approach: text("approach").notNull(),
  price: text("price").notNull(),
  timeline: text("timeline").notNull(),
  notes: text("notes"),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  findId: varchar("find_id").references(() => finds.id).notNull(),
  proposalId: varchar("proposal_id").references(() => proposals.id).notNull(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  escrowStatus: text("escrow_status").default("held"), // 'held', 'in_progress', 'completed', 'released'
  isCompleted: boolean("is_completed").default(false),
  hasSubmission: boolean("has_submission").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // 'findertoken_purchase', 'proposal', 'refund'
  description: text("description"),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tokenPackages = pgTable("token_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  tokenCount: integer("token_count").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  proposalId: varchar("proposal_id").references(() => proposals.id).notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  attachmentPaths: text("attachment_paths").array(), // Array of file paths in object storage
  attachmentNames: text("attachment_names").array(), // Array of original file names
  quotedMessageId: text("quoted_message_id").references((): any => messages.id),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawalSettings = pgTable("withdrawal_settings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  minimumThreshold: integer("minimum_threshold").notNull().default(50),
  bankDetails: text("bank_details"), // JSON string containing bank account details
  paypalDetails: text("paypal_details"), // JSON string containing PayPal details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().unique(), // Human-readable request ID like "WR-2025-001"
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // 'pending', 'processing', 'approved', 'rejected'
  paymentMethod: text("payment_method").notNull(), // 'bank_transfer', 'paypal', 'crypto'
  paymentDetails: text("payment_details").notNull(), // JSON string with payment info
  adminNotes: text("admin_notes"),
  processedBy: varchar("processed_by").references(() => users.id),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderSubmissions = pgTable("order_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  submissionText: text("submission_text"),
  attachmentPaths: text("attachment_paths").array(), // array of file paths
  status: text("status").default("submitted"), // 'submitted', 'accepted', 'rejected'
  clientFeedback: text("client_feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  autoReleaseDate: timestamp("auto_release_date"), // 3 days after acceptance or 5 days after submission
});

export const finderLevels = pgTable("finder_levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  minEarnedAmount: decimal("min_earned_amount", { precision: 10, scale: 2 }).default("0"),
  minJobsCompleted: integer("min_jobs_completed").default(0),
  minRating: decimal("min_rating", { precision: 3, scale: 2 }).default("0"), // Minimum average rating (e.g., 4.0, 5.0)
  minFiveStarCount: integer("min_five_star_count").default(0), // Number of 5-star reviews required
  monthlyTokens: integer("monthly_tokens").default(20), // Monthly token allocation
  tokenBonusPerProposal: integer("token_bonus_per_proposal").default(0), // Extra tokens per accepted proposal
  vipInvitationsPerMonth: integer("vip_invitations_per_month").default(0), // VIP invitation quota
  badgeIcon: text("badge_icon"), // Icon identifier (e.g., 'leaf', 'compass', 'eye', 'torch', 'crown')
  badgeEmoji: text("badge_emoji"), // Emoji representation
  color: text("color"), // hex color code
  order: integer("order").notNull(), // display order
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tokenCharges = pgTable("token_charges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  amount: integer("amount").notNull(), // number of tokens charged
  reason: text("reason").notNull(), // reason for charge
  chargedBy: varchar("charged_by").references(() => users.id).notNull(), // admin who charged
  createdAt: timestamp("created_at").defaultNow(),
});

export const monthlyTokenDistributions = pgTable("monthly_token_distributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  tokensGranted: integer("tokens_granted").default(20),
  distributedAt: timestamp("distributed_at").defaultNow(),
});

export const tokenGrants = pgTable("token_grants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  finderId: varchar("finder_id").references(() => finders.id).notNull(),
  amount: integer("amount").notNull(), // number of tokens granted
  reason: text("reason").notNull(), // reason for grant
  grantedBy: varchar("granted_by").references(() => users.id).notNull(), // admin who granted
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientTokenGrants = pgTable("client_token_grants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // number of tokens granted
  reason: text("reason").notNull(), // reason for grant
  grantedBy: varchar("granted_by").references(() => users.id).notNull(), // admin who granted
  createdAt: timestamp("created_at").defaultNow(),
});

// Strike System Tables
export const strikes = pgTable("strikes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  strikeLevel: integer("strike_level").notNull(), // 1, 2, 3, 4, 5
  strikeCount: integer("strike_count").notNull().default(1), // How many strike points this violation adds
  offense: text("offense").notNull(), // Description of the offense
  offenseType: text("offense_type").notNull(), // Category of offense
  evidence: text("evidence"), // JSON string with evidence details
  issuedBy: varchar("issued_by").references(() => users.id).notNull(),
  status: text("status").default("active"), // 'active', 'appealed', 'resolved', 'expired'
  appealReason: text("appeal_reason"),
  appealedAt: timestamp("appealed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  expiresAt: timestamp("expires_at"), // When strike can be cleared (90 days for rollback)
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRestrictions = pgTable("user_restrictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  restrictionType: text("restriction_type").notNull(), // 'posting', 'applications', 'messaging', 'suspended', 'banned'
  reason: text("reason").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"), // null for permanent restrictions
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const disputes = pgTable("disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  strikeId: varchar("strike_id").references(() => strikes.id),
  contractId: varchar("contract_id").references(() => contracts.id),
  findId: varchar("find_id").references(() => finds.id),
  type: text("type").notNull(), // 'strike_appeal', 'contract_dispute', 'payment_dispute'
  description: text("description").notNull(),
  evidence: text("evidence"), // JSON string with files, screenshots, etc.
  status: text("status").default("pending"), // 'pending', 'investigating', 'resolved', 'rejected'
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const behavioralTraining = pgTable("behavioral_training", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleType: text("module_type").notNull(), // 'communication', 'reliability', 'fraud_prevention'
  status: text("status").default("assigned"), // 'assigned', 'in_progress', 'completed'
  assignedDate: timestamp("assigned_date").defaultNow(),
  completedDate: timestamp("completed_date"),
  score: integer("score"), // percentage score if applicable
});

export const trustedBadges = pgTable("trusted_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeType: text("badge_type").notNull(), // 'trusted_client', 'trusted_finder', 'referral_champion'
  earnedDate: timestamp("earned_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  validUntil: timestamp("valid_until"), // null for permanent badges
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  finder: one(finders, {
    fields: [users.id],
    references: [finders.userId],
  }),
  finds: many(finds),
  clientContracts: many(contracts, { relationName: "clientContracts" }),
  finderContracts: many(contracts, { relationName: "finderContracts" }),
  clientReviews: many(reviews, { relationName: "clientReviews" }),
  finderReviews: many(reviews, { relationName: "finderReviews" }),
  clientConversations: many(conversations, { relationName: "clientConversations" }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
}));

export const findersRelations = relations(finders, ({ one, many }) => ({
  user: one(users, {
    fields: [finders.userId],
    references: [users.id],
  }),
  findertokens: one(findertokens),
  withdrawalSettings: one(withdrawalSettings),
  currentLevel: one(finderLevels, {
    fields: [finders.currentLevelId],
    references: [finderLevels.id],
  }),
  proposals: many(proposals),
  contracts: many(contracts, { relationName: "finderContracts" }),
  transactions: many(transactions),
  reviews: many(reviews, { relationName: "finderReviews" }),
  finderConversations: many(conversations, { relationName: "finderConversations" }),
  withdrawalRequests: many(withdrawalRequests),
}));

export const findsRelations = relations(finds, ({ one, many }) => ({
  client: one(users, {
    fields: [finds.clientId],
    references: [users.id],
  }),
  proposals: many(proposals),
  contracts: many(contracts),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  find: one(finds, {
    fields: [proposals.findId],
    references: [finds.id],
  }),
  finder: one(finders, {
    fields: [proposals.finderId],
    references: [finders.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  find: one(finds, {
    fields: [contracts.findId],
    references: [finds.id],
  }),
  proposal: one(proposals, {
    fields: [contracts.proposalId],
    references: [proposals.id],
  }),
  client: one(users, {
    fields: [contracts.clientId],
    references: [users.id],
  }),
  finder: one(finders, {
    fields: [contracts.finderId],
    references: [finders.id],
  }),
  orderSubmissions: many(orderSubmissions),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  contract: one(contracts, {
    fields: [reviews.contractId],
    references: [contracts.id],
  }),
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
    relationName: "clientReviews",
  }),
  finder: one(users, {
    fields: [reviews.finderId],
    references: [users.id],
    relationName: "finderReviews",
  }),
}));

export const findertokensRelations = relations(findertokens, ({ one }) => ({
  finder: one(finders, {
    fields: [findertokens.finderId],
    references: [finders.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  finder: one(finders, {
    fields: [transactions.finderId],
    references: [finders.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  client: one(users, {
    fields: [conversations.clientId],
    references: [users.id],
    relationName: "clientConversations",
  }),
  finder: one(finders, {
    fields: [conversations.finderId],
    references: [finders.id],
    relationName: "finderConversations",
  }),
  proposal: one(proposals, {
    fields: [conversations.proposalId],
    references: [proposals.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const orderSubmissionsRelations = relations(orderSubmissions, ({ one }) => ({
  contract: one(contracts, {
    fields: [orderSubmissions.contractId],
    references: [contracts.id],
  }),
  finder: one(finders, {
    fields: [orderSubmissions.finderId],
    references: [finders.id],
  }),
}));

// Removed withdrawalSettingsRelations as withdrawalSettings table doesn't have a finderId field
// This table contains global withdrawal settings, not finder-specific settings

export const withdrawalRequestsRelations = relations(withdrawalRequests, ({ one }) => ({
  finder: one(finders, {
    fields: [withdrawalRequests.finderId],
    references: [finders.id],
  }),
  processedBy: one(users, {
    fields: [withdrawalRequests.processedBy],
    references: [users.id],
  }),
}));

export const withdrawalSettingsRelations = relations(withdrawalSettings, ({ one }) => ({
  finder: one(finders, {
    fields: [withdrawalSettings.finderId],
    references: [finders.id],
  }),
}));

export const finderLevelsRelations = relations(finderLevels, ({ many }) => ({
  finders: many(finders),
}));

export const monthlyTokenDistributionsRelations = relations(monthlyTokenDistributions, ({ one }) => ({
  finder: one(finders, {
    fields: [monthlyTokenDistributions.finderId],
    references: [finders.id],
  }),
}));

export const tokenGrantsRelations = relations(tokenGrants, ({ one }) => ({
  finder: one(finders, {
    fields: [tokenGrants.finderId],
    references: [finders.id],
  }),
  grantedBy: one(users, {
    fields: [tokenGrants.grantedBy],
    references: [users.id],
  }),
}));

export const clientTokenGrantsRelations = relations(clientTokenGrants, ({ one }) => ({
  client: one(users, {
    fields: [clientTokenGrants.clientId],
    references: [users.id],
  }),
  grantedBy: one(users, {
    fields: [clientTokenGrants.grantedBy],
    references: [users.id],
  }),
}));

export const restrictedWordsRelations = relations(restrictedWords, ({ one }) => ({
  addedByUser: one(users, {
    fields: [restrictedWords.addedBy],
    references: [users.id],
  }),
}));

// Export types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export type Finder = InferSelectModel<typeof finders> & { categories?: string[] | null };
export type InsertFinder = InferInsertModel<typeof finders>;
export type Find = InferSelectModel<typeof finds>;
export type InsertFind = InferInsertModel<typeof finds>;
export type Proposal = InferSelectModel<typeof proposals>;
export type InsertProposal = InferInsertModel<typeof proposals>;
export type Contract = InferSelectModel<typeof contracts>;
export type InsertContract = InferInsertModel<typeof contracts>;
export type Review = InferSelectModel<typeof reviews>;
export type InsertReview = InferInsertModel<typeof reviews>;
export type Findertoken = InferSelectModel<typeof findertokens>;
export type InsertFindertoken = InferInsertModel<typeof findertokens>;
export type Transaction = InferSelectModel<typeof transactions>;
export type InsertTransaction = InferInsertModel<typeof transactions>;
export type AdminSetting = InferSelectModel<typeof adminSettings>;
export type InsertAdminSetting = InferInsertModel<typeof adminSettings>;
export type Conversation = InferSelectModel<typeof conversations>;
export type InsertConversation = InferInsertModel<typeof conversations>;
export type Message = InferSelectModel<typeof messages>;
export type InsertMessage = InferInsertModel<typeof messages>;
export type FinderLevel = InferSelectModel<typeof finderLevels>;
export type InsertFinderLevel = InferInsertModel<typeof finderLevels>;
export type BlogPost = InferSelectModel<typeof blogPosts>;
export type InsertBlogPost = InferInsertModel<typeof blogPosts>;
export type TokenPackage = InferSelectModel<typeof tokenPackages>;
export type InsertTokenPackage = InferInsertModel<typeof tokenPackages>;
export type OrderSubmission = InferSelectModel<typeof orderSubmissions>;
export type InsertOrderSubmission = InferInsertModel<typeof orderSubmissions>;

// Categories
export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = InferSelectModel<typeof categories>;

// Withdrawal Settings
export const insertWithdrawalSettingsSchema = createInsertSchema(withdrawalSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWithdrawalSettings = z.infer<typeof insertWithdrawalSettingsSchema>;
export type WithdrawalSettings = InferSelectModel<typeof withdrawalSettings>;

// Withdrawal Requests
export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests);
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;
export type WithdrawalRequest = InferSelectModel<typeof withdrawalRequests>;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFinderSchema = createInsertSchema(finders).omit({
  id: true,
});

export const insertFindSchema = createInsertSchema(finds).omit({
  id: true,
  createdAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertFindertokenSchema = createInsertSchema(findertokens).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertTokenChargeSchema = createInsertSchema(tokenCharges).omit({
  id: true,
  createdAt: true,
});

export const insertMonthlyTokenDistributionSchema = createInsertSchema(monthlyTokenDistributions).omit({
  id: true,
  distributedAt: true,
});

export const insertTokenGrantSchema = createInsertSchema(tokenGrants).omit({
  id: true,
  createdAt: true,
});

// Monthly Token Distribution Types
export type MonthlyTokenDistribution = InferSelectModel<typeof monthlyTokenDistributions> & {
  finder?: {
    id: string;
    user?: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
};
export type InsertMonthlyTokenDistribution = z.infer<typeof insertMonthlyTokenDistributionSchema>;

// Token Grant Types
export type TokenGrant = InferSelectModel<typeof tokenGrants>;
export type InsertTokenGrant = z.infer<typeof insertTokenGrantSchema>;

// Client Token Grant Types
export type ClientTokenGrant = InferSelectModel<typeof clientTokenGrants>;
export const insertClientTokenGrantSchema = createInsertSchema(clientTokenGrants).omit({
  id: true,
  createdAt: true,
});
export type InsertClientTokenGrant = z.infer<typeof insertClientTokenGrantSchema>;

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true,
});

export const insertFinderLevelSchema = createInsertSchema(finderLevels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertFinderType = z.infer<typeof insertFinderSchema>;
export type InsertFindType = z.infer<typeof insertFindSchema>;
export type InsertProposalType = z.infer<typeof insertProposalSchema>;
export type InsertContractType = z.infer<typeof insertContractSchema>;
export type InsertReviewType = z.infer<typeof insertReviewSchema>;
export type InsertTokenChargeType = z.infer<typeof insertTokenChargeSchema>;
export type InsertTransactionType = z.infer<typeof insertTransactionSchema>;
export type InsertAdminSettingType = z.infer<typeof insertAdminSettingSchema>;
export type InsertConversationType = z.infer<typeof insertConversationSchema>;
export type InsertMessageType = z.infer<typeof insertMessageSchema>;
export type InsertBlogPostType = z.infer<typeof insertBlogPostSchema>;

// Token Package schemas
export const insertTokenPackageSchema = createInsertSchema(tokenPackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Order Submissions
export const insertOrderSubmissionSchema = createInsertSchema(orderSubmissions).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  autoReleaseDate: true,
});
export type InsertOrderSubmissionType = z.infer<typeof insertOrderSubmissionSchema>;

// Support Agent System Tables
export const supportAgents = pgTable("support_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  agentId: varchar("agent_id").notNull().unique(), // Human-readable ID like "AGT001"
  department: text("department").notNull(), // 'general', 'technical', 'billing', 'disputes'
  permissions: text("permissions").array().notNull(), // Array of permission strings
  isActive: boolean("is_active").default(true),
  maxTicketsPerDay: integer("max_tickets_per_day").default(20),
  responseTimeTarget: integer("response_time_target").default(24), // hours
  specializations: text("specializations").array(), // Areas of expertise
  languages: text("languages").array().default(["en"]), // Languages spoken
  assignedBy: varchar("assigned_by").references(() => users.id).notNull(),
  suspendedAt: timestamp("suspended_at"),
  suspensionReason: text("suspension_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SelectSupportAgent = InferSelectModel<typeof supportAgents>;

// Contact Settings Table
export const contactSettings = pgTable("contact_settings", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FAQ Categories Table
export const faqCategories = pgTable("faq_categories", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon").default('HelpCircle'),
  color: text("color").default('bg-blue-100 text-blue-800'),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User Verification Table
export const userVerifications = pgTable("user_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // 'national_id', 'passport', 'drivers_license'
  documentFrontImage: text("document_front_image").notNull(),
  documentBackImage: text("document_back_image"),
  selfieImage: text("selfie_image").notNull(),
  status: text("status").default("pending"), // 'pending', 'verified', 'rejected'
  rejectionReason: text("rejection_reason"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserVerification = InferSelectModel<typeof userVerifications>;
export type InsertUserVerification = InferInsertModel<typeof userVerifications>;

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: varchar("ticket_number").notNull().unique(), // Human-readable ticket number
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  submitterId: varchar("submitter_id").references(() => users.id), // null if anonymous
  category: text("category").notNull(),
  priority: text("priority").notNull(), // 'low', 'medium', 'high', 'urgent'
  department: text("department").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // 'open', 'assigned', 'in_progress', 'resolved', 'closed'
  assignedTo: varchar("assigned_to").references(() => supportAgents.id),
  assignedAt: timestamp("assigned_at"),
  responseTimeDeadline: timestamp("response_time_deadline"),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  satisfactionRating: integer("satisfaction_rating"), // 1-5 rating
  satisfactionFeedback: text("satisfaction_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id),
  senderType: text("sender_type").notNull(), // 'user', 'agent', 'system'
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email"),
  content: text("content").notNull(),
  attachments: text("attachments").array(),
  isInternal: boolean("is_internal").default(false), // Internal notes between agents
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportDepartments = pgTable("support_departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: text("color").default("#3B82F6"), // Hex color for UI
  isActive: boolean("is_active").default(true),
  autoAssignments: boolean("is_active").default(true),
  maxResponseTime: integer("max_response_time").default(24), // hours
  createdAt: timestamp("created_at").defaultNow(),
});

// Strike System Schemas
export const insertStrikeSchema = createInsertSchema(strikes).omit({
  id: true,
  createdAt: true,
});

export const insertUserRestrictionSchema = createInsertSchema(userRestrictions).omit({
  id: true,
  createdAt: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  submittedAt: true,
});

export const insertBehavioralTrainingSchema = createInsertSchema(behavioralTraining).omit({
  id: true,
  assignedDate: true,
});

export const insertTrustedBadgeSchema = createInsertSchema(trustedBadges).omit({
  id: true,
  earnedDate: true,
});

// Strike System Types
export type Strike = InferSelectModel<typeof strikes>;
export type InsertStrike = InferInsertModel<typeof strikes>;
export type SelectStrike = InferSelectModel<typeof strikes>;

export type UserRestriction = InferSelectModel<typeof userRestrictions>;
export type InsertUserRestriction = InferInsertModel<typeof userRestrictions>;
export type SelectUserRestriction = InferSelectModel<typeof userRestrictions>;

export type Dispute = InferSelectModel<typeof disputes>;
export type InsertDispute = InferInsertModel<typeof disputes>;
export type SelectDispute = InferSelectModel<typeof disputes>;

export type BehavioralTraining = InferSelectModel<typeof behavioralTraining>;
export type InsertBehavioralTraining = InferInsertModel<typeof behavioralTraining>;
export type SelectBehavioralTraining = InferSelectModel<typeof behavioralTraining>;

export type TrustedBadge = InferSelectModel<typeof trustedBadges>;
export type InsertTrustedBadge = InferInsertModel<typeof trustedBadges>;
export type SelectTrustedBadge = InferSelectModel<typeof trustedBadges>;

// Support Agent Relations
export const supportAgentsRelations = relations(supportAgents, ({ one, many }) => ({
  user: one(users, {
    fields: [supportAgents.userId],
    references: [users.id],
  }),
  assignedBy: one(users, {
    fields: [supportAgents.assignedBy],
    references: [users.id],
  }),
  assignedTickets: many(supportTickets),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  submitter: one(users, {
    fields: [supportTickets.submitterId],
    references: [users.id],
  }),
  assignedAgent: one(supportAgents, {
    fields: [supportTickets.assignedTo],
    references: [supportAgents.id],
  }),
  messages: many(supportTicketMessages),
}));

export const supportTicketMessagesRelations = relations(supportTicketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportTicketMessages.ticketId],
    references: [supportTickets.id],
  }),
  sender: one(users, {
    fields: [supportTicketMessages.senderId],
    references: [users.id],
  }),
}));


// Support Agent Types
export type SupportAgent = InferSelectModel<typeof supportAgents>;
export type SupportTicket = InferSelectModel<typeof supportTickets>;
export type SupportTicketMessage = InferSelectModel<typeof supportTicketMessages>;
export type SupportDepartment = InferSelectModel<typeof supportDepartments>;

export type InsertSupportAgent = InferInsertModel<typeof supportAgents>;
export type InsertSupportTicket = InferInsertModel<typeof supportTickets>;
export type InsertSupportDepartment = InferInsertModel<typeof supportDepartments>;

export const insertSupportAgentSchema = createInsertSchema(supportAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportDepartmentSchema = createInsertSchema(supportDepartments).omit({
  id: true,
  createdAt: true,
});

export const faqs = pgTable("faqs", {
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

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;
export type FAQCategory = typeof faqCategories.$inferSelect;
export type InsertFAQCategory = typeof faqCategories.$inferInsert;
export type ContactSettings = typeof contactSettings.$inferSelect;
export type InsertContactSettings = typeof contactSettings.$inferInsert;

export const insertFAQSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFAQCategorySchema = createInsertSchema(faqCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSettingsSchema = createInsertSchema(contactSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertUserVerificationSchema = createInsertSchema(userVerifications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  updatedAt: true,
});

// Restricted Words Types
export type RestrictedWord = InferSelectModel<typeof restrictedWords>;
export const insertRestrictedWordSchema = createInsertSchema(restrictedWords).omit({
  id: true,
  createdAt: true,
});
export type InsertRestrictedWord = z.infer<typeof insertRestrictedWordSchema>;