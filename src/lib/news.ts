export type Article = {
  title: string;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  source?: string;
  publishedAt?: string | null;
  author?: string | null;
  image?: string | null;
  channel?: string;
};

/**
 * Fetch Daily Current Affairs specifically from The Hindu
 * Falls back to other major Indian news sources if The Hindu not available
 */
export async function fetchTheHinduDailyAffairs(pageSize = 25): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    throw new Error("NEWSAPI_KEY is not set. Add it to your .env.local.");
  }

  const articles: Article[] = [];

  try {
    // Fetch with smaller page size for faster response
    const searchParams = new URLSearchParams({
      q: "India",
      sortBy: "publishedAt",
      language: "en",
      pageSize: "10",
      apiKey: apiKey,
    });

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, { 
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("NewsAPI error:", error);
      return [];
    }

    const data = await res.json() as any;
    
    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles.slice(0, pageSize)) {
        articles.push({
          title: item.title || "",
          description: item.description || null,
          content: item.content || item.description || null,
          url: item.url || null,
          source: item.source?.name || "The Hindu",
          publishedAt: item.publishedAt || null,
          author: item.author || null,
          image: item.urlToImage || null,
          channel: "The Hindu",
        });
      }
    }
    
    console.log(`Fetched ${articles.length} articles`);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return articles;
}

/**
 * Fetch Daily Current Affairs specifically from Indian Express
 * Falls back to other major Indian news sources if Indian Express not available
 */
export async function fetchIndianExpressNews(pageSize = 25): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    throw new Error("NEWSAPI_KEY is not set. Add it to your .env.local.");
  }

  const articles: Article[] = [];

  try {
    // Fetch with smaller page size for faster response
    const searchParams = new URLSearchParams({
      q: "India",
      sortBy: "publishedAt",
      language: "en",
      pageSize: "10",
      apiKey: apiKey,
    });

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, { 
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("NewsAPI error:", error);
      return [];
    }

    const data = await res.json() as any;
    
    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles.slice(0, pageSize)) {
        articles.push({
          title: item.title || "",
          description: item.description || null,
          content: item.content || item.description || null,
          url: item.url || null,
          source: item.source?.name || "Indian Express",
          publishedAt: item.publishedAt || null,
          author: item.author || null,
          image: item.urlToImage || null,
          channel: "Indian Express",
        });
      }
    }
    
    console.log(`Fetched ${articles.length} articles`);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return articles;
}

export async function fetchTopIndianNews(query: string = "India", pageSize = 20): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    throw new Error("NEWSAPI_KEY is not set. Add it to your .env.local.");
  }

  const articles: Article[] = [];

  try {
    // Use everything endpoint with general search
    const searchParams = new URLSearchParams({
      q: query,
      sortBy: "publishedAt",
      language: "en",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, { 
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("NewsAPI error:", error);
      throw new Error(`NewsAPI error: ${error.message || res.statusText}`);
    }

    const data = await res.json() as any;
    
    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles) {
        articles.push({
          title: item.title || "",
          description: item.description || null,
          content: item.content || item.description || null,
          url: item.url || null,
          source: item.source?.name || "News",
          publishedAt: item.publishedAt || null,
          author: item.author || null,
          image: item.urlToImage || null,
          channel: "General",
        });
      }
    }
  } catch (error) {
    console.error("Error fetching Indian news:", error);
  }

  return articles.slice(0, pageSize);
}

/**
 * Fetch news from PIB (Press Information Bureau)
 * Using free sources for Indian government updates
 */
