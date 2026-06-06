import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EXAM_CATEGORIES, getExamCategory } from "@/lib/exams";
import ExamCourses from "@/components/ExamCourses";

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

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-8">Available Courses</h2>
        <ExamCourses examSlug={params.slug} />
      </div>
    </div>
  );
}
