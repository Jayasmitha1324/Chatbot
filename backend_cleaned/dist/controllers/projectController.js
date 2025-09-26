"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Create project 
async function createProject(req, res) {
    try {
        const { name } = req.body;
        const userId = req.userId;
        const project = await prisma.project.create({
            data: { name, userId },
        });
        res.status(201).json(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create project" });
    }
}
// List projects 
async function listProjects(req, res) {
    try {
        const userId = req.userId;
        const projects = await prisma.project.findMany({ where: { userId } });
        res.json(projects);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
}
module.exports = { createProject, listProjects };
