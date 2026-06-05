/**
 * Admin Courses API — MongoDB backed.
 * GET  /api/admin/courses        list all courses (any status)
 * POST /api/admin/courses        create a course
 * Protected by middleware (dt_admin cookie).
 */
import { NextRequest, NextResponse } from "next/server";
import { CourseModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Expose Mongo docs to the admin UI with a string `id` (EntityManager expects `id`).
function shape(doc: any) {
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...o, id: String(o._id) };
}

export async function GET() {
  try {
    await connectDB();
    const courses = await CourseModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(courses.map(shape));
  } catch (error: any) {
    console.error("Admin courses GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load courses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    delete body.id;
    delete body._id;
    const course = await CourseModel.create(body);
    return NextResponse.json(shape(course), { status: 201 });
  } catch (error: any) {
    console.error("Admin courses POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 400 });
  }
}
