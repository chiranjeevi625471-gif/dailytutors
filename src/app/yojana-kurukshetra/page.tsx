import AnalysisViewer from "@/components/AnalysisViewer";

export const metadata = { title: "Yojana / Kurukshetra · Daily Tutors" };
export const dynamic = "force-dynamic";

export default function YojanaPage() {
  return (
    <AnalysisViewer
      endpoint="yojana"
      title="Yojana / Kurukshetra"
      description="Government schemes, development initiatives, and policy analysis covering all major Yojana and social programs"
    />
  );
}
