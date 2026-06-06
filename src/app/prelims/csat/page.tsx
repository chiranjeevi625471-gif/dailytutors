import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "CSAT Practice" };

export default function CsatPage() {
  return (
    <ComingSoon
      badge="Prelims · Paper II"
      title="CSAT Practice"
      description="Aptitude, logical reasoning and reading-comprehension sets for the CSAT qualifying paper."
      backHref="/prelims"
      backLabel="Back to Prelims"
      ctaHref="/prelims/daily-quiz"
      ctaLabel="Try Daily Quiz"
    />
  );
}
