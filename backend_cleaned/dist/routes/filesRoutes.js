"use strict";
module.exports = (() => {
    const { Router } = require("express");
    const { uploadFileToProject } = require("../controllers/filesController");
    const { authenticate } = require("../middleware/authMiddleware");
    const router = Router();
    router.post("/:projectId", authenticate, ...uploadFileToProject);
    return router;
})();
