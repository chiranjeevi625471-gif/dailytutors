import { db } from "@/lib/db";
import CurrentAffairsViewer from "@/components/CurrentAffairsViewer";

export const metadata = { title: "Current Affairs · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const all = await db.posts.list();
  const posts = all.filter((p) => p.active).sort((a, b) => (a.date < b.date ? 1 : -1));
  const todayPost = posts[0];
  const articles = todayPost?.articles || [];

  const articlesByChannel: Record<string, any[]> = {};
  for (const article of articles) {
    const channel = article.channel || article.source || "Other";
    if (!articlesByChannel[channel]) articlesByChannel[channel] = [];
    articlesByChannel[channel].push(article);
  }

  const sourceCount = Object.keys(articlesByChannel).length;

  return (
    <div className="container-page py-8 sm:py-12">
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-10 py-8 sm:py-12 text-white mb-8">
        {/* Dot-grid background */}
        <div className="dot-grid absolute inset-0 opacity-[0.06]" />
        <div className="relative">
          {/* Live badge */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
            <span className="text-slate-400 text-sm">Updated every morning at 8 AM IST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Current Affairs
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Daily news analysis from The Hindu, Indian Express &amp; PIB — National,
            International &amp; Economy sections curated for UPSC Civil Services preparation.
          </p>

          {/* Stats pills */}
          {articles.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-center">
                <div className="text-2xl font-bold">{articles.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Articles Today</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-center">
                <div className="text-2xl font-bold">{sourceCount}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">News Sources</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {todayPost && articles.length > 0 ? (
        <CurrentAffairsViewer
          todayPost={todayPost}
          articles={articles}
          articlesByChannel={articlesByChannel}
        />
      ) : (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-bold text-yellow-900 text-lg mb-1">No articles yet for today</h3>
          <p className="text-yellow-700 text-sm">Come back after 8 AM IST — we update daily.</p>
        </div>
      )}
    </div>
  );
}
