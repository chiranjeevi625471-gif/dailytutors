import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import QuizAttempt from "./QuizAttempt";

export const dynamic = "force-dynamic";

export default async function QuizAttemptPage({ params }: { params: { slug: string } }) {
  const all = await db.quizzes.list();
  const quiz = all.find((q) => q.slug === params.slug && q.active);
  if (!quiz) return notFound();
  return <QuizAttempt title={quiz.title} items={quiz.items ?? []} />;
}
