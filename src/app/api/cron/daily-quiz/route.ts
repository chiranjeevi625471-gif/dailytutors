import { NextResponse } from "next/server";
import { fetchTopIndianNews } from "@/lib/news";
import { generateQuestionsFromArticle } from "@/lib/groq";
import { db, newId } from "@/lib/db";
import type { Quiz, QuestionItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const url = new URL(req.url);
  const fromHeader = req.headers.get("x-cron-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const fromQuery = url.searchParams.get("secret");
  return fromHeader === expected || fromQuery === expected;
}

export async function GET(req: Request) { return run(req); }
export async function POST(req: Request) { return run(req); }

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const url = new URL(req.url);
    let count = Number(url.searchParams.get("count"));
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body?.count) count = Number(body.count);
    }
    // Default to 20 questions minimum for daily quiz from current affairs
    const targetCount = Math.max(20, Math.min(500, Number.isFinite(count) && count > 0 ? count : 20));
    const perArticle = 4;
    const desiredArticles = Math.min(100, Math.ceil((targetCount / perArticle) * 1.5) + 5);

    const articles = await fetchTopIndianNews(undefined, desiredArticles);
    if (articles.length === 0) {
      return NextResponse.json({ ok: false, reason: "no-articles" }, { status: 200 });
    }

    const all: QuestionItem[] = [];
    for (const a of articles) {
      if (all.length >= targetCount) break;
      try {
        const need = Math.min(perArticle, targetCount - all.length);
        const items = await generateQuestionsFromArticle(a, need);
        all.push(...items);
      } catch { /* skip */ }
    }
    const items = all.slice(0, targetCount);
    if (items.length === 0) {
      return NextResponse.json({ ok: false, reason: "no-questions" }, { status: 200 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const quiz: Quiz = {
      id: newId(),
      slug: `daily-prelims-${today}`,
      title: `Daily Prelims Quiz — ${new Date(today).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
      type: "Prelims",
      questions: items.length,
      duration: `${Math.max(10, items.length * 1.2 | 0)} min`,
      date: today,
      scheduledAt: null,
      active: true,
      source: "news",
      items
    };

    const rows = await db.quizzes.list();
    // dedupe by slug — replace today's quiz if it already exists
    const filtered = rows.filter((q) => q.slug !== quiz.slug);
    filtered.push(quiz);
    await db.quizzes.save(filtered);

    return NextResponse.json({ ok: true, slug: quiz.slug, count: items.length, requested: targetCount });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "failed" }, { status: 500 });
  }
}
