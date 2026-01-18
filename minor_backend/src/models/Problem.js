import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        // Difficulty
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },

        // Test Cases
        testCases: [{
            input: { type: String, required: true },
            output: { type: String, required: true },
            hidden: { type: Boolean, default: false }
        }],

        // Multi-language Support
        languageSupport: [{
            language: { type: String, required: true }, // 'python', 'javascript', 'cpp', 'java', 'c'
            starterCode: { type: String, required: true },
            driverCode: { type: String } // Optional, acts as hidden main wrapper
        }],

        // Stats
        totalSubmissions: { type: Number, default: 0 },
        acceptedSubmissions: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

// Indexes
problemSchema.index({ difficulty: 1 });

export default mongoose.model("Problem", problemSchema);
