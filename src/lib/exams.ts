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
  /** Short sub-tags (e.g. Class 11, CBSE) shown as pills on category cards. */
  tags?: string[];
  /** Emoji/illustration shown on the category card. */
  emoji?: string;
  /** Tailwind background class for the card's decorative arc (literal so JIT keeps it). */
  accent?: string;
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
    tags: ["CBSE", "ICSE", "State Board", "8th–12th"],
    emoji: "🎒",
    accent: "bg-indigo-50",
  },
  {
    slug: "neet",
    label: "NEET",
    title: "NEET",
    description: "Medical entrance preparation — Physics, Chemistry and Biology with test series and doubt support.",
    tags: ["Class 11", "Class 12", "Dropper"],
    emoji: "🧬",
    accent: "bg-rose-50",
  },
  {
    slug: "cet",
    label: "CET",
    title: "CET",
    description: "Common Entrance Test preparation with focused practice, mock tests and previous-year analysis.",
    tags: ["Class 11", "Class 12", "Dropper"],
    emoji: "⚛️",
    accent: "bg-amber-50",
  },
  {
    slug: "ca",
    label: "CA",
    title: "CA",
    description: "Chartered Accountancy coaching for Foundation, Intermediate and Final levels.",
    tags: ["Foundation", "Intermediate", "Final"],
    emoji: "📊",
    accent: "bg-emerald-50",
  },
  {
    slug: "competitive",
    label: "Competitive Exams",
    title: "Competitive Exams",
    description: "Structured courses for UPSC CSE — foundation programmes, prelims test series and mains answer-writing.",
    href: "/courses",
    tags: ["UPSC", "Prelims", "Mains"],
    emoji: "🏛️",
    accent: "bg-sky-50",
  },
];

export function getExamCategory(slug: string): ExamCategory | undefined {
  return EXAM_CATEGORIES.find((e) => e.slug === slug);
}
