/**
 * Admin Courses API — single course.
 * PUT    /api/admin/courses/:id   update
 * DELETE /api/admin/courses/:id   delete
 */
import { NextRequest, NextResponse } from "next/server";
import { CourseModel } from "@/lib/models";
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
    const course = await CourseModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json(shape(course));
  } catch (error: any) {
    console.error("Admin course PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update course" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const course = await CourseModel.findByIdAndDelete(params.id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin course DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete course" }, { status: 500 });
  }
}
