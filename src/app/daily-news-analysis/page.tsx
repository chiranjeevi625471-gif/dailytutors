import AnalysisViewer from "@/components/AnalysisViewer";

export const metadata = { title: "Daily News Analysis · Daily Tutors" };
export const dynamic = "force-dynamic";

export default function DailyNewsPage() {
  return (
    <AnalysisViewer
      endpoint="daily-news"
      title="Daily News Analysis"
      description="Comprehensive analysis of today's top news stories with UPSC Civil Services perspective"
    />
  );
}
