# Analysis Pages Setup Guide

## Why You're Getting "Failed to fetch analysis"

The new analysis pages need **NEWSAPI_KEY** to fetch current news and generate AI-powered analysis.

## Quick Fix (3 steps)

### 1. Get a FREE News API Key
- Go to: https://newsapi.org
- Click "Register"
- Fill the form (takes 2 minutes)
- Check your email for activation
- Copy your API key from dashboard

### 2. Add to Vercel Environment Variables
- Go to: https://vercel.com/dashboard
- Select your **dailytutors** project
- Settings → **Environment Variables**
- Add new variable:
  - **Name**: `NEWSAPI_KEY`
  - **Value**: Paste your API key
  - Click **Save**

### 3. Redeploy
- Go to **Deployments** tab
- Click latest deployment
- Click **Redeploy**
- Wait 2-3 minutes for build to complete

## Verify It Works

After redeploy, visit any of these pages:
- `/daily-news-analysis`
- `/editorial-analysis`
- `/pib-summary`
- `/yojana-kurukshetra`

Click the **Refresh** button. If you see content instead of error → **Success!** ✅

## How It Works

1. **News Fetching** (NewsAPI)
   - Fetches latest articles based on search query
   - Examples: "India politics economy", "government schemes", etc.

2. **AI Analysis** (Groq API)
   - Analyzes fetched articles
   - Generates 500-1000 word summaries
   - Adds UPSC Civil Services perspective

3. **Display**
   - Shows analysis with formatted sections
   - Links to original news sources

## FAQ

**Q: Can I use a paid NewsAPI plan?**
A: Yes, but the free plan gives 100 requests/day, which is enough for ~5 refreshes/hour.

**Q: What if I already have NEWSAPI_KEY set?**
A: Check Vercel logs:
- Deployments → Latest → Function Logs
- Look for `Error fetching Indian news:` messages

**Q: Will this charge me?**
A: 
- NewsAPI: Free for 100 requests/day ✅
- Groq: Free for limited requests ✅

## Troubleshooting

### Still getting error after redeploy?

1. **Check Function Logs**:
   - Vercel Dashboard → Deployments → Latest → Function Logs
   - Look for errors mentioning "NEWSAPI_KEY" or "NewsAPI"

2. **Verify API Key Works**:
   ```
   curl "https://newsapi.org/v2/everything?q=India&apiKey=YOUR_KEY_HERE"
   ```

3. **Check Variable Format**:
   - No quotes around the key
   - No spaces before/after
   - Exact case (usually all uppercase)

### "No news available" error?

This means NEWSAPI_KEY is set but:
- Daily limit (100) reached
- Invalid API key
- Network timeout

Try again after 1 hour, or check key validity at newsapi.org dashboard.

## Need Help?

Check these files in the repo:
- [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) - General Vercel setup
- [src/lib/news.ts](./src/lib/news.ts) - News fetching logic
- [src/app/api/analysis/](./src/app/api/analysis/) - API routes

---

**TL;DR**: Get free key from newsapi.org, add to Vercel as `NEWSAPI_KEY`, redeploy. Done! 🚀
