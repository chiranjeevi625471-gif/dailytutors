import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['gs1', 'gs2', 'gs3', 'gs4', 'essay', 'prelims', 'other'],
    },
    tags: [String],
    relatedArticle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    relatedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'yellow',
    },
    fileAttachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    lastModified: {
      type: Date,
      default: Date.now,
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

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, category: 1 });

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
