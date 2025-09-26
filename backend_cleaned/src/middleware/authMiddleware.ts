import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check for Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  // 2️⃣ Check if secret is set
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 3️⃣ Verify the token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch (err: any) {
    // 4️⃣ Handle expired tokens separately
    if (err.name === "TokenExpiredError") {
      console.error("⚠️ JWT expired");
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }

    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}
