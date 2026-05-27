import Link from "next/link";
import { db } from "@/lib/db";
import { Image, Layers, Newspaper, Brain, GraduationCap, Download, ArrowRight, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [banners, cards, posts, quizzes, courses, downloads] = await Promise.all([
    db.banners.list(), db.cards.list(), db.posts.list(),
    db.quizzes.list(), db.courses.list(), db.downloads.list()
  ]);

  const stats = [
    { label: "Hero Banners", value: banners.length, active: banners.filter((b) => b.active).length, href: "/admin/banners", icon: Image },
    { label: "Banner Cards", value: cards.length, active: cards.filter((c) => c.active).length, href: "/admin/cards", icon: Layers },
    { label: "Current Affairs", value: posts.length, active: posts.filter((p) => p.active).length, href: "/admin/posts", icon: Newspaper },
    { label: "Quizzes", value: quizzes.length, active: quizzes.filter((q) => q.active).length, href: "/admin/quizzes", icon: Brain },
    { label: "Courses", value: courses.length, active: courses.filter((c) => c.active).length, href: "/admin/courses", icon: GraduationCap },
    { label: "Downloads", value: downloads.length, active: downloads.filter((d) => d.active).length, href: "/admin/downloads", icon: Download }
  ];

  const upcomingQuizzes = quizzes
    .filter((q) => q.scheduledAt)
    .sort((a, b) => (a.scheduledAt! < b.scheduledAt! ? -1 : 1))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">Manage banners, posts, quizzes and the rest of the site from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, active, href, icon: Icon }) => (
          <Link key={label} href={href} className="group rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
                <div className="text-2xl font-extrabold">{value}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{active} active</span>
              <span className="inline-flex items-center gap-1 text-brand font-semibold">
                Manage <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand" />
          <h2 className="font-bold">Upcoming Scheduled Quizzes</h2>
        </div>
        <div className="mt-4 divide-y divide-gray-100">
          {upcomingQuizzes.length === 0 && (
            <p className="text-sm text-gray-500">No quizzes scheduled. <Link href="/admin/quizzes" className="text-brand font-semibold">Schedule one →</Link></p>
          )}
          {upcomingQuizzes.map((q) => (
            <div key={q.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-semibold">{q.title}</div>
                <div className="text-xs text-gray-500">{q.type} · {q.questions} Qs · {q.duration}</div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(q.scheduledAt!).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
