import type { HeroBanner, BannerCard, Post, Quiz, Course, Download, PromoBanner, ExamCourse } from "./types";

export const seedBanners: HeroBanner[] = [
  { id: "b1", order: 1, active: true, eyebrow: "Ace Your UPSC Prep!", title: "FOUNDATION 2027 BATCH", subtitle: "FOR PRELIMS, MAINS & OPTIONAL — LIVE + RECORDED", cta: "TAP TO EXPLORE!", href: "/courses/upsc-foundation-2027", bg: "from-red-700 via-red-600 to-rose-500" },
  { id: "b2", order: 2, active: true, eyebrow: "Daily Current Affairs", title: "8 AM IST · EVERY MORNING", subtitle: "THE HINDU · PIB · INDIAN EXPRESS — CURATED", cta: "READ TODAY'S BRIEF", href: "/current-affairs", bg: "from-rose-900 via-red-700 to-red-500" },
  { id: "b3", order: 3, active: true, eyebrow: "Mains Answer Writing", title: "SECURE 2026 — DAILY QUESTIONS", subtitle: "EVALUATED BY TOPPERS & MENTORS", cta: "JOIN PROGRAMME", href: "/mains/answer-writing", bg: "from-red-800 via-rose-600 to-pink-500" },
  { id: "b4", order: 4, active: true, eyebrow: "Prelims Test Series", title: "60 FULL-LENGTH MOCK TESTS", subtitle: "ALL-INDIA RANKING · VIDEO SOLUTIONS", cta: "ENROLL NOW", href: "/courses/prelims-test-series-2026", bg: "from-red-600 via-orange-500 to-amber-500" },
  { id: "b5", order: 5, active: true, eyebrow: "Free Resources", title: "MONTHLY CA MAGAZINE — APRIL 2026", subtitle: "124 PAGES · FREE PDF DOWNLOAD", cta: "DOWNLOAD NOW", href: "/downloads", bg: "from-rose-700 via-red-600 to-red-400" }
];

export const seedCards: BannerCard[] = [
  { id: "c1", order: 1, active: true, title: "Daily Current Affairs", tag: "FREE · 8 AM IST", href: "/current-affairs", icon: "Newspaper", bg: "from-red-600 to-rose-500" },
  { id: "c2", order: 2, active: true, title: "Mains Answer Writing", tag: "EVALUATED · DAILY", href: "/mains/answer-writing", icon: "PenLine", bg: "from-rose-700 to-pink-500" },
  { id: "c3", order: 3, active: true, title: "Daily Prelims Quiz", tag: "10 Qs · 12 MIN", href: "/prelims/daily-quiz", icon: "Brain", bg: "from-red-700 to-orange-500" },
  { id: "c4", order: 4, active: true, title: "Free PDF Library", tag: "MAGAZINES · NOTES", href: "/downloads", icon: "Download", bg: "from-orange-600 to-red-500" },
  { id: "c5", order: 5, active: true, title: "UPSC Foundation 2027", tag: "LIVE BATCH · ENROLL", href: "/courses/upsc-foundation-2027", icon: "GraduationCap", bg: "from-rose-600 to-red-700" },
  { id: "c6", order: 6, active: true, title: "Mind Maps & Notes", tag: "VISUAL REVISION", href: "/mains/mind-maps", icon: "Map", bg: "from-pink-600 to-rose-700" },
  { id: "c7", order: 7, active: true, title: "Prelims Test Series", tag: "60 MOCKS · AIR RANK", href: "/courses/prelims-test-series-2026", icon: "Trophy", bg: "from-red-500 to-rose-600" },
  { id: "c8", order: 8, active: true, title: "Optional Subjects", tag: "8 SUBJECTS · NOTES", href: "/optional", icon: "BookOpenCheck", bg: "from-red-800 to-rose-500" }
];

