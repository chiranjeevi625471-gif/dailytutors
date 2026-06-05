import axios from 'axios';
import * as cheerio from 'cheerio';

export type Article = {
  id?: string;
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
 * Clean HTML content
 */
export function cleanHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Fetch Daily Current Affairs from The Hindu via NewsAPI
 */
export async function fetchTheHinduDailyAffairs(pageSize = 25): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.warn('NEWSAPI_KEY is not set. Skipping NewsAPI sources.');
    return [];
  }

  const articles: Article[] = [];

  try {
    const searchParams = new URLSearchParams({
      q: 'India',
      sortBy: 'publishedAt',
      language: 'en',
      pageSize: '10',
      apiKey: apiKey,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('NewsAPI error:', error);
      return [];
    }

    const data = (await res.json()) as any;

    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles.slice(0, pageSize)) {
        articles.push({
          title: item.title || '',
          description: item.description || null,
          content: item.content || item.description || null,
          url: item.url || null,
          source: item.source?.name || 'The Hindu',
          publishedAt: item.publishedAt || null,
          author: item.author || null,
          image: item.urlToImage || null,
          channel: 'The Hindu',
        });
      }
    }

    console.log(`Fetched ${articles.length} articles from The Hindu`);
  } catch (error) {
    console.error('Error fetching The Hindu articles:', error);
  }

  return articles;
}

/**
 * Fetch Daily Current Affairs from Indian Express
 */
export async function fetchIndianExpressNews(pageSize = 25): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    return [];
  }

  const articles: Article[] = [];

  try {
    const searchParams = new URLSearchParams({
      q: 'India',
      sortBy: 'publishedAt',
      language: 'en',
      pageSize: '10',
      apiKey: apiKey,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as any;

    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles.slice(0, pageSize)) {
        articles.push({
          title: item.title || '',
          description: item.description || null,
          content: item.content || item.description || null,
          url: item.url || null,
          source: item.source?.name || 'Indian Express',
          publishedAt: item.publishedAt || null,
          author: item.author || null,
          image: item.urlToImage || null,
          channel: 'Indian Express',
        });
      }
    }

    console.log(`Fetched ${articles.length} articles from Indian Express`);
  } catch (error) {
    console.error('Error fetching Indian Express articles:', error);
  }

  return articles;
}

/**
 * Fetch from PIB (Press Information Bureau)
 */
