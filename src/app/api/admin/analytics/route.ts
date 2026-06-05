/**
 * Admin Analytics API — computed dashboard stats from live collections.
 * GET /api/admin/analytics
 * Protected by middleware (dt_admin cookie).
 */
import { NextResponse } from "next/server";
import { ArticleModel, CourseModel, QuizModel, PaymentModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [
      totalArticles,
      publishedArticles,
      totalCourses,
      publishedCourses,
      totalQuizzes,
      payments,
    ] = await Promise.all([
      ArticleModel.countDocuments({}),
      ArticleModel.countDocuments({ status: "published" }),
      CourseModel.countDocuments({}),
      CourseModel.countDocuments({ isPublished: true }),
      QuizModel.countDocuments({}),
      PaymentModel.find({}).sort({ createdAt: -1 }).limit(500).lean(),
    ]);

    const captured = payments.filter((p: any) => p.status === "captured");
    const totalRevenue = Math.round(captured.reduce((s: number, p: any) => s + (p.amount || 0), 0) / 100);

    // Revenue for the last 6 months (paise -> rupees)
    const byMonth: Record<string, number> = {};
    for (const p of captured) {
      const d = new Date(p.createdAt || p.completedAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] || 0) + (p.amount || 0);
    }
    const revenueByMonth = Object.entries(byMonth)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-6)
      .map(([month, paise]) => ({ month, revenue: Math.round(paise / 100) }));

    const recentPayments = payments.slice(0, 5).map((p: any) => ({
      id: String(p._id),
      customerName: p.customerName || p.customerEmail || "—",
      itemName: p.itemName || p.itemType || "—",
      amount: Math.round((p.amount || 0) / 100),
      status: p.status,
      date: p.createdAt,
    }));

    return NextResponse.json({
      cards: {
        totalArticles,
        publishedArticles,
        totalCourses,
        publishedCourses,
        totalQuizzes,
        totalPayments: payments.length,
        capturedPayments: captured.length,
        totalRevenue,
        successRate: payments.length ? Math.round((captured.length / payments.length) * 100) : 0,
      },
      revenueByMonth,
      recentPayments,
    });
  } catch (error: any) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load analytics" }, { status: 500 });
  }
}
