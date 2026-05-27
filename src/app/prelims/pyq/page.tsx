import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";

export const metadata = {
  title: "Previous Year Questions (PYQ) — UPSC Prelims | DailyTutors",
  description: "Complete repository of UPSC Prelims questions from past 30 years organized by topic, difficulty level, and exam year.",
};

export default function PYQPage() {
  return (
    <div className="container-page py-12 max-w-4xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="mt-6">
        <h1 className="text-4xl font-extrabold">Previous Year Questions (PYQ)</h1>
        <p className="mt-3 text-lg text-gray-600">
          Practice with actual UPSC Prelims questions from the past 30 years. Organized by subject, topic, and difficulty.
        </p>
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          <Filter className="h-4 w-4" />
          All Years
        </button>
        <button className="rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          GS Paper I
        </button>
        <button className="rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          GS Paper II (CSAT)
        </button>
        <button className="rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          Easy
        </button>
        <button className="rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          Medium
        </button>
        <button className="rounded-lg border border-gray-300 px-4 py-2 hover:border-brand hover:text-brand transition-colors">
          Hard
        </button>
      </div>

      <div className="mt-10 space-y-4">
        <div className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-brand px-2.5 py-1 rounded">GS Paper I</span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">2023</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded">Medium</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Which of the following best describes the concept of &lsquo;tragedy of the commons&rsquo;?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                (a) Overexploitation of shared resources leading to depletion
                <br/>(b) Government regulation of private property rights
                <br/>(c) Equal distribution of resources among communities
                <br/>(d) Protection of endangered species through international treaties
              </p>
            </div>
            <button className="ml-4 btn-outline text-sm">Attempt</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-brand px-2.5 py-1 rounded">GS Paper II (CSAT)</span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">2022</span>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded">Easy</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                If A is the father of B, and B is the father of C, what is the relationship between A and C?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                (a) Grandfather
                <br/>(b) Father
                <br/>(c) Cousin
                <br/>(d) Uncle
              </p>
            </div>
            <button className="ml-4 btn-outline text-sm">Attempt</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-brand px-2.5 py-1 rounded">GS Paper I</span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">2021</span>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded">Hard</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Which Indian freedom fighter was associated with the Khilafat Movement?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                (a) Subhas Chandra Bose
                <br/>(b) Maulana Abul Kalam Azad
                <br/>(c) Bal Gangadhar Tilak
                <br/>(d) Gopal Krishna Gokhale
              </p>
            </div>
            <button className="ml-4 btn-outline text-sm">Attempt</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-brand px-2.5 py-1 rounded">GS Paper I</span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">2024</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded">Medium</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Consider the following statements about the Indian Constitution:
                <br/>1. The Preamble is justiciable and enforceable.
                <br/>2. Fundamental Duties were added by the 42nd Amendment.
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Which statements are correct?
                <br/>(a) Only 1
                <br/>(b) Only 2
                <br/>(c) Both 1 and 2
                <br/>(d) Neither 1 nor 2
              </p>
            </div>
            <button className="ml-4 btn-outline text-sm">Attempt</button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button className="btn-outline">Load More Questions</button>
      </div>

      <div className="mt-12 rounded-lg bg-purple-50 p-8 border border-purple-200">
        <h2 className="text-2xl font-bold text-gray-900">How to Use This Section</h2>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex gap-3">
            <span className="text-brand font-bold">•</span>
            <span>Filter by year, subject, topic, or difficulty level</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">•</span>
            <span>Attempt each question with a timer for exam-realistic practice</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">•</span>
            <span>Review detailed explanations after submission</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">•</span>
            <span>Track your performance and identify weak areas</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
