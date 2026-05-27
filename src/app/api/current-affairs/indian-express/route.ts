import { NextResponse } from "next/server";
import { fetchIndianExpressNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dedicated endpoint for Indian Express Daily Current Affairs
 * Returns only articles from Indian Express's current affairs coverage
 * Perfect for UPSC preparation and staying updated with latest investigative news
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const validLimit = Math.min(Math.max(limit, 1), 100);

    const articles = await fetchIndianExpressNews(validLimit);

    return NextResponse.json({
      ok: true,
      source: "Indian Express",
      count: articles.length,
      timestamp: new Date().toISOString(),
      articles: articles
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Indian Express Daily Current Affairs:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Failed to fetch articles" 
    }, { status: 500 });
  }
}
