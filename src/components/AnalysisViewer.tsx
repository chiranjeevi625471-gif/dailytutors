"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Loader } from "lucide-react";

type AnalysisData = {
  title: string;
  date: string;
  analysis: string;
  sources: { title: string; url?: string }[];
};

interface AnalysisViewerProps {
  endpoint: string;
  title: string;
  description?: string;
}

export default function AnalysisViewer({ endpoint, title, description }: AnalysisViewerProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analysis/${endpoint}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch analysis");
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalysis();
  }, [endpoint]);

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-10 py-8 sm:py-12 text-white mb-8">
        <div className="dot-grid absolute inset-0 opacity-[0.06]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              GENERATED
            </span>
            {data && <span className="text-slate-400 text-sm">Updated {data.date}</span>}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm font-medium">{loading ? "Generating..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Generating analysis using AI...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 mb-8">
          <p className="text-red-700 font-semibold mb-2">⚠️ Setup Required</p>
          <p className="text-red-600 text-sm mb-3">{error}</p>
          {error.includes("NEWSAPI_KEY") && (
            <div className="mt-3 pt-3 border-t border-red-200 text-sm text-red-700">
              <p className="font-semibold mb-2">Fix this in 2 steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get free API key from <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">newsapi.org</a></li>
                <li>Add to Vercel: Settings → Environment Variables → Add <code className="bg-red-100 px-2 py-1 rounded">NEWSAPI_KEY</code></li>
              </ol>
            </div>
          )}
        </div>
      )}

      {data && (
        <div className="space-y-8">
          {/* Main Analysis */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <div className="prose prose-sm max-w-none">
              {data.analysis.split("\n\n").map((paragraph, i) => (
                <div key={i} className="mb-4">
                  {paragraph.startsWith("##") ? (
                    <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">
                      {paragraph.replace(/^##\s*/, "")}
                    </h2>
                  ) : paragraph.startsWith("#") ? (
                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                      {paragraph.replace(/^#\s*/, "")}
                    </h3>
                  ) : paragraph.startsWith("-") ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {paragraph.split("\n").map((item, j) => (
                        <li key={j} className="text-gray-700">
                          {item.replace(/^-\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          {data.sources.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Sources</h3>
              <div className="space-y-2">
                {data.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    <p className="text-sm text-blue-600 hover:underline font-medium">
                      {source.title}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
