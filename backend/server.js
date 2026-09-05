const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(
    cors({
        origin: function (origin, callback) {
            if (
                !origin ||
                /^http:\/\/localhost:\d+$/.test(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Resume Analyzer backend is running!",
    });
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });