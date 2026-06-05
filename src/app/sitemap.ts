import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { EXAM_CATEGORIES } from "@/lib/exams";
import { db } from "@/lib/db";
import { optionals } from "@/lib/sample-data";

// Core public pages with hand-tuned priorities.
const STATIC_ROUTES: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, freq: "daily" },
  { path: "/current-affairs", priority: 0.9, freq: "daily" },
  { path: "/daily-news-analysis", priority: 0.8, freq: "daily" },
  { path: "/editorial-analysis", priority: 0.8, freq: "daily" },
  { path: "/pib-summary", priority: 0.7, freq: "daily" },
  { path: "/yojana-kurukshetra", priority: 0.6, freq: "weekly" },
  { path: "/courses", priority: 0.9, freq: "weekly" },
  { path: "/exams", priority: 0.9, freq: "weekly" },
  { path: "/mains/answer-writing", priority: 0.8, freq: "weekly" },
  { path: "/mains/essay", priority: 0.6, freq: "weekly" },
  { path: "/mains/mind-maps", priority: 0.6, freq: "weekly" },
  { path: "/prelims/daily-quiz", priority: 0.8, freq: "daily" },
  { path: "/prelims/pyq", priority: 0.6, freq: "weekly" },
  { path: "/optional", priority: 0.6, freq: "weekly" },
  { path: "/downloads", priority: 0.7, freq: "weekly" },
  { path: "/about", priority: 0.5, freq: "monthly" },
  { path: "/contact", priority: 0.5, freq: "monthly" },
  { path: "/careers", priority: 0.4, freq: "monthly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // Exam category stub pages (those that have their own /exams/[slug] page).
  for (const e of EXAM_CATEGORIES) {
    if (!e.href) {
      entries.push({ url: absoluteUrl(`/exams/${e.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.6 });
    }
  }

  // Optional subjects + their sub-pages.
  for (const o of optionals) {
    for (const sub of ["", "/syllabus", "/notes", "/answer-writing"]) {
      entries.push({ url: absoluteUrl(`/optional/${o.slug}${sub}`), lastModified: now, changeFrequency: "monthly", priority: 0.4 });
    }
  }

  // Dynamic data — fail soft so the sitemap always builds.
  try {
    const courses = await db.courses.list();
    for (const c of courses) {
      if (c.active) entries.push({ url: absoluteUrl(`/courses/${c.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.7 });
    }
  } catch {}

  try {
    const posts = await db.posts.list();
    for (const p of posts) {
      for (const a of p.articles ?? []) {
        if (a.id) entries.push({ url: absoluteUrl(`/current-affairs/article/${a.id}`), lastModified: p.date ? new Date(p.date) : now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
  } catch {}

  return entries;
}
