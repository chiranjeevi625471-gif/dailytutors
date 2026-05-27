import Link from "next/link";
import { db } from "@/lib/db";
import { Brain, Clock, ArrowRight, Trophy } from "lucide-react";

export const metadata = { title: "Quizzes · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function QuizzesPage() {
  const all = await db.quizzes.list();
  const today = new Date().toISOString().slice(0, 10);
  // Only show today's quiz with 20-50 questions, prefer one with items (current affairs)
  const todayQuiz = all.find(q => {
    const isToday = q.date === today;
    const count = Array.isArray(q.items) ? q.items.length : q.questions;
    return isToday && count >= 20 && count <= 50 && Array.isArray(q.items) && q.items.length >= 20;
  }) || all.find(q => {
    const isToday = q.date === today;
    const count = Array.isArray(q.items) ? q.items.length : q.questions;
    return isToday && count >= 20 && count <= 50;
  });

  return (
    <div className="container-page py-12">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="section-title">Prelims Quizzes</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            Daily MCQs, static quizzes and CSAT practice — instant scoring with detailed explanations.
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
          <p className="mt-2 text-sm opacity-90">Take today&rsquo;s quiz to keep going.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {todayQuiz ? (
          <Link key={todayQuiz.slug} href={`/prelims/daily-quiz/${todayQuiz.slug}`} className="card p-6 group">
            <div className="flex items-center justify-between">
              <span className="badge">{todayQuiz.type}</span>
            </div>
            <h3 className="mt-3 text-lg font-bold group-hover:text-brand">Today's Quiz</h3>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1"><Brain className="h-4 w-4" />{Array.isArray(todayQuiz.items) ? todayQuiz.items.length : todayQuiz.questions} Qs</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{todayQuiz.duration}</span>
            </div>
            <div className="mt-4 link-arrow">Start Quiz <ArrowRight className="h-4 w-4" /></div>
          </Link>
        ) : (
          <div className="card p-6 text-center">No quiz available for today with 20-50 questions.</div>
        )}
      </div>

      {!todayQuiz && (
        <div className="mt-10 rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
          No quizzes published yet. Schedule one from the <Link href="/admin/quizzes" className="text-brand font-semibold">admin panel</Link>.
        </div>
      )}
    </div>
  );
}
