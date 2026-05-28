# Current Affairs Auto-Refresh on Startup

## ✅ What Happens When You Run `npm run dev`

### Timeline:

```
$ npm run dev

[SECOND 0] Starting Next.js dev server...
[SECOND 5] ✅ Server ready at http://localhost:3000

[SECOND 5] [APIs] 🚀 API Runner Started
[SECOND 5] [APIs] Waiting 5 seconds for server to start...

[SECOND 10] [APIs] 📋 Running initial API setup...
[SECOND 10-15] [APIs] ✅ Current Affairs Refresh (200)
              └─ Fetches from 9 news sources (~50 articles)
              └─ Saves to database
              └─ Groups by channel

[SECOND 15-20] [APIs] ✅ Daily Affairs Generation (200)
[SECOND 20-25] [APIs] ✅ Daily Quiz Generation (200)

[SECOND 25] [APIs] ✨ API initialization complete!

[SECOND 25] [APIs] 📅 Scheduling periodic API calls:
            • Current Affairs: Every 2 hours
            • Daily Affairs: Every 6 hours
            • Daily Quiz: Every 12 hours
```

---

## 🎯 What Gets Auto-Loaded:

### 1. Current Affairs (~50 articles from 9 sources)
- **The Hindu** - Daily journalism
- **Indian Express** - Editorial analysis
- **Times of India** - National news
- **PIB** - Government releases
- **Economy** - Business news
- **UPSC/Admin** - Competitive exam news
- **Current Affairs** - Policy news
- **The Guardian** - International perspective
- **Inshorts** - Quick summaries

### 2. Daily Affairs
- Curated current affairs digest

### 3. Daily Quiz
- 20 random questions

---

## 🔧 Required Setup (Before Running `npm run dev`)

### Step 1: Create `.env.local`

```bash
# Required - Get from https://newsapi.org
NEWSAPI_KEY=your_newsapi_key_here

# Recommended - Get from https://newsdata.io
NEWSDATA_API_KEY=your_newsdata_key_here

# Optional - Get from https://open-platform.theguardian.com
GUARDIAN_API_KEY=your_guardian_key_here
```

### Step 2: Verify Database

The app uses a simple JSON-based database (data/posts.json). No setup needed, but ensure:
- `data/` folder exists
- `data/posts.json` is readable/writable

### Step 3: Run Dev Server

```bash
npm run dev
```

Watch the console for:
```
[APIs] ✅ Current Affairs Refresh (200)
```

If you see a 200 status, it worked! 🎉

---

## 📍 How to Access the Current Affairs

Once running, visit:
```
http://localhost:3000/current-affairs
```

You'll see:
- All articles organized by channel
- Click channel button to filter
- Click article to read full details
- All 9 sources' content displayed

---

## ❓ Troubleshooting

### Current Affairs showing "No articles"?

**Check 1: API Key Issue**
```bash
# View the scripts/run-apis.js output
# Look for: [APIs] ❌ Current Affairs Refresh
# This means API key is missing or wrong
```

**Solution:**
1. Get NEWSAPI_KEY from https://newsapi.org
2. Add to `.env.local`:
   ```
   NEWSAPI_KEY=abc123...
   ```
3. Restart dev server: `npm run dev`

### Current Affairs showing "Empty"?

**Check 2: API Limit**
- NewsAPI free tier: 100 requests/day
- If limit exceeded, wait 24 hours

**Check 3: API Response Issue**
- Check browser console for errors
- Run this in terminal:
  ```bash
  curl "http://localhost:3000/api/current-affairs/refresh?secret=e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da"
  ```
- You should get JSON response with articles

### Too few articles?

**Add optional API keys:**
```
NEWSDATA_API_KEY=your_key_here    # +8 sources
GUARDIAN_API_KEY=your_key_here    # +8 sources
```

This increases coverage from ~50 to ~70+ articles.

---

## 🔄 Auto-Refresh Schedule

Once startup completes, the system automatically refreshes:

```
Current Affairs    → Every 2 hours
Daily Affairs      → Every 6 hours  
Daily Quiz         → Every 12 hours
```

View refresh logs in your terminal as they happen.

---

## 📊 What Gets Saved

Each refresh saves to `data/posts.json`:

```javascript
{
  id: "post-xyz123",
  title: "Daily Current Affairs — May 27, 2026",
  date: "2026-05-27",
  category: "Daily",
  articles: [
    {
      id: "article-2026-05-27-0-abc",
      title: "Article Headline",
      description: "Summary...",
      content: "Full article text...",
      url: "https://...",
      source: "The Hindu",
      publishedAt: "2026-05-27T10:30:00Z",
      channel: "The Hindu"
    },
    // ... 49 more articles
  ],
  lastFetched: "2026-05-27T10:35:22.123Z"
}
```

---

## ✨ Features After Startup

### Browse by Channel
- Click "The Hindu" → See only The Hindu articles
- Click "PIB" → See only government updates
- Click "Economy" → See only business news
- Etc.

### Read Full Articles
- Click any headline
- See complete article with:
  - Full content
  - Key highlighted terms
  - UPSC relevance
  - Original source link

### Search & Filter
- Articles sorted by newest first
- Grouped by source/channel
- Deduplication (no repeat articles)

---

## 🚀 Commands Reference

```bash
# Start dev with auto-refresh
npm run dev

# Just Next.js (no auto-refresh)
npm run dev-server

# Manual refresh (if needed)
curl http://localhost:3000/api/current-affairs/refresh?secret=e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da

# Production build
npm run build

# Production run
npm start
```

---

## 📝 Notes

- **First Run**: Takes 10-15 seconds total (including startup delay)
- **Subsequent Runs**: <5 seconds (cached articles)
- **No Network**: Falls back to previous articles if APIs fail
- **Error Handling**: If one API fails, others continue
- **Database**: Local JSON file (no external DB needed)

---

**Status**: ✅ Auto-refresh enabled on server startup
**Next Step**: Add API keys to `.env.local` and run `npm run dev`
**Last Updated**: May 27, 2026
