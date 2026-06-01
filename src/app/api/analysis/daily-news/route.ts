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
      return NextResponse.json({ error: "No news found" }, { status: 400 });
    }

    // Prepare news summary for Groq
    const newsSummary = articles
      .map((a, i) => `${i + 1}. ${a.title}\n${a.description || ""}`)
      .join("\n\n");

    // Generate analysis using Groq
    const client = getClient();
    const response = await client.messages.create({
      model: "mixtral-8x7b-32768",
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

    const analysis = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      title: "Daily News Analysis",
      date: new Date().toLocaleDateString("en-IN"),
      analysis,
      sources: articles.map(a => ({ title: a.title, url: a.url }))
    });
  } catch (error) {
    console.error("Analysis generation error:", error);
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
  }
}
