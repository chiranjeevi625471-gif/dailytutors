# The Hindu Daily Current Affairs Setup

## Overview
Daily Current Affairs feed exclusively from The Hindu news API with no mentions of other edtech institutions.

## What's New

### 1. **New Dedicated Page**
- **URL:** `/current-affairs/the-hindu`
- **Features:**
  - Clean article grid with images
  - Author and publication date
  - Direct links to The Hindu
  - Refresh button for latest articles
  - Modern, responsive design

### 2. **Dedicated API Endpoint**
- **Endpoint:** `GET /api/current-affairs/the-hindu?limit=25`
- **Returns:** JSON with articles from The Hindu only
- **Params:** `limit` (1-100, default 25)

### 3. **Enhanced News Fetching**
- New `fetchTheHinduDailyAffairs()` function
- Filters specifically for The Hindu source
- Automatic fallback to general news if needed

### 4. **Updated Daily Refresh**
- Now refreshes from The Hindu only
- Updated descriptions (no other edtech mentions)
- More focused content

## Setup Instructions

### Step 1: Verify API Key
Make sure you have a NewsAPI key in `.env.local`:

```env
NEWSAPI_KEY=your_newsapi_key_here
```

Get a free key at: https://newsapi.org

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Test the Page
Open browser and go to:
```
http://localhost:3000/current-affairs/the-hindu
```

You should see articles from The Hindu with:
- ✅ Article titles and descriptions
- ✅ Author names
- ✅ Publication dates
- ✅ Article images
- ✅ Links to read full articles
- ✅ Source badge showing "The Hindu"

### Step 4: Test the API
You can also test the API directly:

```bash
# Fetch 30 articles from The Hindu
curl "http://localhost:3000/api/current-affairs/the-hindu?limit=30"
```

Response:
```json
{
  "ok": true,
  "source": "The Hindu",
  "count": 30,
  "timestamp": "2024-01-15T10:30:00Z",
  "articles": [
    {
      "title": "Article Title",
      "description": "Article description...",
      "url": "https://thehindu.com/...",
      "source": "The Hindu",
      "publishedAt": "2024-01-15T08:00:00Z",
      "author": "Author Name",
      "image": "https://...",
      "channel": "The Hindu"
    },
    ...
  ]
}
```

## Features

✅ **The Hindu Only** - All articles from The Hindu news source
✅ **No Other Edtech** - No mentions of other institutions
✅ **Auto-Refresh** - New endpoint to get latest articles
✅ **Clean UI** - Modern, responsive interface
✅ **Direct Links** - Click to read full articles on The Hindu
✅ **Flexible API** - Use the endpoint for your own integration

## Files Modified/Created

1. ✅ `src/lib/news.ts` - Added `fetchTheHinduDailyAffairs()` function
2. ✅ `src/app/api/current-affairs/refresh/route.ts` - Updated for The Hindu only
3. ✅ `src/app/api/current-affairs/the-hindu/route.ts` - NEW API endpoint
4. ✅ `src/app/current-affairs/the-hindu/page.tsx` - NEW dedicated page

## Usage Examples

### Display Latest Articles on Homepage
```typescript
import { fetchTheHinduDailyAffairs } from '@/lib/news';

const articles = await fetchTheHinduDailyAffairs(10);
```

### In Your Components
```typescript
// Fetch from API
const response = await fetch('/api/current-affairs/the-hindu?limit=20');
const { articles } = await response.json();
```

## Daily Auto-Refresh

The `/api/current-affairs/refresh` endpoint now automatically:
1. Fetches latest articles from The Hindu
2. Creates/updates today's post
3. Stores articles in database
4. Keeps only last 30 days of posts

You can call this manually or set up a cron job to run daily.

## Troubleshooting

### No articles appearing?
1. Check that `NEWSAPI_KEY` is set in `.env.local`
2. Verify the API key is valid at https://newsapi.org
3. Restart dev server with `npm run dev`

### Articles not updating?
1. Click "Refresh Articles" button on the page
2. Or call `/api/current-affairs/refresh` endpoint
3. Check browser console for errors

### Getting API limit errors?
- NewsAPI free tier has 500 requests/day
- Space out your API calls or upgrade plan

## Next Steps

1. ✅ Visit `/current-affairs/the-hindu` to see the page
2. ✅ Click "Refresh Articles" to test fetching
3. ✅ Click article links to verify they go to The Hindu
4. ✅ Test the API endpoint with different limits
5. ✅ Set up daily cron job if needed (optional)

## API Rate Limits

**NewsAPI (free tier):**
- 500 requests/day
- ~16 requests/hour

**Recommended usage:**
- Refresh every 1-2 hours
- Keep articles for 30 days
- Batch requests when possible

## Support

All articles come exclusively from The Hindu with no mentions of other edtech institutions in descriptions, excerpts, or metadata.
