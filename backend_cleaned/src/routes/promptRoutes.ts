// src/routes/promptRoutes.ts
module.exports = (() => {
  const { Router } = require("express");
  const { createPrompt, listPrompts } = require("../controllers/promptController");
  const { authenticate } = require("../middleware/authMiddleware");
  const router = Router();

  // mounted at /api/projects/:projectId/prompts (see index.ts)
  router.post("/:projectId/prompts", authenticate, createPrompt);
  router.get("/:projectId/prompts", authenticate, listPrompts);

  return router;
})();
