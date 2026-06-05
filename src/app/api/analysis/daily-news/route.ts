import { NextResponse } from "next/server";
import { getClient } from "@/lib/groq";
import { fetchTopIndianNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    // Fetch latest news
    const articles = await fetchTopIndianNews("India news politics economy", 5);
    
    if (articles.length === 0) {
      console.warn("No articles fetched - check NEWSAPI_KEY");
      return NextResponse.json({ 
        error: "No news available. Please ensure NEWSAPI_KEY is set in Vercel environment variables." 
      }, { status: 503 });
    }

    // Prepare news summary for Groq
    const newsSummary = articles
      .map((a, i) => `${i + 1}. ${a.title}\n${a.description || ""}`)
      .join("\n\n");

    // Generate analysis using Groq
    const client = getClient();
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a current affairs expert for UPSC Civil Services preparation. Analyze these latest news stories and provide a comprehensive daily news analysis in 500-800 words. Focus on:

1. Key developments and their implications
2. Political, economic, and social impact
3. Relevance to UPSC syllabus
4. Important keywords and concepts

News stories:
${newsSummary}

Provide the analysis in clear sections with bullet points for key takeaways.`
        }
      ]
    });

    const analysis = response.choices[0].message.content || "";

    return NextResponse.json({
      title: "Daily News Analysis",
      date: new Date().toLocaleDateString("en-IN"),
      analysis,
      sources: articles.map(a => ({ title: a.title, url: a.url }))
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Analysis generation error:", msg);
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 });
  }
}
