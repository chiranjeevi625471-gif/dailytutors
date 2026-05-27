export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "GS1" | "GS2" | "GS3" | "GS4" | "Editorial" | "PIB" | "Economy" | "Polity" | "Environment" | "Science";
  date: string;
  readTime: string;
  cover?: string;
};

export const posts: Post[] = [
  {
    slug: "supreme-court-on-electoral-bonds",
    title: "Supreme Court Verdict on Electoral Bonds — Constitutional Implications",
    excerpt:
      "The Court struck down the Electoral Bonds Scheme citing violation of Article 19(1)(a). Examine its impact on transparency in political funding.",
    category: "GS2",
    date: "2026-05-08",
    readTime: "8 min"
  },
  {
    slug: "india-semiconductor-mission",
    title: "India Semiconductor Mission: Progress, Challenges & The Road Ahead",
    excerpt:
      "Foundries, ATMP units and design-linked incentives — a status check on India's semiconductor ambitions and global supply-chain positioning.",
    category: "GS3",
    date: "2026-05-08",
    readTime: "10 min"
  },
  {
    slug: "monsoon-2026-imd-forecast",
    title: "IMD Monsoon Forecast 2026 — Implications for Agriculture & Inflation",
    excerpt:
      "An above-normal monsoon is forecast. We analyse the macroeconomic, food-security and rural demand outcomes likely to follow.",
    category: "Economy",
    date: "2026-05-07",
    readTime: "6 min"
  },
  {
    slug: "g20-rio-summit-outcomes",
    title: "G20 Rio Summit: Key Outcomes for India's Foreign Policy",
    excerpt:
      "From climate finance to digital public infrastructure — a structured breakdown of declarations relevant for GS Paper II.",
    category: "GS2",
    date: "2026-05-07",
    readTime: "7 min"
  },
  {
    slug: "editorial-analysis-the-hindu-may-7",
    title: "Editorial Analysis — The Hindu, 7 May 2026",
    excerpt:
      "Today's editorials dissected: 'Reforming the Election Commission', 'AI Regulation in India', and 'Reviving MSP Discussions'.",
    category: "Editorial",
    date: "2026-05-07",
    readTime: "12 min"
  },
  {
    slug: "western-ghats-eco-sensitive-zone",
    title: "Western Ghats Eco-Sensitive Zone Notification — A Closer Look",
    excerpt:
      "Kasturirangan vs Gadgil revisited as MoEFCC issues fresh draft notification covering 56,825 sq km across six states.",
    category: "Environment",
    date: "2026-05-06",
    readTime: "9 min"
  }
];

export type Quiz = {
  slug: string;
  title: string;
  questions: number;
  duration: string;
  type: "Prelims" | "Static" | "CSAT";
  date: string;
};

export const quizzes: Quiz[] = [
  { slug: "daily-prelims-quiz-may-8", title: "Daily Prelims Quiz — 8 May 2026", questions: 10, duration: "12 min", type: "Prelims", date: "2026-05-08" },
  { slug: "polity-static-fundamental-rights", title: "Static Quiz — Fundamental Rights", questions: 20, duration: "25 min", type: "Static", date: "2026-05-07" },
  { slug: "csat-reasoning-set-12", title: "CSAT Reasoning Practice — Set 12", questions: 15, duration: "20 min", type: "CSAT", date: "2026-05-07" },
  { slug: "geography-static-monsoon", title: "Static Quiz — Indian Monsoon System", questions: 15, duration: "18 min", type: "Static", date: "2026-05-06" }
];

export type Course = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "Foundation" | "Advanced" | "Test Series";
  price: number;
  originalPrice?: number;
  features: string[];
  badge?: string;
};

