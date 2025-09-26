// src/api/promptApi.ts
import axios from "./axiosInstance";

export const createPrompt = async (projectId: number, name: string, content: string) => {
  const res = await axios.post(`/projects/${projectId}/prompts`, { name, content });
  return res.data;
};

export const listPrompts = async (projectId: number) => {
  const res = await axios.get(`/projects/${projectId}/prompts`);
  return res.data;
};
