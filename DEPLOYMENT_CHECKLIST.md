# 🚀 Daily Tutors - Quick Start Checklist

Complete this checklist to deploy Daily Tutors in production.

## Prerequisites ✅
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] GitHub account
- [ ] Git configured locally

## Step 1: Create External Accounts ⚙️

### MongoDB Atlas
- [ ] Create account at mongodb.com/cloud/atlas
- [ ] Create a new cluster
- [ ] Create database user with credentials
- [ ] Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dailytutors`
- [ ] Note: `MONGODB_URI`

### Google OAuth
- [ ] Go to console.cloud.google.com
- [ ] Create new project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (local)
  - `https://yourapp.vercel.app/api/auth/callback/google` (production)
- [ ] Note: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Razorpay
- [ ] Create account at razorpay.com
- [ ] Go to Settings > API Keys
- [ ] Copy Test keys (for development)
- [ ] Switch to Live keys (for production)
- [ ] Note: `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Groq API
- [ ] Go to console.groq.com
- [ ] Create API key
- [ ] Note: `GROQ_API_KEY`

### Vercel
- [ ] Create account at vercel.com
- [ ] Choose Pro plan ($20/month)
- [ ] Connect GitHub account
- [ ] Note: `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

## Step 2: Clone & Setup Repository 📦

```bash
# Clone repository
git clone https://github.com/yourusername/dailytutors.git
cd dailytutors

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

## Step 3: Configure Environment Variables 🔐

Edit `.env.local` with your credentials:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dailytutors

# NextAuth
NEXTAUTH_SECRET=your-32-char-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret-key

# AI APIs
GROQ_API_KEY=your-groq-key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-secret-for-cron

# Admin
ADMIN_EMAIL=admin@dailytutors.com
ADMIN_PASSWORD=your-admin-password
```

## Step 4: Test Locally 🧪

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test registration, login, courses
# Check browser console for errors

# Optional: Test API directly
curl -X GET http://localhost:3000/api/courses
```

## Step 5: Push to GitHub 📤

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Initial Daily Tutors setup"

# Create main branch if needed
git branch -M main

# Add remote repository
git remote add origin https://github.com/yourusername/dailytutors.git

# Push to GitHub
git push -u origin main
```

## Step 6: Configure GitHub Secrets 🔑

1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

```
VERCEL_TOKEN = (from vercel.com/tokens)
VERCEL_ORG_ID = (from Vercel dashboard)
VERCEL_PROJECT_ID = (from Vercel dashboard)
MONGODB_URI = (your connection string)
NEXTAUTH_SECRET = (same as .env.local)
NEXTAUTH_URL = (your production domain)
GOOGLE_CLIENT_ID = (your Google OAuth ID)
GOOGLE_CLIENT_SECRET = (your Google OAuth secret)
NEXT_PUBLIC_RAZORPAY_KEY_ID = (Razorpay key ID)
RAZORPAY_KEY_SECRET = (Razorpay secret key)
GROQ_API_KEY = (your Groq API key)
CRON_SECRET = (your cron secret)
```

## Step 7: Deploy to Vercel 🚀

### Option A: Using Vercel Dashboard (Easiest)
1. Go to vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Add environment variables
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
```

## Step 8: Configure Cron Jobs 🔄

1. Go to Vercel dashboard
2. Project → Cron Jobs
3. Verify these are configured:
   - `/api/cron/fetch-news` - Every 1 hour
   - `/api/cron/daily-affairs` - Daily at 7 AM
   - `/api/cron/daily-quiz` - Daily at 8 AM

## Step 9: Test Production 🎯

- [ ] Visit your live domain (yourdomain.vercel.app)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test course listing
- [ ] Test article display
- [ ] Check MongoDB for created data
- [ ] Verify cron jobs in Vercel logs

## Step 10: Configure Domain (Optional) 🌐

1. Go to Vercel dashboard
2. Project → Domains
3. Add custom domain
4. Update DNS records
5. Update `NEXTAUTH_URL` environment variable

## Verification Checklist ✔️

### Database
- [ ] MongoDB cluster running
- [ ] Database user created
- [ ] Collections created (check MongoDB Atlas)
- [ ] Backups enabled

### Authentication
- [ ] Google OAuth working
- [ ] Email/password login working
- [ ] Admin login working
- [ ] JWT tokens generated

### Payment
- [ ] Razorpay keys configured
- [ ] Test payments work (use Razorpay test card)
- [ ] Payment verification working

### AI
- [ ] Groq API key valid
- [ ] Article processing working
- [ ] MCQ generation working
- [ ] No rate limiting errors

### Cron Jobs
- [ ] Cron jobs listed in Vercel
- [ ] Jobs running on schedule
- [ ] No errors in logs
- [ ] Articles being fetched hourly

## Troubleshooting 🔧

### MongoDB Connection Error
```
Check:
- MONGODB_URI is correct
- IP whitelist in MongoDB Atlas
- Database user credentials
- Network connectivity
```

### Authentication Issues
```
Check:
- NEXTAUTH_SECRET is set
- GOOGLE_CLIENT_ID/SECRET correct
- Redirect URIs configured
- Cookies enabled in browser
```

### Payment Not Working
```
Check:
- Razorpay keys correct
- Test/Live mode match
- CORS configured
- Payment signature calculation
```

### Cron Jobs Not Running
```
Check:
- CRON_SECRET configured
- API route returns 200 status
- Vercel logs for errors
- Cron job schedule correct
```

## Performance Checks ⚡

```bash
# Check build size
npm run build

# Verify API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/courses

# Check database performance
# MongoDB Atlas → Performance Advisor
```

## Security Checklist 🔒

- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Admin panel protected
- [ ] Payment endpoints secured

## Monitoring Setup 📊

1. **Vercel Analytics**
   - Enable in Project Settings
   - Monitor Web Vitals
   - Check error rates

2. **MongoDB Monitoring**
   - Enable in Atlas
   - Set up alerts
   - Monitor query performance

3. **Application Logging**
   - Check Vercel logs
   - Review error logs
   - Monitor API usage

## Backup Strategy 💾

- [ ] Enable MongoDB automatic backups
- [ ] Schedule database exports
- [ ] Document recovery process
- [ ] Test restore procedure

## Deployment Success! 🎉

If you've completed all steps:
- [ ] App is live on Vercel
- [ ] Database is connected
- [ ] Authentication works
- [ ] Payments are integrated
- [ ] Cron jobs are running
- [ ] Articles are being fetched
- [ ] Admin panel is protected
- [ ] All features are functional

## Next Steps 📋

1. **Add Content**
   - Create sample courses
   - Add instructors
   - Upload course content

2. **Customize**
   - Update site name
   - Add your logo
   - Customize colors
   - Update messaging

3. **Marketing**
   - Set up Google Analytics
   - Configure SEO
   - Create social media
   - Plan launch

4. **Maintenance**
   - Monitor performance
   - Review analytics
   - Respond to support tickets
   - Plan updates

## Support Resources 📚

- [Complete README](./COMPLETE_README.md)
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [Architecture & API Docs](./ARCHITECTURE_AND_API_DOCS.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

## Questions? 💬

1. Check documentation
2. Review error logs
3. Search GitHub issues
4. Open new issue
5. Contact support

---

**Status**: Ready for Production ✅  
**Estimated Setup Time**: 2-3 hours  
**Support**: 24/7 via GitHub Issues