export const courses: Course[] = [
  {
    slug: "upsc-foundation-2027",
    title: "UPSC CSE Foundation 2027",
    description: "Two-year integrated programme covering Prelims + Mains + Optional with live classes, tests and mentorship.",
    duration: "24 months",
    level: "Foundation",
    price: 89999,
    originalPrice: 119999,
    features: ["1200+ live hours", "All NCERTs covered", "Mains answer evaluation", "Optional included", "Personal mentor"],
    badge: "Most Popular"
  },
  {
    slug: "prelims-test-series-2026",
    title: "Prelims Test Series 2026",
    description: "60 full-length tests with detailed video solutions and AI-generated weak-area reports.",
    duration: "8 months",
    level: "Test Series",
    price: 7999,
    originalPrice: 11999,
    features: ["60 mock tests", "30 sectional tests", "All-India ranking", "Video solutions"]
  },
  {
    slug: "mains-answer-writing-program",
    title: "Mains Answer Writing Programme",
    description: "Daily questions, structured frameworks, individual evaluation by toppers and former civil servants.",
    duration: "6 months",
    level: "Advanced",
    price: 14999,
    features: ["Daily 3 questions", "Topper-led evaluation", "Synopsis & model answers", "Doubt sessions"]
  }
];

export type Download = {
  title: string;
  type: "Magazine" | "Compilation" | "Notes" | "PYQ";
  size: string;
  pages: number;
  date: string;
};

export const downloads: Download[] = [
  { title: "Monthly Current Affairs Magazine — April 2026", type: "Magazine", size: "8.4 MB", pages: 124, date: "2026-05-01" },
  { title: "PIB Compilation — April 2026", type: "Compilation", size: "3.1 MB", pages: 56, date: "2026-04-30" },
  { title: "Polity Revision Notes — Constitutional Bodies", type: "Notes", size: "2.2 MB", pages: 34, date: "2026-04-28" },
  { title: "UPSC Prelims PYQ 2014–2025 (Topic-wise)", type: "PYQ", size: "12.8 MB", pages: 380, date: "2026-04-15" }
];

export type Optional = {
  slug: string;
  title: string;
  color: string;
  description: string;
  content: string;
  sources: { title: string; url: string }[];
};

