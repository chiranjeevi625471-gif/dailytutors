// Central site configuration — single source of truth for SEO metadata,
// structured data, sitemap and manifest.

export const siteConfig = {
  name: "Daily Tutors",
  legalName: "Daily Tutors",
  // Canonical production URL (no trailing slash). Override with NEXT_PUBLIC_SITE_URL.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dailytutors.in").replace(/\/$/, ""),
  shortDescription: "UPSC, NEET, CET, CA & school-board coaching — daily current affairs, answer writing, quizzes and structured courses.",
  description:
    "Daily Tutors is India's trusted learning destination for UPSC Civil Services, NEET, CET, CA and school-board (CBSE/ICSE/State) preparation — with daily current affairs, editorial analysis, mains answer writing, prelims quizzes, free PDFs, mind maps and structured courses.",
  tagline: "Decode the exams, Daily.",
  locale: "en_IN",
  twitterHandle: "@dailytutors",
  // Social / sameAs profiles for Organization structured data.
  socials: {
    instagram: "https://www.instagram.com/dailytutors_official",
  },
  contactEmail: "support@dailytutors.in",
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Profiles to expose as schema.org `sameAs`. */
export const sameAs = Object.values(siteConfig.socials);
