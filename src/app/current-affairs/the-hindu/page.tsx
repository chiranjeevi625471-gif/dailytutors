"use client";

import { useEffect, useState } from "react";
import { Article } from "@/lib/news";
import Link from "next/link";

export default function TheHinduCurrentAffairsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/current-affairs/the-hindu?limit=50");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📰</span>
            <h1 className="text-4xl font-bold text-slate-900">Daily Current Affairs</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Latest news and current affairs from <span className="font-semibold text-blue-600">The Hindu</span> - 
            Curated for UPSC preparation and staying informed on national and international developments
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-8">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh Articles"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Fetching latest articles from The Hindu...</p>
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
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Articles</p>
                  <p className="text-3xl font-bold text-slate-900">{articles.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-600 text-sm">Source</p>
                  <p className="text-lg font-semibold text-blue-600">The Hindu</p>
                </div>
              </div>
            </div>

            {/* Articles */}
            {articles.map((article, index) => (
              <article
                key={`${article.title}-${index}`}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-6"
              >
                <div className="flex gap-6">
                  {article.image && (
                    <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-lg">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 line-clamp-2">
                        {article.title}
                      </h2>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                        The Hindu
                      </span>
                    </div>

                    {article.description && (
                      <p className="text-slate-700 mb-4 line-clamp-2">
                        {article.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex gap-4">
                        {article.author && (
                          <span>By {article.author}</span>
                        )}
                        {article.publishedAt && (
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                      
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Read Full Article →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600 text-lg">No articles found. Try refreshing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
