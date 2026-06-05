import { connectDB } from "@/lib/mongodb";
import { ArticleModel } from "@/lib/models";
import CurrentAffairsViewer, { type PublicArticle } from "@/components/CurrentAffairsViewer";

export const metadata = { title: "Current Affairs · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  let articles: PublicArticle[] = [];

  try {
    await connectDB();
    // Only PUBLISHED articles are shown publicly (admin/SME approval gate).
    const docs = await ArticleModel.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(60)
      .lean();

    articles = docs.map((d: any) => ({
      id: String(d._id),
      title: d.title || "",
      source: d.source || "Other",
      sourceUrl: d.sourceUrl || "",
      category: d.category || "Polity",
      gsPapers: d.gsPapers || [],
      summary: d.summary || "",
      content: d.content || "",
      whyInNews: d.whyInNews || "",
      featuredImage: d.featuredImage || "",
      keywords: d.keywords || [],
      prelimsPointers: d.prelimsPointers || [],
      mainsAnalysis: d.mainsAnalysis || "",
      constitutionalLinks: d.constitutionalLinks || [],
      wayForward: d.wayForward || "",
      mcqs: (d.mcqs || []).map((m: any) => ({
        question: m.question || "",
        options: m.options || [],
        correctOption: typeof m.correctOption === "number" ? m.correctOption : 0,
        explanation: m.explanation || "",
        difficulty: m.difficulty || "Medium",
      })),
      publishedAt: d.publishedAt ? new Date(d.publishedAt).toISOString() : null,
    }));
  } catch (err) {
    console.error("Current affairs load error:", err);
  }

  return (
    <div className="container-page py-8 sm:py-12">
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-10 py-8 sm:py-12 text-white mb-8">
        <div className="dot-grid absolute inset-0 opacity-[0.06]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
            <span className="text-slate-400 text-sm">Updated every morning · curated for UPSC</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Current Affairs
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            AI-analysed daily news from The Hindu, Indian Express, PIB &amp; more — mapped to the
            GS syllabus and split into Prelims pointers and Mains analysis, updated automatically every morning.
          </p>

          {articles.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-center">
                <div className="text-2xl font-bold">{articles.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Published Articles</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-center">
                <div className="text-2xl font-bold">
                  {new Set(articles.flatMap((a) => a.gsPapers)).size}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">GS Papers Covered</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {articles.length > 0 ? (
        <CurrentAffairsViewer articles={articles} />
      ) : (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-bold text-yellow-900 text-lg mb-1">No articles yet for today</h3>
          <p className="text-yellow-700 text-sm">
            Fresh AI-analysed news is fetched and published automatically every morning.
          </p>
        </div>
      )}
    </div>
  );
}
