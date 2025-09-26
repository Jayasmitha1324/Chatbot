"use strict";
// src/utils/openAIClient.ts
const OpenAI = require("openai");
let openai = null;
if (!process.env.OPENAI_API_KEY) {
    console.warn("Warning: OPENAI_API_KEY not set. OpenAI endpoints will fail until the key is provided.");
}
else {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
module.exports = openai;
