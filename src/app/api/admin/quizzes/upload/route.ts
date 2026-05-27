import { NextResponse } from "next/server";
import { parseFileToQuestions } from "@/lib/parse-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const type = form.get("type") as string || "mcq";
    
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    const buf = Buffer.from(await file.arrayBuffer());
    const { items, source, usedAI } = await parseFileToQuestions(buf, file.name, type as "mcq" | "mains" | "both");
    
    return NextResponse.json({
      items,
      source,
      usedAI,
      type,
      filename: file.name,
      count: items.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Parse failed" }, { status: 400 });
  }
}
