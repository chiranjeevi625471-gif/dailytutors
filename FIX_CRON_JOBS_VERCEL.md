# 🔧 Fix: Daily Current Affairs & Quizzes Not Updating on Vercel

## Problem
- Cron jobs aren't updating articles and quizzes
- API endpoints exist but data isn't refreshing
- Articles showing as "pending-review" and not visible
- Daily quizzes appear but disappear on refresh

## Root Causes Identified

### Issue 1: Cron Authentication ❌ (FIXED)
- Vercel cron jobs don't send Bearer token
- API was returning 401 Unauthorized
- **FIXED**: Updated auth to accept requests from Vercel

### Issue 2: Missing Environment Variables ❌ 
- `CRON_SECRET` not set in Vercel
- `NEWSAPI_KEY` not configured
- **NEEDS FIX**: Add to Vercel environment

### Issue 3: Article Approval Workflow ❌
- Articles created with `status='pending-review'`
- Won't show on website until admin approves
- **NEEDS FIX**: Auto-publish articles

### Issue 4: Quiz Data Lost on Cold Start ❌ CRITICAL
- Quiz system uses **JSON file storage** (`/tmp/data/quizzes.json`)
- Vercel clears `/tmp` on cold start (when no traffic for ~15 min)
- Cron creates quiz → saved to `/tmp` → cold start happens → data lost!
- **SOLUTION**: Switch quizzes to MongoDB (persistent database)

---

## 🔧 SOLUTION: 4 Critical Fixes

### Fix 1: Update Environment Variables in Vercel ✅

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

**REQUIRED variables:**

```env
# Cron Job Authentication (NEW REQUIREMENT)
CRON_SECRET=your-random-secret-key-here

# News API (get free key from newsapi.org)
NEWSAPI_KEY=your-newsapi-key-here

# Database (REQUIRED for articles)
MONGODB_URI=your-mongodb-connection-string

# AI Processing
GROQ_API_KEY=your-groq-api-key

# NextAuth
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://yourdomain.vercel.app

# Payment (Optional)
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Admin (Optional)
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=your-admin-password
```

**After adding:**
1. Click "Save"
2. Go to **Deployments**
3. Click latest deployment
4. Click "Redeploy" with new env vars
5. Wait 5 minutes for cron to run

---

### Fix 2: Auto-Publish Articles ✅

Edit: `src/app/api/cron/fetch-news/route.ts` (line ~85)

Change:
```typescript
status: 'pending-review', // Requires admin approval
```

To:
```typescript
status: 'published', // Auto-publish fetched articles
```

---

### Fix 3: Migrate Quizzes to MongoDB 🔴 CRITICAL

**The problem:** Quiz data is lost on Vercel cold starts because it uses `/tmp/data/quizzes.json`.

**Current System:**
- Articles → MongoDB (Persistent) ✅
- Quizzes → JSON file (Lost on cold start) ❌
- Current Affairs → JSON file (Lost on cold start) ❌

**Solution:** Migrate to MongoDB like articles

**For now, quick workaround:**
- Quizzes will regenerate within 5 min of next cron run
- Users might see empty quiz briefly
- **Better fix:** Migrate to MongoDB (see below)

---

### Fix 4: Create Quiz MongoDB Model (RECOMMENDED)

Create: `src/lib/models/Quiz.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IQuiz extends Document {
  slug: string;
  title: string;
  type: 'prelims' | 'mains' | 'daily-quiz' | 'mock-test';
  questions: Array<{
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  duration: number; // minutes
  totalQuestions: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['prelims', 'mains', 'daily-quiz', 'mock-test'], default: 'daily-quiz' },
  questions: [{
    text: { type: String, required: true },
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }
  }],
  duration: { type: Number, default: 30 },
  totalQuestions: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', quizSchema);
```

Then update the cron job to save quizzes to MongoDB instead of JSON.

---

## 📋 IMMEDIATE FIXES (Do these now)

### Step 1: Fix Authentication (Already Done ✅)
Code updated to accept Vercel cron requests

### Step 2: Update Environment Variables (Do This Now)
Add `CRON_SECRET` and `NEWSAPI_KEY` to Vercel

