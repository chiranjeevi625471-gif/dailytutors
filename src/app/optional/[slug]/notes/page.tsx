import Link from "next/link";
import { notFound } from "next/navigation";
import { optionals } from "@/lib/sample-data";
import { ArrowLeft, Download, Eye } from "lucide-react";

export function generateStaticParams() {
  return optionals.map((o) => ({ slug: o.slug }));
}

const notesContent: Record<string, any> = {
  sociology: [
    { title: "Introduction to Sociology", size: "2.4 MB", pages: 45, date: "May 2026" },
    { title: "Social Structure & Stratification", size: "3.1 MB", pages: 62, date: "May 2026" },
    { title: "Caste System in India", size: "2.8 MB", pages: 54, date: "April 2026" },
    { title: "Family & Kinship Systems", size: "2.2 MB", pages: 38, date: "April 2026" },
    { title: "Religion and Social Change", size: "2.6 MB", pages: 51, date: "March 2026" }
  ],
  history: [
    { title: "Ancient Indian Kingdoms", size: "3.5 MB", pages: 68, date: "May 2026" },
    { title: "Mughal Empire: Politics & Culture", size: "4.2 MB", pages: 78, date: "May 2026" },
    { title: "British Rule & Administration", size: "3.8 MB", pages: 72, date: "April 2026" },
    { title: "Indian Independence Movement", size: "4.1 MB", pages: 75, date: "April 2026" },
    { title: "Post-Independence India", size: "3.3 MB", pages: 61, date: "March 2026" }
  ],
  geography: [
    { title: "Indian Physical Geography", size: "4.2 MB", pages: 85, date: "May 2026" },
    { title: "Monsoon System & Climate", size: "3.5 MB", pages: 68, date: "May 2026" },
    { title: "Agricultural Systems of India", size: "3.8 MB", pages: 72, date: "April 2026" },
    { title: "Minerals & Industries", size: "3.1 MB", pages: 61, date: "April 2026" },
    { title: "Transportation & Trade", size: "2.9 MB", pages: 55, date: "March 2026" }
  ]
};

export default function NotesPage({ params }: { params: { slug: string } }) {
  const subject = optionals.find((o) => o.slug === params.slug);
  if (!subject) return notFound();

  const content = notesContent[subject.slug] || notesContent.sociology;

  return (
    <div className="container-page py-12">
      <Link href={`/optional/${subject.slug}`} className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className={`mt-6 rounded-2xl bg-gradient-to-br ${subject.color} p-10`}>
        <h1 className="text-4xl font-extrabold">{subject.title}</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">Topic-wise Notes</h2>
      </div>

      <div className="mt-10">
        <p className="text-gray-600 mb-8">
          Exam-ready notes with diagrams, case studies, and key concepts. Download and study offline.
        </p>

        <div className="grid gap-4">
          {content?.map((note: any, idx: number) => (
            <div key={idx} className="card p-6 flex items-center justify-between hover:shadow-card transition">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
                <div className="mt-2 flex gap-4 text-sm text-gray-600">
                  <span>{note.pages} pages</span>
                  <span>•</span>
                  <span>{note.size}</span>
                  <span>•</span>
                  <span>{note.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-brand text-brand font-semibold transition">
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-red-700 transition">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 mb-2">How to Study These Notes</h3>
        <ul className="space-y-2 text-amber-800">
          <li>• Read through the notes thoroughly to understand concepts</li>
          <li>• Create your own summaries and mind maps</li>
          <li>• Use diagrams to visualize complex topics</li>
          <li>• Reference case studies for real-world applications</li>
          <li>• Keep a revision schedule and review regularly</li>
        </ul>
      </div>
    </div>
  );
}
