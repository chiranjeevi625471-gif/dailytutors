/**
 * Lightweight admin auth helpers (env-password based).
 *
 * Kept separate from `auth.ts` on purpose: `auth.ts` pulls in NextAuth, which
 * isn't installed. These helpers are used by the admin login/logout routes and
 * must stay dependency-free so the simple admin login works without next-auth.
 *
 * The cookie name + token here must match `src/middleware.ts`, which guards
 * `/admin/*` by comparing the `dt_admin` cookie to this token.
 */
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "dt_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function getAdminToken() {
  return process.env.ADMIN_TOKEN || "dt_admin_token_v1";
}

export function isAuthed() {
  const c = cookies().get(ADMIN_COOKIE);
  return c?.value === getAdminToken();
}
