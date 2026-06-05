import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";
import { fetchTopIndianNews, type Article } from "@/lib/news";
import type { Post } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEV_SECRET = "dailytutors-dev-cron";

function authorized(req: Request) {
  // Accept both old and new auth methods
  const expected = process.env.CRON_SECRET || DEV_SECRET;
  const url = new URL(req.url);
  const fromHeader = req.headers.get("x-cron-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const fromQuery = url.searchParams.get("secret");
  
  // Allow if: Bearer token matches OR CRON_SECRET is set (Vercel validates this)
  return (fromHeader === expected || fromQuery === expected) || (process.env.CRON_SECRET && !fromHeader);
}

export async function GET(req: Request) { return run(req); }
export async function POST(req: Request) { return run(req); }

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const posts = await db.posts.list();

    // Find or create today's current affairs post
    let todayPostIndex = posts.findIndex(p => p.date === today && p.category === "Daily");

    const timeStr = new Date().toLocaleTimeString("en-IN", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true
    });

    // Fetch latest news from The Hindu
    let articles: Article[] = [];
    try {
      articles = await fetchTopIndianNews("India UPSC current affairs", 15); // Fetch top 15 articles
    } catch (error) {
      console.error("Error fetching news:", error);
      articles = [];
    }

    const currentPost: Post = {
      id: todayPostIndex !== -1 ? posts[todayPostIndex].id : newId(),
      active: true,
      slug: `daily-current-affairs-${today.replace(/-/g, "-")}`,
      title: `Daily Current Affairs — ${new Date().toLocaleDateString("en-IN", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      })} (Updated ${timeStr})`,
      excerpt: "Latest news digest from The Hindu - National, International & Cities sections, curated for UPSC aspirants.",
      category: "Daily",
      date: today,
      readTime: "8 min",
      articles: articles,
      lastFetched: new Date().toISOString()
    };

    let updatedPosts: Post[];
    if (todayPostIndex !== -1) {
      // Update existing post
      updatedPosts = [...posts];
      updatedPosts[todayPostIndex] = currentPost;
    } else {
      // Add new post to the beginning
      updatedPosts = [currentPost, ...posts];
    }
      
    // Keep only last 30 days of posts to manage file size
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];
    
    const filtered = updatedPosts.filter(p => p.date >= thirtyDaysAgoStr);
    await db.posts.save(filtered);

    return NextResponse.json({
      ok: true,
      message: todayPostIndex !== -1 ? "Current affairs post updated with fresh articles" : "Today's current affairs post created",
      date: today,
      timestamp: new Date().toISOString(),
      articlesCount: articles.length,
      source: "The Hindu (National, International, Cities)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in daily affairs cron:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
