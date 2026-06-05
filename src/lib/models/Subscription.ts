import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      enum: ['free', 'monthly', 'quarterly', 'yearly'],
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'paused'],
      default: 'active',
    },
    daysRemaining: {
      type: Number,
    },
    features: [String],
    courseAccess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    benefits: {
      unlimitedCurrentAffairs: {
        type: Boolean,
        default: false,
      },
      allCourses: {
        type: Boolean,
        default: false,
      },
      mockTests: {
        type: Boolean,
        default: false,
      },
      magazines: {
        type: Boolean,
        default: false,
      },
      notes: {
        type: Boolean,
        default: false,
      },
      certificates: {
        type: Boolean,
        default: false,
      },
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
