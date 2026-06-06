import Link from "next/link";
import { ArrowRight, PenLine, FileText, Scale, Map } from "lucide-react";

export const metadata = { title: "Mains" };

const ITEMS = [
  { href: "/mains/answer-writing", title: "Answer Writing (Secure)", desc: "Daily GS questions with expert evaluation, model answers and frameworks.", icon: PenLine },
  { href: "/mains/essay", title: "Essay Challenge", desc: "Structured essay practice with topper guidance and feedback.", icon: FileText },
  { href: "/mains/ethics", title: "Ethics Case Studies", desc: "GS-IV case studies, keywords and answer structures.", icon: Scale },
  { href: "/mains/mind-maps", title: "Mind Maps", desc: "Visual notes and inter-topic connections for fast revision.", icon: Map },
];

export default function MainsPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl">
        <span className="badge">UPSC Mains</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Mains <span className="text-brand">Preparation</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Everything you need for the UPSC Mains stage — daily answer writing, essays, ethics and revision tools.
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
