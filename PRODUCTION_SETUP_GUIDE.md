# 🚀 Complete UPSC Platform - Production Setup Guide

## Overview

This document provides comprehensive setup instructions for deploying the AI-powered UPSC preparation platform to production on Vercel with MongoDB Atlas.

---

## Phase 1: Environment Configuration

### 1.1 Environment Variables

Create `.env.local` in the project root with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dailytutors

# Authentication
NEXTAUTH_SECRET=your-very-long-random-secret-key-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
ADMIN_SETUP_TOKEN=your-unique-admin-setup-token

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# Node Environment
NODE_ENV=production
```

### 1.2 Generate Secure Tokens

```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ADMIN_SETUP_TOKEN
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Phase 2: Database Setup

### 2.1 MongoDB Atlas Configuration

1. Create a cluster at mongodb.com
2. Create a database user with strong password
3. Whitelist your IP addresses (or 0.0.0.0/0 for development)
4. Copy connection string
5. Replace `<username>` and `<password>` in MONGODB_URI

### 2.2 Database Collections & Indexes

The application automatically creates collections through Mongoose schemas. Key collections:

- **admins** - Admin user accounts
- **articles** - Content articles with AI metadata
- **courses** - Course definitions
- **quizzes** - Quiz questions and definitions
- **payments** - Payment transaction records
- **downloads** - Download resources (PDFs, etc.)
- **magazines** - Monthly magazine compilation
- **categories** - Content categories
- **tags** - Content tags
- **analytics** - Daily analytics data
- **settings** - Platform settings

---

## Phase 3: API Keys & Third-Party Services

### 3.1 Razorpay Setup

1. Sign up at razorpay.com
2. Create API keys (Key ID and Secret)
3. Enable webhooks for payment status updates
4. Configure success/failure redirect URLs

### 3.2 AI Services Setup

#### Groq API
- Sign up at console.groq.com
- Create API key
- Set rate limits appropriate for your usage

#### Gemini API
- Use Google Cloud Console
- Enable Generative AI API
- Create service account key

#### OpenAI API
- Sign up at platform.openai.com
- Create API key with appropriate usage limits
- Set organization billing alert

### 3.3 Cloudinary Setup

1. Sign up at cloudinary.com
2. Create upload presets for:
   - Images (WEBP format, max 2MB)
   - Videos (HLS adaptive streaming)
3. Generate API credentials
4. Configure CORS settings

---

## Phase 4: Initial Admin Setup

### 4.1 Create First Admin

```bash
# Using curl
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123!",
    "name": "Admin Name",
    "setupToken": "your-admin-setup-token"
  }'

# Response example:
{
  "success": true,
  "message": "Admin registration successful",
  "data": {
    "admin": {
      "_id": "...",
      "email": "admin@yourdomain.com",
      "name": "Admin Name",
      "role": "superadmin"
    }
  }
}
```

### 4.2 Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123!"
  }'
```

---

## Phase 5: Vercel Deployment

### 5.1 Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: UPSC platform"

# Add remote
git remote add origin https://github.com/yourusername/dailytutors.git
git push -u origin main
```

### 5.2 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
# ... add all other variables
```

### 5.3 Vercel Configuration

Edit `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["sfo1", "iad1"],
  "env": ["MONGODB_URI", "NEXTAUTH_SECRET", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"],
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

---

## Phase 6: GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Phase 7: Content Automation Setup

### 7.1 News Fetching

The platform automatically fetches news every 30 minutes from:
- The Hindu (RSS feed)
- Indian Express (RSS feed)
- PIB (RSS feed)
- LiveMint (RSS feed)
- PRS India (API)
- RBI (RSS feed)
- WHO (RSS feed)
- UN (RSS feed)

Configure in `/api/cron/fetch-news` endpoint

### 7.2 AI Processing

Each article is automatically processed with:
- Groq API for summarization
- MCQ generation
- Keywords extraction
- GS paper classification
- Mains analysis
- Constitutional links

---

## Phase 8: Security Best Practices

### 8.1 Environment Variables
- ✅ Never commit `.env.local`
- ✅ Use strong, unique passwords
- ✅ Rotate secrets regularly
- ✅ Use separate credentials for dev/prod

### 8.2 Database Security
- ✅ Enable MongoDB Atlas encryption
- ✅ Use IP whitelisting
- ✅ Enable audit logging
- ✅ Regular backups enabled

### 8.3 API Security
- ✅ Rate limiting enabled
- ✅ CORS configured correctly
- ✅ HTTPS only (Vercel default)
- ✅ Secure cookies (httpOnly, sameSite)
- ✅ JWT token expiry: 7 days

### 8.4 Payment Security
- ✅ Signature verification for all Razorpay callbacks
- ✅ Amount validation on server side
- ✅ PCI compliance via Razorpay

---

## Phase 9: Monitoring & Maintenance

### 9.1 Error Tracking
- Set up Sentry for error monitoring
- Configure Slack notifications for critical errors
- Regular error log review

### 9.2 Performance Monitoring
- Monitor Next.js analytics on Vercel
- Track API response times
- Monitor database performance (MongoDB Atlas)

### 9.3 Database Maintenance
- Monthly backup verification
- Index optimization
- Collection cleanup (old analytics data)

### 9.4 Security Updates
- Monthly dependency updates
- Vulnerability scanning (npm audit)
- Security patches from MongoDB and Node.js

---

## Phase 10: Scaling Considerations

### 10.1 Traffic Scaling
- Vercel auto-scales serverless functions
- CDN distribution enabled by default
- Image optimization with Next.js Image component

### 10.2 Database Scaling
- MongoDB Atlas auto-scaling for storage
- Connection pooling configured
- Indexes optimized for query performance

### 10.3 Cost Optimization
- Vercel Pro plan: $20/month (recommended)
- MongoDB Atlas M2 tier: Suitable for 50K-500K users
- Cloudinary free tier handles ~75K API calls/month
- Razorpay: 2% commission on transactions

---

## Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created and tested
- [ ] Razorpay API keys added
- [ ] AI API keys configured
- [ ] Cloudinary account setup
- [ ] First admin created
- [ ] SSL certificate verified
- [ ] Domain DNS updated
- [ ] GitHub Actions CI/CD setup
- [ ] Error tracking configured
- [ ] Monitoring alerts set
- [ ] Backup strategy verified
- [ ] Security review completed
- [ ] Load testing performed
- [ ] Documentation reviewed

---

## Troubleshooting

### Database Connection Issues
```bash
# Test MongoDB connection
npm run test-db
```

### API Testing
```bash
# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Password123!"}'
```

### Vercel Deployment Issues
```bash
# Check build logs
vercel logs

# Check function logs
vercel logs --tail
```

---

## Support & Resources

- Documentation: `/COMPLETE_README.md`
- API Documentation: `/ARCHITECTURE_AND_API_DOCS.md`
- Troubleshooting: `/DEPLOYMENT_CHECKLIST.md`

---

**Last Updated**: 2026-06-04  
**Version**: 1.0  
**Status**: Production Ready ✅
