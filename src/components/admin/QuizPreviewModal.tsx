"use client";
import { useState } from "react";
import { X, Save, Trash2, CheckCircle2 } from "lucide-react";
import type { QuestionItem, Quiz } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  initialItems: QuestionItem[];
  defaultTitle?: string;
  source?: Quiz["source"];
  onSaved?: () => void;
};

export default function QuizPreviewModal({ open, onClose, initialItems, defaultTitle, source, onSaved }: Props) {
  const [items, setItems] = useState<QuestionItem[]>(initialItems);
  const [title, setTitle] = useState(defaultTitle || "");
  const [type, setType] = useState<Quiz["type"]>("Prelims");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  function setItem(i: number, patch: Partial<QuestionItem>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  
  function setOption(i: number, j: number, value: string) {
    setItems((arr) =>
      arr.map((it, idx) => {
        if (idx !== i || it.type !== "mcq") return it;
        return { ...it, options: it.options.map((o, oj) => (oj === j ? value : o)) };
      })
    );
  }
  function remove(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  }

  async function save() {
    setErr(null);
    if (!title.trim()) { setErr("Add a title"); return; }
    if (items.length === 0) { setErr("Need at least one question"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/quizzes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, title, type, slug: slug || undefined, source })
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Save failed");
      return;
    }
    onSaved?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 z-10">
          <div>
            <h2 className="text-lg font-bold">Review & Save Quiz</h2>
            <p className="text-xs text-gray-500">{items.length} questions extracted{source ? ` · source: ${source}` : ""}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Daily Prelims Quiz — 8 May 2026"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-600">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Quiz["type"])}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="Prelims">Prelims</option>
              <option value="Static">Static</option>
              <option value="CSAT">CSAT</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-600">Slug (optional)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated if empty"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        <div className="px-6 pb-4 space-y-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-gray-500">
                  Q{i + 1} {it.type === "mains" ? <span className="ml-2 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Mains</span> : null}
                </span>
                <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
              
              {it.type === "mcq" ? (
                <>
                  <textarea
                    value={it.q}
                    onChange={(e) => setItem(i, { q: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-md border border-gray-200 p-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                  <div className="mt-3 grid gap-2">
                    {it.options.map((opt, j) => (
                      <label key={j} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={it.correct === j}
                          onChange={() => setItem(i, { correct: j })}
                          className="text-brand"
                        />
                        <span className="w-5 text-xs font-bold text-gray-500">{String.fromCharCode(65 + j)}</span>
                        <input
                          value={opt}
                          onChange={(e) => setOption(i, j, e.target.value)}
                          className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                        />
                        {it.correct === j && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={it.explain}
                    onChange={(e) => setItem(i, { explain: e.target.value })}
                    placeholder="Explanation"
                    rows={2}
                    className="mt-3 w-full rounded-md border border-gray-200 p-2 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </>
              ) : (
                <>
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-600">Question</label>
                    <textarea
                      value={it.q}
                      onChange={(e) => setItem(i, { q: e.target.value })}
                      rows={2}
                      className="mt-1 w-full rounded-md border border-gray-200 p-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-600">Model Answer (100-150 words)</label>
                    <textarea
                      value={it.answer}
                      onChange={(e) => setItem(i, { answer: e.target.value })}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-200 p-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-600">Key Points (one per line)</label>
                    <textarea
                      value={(it.keyPoints || []).join("\n")}
                      onChange={(e) => setItem(i, { keyPoints: e.target.value.split("\n").filter(p => p.trim()) })}
                      rows={3}
                      placeholder="Point 1&#10;Point 2&#10;Point 3"
                      className="mt-1 w-full rounded-md border border-gray-200 p-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3">
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="btn-outline">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : `Save Quiz (${items.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
