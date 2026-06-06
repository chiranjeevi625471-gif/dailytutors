import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Ethics Case Studies" };

export default function EthicsPage() {
  return (
    <ComingSoon
      badge="GS Paper IV"
      title="Ethics Case Studies"
      description="Practice GS-IV case studies with keyword frameworks, model approaches and evaluation."
      backHref="/mains"
      backLabel="Back to Mains"
      ctaHref="/mains/answer-writing"
      ctaLabel="Try Answer Writing"
    />
  );
}
