import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertUserSchema, insertFindSchema, insertProposalSchema, insertReviewSchema, insertMessageSchema, insertBlogPostSchema, insertOrderSubmissionSchema, type Find, finders, faqs, withdrawalSettings, contracts, tokenPackages, type InsertTokenPackage, type TokenPackage } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
// Payment service imports removed - Paystack and Opay services disabled
import { FlutterwaveService, FLUTTERWAVE_TOKEN_PACKAGES, getTokensFromAmount } from "./flutterwaveService";

// Paystack and Opay services successfully removed - Flutterwave-only payment processing
import { emailService } from "./emailService";
import { strikeService } from "./strikeService";
import { monthlyTokenGrantService } from "./monthlyTokenGrantService";
import { autonomousFundService } from "./autonomousFundService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Log JWT configuration status (without exposing the secret)
console.log('JWT configuration:', {
  hasCustomSecret: !!process.env.JWT_SECRET,
  secretLength: JWT_SECRET.length,
  environment: process.env.NODE_ENV || 'development'
});

// --- Middleware ---
// Extended Request interface for authentication
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to verify JWT tokens
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Verify the token has required fields
    if (!decoded.userId || !decoded.email) {
      console.error('JWT token missing required fields:', decoded);
      return res.status(401).json({
        message: 'Invalid token format. Please log in again.',
        code: 'TOKEN_INVALID_FORMAT'
      });
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    console.error('JWT verification error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token. Please log in again.',
        code: 'TOKEN_INVALID'
      });
    } else {
      return res.status(401).json({
        message: 'Token verification failed. Please log in again.',
        code: 'TOKEN_VERIFICATION_FAILED'
      });
    }
  }
}

// Dummy requireAuth and requireAdmin functions for the sake of compilation,
// assuming they are defined elsewhere and handle authentication and authorization.
// In a real application, these would be properly implemented middleware.
const requireAuth = authenticateToken;
async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
}
// --- End Middleware ---

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
    files: 5, // Maximum 5 files
    fieldSize: 25 * 1024 * 1024 // 25MB field size limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});