export const optionals: Optional[] = [
  {
    slug: "sociology",
    title: "Sociology",
    color: "from-rose-50 to-rose-100",
    description: "Study of social structures, institutions, and human behaviour",
    content: "Sociology is the scientific study of society, social institutions, and social relationships. In the UPSC context, it covers Indian society, social movements, family structure, religion, education, and contemporary social issues. The optional emphasizes understanding Indian social dynamics, caste systems, gender studies, and sociological theories applicable to Indian context.",
    sources: [
      { title: "Introduction to Sociology - Britannica", url: "https://www.britannica.com/topic/sociology" },
      { title: "IGNOU Sociology Study Material", url: "https://www.ignou.ac.in/" },
      { title: "Indian Society - NCERT Class 12", url: "https://ncert.nic.in/" },
      { title: "Contemporary India & Social Change", url: "https://www.jstor.org/" }
    ]
  },
  {
    slug: "history",
    title: "History",
    color: "from-amber-50 to-amber-100",
    description: "Ancient, Medieval, and Modern history of India and the world",
    content: "History optional covers Indian history from ancient times through the modern period, including the freedom struggle and post-independence developments. It requires deep understanding of political, social, economic, and cultural aspects. The syllabus encompasses ancient Indian kingdoms, medieval periods, British rule, and the evolution of modern India.",
    sources: [
      { title: "Indian History - NCERT Books", url: "https://ncert.nic.in/" },
      { title: "History of India - Oxford University Press", url: "https://www.oup.com/" },
      { title: "Bipan Chandra's India Since Independence", url: "https://www.flipkart.com/" },
      { title: "Academic Journal of Historical Research", url: "https://www.jstor.org/" }
    ]
  },
  {
    slug: "geography",
    title: "Geography",
    color: "from-emerald-50 to-emerald-100",
    description: "Physical and human geography with focus on India",
    content: "Geography optional includes physical geography (landforms, climate, water bodies, soil) and human geography (population, culture, economy). Emphasis is on Indian geography covering physical features, natural resources, agriculture, industries, transportation, and population dynamics. Also includes geopolitical aspects relevant to India.",
    sources: [
      { title: "NCERT Geography Textbooks", url: "https://ncert.nic.in/" },
      { title: "Physical Geography - William M. Davis", url: "https://www.oup.com/" },
      { title: "Human Geography of India - Majid Husain", url: "https://www.flipkart.com/" },
      { title: "National Geographic Society", url: "https://www.nationalgeographic.org/" }
    ]
  },
  {
    slug: "pub-ad",
    title: "Public Administration",
    color: "from-blue-50 to-blue-100",
    description: "Governance, administration, and public policy in India",
    content: "Public Administration focuses on the structure and functioning of Indian government, administrative institutions, civil services, public policy formulation, and implementation. It covers Union and State administrations, local governance, administrative law, and contemporary administrative challenges in India.",
    sources: [
      { title: "Administrative Law in India - M.P. Jain", url: "https://www.flipkart.com/" },
      { title: "Indian Government & Politics - Laxmikanth", url: "https://www.flipkart.com/" },
      { title: "Civil Service Handbook", url: "https://www.dopt.gov.in/" },
      { title: "Public Administration Review Journal", url: "https://onlinelibrary.wiley.com/" }
    ]
  },
  {
    slug: "psir",
    title: "Political Science & IR",
    color: "from-violet-50 to-violet-100",
    description: "Indian polity and international relations",
    content: "Political Science & International Relations covers Indian Constitution, political institutions, constitutional values, and India's foreign policy. It includes analysis of Indian democracy, electoral systems, and India's role in international affairs, bilateral relations, and global institutions.",
    sources: [
      { title: "Indian Polity - Laxmikanth", url: "https://www.flipkart.com/" },
      { title: "The Constitution of India - Official Text", url: "https://www.constitutionindia.net/" },
      { title: "International Relations - Jackson & Sorensen", url: "https://www.oup.com/" },
      { title: "Ministry of External Affairs - India", url: "https://mea.gov.in/" }
    ]
  },
  {
    slug: "philosophy",
    title: "Philosophy",
    color: "from-orange-50 to-orange-100",
    description: "Western and Indian philosophical traditions",
    content: "Philosophy optional requires study of epistemology, metaphysics, logic, and ethics. It includes both Western philosophical traditions and Indian philosophical schools like Vedanta, Mimamsa, and Nyaya. The focus is on critical thinking, logical analysis, and understanding different philosophical perspectives on knowledge, reality, and values.",
    sources: [
      { title: "Introduction to Philosophy - Nigel Warburton", url: "https://www.oup.com/" },
      { title: "Indian Philosophy - S. Radhakrishnan", url: "https://www.flipkart.com/" },
      { title: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/" },
      { title: "History of Western Philosophy - Bertrand Russell", url: "https://www.oup.com/" }
    ]
  },
  {
    slug: "anthropology",
    title: "Anthropology",
    color: "from-teal-50 to-teal-100",
    description: "Study of human cultures, societies, and evolution",
    content: "Anthropology covers physical anthropology (human evolution, genetics) and cultural anthropology (ethnography, kinship, rituals). The Indian context includes tribal societies, caste system, ethnographic studies, and contemporary social practices. It also includes archaeology and forensic anthropology.",
    sources: [
      { title: "Introduction to Anthropology - William A. Haviland", url: "https://www.cengage.com/" },
      { title: "The Tribes and Castes of Bengal - H. Risley", url: "https://www.flipkart.com/" },
      { title: "Indian Anthropology - D.N. Majumdar", url: "https://www.flipkart.com/" },
      { title: "American Anthropological Association", url: "https://americananthro.org/" }
    ]
  },
  {
    slug: "economics",
    title: "Economics",
    color: "from-pink-50 to-pink-100",
    description: "Micro and macro economics with Indian economic focus",
    content: "Economics optional includes microeconomics, macroeconomics, and applied economics. Emphasis on Indian economic development, monetary policy, fiscal policy, agriculture, industry, trade, and contemporary economic challenges. It requires understanding of economic theories and their application to real-world scenarios.",
    sources: [
      { title: "Microeconomics - Paul Samuelson", url: "https://www.tmh.in/" },
      { title: "Indian Economy - Ramesh Singh", url: "https://www.flipkart.com/" },
      { title: "Ministry of Finance - India", url: "https://www.finmin.gov.in/" },
      { title: "Economic Survey of India", url: "https://www.indiabudget.gov.in/" }
    ]
  }
];
