import { NextResponse } from "next/server";
import { fetchNewsDataNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * NewsData.io API endpoint for Daily Current Affairs
 * Returns articles from NewsData.io with India focus
 * Premium coverage: 200 requests/day free tier
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const validLimit = Math.min(Math.max(limit, 1), 100);

    const articles = await fetchNewsDataNews(validLimit);

    return NextResponse.json({
      ok: true,
      source: "NewsData.io",
      count: articles.length,
      timestamp: new Date().toISOString(),
      articles: articles
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching NewsData.io articles:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Failed to fetch articles" 
    }, { status: 500 });
  }
}
