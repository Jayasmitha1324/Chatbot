// src/api/chatApi.ts
import axios from "./axiosInstance";

export const chatWithAgent = async (
  projectId: number,
  prompt: string,
  promptId?: number
) => {
  const res = await axios.post("/chat", { projectId, prompt, promptId });
  return res.data;
};

export const getChatHistory = async (projectId: number) => {
  const res = await axios.get(`/chat/${projectId}`);
  return res.data;
};
