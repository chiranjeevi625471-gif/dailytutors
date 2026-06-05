import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Quiz } from "@/lib/types";

/** Today's Quizzes + Mains Answer Writing split section. */
export default function PracticeHighlightsSection({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <section className="container-page py-12 sm:py-16 md:py-20 grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader title="Today's Quizzes" href="/prelims/daily-quiz" />
        <div className="mt-6 space-y-3">
          {quizzes.map((q) => (
            <Link key={q.slug} href={`/prelims/daily-quiz/${q.slug}`} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge">{q.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(q.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h4 className="mt-1.5 font-semibold text-gray-900">{q.title}</h4>
                <p className="mt-0.5 text-xs text-gray-500">{q.questions} questions · {q.duration}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-brand flex-none" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Mains Answer Writing" href="/mains/answer-writing" />
        <div className="mt-6 card p-6">
          <span className="badge">Today · GS Paper II</span>
          <h3 className="mt-3 text-xl font-bold">
            &ldquo;The doctrine of basic structure has both protected and constrained Indian democracy.&rdquo; Critically examine.
          </h3>
          <p className="mt-2 text-sm text-gray-600">15 marks · 250 words · Submit by 11:59 PM IST</p>

          <div className="mt-5 grid gap-2 text-sm text-gray-700">
            {[
              "Define the doctrine and its evolution (Kesavananda → Minerva Mills → I.R. Coelho).",
              "Argue both sides — protection of rights vs judicial overreach.",
              "Conclude with way forward referencing recent debates."
            ].map((p, i) => (
              <div key={i} className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 flex-none text-brand mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mains/answer-writing/today" className="btn-primary">Write Answer</Link>
            <Link href="/mains/answer-writing" className="btn-outline">Past Questions</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
