import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Static Quiz" };

export default function StaticQuizPage() {
  return (
    <ComingSoon
      badge="Prelims · Static GS"
      title="Static Quiz"
      description="Subject-wise static GS practice across Polity, History, Geography, Economy and Environment."
      backHref="/prelims"
      backLabel="Back to Prelims"
      ctaHref="/prelims/daily-quiz"
      ctaLabel="Try Daily Quiz"
    />
  );
}
