// src/routes/filesRoutes.ts
module.exports = (() => {
  const { Router } = require("express");
  const multer = require("multer");
  const { uploadFileToProject } = require("../controllers/filesController");
  const { authenticate } = require("../middleware/authMiddleware");

  const upload = multer({ dest: "uploads/" });
  const router = Router();

  // ✅ must be (req, res) handler, not spread operator
  router.post("/:projectId", authenticate, upload.single("file"), uploadFileToProject);

  return router; // ✅ return router here
})();
