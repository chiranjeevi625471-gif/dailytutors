# Daily Quiz Auto-Update Setup

## Overview
This system automatically generates UPSC Prelims quiz questions from daily news articles using **NewsAPI.org** and **Claude AI**.

## Features
✅ **Automated daily quizzes** generated from trending news  
✅ **UPSC-focused MCQs** with explanations  
✅ **Multiple news sources** indexed by NewsAPI  
✅ **Smart deduplication** (replaces old daily quizzes)  
✅ **Extensible question generation** (4-8 questions per article)  

---

## Required Environment Variables

Add these to your `.env.local` file:

```env
# NewsAPI.org API Key (https://newsapi.org)
# Get free API key at: https://newsapi.org/register
NEWSAPI_KEY=a714d9422f3e44859ec68abc328039e4

# Anthropic Claude API Key (https://console.anthropic.com)
# Required for question generation
ANTHROPIC_API_KEY=your-anthropic-api-key

# Security token for cron authentication
# Use a random strong secret (e.g., generate with: openssl rand -hex 32)
CRON_SECRET=your-secret-token-here
```

---

## Implementation Details

### 1. **News Fetching** (`src/lib/news.ts`)
- Fetches latest articles from NewsAPI.org
- Supports custom search queries (default: "India")
- Returns up to 20 articles per request
- Includes title, description, author, image URL, published date

```typescript
const articles = await fetchTopIndianNews("India current affairs", 20);
```

### 2. **Question Generation** (`src/lib/anthropic.ts`)
- Uses Claude Opus 4.7 with JSON schema validation
- Generates 4-8 questions per article
- Each question has:
  - Exactly 4 options (A/B/C/D)
  - Correct answer index (0-3)
  - Brief UPSC-focused explanation
  
```typescript
const questions = await generateQuestionsFromArticle(article, 8);
```

### 3. **Daily Quiz Cron** (`src/app/api/cron/daily-quiz/route.ts`)
- Triggered via HTTP POST with `CRON_SECRET`
- Fetches 5 latest news articles
- Generates ~20 total questions (4 per article)
- Stores quiz in `data/quizzes.json`
- Deduplicates: replaces existing quiz from today

**Endpoint:**
```
POST /api/cron/daily-quiz
Content-Type: application/json

{
  "secret": "your-cron-secret-here"
}
```

**Response:**
```json
{
  "ok": true,
  "slug": "daily-prelims-2025-05-19",
  "count": 20,
  "requested": 10
}
```

---

## Setup Instructions

### Step 1: Get NewsAPI Key
1. Visit https://newsapi.org/register
2. Sign up for free account
3. Copy your API key
4. Add to `.env.local` as `NEWSAPI_KEY`

### Step 2: Configure Anthropic
1. Visit https://console.anthropic.com
2. Create API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Step 3: Create Cron Secret
Generate a random secret:

**Windows (PowerShell):**
```powershell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Mac/Linux:**
```bash
openssl rand -hex 32
```

Add to `.env.local` as `CRON_SECRET`

### Step 4: Schedule Cron Job

#### Option A: Vercel Cron (Recommended for Vercel deployments)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-quiz",
      "schedule": "0 9 * * *"
    }
  ]
}
```

#### Option B: External Cron Service (EasyCron, AWS EventBridge, etc.)
Set up POST request to trigger daily:
```
https://yourdomain.com/api/cron/daily-quiz
Header: x-cron-secret: your-cron-secret
```

#### Option C: Manual Testing
Test locally with curl:

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/cron/daily-quiz" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body '{"secret":"your-cron-secret"}'
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:3000/api/cron/daily-quiz \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-cron-secret"}'
```

---

## File Structure

```
src/
├── api/
│   └── cron/
│       └── daily-quiz/
│           └── route.ts          # Cron endpoint
├── lib/
│   ├── news.ts                  # NewsAPI integration
│   ├── anthropic.ts             # Claude question generation
│   └── db.ts                    # Database operations
└── app/
    └── prelims/
        └── daily-quiz/
            └── page.tsx         # Quiz view (displays generated quizzes)

data/
└── quizzes.json                 # Stored quizzes database
```

---

## Database Schema

Quizzes are stored in `data/quizzes.json`:

```typescript
type Quiz = {
  id: string;                     // Unique ID
  slug: string;                   // URL-friendly: daily-prelims-2025-05-19
  title: string;                  // Display title
  questions: number;              // Total Q count
  duration: string;               // e.g., "30 min"
  type: "Prelims" | "Static" | "CSAT";
  date: string;                   // YYYY-MM-DD
  scheduledAt: string | null;     // Generation timestamp
  active: boolean;                // Available for users
  source: "manual" | "news" | "pdf" | "docx";
  items?: QuestionItem[];         // Question details
};
```

---

## How It Works - Flow Diagram

```
1. Cron Job Triggered
   ↓
2. Fetch 5 Latest News Articles (NewsAPI)
   ↓
3. For Each Article:
   - Send to Claude AI
   - Generate 4-8 UPSC MCQs
   - Validate JSON schema
   ↓
4. Aggregate ~20 Total Questions
   ↓
5. Create Quiz Object
   - Today's date as slug
   - Mark as source: "news"
   ↓
6. Save to data/quizzes.json
   - Deduplicate: replace today's quiz if exists
   - Keep last 30 days only
   ↓
7. Return Success Response
   ↓
8. Users See Quiz in UI
   `/prelims/daily-quiz/daily-prelims-2025-05-19`
```

---

## Troubleshooting

### Q: "NEWSAPI_KEY is not set"
**Solution:** Add `NEWSAPI_KEY` to `.env.local` and restart dev server

### Q: "No articles found"
**Solution:** Check NewsAPI quota (free tier: 100 requests/day) or try different search term

### Q: "Failed to generate questions"
**Solution:** 
- Verify `ANTHROPIC_API_KEY` is valid
- Check Claude API quota/credits
- Try with fewer questions (`count < 8`)

### Q: "Forbidden" when calling cron
**Solution:** Ensure `CRON_SECRET` in request matches `.env.local`

### Q: Quiz not appearing in UI
**Solution:** 
- Check `data/quizzes.json` exists and is valid JSON
- Verify `active: true` in quiz object
- Check slug matches URL route

---

## Performance Notes

| Metric | Value |
|--------|-------|
| Articles fetched | 5 |
| Questions per article | 4 |
| Total questions generated | ~20 |
| Execution time | 15-30 seconds |
| API calls | 1 × NewsAPI + 5 × Claude |
| Storage per quiz | ~10 KB |

---

## Next Steps

1. ✅ Add environment variables to `.env.local`
2. ✅ Test manually with curl
3. ✅ Set up external cron service
4. ✅ View generated quizzes at `/prelims/daily-quiz/`
5. ✅ Monitor `data/quizzes.json` growth

---

## Support

For issues, check:
- NewsAPI status: https://newsapi.org/docs
- Claude API docs: https://docs.anthropic.com
- Server logs: `npm run dev` output
