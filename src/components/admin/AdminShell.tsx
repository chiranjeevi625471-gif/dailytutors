"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Image, Layers, Newspaper, Brain, GraduationCap, Download,
  LogOut, ShieldCheck, ExternalLink
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/banners", label: "Hero Banners", icon: Image },
  { href: "/admin/cards", label: "Banner Cards (8)", icon: Layers },
  { href: "/admin/promobanners", label: "Promo Banners (3)", icon: Image },
  { href: "/admin/posts", label: "Current Affairs", icon: Newspaper },
  { href: "/admin/quizzes", label: "Quizzes & Schedule", icon: Brain },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/downloads", label: "Downloads", icon: Download }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // login page renders standalone
  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold">Daily<span className="text-brand">Tutors</span></div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">Admin</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-brand text-white" : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <ExternalLink className="h-4 w-4" /> View Site
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <header className="lg:hidden flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-extrabold">Admin</span>
        </div>
        <button onClick={logout} className="text-sm text-gray-600">Logout</button>
      </header>

      <div className="lg:hidden border-b border-gray-100 bg-white overflow-x-auto">
        <nav className="flex gap-1 px-2 py-2 whitespace-nowrap">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
