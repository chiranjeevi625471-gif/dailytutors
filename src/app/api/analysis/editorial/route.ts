import { NextResponse } from "next/server";
import { getClient } from "@/lib/groq";
import { fetchTopIndianNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    // Fetch editorial content and opinion pieces
    const articles = await fetchTopIndianNews("editorial opinion India current affairs", 5);
    
    if (articles.length === 0) {
      console.warn("No articles fetched - check NEWSAPI_KEY");
      return NextResponse.json({ 
        error: "No editorials available. Please ensure NEWSAPI_KEY is set in Vercel environment variables." 
      }, { status: 503 });
    }

    const newsSummary = articles
      .map((a, i) => `${i + 1}. ${a.title}\n${a.description || ""}`)
      .join("\n\n");

    const client = getClient();
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a current affairs expert for UPSC Civil Services. Analyze these recent editorial pieces and provide editorial analysis in 500-800 words covering:

1. Main arguments and counterarguments
2. Different perspectives on the issue
3. Policy implications
4. Relevance to GS2 (Governance) and GS3 (Economics)
5. UPSC exam perspective

Editorial topics:
${newsSummary}

Present as detailed editorial analysis with clear sections.`
        }
      ]
    });

    const analysis = response.choices[0].message.content || "";

    return NextResponse.json({
      title: "Editorial Analysis",
      date: new Date().toLocaleDateString("en-IN"),
      analysis,
      sources: articles.map(a => ({ title: a.title, url: a.url }))
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Editorial analysis error:", msg);
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 });
  }
}
