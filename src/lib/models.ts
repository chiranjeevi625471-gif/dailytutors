/**
 * MongoDB Models/Schemas for UPSC Platform
 * Using Mongoose for database operations
 */

import mongoose, { Schema, Document, Types } from "mongoose";
import {
  Admin,
  Article,
  Quiz,
  Course,
  Payment,
  Download,
  Magazine,
  Category,
  Tag,
  Analytics,
  Settings,
  MCQ,
  PYQ,
} from "@/types";

// ============================================================================
// ADMIN MODEL
// ============================================================================

const AdminSchema = new Schema<Admin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: 60,
    },
    role: {
      type: String,
      enum: ["superadmin", "editor", "moderator"],
      default: "editor",
    },
    permissions: {
      type: [String],
      default: ["manage_articles", "view_analytics"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

AdminSchema.index({ email: 1 });

export const AdminModel = mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

// ============================================================================
// ARTICLE MODEL
// ============================================================================

const MCQSchema = new Schema<MCQ>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctOption: { type: Number, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  topic: String,
});

const PYQSchema = new Schema<PYQ>({
  question: { type: String, required: true },
  year: { type: Number, required: true },
  paper: String,
  source: String,
  answer: String,
});

const ArticleSchema = new Schema<Article>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
    },
    sourceUrl: String,
    category: {
      type: String,
      enum: ["Polity", "Economy", "Environment", "Science_Technology", "Geography", "Ethics", "International_Relations"],
      required: true,
    },
    gsPapers: {
      type: [String],
      enum: ["GS1", "GS2", "GS3", "GS4", "Essay", "Prelims"],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "archived", "rejected"],
      default: "draft",
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    whyInNews: String,
    featuredImage: String,
    keywords: { type: [String], default: [] },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    tags: { type: [String], default: [] },
    prelimsPointers: { type: [String], default: [] },
    mainsAnalysis: String,
    constitutionalLinks: { type: [String], default: [] },
    wayForward: String,
    relatedArticles: { type: [String], default: [] },
    mcqs: { type: [MCQSchema], default: [] },
    pyqs: { type: [PYQSchema], default: [] },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    aiGenerated: { type: Boolean, default: false },
    aiModel: String,
    generatedAt: Date,
    publishedAt: { type: Date, default: null },
    modifiedBy: String,
  },
  { timestamps: true }
);

ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ gsPapers: 1 });
ArticleSchema.index({ createdAt: -1 });

export const ArticleModel = mongoose.models.Article || mongoose.model<Article>("Article", ArticleSchema);

// ============================================================================
// QUIZ MODEL
// ============================================================================

const QuizSchema = new Schema<Quiz>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    category: {
      type: String,
      enum: ["Polity", "Economy", "Environment", "Science_Technology", "Geography", "Ethics", "International_Relations"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    questions: { type: [MCQSchema], required: true },
    timeLimit: { type: Number, default: 30 }, // minutes
    passingScore: { type: Number, default: 60 }, // percentage
    totalQuestions: Number,
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

QuizSchema.index({ slug: 1 });
QuizSchema.index({ category: 1 });
QuizSchema.index({ isPublished: 1 });

export const QuizModel = mongoose.models.Quiz || mongoose.model<Quiz>("Quiz", QuizSchema);

// ============================================================================
// COURSE MODEL
// ============================================================================

const CourseLessonSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  videoDuration: Number,
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ["pdf", "video", "link"] },
    },
  ],
  order: Number,
});

const CourseCurriculumSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  lessons: { type: [CourseLessonSchema], default: [] },
  order: Number,
});

const CourseSchema = new Schema<Course>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: String,
    category: {
      type: String,
      enum: ["Polity", "Economy", "Environment", "Science_Technology", "Geography", "Ethics", "International_Relations"],
      required: true,
    },
    thumbnail: String,
    heroImage: String,
    whatYouWillLearn: { type: [String], default: [] },
    curriculum: { type: [CourseCurriculumSchema], default: [] },
    prerequisites: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: Number,
    discount: Number,
    instructor: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    duration: Number,
    lessons: Number,
    students: { type: Number, default: 0 },
    rating: Number,
    reviews: Number,
    metaDescription: String,
    keywords: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

