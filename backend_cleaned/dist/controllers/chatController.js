"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const openai = require("../utils/openAIClient");
const prisma = new PrismaClient();
const chatWithAgent = async (req, res) => {
    try {
        const { projectId, prompt, promptId } = req.body;
        if (!projectId || !prompt) {
            return res.status(400).json({ error: "projectId and prompt are required" });
        }
        // ✅ Save user message to DB
        await prisma.chatMessage.create({
            data: {
                projectId: Number(projectId),
                userMessage: prompt,
            },
        });
        // ✅ Optional: fetch system prompt from DB
        let systemPrompt = "You are a helpful AI assistant.";
        if (promptId) {
            const promptData = await prisma.prompt.findUnique({ where: { id: promptId } });
            if (promptData?.content) {
                systemPrompt = promptData.content;
            }
        }
        // ✅ Generate reply with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
        });
        const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        // ✅ Save bot response to DB
        await prisma.chatMessage.create({
            data: {
                projectId: Number(projectId),
                botMessage: reply,
            },
        });
        return res.json({ response: reply });
    }
    catch (err) {
        console.error("Chat error:", err);
        return res.status(500).json({ error: "Chat processing failed" });
    }
};
const getChatHistory = async (req, res) => {
    try {
        const { projectId } = req.params;
        const messages = await prisma.chatMessage.findMany({
            where: { projectId: Number(projectId) },
            orderBy: { createdAt: "asc" },
        });
        res.json(messages);
    }
    catch (err) {
        console.error("Chat history error:", err);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};
module.exports = { chatWithAgent, getChatHistory };