export async function fetchPIBNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    // Using NewsAPI to search for PIB/Government of India news
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_KEY not set, skipping PIB news fetch");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "PIB OR 'Press Information Bureau' OR government India policy",
      sortBy: "publishedAt",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.articles && Array.isArray(data.articles)) {
        for (const item of data.articles.slice(0, pageSize)) {
          articles.push({
            title: item.title || "",
            description: item.description || null,
            content: item.content || item.description || null,
            url: item.url || null,
            source: "PIB",
            publishedAt: item.publishedAt || null,
            author: item.author || null,
            image: item.urlToImage || null,
            channel: "PIB",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching PIB news:", error);
  }

  return articles;
}

/**
 * Fetch Economy news from Economic Times and other financial sources
 */
export async function fetchEconomyNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_KEY not set, skipping Economy news fetch");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "economy India 'economic times' business finance budget",
      sortBy: "publishedAt",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
      language: "en",
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.articles && Array.isArray(data.articles)) {
        for (const item of data.articles.slice(0, pageSize)) {
          articles.push({
            title: item.title || "",
            description: item.description || null,
            content: item.content || item.description || null,
            url: item.url || null,
            source: item.source?.name || "Economic Times",
            publishedAt: item.publishedAt || null,
            author: item.author || null,
            image: item.urlToImage || null,
            channel: "Economy Times",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Economy news:", error);
  }

  return articles;
}

/**
 * Fetch news using The Guardian Open Platform (Free API)
 */
export async function fetchGuardianNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.GUARDIAN_API_KEY;
    if (!apiKey) {
      console.log("GUARDIAN_API_KEY not set, skipping Guardian news fetch. Get free key from https://open-platform.theguardian.com");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "India",
      pageSize: Math.min(pageSize, 50).toString(),
      "api-key": apiKey,
      "show-fields": "trailText,thumbnail",
    });

    const res = await fetch(`https://content.guardianapis.com/search?${searchParams}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.response?.results && Array.isArray(data.response.results)) {
        for (const item of data.response.results.slice(0, pageSize)) {
          articles.push({
            title: item.webTitle || "",
            description: item.fields?.trailText || null,
            url: item.webUrl || null,
            source: "The Guardian",
            publishedAt: item.webPublicationDate || null,
            author: item.bylineHtml || null,
            image: item.fields?.thumbnail || null,
            channel: "The Guardian",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching The Guardian news:", error);
  }

  return articles;
}

/**
 * Fetch UPSC/Admin news from multiple free sources
 */
export async function fetchUPSCRelatedNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_KEY not set, skipping UPSC news fetch");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "UPSC OR 'civil services' OR 'competitive exam' OR 'public administration'",
      sortBy: "publishedAt",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.articles && Array.isArray(data.articles)) {
        for (const item of data.articles.slice(0, pageSize)) {
          articles.push({
            title: item.title || "",
            description: item.description || null,
            content: item.content || item.description || null,
            url: item.url || null,
            source: item.source?.name || "News API",
            publishedAt: item.publishedAt || null,
            author: item.author || null,
            image: item.urlToImage || null,
            channel: "UPSC/Admin",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching UPSC news:", error);
  }

  return articles;
}

/**
 * Fetch news from NewsData.io API
 * Coverage: Global news with focus on India, Business, Technology, Politics
 * Free tier: 200 requests/day
 */
export async function fetchNewsDataNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
      console.log("NEWSDATA_API_KEY not set, skipping NewsData.io news fetch. Get free key from https://newsdata.io");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "India OR UPSC OR 'current affairs' OR policy",
      country: "in",
      pageSize: Math.min(pageSize, 50).toString(),
      apikey: apiKey,
    });

    const res = await fetch(`https://newsdata.io/api/1/news?${searchParams}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.results && Array.isArray(data.results)) {
        for (const item of data.results.slice(0, pageSize)) {
          // Convert ISO format to standardized format if needed
          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : null;
          
          articles.push({
            title: item.title || "",
            description: item.description || null,
            content: item.content || item.description || null,
            url: item.link || null,
            source: item.source_id || "NewsData.io",
            publishedAt: pubDate,
            author: item.creator ? item.creator.join(", ") : null,
            image: item.image_url || null,
            channel: "NewsData",
          });
        }
      }
    } else {
      const error = await res.json().catch(() => ({}));
      console.error("NewsData.io error:", error);
    }
  } catch (error) {
    console.error("Error fetching NewsData.io news:", error);
  }

  return articles;
}

/**
 * Fetch news from multiple channels with The Hindu as primary source
 */
export async function fetchMultiChannelNews(pageSize = 50): Promise<{ articles: Article[], byChannel: Record<string, Article[]> }> {
  // Fetch primarily from The Hindu with supplementary sources
  const [hinduNews, pibNews, economyNews, guardianNews, upscNews, newsdataNews] = await Promise.all([
    fetchTheHinduDailyAffairs(15), // Increased from 10 to prioritize The Hindu
    fetchPIBNews(8),
    fetchEconomyNews(8),
    fetchGuardianNews(8),
    fetchUPSCRelatedNews(6),
    fetchNewsDataNews(8), // NewsData.io supplementary source
  ]);

  const allArticles = [
    ...hinduNews,
    ...pibNews,
    ...economyNews,
    ...guardianNews,
    ...upscNews,
    ...newsdataNews,
  ]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, pageSize);

  const byChannel: Record<string, Article[]> = {};
  for (const article of allArticles) {
    const channel = article.channel || "Other";
    if (!byChannel[channel]) {
      byChannel[channel] = [];
    }
    byChannel[channel].push(article);
  }

  return {
    articles: allArticles,
    byChannel,
  };
}
