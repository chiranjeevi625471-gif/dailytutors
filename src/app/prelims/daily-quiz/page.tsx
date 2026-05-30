import Link from "next/link";
import { db } from "@/lib/db";
import { Brain, Clock, ArrowRight, Trophy, Calendar, AlertCircle } from "lucide-react";

export const metadata = { title: "Daily Quiz · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function QuizzesPage() {
  const all = await db.quizzes.list();
  const today = new Date().toISOString().slice(0, 10);

  const active = all.filter(q => q.active);

  // Today's quiz — prefer ≥20 items, accept ≥10 as fallback
  const todayQuiz =
    active.find(q => q.date === today && Array.isArray(q.items) && q.items.length >= 20) ||
    active.find(q => q.date === today && (Array.isArray(q.items) ? q.items.length : q.questions) >= 10);

  // If today's isn't ready yet, show most recent quiz with ≥20 items
  const fallbackQuiz = !todayQuiz
    ? active
        .filter(q => Array.isArray(q.items) && q.items.length >= 20)
        .sort((a, b) => (a.date > b.date ? -1 : 1))[0]
    : null;

  const displayQuiz = todayQuiz || fallbackQuiz;
  const isToday     = displayQuiz?.date === today;

  const qCount = displayQuiz
    ? Array.isArray(displayQuiz.items) ? displayQuiz.items.length : displayQuiz.questions
    : 0;

  return (
    <div className="container-page py-12">

      {/* Page header */}
      <div className="grid gap-6 lg:grid-cols-3 mb-10">
        <div className="lg:col-span-2">
          <h1 className="section-title">Prelims Daily Quiz</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            Daily MCQs generated from today&rsquo;s current affairs — instant scoring with detailed explanations.
          </p>
        </div>
        <div className="card p-5 bg-brand text-white">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            <div>
              <div className="text-sm opacity-90">Your Streak</div>
              <div className="text-2xl font-extrabold">12 days</div>
            </div>
          </div>
          <p className="mt-2 text-sm opacity-90">Take today&rsquo;s quiz to keep going!</p>
        </div>
      </div>

      {/* Today not generated yet — info banner */}
      {!todayQuiz && fallbackQuiz && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Today&rsquo;s quiz is being generated</p>
            <p className="text-amber-700 mt-0.5">
              Showing the most recent quiz below. Today&rsquo;s will appear automatically once the server fetches today&rsquo;s current affairs (or restart the dev server).
            </p>
          </div>
        </div>
      )}

      {displayQuiz ? (
        <Link
          href={`/prelims/daily-quiz/${displayQuiz.slug}`}
          className="group block rounded-2xl border-2 border-gray-200 bg-white p-7 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="badge">{displayQuiz.type}</span>
            {isToday ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold text-gray-500">
                <Calendar className="h-3 w-3" />
                {new Date(displayQuiz.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand transition leading-snug">
            {isToday ? "Today's Daily Quiz" : displayQuiz.title}
          </h2>
          {!isToday && (
            <p className="mt-1 text-sm text-gray-500">{displayQuiz.title}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Brain className="h-4 w-4 text-brand" />
              {qCount} Questions
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-brand" />
              {displayQuiz.duration}
            </span>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-brand-700">
            Start Quiz <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">📝</p>
          <h3 className="font-bold text-gray-900 text-lg mb-1">No quiz available yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Quizzes are auto-generated daily. Restart the dev server or generate one from the admin panel.
          </p>
          <Link href="/admin/quizzes" className="btn-primary">
            Go to Admin Panel
          </Link>
        </div>
      )}

    </div>
  );
}
