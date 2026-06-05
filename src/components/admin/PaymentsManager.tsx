"use client";
import { useEffect, useState } from "react";
import { RefreshCw, IndianRupee, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

type Payment = {
  id: string;
  orderId: string;
  paymentId?: string;
  customerName?: string;
  customerEmail?: string;
  itemName?: string;
  itemType?: string;
  amount: number;
  status: string;
  createdAt?: string;
};

type Summary = {
  total: number;
  captured: number;
  failed: number;
  refunded: number;
  totalRevenue: number;
  successRate: number;
};

const STATUS_STYLES: Record<string, string> = {
  captured: "bg-green-100 text-green-700",
  authorized: "bg-blue-100 text-blue-700",
  created: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-amber-100 text-amber-700",
};

export default function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load payments");
      const data = await res.json();
      setPayments(data.payments || []);
      setSummary(data.summary || null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { label: "Total Revenue", value: summary ? `₹${summary.totalRevenue.toLocaleString("en-IN")}` : "—", icon: IndianRupee },
    { label: "Captured", value: summary?.captured ?? "—", icon: CheckCircle2 },
    { label: "Failed", value: summary?.failed ?? "—", icon: XCircle },
    { label: "Success Rate", value: summary ? `${summary.successRate}%` : "—", icon: RotateCcw },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Payments</h1>
          <p className="mt-1 text-sm text-gray-600">Razorpay transactions recorded in MongoDB. Read-only.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
                <div className="text-2xl font-extrabold">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Order ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">Loading…</td></tr>
            )}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No payments yet.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{p.orderId}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.customerName || "—"}</div>
                  <div className="text-xs text-gray-500">{p.customerEmail}</div>
                </td>
                <td className="px-4 py-3">{p.itemName || p.itemType || "—"}</td>
                <td className="px-4 py-3 font-semibold">₹{Math.round((p.amount || 0) / 100).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status] || "bg-gray-100 text-gray-600"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
