import Link from "next/link";
import {
  Newspaper, PenLine, Brain, Download, GraduationCap, Map,
  ArrowRight, CheckCircle2, BookOpenCheck
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import HeroCarousel from "@/components/HeroCarousel";
import HeroBannerCards from "@/components/HeroBannerCards";
import PromoBannerSection from "@/components/PromoBannerSection";
import { db } from "@/lib/db";
import { optionals } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: Newspaper, title: "Daily Current Affairs", desc: "✓ Curated from The Hindu, PIB, IE every morning at 8 AM IST\n✓ Topic-wise analysis with UPSC links\n✓ Archive of 100+ past articles\n✓ GS Paper I & II alignment", href: "/current-affairs" },
  { icon: PenLine, title: "Mains Answer Writing", desc: "✓ Daily GS questions (15-30 marks)\n✓ Expert evaluation with scores & feedback\n✓ Model answers with frameworks\n✓ 500+ past questions with solutions", href: "/mains/answer-writing" },
  { icon: Brain, title: "Prelims Quizzes", desc: "✓ Daily MCQs (120 questions/week)\n✓ Static, Current & CSAT coverage\n✓ Instant feedback with detailed explanations\n✓ Performance analytics & weak area tracking", href: "/prelims/daily-quiz" },
  { icon: Download, title: "Free PDF Downloads", desc: "✓ Monthly UPSC-focused magazines\n✓ Topic compilations & study notes\n✓ PYQ collections (2013-2024)\n✓ Quick revision guides", href: "/downloads" },
  { icon: GraduationCap, title: "Structured Courses", desc: "✓ Foundation course (0 to basics)\n✓ Test series with all-India ranking\n✓ Personal mentorship & doubt sessions\n✓ 500+ hours of structured content", href: "/courses" },
  { icon: Map, title: "Mind Maps & Notes", desc: "✓ Visual notes for Polity, History, Geography\n✓ Quick revision before exams\n✓ Inter-topic connections mapped\n✓ 1000+ concepts covered", href: "/mains/mind-maps" }
];

function bySlug<T extends { active?: boolean; order?: number }>(rows: T[]) {
  return rows.filter((r) => r.active !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export default async function HomePage() {
  const [banners, quizzesAll, coursesAll, promobanners] = await Promise.all([
    db.banners.list(), db.quizzes.list(), db.courses.list(), db.promobanners.list()
  ]);

  const slides = bySlug(banners);
  const quizzes = quizzesAll.filter((q) => q.active);
  const courses = coursesAll.filter((c) => c.active);
  const promoBanners = bySlug(promobanners);

  return (
    <>
      <HeroCarousel slides={slides} />

      <HeroBannerCards />

      <PromoBannerSection banners={promoBanners} />

      {/* Feature grid */}
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

      {/* Quizzes + Answer Writing split */}
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

      {/* Optional subjects */}
      <section className="bg-gray-50 py-16">
        <div className="container-page">
          <SectionHeader
            title="Optional Subjects"
            subtitle="Deep-dive notes, PYQ solutions (2013-2024), answer-writing programs & mentorship for popular UPSC optional subjects."
            href="/optional"
          />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {optionals.map((o) => (
              <Link
                key={o.slug}
                href={`/optional/${o.slug}`}
                className={`group rounded-xl border border-white bg-gradient-to-br ${o.color} p-5 transition hover:shadow-card`}
              >
                <BookOpenCheck className="h-6 w-6 text-brand" />
                <div className="mt-3 font-bold text-gray-900">{o.title}</div>
                <div className="mt-1 text-xs text-gray-600 group-hover:text-brand">View resources →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="container-page py-16">
        <SectionHeader title="Featured Courses" href="/courses" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.map((c) => (
            <div key={c.slug} className="card p-6 flex flex-col">
              {c.badge && <span className="badge mb-3 self-start bg-brand text-white">{c.badge}</span>}
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{c.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {c.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-none text-brand mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-2xl font-extrabold">₹{c.price.toLocaleString("en-IN")}</span>
                {c.originalPrice && (
                  <span className="text-sm line-through text-gray-400">₹{c.originalPrice.toLocaleString("en-IN")}</span>
                )}
              </div>
              <Link href={`/courses/${c.slug}`} className="btn-primary mt-5 w-full">Enroll Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-brand">
        <div className="container-page py-14 text-white grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Don&rsquo;t miss the daily edge.</h3>
            <p className="mt-2 text-white/90">
              Join 1,20,000+ aspirants who get the daily current affairs brief in their inbox at 8 AM IST.
            </p>
          </div>
          <form className="flex gap-2 w-full max-w-md md:ml-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full rounded-md border-0 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="rounded-md bg-white px-5 py-3 text-sm font-bold text-brand hover:bg-brand-50">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
