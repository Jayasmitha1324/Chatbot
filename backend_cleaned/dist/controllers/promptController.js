"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function createPrompt(req, res) {
    try {
        const userId = req.userId;
        const { projectId } = req.params;
        const { name, content } = req.body;
        if (!projectId) {
            return res.status(400).json({ error: "Missing projectId parameter" });
        }
        const parsedId = parseInt(projectId, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: "Invalid projectId" });
        }
        const project = await prisma.project.findUnique({ where: { id: parsedId } });
        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }
        const prompt = await prisma.prompt.create({
            data: {
                name: name || "Untitled",
                content,
                projectId: parsedId,
            },
        });
        res.status(201).json(prompt);
    }
    catch (err) {
        console.error("createPrompt error:", err);
        res.status(500).json({ error: err.message || "Failed to create prompt" });
    }
}
async function listPrompts(req, res) {
    try {
        const userId = req.userId;
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ error: "Missing projectId parameter" });
        }
        const parsedId = parseInt(projectId, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: "Invalid projectId" });
        }
        const project = await prisma.project.findUnique({ where: { id: parsedId } });
        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }
        const prompts = await prisma.prompt.findMany({
            where: { projectId: parsedId },
            orderBy: { createdAt: "desc" },
        });
        res.json(prompts);
    }
    catch (err) {
        console.error("listPrompts error:", err);
        res.status(500).json({ error: err.message || "Failed to fetch prompts" });
    }
}
module.exports = { createPrompt, listPrompts };