export const seedPosts: Post[] = [
  { id: "p1", active: true, slug: "supreme-court-on-electoral-bonds", title: "Supreme Court Verdict on Electoral Bonds — Constitutional Implications", excerpt: "The Court struck down the Electoral Bonds Scheme citing violation of Article 19(1)(a). Examine its impact on transparency in political funding.", category: "GS2", date: "2026-05-08", readTime: "8 min" },
  { id: "p2", active: true, slug: "india-semiconductor-mission", title: "India Semiconductor Mission: Progress, Challenges & The Road Ahead", excerpt: "Foundries, ATMP units and design-linked incentives — a status check on India's semiconductor ambitions and global supply-chain positioning.", category: "GS3", date: "2026-05-08", readTime: "10 min" },
  { id: "p3", active: true, slug: "monsoon-2026-imd-forecast", title: "IMD Monsoon Forecast 2026 — Implications for Agriculture & Inflation", excerpt: "An above-normal monsoon is forecast. We analyse the macroeconomic, food-security and rural demand outcomes likely to follow.", category: "Economy", date: "2026-05-07", readTime: "6 min" },
  { id: "p4", active: true, slug: "g20-rio-summit-outcomes", title: "G20 Rio Summit: Key Outcomes for India's Foreign Policy", excerpt: "From climate finance to digital public infrastructure — a structured breakdown of declarations relevant for GS Paper II.", category: "GS2", date: "2026-05-07", readTime: "7 min" },
  { id: "p5", active: true, slug: "editorial-analysis-the-hindu-may-7", title: "Editorial Analysis — The Hindu, 7 May 2026", excerpt: "Today's editorials dissected: 'Reforming the Election Commission', 'AI Regulation in India', and 'Reviving MSP Discussions'.", category: "Editorial", date: "2026-05-07", readTime: "12 min" },
  { id: "p6", active: true, slug: "western-ghats-eco-sensitive-zone", title: "Western Ghats Eco-Sensitive Zone Notification — A Closer Look", excerpt: "Kasturirangan vs Gadgil revisited as MoEFCC issues fresh draft notification covering 56,825 sq km across six states.", category: "Environment", date: "2026-05-06", readTime: "9 min" }
];

export const seedQuizzes: Quiz[] = [
  { id: "q1", active: true, slug: "daily-prelims-quiz-may-8", title: "Daily Prelims Quiz — 8 May 2026", questions: 10, duration: "12 min", type: "Prelims", date: "2026-05-08", scheduledAt: "2026-05-08T08:00:00+05:30" },
  { id: "q2", active: true, slug: "polity-static-fundamental-rights", title: "Static Quiz — Fundamental Rights", questions: 20, duration: "25 min", type: "Static", date: "2026-05-07", scheduledAt: null },
  { id: "q3", active: true, slug: "csat-reasoning-set-12", title: "CSAT Reasoning Practice — Set 12", questions: 15, duration: "20 min", type: "CSAT", date: "2026-05-07", scheduledAt: null },
  { id: "q4", active: true, slug: "geography-static-monsoon", title: "Static Quiz — Indian Monsoon System", questions: 15, duration: "18 min", type: "Static", date: "2026-05-06", scheduledAt: null }
];

export const seedCourses: Course[] = [
  { id: "co1", active: true, slug: "upsc-foundation-2027", title: "UPSC CSE Foundation 2027", description: "Two-year integrated programme covering Prelims + Mains + Optional with live classes, tests and mentorship.", duration: "24 months", level: "Foundation", price: 89999, originalPrice: 119999, features: ["1200+ live hours", "All NCERTs covered", "Mains answer evaluation", "Optional included", "Personal mentor"], badge: "Most Popular" },
  { id: "co2", active: true, slug: "prelims-test-series-2026", title: "Prelims Test Series 2026", description: "60 full-length tests with detailed video solutions and AI-generated weak-area reports.", duration: "8 months", level: "Test Series", price: 7999, originalPrice: 11999, features: ["60 mock tests", "30 sectional tests", "All-India ranking", "Video solutions"] },
  { id: "co3", active: true, slug: "mains-answer-writing-program", title: "Mains Answer Writing Programme", description: "Daily questions, structured frameworks, individual evaluation by toppers and former civil servants.", duration: "6 months", level: "Advanced", price: 14999, features: ["Daily 3 questions", "Topper-led evaluation", "Synopsis & model answers", "Doubt sessions"] }
];

