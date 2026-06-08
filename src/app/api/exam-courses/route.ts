import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Read from MongoDB (the same source the admin panel writes to) so edits made
// in the admin reflect on the live site immediately. Must be dynamic — a cached
// or file-based response would serve stale data.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examSlug = searchParams.get("exam");

    const allCourses = await db["exam-courses"].list();

    // Only active courses, optionally filtered by exam category.
    const courses = allCourses.filter(
      (c) => c.active && (!examSlug || c.examSlug === examSlug)
    );

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching exam courses:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}
