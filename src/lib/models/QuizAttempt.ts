import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeTaken: {
      // in seconds
      type: Number,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number,
        isCorrect: Boolean,
        timeSpent: Number,
      },
    ],
    totalQuestions: {
      type: Number,
    },
    correctAnswers: {
      type: Number,
    },
    wrongAnswers: {
      type: Number,
    },
    skippedAnswers: {
      type: Number,
    },
    score: {
      type: Number,
    },
    percentage: {
      type: Number,
    },
    isPassed: {
      type: Boolean,
    },
    rank: {
      type: Number,
    },
    totalAttempts: {
      type: Number,
    },
    bestScore: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'submitted'],
      default: 'in-progress',
    },
    reviewNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });
quizAttemptSchema.index({ quizId: 1, score: -1 });

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
