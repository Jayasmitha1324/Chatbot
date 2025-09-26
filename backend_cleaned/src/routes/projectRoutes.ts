module.exports = (() => { 
  const { Router } = require("express"); 
  const { createProject, listProjects } = 
require("../controllers/projectController"); 
  const { authenticate } = require("../middleware/authMiddleware"); 
  const router = Router(); 
 
  router.post("/", authenticate, createProject); 
  router.get("/", authenticate, listProjects); 
 
  return router; 
})(); 