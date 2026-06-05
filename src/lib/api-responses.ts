/**
 * API Response Utilities
 * Standardized response format for all API endpoints
 */

import { NextResponse } from "next/server";
import { APIResponse, PaginatedResponse, APIError } from "@/types";

// ============================================================================
// SUCCESS RESPONSES
// ============================================================================

export function successResponse<T = any>(
  data?: T,
  message: string = "Success",
  statusCode: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      statusCode,
    },
    { status: statusCode }
  );
}

export function createdResponse<T = any>(
  data?: T,
  message: string = "Created successfully"
): NextResponse<APIResponse<T>> {
  return successResponse(data, message, 201);
}

export function noContentResponse(): NextResponse {
  return NextResponse.json(null, { status: 204 });
}

// ============================================================================
// PAGINATED RESPONSES
// ============================================================================

export function paginatedResponse<T = any>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = "Success",
  statusCode: number = 200
): NextResponse<PaginatedResponse<T>> {
  const pages = Math.ceil(total / limit);

  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    },
    { status: statusCode }
  );
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export function errorResponse(
  message: string,
  statusCode: number = 400,
  error?: any
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error ? (typeof error === "string" ? error : JSON.stringify(error)) : undefined,
      statusCode,
    },
    { status: statusCode }
  );
}

export function badRequestResponse(message: string, error?: any): NextResponse<APIResponse> {
  return errorResponse(message, 400, error);
}

export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse<APIResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden"): NextResponse<APIResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(resource: string = "Resource"): NextResponse<APIResponse> {
  return errorResponse(`${resource} not found`, 404);
}

export function conflictResponse(message: string): NextResponse<APIResponse> {
  return errorResponse(message, 409);
}

export function internalErrorResponse(
  message: string = "Internal server error",
  error?: any
): NextResponse<APIResponse> {
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }
  return errorResponse(message, 500, error);
}

// ============================================================================
// VALIDATION ERROR RESPONSE
// ============================================================================

export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      message: "Validation failed",
      error: errors as any,
      statusCode: 422,
    },
    { status: 422 }
  );
}

// ============================================================================
// RATE LIMIT RESPONSE
// ============================================================================

export function rateLimitResponse(
  retryAfter: number = 60
): NextResponse<APIResponse> {
  const response = errorResponse("Too many requests", 429);
  response.headers.set("Retry-After", retryAfter.toString());
  return response;
}
