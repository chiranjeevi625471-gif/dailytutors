// Exam categories shown under the "Exams" nav dropdown and on /exams pages.
// Stub content for now — fill in courses/details per exam later.

export type ExamCategory = {
  slug: string;
  /** Full label shown in the nav dropdown */
  label: string;
  /** Short title used on the exam landing page */
  title: string;
  /** One-line description for cards / hero */
  description: string;
  /** Optional custom link target. When set, links go here instead of /exams/[slug]. */
  href?: string;
};

/** Resolve the link for an exam category (custom href or the default /exams/[slug]). */
export function examHref(e: ExamCategory): string {
  return e.href ?? `/exams/${e.slug}`;
}

export const EXAM_CATEGORIES: ExamCategory[] = [
  {
    slug: "school-boards",
    label: "10th / CBSE / ICSE / State",
    title: "School Boards — 10th, CBSE, ICSE & State",
    description: "Concept-first coaching and revision for Class 10 board exams across CBSE, ICSE and State boards.",
  },
  {
    slug: "neet",
    label: "NEET",
    title: "NEET",
    description: "Medical entrance preparation — Physics, Chemistry and Biology with test series and doubt support.",
  },
  {
    slug: "cet",
    label: "CET",
    title: "CET",
    description: "Common Entrance Test preparation with focused practice, mock tests and previous-year analysis.",
  },
  {
    slug: "ca",
    label: "CA",
    title: "CA",
    description: "Chartered Accountancy coaching for Foundation, Intermediate and Final levels.",
  },
  {
    slug: "competitive",
    label: "Competitive Exams",
    title: "Competitive Exams",
    description: "Structured courses for UPSC CSE — foundation programmes, prelims test series and mains answer-writing.",
    href: "/courses",
  },
];

export function getExamCategory(slug: string): ExamCategory | undefined {
  return EXAM_CATEGORIES.find((e) => e.slug === slug);
}
