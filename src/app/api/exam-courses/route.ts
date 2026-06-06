import { readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examSlug = searchParams.get("exam");

    // Read exam courses from JSON file
    const filePath = join(process.cwd(), "data", "exam-courses.json");
    const fileContent = await readFile(filePath, "utf-8");
    const allCourses = JSON.parse(fileContent);

    // Filter by exam and active status
    const courses = allCourses.filter(
      (c: any) => c.active && (!examSlug || c.examSlug === examSlug)
    );

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching exam courses:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}
