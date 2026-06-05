import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      enum: ['the-hindu', 'indian-express', 'pib', 'livenews', 'prs', 'rbi', 'who', 'un', 'other'],
      required: true,
    },
    originalUrl: {
      type: String,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'Prelims'],
    },
    subcategories: [
      {
        type: String,
        enum: [
          'polity',
          'economy',
          'environment',
          'science-tech',
          'international-relations',
          'geography',
          'ethics',
          'history',
          'culture',
        ],
      },
    ],
    keyPoints: [String],
    prelimsFacts: [String],
    mainsAnalysis: {
      type: String,
    },
    constitutionalLinks: [String],
    keywords: [String],
    wayForward: {
      type: String,
    },
    relatedTopics: [String],
    mcqs: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
        },
      },
    ],
    pyqs: [
      {
        year: Number,
        question: String,
        answerKey: String,
      },
    ],
    aiGenerated: {
      type: Boolean,
      default: true,
    },
    aiModel: {
      type: String,
      enum: ['groq', 'openai', 'gemini'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending-review', 'approved', 'published', 'rejected'],
      default: 'pending-review',
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationNotes: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    pdfUrl: {
      type: String,
    },
    magazine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Magazine',
    },
    tags: [String],
    seoMetadata: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      canonicalUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ title: 'text', summary: 'text', keywords: 'text' });
articleSchema.index({ category: 1, status: 1, publishedAt: -1 });
articleSchema.index({ slug: 1 });

export default mongoose.models.Article || mongoose.model('Article', articleSchema);
