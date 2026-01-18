import mongoose from "mongoose";
import { USER_ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Role
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT
    },

    // Profile
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },

    // Mentor Info (only if role is mentor)
    mentorProfile: {
      specializations: [{ type: String }],
      hourlyRate: { type: Number },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalSessions: { type: Number, default: 0 }
    },

    // Simple Stats
    stats: {
      problemsSolved: { type: Number, default: 0 },
      totalSubmissions: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date }
    },

    // Achievements (references)
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],

    // Security
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
  },
  {
    timestamps: true
  }
);

// Indexes

userSchema.index({ role: 1 });

// Method to update streak
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.stats.lastActiveDate) {
    this.stats.currentStreak = 1;
    this.stats.longestStreak = 1;
  } else {
    const lastActive = new Date(this.stats.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else {
      // Streak broken
      this.stats.currentStreak = 1;
    }
  }

  this.stats.lastActiveDate = today;
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  return obj;
};

export default mongoose.model("User", userSchema);
