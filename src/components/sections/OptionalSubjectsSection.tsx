import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { optionals } from "@/lib/sample-data";

/** UPSC optional subjects grid. */
export default function OptionalSubjectsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-page">
        <SectionHeader
          title="Optional Subjects"
          subtitle="Deep-dive notes, PYQ solutions (2013-2024), answer-writing programs & mentorship for popular UPSC optional subjects."
          href="/optional"
        />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {optionals.map((o) => (
            <Link
              key={o.slug}
              href={`/optional/${o.slug}`}
              className={`group rounded-xl border border-white bg-gradient-to-br ${o.color} p-5 transition hover:shadow-card`}
            >
              <BookOpenCheck className="h-6 w-6 text-brand" />
              <div className="mt-3 font-bold text-gray-900">{o.title}</div>
              <div className="mt-1 text-xs text-gray-600 group-hover:text-brand">View resources →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
