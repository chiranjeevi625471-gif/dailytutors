/**
 * Admin Registration API Endpoint
 * POST /api/admin/register
 * For initial admin setup only
 */

import { NextRequest } from "next/server";
import { AdminModel } from "@/lib/models";
import { hashPassword, validatePassword as validatePasswordStrength } from "@/lib/auth-utils";
import { successResponse, badRequestResponse, internalErrorResponse, conflictResponse } from "@/lib/api-responses";
import { connectDB } from "@/lib/mongodb";

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  setupToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body: RegisterRequest = await request.json();
    const { email, password, name, setupToken } = body;

    // Validate input
    if (!email || !password || !name) {
      return badRequestResponse("Email, password, and name are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequestResponse("Invalid email format");
    }

    if (name.trim().length < 2) {
      return badRequestResponse("Name must be at least 2 characters");
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return badRequestResponse("Password is too weak", {
        errors: passwordValidation.errors,
      });
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return conflictResponse("Admin with this email already exists");
    }

    // Check if any admin exists (for first admin creation)
    const adminCount = await AdminModel.countDocuments();
    
    // If admin exists and no setup token provided, deny registration
    if (adminCount > 0 && !setupToken) {
      return badRequestResponse("Admin registration is not allowed");
    }

    // Verify setup token if provided
    if (setupToken && setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return badRequestResponse("Invalid setup token");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin
    const admin = new AdminModel({
      email: email.toLowerCase(),
      password: passwordHash,
      passwordHash, // Store as passwordHash
      name,
      role: adminCount === 0 ? "superadmin" : "editor", // First admin is superadmin
      permissions: ["manage_articles", "manage_courses", "manage_quizzes", "manage_payments", "view_analytics"],
      isActive: true,
    });

    await admin.save();

    // Return success response
    const adminData = admin.toObject();
    delete (adminData as any).passwordHash;
    delete (adminData as any).password;

    return successResponse(
      {
        admin: adminData,
      },
      "Admin registration successful"
    );
  } catch (error) {
    console.error("Registration error:", error);
    return internalErrorResponse("Registration failed", error);
  }
}
