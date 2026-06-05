/**
 * Quizzes API Endpoint
 * GET /api/quizzes - List quizzes
 * POST /api/quizzes - Create quiz (admin only)
 */

import { NextRequest } from "next/server";
import { QuizModel } from "@/lib/models";
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
    const difficulty = searchParams.get("difficulty");

    const { page: p, limit: l } = getPaginationParams(page, limit);
    const skip = getSkipValue(p, l);

    const query: any = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const total = await QuizModel.countDocuments(query);
    const quizzes = await QuizModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();

    return paginatedResponse(quizzes, p, l, total, "Quizzes fetched successfully");
  } catch (error) {
    console.error("Quizzes fetch error:", error);
    return internalErrorResponse("Failed to fetch quizzes", error);
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
    if (!body.category) errors.category = "Category is required";
    if (!body.questions || body.questions.length === 0) {
      errors.questions = "At least one question is required";
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    const slug = body.slug || generateSlug(body.title);

    const existingQuiz = await QuizModel.findOne({ slug });
    if (existingQuiz) {
      return badRequestResponse("Quiz with this slug already exists");
    }

    const quiz = new QuizModel({
      title: body.title,
      slug,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty || "Medium",
      questions: body.questions,
      timeLimit: body.timeLimit || 30,
      passingScore: body.passingScore || 60,
      totalQuestions: body.questions.length,
      isPublished: body.isPublished || false,
      publishedAt: body.isPublished ? new Date() : null,
    });

    await quiz.save();

    return successResponse(quiz, "Quiz created successfully", 201);
  } catch (error) {
    console.error("Quiz creation error:", error);
    if (error instanceof Error && error.message.includes("unauthorized")) {
      return unauthorizedResponse();
    }
    return internalErrorResponse("Failed to create quiz", error);
  }
}
