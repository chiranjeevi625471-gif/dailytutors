/**
 * Common Utilities for UPSC Platform
 * Helper functions for various operations
 */

import slugify from "slugify";

// ============================================================================
// SLUG GENERATION
// ============================================================================

export function generateSlug(text: string): string {
  if (typeof text !== "string") return "";

  return slugify(text, {
    lower: true,
    strict: true,
    replacement: "-",
  });
}

// Keep the old function for backward compatibility
export function slugifyOld(text: string): string {
  if (typeof text !== "string") return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/[-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================================
// TEXT FORMATTING
// ============================================================================

export function truncate(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export function truncateText(text: string, maxLength: number = 150): string {
  return truncate(text, maxLength);
}

export function cleanHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function removeHtmlTags(html: string): string {
  return cleanHtml(html);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDaysAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

  return formatDate(d);
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function abbreviateNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Must contain number");
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export function getPaginationParams(
  page?: string | number | null,
  limit?: string | number | null
): { page: number; limit: number } {
  let p = parseInt(page as string) || 1;
  let l = parseInt(limit as string) || 12;

  if (p < 1) p = 1;
  if (l < 1) l = 12;
  if (l > 100) l = 100;

  return { page: p, limit: l };
}

export function getSkipValue(page: number, limit: number): number {
  return (page - 1) * limit;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

export function generateRandomString(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export function omit<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

// ============================================================================
// DELAY UTILITY
// ============================================================================

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

// ============================================================================
// ARTICLE VALIDATION
// ============================================================================

/**
 * Validate article payload for create/update. Returns a map of
 * field -> error message; an empty object means the data is valid.
 */
export function validateArticleData(data: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data?.title || String(data.title).trim().length < 3) {
    errors.title = "Title is required and must be at least 3 characters";
  }
  if (!data?.category || String(data.category).trim().length === 0) {
    errors.category = "Category is required";
  }
  if (!data?.summary || String(data.summary).trim().length === 0) {
    errors.summary = "Summary is required";
  }
  if (data?.metaDescription && String(data.metaDescription).length > 160) {
    errors.metaDescription = "Meta description must be 160 characters or fewer";
  }

  return errors;
}
