# Current Affairs News API Setup Guide

This guide helps you configure all news sources for comprehensive current affairs coverage.

## News Sources Currently Integrated

### 1. **NewsAPI.org** (Primary - Free Tier)
- **What it covers**: The Hindu, Indian Express, Times of India, PIB, Economy, UPSC/Admin, General India news
- **API Key**: `NEWSAPI_KEY`
- **Setup**:
  1. Go to https://newsapi.org/register
  2. Sign up for free account
  3. Get your API key from dashboard
  4. Add to `.env.local`:
     ```
     NEWSAPI_API_KEY=your_key_here
     ```
- **Free Tier**: 100 requests/day
- **Categories Covered**:
  - The Hindu Daily Affairs
  - Indian Express News
  - Times of India Coverage
  - PIB (Press Information Bureau) Updates
  - Economy & Finance News
  - UPSC/Admin Related News

---

### 2. **The Guardian Open Platform** (Free)
- **What it covers**: Global and India-focused news with editorial quality
- **API Key**: `GUARDIAN_API_KEY`
- **Setup**:
  1. Go to https://open-platform.theguardian.com/
  2. Sign up and register your application
  3. Get API key
  4. Add to `.env.local`:
     ```
     GUARDIAN_API_KEY=your_key_here
     ```
- **Free Tier**: Unlimited (within fair use)
- **Best For**: Editorial analysis and international perspective on Indian affairs

---

### 3. **NewsData.io** (Free Tier)
- **What it covers**: India-focused news with full article content
- **API Key**: `NEWSDATA_API_KEY`
- **Setup**:
  1. Go to https://newsdata.io/
  2. Sign up for free account
  3. Get API key from dashboard
  4. Add to `.env.local`:
     ```
     NEWSDATA_API_KEY=your_key_here
     ```
- **Free Tier**: 200 requests/day
- **Best For**: Full article content and India-specific filtering

---

### 4. **Inshorts API** (Free - No Key Required)
- **What it covers**: Quick news summaries for national, business, sports, entertainment
- **Setup**: No API key needed! Auto-enabled in the code
- **Best For**: Quick current affairs summaries, easy-to-read format
- **URL**: `https://inshortsapi.vercel.app/news?category=national`

---

## Complete `.env.local` Configuration

```
# News APIs
NEWSAPI_KEY=your_newsapi_key_here
GUARDIAN_API_KEY=your_guardian_key_here
NEWSDATA_API_KEY=your_newsdata_key_here

# Optional APIs (future expansion)
INSHORTS_API_KEY=not_required
```

---

## News Categories Fetched

The system now fetches from these categories:

### Government & Policy
- PIB (Press Information Bureau) releases
- Cabinet decisions
- Parliamentary updates
- Policy reforms

### Current Affairs (General)
- Ministry announcements
- Parliamentary bills
- Government reforms
- National policies

### Economics
- Budget news
- Market updates
- Financial policy
- Business news

### UPSC/Competitive Exams
- Civil services related news
- Administrative updates
- Government policy changes
- Public administration news

### Traditional News Sources
- The Hindu Daily
- Indian Express
- Times of India
- The Guardian (international perspective)

### Quick News
- Inshorts (5-10 line summaries)

---

## API Response Times

Expected response times per source:
- NewsAPI: 1-3 seconds
- The Guardian: 1-2 seconds
- NewsData.io: 1-3 seconds
- Inshorts: 0.5-1 second

**Total time for full refresh**: ~4-8 seconds (parallel fetching)

---

## Data Returned for Each Article

```javascript
{
  id?: string;              // Auto-generated
  title: string;            // Article headline
  description?: string;     // Short summary
  content?: string;         // Full article content (if available)
  url?: string;             // Original article link
  source?: string;          // Source name
  publishedAt?: string;     // Publication date (ISO format)
  author?: string;          // Author name (if available)
  image?: string;           // Article image/thumbnail URL
  channel?: string;         // Category/channel (The Hindu, PIB, Economy, etc.)
}
```

---

## Usage in Your Application

### Fetch latest news on demand:
```typescript
import { fetchMultiChannelNews } from '@/lib/news';

const { articles, byChannel } = await fetchMultiChannelNews(50);

// articles: Array of latest news (sorted by date)
// byChannel: Grouped by source
//   {
//     "The Hindu": [...],
//     "PIB": [...],
//     "Economy Times": [...],
//     ...
//   }
```

### Fetch specific category:
```typescript
import { 
  fetchPIBNews, 
  fetchEconomyNews, 
  fetchInshortsNews 
} from '@/lib/news';

const pibNews = await fetchPIBNews(10);
const economyNews = await fetchEconomyNews(10);
const quickNews = await fetchInshortsNews('national', 10);
```

---

## Automatic Refresh Endpoint

Your app has an auto-refresh endpoint:
```
GET /api/current-affairs/refresh
```

This:
1. Fetches latest from all sources
2. Creates a daily post
3. Assigns unique IDs to articles
4. Groups by channel
5. Stores in database

---

## Troubleshooting

### Missing articles?
- Check API keys in `.env.local`
- Verify free tier limits not exceeded
- Check API provider status pages

### Slow refresh?
- Increase timeout in code (currently 8 seconds)
- Use Promise.all() for parallel fetching (already implemented)
- Consider caching responses

### Duplicate articles?
- System automatically removes duplicates by comparing first 50 characters of title
- Duplicates are skipped during fetch

---

## Recommended Setup Steps

1. **Register for free API keys** (5-10 minutes each):
   - NewsAPI.org
   - The Guardian
   - NewsData.io

2. **Add to `.env.local`**:
   ```
   NEWSAPI_KEY=xxx
   GUARDIAN_API_KEY=xxx
   NEWSDATA_API_KEY=xxx
   ```

3. **Test the endpoint**:
   ```bash
   curl http://localhost:3000/api/current-affairs/refresh
   ```

4. **Set up cron jobs** (optional):
   - Refresh daily at 8 AM
   - Refresh at 2 PM
   - Auto-update current affairs feed

---

## API Rate Limits Summary

| API | Free Tier | Notes |
|-----|-----------|-------|
| NewsAPI | 100/day | Most reliable, covers major Indian sources |
| Guardian | Unlimited | No strict limits, fair use policy |
| NewsData.io | 200/day | Full content available |
| Inshorts | Unlimited | Free, no key needed |

---

## Future Enhancements

Consider adding:
- **Bing News API** for broader coverage
- **MediaStack API** for historical archives
- **RSS Feeds** from official sources (PIB, Ministry websites)
- **Custom scraping** from specific news sites (if they allow)
- **Webhook integration** for real-time updates

---

## Support & Issues

If news isn't fetching:
1. Check `/api/current-affairs/refresh` endpoint logs
2. Verify API keys and limits
3. Check browser console for errors
4. Review network tab for failed requests

---

**Last Updated**: May 2026
**Status**: ✅ All 4 sources integrated and tested
