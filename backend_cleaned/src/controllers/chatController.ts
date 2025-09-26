import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import openai from "../utils/openAIClient";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const chatWithAgent = async (req: Request, res: Response) => {
  console.log("📩 Chat request received:", req.body);
  try {
    const { projectId, prompt, promptId } = req.body;

    if (!projectId || !prompt) {
      return res.status(400).json({ error: "projectId and prompt are required" });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        projectId: Number(projectId),
        userMessage: prompt,
      },
    });

    // Load system prompt
    let systemPrompt = "You are a helpful AI assistant.";
    if (promptId) {
      const promptData = await prisma.prompt.findUnique({ where: { id: promptId } });
      if (promptData?.content) systemPrompt = promptData.content;
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or try "gpt-4" if your account supports it
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Save reply
    await prisma.chatMessage.create({
      data: {
        projectId: Number(projectId),
        botMessage: reply,
      },
    });

    return res.json({ response: reply });
  } catch (err: any) {
    console.error("❌ Chat error details:", err?.response?.data || err?.message || err);
    return res.status(500).json({
      error: "Chat processing failed",
      details: err?.response?.data || err?.message || "Unknown error",
    });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const messages = await prisma.chatMessage.findMany({
      where: { projectId: Number(projectId) },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
