import Link from "next/link";
import { Newspaper, PenLine, Brain, Download, GraduationCap, Map, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const FEATURES = [
  { icon: Newspaper, title: "Daily Current Affairs", desc: "✓ Curated from The Hindu, PIB, IE every morning at 8 AM IST\n✓ Topic-wise analysis with UPSC links\n✓ Archive of 100+ past articles\n✓ GS Paper I & II alignment", href: "/current-affairs" },
  { icon: PenLine, title: "Mains Answer Writing", desc: "✓ Daily GS questions (15-30 marks)\n✓ Expert evaluation with scores & feedback\n✓ Model answers with frameworks\n✓ 500+ past questions with solutions", href: "/mains/answer-writing" },
  { icon: Brain, title: "Prelims Quizzes", desc: "✓ Daily MCQs (120 questions/week)\n✓ Static, Current & CSAT coverage\n✓ Instant feedback with detailed explanations\n✓ Performance analytics & weak area tracking", href: "/prelims/daily-quiz" },
  { icon: Download, title: "Free PDF Downloads", desc: "✓ Monthly UPSC-focused magazines\n✓ Topic compilations & study notes\n✓ PYQ collections (2013-2024)\n✓ Quick revision guides", href: "/downloads" },
  { icon: GraduationCap, title: "Structured Courses", desc: "✓ Foundation course (0 to basics)\n✓ Test series with all-India ranking\n✓ Personal mentorship & doubt sessions\n✓ 500+ hours of structured content", href: "/courses" },
  { icon: Map, title: "Mind Maps & Notes", desc: "✓ Visual notes for Polity, History, Geography\n✓ Quick revision before exams\n✓ Inter-topic connections mapped\n✓ 1000+ concepts covered", href: "/mains/mind-maps" }
];

export default function FeatureGridSection() {
  return (
    <section className="container-page py-12 sm:py-16 md:py-20">
      <SectionHeader
        title="Everything you need, in one place"
        subtitle="Complete UPSC preparation ecosystem — daily current affairs, mains practice, prelims quizzes, study materials & expert mentorship."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc, href }) => (
          <Link key={title} href={href} className="card p-6 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line leading-relaxed">{desc}</p>
            <div className="mt-4 link-arrow">Explore <ArrowRight className="h-4 w-4" /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
