"use client";

import { useEffect, useState } from "react";
import { Article } from "@/lib/news";
import Link from "next/link";

export default function NewsDataCurrentAffairsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/current-affairs/newsdata?limit=50");
      const data = await res.json();

      if (data.ok) {
        setArticles(data.articles);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch articles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📰</span>
            <h1 className="text-4xl font-bold text-indigo-900">Daily Current Affairs</h1>
          </div>
          <p className="text-lg text-indigo-700 max-w-2xl">
            Latest news and current affairs from <span className="font-semibold text-indigo-600">NewsData.io</span> - 
            Global coverage with India focus, covering politics, business, and current events
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-8">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh Articles"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-indigo-700">Fetching latest articles from NewsData.io...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-700 font-semibold">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid gap-6">
            {/* Stats */}
            <div className="bg-white rounded-lg border border-indigo-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 text-sm">Total Articles</p>
                  <p className="text-3xl font-bold text-slate-900">{articles.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-600 text-sm">Source</p>
                  <p className="text-lg font-semibold text-indigo-600">NewsData.io</p>
                </div>
              </div>
            </div>

            {/* Articles */}
            {articles.map((article, index) => (
              <article
                key={`${article.title}-${index}`}
                className="bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all p-6"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  {article.image && (
                    <div className="flex-shrink-0 w-40 h-32">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    {article.description && (
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {article.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>
                        {article.author && `By ${article.author}`}
                      </span>
                      {article.publishedAt && (
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Badge & Link */}
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                        {article.source || "NewsData.io"}
                      </span>
                      {article.url && (
                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                        >
                          Read Full Article →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800">📭 No articles available at the moment. Try refreshing later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
