/**
 * Admin Payments API — MongoDB backed (read + summary).
 * GET /api/admin/payments  -> { payments: [...], summary: {...} }
 * Protected by middleware (dt_admin cookie).
 */
import { NextResponse } from "next/server";
import { PaymentModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const payments = await PaymentModel.find({}).sort({ createdAt: -1 }).limit(200).lean();

    const captured = payments.filter((p: any) => p.status === "captured");
    const totalRevenue = captured.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const summary = {
      total: payments.length,
      captured: captured.length,
      failed: payments.filter((p: any) => p.status === "failed").length,
      refunded: payments.filter((p: any) => p.status === "refunded").length,
      // amounts are stored in paise — convert to rupees for display
      totalRevenue: Math.round(totalRevenue / 100),
      successRate: payments.length ? Math.round((captured.length / payments.length) * 100) : 0,
    };

    const shaped = payments.map((p: any) => ({ ...p, id: String(p._id) }));
    return NextResponse.json({ payments: shaped, summary });
  } catch (error: any) {
    console.error("Admin payments GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load payments" }, { status: 500 });
  }
}
