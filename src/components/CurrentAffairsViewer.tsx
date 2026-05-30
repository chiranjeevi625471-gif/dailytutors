'use client';

import { useState } from 'react';

const DEFINED_TERMS: Record<string, string> = {
  "budget": "Annual financial plan detailing government revenue and expenditure for fiscal year.",
  "policy": "Official government decision or course of action for addressing specific issues.",
  "regulation": "Rules or directives that control how something operates or is managed.",
  "reform": "Changes made to improve or modernize systems, laws, or institutions.",
  "inflation": "Sustained increase in general price level of goods and services in economy.",
  "gdp": "Gross Domestic Product - total monetary value of goods and services produced.",
  "fiscal": "Related to government revenue, taxation, and public finances.",
  "amendment": "Formal change or addition to a constitution, law, or official document.",
  "infrastructure": "Basic facilities and systems needed for functioning - roads, bridges, utilities.",
  "welfare": "Government programs designed to ensure well-being and basic needs of citizens.",
  "development": "Process of improving quality of life, economic growth, and social progress.",
  "scheme": "Government program or initiative designed to achieve specific objectives.",
  "ministry": "Government department responsible for specific functions and services.",
  "parliament": "Legislative body responsible for making laws and government oversight.",
  "bill": "Proposed law presented for consideration and passage.",
  "implementation": "Actual process of executing or putting into action a plan or policy.",
  "initiative": "New program or process designed to achieve specific goals.",
  "sustainable": "Able to be maintained without depleting resources or harming environment.",
  "climate": "Long-term weather patterns and atmospheric conditions affecting regions.",
  "trade": "Exchange of goods and services between countries or regions.",
  "accord": "A formal agreement or treaty between countries or parties.",
  "bilateral": "Involving two countries, parties, or sides in agreement.",
  "agreement": "A mutual understanding or arrangement between parties.",
  "announcement": "Public statement or official declaration of information.",
  "committee": "Group of people appointed for specific tasks or responsibilities.",
  "conference": "A formal meeting of people with a shared interest.",
  "cooperation": "Joint effort and working together towards common goals.",
  "crisis": "A time of intense difficulty or danger requiring urgent action.",
  "declaration": "Formal announcement or statement of principles or actions.",
  "dispute": "A disagreement or argument between parties.",
  "economy": "The system of production, distribution, and consumption of goods.",
  "federation": "Union of states or regions under a central authority.",
  "government": "System of ruling authority and administration of a state.",
  "institution": "Established organization or system for specific purposes.",
  "investment": "Allocation of resources with expectation of future benefits.",
  "legislation": "Laws and regulations established by legislative authority.",
  "mechanism": "System or process through which something operates.",
  "negotiation": "Discussion aimed at reaching agreement between parties.",
  "protocol": "Official procedure or system of rules and courtesies.",
  "provision": "Clause or condition in an agreement or law.",
  "resolution": "Formal decision or determination of a course of action.",
  "sector": "Distinct part of economy or society.",
  "summit": "High-level meeting between leaders or officials.",
  "treaty": "Formal agreement between countries or international parties.",
  "union": "Joining together of groups, states, or organizations.",
};

// Strip common RSS/WordPress metadata patterns that add no value
function cleanContent(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/\(PRELIMS\s+Focus\)/gi, '')
    .replace(/\(MAINS\s+Focus\)/gi, '')
    .replace(/The post .{0,200} appeared first on [\w\s]+\./gi, '')
    .replace(/Archives?\s*\([^)]*\)/gi, '')
    .replace(/\[[…\.]{1,3}\]/g, '')
    .replace(/Click here to read more\.?/gi, '')
    .replace(/Read more at .+/gi, '')
    .replace(/Source:\s*\n/gi, '')
    .trim();
}

function isUseful(text?: string | null): boolean {
  const c = cleanContent(text);
  return c.length > 60;
}

