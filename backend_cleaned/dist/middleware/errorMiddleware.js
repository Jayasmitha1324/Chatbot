"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    console.error("Unhandled error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({ error: message });
}
module.exports = errorHandler;
