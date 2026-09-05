const express = require("express");
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function cleanJson(text) {
    let value = String(text || "").trim();

    if (value.startsWith("```")) {
        value = value
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
    }

    const start = value.indexOf("{");
    const end = value.lastIndexOf("}");

    if (start >= 0 && end > start) {
        value = value.slice(start, end + 1);
    }

    return JSON.parse(value);
}

router.post("/analyze", authMiddleware, async (req, res) => {
    try {
        const { resumeText, jobDescription, fileName } = req.body;

        if (!resumeText?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Resume text is required."
            });
        }

        if (!jobDescription?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Job description is required."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key is not configured on the backend."
            });
        }

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `You are an ATS resume analyzer.

Compare the resume with the job description.

Return ONLY valid JSON.
Do not use markdown.

Keep keywords concise and suggestions practical.
ATS score must be an integer from 0 to 100.

JSON schema:

{
  "atsScore": 0,
  "matchingKeywords": [],
  "missingKeywords": [],
  "recommendedKeywords": [],
  "suggestions": [],
  "summary": ""
}

RESUME:
${resumeText.slice(0, 30000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 20000)}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const analysis = cleanJson(response.text);

        analysis.atsScore = Math.max(
            0,
            Math.min(100, Number(analysis.atsScore) || 0)
        );

        for (const key of [
            "matchingKeywords",
            "missingKeywords",
            "recommendedKeywords",
            "suggestions"
        ]) {
            if (!Array.isArray(analysis[key])) {
                analysis[key] = [];
            }
        }

        analysis.summary = String(analysis.summary || "");

        const saved = await Analysis.create({
            user: req.userId,
            fileName: fileName || "Resume.pdf",
            jobDescription,
            ...analysis
        });

        res.json({
            success: true,
            message: "Resume analyzed successfully!",
            analysis,
            analysisId: saved._id
        });

    } catch (error) {
        console.error("Analysis error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze resume."
        });
    }
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const analyses = await Analysis.find({
            user: req.userId
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.json({
            success: true,
            analyses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load analysis history."
        });
    }
});

router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const mongoose = require("mongoose");

        const result = await Analysis.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    average: { $avg: "$atsScore" },
                    best: { $max: "$atsScore" }
                }
            }
        ]);

        const row = result[0] || {
            total: 0,
            average: null,
            best: null
        };

        res.json({
            success: true,
            stats: {
                total: row.total,
                average:
                    row.average == null
                        ? null
                        : Math.round(row.average),
                best:
                    row.best == null
                        ? null
                        : row.best
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics."
        });
    }
});

module.exports = router;