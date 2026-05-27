# 🔄 Automatic Daily Quiz - System Architecture

## How It Works (Visual Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────────┘

DAILY QUIZ GENERATION (8:30 AM IST)
═══════════════════════════════════

    GitHub Actions / EasyCron / Vercel
              │
              ├─ CRON TRIGGER
              │ (8:30 AM IST = 3:00 AM UTC)
              │
              ↓
    POST /api/cron/daily-quiz
    + Headers: x-cron-secret=CRON_SECRET
              │
              ├─ Check authorization ✅
              │
              ↓
    Fetch Latest Indian News
    (NewsAPI.org - 15 articles)
              │
              ├─ Articles from:
              │  • The Hindu
              │  • Times of India
              │  • BBC News India
              │  • Economic Times
              │
              ↓
    Generate MCQ from Each Article
    (Groq API - llama-3.3-70b)
              │
              ├─ Generate ~2-4 questions
              │  per article
              │
              ↓
    Collect All Questions
    (Target: 25 questions)
              │
              ├─ Filter by difficulty
              │ ├─ Easy
              │ ├─ Medium
              │ └─ Hard
              │
              ↓
    Create Quiz Object
    {
      "id": "mpdv6w1d40iz23",
      "slug": "daily-prelims-2026-05-23",
      "date": "2026-05-23",          ← TODAY
      "items": [25 questions],
      "active": true
    }
              │
              ├─ Auto-deduplicate
              │ (Replace today's if exists)
              │
              ↓
    Save to /data/quizzes.json
              │
              ├─ Persist to file system
              │
              ↓
    Return Success Response
    {
      "ok": true,
      "slug": "daily-prelims-2026-05-23",
      "count": 25
    }
              │
              │
              ✅ QUIZ READY FOR USERS


CURRENT AFFAIRS UPDATE (Every 2 Hours)
═════════════════════════════════════

    GitHub Actions / EasyCron
              │
              ├─ CRON TRIGGER
              │ (Every 2 hours)
              │
              ↓
    POST /api/cron/daily-affairs
    + Headers: x-cron-secret=CRON_SECRET
              │
              ↓
    Fetch Latest News from The Hindu
    (NewsAPI - News category)
              │
              ├─ 15 latest articles
              │ (News + Editorial sections)
              │
              ↓
    Create Daily Post
    {
      "id": "post_123",
      "date": "2026-05-23",
      "articles": [15 items]
    }
              │
              ↓
    Save to /data/posts.json
              │
              ├─ Keep last 30 days
              │
              ✅ NEWS UPDATED FOR USERS
```

---

## 📊 Component Architecture

```
┌────────────────────────────────────────────────┐
│          EXTERNAL SERVICES                     │
├────────────────────────────────────────────────┤
│ GitHub Actions / EasyCron / Vercel Crons      │
│        (Triggers every X minutes/hours)        │
└────────────────┬───────────────────────────────┘
                 │
                 │ TRIGGER
                 ↓
┌────────────────────────────────────────────────┐
│      API ENDPOINTS (Next.js Routes)            │
├────────────────────────────────────────────────┤
│ POST /api/cron/daily-quiz                      │
│ POST /api/cron/daily-affairs                   │
│                                                 │
│ Security:                                       │
│ ├─ Check CRON_SECRET header                   │
│ ├─ Verify authorization                       │
│ └─ Reject unauthorized requests (403)         │
└────────────────┬───────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ↓                         ↓
┌─────────────────┐    ┌──────────────────┐
│ GROQ API        │    │ NEWSAPI.ORG      │
├─────────────────┤    ├──────────────────┤
│ AI Question     │    │ Latest Indian    │
│ Generation      │    │ News Headlines   │
│                 │    │                  │
│ Model:          │    │ Free: 100 req/day│
│ llama-3.3-70b   │    │                  │
│                 │    │ Categories:      │
│ Rate: 30 req/min│    │ • Technology     │
│                 │    │ • Business       │
│ Generates:      │    │ • Politics       │
│ • Questions     │    │ • Science        │
│ • Options       │    │ • Health         │
│ • Answers       │    │ • Sports         │
│ • Explanations  │    │                  │
└────────────────┬┘    └──────────────────┘
                 │
    ┌────────────┴───────────────┐
    │                            │
    ↓                            ↓
┌──────────────────────┐   ┌─────────────────┐
│ Parse Questions      │   │ Create News Post│
├──────────────────────┤   ├─────────────────┤
│ • Validate format    │   │ • Filter topics │
│ • Check correctness  │   │ • Sort by date  │
│ • Ensure 4 options   │   │ • Add metadata  │
│ • Count questions    │   │                 │
└──────────────────────┘   └────────┬────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │  SAVE TO FILE SYSTEM          │
    ├───────────────────────────────┤
    │ /data/quizzes.json            │
    │ └─ Today's 25-question quiz   │
    │                                │
    │ /data/posts.json              │
    │ └─ Today's current affairs    │
    └───────────────────────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │  USERS VISIT                  │
    ├───────────────────────────────┤
    │ /prelims/daily-quiz           │
    │ └─ See today's quiz ✅        │
    │                                │
    │ /current-affairs              │
    │ └─ See latest news ✅         │
    └───────────────────────────────┘
```

---

## ⏰ Scheduling Timeline

```
TIME (IST)              EVENT                      WHAT HAPPENS
────────────────────────────────────────────────────────────────────

00:00                   Midnight                   (No auto action)
                        ├─ Users can view          
                        │  previous day's quiz
                        └─ Current affairs update

02:00                   News Update               ✅ Fetch latest news
04:00                   News Update               ✅ Fetch latest news
06:00                   News Update               ✅ Fetch latest news

→ 08:00 IST / 02:30 UTC  News Update               ✅ Fetch latest news
→ 08:30 IST / 03:00 UTC  QUIZ GENERATION           ✅ Generate 25 Q
│                        (PRIMARY)                   Save to /data
│                        
│ Users wake up           
│ Visit /prelims/daily-quiz
│ ✅ See today's fresh quiz!

10:00                   News Update               ✅ Fetch latest news
12:00 (Noon)            News Update               ✅ Fetch latest news
12:30 PM IST / 07:00 UTC News Update               ✅ Fetch latest news

→ 14:30 IST / 09:00 UTC  QUIZ GENERATION           ✅ Generate another 25 Q
│                        (OPTIONAL/SECONDARY)        (Only if enabled)
│ Afternoon 
│ Users take afternoon quiz
│ ✅ Fresh quiz option!

16:00                   News Update               ✅ Fetch latest news
18:00                   News Update               ✅ Fetch latest news
20:00                   News Update               ✅ Fetch latest news
22:00                   News Update               ✅ Fetch latest news
23:59                   End of Day                 (Prepare for next day)

→ NEXT DAY 08:30 IST
  Cycle repeats...
```

---

## 🔐 Security Model

```
INCOMING REQUEST
    ↓
┌─────────────────────────────────────────┐
│ AUTHORIZATION CHECK                     │
├─────────────────────────────────────────┤
│                                         │
│ Check CRON_SECRET in:                   │
│ 1. Header: x-cron-secret                │
│ 2. Header: Authorization Bearer         │
│ 3. Query param: ?secret=XXX             │
│                                         │
│ Compare with env.CRON_SECRET            │
│                                         │
└─────────────────────────────────────────┘
    │
    ├─ Matches? → ✅ PROCEED
    │
    └─ No match? → ❌ REJECT (403 Forbidden)
```

**Secret Management:**
```
GitHub Actions
    ├─ Reads: secrets.CRON_SECRET
    └─ Sends via header: x-cron-secret

Vercel Environment
    ├─ Stores: process.env.CRON_SECRET
    └─ API validates on each request

EasyCron
    ├─ Includes in URL: ?secret=XXX
    └─ API matches on each request
```

---

## 📈 Data Flow

```
USER REQUEST: GET /prelims/daily-quiz
    ↓
Query /data/quizzes.json
    ├─ Find today's date
    ├─ Check for 20-50 questions
    ├─ Verify items array
    ↓
Found!
    ├─ Quiz data loaded
    ├─ Display "Today's Quiz" card
    ├─ Show: 25 questions, 30 min duration
    ↓
USER CLICKS "START QUIZ"
    ↓
Render /prelims/daily-quiz/[slug]
    ├─ Show MCQ one by one
    ├─ Collect answers
    ├─ Calculate score
    ├─ Show explanations
    ↓
USER COMPLETES
    └─ Streak continues! ✅
```

---

## 🔧 Environment Variables

```
Required for Auto-Generation:
┌──────────────────────────────────────┐
│ Variable: CRON_SECRET                │
│ Type: String (random)                │
│ Where: GitHub Secrets + Vercel Env   │
│ Example: aSd7!@kL9pQwE$xC            │
│                                      │
│ Variable: GROQ_API_KEY               │
│ Type: String                         │
│ Source: https://console.groq.com     │
│ Used by: Question generation         │
│                                      │
│ Variable: NEWS_API_KEY               │
│ Type: String                         │
│ Source: https://newsapi.org          │
│ Used by: Fetch latest news           │
│                                      │
│ Variable: ADMIN_PASSWORD             │
│ Type: String                         │
│ Used by: Admin panel login           │
│                                      │
│ Variable: ADMIN_TOKEN                │
│ Type: String                         │
│ Used by: Admin session validation    │
└──────────────────────────────────────┘
```

---

## ✅ Success Indicators

After setup, you should see:

```
✅ GitHub Actions Tab
   ├─ "Generate Daily Quiz" scheduled runs
   ├─ Green checkmarks for successful runs
   └─ Showing latest run time

✅ Vercel Dashboard (if using Vercel)
   ├─ Cron jobs configured
   ├─ Last execution timestamp
   └─ No errors in logs

✅ Browser - Daily Quiz Page
   ├─ "Today's Quiz" showing
   ├─ Fresh date (today's date)
   ├─ 25 questions available
   └─ Can start quiz immediately

✅ /data/quizzes.json
   ├─ New entry with today's date
   ├─ 25 questions in items array
   ├─ Active: true
   └─ Recent timestamp
```

---

## 🎯 Deployment Checklist

Before going live:

- [ ] CRON_SECRET generated
- [ ] Added to GitHub Secrets
- [ ] Added to Vercel Environment Variables
- [ ] Production URL updated in workflows
- [ ] Commit .github/workflows files
- [ ] Push to GitHub
- [ ] Verify GitHub Actions shows scheduled runs
- [ ] Deploy to Vercel
- [ ] Test: Visit /prelims/daily-quiz tomorrow at 8:30+ AM IST
- [ ] Verify new quiz is there automatically

---

**System Status:** ✅ **READY FOR AUTOMATIC OPERATION**

