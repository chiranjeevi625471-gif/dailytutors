import Link from "next/link";
import { notFound } from "next/navigation";
import { optionals } from "@/lib/sample-data";
import { FileText, ArrowLeft, BookOpen, PenLine, ExternalLink } from "lucide-react";

export function generateStaticParams() {
  return optionals.map((o) => ({ slug: o.slug }));
}

export default function OptionalSubjectPage({ params }: { params: { slug: string } }) {
  const subject = optionals.find((o) => o.slug === params.slug);
  if (!subject) return notFound();

  return (
    <div className="container-page py-12">
      <Link href="/optional" className="link-arrow"><ArrowLeft className="h-4 w-4" /> All Optionals</Link>

      <div className={`mt-6 rounded-2xl bg-gradient-to-br ${subject.color} p-10`}>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{subject.title}</h1>
        <p className="mt-2 text-gray-700 max-w-2xl">
          A complete resource hub for {subject.title} optional — syllabus-aligned notes, topper strategies, PYQs and answer-writing.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">About {subject.title}</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{subject.content}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Resource Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subject.sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition group"
            >
              <ExternalLink className="h-5 w-5 text-brand mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand transition">{source.title}</h3>
                <p className="text-sm text-gray-600 truncate">{source.url}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[
          { icon: BookOpen, title: "Syllabus & Strategy", desc: "Paper-wise breakdown, recommended booklist and topper strategy.", path: "syllabus" },
          { icon: FileText, title: "Topic-wise Notes", desc: "Compact, exam-ready notes with diagrams and case studies.", path: "notes" },
          { icon: PenLine, title: "Answer Writing", desc: "Daily questions and structured frameworks specific to the optional.", path: "answer-writing" }
        ].map(({ icon: Icon, title, desc, path }) => (
          <Link key={title} href={`/optional/${subject.slug}/${path}`} className="card p-6 hover:shadow-card transition cursor-pointer">
            <Icon className="h-8 w-8 text-brand" />
            <h3 className="mt-3 text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
            <div className="link-arrow mt-4">Browse</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
