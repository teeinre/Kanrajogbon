# Railway Deployment Guide

## Prerequisites
- Node.js 18+ (specified in package.json engines)
- PostgreSQL database (Neon or Railway PostgreSQL)
- Environment variables configured

## Required Environment Variables

Set these in your Railway project settings:

### Essential Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret-key-here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app-name.railway.app
```

### Optional Variables (for full functionality)
```
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Flutterwave Payment
FLUTTERWAVE_SECRET_KEY=your-flutterwave-secret-key
FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-public-key
FLUTTERWAVE_SECRET_HASH=your-flutterwave-webhook-hash
```

## Deployment Configuration

The project includes:
- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Build configuration for Railway
- `.env.example` - Template for environment variables

## Build Process

The application builds in two stages:
1. Frontend build: `vite build` (creates static files in `dist/public`)
2. Backend build: `esbuild` (creates `dist/index.js`)

## Troubleshooting Common Issues

### 1. Build Failures
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors
- Verify environment variables are set

### 2. Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Railway
- Check if database migrations need to be run

### 3. Port Issues
- Railway automatically sets `PORT` environment variable
- Application listens on `process.env.PORT || 5000`

### 4. Static File Serving
- Frontend files are served from `dist/public`
- API routes are prefixed with `/api`
- All non-API routes serve `index.html` for SPA routing

## Manual Deployment Steps

1. Push code to GitHub
2. Connect Railway to your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy will automatically trigger on push to main branch

## Database Setup

If using a new database, you may need to:
1. Run database migrations: `npm run db:push`
2. Seed initial data if required

## Monitoring

Check Railway logs for:
- Build errors
- Runtime errors
- Database connection issues
- Missing environment variables