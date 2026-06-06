import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <ComingSoon
      badge="Your account"
      title="Dashboard"
      description="Your personal learning dashboard — track quizzes, answer-writing submissions and course progress."
      backHref="/"
      backLabel="Back to home"
      ctaHref="/current-affairs"
      ctaLabel="Start with Current Affairs"
    />
  );
}