export const seedDownloads: Download[] = [
  { id: "d1", active: true, title: "Monthly Current Affairs Magazine — April 2026", description: "Comprehensive coverage of all major news stories relevant to UPSC prelims and mains exams. Includes topic-wise analysis, linkages to GS papers, and editorial insights.", type: "Magazine", size: "8.4 MB", pages: 124, date: "2026-05-01" },
  { id: "d2", active: true, title: "PIB Compilation — April 2026", description: "All major PIB press releases from April 2026, organized by ministry and topic for easy revision.", type: "Compilation", size: "3.1 MB", pages: 56, date: "2026-04-30" },
  { id: "d3", active: true, title: "Polity Revision Notes — Constitutional Bodies", description: "Detailed revision notes on constitutional bodies, their composition, powers, and functions with important case laws.", type: "Notes", size: "2.2 MB", pages: 34, date: "2026-04-28" },
  { id: "d4", active: true, title: "UPSC Prelims PYQ 2014–2025 (Topic-wise)", description: "Previous year questions from 2014 to 2025, organized topic-wise for targeted practice and pattern analysis.", type: "PYQ", size: "12.8 MB", pages: 380, date: "2026-04-15" }
];

export const seedExamCourses: ExamCourse[] = [
  { 
    id: "neet-arjuna-2.0-2027", 
    examSlug: "neet", 
    active: true, 
    order: 1, 
    title: "Arjuna NEET 2.0 2027", 
    image: "https://via.placeholder.com/400x300?text=Arjuna+NEET+2.0", 
    badge: "ONLINE", 
    badgeColor: "bg-purple-600", 
    instructor: "Arjun Singh", 
    instructorImage: "", 
    price: 4999, 
    originalPrice: 5500, 
    startDate: "01 Jan 2026", 
    endDate: "30 Jun 2028", 
    duration: "30 months", 
    features: ["Complete Physics, Chemistry & Biology coverage", "500+ hours of video lectures", "Weekly tests and assignments", "Doubt support 24/7", "Personal mentor guidance"], 
    description: "Comprehensive NEET preparation course from basics to advanced level with live interactive sessions.", 
    cta: "ENROLL NOW", 
    link: "/courses/neet-arjuna-2.0-2027",
    totalHours: 500,
    chapters: [
      { id: "ch1-phy", title: "Physics Fundamentals", hours: 120, topics: ["Mechanics", "Thermodynamics", "Oscillations", "Waves"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch1-chem", title: "Chemistry Essentials", hours: 140, topics: ["Atomic Structure", "Bonding", "Organic Chemistry", "Stoichiometry"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch1-bio", title: "Biology Complete", hours: 150, topics: ["Cell Structure", "Genetics", "Evolution", "Human Anatomy"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch1-practice", title: "Mock Tests & Practice", hours: 90, topics: ["Full-length tests", "Topic tests", "Chapter quizzes", "Time management"], previewVideoUrl: "https://youtu.be/sample" }
    ]
  },
  { 
    id: "neet-lakshya-2028", 
    examSlug: "neet", 
    active: true, 
    order: 2, 
    title: "Arjuna NEET 2027 + Lakshya NEET 2028", 
    image: "https://via.placeholder.com/400x300?text=Arjuna+Lakshya", 
    badge: "ONLINE", 
    badgeColor: "bg-green-600", 
    instructor: "Lakshya Academy", 
    instructorImage: "", 
    price: 48000, 
    originalPrice: 62000, 
    startDate: "15 Jan 2026", 
    endDate: "31 Dec 2028", 
    duration: "36 months", 
    features: ["Two-year integrated program", "1000+ hours of live classes", "Monthly full-length mock tests", "Personalized performance tracking", "Expert doubt clearing sessions", "NEET special: Chemistry focus modules"], 
    description: "Two-year program covering complete NEET syllabus with advanced problem-solving techniques.", 
    cta: "ENROLL NOW", 
    link: "/courses/neet-lakshya-2028",
    totalHours: 1000,
    chapters: [
      { id: "ch2-phy1", title: "Physics - Year 1", hours: 200, topics: ["Classical Mechanics", "Thermodynamics", "Waves & Sound", "Electrostatics"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch2-chem1", title: "Chemistry - Year 1", hours: 250, topics: ["Atomic Theory", "Bonding & Structure", "Kinetics", "Equilibrium"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch2-bio1", title: "Biology - Year 1", hours: 250, topics: ["Cell Biology", "Genetics", "Ecology", "Physiology"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch2-advanced", title: "Advanced Problem Solving", hours: 300, topics: ["Numerical problems", "Conceptual MCQs", "Competitive questions", "Speed building"], previewVideoUrl: "https://youtu.be/sample" }
    ]
  },
  { 
    id: "neet-vidyapeeth-11", 
    examSlug: "neet", 
    active: true, 
    order: 3, 
    title: "Vidyapeeth 11 NEET (Target 2028)", 
    image: "https://via.placeholder.com/400x300?text=Vidyapeeth+NEET", 
    badge: "OFFLINE", 
    badgeColor: "bg-red-600", 
    instructor: "Dr. Vikram Sharma", 
    instructorImage: "", 
    price: 5000, 
    originalPrice: 6000, 
    startDate: "01 Apr 2026", 
    endDate: "30 Mar 2028", 
    duration: "24 months", 
    features: ["Class 11 focus for 2-year preparation", "Concept building from scratch", "Daily practice problems", "Bi-weekly assessments", "Group study sessions", "Career counseling included"], 
    description: "Ideal for Class 11 students targeting NEET 2028 with comprehensive foundation building.", 
    cta: "EXPLORE NOW", 
    link: "/courses/vidyapeeth-neet-11",
    totalHours: 400,
    chapters: [
      { id: "ch3-foundation", title: "Foundation Concepts", hours: 100, topics: ["Basic Mathematics", "Units & Dimensions", "Vectors", "Motion"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch3-intermediate", title: "Intermediate Topics", hours: 150, topics: ["Energy", "Waves", "Periodic Motion", "Electromagnetism"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch3-chemistry", title: "Chemistry Basics", hours: 100, topics: ["Atomic structure", "Chemical bonding", "Reactions", "Solutions"], previewVideoUrl: "https://youtu.be/sample" },
      { id: "ch3-biology", title: "Biology Overview", hours: 50, topics: ["Cell structure", "Tissues", "Human anatomy", "Life processes"], previewVideoUrl: "https://youtu.be/sample" }
    ]
  },
  { 
    id: "cet-foundation", 
    examSlug: "cet", 
    active: true, 
    order: 1, 
    title: "CET Foundation Batch 2026", 
    image: "https://via.placeholder.com/400x300?text=CET+Foundation", 
    badge: "ONLINE", 
    badgeColor: "bg-blue-600", 
    instructor: "Prof. Rajesh Kumar", 
    instructorImage: "", 
    price: 3999, 
    originalPrice: 4999, 
    startDate: "01 Feb 2026", 
    endDate: "31 Dec 2026", 
    duration: "11 months", 
    features: ["CET syllabus complete coverage", "300+ practice problems", "Weekly mock tests", "Solution videos for all topics", "Live doubt sessions twice a week"], 
    description: "Complete CET preparation for Engineering entrance with focused curriculum.", 
    cta: "ENROLL NOW", 
    link: "/courses/cet-foundation-2026" 
  },
  { 
    id: "ca-foundation", 
    examSlug: "ca", 
    active: true, 
    order: 1, 
    title: "CA Foundation - Comprehensive Program", 
    image: "https://via.placeholder.com/400x300?text=CA+Foundation", 
    badge: "ONLINE", 
    badgeColor: "bg-emerald-600", 
    instructor: "CA Priya Sharma", 
    instructorImage: "", 
    price: 12000, 
    originalPrice: 15000, 
    startDate: "01 Mar 2026", 
    endDate: "31 Aug 2026", 
    duration: "6 months", 
    features: ["All 4 papers covered", "Weekly live sessions", "Compilation of case studies", "Mock test series", "Professional guidance"], 
    description: "Complete CA Foundation program with expert instructors and comprehensive study material.", 
    cta: "ENROLL NOW", 
    link: "/courses/ca-foundation" 
  }
];

export const seedPromo: PromoBanner[] = [
  { id: "pb1", order: 1, active: true, title: "Tuition for 8th to 12th", image: "", link: "/courses/school-tuition" },
  { id: "pb2", order: 2, active: true, title: "NEET CET Coaching", image: "", link: "/courses/neet-cet-coaching" },
  { id: "pb3", order: 3, active: true, title: "CA Coaching", image: "", link: "/courses/ca-coaching" }
];
