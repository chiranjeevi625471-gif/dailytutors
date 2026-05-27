import Link from "next/link";
import { CheckCircle2, Calendar, PenLine, Award } from "lucide-react";

export const metadata = { title: "Mains Answer Writing · Daily Tutors" };

const PAST = [
  { date: "2026-05-07", paper: "GS-III", q: "Examine the role of public sector enterprises in achieving Atmanirbhar Bharat goals." },
  { date: "2026-05-06", paper: "GS-I", q: "Discuss the contribution of moderates to the Indian National Movement." },
  { date: "2026-05-05", paper: "GS-IV", q: "Distinguish between morality and ethics with suitable examples from public administration." },
  { date: "2026-05-04", paper: "GS-II", q: "Critically analyse cooperative federalism in the post-GST era." }
];

export default function AnswerWritingPage() {
  return (
    <div className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="section-title">Mains Answer Writing — Secure</h1>
          <p className="mt-3 text-sm text-gray-600">
            Practice daily with structured questions. Submit answers and get evaluated by mentors.
          </p>

          <div className="mt-8 card p-6">
            <span className="badge"><Calendar className="h-3 w-3 mr-1" /> Today · GS Paper II</span>
            <h2 className="mt-3 text-2xl font-bold leading-snug">
              &ldquo;The doctrine of basic structure has both protected and constrained Indian democracy.&rdquo; Critically examine.
            </h2>
            <p className="mt-2 text-sm text-gray-600">15 marks · 250 words · Submit by 11:59 PM IST</p>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-gray-500">Synopsis</h3>
            <ul className="mt-3 grid gap-2 text-sm text-gray-700">
              {[
                "Define the doctrine and trace evolution from Kesavananda Bharati to I.R. Coelho.",
                "Argue protection: rights guaranteed against majoritarian assault.",
                "Counter-argue: judicial overreach, undemocratic restraints on Parliament.",
                "Conclude with reform debates — Ninth Schedule, judicial appointments."
              ].map((p) => (
                <li key={p} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-none text-brand mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <form className="mt-8">
              <label className="text-sm font-semibold">Your answer</label>
              <textarea
                rows={10}
                placeholder="Begin with definition · build with arguments · close with way forward"
                className="mt-2 w-full rounded-md border border-gray-200 p-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button className="btn-primary"><PenLine className="h-4 w-4" /> Submit for Evaluation</button>
                <button type="button" className="btn-outline">Save as draft</button>
                <span className="text-xs text-gray-500 ml-auto">Mentor evaluation within 48 hours</span>
              </div>
            </form>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card p-5 bg-brand text-white">
            <div className="flex items-center gap-3">
              <Award className="h-7 w-7" />
              <div>
                <div className="text-sm opacity-90">Answers Submitted</div>
                <div className="text-2xl font-extrabold">42</div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-90">Average score: 9.4 / 15</p>
          </div>

          <div className="card p-5">
            <h4 className="font-bold">Past Questions</h4>
            <ul className="mt-3 space-y-3">
              {PAST.map((p) => (
                <li key={p.q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span className="badge">{p.paper}</span>
                  </div>
                  <Link href="#" className="mt-1 block text-sm text-gray-800 hover:text-brand">{p.q}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
