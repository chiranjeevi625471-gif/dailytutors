/**
 * Courses API Endpoint
 * GET /api/courses - List courses
 * POST /api/courses - Create course (admin only)
 */

import { NextRequest } from "next/server";
import { CourseModel } from "@/lib/models";
import { verifyAdminAuth } from "@/lib/auth-utils";
import { 
  successResponse, 
  paginatedResponse, 
  badRequestResponse, 
  unauthorizedResponse,
  internalErrorResponse,
  validationErrorResponse 
} from "@/lib/api-responses";
import { connectDB } from "@/lib/mongodb";
import { getPaginationParams, getSkipValue, generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const { page: p, limit: l } = getPaginationParams(page, limit);
    const skip = getSkipValue(p, l);

    const query: any = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await CourseModel.countDocuments(query);
    const courses = await CourseModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();

    return paginatedResponse(courses, p, l, total, "Courses fetched successfully");
  } catch (error) {
    console.error("Courses fetch error:", error);
    return internalErrorResponse("Failed to fetch courses", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth();
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    await connectDB();

    const body = await request.json();

    const errors: Record<string, string> = {};

    if (!body.title) errors.title = "Title is required";
    if (!body.description) errors.description = "Description is required";
    if (!body.category) errors.category = "Category is required";
    if (!body.price || body.price < 0) errors.price = "Valid price is required";

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    const slug = body.slug || generateSlug(body.title);

    const existingCourse = await CourseModel.findOne({ slug });
    if (existingCourse) {
      return badRequestResponse("Course with this slug already exists");
    }

    const course = new CourseModel({
      title: body.title,
      slug,
      description: body.description,
      shortDescription: body.shortDescription,
      category: body.category,
      thumbnail: body.thumbnail,
      heroImage: body.heroImage,
      whatYouWillLearn: body.whatYouWillLearn || [],
      curriculum: body.curriculum || [],
      prerequisites: body.prerequisites,
      price: body.price,
      originalPrice: body.originalPrice,
      discount: body.discount,
      instructor: body.instructor,
      level: body.level || "Intermediate",
      duration: body.duration,
      lessons: body.lessons,
      metaDescription: body.metaDescription,
      keywords: body.keywords || [],
      isPublished: body.isPublished || false,
      isFeatured: body.isFeatured || false,
      publishedAt: body.isPublished ? new Date() : null,
    });

    await course.save();

    return successResponse(course, "Course created successfully", 201);
  } catch (error) {
    console.error("Course creation error:", error);
    if (error instanceof Error && error.message.includes("unauthorized")) {
      return unauthorizedResponse();
    }
    return internalErrorResponse("Failed to create course", error);
  }
}
