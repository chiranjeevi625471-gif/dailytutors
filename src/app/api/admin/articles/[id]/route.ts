/**
 * Admin Articles API — single article.
 * PUT    /api/admin/articles/:id   update
 * DELETE /api/admin/articles/:id   delete
 */
import { NextRequest, NextResponse } from "next/server";
import { ArticleModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function shape(doc: any) {
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...o, id: String(o._id) };
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    delete body.id;
    delete body._id;
    if (body.status === "published" && !body.publishedAt) body.publishedAt = new Date();
    const article = await ArticleModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    return NextResponse.json(shape(article));
  } catch (error: any) {
    console.error("Admin article PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update article" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const article = await ArticleModel.findByIdAndDelete(params.id);
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin article DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete article" }, { status: 500 });
  }
}
