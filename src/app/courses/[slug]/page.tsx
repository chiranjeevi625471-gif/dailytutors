import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, GraduationCap, Zap } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const courses = await db.courses.list();
  const course = courses.find((c) => c.slug === params.slug);
  return { title: course ? `${course.title} · Daily Tutors` : "Course · Daily Tutors" };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const courses = await db.courses.list();
  const course = courses.find((c) => c.slug === params.slug && c.active);
  if (!course) notFound();

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="container-page py-12">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          {course.badge && <span className="badge bg-brand text-white">{course.badge}</span>}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-brand" />
            <span className="font-bold text-brand">{course.level}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{course.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{course.description}</p>

          <h2 className="mt-10 text-xl font-bold">What you&apos;ll get</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {(course.features || []).map((f) => {
              const highlighted = course.highlightFeatures?.includes(f);
              return (
                <li key={f} className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-none text-brand mt-0.5" />
                  <span className={highlighted ? "font-semibold text-gray-900" : "text-gray-700"}>{f}</span>
                </li>
              );
            })}
          </ul>

          {course.whyChoose && (
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-none" />
                <div>
                  <p className="font-bold text-blue-900">Why choose this?</p>
                  <p className="mt-1 text-blue-800">{course.whyChoose}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            {course.originalPrice ? (
              <>
                <div className="text-sm text-gray-500">Actual Price</div>
                <div className="text-xl line-through text-gray-400">₹{course.originalPrice.toLocaleString("en-IN")}</div>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <div>
                    <span className="text-xs text-gray-600">Your Price</span>
                    <div className="text-3xl font-extrabold text-green-600">₹{course.price.toLocaleString("en-IN")}</div>
                  </div>
                  {discount > 0 && <span className="ml-auto badge bg-green-100 text-green-700">Save {discount}%</span>}
                </div>
              </>
            ) : (
              <div className="text-3xl font-extrabold">₹{course.price.toLocaleString("en-IN")}</div>
            )}

            <Link href="/contact" className="btn-primary mt-5 w-full">Enroll Now</Link>
            <p className="mt-3 text-center text-xs text-gray-500">Have questions? <Link href="/contact" className="text-brand hover:underline">Talk to us</Link></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
