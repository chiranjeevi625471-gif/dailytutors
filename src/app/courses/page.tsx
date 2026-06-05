import Link from "next/link";
import { db } from "@/lib/db";
import { CheckCircle2, Clock, GraduationCap, Zap } from "lucide-react";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import PracticeHighlightsSection from "@/components/sections/PracticeHighlightsSection";
import OptionalSubjectsSection from "@/components/sections/OptionalSubjectsSection";

export const metadata = { title: "Competitive Exams (UPSC) · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [allCourses, allQuizzes] = await Promise.all([db.courses.list(), db.quizzes.list()]);
  const courses = allCourses.filter((c) => c.active);
  const quizzes = allQuizzes.filter((q) => q.active);

  return (
    <>
    <div className="container-page py-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="badge">Live · Recorded · Hybrid</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Structured Courses for <span className="text-brand">UPSC CSE</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Two-year foundation programmes, prelims test series, and mains answer-writing — designed by educators with 10+ years of experience.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {courses.map((c, idx) => {
          const colors = [
            "from-blue-50 to-blue-100",
            "from-emerald-50 to-emerald-100",
            "from-violet-50 to-violet-100",
            "from-amber-50 to-amber-100",
            "from-rose-50 to-rose-100",
            "from-teal-50 to-teal-100",
            "from-orange-50 to-orange-100",
            "from-pink-50 to-pink-100"
          ];
          const cardColor = colors[idx % colors.length];
          return (
          <div key={c.slug} className={`rounded-2xl border border-white bg-gradient-to-br ${cardColor} p-6 flex flex-col`}>
            {c.badge && <span className="badge mb-3 self-start bg-brand text-white">{c.badge}</span>}
            <div className="flex items-center gap-2 text-xs">
              <GraduationCap className="h-4 w-4 text-brand" />
              <span className="font-bold text-brand underline">{c.level}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{c.description}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {(c.features || []).map((f) => {
                const isHighlighted = c.highlightFeatures?.includes(f);
                return (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-none text-brand mt-0.5" />
                    <span className={isHighlighted ? "text-gray-900 font-bold" : "text-gray-700"}>{f}</span>
                  </li>
                );
              })}
            </ul>

            {c.whyChoose && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-900">Why Choose This?</p>
                    <p className="text-blue-800 mt-1">{c.whyChoose}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-6">
              <div className="space-y-2">
                {c.originalPrice ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">Actual Price:</span>
                      <span className="text-2xl font-bold">₹{c.originalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 p-2.5 rounded-lg">
                      <div>
                        <span className="text-xs text-gray-600">Your Price:</span>
                        <div className="text-2xl font-extrabold text-green-600">₹{c.price.toLocaleString("en-IN")}</div>
                      </div>
                      <span className="ml-auto badge bg-green-100 text-green-700">
                        Save {Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold">₹{c.price.toLocaleString("en-IN")}</span>
                )}
              </div>
              <Link href={`/courses/${c.slug}`} className="btn-primary mt-4 w-full">Enroll Now</Link>
            </div>
          </div>
          );
        })}
      </div>
    </div>

    <FeatureGridSection />
    <PracticeHighlightsSection quizzes={quizzes} />
    <OptionalSubjectsSection />
    </>
  );
}
