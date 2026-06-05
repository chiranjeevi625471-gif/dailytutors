import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXAM_CATEGORIES, examHref } from "@/lib/exams";

/**
 * Homepage section: browse-by-exam category cards.
 * White cards with a soft colored arc, an illustration, sub-tags and an
 * "Explore Category" link. Responsive: 1 / 2 / 3 columns.
 */
export default function ExamCategoriesSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="badge">Courses by exam</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Find the right <span className="text-brand">exam</span> for you
          </h2>
          <p className="mt-2 text-gray-600">
            Pick your goal and explore structured courses, test series and resources.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {EXAM_CATEGORIES.map((e) => (
            <Link
              key={e.slug}
              href={examHref(e)}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
            >
              {/* Decorative colored arc + illustration */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${e.accent ?? "bg-gray-50"}`}
                aria-hidden
              />
              <span className="absolute right-5 top-5 text-3xl sm:text-4xl" aria-hidden>
                {e.emoji ?? "🎓"}
              </span>

              <div className="relative">
                <h3 className="pr-16 text-xl sm:text-2xl font-bold text-gray-900">{e.label}</h3>

                {e.tags && e.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs sm:text-sm font-medium text-gray-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                  Explore Category
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
