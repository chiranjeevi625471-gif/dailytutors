import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['daily-quiz', 'weekly-quiz', 'mock-test', 'chapter-quiz'],
      required: true,
    },
    type: {
      type: String,
      enum: ['prelims', 'mains'],
      default: 'prelims',
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      // in minutes
      type: Number,
      required: true,
    },
    passingScore: {
      type: Number,
      default: 40,
    },
    questions: [
      {
        id: mongoose.Schema.Types.ObjectId,
        question: String,
        type: {
          type: String,
          enum: ['single-choice', 'multiple-choice', 'boolean', 'short-answer'],
        },
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
        explanation: String,
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
        },
        relatedArticle: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Article',
        },
        tags: [String],
      },
    ],
    negativeMarking: {
      enabled: {
        type: Boolean,
        default: false,
      },
      marks: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    aiGenerated: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    scheduledFor: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