CourseSchema.index({ slug: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ isPublished: 1 });

export const CourseModel = mongoose.models.Course || mongoose.model<Course>("Course", CourseSchema);

// ============================================================================
// PAYMENT MODEL
// ============================================================================

const PaymentSchema = new Schema<Payment>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: String,
    customerName: String,
    itemType: {
      type: String,
      enum: ["course", "magazine", "subscription"],
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemName: String,
    method: String,
    signature: String,
    completedAt: Date,
  },
  { timestamps: true }
);

PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ customerEmail: 1 });
PaymentSchema.index({ status: 1 });

export const PaymentModel = mongoose.models.Payment || mongoose.model<Payment>("Payment", PaymentSchema);

// ============================================================================
// DOWNLOAD MODEL
// ============================================================================

const DownloadSchema = new Schema<Download>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    category: {
      type: String,
      enum: ["Polity", "Economy", "Environment", "Science_Technology", "Geography", "Ethics", "International_Relations"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "image"],
      default: "pdf",
    },
    fileSize: Number,
    thumbnail: String,
    author: String,
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    downloads: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true }
);

DownloadSchema.index({ slug: 1 });
DownloadSchema.index({ category: 1 });
DownloadSchema.index({ isPublished: 1 });

export const DownloadModel = mongoose.models.Download || mongoose.model<Download>("Download", DownloadSchema);

// ============================================================================
// MAGAZINE MODEL
// ============================================================================

const MagazineSchema = new Schema<Magazine>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    description: String,
    coverImage: String,
    pdfUrl: {
      type: String,
      required: true,
    },
    articles: { type: [String], default: [] },
    sections: [
      {
        title: String,
        articles: { type: [Schema.Types.ObjectId], default: [] },
      },
    ],
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

MagazineSchema.index({ slug: 1 });
MagazineSchema.index({ year: 1, month: 1 });
MagazineSchema.index({ isPublished: 1 });

export const MagazineModel = mongoose.models.Magazine || mongoose.model<Magazine>("Magazine", MagazineSchema);

// ============================================================================
// CATEGORY & TAG MODELS
// ============================================================================

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    color: String,
    icon: String,
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<Category>("Category", CategorySchema);

const TagSchema = new Schema<Tag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TagModel = mongoose.models.Tag || mongoose.model<Tag>("Tag", TagSchema);

// ============================================================================
// ANALYTICS & SETTINGS MODELS
// ============================================================================

const AnalyticsSchema = new Schema<Analytics>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalPageViews: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
    articleViews: { type: Number, default: 0 },
    quizAttempts: { type: Number, default: 0 },
    courseEnrollments: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    paymentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ date: -1 });

export const AnalyticsModel = mongoose.models.Analytics || mongoose.model<Analytics>("Analytics", AnalyticsSchema);

const SettingsSchema = new Schema<Settings>(
  {
    siteName: {
      type: String,
      default: "Daily Tutors",
    },
    siteDescription: String,
    siteUrl: String,
    logoUrl: String,
    faviconUrl: String,
    contactEmail: String,
    supportEmail: String,
    phone: String,
    socialLinks: {
      twitter: String,
      facebook: String,
      linkedin: String,
      youtube: String,
      instagram: String,
    },
    enableComments: { type: Boolean, default: false },
    enableSocialShare: { type: Boolean, default: true },
    enableNewsletter: { type: Boolean, default: true },
    articlesPerPage: { type: Number, default: 12 },
    quizzesPerPage: { type: Number, default: 10 },
    coursesPerPage: { type: Number, default: 12 },
    defaultAIModel: {
      type: String,
      enum: ["groq", "gemini", "openai"],
      default: "groq",
    },
    automationEnabled: { type: Boolean, default: true },
    automationInterval: { type: Number, default: 30 }, // minutes
    razorpayKeyId: String,
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.models.Settings || mongoose.model<Settings>("Settings", SettingsSchema);
