import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";
import type { Quiz, QuestionItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { items, title, type, slug, source } = body as {
    items: QuestionItem[];
    title: string;
    type: Quiz["type"];
    slug?: string;
    source?: Quiz["source"];
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items array is required" }, { status: 400 });
  }
  if (!title || !type) {
    return NextResponse.json({ error: "title and type are required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const finalSlug = slug?.trim() || `${type.toLowerCase()}-${today}-${Math.random().toString(36).slice(2, 6)}`;

  const quiz: Quiz = {
    id: newId(),
    slug: finalSlug,
    title,
    type,
    questions: items.length,
    duration: `${Math.max(8, items.length * 1.2 | 0)} min`,
    date: today,
    scheduledAt: null,
    active: true,
    source: source || "manual",
    items
  };

  const rows = await db.quizzes.list();
  rows.push(quiz);
  await db.quizzes.save(rows);
  return NextResponse.json(quiz, { status: 201 });
}