### Step 3: Auto-Publish Articles (Do This Now)
Change `status: 'pending-review'` to `status: 'published'`

### Step 4: Redeploy (Do This Now)
```bash
git add .
git commit -m "Fix cron jobs and auto-publish articles"
git push origin main
```

---

## 🚀 Verification Steps

### 1. Check Vercel Logs
```
Vercel Dashboard → Your Project → Monitoring → Cron Jobs
```

Should show:
```
✓ GET /api/cron/fetch-news - Success
  Fetched: 25 articles
  Processed: 20 articles
  Status: published (not pending-review)

✓ GET /api/cron/daily-quiz - Success
  Generated quiz for today
  Questions: 20
```

### 2. Check Articles Appear
Visit: `https://yourdomain.vercel.app/current-affairs`

Should show articles from today (not old ones)

### 3. Check Quizzes Appear
Visit: `https://yourdomain.vercel.app/daily-quiz`

Should show today's quiz
- If it disappears: JSON storage issue (fix with MongoDB migration)
- If it persists: Quiz system working ✅

---

## 🐛 Troubleshooting

### Articles Still Not Showing

```bash
# Test the API
curl https://yourdomain.vercel.app/api/articles

# Should return articles with status='published'
# If empty: Check MongoDB connection
# If old data: Check NEWSAPI_KEY is set
```

**Fix:**
1. Verify NEWSAPI_KEY in Vercel env variables
2. Verify MONGODB_URI is correct
3. Check MongoDB Atlas: Articles collection has documents
4. Redeploy: Click "Redeploy" in Vercel

### Quizzes Disappearing

This is the **cold start problem**. When Vercel's `/tmp` clears:

```
1. Cron generates quiz → /tmp/data/quizzes.json
2. Cold start happens (after 15 min inactivity)
3. /tmp cleared → quiz data lost
4. Next request loads old data from data/quizzes.json
```

**Solutions:**
1. **Quick fix**: Wait 5 min for next cron run (quiz regenerates)
2. **Better fix**: Migrate to MongoDB (see instructions above)
3. **Best fix**: Use Database for all dynamic data

### Cron Jobs Not Running

Check:
1. Is `CRON_SECRET` set in Vercel? (Required!)
2. Do endpoints return 200 OK?
3. Check Vercel cron logs for errors
4. Is timezone correct? (Crons use UTC)

**Fix:**
```
Vercel Dashboard → Settings → Environment Variables
Add: CRON_SECRET=your-random-string
Redeploy: Click "Redeploy"
Wait: 5 minutes for next scheduled run
```

---

## ✅ Final Checklist

- [ ] Updated CRON_SECRET in Vercel
- [ ] Updated NEWSAPI_KEY in Vercel  
- [ ] Updated MONGODB_URI in Vercel
- [ ] Verified all environment variables
- [ ] Changed article status to 'published'
- [ ] Pushed code: `git push origin main`
- [ ] Clicked "Redeploy" in Vercel
- [ ] Waited 5 minutes
- [ ] Checked articles appear on website
- [ ] Checked quizzes appear on website
- [ ] Verified Vercel cron logs show success

---

## 🎯 Expected Results After Fixes

✅ **Hourly** (Every 1 hour)
- Cron fetches 25 latest news
- Processes with AI (Groq)
- Generates MCQs
- **Auto-published** (visible immediately)

✅ **Daily 7 AM IST**
- Generates current affairs digest

✅ **Daily 8 AM IST**
- Generates daily quizzes
- **Note**: May disappear on cold start (need MongoDB fix)

✅ **Website**
- Latest articles visible
- Today's quiz shows
- Data persists on page reload

---

## 🚀 Long-Term Fix: MongoDB Migration

To prevent quiz data loss, migrate to MongoDB:

1. Create Quiz model (see code above)
2. Update daily-quiz cron to save to MongoDB
3. Update quiz API to fetch from MongoDB
4. Data persists forever ✅

This is the proper solution to make everything persistent.

---

## 📞 Still Not Working?

1. **Check Vercel Environment Variables**
   - CRON_SECRET must be set
   - NEWSAPI_KEY must be set
   - MONGODB_URI must be set

