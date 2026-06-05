/**
 * Authentication Utilities
 * Handles JWT tokens, password hashing, and admin authentication
 */

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import { JWTPayload, Admin, AuthenticationError, AuthorizationError } from "@/types";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "7d";
const COOKIE_NAME = "admin_token";

// ============================================================================
// PASSWORD HASHING
// ============================================================================

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// ============================================================================
// JWT TOKEN MANAGEMENT
// ============================================================================

export function generateToken(admin: Admin): string {
  const payload: JWTPayload = {
    adminId: admin._id?.toString() || "",
    email: admin.email,
    role: admin.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
}

// ============================================================================
// COOKIE MANAGEMENT
// ============================================================================

export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function getTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token;
}

export async function removeTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ============================================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================================================

export async function verifyAdminAuth(): Promise<JWTPayload> {
  try {
    const token = await getTokenFromCookie();

    if (!token) {
      throw new AuthenticationError("No token found");
    }

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Authentication failed");
  }
}

export async function verifyAdminPermission(requiredPermission: string): Promise<JWTPayload> {
  const admin = await verifyAdminAuth();

  // Superadmins have all permissions
  if (admin.role === "superadmin") {
    return admin;
  }

  // For other roles, check specific permission
  // Note: Full permission checking would require fetching from DB
  // This is a simplified version
  throw new AuthorizationError("Insufficient permissions");
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// TOKEN UTILITIES
// ============================================================================

export function getTokenExpiry(token: string): Date {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return new Date((decoded.exp ?? 0) * 1000);
  } catch {
    throw new AuthenticationError("Invalid token");
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const expiry = getTokenExpiry(token);
    return expiry < new Date();
  } catch {
    return true;
  }
}
