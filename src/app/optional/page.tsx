import Link from "next/link";
import { optionals } from "@/lib/sample-data";
import { BookOpenCheck, ArrowRight } from "lucide-react";

export const metadata = { title: "Optional Subjects · Daily Tutors" };

export default function OptionalPage() {
  return (
    <div className="container-page py-12">
      <h1 className="section-title">Optional Subjects</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-600">
        Structured notes, PYQs and answer-writing programmes for popular optionals.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {optionals.map((o) => (
          <Link
            key={o.slug}
            href={`/optional/${o.slug}`}
            className={`group rounded-2xl border border-white bg-gradient-to-br ${o.color} p-6 transition hover:shadow-card`}
          >
            <BookOpenCheck className="h-8 w-8 text-brand" />
            <h3 className="mt-4 text-xl font-bold">{o.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{o.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