export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Admin Settings endpoint
  app.put("/api/admin/settings", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = req.body;

      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === 'string') {
          await storage.setAdminSetting(key, value);
        }
      }

      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error('Admin settings update error:', error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  app.get("/api/admin/settings", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      console.error('Admin settings get error:', error);
      res.status(500).json({ message: "Failed to get settings" });
    }
  });

  // --- Authentication Routes ---
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;

      // Check auto-verification setting
      const settings = await storage.getAdminSettings();
      const autoVerifyEnabled = settings.autoVerifyEnabled === 'true';

      // Validate input
      const userData = insertUserSchema.parse({
        email,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        role,
        isVerified: autoVerifyEnabled // Set verification based on admin setting
      });

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create user
      const user = await storage.createUser(userData);

      // If registering as finder, create finder profile
      if (role === 'finder') {
        await storage.createFinder({
          userId: user.id,
          phone: phone || null,
          isVerified: autoVerifyEnabled // Also set finder verification
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: { ...user, password: undefined },
        token
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: "Registration failed", error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user || user.isBanned) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: { ...user, password: undefined },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let profile = null;
      if (user.role === 'finder') {
        profile = await storage.getFinderByUserId(user.id);
      }

      res.json({
        user: { ...user, password: undefined },
        profile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // Token refresh endpoint
  app.post("/api/auth/refresh", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new token with updated expiration
      const newToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token: newToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });

  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      console.log(`Password reset requested for email: ${email}`);

      // Check if user exists
      const user = await storage.getUserByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        console.log(`No user found for email: ${email}`);
        return res.json({ message: "If an account with that email exists, we've sent you a password reset link." });
      }

      console.log(`User found: ${user.id} - ${user.firstName} ${user.lastName}`);

      // Generate reset token (expires in 1 hour)
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Create reset link
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
      console.log(`Generated reset link: ${resetLink}`);

      // Send reset email
      try {
        const emailSent = await emailService.sendPasswordResetEmail(user.email, `${user.firstName} ${user.lastName}`, resetLink);

        if (!emailSent) {
          console.error('Email service returned false for password reset email');
          return res.status(500).json({ message: "Failed to send reset email. Please check your email configuration." });
        }

        console.log(`Password reset email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return res.status(500).json({ message: "Failed to send reset email. Please check your email configuration." });
      }

      res.json({ message: "If an account with that email exists, we've sent you a password reset link." });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Verify reset token
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'password_reset') {
          throw new Error('Invalid token type');
        }
      } catch (jwtError) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Get user and update password
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await storage.updateUser(decoded.userId, { password: hashedPassword });

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post("/api/auth/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Get current user
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password using updateUser method
      await storage.updateUser(req.user.userId, { password: hashedNewPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // --- Finder Routes ---
  app.get("/api/finder/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'finder') {
        return res.status(403).json({ message: "Access denied. Only finders can access this endpoint." });
      }

      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      // Calculate actual jobs completed from contracts
      const completedContracts = await db
        .select()
        .from(contracts)
        .where(eq(contracts.finderId, finder.id))
        .where(eq(contracts.isCompleted, true));

      const actualJobsCompleted = completedContracts.length;

      // Update finder's jobsCompleted if it doesn't match
      if (finder.jobsCompleted !== actualJobsCompleted) {
        await db
          .update(finders)
          .set({ jobsCompleted: actualJobsCompleted })
          .where(eq(finders.id, finder.id));
      }

      // Include user data with finder profile
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
      console.error('Get finder profile error:', error);
      res.status(500).json({ message: "Failed to get finder profile" });
    }
  });

  app.get("/api/finder/pending-earnings", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can access this endpoint" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const pendingEarnings = await storage.getPendingEarnings(finder.id);
      res.json(pendingEarnings);
    } catch (error) {
      console.error('Get pending earnings error:', error);
      res.status(500).json({ message: "Failed to get pending earnings" });
    }
  });

  app.patch("/api/finder/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { bio, category, categories, skills, availability } = req.body;

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'finder') {
        return res.status(403).json({ message: "Access denied. Only finders can update their profile." });
      }

      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      // Prepare update data
      const updateData: any = {
        bio,
        skills,
        availability
      };

      // Handle categories - prioritize new categories array over legacy category
      if (categories && Array.isArray(categories)) {
        updateData.categories = categories;
        // Also update the legacy category field with the first category for backward compatibility
        updateData.category = categories.length > 0 ? categories[0] : category;
      } else if (category) {
        // If only legacy category is provided, use it
        updateData.category = category;
        // Convert single category to array for new categories field
        updateData.categories = [category];
      }

      // Update finder profile
      const updatedFinder = await storage.updateFinder(finder.id, updateData);

      if (!updatedFinder) {
        return res.status(404).json({ message: "Failed to update finder profile" });
      }

      res.json({
        message: "Profile updated successfully",
        profile: updatedFinder
      });
    } catch (error) {
      console.error('Update finder profile error:', error);
      res.status(500).json({ message: "Failed to update finder profile" });
    }
  });

  app.post("/api/auth/update-profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "First name, last name, and email are required" });
      }

      // Check if email is already taken by another user
      if (email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.user.userId) {
          return res.status(400).json({ message: "Email is already taken by another user" });
        }
      }

      // Update user profile
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
        user: { ...updatedUser, password: undefined }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // --- Find Routes ---
  app.get("/api/finds", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const finds = await storage.getAllActiveFinds();
      res.json(finds);
    } catch (error) {
      console.error('Failed to fetch finds:', error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });

  app.get("/api/finds/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const find = await storage.getFind(id);

      if (!find) {
        return res.status(404).json({ message: "Find not found" });
      }

      res.json(find);
    } catch (error) {
      console.error('Get request error:', error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  // Finder-specific routes
  app.get("/api/finder/finds", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can browse finds" });
      }

      // Get finder's categories
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const finderCategories = finder.categories || (finder.category ? [finder.category] : []);

      let finds;
      if (finderCategories.length > 0) {
        // Get finds prioritized by finder's categories
        finds = await storage.getFindsForFinderByCategories(finderCategories);
      } else {
        // Fallback to all finds if no categories set
        finds = await storage.getAvailableFindsForFinders();
      }

      res.json(finds);
    } catch (error) {
      console.error('Finder finds error:', error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });

  app.get("/api/finder/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can view their proposals" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const proposals = await storage.getProposalsByFinderId(finder.id);
      res.json(proposals);
    } catch (error) {
      console.error('Finder proposals error:', error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get("/api/finder/dashboard", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can access finder dashboard" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const findertokenBalance = await storage.getFindertokenBalance(finder.id);
      const proposals = await storage.getProposalsByFinderId(finder.id);
      const recentFinds = await storage.getAllActiveFinds();

      res.json({
        finder,
        findertokenBalance: findertokenBalance?.balance ?? 0,
        proposalsCount: proposals.length,
        availableFinds: recentFinds.length
      });
    } catch (error) {
      console.error('Finder dashboard error:', error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // --- Client Routes ---
  app.get("/api/client/finds", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view their finds" });
      }

      const finds = await storage.getFindsByClientId(req.user.userId);
      res.json(finds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your finds" });
    }
  });

  app.post("/api/client/finds", authenticateToken, upload.array('attachments', 5), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can create finds" });
      }

      console.log('Create find request body:', req.body);
      console.log('Create find files:', req.files);

      // Check if client is verified before allowing find creation
      const client = await storage.getUser(req.user.userId);
      if (!client || !client.isVerified) {
        return res.status(403).json({
          message: "Account must be verified to post finds.",
          verified: false,
          verificationRequired: true
        });
      }

      // Get admin settings for high budget posting
      const settings = await storage.getAdminSettings();
      const highBudgetThreshold = parseInt(settings.highBudgetThreshold || "100000");
      const highBudgetTokenCost = parseInt(settings.highBudgetTokenCost || "5");

      // Check if this is a high budget request
      const maxBudget = parseInt(req.body.budgetMax || "0");
      const isHighBudget = maxBudget >= highBudgetThreshold;

      // If high budget, check if client has enough findertokens
      if (isHighBudget) {
        const client = await storage.getClientProfile(req.user.userId);
        if (!client) {
          return res.status(404).json({ message: "Client profile not found" });
        }

        const clientBalance = client.findertokenBalance || 0;
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

      // Get uploaded file paths
      const files = req.files as Express.Multer.File[];
      const attachmentPaths = files ? files.map(file => `/uploads/${file.filename}`) : [];

      // Check for restricted words in title and description
      const contentToCheck = `${req.body.title || ''} ${req.body.description || ''}`;
      const flaggedWords = await storage.checkContentForRestrictedWords(contentToCheck);

      // Handle boosting - Fixed cost of 50 findertokens
      const BOOST_COST = 50;
      const isBoosted = req.body.isBoosted === true || req.body.isBoosted === 'true';
      let boostExpiresAt = null;

      if (isBoosted) {
        // Boost lasts for 7 days
        boostExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Check if client has enough tokens for boosting
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
        status: flaggedWords.length > 0 ? 'under_review' : 'open',
        flaggedWords: flaggedWords.length > 0 ? flaggedWords : undefined,
        reviewReason: flaggedWords.length > 0 ? `Find contains restricted words: ${flaggedWords.join(', ')}` : undefined,
        isHighBudget: isHighBudget,
        isBoosted: isBoosted,
        boostAmount: isBoosted ? BOOST_COST : 0,
        boostExpiresAt: boostExpiresAt
      });

      const request = await storage.createFind(requestData);

      // If high budget, deduct findertokens
      if (isHighBudget) {
        await storage.deductClientFindertokens(req.user.userId, highBudgetTokenCost, `High-budget find posting: ${request.title}`);
      }

      // If boosted, deduct findertokens for boost
      if (isBoosted) {
        await storage.deductClientFindertokens(req.user.userId, BOOST_COST, `Find boost: ${request.title}`);
      }

      // If flagged, notify the client that their find is under review
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
    } catch (error: any) {
      console.error('Create find error:', error);
      res.status(400).json({ message: "Failed to create find", error: error.message });
    }
  });



  app.get("/api/client/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view proposals" });
      }

      const proposals = await storage.getProposalsForClient(req.user.userId);
      res.json(proposals);
    } catch (error) {
      console.error('Failed to fetch client proposals:', error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get("/api/client/transactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view transactions" });
      }

      const transactions = await storage.getTransactionsByUserId(req.user.userId);
      res.json(transactions);
    } catch (error) {
      console.error('Failed to fetch client transactions:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/client/balance", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view balance" });
      }

      // Calculate client token balance from clientTokenGrants table
      const balance = await storage.getClientTokenBalance(req.user.userId);

      res.json({
        balance: balance
      });
    } catch (error) {
      console.error('Failed to fetch client balance:', error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  app.post("/api/finds", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can create finds" });
      }

      const requestData = insertFindSchema.parse({
        ...req.body,
        clientId: req.user.userId
      });

      const request = await storage.createFind(requestData);
      res.status(201).json(request);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create find", error: error.message });
    }
  });

  app.get("/api/finds/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view their finds" });
      }

      const finds = await storage.getFindsByClientId(req.user.userId);
      res.json(finds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your finds" });
    }
  });

  app.get("/api/finds/:id/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const request = await storage.getFind(id);

      if (!request) {
        return res.status(404).json({ message: "Find not found" });
      }

      // Only the client who posted the request can view ALL proposals
      if (req.user.role === 'client' && request.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // If finder is accessing, they should use /finder/finds/:id/proposals instead
      if (req.user.role === 'finder') {
        return res.status(403).json({ message: "Finders should use finder-specific endpoints" });
      }

      const proposals = await storage.getProposalsByFindId(id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  // Finder-specific route to see only their own proposals for a request (like comments)
  app.get("/api/finder/finds/:id/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can use this endpoint" });
      }

      const request = await storage.getFind(id);
      if (!request) {
        return res.status(404).json({ message: "Find not found" });
      }

      // Get finder profile
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      // Get only this finder's proposals for this request (like seeing only your own comments)
      const proposal = await storage.getProposalByFinderAndFind(finder.id, id);
      res.json(proposal ? [proposal] : []);
    } catch (error) {
      console.error('Finder request proposals error:', error);
      res.status(500).json({ message: "Failed to fetch your proposals" });
    }
  });

  // --- Proposal Routes ---
  app.post("/api/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can submit proposals" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      // Check if finder is verified
      const finderUser = await storage.getUser(req.user.userId);
      if (!finderUser || !finderUser.isVerified || !finder.isVerified) {
        return res.status(403).json({
          message: "Account must be verified and profile completed to submit proposals.",
          verified: false,
          verificationRequired: true
        });
      }

      // Check profile completion requirement (100%)
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

      // Check if request has already been accepted by someone else
      const hasAccepted = await storage.hasAcceptedProposal(proposalData.findId);
      if (hasAccepted) {
        return res.status(400).json({ message: "This request has already been accepted by another finder" });
      }

      // Check if this finder has already submitted a proposal for this request
      const existingProposal = await storage.getProposalByFinderAndFind(finder.id, proposalData.findId);
      if (existingProposal) {
        return res.status(400).json({ message: "You have already submitted a proposal for this request" });
      }

      // Check findertoken balance
      const tokenCost = await storage.getAdminSetting('proposal_token_cost');
      const requiredTokens = parseInt(tokenCost?.value || '1');

      if ((finder.findertokenBalance ?? 0) < requiredTokens) {
        return res.status(400).json({ message: `Insufficient findertokens to submit proposal. Required: ${requiredTokens}, Available: ${finder.findertokenBalance ?? 0}` });
      }

      const proposal = await storage.createProposal(proposalData);

      // Deduct findertoken - update finder balance directly
      const newBalance = (finder.findertokenBalance ?? 0) - requiredTokens;
      await storage.updateFinderTokenBalance(finder.id, newBalance);

      // Record transaction
      await storage.createTransaction({
        userId: req.user.userId,
        finderId: finder.id,
        amount: -requiredTokens,
        type: 'proposal',
        description: `Proposal submitted for request: ${proposal.findId}`
      });

      // Send email notification to client about new proposal
      try {
        const request = await storage.getFind(proposal.findId);
        if (request) {
          const clientUser = await storage.getUser(request.clientId);
          const finderUser = await storage.getUser(req.user.userId);

          if (clientUser && finderUser) {
            await emailService.notifyClientNewProposal(
              clientUser.email,
              `${finderUser.firstName} ${finderUser.lastName}`,
              request.title,
              proposal.price.toString()
            );
          }
        }
      } catch (emailError) {
        console.error('Failed to send new proposal notification email:', emailError);
      }

      res.status(201).json(proposal);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to submit proposal", error: error.message });
    }
  });

  app.get("/api/proposals/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const proposalWithDetails = await storage.getProposalWithDetails(id);

      if (!proposalWithDetails) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Authorization: only the finder who submitted it or the client who owns the request can view it
      if (req.user.role === 'finder') {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder || proposalWithDetails.finderId !== finder.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else if (req.user.role === 'client') {
        const request = await storage.getFind(proposalWithDetails.findId);
        if (!request || request.clientId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(proposalWithDetails);
    } catch (error) {
      console.error('Get proposal error:', error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  app.get("/api/proposals/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can view their proposals" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const proposals = await storage.getProposalsByFinderId(finder.id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your proposals" });
    }
  });

  // --- Finder Contracts ---
  app.get("/api/finder/contracts", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can view their contracts" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const contracts = await storage.getContractsByFinderId(finder.id);
      res.json(contracts);
    } catch (error) {
      console.error('Failed to fetch finder contracts:', error);
      res.status(500).json({ message: "Failed to fetch your contracts" });
    }
  });

  app.get("/api/finder/contracts/:contractId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
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
      console.error('Failed to fetch contract details:', error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });

  app.post("/api/proposals/:id/accept", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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

      // Check if find already has an accepted proposal (prevent multiple hiring)
      const hasAcceptedProposal = await storage.hasAcceptedProposal(proposal.findId);
      if (hasAcceptedProposal) {
        return res.status(400).json({ message: "This find already has an accepted proposal. You cannot hire multiple finders for the same find." });
      }

      // Get finder and client details for email notification
      const finder = await storage.getFinder(proposal.finderId);
      const finderUser = finder ? await storage.getUser(finder.userId) : null;
      const clientUser = await storage.getUser(request.clientId);

      // Update proposal status
      await storage.updateProposal(id, { status: 'accepted' });

      // Update find status to in_progress to prevent other hires
      await storage.updateFind(proposal.findId, { status: 'in_progress' });

      // Create contract with pending escrow status (payment required)
      const contract = await storage.createContract({
        findId: proposal.findId,
        proposalId: proposal.id,
        clientId: request.clientId,
        finderId: proposal.finderId,
        amount: proposal.price,
        escrowStatus: 'pending'
      });

      // Send email notification to finder about being hired (pending payment)
      if (finderUser && clientUser) {
        try {
          await emailService.notifyFinderHired(
            finderUser.email,
            `${clientUser.firstName} ${clientUser.lastName}`,
            request.title,
            proposal.price.toString()
          );
        } catch (emailError) {
          console.error('Failed to send hire notification email:', emailError);
        }
      }

      res.json({
        success: true,
        message: "Proposal accepted and contract created. Please complete payment to start work.",
        proposal,
        contract: {
          ...contract,
          findTitle: request.title,
          finderName: finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : 'Unknown Finder'
        },
        payment: {
          required: true,
          amount: proposal.price,
          contractId: contract.id
        }
      });
    } catch (error) {
      console.error('Accept proposal error:', error);
      res.status(500).json({ message: "Failed to accept proposal and create contract" });
    }
  });

  // --- User Verification Routes ---
  // Get verification status for current user
  app.get("/api/verification/status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if verification is required from admin settings
      const settings = await storage.getAdminSettings();
      const verificationRequired = settings.verificationRequired === 'true';

      if (!verificationRequired) {
        return res.json({
          isRequired: false,
          verification: null
        });
      }

      // Get user's verification status
      const verification = await storage.getVerificationByUserId(req.user.userId);

      res.json({
        isRequired: true,
        verification: verification || null
      });
    } catch (error) {
      console.error('Error getting verification status:', error);
      res.status(500).json({ message: "Failed to get verification status" });
    }
  });

  // Submit verification
  app.post("/api/verification/submit", authenticateToken, upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { documentType } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!documentType || !files.documentFront || !files.selfie) {
        return res.status(400).json({ message: "Document type, document front, and selfie are required" });
      }

      // Check if user already has a pending verification
      const existingVerification = await storage.getVerificationByUserId(req.user.userId);
      if (existingVerification && existingVerification.status === 'pending') {
        return res.status(400).json({ message: "You already have a pending verification request" });
      }

      const verificationData = {
        userId: req.user.userId,
        documentType,
        documentFrontImage: `/uploads/${files.documentFront[0].filename}`,
        documentBackImage: files.documentBack ? `/uploads/${files.documentBack[0].filename}` : null,
        selfieImage: `/uploads/${files.selfie[0].filename}`,
        status: 'pending'
      };

      const verification = await storage.submitVerification(verificationData);

      res.status(201).json({
        message: "Verification submitted successfully",
        verification
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      res.status(500).json({ message: "Failed to submit verification" });
    }
  });

  // Admin approve verification
  app.post("/api/admin/verifications/:id/approve", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const verification = await storage.updateVerificationStatus(id, 'verified', req.user.userId);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      console.log(`Verification approved for user ${verification.userId} - status updated to verified`);

      res.json({
        message: "Verification approved successfully",
        verification
      });
    } catch (error) {
      console.error('Error approving verification:', error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });

  // Admin reject verification
  app.post("/api/admin/verifications/:id/reject", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }

      const verification = await storage.updateVerificationStatus(id, 'rejected', req.user.userId, reason);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      res.json({
        message: "Verification rejected successfully",
        verification
      });
    } catch (error) {
      console.error('Error rejecting verification:', error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });

  // Admin get verification details
  app.get("/api/admin/verifications/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const verification = await storage.getVerificationById(id);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      res.json(verification);
    } catch (error) {
      console.error('Error fetching verification details:', error);
      res.status(500).json({ message: "Failed to fetch verification details" });
    }
  });

  // --- Support Ticket ---
  // Support ticket submission endpoint
  app.post("/api/support/tickets", async (req: Request, res: Response) => {
    try {
      const { name, email, category, priority = 'medium', subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !category || !subject || !message) {
        return res.status(400).json({
          message: "Missing required fields: name, email, category, subject, and message are required"
        });
      }

      // Generate unique ticket number
      const ticketNumber = await storage.generateTicketNumber();

      // Map category to department (can be enhanced with a lookup table later)
      const departmentMap: { [key: string]: string } = {
        'account': 'general',
        'billing': 'billing',
        'payment': 'billing',
        'technical': 'technical',
        'bug': 'technical',
        'feature': 'general',
        'general': 'general',
        'dispute': 'disputes',
        'verification': 'verification'
      };

      const department = departmentMap[category.toLowerCase()] || 'general';

      // Check if user is authenticated (optional - tickets can be anonymous)
      let submitterId = null;
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          submitterId = decoded.userId;
        } catch (error) {
          // If token is invalid, treat as anonymous submission
          console.log('Anonymous ticket submission - invalid/missing token');
        }
      }

      // Create support ticket
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
        status: 'open'
      };

      const ticket = await storage.createSupportTicket(ticketData);

      // Create initial message from user
      await storage.createSupportTicketMessage({
        ticketId: ticket.id,
        senderId: submitterId,
        senderType: 'user',
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
      console.error('Failed to submit support ticket:', error);
      res.status(500).json({ message: "Failed to submit support ticket" });
    }
  });

  // Support Agent Authentication Middleware
  async function requireSupportAgent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        console.log('No user in request for support agent auth');
        return res.status(401).json({ message: 'Authentication required' });
      }

      console.log('Checking support agent for user:', req.user.userId, 'role:', req.user.role);

      // Only allow actual support agents, not admins
      const supportAgent = await storage.getUserSupportAgent(req.user.userId);
      console.log('Found support agent:', supportAgent ? supportAgent.id : 'none');

      if (!supportAgent) {
        console.log('No support agent record found for user:', req.user.userId);
        return res.status(403).json({ message: 'Support agent access required. Please contact an administrator to be assigned as a support agent.' });
      }

      if (!supportAgent.isActive) {
        console.log('Support agent is not active:', supportAgent.id);
        return res.status(403).json({ message: 'Support agent account is suspended' });
      }

      // Attach agent info to request
      (req as any).agent = supportAgent;
      console.log('Support agent authenticated successfully:', supportAgent.agentId);
      next();
    } catch (error) {
      console.error('Support agent authentication error:', error);
      res.status(500).json({ message: 'Authentication error' });
    }
  }

  // Check if agent has specific permission
  function requirePermission(permission: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const agent = (req as any).agent;
      if (!agent || !agent.permissions.includes(permission)) {
        return res.status(403).json({ message: `Permission required: ${permission}` });
      }
      next();
    };
  }

  // Debug endpoint for support agent authentication
  app.get("/api/debug/agent-auth", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('Debug: User info:', {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
      });

      const supportAgent = await storage.getUserSupportAgent(req.user.userId);
      console.log('Debug: Support agent:', supportAgent);

      res.json({
        user: {
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role
        },
        supportAgent: supportAgent
      });
    } catch (error) {
      console.error('Debug agent auth error:', error);
      res.status(500).json({ message: 'Debug error', error: error.message });
    }
  });

  // --- Admin Support Management ---
  // Admin endpoint to view all support tickets
  app.get("/api/admin/support/tickets", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status, priority, department, page = 1, limit = 20 } = req.query;

      let filters: any = {};

      if (status && typeof status === 'string') {
        filters.status = status;
      }
      if (priority && typeof priority === 'string') {
        filters.priority = priority;
      }
      if (department && typeof department === 'string') {
        filters.department = department;
      }

      const tickets = await storage.getSupportTickets(filters);

      res.json({
        tickets,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: tickets.length
        }
      });
    } catch (error) {
      console.error('Failed to fetch admin support tickets:', error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Admin endpoint to view specific ticket
  app.get("/api/admin/support/tickets/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Get ticket messages
      const messages = await storage.getSupportTicketMessages(id);

      res.json({
        ticket,
        messages
      });
    } catch (error) {
      console.error('Failed to fetch admin ticket details:', error);
      res.status(500).json({ message: "Failed to fetch ticket details" });
    }
  });

  // Admin endpoint to update ticket assignment and status
  app.put("/api/admin/support/tickets/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, assignedTo, priority, resolution } = req.body;

      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const updates: any = {};

      if (status !== undefined) {
        updates.status = status;

        if (status === 'resolved' || status === 'closed') {
          updates.resolvedAt = new Date();
          if (resolution) {
            updates.resolution = resolution;
          }
        }
      }

      if (assignedTo !== undefined) {
        updates.assignedTo = assignedTo;
      }

      if (priority !== undefined) {
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
      console.error('Failed to update admin ticket:', error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // --- Support Agent Ticket Management ---

  // Get tickets for agent based on permissions and department
  app.get("/api/agent/tickets", authenticateToken, requireSupportAgent, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const agent = (req as any).agent;
      const { status, priority, page = 1, limit = 20 } = req.query;

      let filters: any = {};

      // Apply department filter based on agent's department
      if (agent.department !== 'all') {
        filters.department = agent.department;
      }

      // Apply status filter if provided
      if (status && typeof status === 'string') {
        filters.status = status;
      }

      // Apply priority filter if provided
      if (priority && typeof priority === 'string') {
        filters.priority = priority;
      }

      // If agent can only view assigned tickets, filter by assignment
      if (!agent.permissions.includes('view_all_tickets')) {
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
          page: parseInt(page as string),
          limit: parseInt(limit as string),
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
      console.error('Failed to fetch tickets for agent:', error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  // Get specific ticket details
  app.get("/api/agent/tickets/:id", authenticateToken, requireSupportAgent, requirePermission('view_tickets'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const agent = (req as any).agent;

      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Check if agent can view this ticket based on department and assignment
      if (agent.department !== 'all' && ticket.department !== agent.department) {
        if (!agent.permissions.includes('view_all_tickets') && ticket.assignedTo !== agent.id) {
          return res.status(403).json({ message: "Access denied to this ticket" });
        }
      }

      // Get ticket messages
      const messages = await storage.getSupportTicketMessages(id);

      console.log(`Agent ${agent.agentId} viewing ticket ${ticket.ticketNumber}`);

      res.json({
        ticket,
        messages: messages.map(msg => ({
          ...msg,
          // Hide internal messages from non-agent viewers if needed
          isInternal: msg.isInternal && !agent.permissions.includes('view_internal_notes') ? false : msg.isInternal
        }))
      });
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      res.status(500).json({ message: "Failed to fetch ticket details" });
    }
  });

  // Add response to ticket
  app.post("/api/agent/tickets/:id/messages", authenticateToken, requireSupportAgent, requirePermission('respond_tickets'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { content, isInternal = false } = req.body;
      const agent = (req as any).agent;

      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Check if agent can respond to this ticket
      if (agent.department !== 'all' && ticket.department !== agent.department) {
        if (!agent.permissions.includes('respond_all_tickets') && ticket.assignedTo !== agent.id) {
          return res.status(403).json({ message: "Access denied to respond to this ticket" });
        }
      }

      // Check internal notes permission
      if (isInternal && !agent.permissions.includes('internal_notes')) {
        return res.status(403).json({ message: "Permission denied for internal notes" });
      }

      // Create the message
      const message = await storage.createSupportTicketMessage({
        ticketId: id,
        senderId: agent.userId,
        senderType: 'agent',
        senderName: `${agent.user?.firstName || ''} ${agent.user?.lastName || ''}`.trim() || agent.agentId,
        content,
        isInternal
      });

      // Update ticket status if needed
      let statusUpdate = {};
      if (ticket.status === 'open') {
        statusUpdate = { status: 'in_progress' };
      }
      if (!ticket.assignedTo && agent.permissions.includes('assign_tickets')) {
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
      console.error('Failed to add ticket response:', error);
      res.status(500).json({ message: "Failed to add response" });
    }
  });

  // Update ticket (assign, change status, etc.)
  app.put("/api/agent/tickets/:id", authenticateToken, requireSupportAgent, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, assignedTo, priority, resolution } = req.body;
      const agent = (req as any).agent;

      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Check permissions for various operations
      const updates: any = {};

      if (status !== undefined) {
        if (status === 'closed' && !agent.permissions.includes('close_tickets')) {
          return res.status(403).json({ message: "Permission denied to close tickets" });
        }
        updates.status = status;

        if (status === 'resolved' || status === 'closed') {
          updates.resolvedAt = new Date();
          if (resolution) {
            updates.resolution = resolution;
          }
        }
      }

      if (assignedTo !== undefined && agent.permissions.includes('assign_tickets')) {
        updates.assignedTo = assignedTo;
      }

      if (priority !== undefined && agent.permissions.includes('modify_priority')) {
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
      console.error('Failed to update ticket:', error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // Get agent dashboard statistics
  app.get("/api/agent/dashboard", authenticateToken, requireSupportAgent, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const agent = (req as any).agent;

      // Get tickets assigned to this agent
      const assignedTickets = await storage.getSupportTickets({ assignedTo: agent.id });

      // Get all tickets in agent's department for overview
      let departmentFilters: any = {};
      if (agent.department !== 'all') {
        departmentFilters.department = agent.department;
      }
      const departmentTickets = await storage.getSupportTickets(departmentFilters);

      const stats = {
        assigned: {
          total: assignedTickets.length,
          open: assignedTickets.filter(t => t.status === 'open').length,
          inProgress: assignedTickets.filter(t => t.status === 'in_progress').length,
          resolved: assignedTickets.filter(t => t.status === 'resolved').length
        },
        department: {
          total: departmentTickets.length,
          unassigned: departmentTickets.filter(t => !t.assignedTo).length,
          urgent: departmentTickets.filter(t => t.priority === 'urgent').length,
          high: departmentTickets.filter(t => t.priority === 'high').length
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
        recentTickets: assignedTickets.slice(0, 5).map(ticket => ({
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
      console.error('Failed to fetch agent dashboard:', error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // --- Contract Payment System ---
  // Initialize contract payment
  app.post("/api/contracts/:contractId/payment", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { contractId } = req.params;
      console.log(`[CONTRACT PAYMENT] Initializing payment for contract: ${contractId}`);

      // Get contract details
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Verify user access
      if (contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check contract status
      if (contract.escrowStatus === 'funded' || contract.escrowStatus === 'held') {
        return res.status(400).json({
          message: "Contract is already funded",
          escrowStatus: contract.escrowStatus
        });
      }

      // Get user details
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Initialize Flutterwave service
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }

      // Generate payment reference
      const reference = flutterwaveService.generateTransactionReference(user.id);
      const amount = parseFloat(contract.amount);

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid contract amount" });
      }

      // Get find details for description
      const proposal = await storage.getProposal(contract.proposalId);
      const find = proposal ? await storage.getFind(proposal.findId) : null;

      // Create payment
      const baseUrl = flutterwaveService.getBaseUrl();
      const redirectUrl = `${baseUrl}/client/payment-success?type=contract&contractId=${contractId}&reference=${reference}`;

      const paymentData = await flutterwaveService.initializePayment({
        email: user.email,
        amount: amount,
        reference: reference,
        metadata: {
          userId: user.id,
          userRole: 'client',
          contractId: contractId,
          type: 'contract_payment',
          description: find ? `Contract payment for: ${find.title}` : 'Contract payment',
          customerName: `${user.firstName} ${user.lastName}`
        },
        redirectUrl: redirectUrl
      });

      console.log(`[CONTRACT PAYMENT] Payment initialized successfully for contract ${contractId}`);
      res.json(paymentData);

    } catch (error) {
      console.error('[CONTRACT PAYMENT] Error:', error);
      res.status(500).json({
        message: "Failed to initialize payment",
        error: error.message
      });
    }
  });

  // --- Token Purchase System ---
  // Get available token packages (from database - admin created)
  app.get("/api/tokens/packages", async (req: Request, res: Response) => {
    try {
      const tokenPackages = await storage.getActiveTokenPackages();
      res.json(tokenPackages);
    } catch (error) {
      console.error('Failed to fetch token packages:', error);
      res.status(500).json({ message: "Failed to fetch token packages" });
    }
  });

  // Initialize token purchase
  app.post("/api/tokens/purchase", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { packageId } = req.body;
      console.log(`[TOKEN PURCHASE] Initializing purchase for package: ${packageId}`);

      // Find the selected package from database
      const selectedPackage = await storage.getTokenPackage(packageId);
      if (!selectedPackage || !selectedPackage.isActive) {
        return res.status(400).json({ message: "Invalid package selected" });
      }

      // Get user details
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Initialize Flutterwave service
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }

      // Generate payment reference
      const reference = flutterwaveService.generateTransactionReference(user.id);

      // Create payment
      const baseUrl = flutterwaveService.getBaseUrl();
      const redirectUrl = `${baseUrl}/${user.role}/payment-success?type=tokens&reference=${reference}`;

      const paymentData = await flutterwaveService.initializePayment({
        email: user.email,
        amount: parseFloat(selectedPackage.price),
        reference: reference,
        metadata: {
          userId: user.id,
          userRole: user.role,
          type: 'token_purchase',
          tokens: selectedPackage.tokenCount,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          description: `Purchase of ${selectedPackage.tokenCount} FinderTokens - ${selectedPackage.name}`,
          customerName: `${user.firstName} ${user.lastName}`
        },
        redirectUrl: redirectUrl
      });

      console.log(`[TOKEN PURCHASE] Payment initialized successfully for user ${user.id}`);
      res.json(paymentData);

    } catch (error) {
      console.error('[TOKEN PURCHASE] Error:', error);
      res.status(500).json({
        message: "Failed to initialize token purchase",
        error: error.message
      });
    }
  });

  // Verify token purchase
  app.get("/api/tokens/verify/:reference", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { reference } = req.params;
      console.log(`[TOKEN VERIFY] Verifying purchase - Reference: ${reference}`);

      // Initialize Flutterwave service
      const flutterwaveService = new FlutterwaveService();
      if (!flutterwaveService.isConfigured()) {
        return res.status(503).json({ message: "Payment service not configured" });
      }

      // Verify payment with Flutterwave
      const transaction = await flutterwaveService.verifyTransaction(reference);

      if (transaction.status === 'success') {
        // Verify transaction belongs to requesting user
        if (transaction.metadata?.userId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }

        // Check if transaction already processed
        const existingTransaction = await storage.getTransactionByReference(reference);

        if (!existingTransaction) {
          const tokens = transaction.metadata?.tokens || getTokensFromAmount(transaction.amount);

          // Add tokens to user balance
          await storage.addClientFindertokens(
            req.user.userId,
            tokens,
            `FinderToken™ purchase - ${transaction.metadata?.packageName || 'Token Package'}`
          );

          // Create transaction record
          await storage.createTransaction({
            userId: req.user.userId,
            type: 'findertoken_purchase',
            amount: tokens,
            description: `FinderToken™ purchase - ${tokens} tokens`,
            reference: reference
          });

          console.log(`[TOKEN VERIFY] Added ${tokens} tokens to user ${req.user.userId}`);
        }

        res.json({
          status: 'success',
          message: 'Token purchase verified successfully',
          tokens: transaction.metadata?.tokens || getTokensFromAmount(transaction.amount),
          transaction: {
            reference: reference,
            amount: transaction.amount,
            currency: transaction.currency
          }
        });
      } else {
        res.json({
          status: 'failed',
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      console.error('[TOKEN VERIFY] Error:', error);
      res.status(500).json({
        message: "Failed to verify token purchase",
        error: error.message
      });
    }
  });

  // Legacy endpoint for backward compatibility
  app.get("/api/findertokens/flutterwave-packages", (req: Request, res: Response) => {
    res.json(FLUTTERWAVE_TOKEN_PACKAGES);
  });

  // Opay token packages endpoint - REMOVED

  // FinderToken™ Purchase endpoint
  app.post("/api/tokens/purchase", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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

      // Create callback URL for after payment
      const callbackUrl = `${req.protocol}://${req.get('host')}/finder/payment-success?payment=success&reference=${reference}`;

      const transaction = await flutterwaveService.initializePayment({
        email: user.email,
        amount: amount, // Amount in naira
        reference: reference,
        metadata: {
          userId: req.user.userId,
          tokens: tokenAmount,
          package_type: 'findertoken_special'
        },
        redirectUrl: callbackUrl
      });

      res.json(transaction);
    } catch (error) {
      console.error('Token purchase initialization error:', error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });

  // Initialize payment endpoint
  app.post("/api/payments/initialize", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { packageId } = req.body;

      const flutterwaveService = new FlutterwaveService();
      const selectedPackage = FLUTTERWAVE_TOKEN_PACKAGES.find((pkg: any) => pkg.id === packageId);

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
        reference: reference,
        metadata: {
          userId: req.user.userId,
          packageId: packageId,
          tokens: selectedPackage.tokens
        },
        redirectUrl: `${req.protocol}://${req.get('host')}/payment-success`
      });

      res.json(transaction);
    } catch (error) {
      console.error('Payment initialization error:', error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });

  // Initialize Opay payment endpoint - REMOVED

  // Check Flutterwave configuration
  app.get("/api/payments/flutterwave/config", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const flutterwaveService = new FlutterwaveService();
      res.json({
        isConfigured: flutterwaveService.isConfigured(),
        hasSecretKey: !!process.env.FLUTTERWAVE_SECRET_KEY,
        hasPublicKey: !!process.env.FLUTTERWAVE_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Error checking Flutterwave configuration:', error);
      res.status(500).json({ message: "Failed to check Flutterwave configuration" });
    }
  });

  // Initialize Flutterwave payment endpoint
  app.post("/api/payments/flutterwave/initialize", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { packageId, phone, customerName } = req.body;

      const flutterwaveService = new FlutterwaveService();
      const selectedPackage = FLUTTERWAVE_TOKEN_PACKAGES.find((pkg: any) => pkg.id === packageId); // Assuming FLUTTERWAVE_TOKEN_PACKAGES is defined

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
        reference: reference,
        metadata: {
          userId: req.user.userId,
          packageId: packageId,
          tokens: selectedPackage.tokens
        },
        redirectUrl: `${req.protocol}://${req.get('host')}/payment-success`
      });

      res.json(transaction);
    } catch (error) {
      console.error('Flutterwave payment initialization error:', error);
      res.status(500).json({ message: "Failed to initialize Flutterwave payment" });
    }
  });

  // Client token purchase with Flutterwave
  app.post("/api/client/tokens/flutterwave/initialize", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can purchase tokens" });
      }

      const { packageId, phone, customerName } = req.body;
      const flutterwaveService = new FlutterwaveService();

      // Get token packages from storage instead of hardcoded packages
      const tokenPackages = await storage.getActiveTokenPackages();
      const selectedPackage = tokenPackages.find(pkg => pkg.id === packageId);

      if (!selectedPackage) {
        console.log('Available packages:', tokenPackages.map(p => ({ id: p.id, name: p.name })));
        console.log('Requested package ID:', packageId);
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
        reference: reference,
        metadata: {
          userId: req.user.userId,
          packageId: packageId,
          tokens: selectedPackage.tokenCount,
          phone: phone,
          customerName: customerName || `${user.firstName} ${user.lastName}`,
          userRole: 'client'
        },
        redirectUrl: `${req.protocol}://${req.get('host')}/client/payment-success`
      });

      res.json(transaction);
    } catch (error) {
      console.error('Client Flutterwave payment initialization error:', error);
      res.status(500).json({ message: "Failed to initialize Flutterwave payment" });
    }
  });

  // Public client token purchase verification (no auth required for redirect callbacks)
  app.get("/api/client/tokens/flutterwave/verify/:reference", async (req: Request, res: Response) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();

      const transaction = await flutterwaveService.verifyTransaction(reference);

      if (transaction.status === 'success') {
        // Get user ID from transaction metadata since this is a public endpoint
        const userId = transaction.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }

        // Verify this is a client by checking user role
        const user = await storage.getUser(userId);
        if (!user || user.role !== 'client') {
          return res.status(403).json({ message: "Only clients can verify token purchases" });
        }

        // Check if transaction already processed
        const existingTransaction = await storage.getTransactionByReference(reference);

        if (!existingTransaction) {
          // Get tokens from metadata
          const tokens = parseInt(transaction.metadata?.tokens) || Math.floor(transaction.amount / 2.9) || 10;

          // Add tokens to client balance
          await storage.addClientFindertokens(userId, tokens, `FinderToken™ purchase via Flutterwave - ${tokens} tokens`);

          // Create transaction record
          await storage.createTransaction({
            userId: userId,
            type: 'findertoken_purchase',
            amount: tokens,
            description: `FinderToken™ purchase via Flutterwave - ${tokens} tokens`,
            reference: reference
          });

          console.log(`Flutterwave client verification: Added ${tokens} tokens to client ${userId}`);
        } else {
          console.log(`Flutterwave client verification: Transaction ${reference} already processed`);
        }

        res.json({
          status: 'success',
          data: transaction
        });
      } else {
        res.json({
          status: 'failed',
          message: 'Payment was not successful'
        });
      }
    } catch (error) {
      console.error('Client Flutterwave payment verification error:', error);
      res.status(500).json({ message: "Failed to verify Flutterwave payment" });
    }
  });

  // Payment verification endpoint
  app.get("/api/payments/verify/:reference", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();

      const transaction = await flutterwaveService.verifyTransaction(reference);

      if (transaction.status === 'success') {
        const { metadata } = transaction;
        const { userId, tokens } = metadata;

        // Verify this transaction belongs to the requesting user
        if (userId !== req.user.userId) {
          return res.status(403).json({ message: "Access denied" });
        }

        // Update user's findertoken balance if not already done
        const finder = await storage.getFinderByUserId(userId);
        if (finder) {
          // Check if transaction already processed
          const existingTransaction = await storage.getTransactionByReference(reference);

          if (!existingTransaction) {
            // Update balance and create transaction record
            const currentBalance = finder.findertokenBalance || 0;
            await storage.updateFinder(finder.id, {
              findertokenBalance: currentBalance + tokens
            });

            await storage.createTransaction({
              userId: userId,
              finderId: finder.id,
              type: 'findertoken_purchase',
              amount: tokens,
              description: `FinderToken™ purchase - ${tokens} tokens`,
              reference: reference
            });
          }
        }

        res.json({
          status: 'success',
          data: transaction
        });
      } else {
        res.json({
          status: 'failed',
          message: 'Payment was not successful'
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Public Flutterwave payment verification endpoint (no auth required for redirect callbacks)
  app.get("/api/payments/flutterwave/verify/:reference", async (req: Request, res: Response) => {
    try {
      const { reference } = req.params;
      const flutterwaveService = new FlutterwaveService();

      const transaction = await flutterwaveService.verifyTransaction(reference);

      if (transaction.status === 'success') {
        // Get user ID from transaction metadata since this is a public endpoint
        const userId = transaction.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }

        const finder = await storage.getFinderByUserId(userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }

        // Check if transaction already processed
        const existingTransaction = await storage.getTransactionByReference(reference);

        if (!existingTransaction) {
          // Determine tokens from the amount or metadata
          const tokens = parseInt(transaction.metadata?.tokens) || Math.floor(transaction.amount / 2.9) || 10;

          // Update balance and create transaction record
          const currentBalance = finder.findertokenBalance || 0;
          await storage.updateFinder(finder.id, {
            findertokenBalance: currentBalance + tokens
          });

          await storage.createTransaction({
            userId: userId,
            finderId: finder.id,
            type: 'findertoken_purchase',
            amount: tokens,
            description: `FinderToken™ purchase via Flutterwave - ${tokens} tokens`,
            reference: reference
          });

          console.log(`Flutterwave verification: Added ${tokens} tokens to user ${userId}`);
        } else {
          console.log(`Flutterwave verification: Transaction ${reference} already processed`);
        }

        res.json({
          status: 'success',
          data: transaction
        });
      } else {
        res.json({
          status: 'failed',
          message: 'Payment was not successful'
        });
      }
    } catch (error) {
      console.error('Flutterwave payment verification error:', error);
      res.status(500).json({ message: "Failed to verify Flutterwave payment" });
    }
  });

  // Get contract details for order review (used by order-review.tsx)
  app.get("/api/orders/contract/:contractId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { contractId } = req.params;
      console.log('Fetching contract for review:', contractId);

      // Get contract using storage method which is more reliable
      const contractData = await storage.getContract(contractId);

      if (!contractData) {
        console.log('Contract not found:', contractId);
        return res.status(404).json({ message: "Contract not found" });
      }

      console.log('Found contract:', contractData);

      // Verify user has access (client or finder)
      if (req.user.role === 'client' && contractData.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (req.user.role === 'finder') {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder || contractData.finderId !== finder.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      // Get finder details
      const finderData = await storage.getFinder(contractData.finderId);
      let finderUser = null;
      if (finderData) {
        finderUser = await storage.getUser(finderData.userId);
      }

      const finder = finderUser ? {
        id: finderData!.id,
        name: `${finderUser.firstName} ${finderUser.lastName}`,
        email: finderUser.email,
        rating: finderData!.averageRating,
      } : null;

      // Get order submission if exists
      const submission = await storage.getOrderSubmissionByContractId(contractId);

      // Combine all data
      const response = {
        ...contractData,
        finder: finder,
        orderSubmission: submission || null,
      };

      console.log('Returning contract data:', response);
      res.json(response);
    } catch (error) {
      console.error('Error fetching contract for review:', error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });

  // Submit order endpoint
  app.post("/api/orders/submit", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { contractId, submissionText, attachmentPaths } = req.body;
      console.log('Order submission request:', { contractId, submissionText, attachmentPaths });

      if (!contractId) {
        console.log('Missing contract ID');
        return res.status(400).json({ message: "Contract ID is required" });
      }

      // Get contract
      const contract = await storage.getContract(contractId);
      if (!contract) {
        console.log('Contract not found:', contractId);
        return res.status(404).json({ message: "Contract not found" });
      }

      // Verify finder access
      if (req.user.role !== 'finder') {
        console.log('User is not a finder:', req.user.role);
        return res.status(403).json({ message: "Only finders can submit orders" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        console.log('Finder profile not found for user:', req.user.userId);
        return res.status(404).json({ message: "Finder profile not found" });
      }

      if (contract.finderId !== finder.id) {
        console.log('Finder mismatch - finder:', finder.id, 'contract finder:', contract.finderId);
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if contract is funded
      if (contract.escrowStatus !== 'funded') {
        console.log('Contract not funded. Status:', contract.escrowStatus);
        return res.status(400).json({ message: "Contract must be funded before submitting work" });
      }

      // Validate submission content
      if (!submissionText && (!attachmentPaths || attachmentPaths.length === 0)) {
        console.log('No submission content provided');
        return res.status(400).json({ message: "Submission must include text or attachments" });
      }

      // Create or update order submission with finderId included
      const submissionData = {
        contractId,
        finderId: finder.id, // Add finderId from authenticated user's finder profile
        submissionText: submissionText || '',
        attachmentPaths: attachmentPaths || [],
        status: 'submitted' as const,
        submittedAt: new Date()
      };

      console.log('Creating/updating submission with data:', submissionData);
      const submission = await storage.createOrUpdateOrderSubmission(submissionData);

      // Update contract to mark it has a submission
      await storage.updateContract(contractId, { hasSubmission: true });

      // Send notification email to client
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
        console.error('Failed to send order submission email:', emailError);
        // Don't fail the submission if email fails
      }

      console.log('Order submitted successfully:', submission);
      return res.status(200).json({
        success: true,
        message: "Order submitted successfully",
        submission
      });
    } catch (error: any) {
      console.error('Order submission error:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        message: "Failed to submit order",
        error: error.message || "Unknown error occurred"
      });
    }
  });

  // Review order submission (accept/reject)
  app.put("/api/orders/submission/:submissionId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { submissionId } = req.params;
      const { status, clientFeedback } = req.body;

      console.log('Review submission request:', { submissionId, status, clientFeedback });

      // Validate status
      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'" });
      }

      // Get submission
      const submission = await storage.updateOrderSubmission(submissionId, {
        status,
        clientFeedback,
        reviewedAt: new Date()
      });

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Get contract to verify access
      const contract = await storage.getContract(submission.contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Verify user is the client
      if (req.user.role !== 'client' || contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Only the client can review submissions" });
      }

      // If accepted, mark contract as completed and release payment
      if (status === 'accepted') {
        console.log(`Accepting order for contract ${contract.id}, amount: ${contract.amount}, finder: ${contract.finderId}`);

        // Release funds to finder FIRST
        console.log(`Releasing funds: ${contract.amount} to finder ${contract.finderId}`);
        await storage.releaseFundsToFinder(contract.finderId, contract.amount.toString());
        console.log(`Funds released to finder ${contract.finderId}`);

        // Then update contract status
        await storage.updateContract(contract.id, {
          isCompleted: true,
          completedAt: new Date(),
          escrowStatus: 'released'
        });

        console.log(`Contract ${contract.id} updated to completed and released`);

        // Send notification email to finder
        try {
          const finder = await storage.getFinder(contract.finderId);
          if (finder) {
            const finderUser = await storage.getUser(finder.userId);
            const clientUser = await storage.getUser(req.user.userId);
            if (finderUser && clientUser) {
              await emailService.notifyFinderOrderAccepted(
                finderUser.email,
                `${clientUser.firstName} ${clientUser.lastName}`,
                contract.amount
              );
            }
          }
        } catch (emailError) {
          console.error('Failed to send order acceptance email:', emailError);
        }
      }

      res.json({
        success: true,
        message: status === 'accepted' ? "Order accepted successfully" : "Order rejected - finder can resubmit",
        submission
      });
    } catch (error: any) {
      console.error('Review submission error:', error);
      res.status(500).json({
        message: "Failed to review submission",
        error: error.message || "Unknown error occurred"
      });
    }
  });

  // Public contract payment verification endpoint (no auth required for redirect callbacks)
  app.get("/api/contracts/:contractId/verify-payment/:reference", async (req: Request, res: Response) => {
    try {
      const { contractId, reference } = req.params;

      // Get contract details
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Verify payment with Flutterwave
      const flutterwaveService = new FlutterwaveService();
      const verification = await flutterwaveService.verifyTransaction(reference);

      if (verification.status === 'success') {
        // Get user ID from transaction metadata since this is a public endpoint
        const userId = verification.metadata?.userId;
        if (!userId) {
          return res.status(400).json({ message: "Transaction metadata missing user ID" });
        }

        // Verify user is the client for this contract
        if (contract.clientId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }

        // Check if this payment was already processed
        const existingTransaction = await storage.getTransactionByReference(reference);

        if (!existingTransaction) {
          // Update contract status to funded
          await storage.updateContract(contractId, {
            escrowStatus: 'funded'
          });

          // Create transaction record
          await storage.createTransaction({
            userId: userId,
            type: 'contract_payment',
            amount: parseFloat(verification.amount),
            description: `Contract payment for contract ${contractId}`,
            reference: reference
          });

          console.log(`Contract ${contractId} payment verified and funded`);
        }

        res.json({
          status: 'success',
          message: 'Payment verified and contract funded',
          contract: await storage.getContract(contractId)
        });
      } else {
        res.json({
          status: 'failed',
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      console.error('Contract payment verification error:', error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Flutterwave webhook endpoint
  app.post("/api/payments/flutterwave/webhook", express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    try {
      const flutterwaveService = new FlutterwaveService();

      const signature = req.headers['verif-hash'] as string;
      const payload = req.body.toString();

      console.log('Flutterwave webhook received:', {
        signature: signature ? 'present' : 'missing',
        payloadLength: payload.length,
        headers: Object.keys(req.headers)
      });

      if (!flutterwaveService.verifyWebhookSignature(payload, signature)) {
        console.log('Invalid Flutterwave webhook signature - proceeding anyway for debugging');
        // For debugging purposes, continue processing even with invalid signature
        // return res.status(400).send('Invalid signature');
      }

      let event;
      try {
        event = JSON.parse(payload);
      } catch (parseError) {
        console.error('Failed to parse webhook payload:', parseError);
        return res.status(400).send('Invalid JSON payload');
      }
      
      console.log('Flutterwave webhook event received:', event.event, event.data?.status);

      if (event.event === 'charge.completed' && event.data.status === 'successful') {
        const { tx_ref, amount, meta } = event.data;
        const { userId, tokens, userRole, type, contractId } = meta || {};

        console.log('Processing successful charge:', {
          tx_ref,
          amount,
          userId,
          tokens,
          userRole,
          type,
          contractId
        });

        if (!userId) {
          console.log('Missing userId in Flutterwave webhook metadata');
          return res.status(400).send('Missing userId in metadata');
        }

        // Check if transaction already processed
        const existingTransaction = await storage.getTransactionByReference(tx_ref);

        if (!existingTransaction) {
          console.log('Transaction not processed yet, proceeding with payment processing');
          
          // Handle different payment types
          if (type === 'contract_payment' && contractId) {
            // Handle contract payment
            console.log(`Processing contract payment: ${contractId} for user ${userId}`);

            try {
              // Find and update the contract
              const contract = await storage.getContract(contractId);
              if (contract && contract.clientId === userId) {
                await storage.updateContract(contractId, {
                  escrowStatus: 'funded',
                  isCompleted: false
                });

                // Create transaction record for contract payment
                await storage.createTransaction({
                  userId: userId,
                  type: 'contract_payment',
                  amount: amount,
                  description: `Contract funding via Flutterwave - Contract ${contractId}`,
                  reference: tx_ref
                });

                console.log(`Flutterwave webhook: Contract ${contractId} funded with ${amount} NGN`);
              } else {
                console.log(`Flutterwave webhook: Contract ${contractId} not found or access denied`);
                console.log(`Contract exists: ${!!contract}, Client ID match: ${contract?.clientId === userId}`);
              }
            } catch (contractError) {
              console.error('Error processing contract payment:', contractError);
            }
          } else if (tokens) {
            // Handle token purchase
            console.log(`Processing token purchase: ${tokens} tokens for user ${userId} with role ${userRole}`);
            
            if (userRole === 'client') {
              // Handle client token purchase
              try {
                await storage.addClientFindertokens(userId, tokens, `FinderToken™ purchase via Flutterwave - ${tokens} tokens`);

                await storage.createTransaction({
                  userId: userId,
                  type: 'findertoken_purchase',
                  amount: tokens,
                  description: `FinderToken™ purchase via Flutterwave - ${tokens} tokens`,
                  reference: tx_ref
                });

                console.log(`Flutterwave webhook: Added ${tokens} tokens to client ${userId}`);
              } catch (clientError) {
                console.error('Error processing client token purchase:', clientError);
              }
            } else {
              // Handle finder token purchase
              const finder = await storage.getFinderByUserId(userId);
              if (finder) {
                const currentBalance = finder.findertokenBalance || 0;
                await storage.updateFinder(finder.id, {
                  findertokenBalance: currentBalance + tokens
                });

                await storage.createTransaction({
                  userId: userId,
                  finderId: finder.id,
                  type: 'findertoken_purchase',
                  amount: tokens,
                  description: `FinderToken™ purchase via Flutterwave - ${tokens} tokens`,
                  reference: tx_ref
                });

                console.log(`Flutterwave webhook: Added ${tokens} tokens to finder ${userId}`);
              } else {
                console.log(`Flutterwave webhook: Finder not found for user ${userId}`);
              }
            }
          } else {
            console.log('Flutterwave webhook: No tokens or contract info in metadata');
          }
        } else {
          console.log(`Flutterwave webhook: Transaction ${tx_ref} already processed`);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Flutterwave webhook error:', error);
      res.status(500).send('Error processing Flutterwave webhook');
    }
  });


  // --- Admin Token Package Management ---
  // Get all token packages
  app.get("/api/admin/token-packages", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const packages = await storage.getAllTokenPackages();
      res.json(packages);
    } catch (error) {
      console.error('Failed to fetch token packages:', error);
      res.status(500).json({ message: "Failed to fetch token packages" });
    }
  });

  // Create token package
  app.post("/api/admin/token-packages", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
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
        isActive: isActive !== undefined ? isActive : true
      };

      const tokenPackage = await storage.createTokenPackage(packageData);
      
      res.status(201).json(tokenPackage);
    } catch (error) {
      console.error('Failed to create token package:', error);
      res.status(500).json({ message: "Failed to create token package" });
    }
  });

  // Update token package
  app.put("/api/admin/token-packages/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price, tokenCount, isActive } = req.body;

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = price.toString();
      if (tokenCount !== undefined) updates.tokenCount = parseInt(tokenCount);
      if (isActive !== undefined) updates.isActive = isActive;

      const tokenPackage = await storage.updateTokenPackage(id, updates);
      
      if (!tokenPackage) {
        return res.status(404).json({ message: "Token package not found" });
      }

      res.json(tokenPackage);
    } catch (error) {
      console.error('Failed to update token package:', error);
      res.status(500).json({ message: "Failed to update token package" });
    }
  });

  // Delete token package
  app.delete("/api/admin/token-packages/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      const success = await storage.deleteTokenPackage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Token package not found" });
      }

      res.json({ message: "Token package deleted successfully" });
    } catch (error) {
      console.error('Failed to delete token package:', error);
      res.status(500).json({ message: "Failed to delete token package" });
    }
  });

  // --- Admin Token Grant Management ---
  // Get all token grants
  app.get("/api/admin/token-grants", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Use the existing getTokenGrants function which returns both finder and client grants
      const allGrants = await storage.getTokenGrants();
      
      res.json(allGrants);
    } catch (error) {
      console.error('Failed to fetch token grants:', error);
      res.status(500).json({ message: "Failed to fetch token grants" });
    }
  });

  // Grant tokens to finder or client
  app.post("/api/admin/grant-tokens", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId, userType, amount, reason } = req.body;

      if (!userId || !userType || !amount || !reason) {
        return res.status(400).json({ message: "User ID, user type, amount, and reason are required" });
      }

      if (userType !== 'finder' && userType !== 'client') {
        return res.status(400).json({ message: "User type must be either 'finder' or 'client'" });
      }

      const grantAmount = parseInt(amount);
      if (isNaN(grantAmount) || grantAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
      }

      let grant;
      if (userType === 'finder') {
        // Verify finder exists
        const finder = await storage.getFinderByUserId(userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder not found" });
        }
        grant = await storage.grantTokensToFinder(finder.id, grantAmount, reason, req.user.userId);
      } else {
        // Verify client exists
        const client = await storage.getUser(userId);
        if (!client || client.role !== 'client') {
          return res.status(404).json({ message: "Client not found" });
        }
        grant = await storage.grantTokensToClient(userId, grantAmount, reason, req.user.userId);
      }

      res.status(201).json({ message: "Tokens granted successfully", grant });
    } catch (error) {
      console.error('Failed to grant tokens:', error);
      res.status(500).json({ message: "Failed to grant tokens" });
    }
  });

  // --- Client Contracts ---
  // Client-specific contracts endpoint
  app.get("/api/client/contracts", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view contracts" });
      }

      const contracts = await storage.getContractsByClientId(req.user.userId);
      res.json(contracts);
    } catch (error) {
      console.error('Failed to fetch client contracts:', error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // Get specific contract details for client
  app.get("/api/client/contracts/:contractId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can view contract details" });
      }

      const { contractId } = req.params;
      const contracts = await storage.getContractsByClientId(req.user.userId);
      const contract = contracts.find(c => c.id === contractId);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found or access denied" });
      }

      res.json(contract);
    } catch (error) {
      console.error('Failed to fetch contract details:', error);
      res.status(500).json({ message: "Failed to fetch contract details" });
    }
  });

  // Contract routes
  app.get("/api/contracts/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      let contracts;
      if (req.user.role === 'client') {
        contracts = await storage.getContractsByClientId(req.user.userId);
      } else if (req.user.role === 'finder') {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }
        contracts = await storage.getContractsByFinderId(finder.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.post("/api/contracts/:id/complete", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const contract = await storage.getContract(id);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Only the finder can mark as complete
      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder || contract.finderId !== finder.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update contract status
      await db.update(contracts)
        .set({
          isCompleted: true,
          escrowStatus: 'completed',
          completedAt: new Date()
        })
        .where(eq(contracts.id, id));

      // Update finder's jobsCompleted count
      const completedCount = await db
        .select()
        .from(contracts)
        .where(eq(contracts.finderId, contract.finderId))
        .where(eq(contracts.isCompleted, true));

      await db
        .update(finders)
        .set({ jobsCompleted: completedCount.length })
        .where(eq(finders.id, contract.finderId));

      res.json({ message: "Contract marked as complete" });
    } catch (error) {
      res.status(500).json({ message: "Failed to complete contract" });
    }
  });

  app.post("/api/contracts/:id/release-payment", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const contract = await storage.getContract(id);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Only the client can release payment
      if (contract.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if already released
      if (contract.escrowStatus === 'released') {
        return res.status(400).json({ message: "Payment has already been released" });
      }

      await storage.updateContract(id, { escrowStatus: 'released' });

      // Release funds to finder's available balance
      await storage.releaseFundsToFinder(contract.finderId, contract.amount.toString());

      res.json({ message: "Payment released successfully" });
    } catch (error) {
      console.error('Release payment error:', error);
      res.status(500).json({ message: "Failed to release payment" });
    }
  });

  // Contract dispute endpoint
  app.post("/api/contracts/:id/dispute", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const contractId = req.params.id;
      const { type, description, evidence } = req.body;

      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Verify that the user is either the client or finder
      const isClient = contract.clientId === req.user.userId;
      const finder = await storage.getFinderByUserId(req.user.userId);
      const isFinder = finder && contract.finderId === finder.id;

      if (!isClient && !isFinder) {
        return res.status(403).json({ message: "Only contract participants can submit disputes" });
      }

      // Create the dispute
      const dispute = await storage.createDispute({
        userId: req.user.userId,
        contractId: contractId,
        type: type || 'contract_dispute',
        description,
        evidence: evidence || null,
        status: 'pending'
      });

      // Get user details for admin notification
      const user = await storage.getUser(req.user.userId);
      const adminUsers = await storage.getAllUsers();
      const admins = adminUsers.filter(u => u.role === 'admin');

      // Notify all admins about the new dispute
      try {
        for (const admin of admins) {
          await emailService.notifyAdminNewDispute(
            admin.email,
            dispute.id,
            user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            type || 'contract_dispute',
            description
          );
        }
      } catch (emailError) {
        console.error('Failed to send admin dispute notifications:', emailError);
      }

      res.status(201).json({
        message: "Dispute submitted successfully. An administrator will review your case.",
        dispute
      });
    } catch (error) {
      console.error('Dispute submission error:', error);
      res.status(500).json({ message: "Failed to submit dispute" });
    }
  });

  // --- Review Routes ---
  app.post("/api/reviews", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can leave reviews" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        clientId: req.user.userId
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create review", error: error.message });
    }
  });

  // --- Findertoken Routes ---
  app.get("/api/findertokens/balance", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
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

  app.get("/api/transactions/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can view transactions" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const transactions = await storage.getTransactionsByFinderId(finder.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // --- Admin Contact Settings ---
  app.get("/api/admin/contact-settings", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings);
    } catch (error) {
      console.error('Failed to fetch contact settings:', error);
      res.status(500).json({ message: "Failed to fetch contact settings" });
    }
  });

  app.put("/api/admin/contact-settings", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = req.body;
      const updated = await storage.updateContactSettings(settings);
      res.json(updated);
    } catch (error) {
      console.error('Failed to update contact settings:', error);
      res.status(500).json({ message: "Failed to update contact settings" });
    }
  });

  // --- Admin Categories Management ---
  // Admin: Get all categories
  app.get("/api/admin/categories", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Admin: Create category
  app.post("/api/admin/categories", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const category = await storage.createCategory({
        name,
        description: description || '',
        isActive: true
      });

      res.status(201).json(category);
    } catch (error: any) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
  });

  // Admin: Update category
  app.put("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const category = await storage.updateCategory(id, updates);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  // Admin: Delete category
  app.delete("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);

      if (!success) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // --- Public Categories ---
  // Public categories endpoint for forms (finder/client categories)
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getActiveCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Public FAQ categories endpoint (alias for /api/public/faq-categories)
  app.get("/api/public/categories", async (req: Request, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const categories = await db
        .select()
        .from(faqCategories)
        .where(eq(faqCategories.isActive, true))
        .orderBy(faqCategories.sortOrder);

      res.json(categories);
    } catch (error) {
      console.error('Error fetching public FAQ categories:', error);
      res.status(500).json({ error: 'Failed to fetch FAQ categories' });
    }
  });

  // --- Admin Routes ---
  app.get("/api/admin/finder-profile/:userId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
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
      console.error('Failed to fetch finder profile:', error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });

  // Get finder profile by name slug (for name-based URLs)
  app.get("/api/admin/finder-profile/by-slug/:nameSlug", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { nameSlug } = req.params;

      // Extract the ID part from the name slug (last 8 characters)
      const match = nameSlug.match(/([a-f0-9]{8})$/);
      if (!match) {
        return res.status(400).json({ message: "Invalid name slug format" });
      }

      const idPrefix = match[1];

      // Get all users and find the one with matching ID prefix
      const users = await storage.getAllUsers();
      const user = users.find(u => u.id.startsWith(idPrefix));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the finder profile for this user
      const finder = await storage.getFinderByUserId(user.id);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }

      // Remove password from user data
      const { password, ...userWithoutPassword } = user;
      res.json({ ...finder, user: userWithoutPassword });
    } catch (error) {
      console.error('Error fetching finder profile by slug:', error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });

  app.get("/api/admin/finds", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const finds = await storage.getAllFinds();
      res.json(finds);
    } catch (error) {
      console.error('Failed to fetch admin finds:', error);
      res.status(500).json({ message: "Failed to fetch finds" });
    }
  });

  app.get("/api/admin/proposals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      console.error('Failed to fetch admin proposals:', error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get("/api/admin/users", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get specific user by ID (for admin profile viewing)
  app.get("/api/admin/users/:userId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by name slug (for name-based URLs)
  app.get("/api/admin/users/by-slug/:nameSlug", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { nameSlug } = req.params;

      // Extract the ID part from the name slug (last 8 characters)
      const match = nameSlug.match(/([a-f0-9]{8})$/);
      if (!match) {
        return res.status(400).json({ message: "Invalid name slug format" });
      }

      const idPrefix = match[1];

      // Get all users and find the one with matching ID prefix
      const users = await storage.getAllUsers();
      const user = users.find(u => u.id.startsWith(idPrefix));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user by slug:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/admin/users/:id/ban", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || typeof reason !== 'string' || !reason.trim()) {
        return res.status(400).json({ message: "Ban reason is required" });
      }

      const user = await storage.updateUser(id, { isBanned: true });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User banned successfully", user: { ...user, password: undefined } });
    } catch (error) {
      console.error('Ban user error:', error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });

  app.post("/api/admin/users/:id/unban", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const user = await storage.updateUser(id, { isBanned: false });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User unbanned successfully", user: { ...user, password: undefined } });
    } catch (error) {
      console.error('Unban user error:', error);
      res.status(500).json({ message: "Failed to unban user" });
    }
  });

  app.get("/api/admin/settings/:key", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { key } = req.params;
      const setting = await storage.getAdminSetting(key);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { key, value } = req.body;
      const setting = await storage.setAdminSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // File upload routes for messaging
  app.post("/api/messages/upload", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Failed to get upload URL:', error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  app.post("/api/messages/attach", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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
          visibility: "private", // Message attachments are private
        }
      );

      res.json({
        objectPath,
        fileName,
        success: true
      });
    } catch (error) {
      console.error('Failed to set file ACL:', error);
      res.status(500).json({ message: "Failed to process file attachment" });
    }
  });

  // Serve private message attachments
  app.get("/objects/:objectPath(*)", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);

      // Check if user can access this file
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: req.user.id,
        requestedPermission: ObjectPermission.READ,
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

  // --- Messaging Routes ---
  // Only clients can initiate conversations
  app.post('/api/messages/conversations', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { proposalId } = req.body;
      console.log('Create conversation request:', { proposalId, userId: req.user.userId });

      if (!proposalId) {
        return res.status(400).json({ message: 'Proposal ID is required' });
      }

      // Check if conversation already exists for this proposal
      const existingConversation = await storage.getConversationByProposal(proposalId);
      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation.id);
        return res.json(existingConversation);
      }

      // Get proposal details to validate and get participant IDs
      const proposal = await storage.getProposal(proposalId);
      if (!proposal) {
        console.error('Proposal not found:', proposalId);
        return res.status(404).json({ message: 'Proposal not found' });
      }

      // Get the find to get the client ID
      const find = await storage.getFind(proposal.findId);
      if (!find) {
        console.error('Find not found for proposal:', proposalId);
        return res.status(404).json({ message: 'Find not found' });
      }

      // Verify user is authorized (either client or finder)
      if (req.user.role === 'client' && find.clientId !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (req.user.role === 'finder') {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder || proposal.finderId !== finder.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      // Create new conversation
      const conversation = await storage.createConversation({
        clientId: find.clientId,
        finderId: proposal.finderId,
        proposalId: proposalId
      });

      console.log('Created conversation:', conversation);
      res.json(conversation);
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ message: 'Failed to create conversation', error: error.message });
    }
  });

  // Get conversations for logged-in user (client or finder)
  app.get("/api/messages/conversations", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let conversations;

      if (req.user.role === 'client') {
        conversations = await storage.getConversationsByClientId(req.user.userId);
      } else if (req.user.role === 'finder') {
        const finder = await storage.getFinderByUserId(req.user.userId);
        if (!finder) {
          return res.status(404).json({ message: "Finder profile not found" });
        }
        conversations = await storage.getConversationsByFinderId(finder.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get a specific conversation by ID
  app.get("/api/messages/conversations/:conversationId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { conversationId } = req.params;

      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // TODO: Add permission check to ensure user is part of the conversation

      res.json(conversation);
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/messages/conversations/:conversationId/messages", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { conversationId } = req.params;

      // Prevent caching of messages
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      // TODO: Add permission check to ensure user is part of the conversation
      const messages = await storage.getMessages(conversationId);

      // Mark messages as read for the current user
      await storage.markMessagesAsRead(conversationId, req.user.userId);

      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message
  app.post("/api/messages/conversations/:conversationId/messages", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { content, attachmentPaths, attachmentNames, quotedMessageId } = req.body;

      if ((!content || content.trim().length === 0) && (!attachmentPaths || attachmentPaths.length === 0)) {
        return res.status(400).json({ message: "Message content or attachments are required" });
      }

      // Get conversation details for email notification
      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const message = await storage.createMessage({
        conversationId,
        senderId: req.user.userId,
        content: content ? content.trim() : '',
        attachmentPaths: attachmentPaths || [],
        attachmentNames: attachmentNames || [],
        quotedMessageId,
      });

      // Send email notification to the recipient
      try {
        const senderUser = await storage.getUser(req.user.userId);
        const proposal = await storage.getProposal(conversation.proposalId);
        const request = proposal ? await storage.getFind(proposal.findId) : null;

        if (senderUser && request) {
          // Determine recipient based on sender role
          let recipientUserId: string;
          if (req.user.role === 'client') {
            // Client is sending message to finder
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
          } else if (req.user.role === 'finder') {
            // Finder is sending message to client
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
        console.error('Failed to send message notification email:', emailError);
      }

      res.json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get finder profile by ID
  app.get("/api/finders/:finderId/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { finderId } = req.params;

      const finderProfile = await storage.getFinderProfile(finderId);

      if (!finderProfile) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      res.json(finderProfile);
    } catch (error) {
      console.error('Get finder profile error:', error);
      res.status(500).json({ message: "Failed to fetch finder profile" });
    }
  });

  // --- Financial Dashboard ---
  app.get("/api/admin/transactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Get all transactions with user details
      const transactions = await storage.getAllTransactionsWithUsers();
      res.json(transactions);
    } catch (error) {
      console.error('Failed to fetch admin transactions:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/withdrawals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Get all withdrawal requests with finder details
      const withdrawals = await storage.getWithdrawalRequests();
      res.json(withdrawals);
    } catch (error) {
      console.error('Failed to fetch admin withdrawals:', error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.get("/api/admin/contracts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Get all contracts with client and finder details plus transaction info
      const contracts = await storage.getAllContractsWithTransactions();
      res.json(contracts);
    } catch (error) {
      console.error('Failed to fetch admin contracts:', error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // Admin cancel contract endpoint
  app.post("/api/admin/contracts/:contractId/cancel", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { contractId } = req.params;

      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Only allow cancelling funded contracts that aren't completed
      if (contract.escrowStatus !== 'funded' || contract.isCompleted) {
        return res.status(400).json({
          message: "Can only cancel funded contracts that are not completed"
        });
      }

      // Update contract status to cancelled
      await storage.updateContract(contractId, {
        escrowStatus: 'cancelled',
        isCompleted: true,
        completedAt: new Date()
      });

      // Refund client by adding tokens back
      await storage.addClientFindertokens(
        contract.clientId,
        parseFloat(contract.amount),
        `Contract cancellation refund - Contract ${contractId}`
      );

      // Send notification emails
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

        // Notify admin about the cancellation
        if (adminUser) {
          const clientName = clientUser ? `${clientUser.firstName} ${clientUser.lastName}` : 'Unknown';
          const finderName = finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : 'Unknown';
          await emailService.notifyAdminContractCancellation(
            adminUser.email,
            contractId,
            clientName,
            finderName,
            contract.amount,
            req.body.reason || 'No reason provided'
          );
        }
      } catch (emailError) {
        console.error('Failed to send cancellation emails:', emailError);
      }

      res.json({
        message: "Contract cancelled successfully and client refunded",
        contract: await storage.getContract(contractId)
      });
    } catch (error) {
      console.error('Contract cancellation error:', error);
      res.status(500).json({ message: "Failed to cancel contract" });
    }
  });

  // Admin endpoint to get all disputes
  app.get("/api/admin/disputes", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const disputes = await storage.getAllDisputes();

      // Enrich disputes with user and contract information
      const enrichedDisputes = await Promise.all(disputes.map(async (dispute) => {
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
      console.error('Failed to fetch disputes:', error);
      res.status(500).json({ message: "Failed to fetch disputes" });
    }
  });

  // Admin endpoint to complete a contract
  app.post("/api/admin/contracts/:contractId/complete", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { contractId } = req.params;

      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Only allow completing funded contracts
      if (contract.escrowStatus !== 'funded') {
        return res.status(400).json({
          message: "Can only complete funded contracts"
        });
      }

      if (contract.isCompleted) {
        return res.status(400).json({
          message: "Contract is already completed"
        });
      }

      // Update contract to completed and release escrow
      await storage.updateContract(contractId, {
        isCompleted: true,
        completedAt: new Date(),
        escrowStatus: 'released'
      });

      // Get finder details
      const finder = await storage.getFinder(contract.finderId);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }

      // Release funds to finder (95% after platform fee)
      const platformFeePercentage = 5;
      const grossAmount = parseFloat(contract.amount);
      const feeAmount = (grossAmount * platformFeePercentage) / 100;
      const netAmount = grossAmount - feeAmount;

      await storage.releaseFundsToFinder(contract.finderId, netAmount.toString());

      // Update finder stats
      const currentJobsCompleted = finder.jobsCompleted || 0;
      await storage.updateFinder(contract.finderId, {
        jobsCompleted: currentJobsCompleted + 1
      });

      // Send notification emails
      try {
        const clientUser = await storage.getUser(contract.clientId);
        const finderUser = finder ? await storage.getUser(finder.userId) : null;

        if (finderUser) {
          await emailService.notifyFinderSubmissionApproved(
            finderUser.email,
            clientUser ? `${clientUser.firstName} ${clientUser.lastName}` : 'Client',
            'Work on contract',
            netAmount.toFixed(2)
          );
        }

        if (clientUser) {
          await emailService.notifyClientSubmissionApproved(
            clientUser.email,
            finderUser ? `${finderUser.firstName} ${finderUser.lastName}` : 'Finder',
            'Work on contract'
          );
        }
      } catch (emailError) {
        console.error('Failed to send completion emails:', emailError);
      }

      res.json({
        message: "Contract completed successfully and funds released to finder",
        contract: await storage.getContract(contractId)
      });
    } catch (error) {
      console.error('Contract completion error:', error);
      res.status(500).json({ message: "Failed to complete contract" });
    }
  });

  // Admin endpoint to manually release funds for a completed contract
  app.post("/api/admin/contracts/:contractId/release-funds", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { contractId } = req.params;

      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Check if contract is completed and marked as released
      if (!contract.isCompleted) {
        return res.status(400).json({
          message: "Contract must be completed before funds can be released"
        });
      }

      if (contract.escrowStatus !== 'released') {
        return res.status(400).json({
          message: "Contract escrow status must be 'released'"
        });
      }

      // Get finder details
      const finder = await storage.getFinder(contract.finderId);
      if (!finder) {
        return res.status(404).json({ message: "Finder not found" });
      }

      const beforeBalance = parseFloat(finder.availableBalance || '0');

      // Release funds to finder
      await storage.releaseFundsToFinder(contract.finderId, contract.amount);

      // Get updated finder details
      const updatedFinder = await storage.getFinder(contract.finderId);
      const afterBalance = parseFloat(updatedFinder?.availableBalance || '0');

      res.json({
        message: "Funds released successfully to finder's available balance",
        contract: await storage.getContract(contractId),
        finder: {
          id: finder.id,
          beforeBalance: beforeBalance.toFixed(2),
          afterBalance: afterBalance.toFixed(2),
          amountReleased: contract.amount
        }
      });
    } catch (error) {
      console.error('Manual fund release error:', error);
      res.status(500).json({ message: "Failed to release funds", error: error.message });
    }
  });


  // --- Support Agent Management Routes ---
  app.get("/api/admin/support-agents", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const agents = await storage.getSupportAgents();
      res.json(agents);
    } catch (error) {
      console.error('Failed to fetch support agents:', error);
      res.status(500).json({ message: "Failed to fetch support agents" });
    }
  });

  app.post("/api/admin/support-agents", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { email, firstName, lastName, department, permissions, maxTicketsPerDay, responseTimeTarget, specializations, languages } = req.body;

      // Validate required fields
      if (!email || !firstName || !lastName || !department || !permissions || permissions.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);

      if (!user) {
        // Create new user for the support agent
        const userData = {
          email,
          firstName,
          lastName,
          role: 'support_agent',
          password: await bcrypt.hash('temppassword123', 10), // Temporary password
          isVerified: true
        };

        user = await storage.createUser(userData);
      } else {
        // Check if user is already a support agent
        const existingAgent = await storage.getUserSupportAgent(user.id);
        if (existingAgent) {
          return res.status(400).json({ message: "User is already a support agent" });
        }
      }

      // Generate agent ID
      const agentId = await storage.generateAgentId();

      // Create support agent
      const agentData = {
        userId: user.id,
        agentId,
        department,
        permissions,
        maxTicketsPerDay: maxTicketsPerDay || 20,
        responseTimeTarget: responseTimeTarget || 24,
        specializations: specializations || [],
        languages: languages || ['en'],
        assignedBy: req.user.userId
      };

      const agent = await storage.createSupportAgent(agentData);
      res.status(201).json(agent);
    } catch (error: any) {
      console.error('Create support agent error:', error);
      res.status(400).json({ message: "Failed to create support agent", error: error.message });
    }
  });

  app.put("/api/admin/support-agents/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const updates = req.body;

      const agent = await storage.updateSupportAgent(id, updates);
      if (!agent) {
        return res.status(404).json({ message: "Support agent not found" });
      }

      res.json(agent);
    } catch (error: any) {
      console.error('Update support agent error:', error);
      res.status(400).json({ message: "Failed to update support agent", error: error.message });
    }
  });

  app.post("/api/admin/support-agents/:id/suspend", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
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
    } catch (error: any) {
      console.error('Suspend support agent error:', error);
      res.status(400).json({ message: "Failed to suspend support agent", error: error.message });
    }
  });

  app.post("/api/admin/support-agents/:id/reactivate", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;

      const agent = await storage.reactivateSupportAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Support agent not found" });
      }

      res.json(agent);
    } catch (error: any) {
      console.error('Reactivate support agent error:', error);
      res.status(400).json({ message: "Failed to reactivate support agent", error: error.message });
    }
  });

  app.delete("/api/admin/support-agents/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;

      const success = await storage.deleteSupportAgent(id);
      if (!success) {
        return res.status(404).json({ message: "Support agent not found" });
      }

      res.json({ message: "Support agent deleted successfully" });
    } catch (error: any) {
      console.error('Delete support agent error:', error);
      res.status(400).json({ message: "Failed to delete support agent", error: error.message });
    }
  });

  // --- Support Department Management ---
  app.get('/api/admin/support-departments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const departments = await storage.getSupportDepartments();
      res.json(departments);
    } catch (error: any) {
      console.error('Error fetching support departments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/admin/support-departments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { name, description, color, maxResponseTime } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Department name is required' });
      }

      const department = await storage.createSupportDepartment({
        name,
        description,
        color: color || '#3B82F6',
        maxResponseTime: maxResponseTime || 24,
        isActive: true,
        autoAssignments: true,
      });

      res.status(201).json(department);
    } catch (error: any) {
      console.error('Error creating support department:', error);
      res.status(500).json({ message: 'Failed to create support department' });
    }
  });

  // --- Restricted Words Management ---
  // Admin find status management
  app.put('/api/admin/finds/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['open', 'in_progress', 'completed', 'cancelled', 'under_review'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Get the find to ensure it exists
      const find = await storage.getFind(id);
      if (!find) {
        return res.status(404).json({ message: 'Find not found' });
      }

      // Update find status
      const updatedFind = await storage.updateFind(id, { status });
      res.json(updatedFind);
    } catch (error) {
      console.error('Error updating find status:', error);
      res.status(500).json({ message: 'Failed to update find status' });
    }
  });

  // --- Strike system endpoints ---
  app.get('/api/offenses/:role', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { role } = req.params;

      // Predefined offenses for different user roles
      const offenseTypes = {
        client: [
          { offense: 'Misleading Request Description', strikeLevel: 1, applicableRoles: ['client'], resolution: 'Warning and request clarification' },
          { offense: 'Inappropriate Content in Request', strikeLevel: 2, applicableRoles: ['client'], resolution: 'Content removal and warning' },
          { offense: 'Non-payment or Payment Disputes', strikeLevel: 2, applicableRoles: ['client'], resolution: 'Payment resolution required' },
          { offense: 'Harassment of Finders', strikeLevel: 3, applicableRoles: ['client'], resolution: 'Immediate account review' },
          { offense: 'Fraudulent Activity', strikeLevel: 3, applicableRoles: ['client'], resolution: 'Account suspension' }
        ],
        finder: [
          { offense: 'Low Quality or Incomplete Proposals', strikeLevel: 1, applicableRoles: ['finder'], resolution: 'Training and guidance provided' },
          { offense: 'Missing Deadlines Without Communication', strikeLevel: 1, applicableRoles: ['finder'], resolution: 'Communication improvement required' },
          { offense: 'Inappropriate Communication', strikeLevel: 2, applicableRoles: ['finder'], resolution: 'Communication standards training' },
          { offense: 'Delivering Substandard Work', strikeLevel: 2, applicableRoles: ['finder'], resolution: 'Quality standards review' },
          { offense: 'Fraudulent Claims or Credentials', strikeLevel: 3, applicableRoles: ['finder'], resolution: 'Account verification required' },
          { offense: 'Harassment of Clients', strikeLevel: 3, applicableRoles: ['finder'], resolution: 'Immediate account review' }
        ]
      };

      const roleOffenses = offenseTypes[role as keyof typeof offenseTypes] || [];
      res.json(roleOffenses);
    } catch (error) {
      console.error('Error fetching offense types:', error);
      res.status(500).json({ message: 'Failed to fetch offense types' });
    }
  });

  app.post('/api/admin/strikes', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { userId, offenseType, evidence, userRole, contextId } = req.body;

      if (!userId || !offenseType || !evidence || !userRole) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // For now, we'll just return a success response
      // In a full implementation, this would save to database
      const strike = {
        id: Date.now().toString(),
        userId,
        offenseType,
        evidence,
        userRole,
        contextId,
        issuedBy: req.user.id,
        issuedAt: new Date().toISOString(),
        status: 'active'
      };

      res.status(201).json(strike);
    } catch (error) {
      console.error('Error issuing strike:', error);
      res.status(500).json({ message: 'Failed to issue strike' });
    }
  });

  app.get('/api/admin/restricted-words', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }

      console.log('Fetching restricted words...');
      const words = await storage.getRestrictedWords();
      console.log('Retrieved restricted words:', words.length, 'words found');
      res.json(words);
    } catch (error: any) {
      console.error('Error fetching restricted words:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/admin/restricted-words', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }

      const { word, category, severity } = req.body;
      console.log('Received restricted word request:', { word, category, severity, userId: req.user.userId });

      if (!word || typeof word !== 'string') {
        return res.status(400).json({ message: 'Word is required and must be a string' });
      }

      const wordData = {
        word: word.toLowerCase().trim(),
        category: category || 'general',
        severity: severity || 'flag',
        addedBy: req.user.userId,
        isActive: true
      };

      console.log('Adding restricted word with data:', wordData);
      const restrictedWord = await storage.addRestrictedWord(wordData);
      console.log('Successfully added restricted word:', restrictedWord);

      res.status(201).json(restrictedWord);
    } catch (error: any) {
      console.error('Error adding restricted word:', error);
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return res.status(409).json({ message: 'This word is already in the restricted list' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/admin/restricted-words/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      console.log('Deleting restricted word with ID:', id);

      const success = await storage.deleteRestrictedWord(id);
      console.log('Delete operation result:', success);

      if (!success) {
        return res.status(404).json({ message: "Word not found" });
      }

      res.json({ message: "Restricted word deleted successfully" });
    } catch (error: any) {
      console.error('Failed to delete restricted word:', error);
      res.status(500).json({ message: "Failed to delete restricted word", error: error.message });
    }
  });

  // --- FAQ Categories Management Routes ---
  // Admin FAQ categories
  app.get("/api/admin/faq-categories", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const categories = await db.select().from(faqCategories).orderBy(faqCategories.sortOrder);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
      res.status(500).json({ error: 'Failed to fetch FAQ categories' });
    }
  });

  app.post("/api/admin/faq-categories", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const { name, description, icon, color, sortOrder, isActive } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const newCategory = await db.insert(faqCategories).values({
        name,
        description: description || '',
        icon: icon || 'HelpCircle',
        color: color || 'bg-blue-100 text-blue-800',
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true
      }).returning();

      res.status(201).json(newCategory[0]);
    } catch (error) {
      console.error('Error creating FAQ category:', error);
      res.status(500).json({ error: 'Failed to create FAQ category' });
    }
  });

  app.put("/api/admin/faq-categories/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const { id } = req.params;
      const { name, description, icon, color, sortOrder, isActive } = req.body;

      const updated = await db
        .update(faqCategories)
        .set({
          name,
          description,
          icon,
          color,
          sortOrder,
          isActive,
          updatedAt: new Date()
        })
        .where(eq(faqCategories.id, id))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ error: 'FAQ category not found' });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating FAQ category:', error);
      res.status(500).json({ error: 'Failed to update FAQ category' });
    }
  });

  app.delete("/api/admin/faq-categories/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const { id } = req.params;

      const deleted = await db.delete(faqCategories).where(eq(faqCategories.id, id)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'FAQ category not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting FAQ category:', error);
      res.status(500).json({ error: 'Failed to delete FAQ category' });
    }
  });

  // Public FAQ categories endpoint
  app.get("/api/public/faq-categories", async (req: Request, res: Response) => {
    try {
      const { faqCategories } = await import('@shared/schema');
      const categories = await db
        .select()
        .from(faqCategories)
        .where(eq(faqCategories.isActive, true))
        .orderBy(faqCategories.sortOrder);

      res.json(categories);
    } catch (error) {
      console.error('Error fetching public FAQ categories:', error);
      res.status(500).json({ error: 'Failed to fetch FAQ categories' });
    }
  });

  // Public contact settings endpoint
  app.get("/api/contact-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      res.status(500).json({ error: 'Failed to fetch contact settings' });
    }
  });

  // --- FAQ Management Routes ---
  // Admin FAQ management
  app.get("/api/admin/faqs", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const allFaqs = await db.select().from(faqs).orderBy(faqs.sortOrder, faqs.createdAt);
      res.json(allFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  });

  app.post("/api/admin/faqs", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { insertFAQSchema } = await import('@shared/schema');
      const faqData = insertFAQSchema.parse(req.body);

      const newFaq = await db.insert(faqs).values({
        ...faqData,
        tags: faqData.tags || [],
        isActive: faqData.isActive ?? true,
        sortOrder: faqData.sortOrder || 0
      }).returning();

      res.json(newFaq[0]);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      res.status(500).json({ error: 'Failed to create FAQ', details: error.message });
    }
  });

  app.put("/api/admin/faqs/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { question, answer, category, tags, isActive, sortOrder } = req.body;

      const updated = await db
        .update(faqs)
        .set({
          question,
          answer,
          category,
          tags: tags || [],
          isActive: isActive ?? true,
          sortOrder: sortOrder || 0,
          updatedAt: new Date()
        })
        .where(eq(faqs.id, id))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({ error: 'Failed to update FAQ' });
    }
  });

  app.delete("/api/admin/faqs/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await db.delete(faqs).where(eq(faqs.id, id)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  });

  // Public FAQs endpoint
  app.get("/api/public/faqs", async (req, res) => {
    try {
      const activeFaqs = await db
        .select()
        .from(faqs)
        .where(eq(faqs.isActive, true))
        .orderBy(faqs.sortOrder, faqs.createdAt);

      res.json(activeFaqs);
    } catch (error) {
      console.error('Error fetching public FAQs:', error);
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  });

  // --- Admin Withdrawal Settings ---
  // Admin withdrawal settings
  app.get("/api/admin/withdrawal-settings", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = await db.select().from(withdrawalSettings).limit(1);
      res.json(settings[0] || {
        minimumAmount: "1000",
        processingFee: "45",
        processingTimeHours: 24,
        isActive: true
      });
    } catch (error) {
      console.error('Error fetching withdrawal settings:', error);
      res.status(500).json({ error: 'Failed to fetch withdrawal settings' });
    }
  });

  app.put("/api/admin/withdrawal-settings/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await db
        .update(withdrawalSettings)
        .set({ ...updateData, updatedAt: new Date().toString() })
        .where(eq(withdrawalSettings.id, id))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating withdrawal settings:', error);
      res.status(500).json({ error: 'Failed to update withdrawal settings' });
    }
  });

  // --- Blog Post Routes ---
  // Admin: Get all blog posts
  app.get("/api/admin/blog-posts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Admin: Get single blog post
  app.get("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPost(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin: Create blog post
  app.post("/api/admin/blog-posts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.userId
      });

      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      console.error('Failed to create blog post:', error);
      res.status(400).json({ message: "Failed to create blog post", error: error.message });
    }
  });

  // Admin: Update blog post
  app.put("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const post = await storage.updateBlogPost(id, updates);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error('Failed to update blog post:', error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Admin: Delete blog post
  app.delete("/api/admin/blog-posts/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(id);

      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Public blog post route
  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Only return published posts for public access
      if (!post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to fetch blog post", error: error.message });
    }
  });

  // --- User Verification Routes ---
  // Submit verification
  app.post("/api/verification/submit", authenticateToken, upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { documentType } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.documentFront || !files.selfie) {
        return res.status(400).json({ message: "Document front image and selfie are required" });
      }

      if (!documentType || !['national_id', 'passport', 'voters_card'].includes(documentType)) {
        return res.status(400).json({ message: "Valid document type is required" });
      }

      // Check if user already has a pending or verified verification
      const existing = await storage.getVerificationByUserId(req.user.userId);
      if (existing && (existing.status === 'pending' || existing.status === 'verified')) {
        return res.status(400).json({
          message: existing.status === 'verified'
            ? "Your account is already verified"
            : "You already have a verification request pending review"
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

      // Send email notification to user
      try {
        const user = await storage.getUser(req.user.userId);
        if (user) {
          await emailService.sendVerificationSubmitted(
            user.email,
            `${user.firstName} ${user.lastName}`
          );
        }
      } catch (emailError) {
        console.error('Failed to send verification submission email:', emailError);
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
      console.error('Verification submission error:', error);
      res.status(500).json({ message: "Failed to submit verification" });
    }
  });

  // Get user's verification status
  app.get("/api/verification/status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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
      console.error('Get verification status error:', error);
      res.status(500).json({ message: "Failed to get verification status" });
    }
  });

  // Admin: Get pending verifications
  app.get("/api/admin/verifications", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const verifications = await storage.getPendingVerifications();
      res.json(verifications);
    } catch (error) {
      console.error('Get pending verifications error:', error);
      res.status(500).json({ message: "Failed to get pending verifications" });
    }
  });

  // Admin: Get verification details
  app.get("/api/admin/verifications/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const verification = await storage.getVerificationById(id);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      res.json(verification);
    } catch (error) {
      console.error('Get verification details error:', error);
      res.status(500).json({ message: "Failed to get verification details" });
    }
  });

  // Admin: Approve verification
  app.post("/api/admin/verifications/:id/approve", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const verification = await storage.updateVerificationStatus(id, 'verified', req.user.userId);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      // Send approval email to user
      try {
        const user = await storage.getUser(verification.userId);
        if (user) {
          await emailService.sendVerificationApproved(
            user.email,
            `${user.firstName} ${user.lastName}`
          );
        }
      } catch (emailError) {
        console.error('Failed to send verification approval email:', emailError);
      }

      res.json({ message: "Verification approved successfully" });
    } catch (error) {
      console.error('Approve verification error:', error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });

  // Admin: Reject verification
  app.post("/api/admin/verifications/:id/reject", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }

      const verification = await storage.updateVerificationStatus(id, 'rejected', req.user.userId, reason);

      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }

      // Send rejection email to user
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
        console.error('Failed to send verification rejection email:', emailError);
      }

      res.json({ message: "Verification rejected successfully" });
    } catch (error) {
      console.error('Reject verification error:', error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });

  // --- Admin Finder Levels Routes ---
  app.get("/api/admin/finder-levels", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const levels = await storage.getFinderLevels();
      
      // Map database fields to frontend format
      const frontendLevels = levels.map(level => ({
        id: level.id,
        name: level.name,
        description: level.description,
        minEarnedAmount: level.minEarnedAmount,
        minJobsCompleted: level.minJobsCompleted,
        minReviewPercentage: level.minRating ? Math.round(parseFloat(level.minRating.toString()) * 20) : 0, // Convert 5-star rating to percentage
        icon: level.badgeIcon || 'User',
        iconUrl: '', // Not stored in database
        color: level.color,
        order: level.order,
        isActive: level.isActive,
        createdAt: level.createdAt,
        updatedAt: level.updatedAt
      }));
      
      res.json(frontendLevels);
    } catch (error) {
      console.error('Get finder levels error:', error);
      res.status(500).json({ message: "Failed to fetch finder levels" });
    }
  });

  app.post("/api/admin/finder-levels", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Map frontend fields to database schema
      const frontendData = req.body;
      const dbData = {
        name: frontendData.name,
        description: frontendData.description,
        minEarnedAmount: frontendData.minEarnedAmount,
        minJobsCompleted: frontendData.minJobsCompleted,
        minRating: frontendData.minReviewPercentage ? (frontendData.minReviewPercentage / 20).toString() : "0", // Convert percentage to 5-star rating
        badgeIcon: frontendData.icon,
        badgeEmoji: '', // Default empty, can be added later
        color: frontendData.color,
        order: frontendData.order,
        isActive: frontendData.isActive
      };

      const level = await storage.createFinderLevel(dbData);
      res.json(level);
    } catch (error) {
      console.error('Create finder level error:', error);
      res.status(500).json({ message: "Failed to create finder level" });
    }
  });

  app.put("/api/admin/finder-levels/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      
      // Map frontend fields to database schema
      const frontendData = req.body;
      const dbData = {
        name: frontendData.name,
        description: frontendData.description,
        minEarnedAmount: frontendData.minEarnedAmount,
        minJobsCompleted: frontendData.minJobsCompleted,
        minRating: frontendData.minReviewPercentage ? (frontendData.minReviewPercentage / 20).toString() : "0", // Convert percentage to 5-star rating
        badgeIcon: frontendData.icon,
        badgeEmoji: '', // Default empty, can be added later
        color: frontendData.color,
        order: frontendData.order,
        isActive: frontendData.isActive
      };
      
      const level = await storage.updateFinderLevel(id, dbData);
      
      if (!level) {
        return res.status(404).json({ message: "Finder level not found" });
      }
      
      res.json(level);
    } catch (error) {
      console.error('Update finder level error:', error);
      res.status(500).json({ message: "Failed to update finder level" });
    }
  });

  app.delete("/api/admin/finder-levels/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const success = await storage.deleteFinderLevel(id);
      
      if (!success) {
        return res.status(404).json({ message: "Finder level not found" });
      }
      
      res.json({ message: "Finder level deleted successfully" });
    } catch (error) {
      console.error('Delete finder level error:', error);
      res.status(500).json({ message: "Failed to delete finder level" });
    }
  });

  // Temporary seed endpoint for finder levels
  app.post("/api/admin/finder-levels/seed", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
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
          badgeEmoji: "🌱",
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
          badgeEmoji: "🧭",
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
          badgeEmoji: "🔍",
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
          badgeEmoji: "🏆",
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
          badgeEmoji: "👑",
          color: "#f59e0b",
          order: 5,
          isActive: true
        }
      ];

      // Check if levels already exist
      const existingLevels = await storage.getFinderLevels();
      
      if (existingLevels.length > 0) {
        return res.json({ message: "Finder levels already exist, skipping seed", levels: existingLevels });
      }
      
      // Insert default levels
      for (const level of defaultFinderLevels) {
        await storage.createFinderLevel(level);
      }
      
      const seededLevels = await storage.getFinderLevels();
      
      res.json({ 
        message: `Successfully seeded ${defaultFinderLevels.length} finder levels`, 
        levels: seededLevels 
      });
      
    } catch (error) {
      console.error('Seed finder levels error:', error);
      res.status(500).json({ message: "Failed to seed finder levels" });
    }
  });

  // Withdrawal settings endpoints
  app.get('/api/finder/withdrawal-settings', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ error: 'Access denied. Finder role required.' });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ error: 'Finder profile not found' });
      }

      const settings = await storage.getWithdrawalSettings(finder.id);
      res.json(settings);
    } catch (error) {
      console.error('Error fetching withdrawal settings:', error);
      res.status(500).json({ error: 'Failed to fetch withdrawal settings' });
    }
  });

  // Update withdrawal settings
  app.put("/api/finder/withdrawal-settings", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'finder') {
        return res.status(403).json({ message: "Only finders can update withdrawal settings" });
      }

      const finder = await storage.getFinderByUserId(req.user.userId);
      if (!finder) {
        return res.status(404).json({ message: "Finder profile not found" });
      }

      const settings = req.body;
      console.log('Route: Received withdrawal settings update:', JSON.stringify(settings, null, 2));

      // Validate required fields with more flexible checking
      const bankDetails = settings.bankDetails || {};
      const bankName = bankDetails.bankName?.trim();
      const accountNumber = bankDetails.accountNumber?.trim();
      const accountHolder = bankDetails.accountHolder?.trim();

      if (!bankName || !accountNumber || !accountHolder) {
        console.error('Validation failed:', { bankName, accountNumber, accountHolder });
        return res.status(400).json({
          message: "Missing required bank details: bankName, accountNumber, and accountHolder are required",
          received: { bankName: !!bankName, accountNumber: !!accountNumber, accountHolder: !!accountHolder }
        });
      }

      // Ensure settings have the correct structure
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

      console.log('Validated settings:', JSON.stringify(validatedSettings, null, 2));

      const updatedSettings = await storage.updateWithdrawalSettings(finder.id, validatedSettings);

      res.json({
        message: "Withdrawal settings updated successfully",
        settings: updatedSettings
      });
    } catch (error: any) {
      console.error('Route: Error updating withdrawal settings:', error);
      res.status(500).json({
        message: error.message || "Failed to update withdrawal settings",
        error: error.message || "Unknown error occurred"
      });
    }
  });

  // --- Monthly Token Grant Management ---
  app.post("/api/admin/monthly-token-grant", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Check if tokens have already been granted this month
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
    } catch (error: any) {
      console.error('Monthly token grant error:', error);
      res.status(500).json({ 
        message: "Failed to grant monthly tokens",
        error: error.message
      });
    }
  });

  // Endpoint to check monthly token grant status
  app.get("/api/admin/monthly-token-grant/status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const hasGranted = await monthlyTokenGrantService.hasGrantedTokensThisMonth();
      
      res.json({ 
        hasGrantedThisMonth: hasGranted,
        currentDate: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Monthly token grant status error:', error);
      res.status(500).json({ 
        message: "Failed to check monthly token grant status",
        error: error.message
      });
    }
  });

  // Enhanced finder profile endpoint
  app.get("/api/finder/profile/:finderId", async (req: Request, res: Response) => {
    try {
      const { finderId } = req.params;

      const finder = await db
        .select({
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
        })
        .from(finders)
        .innerJoin(users, eq(finders.userId, users.id))
        .where(eq(finders.id, finderId))
        .limit(1);

      if (!finder[0]) {
        return res.status(404).json({ message: "Finder not found" });
      }

      res.json(finder[0]);
    } catch (error: any) {
      console.error('Enhanced finder profile error:', error);
      res.status(500).json({ 
        message: "Failed to fetch finder profile",
        error: error.message
      });
    }
  });

  // --- Autonomous Fund Service Management ---
  app.get("/api/admin/autonomous-fund/config", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const config = autonomousFundService.getConfig();
      res.json(config);
    } catch (error: any) {
      console.error('Autonomous fund config error:', error);
      res.status(500).json({ 
        message: "Failed to get autonomous fund config",
        error: error.message
      });
    }
  });

  app.put("/api/admin/autonomous-fund/config", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { holdingPeriodHours, autoCreditEnabled, minimumRating, minimumJobsCompleted } = req.body;
      
      const newConfig = {
        ...(holdingPeriodHours !== undefined && { holdingPeriodHours }),
        ...(autoCreditEnabled !== undefined && { autoCreditEnabled }),
        ...(minimumRating !== undefined && { minimumRating }),
        ...(minimumJobsCompleted !== undefined && { minimumJobsCompleted })
      };

      autonomousFundService.updateConfig(newConfig);
      
      res.json({ 
        message: "Autonomous fund configuration updated successfully",
        config: autonomousFundService.getConfig()
      });
    } catch (error: any) {
      console.error('Update autonomous fund config error:', error);
      res.status(500).json({ 
        message: "Failed to update autonomous fund config",
        error: error.message
      });
    }
  });

  app.post("/api/admin/autonomous-fund/process", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await autonomousFundService.processAutonomousFundCrediting();
      
      res.json({ 
        message: "Autonomous fund processing initiated successfully"
      });
    } catch (error: any) {
      console.error('Autonomous fund processing error:', error);
      res.status(500).json({ 
        message: "Failed to process autonomous fund crediting",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}