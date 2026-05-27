export type HeroBanner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  image?: string;
  order: number;
  active: boolean;
};

export type BannerCard = {
  id: string;
  title: string;
  tag: string;
  href: string;
  icon: string;
  bg: string;
  order: number;
  active: boolean;
};

export type PromoBanner = {
  id: string;
  title: string;
  image?: string;
  link: string;
  order: number;
  active: boolean;
};

export type Article = {
  id?: string;
  title: string;
  description?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  source?: string;
  explanation?: string;
  gsCategory?: string;
  channel?: string;
  content?: string | null;
  author?: string | null;
  image?: string | null;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  active: boolean;
  articles?: Article[];
  lastFetched?: string;
};

export type MCQQuestion = {
  type: "mcq";
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

export type MainsQuestion = {
  type: "mains";
  q: string;
  answer: string;
  keyPoints?: string[];
  explain?: string;
};

export type QuestionItem = MCQQuestion | MainsQuestion;

export type Quiz = {
  id: string;
  slug: string;
  title: string;
  questions: number;
  duration: string;
  type: "Prelims" | "Static" | "CSAT";
  date: string;
  scheduledAt?: string | null;
  active: boolean;
  source?: "manual" | "news" | "pdf" | "docx";
  items?: QuestionItem[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "Foundation" | "Advanced" | "Test Series";
  price: number;
  originalPrice?: number;
  features: string[];
  highlightFeatures?: string[];
  whyChoose?: string;
  badge?: string;
  active: boolean;
};

export type Download = {
  id: string;
  title: string;
  description?: string;
  type: "Magazine" | "Compilation" | "Notes" | "PYQ";
  size: string;
  pages: number;
  date: string;
  url?: string;
  active: boolean;
};

export type EntityName = "banners" | "cards" | "posts" | "quizzes" | "courses" | "downloads" | "promobanners";