function formatAsBulletPoints(text?: string | null): string[] {
  const cleaned = cleanContent(text);
  if (!cleaned) return [];
  const lines = cleaned.split('\n').filter(l => l.trim().length > 0);
  const bullets: string[] = [];
  for (const line of lines) {
    const c = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
    if (c.length > 15 && c.length < 400) bullets.push(c);
  }
  if (bullets.length === 0) {
    return (cleaned.match(/[^.!?]+[.!?]+/g) || []).map(s => s.trim()).filter(s => s.length > 25).slice(0, 15);
  }
  return bullets.slice(0, 15);
}

function extractKeyPoints(text?: string | null): string[] {
  if (!text) return [];
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const points: string[] = [];
  for (const line of lines) {
    if (/^[-•*]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())) {
      const p = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
      if (p.length > 20 && p.length < 200) points.push(p);
    } else if (points.length < 5 && line.length > 30 && line.length < 150) {
      if (/\b(major|key|important|significant|crucial|notably|first|introduce|launch|approve|announce|passed|accord|agreement)\b/i.test(line)) {
        points.push(line.trim());
      }
    }
  }
  return points.slice(0, 8);
}

function extractImportantTopics(text?: string | null): string[] {
  if (!text) return [];
  const topics: string[] = [];
  const sorted = Object.keys(DEFINED_TERMS).sort((a, b) => b.length - a.length);
  for (const term of sorted) {
    if (new RegExp(`\\b${term}s?\\b`, 'gi').test(text)) {
      topics.push(term.charAt(0).toUpperCase() + term.slice(1));
      if (topics.length >= 8) break;
    }
  }
  return topics;
}

