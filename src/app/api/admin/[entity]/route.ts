import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";
import type { EntityName } from "@/lib/types";

const ENTITIES: EntityName[] = ["banners", "cards", "posts", "quizzes", "courses", "downloads", "promobanners"];

export const dynamic = "force-dynamic";

function isEntity(name: string): name is EntityName {
  return (ENTITIES as string[]).includes(name);
}

export async function GET(_req: Request, { params }: { params: { entity: string } }) {
  if (!isEntity(params.entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const rows = await db[params.entity].list();
  return NextResponse.json(rows);
}

export async function POST(req: Request, { params }: { params: { entity: string } }) {
  if (!isEntity(params.entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const body = await req.json();
  const rows: any[] = await db[params.entity].list();
  const item = { id: newId(), ...body };
  rows.push(item);
  await db[params.entity].save(rows as any);
  return NextResponse.json(item, { status: 201 });
}
