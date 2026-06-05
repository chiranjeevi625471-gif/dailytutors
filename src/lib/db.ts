import mongoose, { Schema, Model } from "mongoose";
import type { HeroBanner, BannerCard, Post, Quiz, Course, Download, EntityName, PromoBanner } from "./types";
import { seedBanners, seedCards, seedPosts, seedQuizzes, seedCourses, seedDownloads, seedPromo } from "./seed";
import { connectDB } from "./mongodb";

// Content entities (banners, cards, posts, quizzes, courses, downloads, promobanners)
// are stored in MongoDB so edits made through the admin panel persist across
// Vercel serverless instances and cold starts. Each entity lives in its own
// `content_<name>` collection, kept separate from the app's transactional models.

const SEEDS: Record<EntityName, any[]> = {
  banners: seedBanners,
  cards: seedCards,
  posts: seedPosts,
  quizzes: seedQuizzes,
  courses: seedCourses,
  downloads: seedDownloads,
  promobanners: seedPromo,
};

// Loose schema — these entities have varying shapes, so we store the whole
// object and only index on the string `id` we generate.
function getModel(name: EntityName): Model<any> {
  const modelName = `Content_${name}`;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  const schema = new Schema(
    { id: { type: String, unique: true, index: true } },
    { strict: false, collection: `content_${name}`, versionKey: false }
  );
  return mongoose.model(modelName, schema);
}

async function list<T>(name: EntityName, seed: T[]): Promise<T[]> {
  await connectDB();
  const Model = getModel(name);
  const count = await Model.estimatedDocumentCount();

  // First run: seed the collection from the committed seed data.
  if (count === 0 && seed.length > 0) {
    try {
      await Model.insertMany(seed, { ordered: false });
    } catch {
      /* ignore duplicate-key races from concurrent cold starts */
    }
  }

  const rows = await Model.find().lean().exec();
  const items = rows.map((r: any) => {
    delete r._id;
    delete r.__v;
    return r;
  }) as T[];

  // Preserve `order` sorting when present (matches previous homepage behavior).
  return items.sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));
}

// Callers always read the full list, modify it, then save the whole array back.
// Replace the entire collection to preserve that semantic exactly.
async function save<T>(name: EntityName, data: T[]): Promise<void> {
  await connectDB();
  const Model = getModel(name);
  await Model.deleteMany({});
  if (data.length > 0) {
    await Model.insertMany(data, { ordered: false });
  }
}

export const db = {
  banners:      { list: () => list<HeroBanner>("banners", seedBanners),       save: (r: HeroBanner[])  => save("banners", r) },
  cards:        { list: () => list<BannerCard>("cards", seedCards),           save: (r: BannerCard[])  => save("cards", r) },
  posts:        { list: () => list<Post>("posts", seedPosts),                 save: (r: Post[])        => save("posts", r) },
  quizzes:      { list: () => list<Quiz>("quizzes", seedQuizzes),             save: (r: Quiz[])        => save("quizzes", r) },
  courses:      { list: () => list<Course>("courses", seedCourses),           save: (r: Course[])      => save("courses", r) },
  downloads:    { list: () => list<Download>("downloads", seedDownloads),     save: (r: Download[])    => save("downloads", r) },
  promobanners: { list: () => list<PromoBanner>("promobanners", seedPromo),   save: (r: PromoBanner[]) => save("promobanners", r) },
};

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
