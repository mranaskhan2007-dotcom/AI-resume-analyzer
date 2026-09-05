const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        fileName: {
            type: String,
            default: "Resume.pdf"
        },

        jobDescription: {
            type: String,
            required: true
        },

        atsScore: {
            type: Number,
            required: true
        },

        matchingKeywords: {
            type: [String],
            default: []
        },

        missingKeywords: {
            type: [String],
            default: []
        },

        recommendedKeywords: {
            type: [String],
            default: []
        },

        suggestions: {
            type: [String],
            default: []
        },

        summary: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Analysis", analysisSchema);