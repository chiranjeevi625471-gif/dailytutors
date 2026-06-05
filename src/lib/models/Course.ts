import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
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
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['prelims', 'mains', 'optional', 'editorials', 'current-affairs'],
    },
    instructor: {
      name: String,
      bio: String,
      image: String,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['weeks', 'months'],
      },
    },
    modules: [
      {
        id: mongoose.Schema.Types.ObjectId,
        title: String,
        description: String,
        order: Number,
        lessons: [
          {
            id: mongoose.Schema.Types.ObjectId,
            title: String,
            type: {
              type: String,
              enum: ['video', 'pdf', 'quiz', 'reading'],
            },
            content: String,
            duration: Number,
            order: Number,
          },
        ],
      },
    ],
    learningOutcomes: [String],
    requirements: [String],
    targetAudience: [String],
    language: {
      type: String,
      default: 'en',
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    seoMetadata: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
