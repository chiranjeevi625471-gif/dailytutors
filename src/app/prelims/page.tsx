import Link from "next/link";
import { ArrowRight, Brain, BookOpen, Calculator, History } from "lucide-react";

export const metadata = { title: "Prelims" };

const ITEMS = [
  { href: "/prelims/daily-quiz", title: "Daily Quiz", desc: "Fresh MCQs every day with instant explanations and analytics.", icon: Brain },
  { href: "/prelims/static-quiz", title: "Static Quiz", desc: "Subject-wise static GS practice across Polity, History, Geography and more.", icon: BookOpen },
  { href: "/prelims/csat", title: "CSAT Practice", desc: "Aptitude, reasoning and comprehension sets for Paper II.", icon: Calculator },
  { href: "/prelims/pyq", title: "Previous Year Questions", desc: "Solved prelims PYQs (2013–2024) with detailed explanations.", icon: History },
];

export default function PrelimsPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl">
        <span className="badge">UPSC Prelims</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Prelims <span className="text-brand">Practice</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Daily quizzes, static practice, CSAT and previous-year questions to crack the UPSC Prelims.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {ITEMS.map(({ href, title, desc, icon: Icon }) => (
          <Link key={href} href={href} className="card p-6 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{desc}</p>
            <div className="mt-4 link-arrow">Explore <ArrowRight className="h-4 w-4" /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
