"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { hashToken } = require("../utils/tokenUtils");
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_TOKEN_EXPIRES_DAYS = 7;
function generateAccessToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}
function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        const rtHash = hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
        await prisma.refreshToken.create({
            data: { tokenHash: rtHash, userId: user.id, expiresAt }
        });
        // set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ token: accessToken, id: user.id, name: user.name, email: user.email });
    }
    catch (err) {
        console.error(err);
        console.error("Registration error:", err);
        res.status(500).json({ error: "Failed to register user" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid credentials" });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        const rtHash = hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
        await prisma.refreshToken.create({
            data: { tokenHash: rtHash, userId: user.id, expiresAt }
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        });
        res.json({ token: accessToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
}
async function refreshTokenHandler(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ error: "Missing refresh token" });
        const rtHash = hashToken(refreshToken);
        const stored = await prisma.refreshToken.findFirst({ where: { tokenHash: rtHash } });
        if (!stored || new Date(stored.expiresAt) < new Date()) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }
        const user = await prisma.user.findUnique({ where: { id: stored.userId } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const newAccess = generateAccessToken(user.id);
        // rotate refresh token: delete old and issue new
        await prisma.refreshToken.delete({ where: { id: stored.id } });
        const newRT = generateRefreshToken();
        const newHash = hashToken(newRT);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
        await prisma.refreshToken.create({ data: { tokenHash: newHash, userId: user.id, expiresAt } });
        res.cookie("refreshToken", newRT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        });
        res.json({ token: newAccess });
    }
    catch (err) {
        console.error("refresh error:", err);
        res.status(500).json({ error: "Refresh failed" });
    }
}
module.exports = { register, login, refreshTokenHandler };
