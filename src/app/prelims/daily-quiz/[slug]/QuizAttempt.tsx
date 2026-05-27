"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, ChevronRight } from "lucide-react";
import type { QuestionItem, MCQQuestion } from "@/lib/types";

const FALLBACK: MCQQuestion[] = [
  {
    type: "mcq",
    q: "Which of the following best describes the Doctrine of Basic Structure?",
    options: [
      "It is explicitly enshrined in the Constitution of India.",
      "It was propounded in the Kesavananda Bharati case (1973).",
      "It permits Parliament to alter any provision of the Constitution.",
      "It is identical to the doctrine of pith and substance."
    ],
    correct: 1,
    explain: "The doctrine was developed in Kesavananda Bharati v. State of Kerala (1973) — it limits Parliament's amending power."
  }
];

export default function QuizAttempt({ title, items }: { title: string; items: QuestionItem[] }) {
  // Filter to MCQ questions only
  const mcqItems = items.filter((item): item is MCQQuestion => item.type === 'mcq');
  const Q = mcqItems.length > 0 ? mcqItems : FALLBACK;
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answered, setAnswered] = useState<Record<number, boolean>>({});

  const score = Object.entries(answers).reduce((s, [idx, ans]) => s + (ans === Q[Number(idx)].correct ? 1 : 0), 0);

  // Auto-advance after 2 seconds when answer is selected
  useEffect(() => {
    const lastAnswered = Object.keys(answered).length;
    if (lastAnswered > 0 && !answered[currentIndex] && currentIndex < Q.length - 1) {
      return; // Don't auto-advance yet
    }
    
    if (answered[currentIndex] && currentIndex < Q.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (answered[currentIndex] && currentIndex === Q.length - 1) {
      const timer = setTimeout(() => {
        setQuizComplete(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [answered, currentIndex, Q.length]);

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (answered[qIndex]) return; // Already answered
    setAnswers({ ...answers, [qIndex]: optionIndex });
    setAnswered({ ...answered, [qIndex]: true });
  };

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{Q.length} questions · instant scoring with explanations</p>
      {items.length === 0 && (
        <p className="mt-2 text-xs text-amber-600">Showing a sample question — this quiz hasn&rsquo;t had its questions populated yet.</p>
      )}

      {!quizComplete ? (
        <>
          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / Q.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">{currentIndex + 1}/{Q.length}</span>
          </div>

          {/* Current Question */}
          <div className="mt-8">
            {Q[currentIndex] && (
              <div className="card p-6">
                <p className="font-semibold whitespace-pre-line">
                  Q{currentIndex + 1}. {Q[currentIndex].q}
                </p>
                <div className="mt-4 grid gap-2">
                  {Q[currentIndex].options.map((opt, j) => {
                    const chosen = answers[currentIndex] === j;
                    const correct = j === Q[currentIndex].correct;
                    const wrong = chosen && j !== Q[currentIndex].correct;
                    const isAnsweredFlag = answered[currentIndex];

                    return (
                      <button
                        key={j}
                        disabled={isAnsweredFlag}
                        onClick={() => handleAnswer(currentIndex, j)}
                        className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition ${
                          isAnsweredFlag ? "cursor-default" : "cursor-pointer"
                        } ${
                          correct && isAnsweredFlag ? "border-green-500 bg-green-50" :
                          wrong && isAnsweredFlag ? "border-red-500 bg-red-50" :
                          chosen && !isAnsweredFlag ? "border-brand bg-brand-50 hover:border-brand" :
                          !isAnsweredFlag ? "border-gray-200 hover:border-brand hover:bg-gray-50" :
                          "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-current text-xs font-bold">
                          {String.fromCharCode(65 + j)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {correct && isAnsweredFlag && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                        {wrong && isAnsweredFlag && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {answered[currentIndex] && Q[currentIndex].explain && (
                  <div className={`mt-4 rounded-md p-3 text-sm transition-all ${
                    answers[currentIndex] === Q[currentIndex].correct
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}>
                    <strong className={answers[currentIndex] === Q[currentIndex].correct ? "text-green-900" : "text-red-900"}>
                      {answers[currentIndex] === Q[currentIndex].correct ? "✓ Correct! " : "✗ Incorrect. "}
                    </strong>
                    <span className={answers[currentIndex] === Q[currentIndex].correct ? "text-green-800" : "text-red-800"}>
                      {Q[currentIndex].explain}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Button - Show when answered */}
          {answered[currentIndex] && currentIndex < Q.length - 1 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="btn-primary flex items-center gap-2"
              >
                Next Question <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Finish Button - Show on last question when answered */}
          {answered[currentIndex] && currentIndex === Q.length - 1 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setQuizComplete(true)}
                className="btn-primary flex items-center gap-2"
              >
                View Results <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Results Screen */}
          <div className="mt-8 space-y-6">
            {/* Score Card */}
            <div className={`card p-8 text-center rounded-xl border-2 ${
              score >= Q.length * 0.8 
                ? "border-green-500 bg-green-50" 
                : score >= Q.length * 0.6 
                ? "border-blue-500 bg-blue-50"
                : "border-orange-500 bg-orange-50"
            }`}>
              <div className="text-5xl font-extrabold text-brand">{score}/{Q.length}</div>
              <div className="mt-2 text-lg font-semibold text-gray-800">
                {score >= Q.length * 0.8 
                  ? "Excellent! Keep it up! 🎉" 
                  : score >= Q.length * 0.6 
                  ? "Good attempt! Review weak areas 📚"
                  : "Keep practicing! 💪"}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {Math.round((score / Q.length) * 100)}% accuracy
              </div>
            </div>

            {/* Review Answers */}
            <div>
              <h2 className="text-lg font-bold mb-4">Review Your Answers</h2>
              <div className="space-y-4">
                {Q.map((q, i) => {
                  const userAnswer = answers[i];
                  const isCorrect = userAnswer === q.correct;
                  return (
                    <div key={i} className={`card p-4 border-l-4 ${isCorrect ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {isCorrect ? "✓" : "✗"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">Q{i + 1}. {q.q}</p>
                          <p className="mt-2 text-sm">
                            <span className={isCorrect ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                              Your answer: {q.options[userAnswer!]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="mt-1 text-sm text-green-700 font-semibold">
                              Correct answer: {q.options[q.correct]}
                            </p>
                          )}
                          {q.explain && (
                            <p className="mt-2 text-xs text-gray-700">
                              <strong>Explanation:</strong> {q.explain}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Retake Button */}
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setAnswers({});
                  setAnswered({});
                  setCurrentIndex(0);
                  setQuizComplete(false);
                }}
                className="btn-primary"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

