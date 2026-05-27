# 🤖 Automatic Daily Quiz Generation - Complete Setup Guide

## ✅ What's Already Built

Your project has TWO cron endpoints ready to use:

| Endpoint | Purpose | Default Schedule |
|----------|---------|-------------------|
| `/api/cron/daily-quiz` | Generate 25-question daily quiz | 8:30 AM IST & 2:30 PM IST |
| `/api/cron/daily-affairs` | Fetch latest news for current affairs | Every 2 hours |

Both are **secured with CRON_SECRET** to prevent unauthorized access.

---

## 🚀 SETUP METHOD 1: GitHub Actions (Recommended - FREE)

### Step 1: Commit the Workflow Files
```bash
# The files are already created in .github/workflows/
# Just commit and push them to GitHub

git add .github/workflows/
git commit -m "Add automatic daily quiz and current affairs cron jobs"
git push origin main
```

### Step 2: Add CRON_SECRET to GitHub Secrets

1. Go to: **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Create secret named: `CRON_SECRET`
4. Value: Generate a random string (e.g., `your-super-secret-key-12345`)
5. Click **Add secret**

```bash
# Or use GitHub CLI
gh secret set CRON_SECRET --body "your-super-secret-key-12345"
```

### Step 3: Update Vercel Environment Variables

When you deploy to Vercel, add the SAME `CRON_SECRET` value:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add variable: `CRON_SECRET`
3. Value: Same as GitHub secret
4. Save

### Step 4: Update Production URL

Edit `.github/workflows/daily-quiz.yml` and `.github/workflows/daily-affairs.yml`:

```yaml
# Find this line and update with your actual Vercel URL
PROD_URL="https://your-project-name.vercel.app"
```

### Step 5: Deploy to Vercel

```bash
# Push to GitHub (if not already done)
git push origin main

# Vercel auto-deploys, OR
vercel deploy
```

---

## ✅ How It Works (GitHub Actions)

### Daily Quiz Schedule:
```
8:30 AM IST (3:00 AM UTC)  → Generates 25 MCQ questions from latest news
2:30 PM IST (9:00 AM UTC)  → [Optional] Generates another quiz
```

### Daily Affairs Schedule:
```
Every 2 hours → Fetches latest news from The Hindu
```

### Automatic Flow:
```
GitHub Cron Trigger
    ↓
Runs workflow
    ↓
Calls: /api/cron/daily-quiz?secret=CRON_SECRET
    ↓
Generates questions from latest news
    ↓
Saves to data/quizzes.json
    ↓
Users see new quiz at /prelims/daily-quiz
```

---

## 🌐 SETUP METHOD 2: EasyCron (Alternative - No GitHub Required)

### Step 1: Create Free EasyCron Account
1. Go to: https://www.easycron.com
2. Sign up (free account)
3. Verify email

### Step 2: Create First Cron Job (Daily Quiz 8:30 AM IST)

1. Click **Add cron job**
2. Fill in:
   ```
   Cron expression: 0 3 * * *
   (This is 8:30 AM IST = 3:00 AM UTC)
   ```

3. Select: **HTTP GET**
4. URL:
   ```
   https://your-project-name.vercel.app/api/cron/daily-quiz?secret=CRON_SECRET
   ```
   Replace with your actual URL and secret

5. Click **Save**

### Step 3: Create Second Cron Job (Daily Quiz 2:30 PM IST - Optional)

Repeat Step 2 with:
```
Cron expression: 0 9 * * *
(This is 2:30 PM IST = 9:00 AM UTC)
```

### Step 4: Create Third Cron Job (Current Affairs Every 2 Hours)

Repeat with:
```
Cron expression: 0 */2 * * *
URL: https://your-project-name.vercel.app/api/cron/daily-affairs?secret=CRON_SECRET
```

### Verification:
You'll see **Execution logs** in EasyCron showing success/failure

---

## ⏰ SETUP METHOD 3: Vercel Cron Jobs (If Using Vercel - Easiest)

### Step 1: Create `vercel.json` (if not exists)

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-quiz?secret=CRON_SECRET",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/daily-quiz?secret=CRON_SECRET",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/daily-affairs?secret=CRON_SECRET",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

### Step 2: Set CRON_SECRET in Vercel

Same as GitHub Actions setup above.

### Step 3: Deploy

```bash
git push origin main
# or
vercel deploy
```

---

## 🧪 Testing Locally

### Test Daily Quiz Endpoint:

```bash
# Windows PowerShell
$secret = "your-test-secret"
$url = "http://localhost:3000/api/cron/daily-quiz"
$headers = @{ "x-cron-secret" = $secret }
Invoke-WebRequest -Uri $url -Method POST -Headers $headers -ContentType "application/json" -Body '{"count":25}'
```

```bash
# Mac/Linux Terminal
secret="your-test-secret"
url="http://localhost:3000/api/cron/daily-quiz"
curl -X POST "$url" \
  -H "x-cron-secret: $secret" \
  -H "Content-Type: application/json" \
  -d '{"count":25}'
```

