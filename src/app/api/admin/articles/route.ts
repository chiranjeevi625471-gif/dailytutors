/**
 * Admin Articles API — MongoDB backed (all statuses).
 * GET  /api/admin/articles   list every article (any status)
 * POST /api/admin/articles   create an article
 * Protected by middleware (dt_admin cookie).
 */
import { NextRequest, NextResponse } from "next/server";
import { ArticleModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { generateSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

function shape(doc: any) {
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...o, id: String(o._id) };
}

export async function GET() {
  try {
    await connectDB();
    const articles = await ArticleModel.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(articles.map(shape));
  } catch (error: any) {
    console.error("Admin articles GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    delete body.id;
    delete body._id;
    body.slug = body.slug || generateSlug(body.title || "");
    body.source = body.source || "Admin";
    if (body.status === "published" && !body.publishedAt) body.publishedAt = new Date();
    const article = await ArticleModel.create(body);
    return NextResponse.json(shape(article), { status: 201 });
  } catch (error: any) {
    console.error("Admin articles POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create article" }, { status: 400 });
  }
}
