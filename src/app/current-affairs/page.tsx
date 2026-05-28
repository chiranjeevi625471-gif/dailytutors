import { db } from "@/lib/db";
import CurrentAffairsViewer from "@/components/CurrentAffairsViewer";

export const metadata = { title: "Current Affairs · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const all = await db.posts.list();
  const posts = all.filter((p) => p.active).sort((a, b) => (a.date < b.date ? 1 : -1));
  const todayPost = posts[0]; // Most recent post should be today's
  const articles = todayPost?.articles || [];

  // Group articles by channel
  const articlesByChannel: Record<string, any[]> = {};
  for (const article of articles) {
    const channel = article.channel || "Other";
    if (!articlesByChannel[channel]) {
      articlesByChannel[channel] = [];
    }
    articlesByChannel[channel].push(article);
  }

  return (
    <div className="container-page py-12">
      <div>
        <h1 className="section-title">Current Affairs</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600">
          Daily news analysis from The Hindu — National, International & Cities sections, updated daily for UPSC and competitive exam preparation.
        </p>
      </div>

      {todayPost && articles.length > 0 ? (
        <CurrentAffairsViewer 
          todayPost={todayPost} 
          articles={articles}
          articlesByChannel={articlesByChannel}
        />
      ) : (
        <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800">📭 No current affairs articles available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
