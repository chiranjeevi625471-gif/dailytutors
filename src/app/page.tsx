import HeroCarousel from "@/components/HeroCarousel";
import StatsBar from "@/components/StatsBar";
import ExamCategoriesSection from "@/components/ExamCategoriesSection";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function bySlug<T extends { active?: boolean; order?: number }>(rows: T[]) {
  return rows.filter((r) => r.active !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export default async function HomePage() {
  const banners = await db.banners.list();
  const slides = bySlug(banners);

  return (
    <>
      <HeroCarousel slides={slides} />

      <StatsBar />

      <ExamCategoriesSection />

      {/* Newsletter */}
      <section className="bg-brand">
        <div className="container-page py-14 text-white grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Don&rsquo;t miss the daily edge.</h3>
            <p className="mt-2 text-white/90">
              Join 1,20,000+ aspirants who get the daily current affairs brief in their inbox at 8 AM IST.
            </p>
          </div>
          <form className="flex gap-2 w-full max-w-md md:ml-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full rounded-md border-0 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-brand hover:bg-brand-50">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
