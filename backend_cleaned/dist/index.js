"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const authRouter = require("./routes/authRoutes");
const projectRouter = require("./routes/projectRoutes");
const chatRouter = require("./routes/chatRoutes");
const filesRouter = require("./routes/filesRoutes");
const promptRouter = require("./routes/promptRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
// ✅ middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ✅ Serve frontend if built
const frontendBuild = path_1.default.join(__dirname, "../..", "frontend_cleaned", "build");
if (fs_1.default.existsSync(frontendBuild)) {
    app.use(express_1.default.static(frontendBuild));
    // ✅ FIXED: Add types for req and res
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(frontendBuild, "index.html"));
    });
}
// ✅ Add body size limits and credentials handling
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, cookie_parser_1.default)());
// ✅ Mount routers
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter); // project endpoints
app.use("/api/chat", chatRouter); // chat endpoints
app.use("/api/files", filesRouter); // file upload endpoints
app.use("/api/projects", promptRouter); // prompts at /api/projects/:projectId/prompts
// ✅ Error handler (last)
app.use(errorHandler);
// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
