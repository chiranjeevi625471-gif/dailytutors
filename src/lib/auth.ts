import { cookies } from "next/headers";

export const ADMIN_COOKIE = "dt_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function getAdminToken() {
  // Simple token: we just check the cookie value matches a constant secret
  // derived from the password. Not cryptographically signed — suitable for
  // single-admin demo. Swap for NextAuth/Supabase Auth in production.
  return process.env.ADMIN_TOKEN || "dt_admin_token_v1";
}

export function isAuthed() {
  const c = cookies().get(ADMIN_COOKIE);
  return c?.value === getAdminToken();
}
