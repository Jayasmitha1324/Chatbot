"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const openai = require("../utils/openAIClient");
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});
const uploadFileToProject = [
    upload.single("file"),
    async (req, res) => {
        try {
            const { projectId } = req.params;
            const file = req.file;
            if (!projectId)
                return res.status(400).json({ error: "projectId required" });
            const parsedId = parseInt(projectId, 10);
            if (isNaN(parsedId))
                return res.status(400).json({ error: "Invalid projectId" });
            if (!file)
                return res.status(400).json({ error: "No file provided" });
            // Check project existence
            const project = await prisma.project.findUnique({ where: { id: parsedId } });
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
            // Upload to OpenAI
            const stream = stream_1.Readable.from(file.buffer);
            const response = await openai.files.create({
                file: stream,
                purpose: "assistants",
            });
            // Save in DB
            const dbFile = await prisma.file.create({
                data: {
                    filename: file.originalname,
                    openAIFileId: response.id,
                    projectId: parsedId,
                },
            });
            res.status(201).json({ file: dbFile });
        }
        catch (err) {
            console.error("File upload error:", err);
            res.status(500).json({ error: err.message || "Upload failed" });
        }
    },
];
module.exports = { uploadFileToProject };
