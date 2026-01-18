import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        // Achievement Type
        type: {
            type: String,
            required: true,
            enum: [
                'first_problem',      // Solved first problem
                'problems_10',        // Solved 10 problems
                'problems_50',        // Solved 50 problems
                'streak_7',           // 7 day coding streak
                'streak_30',          // 30 day coding streak
                'first_session',      // Completed first mentoring session
                'mentor_5',           // Mentored 5 students
                'perfect_score'       // Got 100% on a problem
            ]
        },

        // Details
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String }, // Icon name or emoji

        // Status
        unlockedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true
    }
);

// Compound index to prevent duplicate achievements
achievementSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.model("Achievement", achievementSchema);
