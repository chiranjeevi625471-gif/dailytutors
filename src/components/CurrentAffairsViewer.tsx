'use client';

import { useMemo, useState } from 'react';

export interface MCQ {
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  difficulty: string;
}

export interface PublicArticle {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  category: string; // subject
  gsPapers: string[];
  summary: string;
  content?: string;
  whyInNews?: string;
  featuredImage?: string;
  keywords: string[];
  prelimsPointers: string[];
  mainsAnalysis?: string;
  constitutionalLinks: string[];
  wayForward?: string;
  mcqs: MCQ[];
  publishedAt?: string | null;
}

// Subject taxonomy → display label + colour.
const SUBJECTS: Record<string, { label: string; badge: string }> = {
  Polity: { label: 'Polity', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  Economy: { label: 'Economy', badge: 'bg-green-50 text-green-700 border-green-200' },
  Environment: { label: 'Environment', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Science_Technology: { label: 'Science & Tech', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  Geography: { label: 'Geography', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  Ethics: { label: 'Ethics', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  International_Relations: { label: 'International Relations', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};
const subjectCfg = (s: string) => SUBJECTS[s] || { label: s, badge: 'bg-gray-100 text-gray-600 border-gray-200' };

const GS_ORDER = ['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'Prelims'];

type View = 'all' | 'prelims' | 'mains';

export default function CurrentAffairsViewer({ articles }: { articles: PublicArticle[] }) {
  const [view, setView] = useState<View>('all');
  const [subject, setSubject] = useState<string>('All');
  const [gs, setGs] = useState<string>('All');
  const [selected, setSelected] = useState<PublicArticle | null>(null);

  const subjectsPresent = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))),
    [articles]
  );
  const gsPresent = useMemo(
    () => GS_ORDER.filter((g) => articles.some((a) => a.gsPapers.includes(g))),
    [articles]
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (subject !== 'All' && a.category !== subject) return false;
      if (gs !== 'All' && !a.gsPapers.includes(gs)) return false;
      if (view === 'prelims' && a.prelimsPointers.length === 0 && a.mcqs.length === 0) return false;
      if (view === 'mains' && !a.mainsAnalysis) return false;
      return true;
    });
  }, [articles, subject, gs, view]);

  return (
    <>
      {/* ── View toggle: Prelims / Mains ── */}
      <div className="mb-5 inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        {([
          ['all', 'All'],
          ['prelims', '📝 Prelims Pointers'],
          ['mains', '🧠 Mains Editorials'],
        ] as [View, string][]).map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === v ? 'bg-slate-900 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Subject taxonomy filter ── */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterChip active={subject === 'All'} onClick={() => setSubject('All')}>
          All Subjects
        </FilterChip>
        {subjectsPresent.map((s) => (
          <FilterChip key={s} active={subject === s} onClick={() => setSubject(s)}>
            {subjectCfg(s).label}
          </FilterChip>
        ))}
      </div>

      {/* ── GS paper filter ── */}
      {gsPresent.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterChip small active={gs === 'All'} onClick={() => setGs('All')}>
            All GS Papers
          </FilterChip>
          {gsPresent.map((g) => (
            <FilterChip key={g} small active={gs === g} onClick={() => setGs(g)}>
              {g}
            </FilterChip>
          ))}
        </div>
      )}

      {/* ── Article cards ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((a) => {
          const cfg = subjectCfg(a.category);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className="group text-left rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}>
                  {cfg.label}
                </span>
                {a.gsPapers.map((g) => (
                  <span key={g} className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                    {g}
                  </span>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                {a.title}
              </h3>
              {a.summary && (
                <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">{a.summary}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
                <span>📰 {a.source}</span>
                {a.prelimsPointers.length > 0 && <span>📝 {a.prelimsPointers.length} facts</span>}
                {a.mcqs.length > 0 && <span>❓ {a.mcqs.length} MCQs</span>}
                {a.mainsAnalysis && <span>🧠 Mains</span>}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">No articles match these filters.</p>
        </div>
      )}

      {/* ── Detail drawer ── */}
      {selected && (
        <ArticleDrawer article={selected} view={view} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  small,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-medium transition ${small ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'} ${
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

function ArticleDrawer({
  article,
  view,
  onClose,
}: {
  article: PublicArticle;
  view: View;
  onClose: () => void;
}) {
  const cfg = subjectCfg(article.category);
  const showPrelims = view !== 'mains';
  const showMains = view !== 'prelims';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}>
                {cfg.label}
              </span>
              {article.gsPapers.map((g) => (
                <span key={g} className="rounded-full bg-white/15 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                  {g}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 text-base font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <h2 className="text-xl font-extrabold leading-snug text-white tracking-tight">{article.title}</h2>
          <p className="mt-2 text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>📰 {article.source}</span>
            {article.publishedAt && (
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </p>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">
          <div className="space-y-4 p-5">
            {/* Why in news / summary */}
            {(article.whyInNews || article.summary) && (
              <Section title="📌 Why in News" tone="blue">
                <p className="text-sm leading-7 text-gray-800">{article.whyInNews || article.summary}</p>
              </Section>
            )}

            {/* ── PRELIMS ── */}
            {showPrelims && article.prelimsPointers.length > 0 && (
              <Section title="📝 Prelims Pointers" tone="emerald">
                <ul className="space-y-2.5">
                  {article.prelimsPointers.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-gray-700">{pt}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {showPrelims && article.mcqs.length > 0 && (
              <Section title="❓ Practice MCQs" tone="amber">
                <div className="space-y-4">
                  {article.mcqs.map((mcq, i) => (
                    <MCQItem key={i} mcq={mcq} index={i} />
                  ))}
                </div>
              </Section>
            )}

            {/* ── MAINS ── */}
            {showMains && article.mainsAnalysis && (
              <Section title="🧠 Mains Analysis" tone="slate">
                <p className="whitespace-pre-line text-sm leading-7 text-gray-700">{article.mainsAnalysis}</p>
              </Section>
            )}

            {showMains && article.constitutionalLinks.length > 0 && (
              <Section title="⚖️ Constitutional / Static Links" tone="indigo">
                <ul className="space-y-2">
                  {article.constitutionalLinks.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {showMains && article.wayForward && (
              <Section title="➡️ Way Forward" tone="blue">
                <p className="text-sm leading-7 text-gray-700">{article.wayForward}</p>
              </Section>
            )}

            {/* Keywords */}
            {article.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((k, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    #{k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-5 py-4 flex gap-3">
          {article.sourceUrl ? (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-md hover:shadow-lg"
            >
              Read Original Source →
            </a>
          ) : (
            <div className="flex-1" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}

const TONES: Record<string, string> = {
  blue: 'border-blue-200',
  emerald: 'border-emerald-200',
  amber: 'border-amber-200',
  slate: 'border-slate-200',
  indigo: 'border-indigo-200',
};

function Section({ title, tone, children }: { title: string; tone: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 ${TONES[tone] || 'border-gray-200'}`}>
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">{title}</p>
      {children}
    </div>
  );
}

function MCQItem({ mcq, index }: { mcq: MCQ; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        <span className="text-amber-600">Q{index + 1}.</span> {mcq.question}
      </p>
      <div className="space-y-2">
        {mcq.options.map((opt, i) => {
          const isCorrect = i === mcq.correctOption;
          const isPicked = i === picked;
          let cls = 'border-gray-200 bg-white hover:border-gray-300';
          if (answered && isCorrect) cls = 'border-emerald-400 bg-emerald-50';
          else if (answered && isPicked && !isCorrect) cls = 'border-red-400 bg-red-50';
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${cls} disabled:cursor-default`}
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-gray-700">{opt}</span>
              {answered && isCorrect && <span className="ml-auto text-emerald-600">✓</span>}
              {answered && isPicked && !isCorrect && <span className="ml-auto text-red-500">✕</span>}
            </button>
          );
        })}
      </div>
      {answered && mcq.explanation && (
        <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs leading-relaxed text-amber-900">
          <span className="font-bold">Explanation: </span>
          {mcq.explanation}
        </p>
      )}
    </div>
  );
}
