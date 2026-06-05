/**
 * Articles API Endpoint
 * GET /api/articles - List articles
 * POST /api/articles - Create article (admin only)
 */

import { NextRequest } from "next/server";
import { ArticleModel } from "@/lib/models";
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
import { getPaginationParams, getSkipValue, generateSlug, validateArticleData } from "@/lib/utils";
import { Article } from "@/types";

// ============================================================================
// GET - List Articles
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "published";
    const gsPaper = searchParams.get("gsPaper");

    // Validate pagination
    const { page: p, limit: l } = getPaginationParams(page, limit);
    const skip = getSkipValue(p, l);

    // Build query
    const query: any = {};

    // Only show published articles to public (unless admin is logged in)
    if (status) {
      try {
        await verifyAdminAuth();
        // Admin can see all statuses
        if (status !== "all") {
          query.status = status;
        }
      } catch {
        // Public users only see published
        query.status = "published";
      }
    }

    if (category) {
      query.category = category;
    }

    if (gsPaper) {
      query.gsPapers = gsPaper;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Execute query
    const total = await ArticleModel.countDocuments(query);
    const articles = await ArticleModel.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();

    return paginatedResponse(articles, p, l, total, "Articles fetched successfully");
  } catch (error) {
    console.error("Articles fetch error:", error);
    return internalErrorResponse("Failed to fetch articles", error);
  }
}

// ============================================================================
// POST - Create Article (Admin only)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminAuth();

    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    await connectDB();

    const body = await request.json();

    // Validate article data
    const errors = validateArticleData(body);
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title);

    // Check if slug already exists
    const existingArticle = await ArticleModel.findOne({ slug });
    if (existingArticle) {
      return badRequestResponse("Article with this slug already exists");
    }

    // Create article
    const article = new ArticleModel({
      title: body.title,
      slug,
      source: body.source || "Admin",
      sourceUrl: body.sourceUrl,
      category: body.category,
      gsPapers: body.gsPapers || [],
      status: body.status || "pending_review",
      content: body.content,
      summary: body.summary,
      whyInNews: body.whyInNews,
      featuredImage: body.featuredImage,
      keywords: body.keywords || [],
      metaDescription: body.metaDescription,
      tags: body.tags || [],
      prelimsPointers: body.prelimsPointers || [],
      mainsAnalysis: body.mainsAnalysis,
      constitutionalLinks: body.constitutionalLinks || [],
      wayForward: body.wayForward,
      mcqs: body.mcqs || [],
      pyqs: body.pyqs || [],
      aiGenerated: body.aiGenerated || false,
      aiModel: body.aiModel,
      generatedAt: body.aiGenerated ? new Date() : undefined,
      publishedAt: body.status === "published" ? new Date() : null,
      modifiedBy: admin.adminId,
    });

    await article.save();

    return successResponse(article, "Article created successfully", 201);
  } catch (error) {
    console.error("Article creation error:", error);
    if (error instanceof Error && error.message.includes("unauthorized")) {
      return unauthorizedResponse();
    }
    return internalErrorResponse("Failed to create article", error);
  }
}
