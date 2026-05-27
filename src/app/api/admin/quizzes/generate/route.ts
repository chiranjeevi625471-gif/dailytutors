import { NextResponse } from "next/server";
import { fetchTopIndianNews } from "@/lib/news";
import { generateQuestionsFromArticle } from "@/lib/groq";
import type { QuestionItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 600; // 10 minutes timeout

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const query: string | undefined = body.query;
    const targetCount: number = Math.max(1, Math.min(500, body.count ?? 10));
    const perArticle: number = Math.max(2, Math.min(10, body.perArticle ?? 4));
    const questionType: "mcq" | "mains" | "both" = body.type || "mcq";
    const stream = body.stream === true; // Check if client wants streaming

    // Pull enough articles to plausibly cover the target (with ~50% headroom for skips/duds)
    const desiredArticles = Math.min(100, Math.ceil((targetCount / perArticle) * 1.5) + 3);
    const articles = await fetchTopIndianNews(query, desiredArticles);
    if (articles.length === 0) {
      return NextResponse.json({ error: "No articles found from NewsAPI" }, { status: 404 });
    }

    // If not streaming, use old behavior
    if (!stream) {
      const all: QuestionItem[] = [];
      const usedSources: { title: string; url: string | null; source: string | null }[] = [];

      for (const a of articles) {
        if (all.length >= targetCount) break;
        try {
          const need = Math.min(perArticle, targetCount - all.length);
          const items = await generateQuestionsFromArticle(a, need, questionType);
          if (items.length > 0) {
            all.push(...items);
            usedSources.push({ title: a.title, url: a.url ?? null, source: a.source ?? null });
          }
        } catch {
          // skip an article that errors; try next
        }
      }

      const final = all.slice(0, targetCount);
      return NextResponse.json({
        items: final,
        count: final.length,
        requested: targetCount,
        type: questionType,
        articlesUsed: usedSources.length,
        sources: usedSources
      });
    }

    // Streaming mode: return ReadableStream that sends questions as they're generated
    const encoder = new TextEncoder();
    const stream_response = new ReadableStream({
      async start(controller) {
        try {
          const all: QuestionItem[] = [];
          const usedSources: { title: string; url: string | null; source: string | null }[] = [];

          for (const a of articles) {
            if (all.length >= targetCount) break;
            try {
              const need = Math.min(perArticle, targetCount - all.length);
              const items = await generateQuestionsFromArticle(a, need, questionType);
              
              if (items.length > 0) {
                all.push(...items);
                usedSources.push({ title: a.title, url: a.url ?? null, source: a.source ?? null });

                // Send progress update with newly generated items
                const progress = {
                  type: "progress",
                  count: all.length,
                  items: items,
                  targetCount,
                  articlesUsed: usedSources.length
                };
                controller.enqueue(encoder.encode(JSON.stringify(progress) + "\n"));
              }
            } catch (err) {
              console.error("Error generating from article:", err);
              // Skip this article and continue
            }
          }

          // Send final summary
          const final = {
            type: "complete",
            count: all.length,
            requested: targetCount,
            questionType: questionType,
            articlesUsed: usedSources.length,
            sources: usedSources
          };
          controller.enqueue(encoder.encode(JSON.stringify(final) + "\n"));
          controller.close();
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          controller.enqueue(encoder.encode(JSON.stringify({ type: "error", error: errMsg }) + "\n"));
          controller.close();
        }
      }
    });

    return new NextResponse(stream_response, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Generation failed" }, { status: 500 });
  }
}
