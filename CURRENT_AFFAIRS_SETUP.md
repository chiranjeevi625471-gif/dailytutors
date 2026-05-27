# Daily Current Affairs Auto-Update Setup Guide

## Overview
The Daily Current Affairs page now automatically fetches the latest news from **The Hindu** newspaper once per day (every 24 hours). The news is fetched from three sections: National, International, and Cities.

## Features

✅ **Automatic Updates**: News updates automatically every 24 hours
✅ **Manual Refresh**: Users can manually refresh on the current affairs page
✅ **Live Countdown**: Shows how long until the next automatic refresh
✅ **The Hindu Integration**: Fetches from The Hindu RSS feeds
✅ **30-Day Archive**: Keeps last 30 days of posts to manage storage

## Setup Instructions

### 1. Set Environment Variables

Add the following to your `.env.local` file:

```env
CRON_SECRET=your_secure_random_secret_key_here
```

Generate a secure secret:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 2. Configure Cron Jobs

You have two options to trigger the cron job every 2 hours:

#### Option A: Using an External Cron Service (Recommended)

Use services like:
- **Vercel Cron** (if deployed on Vercel)
- **EasyCron** (https://www.easycron.com)
- **cron-job.org** (https://cron-job.org)

**Setup Example for EasyCron:**

1. Go to https://www.easycron.com
2. Create a new cron job with:
   - **URL**: `https://your-domain.com/api/cron/daily-affairs`
   - **HTTP Method**: `POST`
   - **Authentication**: Add header `X-Cron-Secret: your_secure_random_secret_key_here`
   - **Schedule**: Once daily at midnight (0 0 * * *)
   - **Cron Expression**: `0 0 * * *`

**Setup Example for Vercel Cron (if using Vercel):**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-affairs",
      "schedule": "0 0 * * *"
    }
  ]
}
```

#### Option B: Using GitHub Actions (Free Alternative)

Create `.github/workflows/daily-affairs-cron.yml`:

```yaml
name: Daily Affairs Cron

on:
  schedule:
    - cron: '0 0 * * *'  # Once daily at midnight
  workflow_dispatch:

jobs:
  update-news:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch current affairs news
        run: |
          curl -X POST \
            -H "X-Cron-Secret: ${{ secrets.CRON_SECRET }}" \
            "https://your-domain.com/api/cron/daily-affairs"
```

Add `CRON_SECRET` to GitHub repository secrets.

### 3. API Endpoints

#### Automatic Cron Endpoint
- **URL**: `/api/cron/daily-affairs`
- **Method**: `GET` or `POST`
- **Header**: `X-Cron-Secret` or `Authorization: Bearer <secret>`
- **Query Parameter** (alternative): `?secret=<secret>`

**Response Example:**
```json
{
  "ok": true,
  "message": "Current affairs post updated with fresh articles",
  "date": "2026-05-19",
  "articlesCount": 15,
  "source": "The Hindu (National, International, Cities)"
}
```

#### Manual Refresh Endpoint
- **URL**: `/api/current-affairs/refresh`
- **Method**: `GET`
- **No authentication required** (can be called from frontend)

**Response Example:**
```json
{
  "ok": true,
  "message": "Current affairs refreshed successfully",
  "articlesCount": 15,
  "articles": [...]
}
```

### 4. Frontend Auto-Refresh

The current affairs page includes:
- **Auto-refresh countdown**: Shows time until next update
- **Manual refresh button**: Users can click to refresh immediately
- **News display**: Shows all fetched articles from The Hindu

The countdown timer updates every second and automatically reloads the page when the interval is reached.

## News Sources

The system fetches news from The Hindu's RSS feeds:
- National News: `https://www.thehindu.com/news/national/?service=rss`
- International News: `https://www.thehindu.com/news/international/?service=rss`
- Cities News: `https://www.thehindu.com/news/cities/?service=rss`

Maximum **15 articles** are fetched and displayed per update.

## Testing

### Test the Cron Endpoint

```bash
# Test with header authentication
curl -X POST \
  -H "X-Cron-Secret: your_secret_key" \
  http://localhost:3000/api/cron/daily-affairs

# Test with query parameter
curl -X POST \
  "http://localhost:3000/api/cron/daily-affairs?secret=your_secret_key"
```

### Test Manual Refresh

```bash
curl http://localhost:3000/api/current-affairs/refresh
```

## Data Storage

News articles are stored in:
- **File**: `data/posts.json`
- **Structure**: Each post has an `articles` array with fetched news items
- **Retention**: Only last 30 days of posts are kept
- **Format**: JSON

## Troubleshooting

### News not updating?

1. Check if `CRON_SECRET` is set in environment variables
2. Verify the cron job is configured correctly
3. Check application logs for errors
4. Test the endpoint manually using curl

### RSS feed not accessible?

1. Verify internet connectivity
2. Check if The Hindu's RSS feeds are accessible: https://www.thehindu.com/news/national/?service=rss
3. Check application logs for specific errors

### High disk usage?

The system automatically keeps only last 30 days of posts. If needed, manually remove old posts from `data/posts.json`.

## Performance Tips

1. **Cron Timing**: Run during off-peak hours (early morning IST recommended)
2. **Cache Headers**: The RSS feed endpoint uses `cache: "no-store"` to get fresh content
3. **File Size**: 30-day retention with 15 articles every 2 hours = manageable file size

## Future Enhancements

Consider implementing:
- Category filtering (GS1, GS2, GS3, GS4, etc.)
- AI-powered summarization
- Email notifications for important news
- Mobile app integration
- Search functionality
- Archive pagination
