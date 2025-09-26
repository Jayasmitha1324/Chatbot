// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

dotenv.config();

const authRouter = require("./routes/authRoutes");
const projectRouter = require("./routes/projectRoutes");
const chatRouter = require("./routes/chatRoutes");
const filesRouter = require("./routes/filesRoutes");
const promptRouter = require("./routes/promptRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ✅ middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve frontend if built
const frontendBuild = path.join(__dirname, "../..", "frontend_cleaned", "build");
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));

  // ✅ FIXED: Add types for req and res
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
}

// ✅ Add body size limits and credentials handling
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// ✅ Mount routers
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter); // project endpoints
app.use("/api/chat", chatRouter); // chat endpoints
app.use("/api/files", filesRouter); // file upload endpoints
app.use("/api/prompts", promptRouter); // prompts at /api/projects/:projectId/prompts

// ✅ Error handler (last)
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export {};
