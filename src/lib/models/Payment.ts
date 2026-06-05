import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal'],
      default: 'razorpay',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    description: {
      type: String,
    },
    receipt: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    refund: {
      refundId: String,
      amount: Number,
      status: String,
      reason: String,
      refundedAt: Date,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ paymentId: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
