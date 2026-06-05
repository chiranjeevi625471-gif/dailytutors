import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin · Daily Tutors",
  robots: { index: false, follow: false }
};

// Admin pages are auth-gated and data-driven — never statically prerendered.
// This also covers client pages that use useSearchParams() without Suspense.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
