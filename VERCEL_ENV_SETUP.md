# Vercel Environment Variables Setup

## Required Variables

Add these to Vercel Dashboard → Project Settings → Environment Variables:

### 1. CRON_SECRET (Critical for data fetching)
- **Purpose**: Authorizes cron jobs to fetch quiz, current affairs, and posts
- **Value**: Any secure string (e.g., `vxyz1234abcd5678efgh9012ijkl`)
- **Why**: Without this, `/api/cron/*` endpoints reject requests and data won't update

### 2. GROQ_API_KEY (Required for AI features)
- **Purpose**: Enables quiz generation and content analysis
- **Value**: Your Groq API key from https://console.groq.com
- **Why**: Admin panel won't work without this

### 3. NEXT_PUBLIC_SITE_URL (Optional but recommended)
- **Purpose**: Base URL for API calls in browser
- **Value**: `https://your-domain.vercel.app` or your custom domain
- **Why**: Fixes CORS issues in production

---

## Step-by-Step Setup

### Option A: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Select your `dailytutors` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Click "Save"
6. **Redeploy**: Go to Deployments → Click the latest → Click "Redeploy"

### Option B: Vercel CLI
```powershell
vercel env add CRON_SECRET
vercel env add GROQ_API_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel redeploy
```

---

## Verify It's Working

After redeploy, test with:

```powershell
$secret = "your-cron-secret"
curl -H "x-cron-secret: $secret" `
  https://your-domain.vercel.app/api/cron/daily-affairs
```

Expected response:
```json
{ "message": "Fetched X articles for today" }
```

---

## If Still Not Working

### Check Vercel Logs
1. Go to Vercel Dashboard → Deployments
2. Click the latest deployment
3. Check **Function Logs** tab for errors

### Common Issues
- ❌ **403 Forbidden**: CRON_SECRET not set or mismatched
- ❌ **500 Error**: GROQ_API_KEY missing or invalid
- ❌ **Admin login fails**: Auth database issue (data will auto-populate after cron runs)
- ❌ **Quizzes not showing**: Run `/api/cron/daily-quiz` manually via curl

### Force Data Update
If data is still stale, trigger cron manually:
```powershell
curl -H "x-cron-secret: $secret" `
  https://your-domain.vercel.app/api/cron/daily-affairs

curl -H "x-cron-secret: $secret" `
  https://your-domain.vercel.app/api/cron/daily-quiz
```

---

## How It Works on Vercel

1. **Cron Jobs** (vercel.json):
   - Daily Affairs: 7:00 AM UTC
   - Daily Quiz: 8:00 AM UTC

2. **Data Storage**:
   - Uses `/tmp/data` (ephemeral but refreshed by cron)
   - Data persists during the day
   - Resets on cold start (but cron repopulates within seconds)

3. **Admin Panel**:
   - Changes saved to `/tmp/data`
   - Persist until next deployment/cold start
   - For permanent storage, consider adding a database

---

## For Permanent Data (Optional)

If you need admin changes to persist across deployments, consider:
- ✅ **Recommended**: Add MongoDB/PostgreSQL
- ✅ **Simple**: Use Vercel KV (Redis)
- ✅ **Quick**: Use GitHub for backup storage

Let me know if you need help with any of these!
