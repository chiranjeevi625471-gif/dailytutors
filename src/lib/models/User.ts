import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // Not required if using OAuth
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    educationBackground: {
      board: String,
      stream: String,
      currentYear: Number,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'moderator'],
      default: 'student',
    },
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        enrolledAt: Date,
        progress: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: ['active', 'completed', 'paused'],
          default: 'active',
        },
      },
    ],
    subscription: {
      type: {
        type: String,
        enum: ['free', 'monthly', 'quarterly', 'yearly'],
        default: 'free',
      },
      startDate: Date,
      endDate: Date,
      active: {
        type: Boolean,
        default: false,
      },
    },
    preferences: {
      preferredLanguage: {
        type: String,
        default: 'en',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
    },
    stats: {
      quizzesTaken: {
        type: Number,
        default: 0,
      },
      totalScore: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      articlesRead: {
        type: Number,
        default: 0,
      },
      lastActive: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
