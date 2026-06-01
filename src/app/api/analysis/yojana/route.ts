import { NextResponse } from "next/server";
import { getClient } from "@/lib/groq";
import { fetchTopIndianNews } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    // Fetch news about government schemes, development, social programs
    const articles = await fetchTopIndianNews("government schemes Yojana development social India", 6);
    
    if (articles.length === 0) {
      return NextResponse.json({ error: "No scheme updates found" }, { status: 400 });
    }

    const newsSummary = articles
      .map((a, i) => `${i + 1}. ${a.title}\n${a.description || ""}`)
      .join("\n\n");

    const client = getClient();
    const response = await client.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: `You are a current affairs expert for UPSC Civil Services. Create a comprehensive article on government schemes and development initiatives (like Yojana and Kurukshetra magazine topics) in 700-1000 words covering:

1. Major government schemes (PM schemes, welfare programs)
2. Development initiatives and their impact
3. Implementation status and challenges
4. Beneficiary groups and coverage
5. Budget allocation and resources
6. UPSC GS2 and GS3 relevance
7. Recent updates and amendments

Topics:
${newsSummary}

Present as an in-depth article with sections for different schemes and their details. Include implementation mechanisms and outcomes.`
        }
      ]
    });

    const analysis = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      title: "Yojana / Kurukshetra",
      date: new Date().toLocaleDateString("en-IN"),
      analysis,
      sources: articles.map(a => ({ title: a.title, url: a.url }))
    });
  } catch (error) {
    console.error("Yojana/Kurukshetra generation error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
