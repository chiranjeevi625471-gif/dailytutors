import AnalysisViewer from "@/components/AnalysisViewer";

export const metadata = { title: "PIB Summary · Daily Tutors" };
export const dynamic = "force-dynamic";

export default function PIBSummaryPage() {
  return (
    <AnalysisViewer
      endpoint="pib-summary"
      title="PIB Summary"
      description="Daily Press Information Bureau summaries covering government announcements, schemes, and policy updates"
    />
  );
}
