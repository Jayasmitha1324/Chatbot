// src/controllers/filesController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadFileToProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      res.status(400).json({ error: "projectId is required" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const newFile = await prisma.projectFile.create({
      data: {
        projectId: parseInt(projectId, 10),
        filename: req.file.originalname,
        filepath: req.file.path,
      },
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
