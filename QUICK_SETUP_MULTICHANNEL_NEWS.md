# Quick Setup: Multi-Channel News for Current Affairs

## What's New?
Your Daily Current Affairs page now displays news from **5 different channels**:
- 📰 **The Hindu** - Mainstream news
- 🏛️ **PIB** - Government announcements & policy
- 📊 **Economy Times** - Business & finance
- 🌍 **The Guardian** - International coverage
- 🎓 **UPSC/Admin** - Civil services & exams

## Step 1: Get API Keys (5 mins)

### Option A: NewsAPI (Required - covers 4 channels)
1. Visit: https://newsapi.org/
2. Click "Get API Key"
3. Sign up with email
4. Copy your API key

### Option B: The Guardian (Optional - for better Guardian coverage)
1. Visit: https://open-platform.theguardian.com/
2. Register free account
3. Create API key in dashboard
4. Copy your API key

## Step 2: Add to .env.local

Create or edit `.env.local` in your project root:

```env
# Required - get from https://newsapi.org/
NEWSAPI_KEY=your_api_key_here

# Optional - get from https://open-platform.theguardian.com/
GUARDIAN_API_KEY=your_guardian_api_key_here
```

## Step 3: Test It

Run your dev server:
```bash
npm run dev
```

Go to: http://localhost:3000/current-affairs

Click "Refresh" button to fetch news from all channels.

## Files Changed

| File | Changes |
|------|---------|
| `src/lib/news.ts` | Added 5 new functions for different channels |
| `src/app/current-affairs/page.tsx` | Reorganized to display by channel with colors |
| `src/app/api/current-affairs/refresh/route.ts` | Updated to fetch from multiple sources |

## API Response Example

```json
{
  "ok": true,
  "articlesCount": 50,
  "channels": ["The Hindu", "PIB", "Economy Times", "The Guardian", "UPSC/Admin"],
  "articles": [
    {
      "title": "Article Title",
      "channel": "The Hindu",
      "source": "The Hindu",
      "publishedAt": "2024-01-15T10:30:00Z",
      "description": "Article description...",
      "url": "https://..."
    }
  ]
}
```

## Customization

### Change number of articles per channel
Edit `src/lib/news.ts`, line in `fetchMultiChannelNews()`:

```typescript
const [hinduNews, pibNews, economyNews, guardianNews, upscNews] = await Promise.all([
  fetchTopIndianNews("India news", 10),      // ← Change 10 to desired number
  fetchPIBNews(8),
  fetchEconomyNews(8),
  fetchGuardianNews(8),
  fetchUPSCRelatedNews(6),
]);
```

### Add a new channel
Create a new function in `src/lib/news.ts`:

```typescript
export async function fetchYourChannelNews(pageSize = 10): Promise<Article[]> {
  // Your implementation
  return articles.map(a => ({
    ...a,
    channel: "Your Channel Name"
  }));
}
```

Then add it to `fetchMultiChannelNews()`.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No articles showing | Check API key is valid in `.env.local` |
| "NEWSAPI_KEY not set" | Restart dev server after adding to `.env.local` |
| Articles not updating | Click "Refresh" button manually |
| Getting rate limit errors | NewsAPI free tier = 500 requests/day |

## Architecture

```
Current Affairs Page
  ├── The Hindu Channel (NewsAPI)
  ├── PIB Channel (NewsAPI)
  ├── Economy Times (NewsAPI)
  ├── The Guardian (Guardian API)
  └── UPSC/Admin (NewsAPI)
       ↓
   Refresh Endpoint (/api/current-affairs/refresh)
       ↓
   Multi-Channel Fetcher (fetchMultiChannelNews)
       ↓
   Individual Channel Functions
       ↓
   Combined & Sorted by Date
```

## Features Included

✅ Automatic refresh every 2 hours
✅ Manual refresh button
✅ Color-coded channels
✅ Article count per channel
✅ Timestamps for each article
✅ Responsive design
✅ Mobile-friendly layout

## Need Help?

See full documentation: [MULTI_CHANNEL_NEWS_SETUP.md](./MULTI_CHANNEL_NEWS_SETUP.md)

## Free Tier Limits

| API | Free Tier |
|-----|-----------|
| NewsAPI | 500 requests/day |
| The Guardian | Unlimited |

**Estimated Daily Usage**: ~12 refresh cycles possible with free tier