function HighlightedContent({ text }: { text: string }) {
  const sorted = Object.keys(DEFINED_TERMS).sort((a, b) => b.length - a.length);
  const pattern = sorted.map(t => `\\b${t}s?\\b`).join('|');
  const parts = text.split(new RegExp(`(${pattern})`, 'gi'));
  return (
    <span>
      {parts.map((part, idx) => {
        if (!part) return null;
        const lower = part.toLowerCase();
        const matched = sorted.find(t => lower === t || lower === t + 's');
        if (matched && DEFINED_TERMS[matched]) {
          return (
            <span key={idx} className="group relative inline-block">
              <span className="bg-amber-100 text-amber-900 font-semibold px-1 py-0.5 rounded border-b-2 border-amber-400 cursor-help hover:bg-amber-200 transition-colors">
                {part}
              </span>
              <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl z-[60] leading-relaxed">
                <span className="mb-1 block font-bold text-amber-300">{part}</span>
                {DEFINED_TERMS[matched]}
                <span className="absolute top-full left-3 border-4 border-transparent border-t-gray-900" />
              </span>
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}

interface Article {
  id?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  source?: string;
  channel?: string;
  author?: string | null;
  image?: string | null;
}

interface Props {
  todayPost: any;
  articles: Article[];
  articlesByChannel: Record<string, Article[]>;
}

const CHANNEL_CONFIG: Record<string, { icon: string; displayName: string; accent: string; badge: string }> = {
  "The Hindu":        { icon: "📰", displayName: "The Hindu",        accent: "border-blue-500",   badge: "bg-blue-50 text-blue-700 border-blue-200"   },
  "Indian Express":   { icon: "📰", displayName: "Indian Express",   accent: "border-indigo-500", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "Times of India":   { icon: "📰", displayName: "Times of India",   accent: "border-sky-500",    badge: "bg-sky-50 text-sky-700 border-sky-200"       },
  "PIB":              { icon: "🏛️", displayName: "PIB",              accent: "border-purple-500", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  "Economy Times":    { icon: "📊", displayName: "Economy Times",    accent: "border-green-500",  badge: "bg-green-50 text-green-700 border-green-200"  },
  "UPSC/Admin":       { icon: "🎓", displayName: "UPSC/Admin",       accent: "border-rose-500",   badge: "bg-rose-50 text-rose-700 border-rose-200"    },
  "Current Affairs":  { icon: "📋", displayName: "Current Affairs",  accent: "border-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  "The Guardian":     { icon: "🌍", displayName: "The Guardian",     accent: "border-amber-500",  badge: "bg-amber-50 text-amber-700 border-amber-200"  },
  "Inshorts":         { icon: "⚡", displayName: "Inshorts",         accent: "border-yellow-500", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  "NewsData":         { icon: "📡", displayName: "NewsData",         accent: "border-teal-500",   badge: "bg-teal-50 text-teal-700 border-teal-200"    },
};
const DEFAULT_CFG = (name: string) => ({ icon: "📄", displayName: name, accent: "border-gray-400", badge: "bg-gray-100 text-gray-600 border-gray-200" });

const CHANNEL_ORDER = ["The Hindu","Indian Express","Times of India","PIB","Economy Times","UPSC/Admin","Current Affairs","The Guardian","Inshorts","NewsData"];

export default function CurrentAffairsViewer({ todayPost, articles, articlesByChannel }: Props) {
  const sortedChannels = Object.keys(articlesByChannel).sort((a, b) => {
    const ia = CHANNEL_ORDER.indexOf(a), ib = CHANNEL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1; if (ib === -1) return -1;
    return ia - ib;
  });

  const [activeChannel, setActiveChannel] = useState<string>(sortedChannels[0] || "");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const cfg = CHANNEL_CONFIG[activeChannel] ?? DEFAULT_CFG(activeChannel);
  const channelArticles = articlesByChannel[activeChannel] || [];

  return (
    <>
      {/* ── Source tabs ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {sortedChannels.map(ch => {
          const c = CHANNEL_CONFIG[ch] ?? DEFAULT_CFG(ch);
          const isActive = activeChannel === ch;
          const count = articlesByChannel[ch].length;
          return (
            <button
              key={ch}
              type="button"
              onClick={() => { setActiveChannel(ch); setSelectedArticle(null); }}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{c.icon}</span>
              <span className="whitespace-nowrap">{c.displayName}</span>
              <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Channel meta bar ── */}
      {activeChannel && (
        <div className={`mt-5 flex items-center gap-3 border-l-4 pl-4 py-1 ${cfg.accent}`}>
          <span className="text-2xl leading-none">{cfg.icon}</span>
          <div>
            <h2 className="font-bold text-gray-900 text-base leading-tight">{cfg.displayName}</h2>
            <p className="text-xs text-gray-500">{channelArticles.length} headlines available</p>
          </div>
        </div>
      )}

      {/* ── Article cards ── */}
      <div className="mt-4 space-y-2">
        {channelArticles.map((article, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedArticle(article)}
            className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          >
            <div className={`flex items-start gap-0 rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-150 hover:border-blue-300 hover:shadow-md group-focus-visible:border-blue-400`}>
              {/* Left accent stripe */}
              <div className={`w-1 self-stretch flex-shrink-0 bg-gray-200 group-hover:bg-blue-500 transition-colors duration-150 ${cfg.accent.replace('border-', 'group-hover:bg-')}`} />

              <div className="flex flex-1 items-start gap-3 px-4 py-4 min-w-0">
                {/* Index */}
                <span className="flex-shrink-0 mt-0.5 w-5 text-right text-xs font-bold text-gray-300 select-none">
                  {idx + 1}
                </span>

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold border ${cfg.badge}`}>
                      {cfg.displayName}
                    </span>
                    {article.publishedAt && (
                      <span className="text-[11px] text-gray-400">
                        {new Date(article.publishedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center pr-4 self-center">
                <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-150 text-sm font-bold">
                  ›
                </span>
              </div>
            </div>
          </button>
        ))}

        {channelArticles.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No articles for this source yet</p>
          </div>
        )}
      </div>

      {/* ── Article detail drawer ── */}
      {selectedArticle && (() => {
        const artCfg = CHANNEL_CONFIG[selectedArticle.channel || activeChannel] ?? DEFAULT_CFG(selectedArticle.channel || activeChannel);
        const rawText = selectedArticle.content || selectedArticle.description;
        const cleanDesc = cleanContent(selectedArticle.description);
        const cleanBody = cleanContent(selectedArticle.content);
        const bullets   = formatAsBulletPoints(selectedArticle.content);
        const keyPts    = extractKeyPoints(rawText);
        const topics    = extractImportantTopics(rawText);
        const hasContent = isUseful(selectedArticle.content) || isUseful(selectedArticle.description);

        return (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />

            {/* Drawer */}
            <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

              {/* ── Header ── */}
              <div className="flex-shrink-0 bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-5">
                {/* Top row: source + date + close */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg leading-none">{artCfg.icon}</span>
                    <span className="rounded-full bg-white/15 border border-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-200">
                      {selectedArticle.channel || selectedArticle.source || activeChannel}
                    </span>
                    {selectedArticle.publishedAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(selectedArticle.publishedAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        })}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 text-base font-bold"
                    aria-label="Close"
                  >✕</button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-extrabold leading-snug text-white tracking-tight">
                  {selectedArticle.title}
                </h2>
                {selectedArticle.author && (
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <span>✍️</span> {selectedArticle.author}
                  </p>
                )}
              </div>

              {/* ── Scrollable body ── */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">
                <div className="space-y-4 p-5">

                  {/* UPSC Key Topics */}
                  {topics.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
                        🎯 UPSC Key Topics
                        <span className="font-normal text-amber-400 normal-case tracking-normal">— hover any tag</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic, i) => (
                          <span
                            key={i}
                            className="group relative inline-flex cursor-help items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 hover:border-amber-400"
                          >
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                            {topic}
                            <span className="pointer-events-none absolute bottom-full left-0 z-[60] mb-2 hidden w-64 rounded-xl bg-gray-900 p-3 text-xs leading-relaxed text-white shadow-2xl group-hover:block">
                              <span className="mb-1 block font-bold text-amber-300">{topic}</span>
                              {DEFINED_TERMS[topic.toLowerCase()] || 'Important UPSC concept'}
                              <span className="absolute top-full left-3 border-4 border-transparent border-t-gray-900" />
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What Happened — cleaned summary */}
                  {isUseful(selectedArticle.description) && (
                    <div className="rounded-2xl border border-blue-200 bg-white p-5">
                      <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                        📌 What Happened
                      </p>
                      <p className="text-sm leading-7 text-gray-800">{cleanDesc}</p>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {keyPts.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-white p-5">
                      <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        ✅ Key Takeaways
                      </p>
                      <ul className="space-y-2.5">
                        {keyPts.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                              {i + 1}
                            </span>
                            <span className="text-sm leading-relaxed text-gray-700">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Coverage */}
                  {bullets.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        📰 Full Coverage
                        <span className="font-normal normal-case tracking-normal text-slate-400">
                          — <span className="bg-amber-100 text-amber-800 px-1 rounded font-semibold text-[10px]">highlighted</span> = UPSC term
                        </span>
                      </p>
                      <div className="space-y-0 divide-y divide-gray-100">
                        {bullets.map((pt, i) => (
                          <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition">
                            <span className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span className="text-sm leading-7 text-gray-700">
                              <HighlightedContent text={pt} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No preview available — prompt to read full article */}
                  {!hasContent && (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                      <p className="text-3xl mb-3">📰</p>
                      <h4 className="font-bold text-gray-900 mb-1">Full Article on Source</h4>
                      <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                        This article's content is available on the original source. Click below to read the complete coverage.
                      </p>
                      {selectedArticle.url && (
                        <a
                          href={selectedArticle.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Open Full Article →
                        </a>
                      )}
                    </div>
                  )}

                  {/* Source attribution */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-xl bg-white border border-gray-100 px-4 py-3 text-xs text-gray-400">
                    <span>📰 {selectedArticle.source || selectedArticle.channel || 'Unknown Source'}</span>
                    {selectedArticle.author && <span>✍️ {selectedArticle.author}</span>}
                    {selectedArticle.publishedAt && (
                      <span>🕐 {new Date(selectedArticle.publishedAt).toLocaleString('en-IN')}</span>
                    )}
                  </div>

                </div>
              </div>

              {/* ── Footer ── */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white px-5 py-4 flex gap-3">
                {selectedArticle.url ? (
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-md hover:shadow-lg"
                  >
                    Read Full Article on Source →
                  </a>
                ) : <div className="flex-1" />}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  ✕ Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </>
  );
}
