"use client";
import { useEffect, useState } from "react";
import { RefreshCw, FileText, GraduationCap, Brain, IndianRupee, CreditCard, TrendingUp } from "lucide-react";

export default function AnalyticsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load analytics");
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const c = data?.cards;
  const cards = [
    { label: "Total Revenue", value: c ? `₹${c.totalRevenue.toLocaleString("en-IN")}` : "—", icon: IndianRupee },
    { label: "Articles", value: c ? `${c.publishedArticles}/${c.totalArticles}` : "—", sub: "published / total", icon: FileText },
    { label: "Courses", value: c ? `${c.publishedCourses}/${c.totalCourses}` : "—", sub: "published / total", icon: GraduationCap },
    { label: "Quizzes", value: c?.totalQuizzes ?? "—", icon: Brain },
    { label: "Payments", value: c ? `${c.capturedPayments}/${c.totalPayments}` : "—", sub: "captured / total", icon: CreditCard },
    { label: "Success Rate", value: c ? `${c.successRate}%` : "—", icon: TrendingUp },
  ];

  const maxRev = Math.max(1, ...((data?.revenueByMonth || []).map((m: any) => m.revenue)));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">Live metrics computed from your MongoDB collections.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
                <div className="text-2xl font-extrabold">{value}</div>
                {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-bold">Revenue (last 6 months)</h2>
          <div className="mt-4 space-y-3">
            {(data?.revenueByMonth || []).length === 0 && (
              <p className="text-sm text-gray-500">No captured payments yet.</p>
            )}
            {(data?.revenueByMonth || []).map((m: any) => (
              <div key={m.month} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-gray-500">{m.month}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-brand" style={{ width: `${(m.revenue / maxRev) * 100}%` }} />
                </div>
                <span className="w-24 text-right font-semibold">₹{m.revenue.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-bold">Recent payments</h2>
          <div className="mt-4 divide-y divide-gray-100">
            {(data?.recentPayments || []).length === 0 && (
              <p className="text-sm text-gray-500">No payments yet.</p>
            )}
            {(data?.recentPayments || []).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-semibold">{p.customerName}</div>
                  <div className="text-xs text-gray-500">{p.itemName}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{Number(p.amount).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-gray-400">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
