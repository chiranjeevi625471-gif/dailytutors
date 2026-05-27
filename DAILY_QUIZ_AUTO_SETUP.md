# Auto-Generate Daily Quiz from Current Affairs Setup

## Overview
Your system **automatically generates daily quiz questions** from current affairs news with **zero manual intervention**.

### Flow:
1. **Once daily (midnight UTC / 5:30 AM IST)**: Current affairs fetches latest news from The Hindu
2. **Once daily (midnight UTC / 5:30 AM IST)**: AI generates 10+ unique quiz questions from the news
3. **No duplication**: Each day has exactly one quiz (dated slug prevents repeats)
4. **Fully automated**: Uses GitHub Actions (free & built-in)

---

## Quick Setup (5 minutes)

### Step 1: Set CRON_SECRET in GitHub

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `CRON_SECRET`
4. Value: Generate a secure key:
   ```bash
   openssl rand -hex 32
   # Output example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
5. Click **Add secret**

### Step 2: Add to .env.local (for local testing)

```env
CRON_SECRET=your_secure_random_secret_key_here
```

### Step 3: Deploy to Vercel (or your hosting)

Push your code with the GitHub Actions workflows included. They'll activate automatically.

---

## How It Works

### Current Cron Jobs

#### 1. Daily Current Affairs Update (`daily-affairs-cron.yml`)
- **Schedule**: Once daily at midnight UTC (5:30 AM IST)
- **What it does**: Fetches latest 15 articles from The Hindu
- **Endpoint**: `/api/cron/daily-affairs`
- **Storage**: Keeps 30 days of posts

#### 2. Daily Quiz Auto-Generation (`daily-quiz-cron.yml`)
- **Schedule**: Once daily at midnight UTC (5:30 AM IST)
- **What it does**: Generates 10 MCQs from today's current affairs
- **Questions generated from**: Real news articles (The Hindu)
- **AI used**: Groq to create meaningful questions
- **Endpoint**: `/api/cron/daily-quiz`
- **Deduplication**: Replaces yesterday's quiz, no repetition

---

## Testing Locally

### Test Current Affairs Cron
```bash
curl -X POST \
  -H "x-cron-secret: your_secret_here" \
  http://localhost:3000/api/cron/daily-affairs
```

### Test Daily Quiz Cron
```bash
curl -X POST \
  -H "x-cron-secret: your_secret_here" \
  http://localhost:3000/api/cron/daily-quiz
```

---

## Manual Refresh (Optional)

Users can manually refresh without authentication:

```bash
curl http://localhost:3000/api/current-affairs/refresh
```

---

## Environment Variables Needed

### Required
- `CRON_SECRET` - Secret key for cron endpoints

### Optional (if using Groq for quiz generation)
- `GROQ_API_KEY` - For AI question generation

---

## File Structure

```
.github/
  workflows/
    daily-affairs-cron.yml      # Current affairs every 2 hours
    daily-quiz-cron.yml         # Quiz generation daily at 8:30 AM & 2:30 PM IST
```

---

## Verification

Check if it's working:

1. **GitHub**: Go to your repo → **Actions** → See scheduled workflows running
2. **Quiz page**: Visit `/prelims/daily-quiz` - should show today's generated quiz
3. **Current Affairs**: Visit `/current-affairs` - should show latest news

---

## Customization

### Change Quiz Generation Time
Edit `.github/workflows/daily-quiz-cron.yml`:
```yaml
schedule:
  - cron: '0 3 * * *'  # Change the times here
```

### Change Current Affairs Update Frequency
Edit `.github/workflows/daily-affairs-cron.yml`:
```yaml
schedule:
  - cron: '0 */4 * * *'  # Every 4 hours instead of 2
```

### Change Number of Questions
In `/api/cron/daily-quiz/route.ts`, modify the `count` parameter:
```
curl ... -d '{"count": 15}' ...  # Changes from 10 to 15 questions
```

---

## Flow Diagram

```
News Events (The Hindu)
        ↓
[GitHub Actions] Every 2h
        ↓
/api/cron/daily-affairs
        ↓
Fetches & stores articles
        ↓
[GitHub Actions] Daily 8:30 AM & 2:30 PM
        ↓
/api/cron/daily-quiz
        ↓
AI generates 10 MCQs from articles
        ↓
Stores with today's date (no duplication)
        ↓
Home page displays:
- Today's quiz
- Today's current affairs
```

---

## Troubleshooting

### Quiz not generating?
1. Check GitHub Actions logs: Repo → Actions → daily-quiz-cron
2. Verify `CRON_SECRET` is set in GitHub Secrets
3. Check application logs for API errors

### Current affairs not updating?
1. Check GitHub Actions logs: Repo → Actions → daily-affairs-cron
2. Verify internet/DNS access to The Hindu RSS feeds
3. Check `.env` variables are loaded

### Both working but quiz seems outdated?
- Wait for next scheduled run (check GitHub Actions schedule)
- Or manually trigger: Go to Actions → Run workflow

---

## Support

For API endpoint details, see:
- `/api/cron/daily-affairs` - Current affairs update
- `/api/cron/daily-quiz` - Quiz generation
- `/api/current-affairs/refresh` - Manual refresh (no auth)

All configured for **ZERO MANUAL INTERVENTION** ✅
