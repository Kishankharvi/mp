import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        // Participants
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        // Room
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },

        // Details
        title: { type: String, required: true },
        scheduledAt: { type: Date, required: true },
        duration: { type: Number, default: 60 }, // minutes

        // Status
        status: {
            type: String,
            enum: ['pending', 'scheduled', 'completed', 'cancelled'],
            default: 'pending'
        },

        // Notes
        notes: { type: String },

        // Rating (1-5)
        rating: { type: Number, min: 1, max: 5 }
    },
    {
        timestamps: true
    }
);

// Indexes
sessionSchema.index({ mentorId: 1, scheduledAt: -1 });
sessionSchema.index({ studentId: 1, scheduledAt: -1 });

export default mongoose.model("Session", sessionSchema);
