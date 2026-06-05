import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BellRing } from "lucide-react";
import { EXAM_CATEGORIES, getExamCategory } from "@/lib/exams";

export function generateStaticParams() {
  // Only categories with a stub page; ones with a custom href are linked directly.
  return EXAM_CATEGORIES.filter((e) => !e.href).map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const exam = getExamCategory(params.slug);
  return { title: exam ? `${exam.title} · Daily Tutors` : "Exams · Daily Tutors" };
}

export default function ExamPage({ params }: { params: { slug: string } }) {
  const exam = getExamCategory(params.slug);
  if (!exam) notFound();
  if (exam.href) redirect(exam.href);

  return (
    <div className="container-page py-12">
      <Link href="/exams" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> All exams
      </Link>

      <div className="mt-6 max-w-3xl">
        <span className="badge">Exam</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">{exam.title}</h1>
        <p className="mt-4 text-lg text-gray-600">{exam.description}</p>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
          <BellRing className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold">Courses coming soon</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          We&apos;re putting together courses and resources for {exam.title}. Check back shortly.
        </p>
        <Link href="/courses" className="btn-primary mt-6 inline-flex">Browse all courses</Link>
      </div>
    </div>
  );
}
