# ⚡ Auto Quiz Generation - Quick Start (5 minutes)

## 🎯 What's Ready

✅ **Automatic daily quizzes** will be generated at:
- **8:30 AM IST** (3:00 AM UTC)
- **2:30 PM IST** (9:00 AM UTC) — *Optional*

✅ **Automatic news updates** every 2 hours

---

## 🚀 Setup in 3 Steps (Choose ONE method)

### **OPTION 1: GitHub Actions (Recommended - Easiest)**

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Setup auto daily quizzes"
git push origin main
```

**Step 2: Add GitHub Secret**
```bash
# Generate a random secret
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Min 0 -Max 256)}))
Write-Host "Your secret: $secret"

# Or simple method
$secret = "your-secret-key-$(Get-Random -Min 10000 -Max 99999)"
```

Then:
1. Go to: GitHub → Your Repo → **Settings** → **Secrets** → **New repository secret**
2. Name: `CRON_SECRET`
3. Value: Paste your secret
4. Click **Add secret**

**Step 3: Deploy to Vercel**
1. In Vercel dashboard, add same `CRON_SECRET` env var
2. Auto-deploys when you push to GitHub

✅ **DONE!** Quizzes will generate automatically starting tomorrow at 8:30 AM IST

---

### **OPTION 2: EasyCron (Free - No GitHub needed)**

**Step 1: Create Free Account**
- Go to: https://www.easycron.com
- Sign up + verify email

**Step 2: Create Cron Job for Daily Quiz**
1. Click **Add cron job**
2. **Cron expression:** `0 3 * * *`
3. **URL:** `https://your-domain.vercel.app/api/cron/daily-quiz?secret=CRON_SECRET`
   - Replace `your-domain` with actual Vercel URL
   - Replace `CRON_SECRET` with your secret
4. Click **Save**

**Step 3: (Optional) Create Second Quiz Job**
Same as Step 2, but change:
- **Cron expression:** `0 9 * * *`
- Same URL

✅ **DONE!** Check EasyCron dashboard for confirmation

---

### **OPTION 3: Vercel Cron (If only using Vercel)**

Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-quiz?secret=YOUR_SECRET",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Then deploy to Vercel.

---

## 🧪 Test It NOW (Right Now!)

```bash
# Windows PowerShell
$secret = "your-cron-secret"
$url = "http://localhost:3000/api/cron/daily-quiz"
Invoke-WebRequest -Uri $url -Method POST `
  -Headers @{"x-cron-secret"=$secret} `
  -ContentType "application/json" `
  -Body '{"count":25}'
```

```bash
# Mac/Linux
curl -X POST http://localhost:3000/api/cron/daily-quiz \
  -H "x-cron-secret: your-cron-secret" \
  -H "Content-Type: application/json" \
  -d '{"count":25}'
```

**Expected Response:**
```json
{
  "ok": true,
  "slug": "daily-prelims-2026-05-23",
  "count": 25,
  "requested": 25
}
```

---

## ✅ How to Verify

### After Setup:
1. Visit `/prelims/daily-quiz`
2. Should show **"Today's Quiz"** with 25 questions
3. Check the date matches today

### Tomorrow:
- At 8:30 AM IST, a new quiz auto-generates
- Users see fresh quiz automatically
- No manual action needed!

---

## 📁 Files Created

```
.github/workflows/
├── daily-quiz.yml          ← Auto-generates quizzes at 8:30 AM & 2:30 PM IST
└── daily-affairs.yml       ← Updates news every 2 hours
```

---

## ⚙️ Configuration

### Adjust Time
Edit `.github/workflows/daily-quiz.yml`:
```yaml
schedule:
  - cron: '0 3 * * *'  # Change this
```

**Common Times (IST to UTC):**
- 6:00 AM IST = `30 0` (cron: `30 0 * * *`)
- 8:30 AM IST = `0 3` (cron: `0 3 * * *`)
- 2:30 PM IST = `0 9` (cron: `0 9 * * *`)

### Adjust Question Count
```yaml
-d '{"count":30}'  # Change 25 to 30
```

### Disable 2:30 PM Quiz
Comment out the second schedule in `daily-quiz.yml`:
```yaml
schedule:
  - cron: '0 3 * * *'  # Keep this
  # - cron: '0 9 * * *'  # Disable second quiz
```

---

## 🔑 Important

**Save these values safely:**
```
CRON_SECRET = your-random-secret-key
```

Must be same in:
- GitHub Secrets
- Vercel Environment Variables
- Workflow files (as variable)

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| "403 Forbidden" | Check CRON_SECRET matches everywhere |
| Quiz not created | Try manual test with curl above |
| GitHub Actions failed | Check Actions tab for error logs |
| EasyCron not working | Verify URL is correct and reachable |

---

## 🎉 What Happens Automatically

```
Tomorrow at 8:30 AM IST:
├─ GitHub/EasyCron triggers endpoint
├─ Fetches top 15 Indian news articles
├─ Generates 25 MCQ from latest news  ✅
├─ Saves to /data/quizzes.json
└─ Users see new quiz at /prelims/daily-quiz

Every 2 hours:
├─ Fetches The Hindu news
├─ Updates current affairs
└─ Users see fresh news on /current-affairs
```

---

## 🚀 You're All Set!

Just complete **ONE** of the three setup methods above, and your system will:

✅ Create daily quizzes automatically  
✅ Generate from latest news  
✅ No manual work needed  
✅ Users always see fresh content  

**Next Step:** Pick a method and implement! (Takes ~5 minutes)

---

**For detailed setup:** See `AUTO_QUIZ_GENERATION_SETUP.md`

