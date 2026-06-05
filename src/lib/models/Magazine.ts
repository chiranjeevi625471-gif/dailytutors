import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema(
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
    monthYear: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    topics: [String],
    tags: [String],
    downloadCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    highlights: [String],
    pages: {
      type: Number,
    },
    fileSize: {
      type: Number,
    },
    seoMetadata: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Magazine || mongoose.model('Magazine', magazineSchema);
