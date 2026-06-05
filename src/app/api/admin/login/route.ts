/**
 * Admin Login API Endpoint
 * POST /api/admin/login
 */

import { NextRequest } from "next/server";
import { AdminModel } from "@/lib/models";
import { generateToken, verifyPassword, hashPassword, setTokenCookie, validatePassword } from "@/lib/auth-utils";
import { successResponse, badRequestResponse, internalErrorResponse, unauthorizedResponse } from "@/lib/api-responses";
import { connectDB } from "@/lib/mongodb";
import { AdminLoginRequest, Admin } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body: AdminLoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return badRequestResponse("Email and password are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequestResponse("Invalid email format");
    }

    // Find admin by email
    const admin = await AdminModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (!admin) {
      return unauthorizedResponse("Invalid email or password");
    }

    if (!admin.isActive) {
      return unauthorizedResponse("Account is inactive");
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.passwordHash);

    if (!isValidPassword) {
      return unauthorizedResponse("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(admin);

    // Set token in secure cookie
    await setTokenCookie(token);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return response (exclude password hash)
    const adminData = admin.toObject();
    delete (adminData as any).passwordHash;

    return successResponse(
      {
        token,
        admin: adminData,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return internalErrorResponse("Login failed", error);
  }
}