export async function fetchPIBNews(pageSize = 10): Promise<Article[]> {
  try {
    const response = await axios.get('https://pib.gov.in/PressReleasePage.aspx?PRID=1', {
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles: Article[] = [];

    $('div.pib-content').each((index, element) => {
      if (index >= 5) return;

      const title = $(element).find('h2').text();
      const link = $(element).find('a').attr('href');
      const content = $(element).find('p').text();

      if (title && link) {
        articles.push({
          title: title.trim(),
          description: content.trim(),
          content: content.trim(),
          source: 'pib',
          url: `https://pib.gov.in${link}`,
          publishedAt: new Date().toISOString(),
          channel: 'PIB',
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Error fetching PIB articles:', error);
    return [];
  }
}

/**
 * Remove duplicate articles by title
 */
export function removeDuplicates(articles: Article[]): Article[] {
  const seenTitles = new Set<string>();
  return articles.filter((article) => {
    const titleLower = article.title.toLowerCase();
    if (seenTitles.has(titleLower)) {
      return false;
    }
    seenTitles.add(titleLower);
    return true;
  });
}

/**
 * Fetch all news from multiple sources
 */
export async function fetchAllNews(): Promise<Article[]> {
  const [hindu, indianExpress, pib] = await Promise.all([
    fetchTheHinduDailyAffairs(),
    fetchIndianExpressNews(),
    fetchPIBNews(),
  ]);

  const allArticles = [...hindu, ...indianExpress, ...pib];
  return removeDuplicates(allArticles);
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
      cache: "no-store"
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
      cache: "no-store"
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
      cache: "no-store"
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
      cache: "no-store"
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
      size: Math.min(pageSize, 50).toString(),
      apikey: apiKey,
    });

    const res = await fetch(`https://newsdata.io/api/1/news?${searchParams}`, {
      cache: "no-store"
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
 * Fetch news from Times of India using NewsAPI
 */
export async function fetchTimesOfIndiaNews(pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_KEY not set, skipping Times of India news fetch");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "India politics business",
      sources: "the-times-of-india",
      sortBy: "publishedAt",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      cache: "no-store"
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
            source: "Times of India",
            publishedAt: item.publishedAt || null,
            author: item.author || null,
            image: item.urlToImage || null,
            channel: "Times of India",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Times of India news:", error);
  }

  return articles;
}

/**
 * Fetch news from Inshorts API for quick current affairs summaries
 */
export async function fetchInshortsNews(category = "national", pageSize = 10): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    // Inshorts API endpoint (free, no key required)
    const res = await fetch(`https://inshortsapi.vercel.app/news?category=${category}`, {
      cache: "no-store"
    });

    if (res.ok) {
      const data = await res.json() as any;
      if (data.data && Array.isArray(data.data)) {
        for (const item of data.data.slice(0, pageSize)) {
          articles.push({
            title: item.title || "",
            description: item.content || null,
            content: item.content || null,
            url: item.readMoreUrl || null,
            source: "Inshorts",
            publishedAt: item.date || null,
            author: item.author || null,
            image: item.imageUrl || null,
            channel: "Inshorts",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Inshorts news:", error);
    // Inshorts API is optional, don't throw error
  }

  return articles;
}

/**
 * Fetch current affairs specific news with policy focus
 */
export async function fetchCurrentAffairsNews(pageSize = 15): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_KEY not set, skipping current affairs news fetch");
      return articles;
    }

    const searchParams = new URLSearchParams({
      q: "'current affairs' OR policy OR ministry OR parliament OR 'cabinet' OR reform OR bill",
      sortBy: "publishedAt",
      language: "en",
      pageSize: Math.min(pageSize, 100).toString(),
      apiKey: apiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/everything?${searchParams}`, {
      cache: "no-store"
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
            source: item.source?.name || "Current Affairs",
            publishedAt: item.publishedAt || null,
            author: item.author || null,
            image: item.urlToImage || null,
            channel: "Current Affairs",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching current affairs news:", error);
  }

  return articles;
}

/**
 * Fetch news from multiple channels with comprehensive coverage
 * Combines The Hindu, PIB, Economy, Guardian, UPSC, NewsData, TOI, Inshorts, and Current Affairs
 */
export async function fetchMultiChannelNews(pageSize = 50): Promise<{ articles: Article[], byChannel: Record<string, Article[]> }> {
  // Fetch from all available sources in parallel
  const [
    hinduNews,
    pibNews,
    economyNews,
    guardianNews,
    upscNews,
    newsdataNews,
    toiNews,
    inshortsNews,
    currentAffairsNews
  ] = await Promise.all([
    fetchTheHinduDailyAffairs(12),
    fetchPIBNews(8),
    fetchEconomyNews(8),
    fetchGuardianNews(7),
    fetchUPSCRelatedNews(7),
    fetchNewsDataNews(8),
    fetchTimesOfIndiaNews(7),
    fetchInshortsNews("national", 8),
    fetchCurrentAffairsNews(10),
  ]);

  const allArticles = [
    ...hinduNews,
    ...pibNews,
    ...economyNews,
    ...guardianNews,
    ...upscNews,
    ...newsdataNews,
    ...toiNews,
    ...inshortsNews,
    ...currentAffairsNews,
  ]
    // Remove duplicates based on title similarity
    .reduce((unique: Article[], article) => {
      const isDuplicate = unique.some(a => 
        a.title?.toLowerCase().substring(0, 50) === article.title?.toLowerCase().substring(0, 50)
      );
      if (!isDuplicate) {
        unique.push(article);
      }
      return unique;
    }, [])
    // Sort by published date (newest first)
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
