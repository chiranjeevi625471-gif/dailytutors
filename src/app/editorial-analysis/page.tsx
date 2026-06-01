import AnalysisViewer from "@/components/AnalysisViewer";

export const metadata = { title: "Editorial Analysis · Daily Tutors" };
export const dynamic = "force-dynamic";

export default function EditorialAnalysisPage() {
  return (
    <AnalysisViewer
      endpoint="editorial"
      title="Editorial Analysis"
      description="In-depth analysis of editorial pieces and opinion articles from major Indian publications"
    />
  );
}
