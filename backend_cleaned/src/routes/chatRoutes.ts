// src/routes/chatRoutes.ts
module.exports = (() => {
  const { Router } = require("express");
  const { chatWithAgent, getChatHistory } = require("../controllers/chatController");
  const { authenticate } = require("../middleware/authMiddleware");

  const router = Router();

  // 🧠 Chat endpoint
  router.post("/", authenticate, chatWithAgent);

  // 💬 Get chat history for a project (optional implementation in controller)
  router.get("/:projectId", authenticate, getChatHistory);

  return router;
})();
