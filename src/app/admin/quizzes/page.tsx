"use client";
import { useRef, useState } from "react";
import EntityManager from "@/components/admin/EntityManager";
import QuizPreviewModal from "@/components/admin/QuizPreviewModal";
import { Sparkles, FileUp, Loader2 } from "lucide-react";
import type { QuestionItem, Quiz } from "@/lib/types";

export default function AdminQuizzes() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<QuestionItem[]>([]);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewSource, setPreviewSource] = useState<Quiz["source"]>("manual");
  const [busy, setBusy] = useState<null | "news" | "upload">(null);
  const [err, setErr] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [count, setCount] = useState<number>(10);
  const [topic, setTopic] = useState<string>("");
  const [questionType, setQuestionType] = useState<"mcq" | "mains" | "both">("mcq");
  const [progress, setProgress] = useState<{ current: number; target: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function generateFromNews() {
    setErr(null);
    setProgress(null);
    const desired = Math.max(1, Number.isFinite(count) ? count : 10);
    setBusy("news");
    
    try {
      const res = await fetch("/api/admin/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          count: desired, 
          query: topic.trim() || undefined, 
          type: questionType,
          stream: true  // Enable streaming
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      const collectedItems: QuestionItem[] = [];
      let finalData: any = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const msg = JSON.parse(line);
            
            if (msg.type === "progress") {
              // Items received, add them to our collection
              collectedItems.push(...msg.items);
              setProgress({ current: msg.count, target: msg.targetCount });
              setPreviewItems([...collectedItems]);
            } else if (msg.type === "complete") {
              finalData = msg;
              setProgress(null);
            } else if (msg.type === "error") {
              throw new Error(msg.error);
            }
          } catch (e) {
            console.error("Failed to parse message:", line, e);
          }
        }
      }

      if (collectedItems.length === 0) {
        throw new Error("No questions generated");
      }

      const typeLabel = questionType === "mcq" ? "MCQ" : questionType === "mains" ? "Mains" : "MCQ & Mains";
      const note = collectedItems.length < desired ? ` (got ${collectedItems.length} of ${desired})` : "";
      setPreviewTitle(`Daily Prelims Quiz (${typeLabel}) — ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}${note}`);
      setPreviewSource("news");
      setPreviewOpen(true);
    } catch (e: any) {
      setErr(e.message);
      setProgress(null);
    } finally {
      setBusy(null);
    }
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    setBusy("upload");
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("type", questionType);
      const res = await fetch("/api/admin/quizzes/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (!data.items || data.items.length === 0) throw new Error("No questions found in file.");
      setPreviewItems(data.items);
      setPreviewTitle(f.name.replace(/\.(pdf|docx?)$/i, ""));
      setPreviewSource(data.source);
      setPreviewOpen(true);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <>
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-sm font-bold">Bulk add</h2>
            <p className="text-xs text-gray-500">Generate unlimited AI questions from latest news, or upload a PDF/Word question bank with MCQ and Mains support.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Questions</label>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 0)}
              className="mt-1 w-24 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as "mcq" | "mains" | "both")}
              className="mt-1 w-32 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="mcq">MCQ Only</option>
              <option value="mains">Mains Only</option>
              <option value="both">MCQ & Mains</option>
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Topic (optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. supreme court, monsoon, RBI"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button onClick={generateFromNews} disabled={!!busy || count < 1} className="btn-primary">
            {busy === "news" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {progress ? `${progress.current}/${progress.target}…` : busy === "news" ? `Generating ${count}…` : `Generate ${count}`}
          </button>
          <button onClick={() => fileInput.current?.click()} disabled={!!busy} className="btn-outline">
            {busy === "upload" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            {busy === "upload" ? "Parsing…" : "Upload PDF / Word"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={onFileChosen}
            className="hidden"
          />
        </div>
        
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Generating questions...</span>
              <span className="font-semibold">{progress.current}/{progress.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.target) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          Quick:
          {[10, 25, 50, 100, 200, 300, 500].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={`rounded-full border px-2.5 py-0.5 ${count === n ? "border-brand text-brand bg-brand-50" : "border-gray-200 hover:border-brand hover:text-brand"}`}
            >
              {n}
            </button>
          ))}
        </div>
        
        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
          ✨ <strong>New:</strong> Live streaming! Large requests now show real-time progress. You can preview and save as soon as questions arrive.
        </p>
      </div>

      {err && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>
      )}

      <EntityManager
        key={reloadKey}
        title="Quizzes & Schedule"
        description="Daily, Static and CSAT quizzes. Set 'scheduledAt' to publish at a future date/time. Auto-generated daily quiz fires via /api/cron/daily-quiz at 8 AM IST."
        entity="quizzes"
        defaults={{ type: "Prelims", questions: 10, duration: "12 min", date: new Date().toISOString().slice(0, 10), source: "manual" }}
        columns={[
          { key: "title", label: "Title", render: (r) => <div className="font-semibold">{r.title}</div> },
          { key: "type", label: "Type", render: (r) => <span className="badge">{r.type}</span> },
          { key: "questions", label: "Qs" },
          { key: "source", label: "Source", render: (r) => r.source ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{r.source}</span> : <span className="text-gray-400">manual</span> },
          { key: "scheduledAt", label: "Scheduled", render: (r) => r.scheduledAt ? new Date(r.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">—</span> },
          { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
        ]}
        fields={[
          { name: "title", label: "Title", required: true, full: true },
          { name: "slug", label: "Slug", required: true, hint: "Used in /prelims/daily-quiz/<slug>" },
          { name: "type", label: "Type", type: "select", options: ["Prelims", "Static", "CSAT"], required: true },
          { name: "date", label: "Date", type: "date", required: true },
          { name: "questions", label: "Number of Questions", type: "number", required: true },
          { name: "duration", label: "Duration", placeholder: "12 min" },
          { name: "scheduledAt", label: "Schedule (publish at)", type: "datetime-local", full: true, hint: "Optional. Leave blank to publish immediately." },
          { name: "active", label: "Active", type: "checkbox", placeholder: "Publish" }
        ]}
      />

      <QuizPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        initialItems={previewItems}
        defaultTitle={previewTitle}
        source={previewSource}
        onSaved={() => setReloadKey((k) => k + 1)}
      />
    </>
  );
}
