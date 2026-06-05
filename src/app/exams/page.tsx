import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { EXAM_CATEGORIES } from "@/lib/exams";

export const metadata = { title: "Exams · Daily Tutors" };

export default function ExamsPage() {
  return (
    <div className="container-page py-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="badge">Choose your exam</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Prepare for the <span className="text-brand">right exam</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Structured guidance and courses across school boards and competitive exams.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {EXAM_CATEGORIES.map((e) => (
          <Link
            key={e.slug}
            href={`/exams/${e.slug}`}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition hover:border-brand-200 hover:shadow-lg"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{e.label}</h3>
            <p className="mt-2 text-sm text-gray-600">{e.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
