import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { EntityName } from "@/lib/types";

const ENTITIES: EntityName[] = ["banners", "cards", "posts", "quizzes", "courses", "downloads", "promobanners"];

export const dynamic = "force-dynamic";

function isEntity(name: string): name is EntityName {
  return (ENTITIES as string[]).includes(name);
}

export async function PUT(req: Request, { params }: { params: { entity: string; id: string } }) {
  if (!isEntity(params.entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const body = await req.json();
  const rows: any[] = await db[params.entity].list();
  const idx = rows.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  rows[idx] = { ...rows[idx], ...body, id: params.id };
  await db[params.entity].save(rows as any);
  return NextResponse.json(rows[idx]);
}

export async function DELETE(_req: Request, { params }: { params: { entity: string; id: string } }) {
  if (!isEntity(params.entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const rows: any[] = await db[params.entity].list();
  const next = rows.filter((r) => r.id !== params.id);
  await db[params.entity].save(next as any);
  return NextResponse.json({ ok: true });
}