2. **Check Vercel Cron Logs**
   - Monitoring → Cron Jobs
   - Look for errors

3. **Check MongoDB**
   - Login to MongoDB Atlas
   - Verify collections exist
   - Verify documents are created

4. **Check API Responses**
   - `/api/articles` should return published articles
   - `/api/cron/fetch-news` should return 200 (not 401)

5. **Redeploy if Changed**
   - Any code changes: Redeploy in Vercel
   - Any env variables: Redeploy in Vercel

---

**Status**: 🟡 Partial Fix Applied
- ✅ Authentication fixed
- 🔄 Env variables needed
- 🔄 Articles auto-publish needed  
- ❌ Quiz persistence needs MongoDB migration

**Next Steps**:
1. Add env variables to Vercel NOW
2. Change article status NOW
3. Deploy NOW
4. Migrate quizzes to MongoDB (long-term)


---

## 🔧 SOLUTION: 3 Steps to Fix

### Step 1: Update Environment Variables in Vercel ✅

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add/Update these variables:

```env
# REQUIRED - Cron Job Authentication
CRON_SECRET=your-random-secret-key-here

# REQUIRED - News API (get free key from newsapi.org)
NEWSAPI_KEY=your-newsapi-key-here

# REQUIRED - MongoDB
MONGODB_URI=your-mongodb-connection-string

# REQUIRED - AI Processing
GROQ_API_KEY=your-groq-api-key

# REQUIRED - NextAuth
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://yourdomain.vercel.app

# OPTIONAL - Payment
RAZORPAY_KEY_SECRET=your-razorpay-secret

# OPTIONAL - Admin
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=your-admin-password
```

**After adding variables:**
1. Click "Save"
2. Go to **Deployments**
3. Click the latest deployment
4. Click "Redeploy" to update with new environment variables

---

### Step 2: Fix Auto-Approval of Articles ✅

Articles are created as "pending-review" and won't show on the website until approved.

**Option A: Make articles auto-publish (RECOMMENDED)**

Edit: `src/app/api/cron/fetch-news/route.ts`

Find this line:
```typescript
status: 'pending-review', // Requires admin approval
```

Change to:
```typescript
status: 'published', // Auto-publish fetched articles
```

Then redeploy: `git push origin main`

**Option B: Auto-approve articles via admin panel** (After UI is built)

---

### Step 3: Verify Cron Jobs are Running ✅

**Check Vercel Cron Logs:**

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Monitoring** tab
3. Look for **Cron Jobs** section
4. Check if jobs executed and see any errors

**Manual Test via Terminal:**

```bash
# Test the news fetch endpoint locally
curl http://localhost:3000/api/cron/fetch-news \
  -H "Authorization: Bearer your-cron-secret"

# Expected response: 200 OK with processed articles count
```

**Test on Vercel Production:**

```bash
curl https://yourdomain.vercel.app/api/cron/fetch-news \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📋 CHECKLIST: Before & After

### Before (Not Working)
- [ ] CRON_SECRET not set in Vercel
- [ ] NEWSAPI_KEY not set in Vercel
- [ ] Articles created but status='pending-review'
- [ ] Cron jobs returning 401 errors
- [ ] No articles visible on website

### After (Working)
- [x] CRON_SECRET set in Vercel ✅
- [x] NEWSAPI_KEY set in Vercel ✅
- [x] Articles auto-publish (status='published') ✅
- [x] Cron jobs returning 200 success ✅
- [x] Articles visible on website ✅

---

## 🚀 Verification Steps

### 1. Check Vercel Logs
```
Vercel Dashboard → Your Project → Monitoring → Cron Jobs
```

You should see:
```
✓ GET /api/cron/fetch-news - Success
  Fetched: 25 articles
  Processed: 20 articles
  Errors: 0
```

### 2. Check MongoDB
```
MongoDB Atlas → Your Cluster → Collections → articles
```

Should show new documents with status='published' created in the last hour.

### 3. Check Website
```
https://yourdomain.vercel.app/current-affairs
```

Should show latest articles from today.

### 4. Test API Directly
```bash
# Check if articles are in database
curl https://yourdomain.vercel.app/api/articles

