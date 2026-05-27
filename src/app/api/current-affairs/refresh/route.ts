import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";
import { fetchMultiChannelNews, type Article } from "@/lib/news";
import type { Post } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint to manually refresh Daily Current Affairs from multiple channels
 * Fetches latest news from The Hindu, PIB, Economy Times, The Guardian, UPSC/Admin, and NewsData
 * Can be called from the frontend to fetch latest news on demand
 */
export async function GET(req: Request) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const posts = await db.posts.list();

    // Find or create today's current affairs post
    let todayPostIndex = posts.findIndex(p => p.date === today && p.category === "Daily");

    const timeStr = new Date().toLocaleTimeString("en-IN", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true
    });

    // Fetch latest news from multiple channels
    let articles: Article[] = [];
    try {
      const result = await fetchMultiChannelNews(50);
      articles = result.articles;
    } catch (error) {
      console.error("Error fetching multi-channel news:", error);
      articles = [];
    }

    // Assign unique IDs to articles if they don't have one
    const articlesWithIds = articles.map((article, index) => ({
      ...article,
      id: article.id || `article-${today}-${index}-${newId()}`
    }));

    const currentPost: Post = {
      id: todayPostIndex !== -1 ? posts[todayPostIndex].id : newId(),
      active: true,
      slug: `daily-current-affairs-${today.replace(/-/g, "-")}`,
      title: `Daily Current Affairs — ${new Date().toLocaleDateString("en-IN", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      })} (Updated ${timeStr})`,
      excerpt: "Latest news digest from multiple channels - The Hindu, PIB, Economy Times, The Guardian, UPSC/Admin, NewsData. Curated for UPSC aspirants and current affairs enthusiasts.",
      category: "Daily",
      date: today,
      readTime: "10 min",
      articles: articlesWithIds,
      lastFetched: new Date().toISOString()
    };

    let updatedPosts: Post[];
    if (todayPostIndex !== -1) {
      updatedPosts = [...posts];
      updatedPosts[todayPostIndex] = currentPost;
    } else {
      updatedPosts = [currentPost, ...posts];
    }

    // Keep only last 30 days of posts
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];
    
    const filtered = updatedPosts.filter(p => p.date >= thirtyDaysAgoStr);
    await db.posts.save(filtered);

    return NextResponse.json({
      ok: true,
      message: "Daily Current Affairs refreshed successfully from all channels",
      date: today,
      timestamp: new Date().toISOString(),
      articlesCount: articlesWithIds.length,
      sources: "The Hindu, PIB, Economy Times, The Guardian, UPSC/Admin, NewsData",
      articles: articlesWithIds
    }, { status: 200 });
  } catch (error) {
    console.error("Error in refresh endpoint:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
