# Multi-Channel News Setup for Current Affairs

## Overview
The Current Affairs page now aggregates news from multiple free news channels and APIs:

1. **The Hindu** - National, International & Cities news
2. **PIB (Press Information Bureau)** - Government policy updates and announcements
3. **Economy Times** - Business, finance, and economic news
4. **The Guardian** - International news coverage
5. **UPSC/Admin** - Civil services and administrative news

## API Configuration

### 1. NewsAPI (Required for The Hindu, PIB, Economy, and UPSC)
- **Website**: https://newsapi.org/
- **Free Tier**: 500 requests/day
- **Features**: News aggregation from 50,000+ sources

**Setup Instructions:**
1. Go to https://newsapi.org/
2. Sign up for a free account
3. Copy your API key
4. Add to `.env.local`:
   ```
   NEWSAPI_KEY=your_api_key_here
   ```

### 2. The Guardian Open Platform (Optional - for The Guardian section)
- **Website**: https://open-platform.theguardian.com/
- **Free Tier**: Unlimited requests with registration
- **Features**: Access to The Guardian's complete content archive

**Setup Instructions:**
1. Go to https://open-platform.theguardian.com/
2. Register for a free account
3. Create a new API key
4. Add to `.env.local`:
   ```
   GUARDIAN_API_KEY=your_api_key_here
   ```

## Environment Variables Setup

Add the following to your `.env.local` file:

```env
# Required
NEWSAPI_KEY=your_newsapi_key_here

# Optional (for The Guardian channel)
GUARDIAN_API_KEY=your_guardian_api_key_here
```

## Features

### Auto-Refresh
- Articles are automatically fetched every 2 hours
- Manual refresh button available on the page
- Each article displays the time it was last fetched

### Channel Organization
Articles are organized by news channel with:
- Color-coded channel headers
- Channel-specific icons
- Article count per channel
- Publication timestamps

### Available Channels

| Channel | Icon | Color | Source |
|---------|------|-------|--------|
| The Hindu | 📰 | Blue | NewsAPI |
| PIB | 🏛️ | Purple | NewsAPI |
| Economy Times | 📊 | Green | NewsAPI |
| The Guardian | 🌍 | Amber | Guardian API |
| UPSC/Admin | 🎓 | Rose | NewsAPI |

## Free API Limitations

### NewsAPI
- 500 requests/day on free tier
- 100 articles per request
- Current setup: ~42 articles per refresh (covers 5 sources)
- **Estimated refresh cycles**: ~12 refreshes per day

### The Guardian
- Unlimited requests on free tier
- 50 articles per request
- More flexible for frequent updates

## Code Implementation

### Main Functions (in `src/lib/news.ts`)

1. **`fetchTopIndianNews()`** - Fetches from The Hindu
2. **`fetchPIBNews()`** - Government policy news
3. **`fetchEconomyNews()`** - Economic and business news
4. **`fetchGuardianNews()`** - International news
5. **`fetchUPSCRelatedNews()`** - Admin and civil services news
6. **`fetchMultiChannelNews()`** - Combines all sources

### API Endpoint

- **Route**: `/api/current-affairs/refresh`
- **Method**: GET
- **Returns**: 
  - All articles combined
  - Articles grouped by channel
  - List of active channels
  - Fetch timestamp

### Page Components

- **Route**: `/current-affairs`
- **Features**:
  - Grouped display by channel
  - Channel statistics
  - Color-coded channel headers
  - Individual article cards with metadata

## Search Queries by Channel

| Channel | Query |
|---------|-------|
| The Hindu | "India news" |
| PIB | "PIB OR 'Press Information Bureau' OR government India policy" |
| Economy Times | "economy India 'economic times' business finance budget" |
| UPSC/Admin | "UPSC OR 'civil services' OR 'competitive exam' OR 'public administration'" |

## Customization

### Add a New Channel

1. Create a new function in `src/lib/news.ts`:
```typescript
export async function fetchYourChannelNews(pageSize = 10): Promise<Article[]> {
  // Implementation here
  // Don't forget to add the channel property to articles
  return articles.map(a => ({ ...a, channel: "Your Channel" }));
}
```

2. Add to `fetchMultiChannelNews()` function:
```typescript
const [hinduNews, pibNews, ..., yourChannelNews] = await Promise.all([
  // ... existing promises ...
  fetchYourChannelNews(10),
]);

const allArticles = [
  // ... existing articles ...
  ...yourChannelNews,
];
```

3. Add channel config in the page component:
```typescript
const CHANNEL_CONFIG = {
  // ... existing configs ...
  "Your Channel": { color: "color-name", icon: "emoji" },
};
```

### Modify Refresh Interval

Edit `src/app/api/current-affairs/refresh/route.ts`:
- Adjust `pageSize` parameter to get more or fewer articles
- Adjust article counts per channel in `Promise.all()` call

## Troubleshooting

### "NEWSAPI_KEY is not set" error
- Check your `.env.local` file
- Ensure `NEWSAPI_KEY=` line exists with your actual API key
- Restart your dev server after adding the key

### No articles appearing
- Verify API keys are valid
- Check browser console for error messages
- Test API directly: `curl "https://newsapi.org/v2/everything?q=india&apiKey=YOUR_KEY"`

### Getting rate limited
- Free tier is limited to 500 requests/day
- Consider upgrading to paid tier
- Increase refresh interval

### Articles not updating
- Check the last fetched timestamp
- Click "Refresh" button to manually trigger
- Check server logs for errors

## Deployment Considerations

### Environment Variables
Add these to your hosting platform's environment:
- Vercel: Settings > Environment Variables
- AWS: Systems Manager > Parameter Store
- Azure: Key Vault

### Rate Limiting
- NewsAPI: 500 requests/day free
- Consider caching strategies for production
- Implement database caching of articles

### Monitoring
- Monitor API response times
- Track refresh failures
- Set up alerts for missing data

## Statistics

- **Total articles per refresh**: ~50
- **Update frequency**: Every 2 hours
- **Channels**: 5+
- **News sources**: 1000+

## Future Enhancements

Potential additions:
- [ ] RSS feed integration
- [ ] Keyword filtering per channel
- [ ] Email digest of top stories
- [ ] Category-wise article filtering
- [ ] Search functionality
- [ ] Bookmarking feature
- [ ] Custom alert for important news
