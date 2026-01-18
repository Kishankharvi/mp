import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true, index: true },

        // Code
        code: { type: String, required: true },
        language: { type: String, required: true },

        // Result
        status: {
            type: String,
            enum: ['pending', 'accepted', 'wrong_answer', 'error'],
            default: 'pending'
        },
        output: { type: String },

        // Test Results
        testsPassed: { type: Number, default: 0 },
        testsTotal: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

// Indexes
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ status: 1 });

export default mongoose.model("Submission", submissionSchema);
