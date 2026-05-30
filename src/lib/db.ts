import fs from "node:fs/promises";
import path from "node:path";
import type { HeroBanner, BannerCard, Post, Quiz, Course, Download, EntityName, PromoBanner } from "./types";
import { seedBanners, seedCards, seedPosts, seedQuizzes, seedCourses, seedDownloads, seedPromo } from "./seed";

// On Vercel, /var/task is read-only. Use /tmp/data for writes so cron jobs
// can update posts/quizzes at runtime. Data resets on cold start but crons
// repopulate it within seconds of each new invocation.
const IS_VERCEL = process.env.VERCEL === "1";
const SOURCE_DIR = path.join(process.cwd(), "data");          // read-only on Vercel
const WRITE_DIR  = IS_VERCEL ? "/tmp/data" : SOURCE_DIR;      // writable always

async function ensureDir() {
  try { await fs.mkdir(WRITE_DIR, { recursive: true }); } catch { /* ignore */ }
}

// Seed /tmp from the committed data file on first cold start
async function seedTmpIfNeeded(name: EntityName): Promise<void> {
  if (!IS_VERCEL) return;
  const tmpFile = path.join(WRITE_DIR, `${name}.json`);
  try {
    await fs.access(tmpFile);           // already exists in /tmp
  } catch {
    // Copy from the read-only deployment bundle to /tmp
    const srcFile = path.join(SOURCE_DIR, `${name}.json`);
    try {
      const data = await fs.readFile(srcFile, "utf-8");
      await fs.mkdir(WRITE_DIR, { recursive: true });
      await fs.writeFile(tmpFile, data, "utf-8");
    } catch {
      /* source file missing — will fall back to seed data */
    }
  }
}

async function readJSON<T>(name: EntityName, fallback: T[]): Promise<T[]> {
  await ensureDir();
  await seedTmpIfNeeded(name);
  const file = path.join(WRITE_DIR, `${name}.json`);
  try {
    const buf = await fs.readFile(file, "utf-8");
    return JSON.parse(buf) as T[];
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

async function writeJSON<T>(name: EntityName, data: T[]): Promise<void> {
  await ensureDir();
  const file = path.join(WRITE_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  banners:     { list: () => readJSON<HeroBanner>("banners",     seedBanners),  save: (r: HeroBanner[])  => writeJSON("banners",     r) },
  cards:       { list: () => readJSON<BannerCard>("cards",       seedCards),    save: (r: BannerCard[])  => writeJSON("cards",       r) },
  posts:       { list: () => readJSON<Post>("posts",             seedPosts),    save: (r: Post[])        => writeJSON("posts",       r) },
  quizzes:     { list: () => readJSON<Quiz>("quizzes",           seedQuizzes),  save: (r: Quiz[])        => writeJSON("quizzes",     r) },
  courses:     { list: () => readJSON<Course>("courses",         seedCourses),  save: (r: Course[])      => writeJSON("courses",     r) },
  downloads:   { list: () => readJSON<Download>("downloads",     seedDownloads),save: (r: Download[])    => writeJSON("downloads",   r) },
  promobanners:{ list: () => readJSON<PromoBanner>("promobanners",seedPromo),   save: (r: PromoBanner[]) => writeJSON("promobanners",r) },
};

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
