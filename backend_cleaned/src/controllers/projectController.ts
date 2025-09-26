import type { Request, Response } from "express"; 
const { PrismaClient } = require("@prisma/client"); 
const prisma = new PrismaClient(); 
 
// Create project 
async function createProject(req: Request, res: Response) { 
  try { 
    const { name } = req.body; 
    const userId = (req as any).userId; 
    const project = await prisma.project.create({ 
      data: { name, userId }, 
    }); 
    res.status(201).json(project); 
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ error: "Failed to create project" }); 
  } 
} 
 
// List projects 
async function listProjects(req: Request, res: Response) { 
  try { 
    const userId = (req as any).userId; 
    const projects = await prisma.project.findMany({ where: { userId } }); 
    res.json(projects); 
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ error: "Failed to fetch projects" }); 
  } 
} 
 
module.exports = { createProject, listProjects };