"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, GraduationCap, Brain, Download,
  Image as ImageIcon, Layers, Newspaper, ArrowRight, RefreshCw
} from "lucide-react";

type Card = { label: string; value: string | number; sub?: string; href: string; icon: any };

export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [content, setContent] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const entityRes = await Promise.all([
        fetch("/api/admin/banners", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/cards", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/promobanners", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/posts", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/downloads", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);

      setCards([
        { label: "Articles", value: "Manage", href: "/admin/articles", icon: FileText },
        { label: "Courses", value: "Manage", href: "/admin/courses", icon: GraduationCap },
        { label: "Quizzes", value: "Manage", href: "/admin/quizzes", icon: Brain },
      ]);

      const [banners, bcards, promo, posts, downloads] = entityRes.map((x) => (Array.isArray(x) ? x : []));
      setContent([
        { label: "Hero Banners", value: banners.length, sub: `${banners.filter((b: any) => b.active).length} active`, href: "/admin/banners", icon: ImageIcon },
        { label: "Banner Cards", value: bcards.length, sub: `${bcards.filter((b: any) => b.active).length} active`, href: "/admin/cards", icon: Layers },
        { label: "Promo Banners", value: promo.length, sub: `${promo.filter((b: any) => b.active).length} active`, href: "/admin/promobanners", icon: ImageIcon },
        { label: "Current Affairs", value: posts.length, sub: `${posts.filter((b: any) => b.active).length} active`, href: "/admin/posts", icon: Newspaper },
        { label: "Downloads", value: downloads.length, sub: `${downloads.filter((b: any) => b.active).length} active`, href: "/admin/downloads", icon: Download },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Manage every part of Daily Tutors from the sidebar.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cards || Array.from({ length: 3 })).map((c: any, i) =>
          c ? (
            <Link key={c.label} href={c.href} className="group rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{c.label}</div>
                  <div className="text-2xl font-extrabold">{c.value}</div>
                  {c.sub && <div className="text-[11px] text-gray-400">{c.sub}</div>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-brand">
                  Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ) : (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-100 bg-white" />
          )
        )}
      </div>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-widest text-gray-500">Homepage content</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(content || Array.from({ length: 5 })).map((c: any, i) =>
          c ? (
            <Link key={c.label} href={c.href} className="group rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{c.label}</div>
                  <div className="text-2xl font-extrabold">{c.value}</div>
                  {c.sub && <div className="text-[11px] text-gray-400">{c.sub}</div>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-brand">
                  Manage <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ) : (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-100 bg-white" />
          )
        )}
      </div>
    </div>
  );
}
            <Link key={c.label} href={c.href} className="group rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{c.label}</div>
                  <div className="text-2xl font-extrabold">{c.value}</div>
                  {c.sub && <div className="text-[11px] text-gray-400">{c.sub}</div>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-brand">
                  Manage <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ) : (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-100 bg-white" />
          )
        )}
      </div>
    </div>
  );
}
