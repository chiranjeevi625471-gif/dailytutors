/**
 * Comprehensive Type Definitions for UPSC Platform
 * This file contains all TypeScript interfaces and types used throughout the application
 */

// ============================================================================
// ADMIN & AUTHENTICATION TYPES
// ============================================================================

export interface Admin {
  _id?: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "superadmin" | "editor" | "moderator";
  permissions: AdminPermission[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export type AdminPermission =
  | "manage_articles"
  | "manage_courses"
  | "manage_quizzes"
  | "manage_payments"
  | "manage_admins"
  | "view_analytics"
  | "moderate_content";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: Omit<Admin, "passwordHash">;
}

export interface JWTPayload {
  adminId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ============================================================================
// ARTICLE TYPES
// ============================================================================

export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "archived"
  | "rejected";

export type GSPaper = "GS1" | "GS2" | "GS3" | "GS4" | "Essay" | "Prelims";

export type ArticleCategory =
  | "Polity"
  | "Economy"
  | "Environment"
  | "Science_Technology"
  | "Geography"
  | "Ethics"
  | "International_Relations";

export interface Article {
  _id?: string;
  title: string;
  slug: string;
  source: string; // The Hindu, Indian Express, PIB, etc.
  sourceUrl?: string;
  category: ArticleCategory;
  gsPapers: GSPaper[];
  status: ArticleStatus;
  
  // Content
  content: string;
  summary: string;
  whyInNews: string;
  
  // SEO & Metadata
  featuredImage?: string;
  keywords: string[];
  metaDescription: string;
  tags: string[];
  
  // AI Generated Content
  prelimsPointers: string[];
  mainsAnalysis: string;
  constitutionalLinks: string[];
  wayForward: string;
  relatedArticles: string[]; // Article IDs
  
  // MCQs
  mcqs?: MCQ[];
  
  // PYQs
  pyqs?: PYQ[];
  
  // Analytics
  views: number;
  likes: number;
  shares: number;
  
  // Automation
  aiGenerated: boolean;
  aiModel?: string; // groq, gemini, openai
  generatedAt?: Date;
  
  // Timestamps
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  modifiedBy?: string; // Admin ID
}

export interface MCQ {
  _id?: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic?: string;
}

export interface PYQ {
  _id?: string;
  question: string;
  year: number;
  paper: string;
  source: string;
  answer?: string;
}

// ============================================================================
// QUIZ TYPES
// ============================================================================

export interface Quiz {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: MCQ[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  isPublished: boolean;
}

export interface QuizAttempt {
  _id?: string;
  quizId: string;
  userId?: string; // For future use
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  submittedAt: Date;
}

// ============================================================================
// COURSE TYPES
// ============================================================================

export interface CourseLesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoDuration?: number; // in seconds
  resources?: {
    title: string;
    url: string;
    type: "pdf" | "video" | "link";
  }[];
  order: number;
}

export interface CourseCurriculum {
  _id?: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

export interface Course {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ArticleCategory;
  
  // Media
  thumbnail?: string;
  heroImage?: string;
  
  // Content
  whatYouWillLearn: string[];
  curriculum: CourseCurriculum[];
  prerequisites?: string[];
  
  // Pricing
  price: number; // in INR
  originalPrice?: number;
  discount?: number; // percentage
  
  // Metadata
  instructor?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // in hours
  lessons: number;
  students?: number;
  rating?: number;
  reviews?: number;
  
  // SEO
  metaDescription: string;
  keywords: string[];
  
  // Status
  isPublished: boolean;
  isFeatured: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded";

export interface Payment {
  _id?: string;
  orderId: string; // Razorpay Order ID
  paymentId?: string; // Razorpay Payment ID
  amount: number; // in paise
  currency: string;
  status: PaymentStatus;
  
  // User info
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  
  // Item info
  itemType: "course" | "magazine" | "subscription";
  itemId: string;
  itemName: string;
  
  // Payment Details
  method?: string; // credit_card, debit_card, upi, netbanking, wallet
  signature?: string; // Razorpay signature for verification
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ============================================================================
// DOWNLOAD/MAGAZINE TYPES
// ============================================================================

export interface Download {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  fileUrl: string;
  fileType: "pdf" | "doc" | "image";
  fileSize: number; // in bytes
  
  // Metadata
  thumbnail?: string;
  author?: string;
  tags: string[];
  
  // Status
  isPublished: boolean;
  isFeatured: boolean;
  
  // Analytics
  downloads: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Magazine {
  _id?: string;
  title: string;
  slug: string;
  month: number; // 1-12
  year: number;
  description: string;
  coverImage?: string;
  pdfUrl: string;
  
  // Content
  articles: string[]; // Article IDs
  sections: {
    title: string;
    articles: string[]; // Article IDs
  }[];
  
  // Metadata
  tags: string[];
  
  // Status
  isPublished: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// ============================================================================
// CATEGORY & TAG TYPES
// ============================================================================

export interface Category {
  _id?: string;
  name: ArticleCategory;
  slug: string;
  description: string;
  color?: string;
  icon?: string;
  postCount?: number;
  createdAt: Date;
}

export interface Tag {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  createdAt: Date;
}

// ============================================================================
// ANALYTICS & SETTINGS TYPES
// ============================================================================

export interface Analytics {
  _id?: string;
  date: Date;
  totalPageViews: number;
  totalUsers: number;
  articleViews: number;
  quizAttempts: number;
  courseEnrollments: number;
  totalRevenue: number;
  paymentCount: number;
}

export interface Settings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  
  // Contact
  contactEmail: string;
  supportEmail: string;
  phone?: string;
  
  // Social
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  
  // Features
  enableComments: boolean;
  enableSocialShare: boolean;
  enableNewsletter: boolean;
  
  // Content Settings
  articlesPerPage: number;
  quizzesPerPage: number;
  coursesPerPage: number;
  
  // AI Settings
  defaultAIModel: "groq" | "gemini" | "openai";
  automationEnabled: boolean;
  automationInterval: number; // in minutes
  
  // Payment
  razorpayKeyId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NewsArticleRaw {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  image?: string;
}

// ============================================================================
// AUTOMATION & AI TYPES
// ============================================================================

export interface AIProcessingResult {
  summary: string;
  keywords: string[];
  prelimsPointers: string[];
  mainsAnalysis: string;
  constitutionalLinks: string[];
  wayForward: string;
  gsPapers: GSPaper[];
  category: ArticleCategory;
  mcqs: MCQ[];
}

export interface NewsSource {
  name: string;
  url: string;
  type: "rss" | "api" | "scrape";
  enabled: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface APIError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreateArticleFormData {
  title: string;
  slug: string;
  category: ArticleCategory;
  gsPapers: GSPaper[];
  content: string;
  summary: string;
  whyInNews: string;
  tags: string[];
  featuredImage?: string;
  metaDescription: string;
}

export interface CreateCourseFormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ArticleCategory;
  price: number;
  thumbnail?: string;
  whatYouWillLearn: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
}

export interface CreateQuizFormData {
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: MCQ[];
  timeLimit: number;
  passingScore: number;
}
