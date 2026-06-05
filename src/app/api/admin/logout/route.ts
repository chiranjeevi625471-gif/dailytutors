/**
 * Admin Logout API Endpoint
 * POST /api/admin/logout
 */

import { NextRequest } from "next/server";
import { successResponse, unauthorizedResponse, internalErrorResponse } from "@/lib/api-responses";
import { removeTokenCookie, verifyAdminAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Verify admin is logged in
    await verifyAdminAuth();

    // Remove token cookie
    await removeTokenCookie();

    return successResponse(null, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    return unauthorizedResponse("Invalid session");
  }
}