# Expected response: 200 with articles array
```

---

## 🐛 Troubleshooting

### Issue: Still Getting 401 Unauthorized

**Solution:**
1. Verify CRON_SECRET is set in Vercel (not just locally)
2. Click "Redeploy" after adding environment variables
3. Wait 5 minutes for deployment to complete
4. Check Vercel logs for errors

### Issue: Articles not appearing on website

**Check:**
1. Are articles being created? (Check MongoDB)
2. Is article status='published'? (Should be, after your fix)
3. Is the frontend fetching correctly? (Check browser console)
4. Are there API errors? (Check Vercel logs)

**Solution:**
```bash
# Manually test the API
curl https://yourdomain.vercel.app/api/articles

# Should return articles with status='published'
```

### Issue: NEWSAPI_KEY not working

**Solution:**
1. Get free key from https://newsapi.org
2. Add to Vercel environment variables
3. Test locally first: `npm run dev`
4. Redeploy to Vercel
5. Wait 5 minutes for cron to run

### Issue: Cron job not running at scheduled time

**Check:**
1. Is CRON_SECRET set? (Required!)
2. Does the endpoint return 200 OK?
3. Check Vercel cron logs for errors
4. Verify timezone (cron uses UTC by default)

**Fix timezone in vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 */1 * * *"
      // Schedule is in UTC
      // 0 7 * * * = 7 AM UTC
      // For IST (UTC+5:30), subtract 5:30
      // 1:30 AM IST = 8 PM previous day UTC
    }
  ]
}
```

---

## 📝 Manual Testing

### Test Cron Locally

```bash
# Start dev server
npm run dev

# In another terminal, test the cron endpoint
curl http://localhost:3000/api/cron/fetch-news \
  -H "Authorization: Bearer your-cron-secret-here"

# Should show:
# {
#   "success": true,
#   "message": "Cron job completed successfully",
#   "results": {
#     "fetchedArticles": 25,
#     "processedArticles": 20,
#     "errors": 0
#   }
# }
```

### Test Article API

```bash
# Get all articles
curl http://localhost:3000/api/articles

# Get articles with category filter
curl "http://localhost:3000/api/articles?category=gs1"

# Search articles
curl "http://localhost:3000/api/articles?search=economy"
```

---

## ✅ Final Checklist

After making changes:

- [ ] Updated CRON_SECRET in Vercel
- [ ] Updated NEWSAPI_KEY in Vercel
- [ ] Updated all required environment variables
- [ ] Clicked "Redeploy" in Vercel
- [ ] Changed article status from 'pending-review' to 'published'
- [ ] Pushed code changes: `git push origin main`
- [ ] Waited 5 minutes for deployment
- [ ] Checked Vercel cron logs
- [ ] Checked MongoDB for new articles
- [ ] Visited website and see new articles
- [ ] Tested API endpoint: `/api/articles`

---

## 🎯 Expected Results

**After fixes are applied:**

✅ **Hourly** (Every 1 hour)
- Cron job fetches 25 latest news articles
- Processes with AI (Groq)
- Generates MCQs
- Saves to database
- Auto-published

✅ **Daily 7 AM IST**
- Generates current affairs digest
- Creates daily summary

✅ **Daily 8 AM IST**
- Generates daily quizzes
- Updates quiz list

✅ **Website**
- Shows latest articles
- Articles visible immediately
- Can search and filter
- MCQs displayed with articles

---

## 📞 Still Not Working?

Check these:

1. **Vercel Logs**
   - Deployment → Logs → Look for errors

2. **Browser Console**
   - Open website
   - Press F12
   - Check for API errors

3. **MongoDB**
   - Login to MongoDB Atlas
   - Check collections
   - Verify documents exist

4. **Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify all required variables are set
   - Redeploy after adding

5. **Code Changes**
   - Verify changes pushed to GitHub
   - Check Vercel shows latest code

---

## 🚀 You're All Set!

After completing these steps:
1. Articles will update hourly ✅
2. Quizzes will update daily ✅
3. Website will show latest content ✅
4. AI processing will work ✅

**Deploy changes now:** `git push origin main`

The website should start showing updates within 1-5 minutes!