### Expected Response:
```json
{
  "ok": true,
  "slug": "daily-prelims-2026-05-23",
  "count": 25,
  "requested": 25
}
```

---

## 📊 Verify It's Working

### Method 1: Check GitHub Actions
1. Go to: **GitHub** → Your repo → **Actions** tab
2. Look for **"Generate Daily Quiz"** workflow
3. Check if runs are scheduled and passing ✅

### Method 2: Check EasyCron
1. Go to: **EasyCron Dashboard**
2. Look for **Execution logs**
3. Verify recent successful executions

### Method 3: Check Your Data
1. Visit: `http://localhost:3000/prelims/daily-quiz`
2. Should show "Today's Quiz" with 25 questions
3. Check `/data/quizzes.json` for today's date entry

### Method 4: Manual Test (Right Now!)
```bash
# Replace with your values:
curl -X POST "https://your-domain.vercel.app/api/cron/daily-quiz?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"count":25}'
```

---

## ⚙️ Configuration Options

### Adjust Quiz Generation Count

Edit `.github/workflows/daily-quiz.yml`:

```yaml
- cron: '0 3 * * *'  # 8:30 AM IST
```

Change the `count` value:
```yaml
-d '{"count":30}'  # Generate 30 questions instead of 25
```

### Change Schedule Times

**IST to UTC Conversion:**
- 8:30 AM IST = 3:00 AM UTC (cron: `0 3 * * *`)
- 2:30 PM IST = 9:00 AM UTC (cron: `0 9 * * *`)
- 6:00 AM IST = 12:30 AM UTC (cron: `30 0 * * *`)

Edit the `schedule` section in workflow files.

### Disable Second Quiz (Optional)

If you only want ONE quiz per day, comment out the second schedule:

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # Keep this
    # - cron: '0 9 * * *'  # Comment this out
```

---

## 🐛 Troubleshooting

### ❌ "CRON_SECRET not set"
**Solution:**
- GitHub: Add secret in Settings → Secrets
- Vercel: Add in Settings → Environment Variables
- EasyCron: Include in URL: `?secret=YOUR_SECRET`

### ❌ "HTTP 403 Forbidden"
**Solution:**
- Secret doesn't match between GitHub/Vercel
- URL is incorrect
- CRON_SECRET environment variable not deployed

### ❌ "No articles found" or "No questions generated"
**Solution:**
- Check if NewsAPI key is set
- Verify API rate limits not exceeded
- Check internet connectivity
- Try generating questions manually via admin

### ❌ Cron job didn't run
**Solution:**
- GitHub Actions: Check Actions tab for errors
- EasyCron: Check execution logs
- Vercel: Check function logs in dashboard
- Verify URL is correct and reachable

### ⚠️ Quizzes being created multiple times
**Solution:**
- Check if multiple cron jobs pointing to same schedule
- The API deduplicates by slug (same date = same quiz)
- This is fine - only latest version is kept

---

## 📈 Monitoring & Logs

### GitHub Actions Logs:
1. Go to **Actions** tab
2. Click **Generate Daily Quiz**
3. Click recent run
4. View **Trigger Daily Quiz Generation** step

### Vercel Logs:
1. Go to **Vercel Dashboard**
2. Select project
3. **Functions** tab
4. Click `/api/cron/daily-quiz`
5. View logs

### Local Testing:
```bash
npm run dev
# Then curl the endpoint
```

---

## 🎯 Final Checklist

### Before Deploying:
- ✅ Create `.github/workflows/` files (done!)
- ✅ Generate CRON_SECRET value
- ✅ Add to GitHub Secrets
- ✅ Add to Vercel Environment Variables
- ✅ Update production URL in workflows
- ✅ Commit and push to GitHub
- ✅ Deploy to Vercel

### After Deployment:
- ✅ Check GitHub Actions runs schedule
- ✅ Visit `/prelims/daily-quiz` next day at 8:30 AM IST
- ✅ Verify new quiz appears automatically
- ✅ Check quiz is generated from latest news

---

## 📞 Quick Reference

| What | Command | When |
|------|---------|------|
| Test locally | `curl -X POST http://localhost:3000/api/cron/daily-quiz -H "x-cron-secret: YOUR_SECRET"` | Before deploying |
| View GitHub Actions | Go to Actions tab in GitHub | Monitor setup |
| Check EasyCron | https://www.easycron.com | Monitor setup |
| Manual trigger via GitHub | Go to Actions → Generate Daily Quiz → Run workflow | Test anytime |
| Check data generated | Visit `/prelims/daily-quiz` | Daily at 8:30 AM IST |

---

## ✅ STATUS: FULLY AUTOMATED

Once you complete the setup above, your system will:

```
✅ Generate daily quizzes automatically at 8:30 AM IST
✅ Optionally generate quizzes at 2:30 PM IST
✅ Update current affairs news every 2 hours
✅ Users always see fresh content
✅ No manual intervention needed
```

---

**Next Step:** Choose setup method (1, 2, or 3) and implement!

