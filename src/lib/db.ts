import fs from "node:fs/promises";
import path from "node:path";
import type { HeroBanner, BannerCard, Post, Quiz, Course, Download, EntityName, PromoBanner } from "./types";
import { seedBanners, seedCards, seedPosts, seedQuizzes, seedCourses, seedDownloads, seedPromo } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch { /* ignore */ }
}

async function readJSON<T>(name: EntityName, fallback: T[]): Promise<T[]> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
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
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  banners: {
    list: () => readJSON<HeroBanner>("banners", seedBanners),
    save: (rows: HeroBanner[]) => writeJSON("banners", rows)
  },
  cards: {
    list: () => readJSON<BannerCard>("cards", seedCards),
    save: (rows: BannerCard[]) => writeJSON("cards", rows)
  },
  posts: {
    list: () => readJSON<Post>("posts", seedPosts),
    save: (rows: Post[]) => writeJSON("posts", rows)
  },
  quizzes: {
    list: () => readJSON<Quiz>("quizzes", seedQuizzes),
    save: (rows: Quiz[]) => writeJSON("quizzes", rows)
  },
  courses: {
    list: () => readJSON<Course>("courses", seedCourses),
    save: (rows: Course[]) => writeJSON("courses", rows)
  },
  downloads: {
    list: () => readJSON<Download>("downloads", seedDownloads),
    save: (rows: Download[]) => writeJSON("downloads", rows)
  },
  promobanners: {
    list: () => readJSON<PromoBanner>("promobanners", seedPromo),
    save: (rows: PromoBanner[]) => writeJSON("promobanners", rows)
  }
};

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
