import { NextResponse } from "next/server";
import { chatCompletion } from "@/lib/groq";
import { fetchTopIndianNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    // Fetch government announcements and PIB releases
    const articles = await fetchTopIndianNews("PIB government India press release ministry", 6);
    
    if (articles.length === 0) {
      console.warn("No articles fetched - check NEWSAPI_KEY");
      return NextResponse.json({ 
        error: "No PIB releases available. Please ensure NEWSAPI_KEY is set in Vercel environment variables." 
      }, { status: 503 });
    }

    const newsSummary = articles
      .map((a, i) => `${i + 1}. ${a.title}\n${a.description || ""}`)
      .join("\n\n");

    const response = await chatCompletion({
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a current affairs expert for UPSC Civil Services. Create a PIB (Press Information Bureau) summary from these recent government announcements in 600-900 words covering:

1. New government schemes and initiatives
2. Policy announcements and changes
3. Press releases from various ministries
4. Implementation details and timelines
5. UPSC relevance and key takeaways

Government announcements:
${newsSummary}

Format as a structured PIB summary with clear categorization by ministry/department.`
        }
      ]
    });

    const analysis = response.choices[0].message.content || "";

    return NextResponse.json({
      title: "PIB Summary",
      date: new Date().toLocaleDateString("en-IN"),
      analysis,
      sources: articles.map(a => ({ title: a.title, url: a.url }))
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("PIB summary error:", msg);
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 });
  }
}
