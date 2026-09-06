const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume",
            });
        }

        const pdfBuffer = fs.readFileSync(req.file.path);

        const parser = new PDFParse({
            data: pdfBuffer,
        });

        const result = await parser.getText();

        await parser.destroy();

        res.json({
            success: true,
            message: "Resume uploaded successfully",
            fileName: req.file.originalname,
            text: result.text,
        });
    } catch (error) {
        console.error("Resume upload error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to process resume",
        });
    }
});

module.exports = router;