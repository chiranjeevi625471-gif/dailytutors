import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped', 'paused'],
      default: 'active',
    },
    progress: {
      completedLessons: [
        {
          moduleId: mongoose.Schema.Types.ObjectId,
          lessonId: mongoose.Schema.Types.ObjectId,
          completedAt: Date,
        },
      ],
      percentageComplete: {
        type: Number,
        default: 0,
      },
      lastAccessedAt: Date,
      timeSpent: {
        // in minutes
        type: Number,
        default: 0,
      },
    },
    certificate: {
      issued: {
        type: Boolean,
        default: false,
      },
      issuedAt: Date,
      certificateUrl: String,
      certificateId: String,
    },
    reviews: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      submittedAt: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ userId: 1, courseId: 1 });
enrollmentSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
