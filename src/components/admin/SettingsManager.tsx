"use client";
import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";

export default function SettingsManager() {
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load settings");
      setS(await res.json());
    } catch (e: any) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function set(path: string, value: any) {
    setS((prev: any) => {
      const next = { ...prev };
      if (path.startsWith("socialLinks.")) {
        const k = path.split(".")[1];
        next.socialLinks = { ...(next.socialLinks || {}), [k]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setS(await res.json());
      setMsg({ type: "ok", text: "Settings saved." });
    } catch (e: any) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !s) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200";
  const labelCls = "text-xs font-semibold uppercase tracking-wide text-gray-600";

  const Text = ({ k, label, placeholder }: { k: string; label: string; placeholder?: string }) => {
    const value = k.startsWith("socialLinks.") ? s.socialLinks?.[k.split(".")[1]] ?? "" : s[k] ?? "";
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input value={value} placeholder={placeholder} onChange={(e) => set(k, e.target.value)} className={input} />
      </div>
    );
  };

  const Num = ({ k, label }: { k: string; label: string }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="number" value={s[k] ?? 0} onChange={(e) => set(k, Number(e.target.value))} className={input} />
    </div>
  );

  const Toggle = ({ k, label }: { k: string; label: string }) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={!!s[k]} onChange={(e) => set(k, e.target.checked)} />
      {label}
    </label>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">Site-wide configuration stored in MongoDB.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={load} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="h-3.5 w-3.5" /> Reload
          </button>
          <button type="button" disabled={saving} onClick={save} className="btn-primary">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`mt-4 rounded-md px-4 py-3 text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <Section title="General">
          <Text k="siteName" label="Site name" />
          <Text k="siteUrl" label="Site URL" placeholder="https://…" />
          <div className="sm:col-span-2">
            <Text k="siteDescription" label="Site description" />
          </div>
          <Text k="logoUrl" label="Logo URL" />
          <Text k="faviconUrl" label="Favicon URL" />
        </Section>

        <Section title="Contact">
          <Text k="contactEmail" label="Contact email" />
          <Text k="supportEmail" label="Support email" />
          <Text k="phone" label="Phone" />
        </Section>

        <Section title="Social Links">
          <Text k="socialLinks.twitter" label="Twitter" />
          <Text k="socialLinks.facebook" label="Facebook" />
          <Text k="socialLinks.linkedin" label="LinkedIn" />
          <Text k="socialLinks.youtube" label="YouTube" />
          <Text k="socialLinks.instagram" label="Instagram" />
        </Section>

        <Section title="Features">
          <Toggle k="enableComments" label="Enable comments" />
          <Toggle k="enableSocialShare" label="Enable social share" />
          <Toggle k="enableNewsletter" label="Enable newsletter" />
        </Section>

        <Section title="Pagination & AI">
          <Num k="articlesPerPage" label="Articles per page" />
          <Num k="quizzesPerPage" label="Quizzes per page" />
          <Num k="coursesPerPage" label="Courses per page" />
          <div>
            <label className={labelCls}>Default AI model</label>
            <select value={s.defaultAIModel ?? "groq"} onChange={(e) => set("defaultAIModel", e.target.value)} className={input}>
              <option value="groq">groq</option>
              <option value="gemini">gemini</option>
              <option value="openai">openai</option>
            </select>
          </div>
          <Toggle k="automationEnabled" label="Automation enabled" />
          <Num k="automationInterval" label="Automation interval (min)" />
        </Section>
      </div>
    </div>
  );
}
