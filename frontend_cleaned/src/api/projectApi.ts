// src/api/projectApi.ts
import axios from "./axiosInstance";

export const createProject = async (name: string) => {
  const res = await axios.post("/projects", { name });
  return res.data;
};

export const listProjects = async () => {
  const res = await axios.get("/projects");
  return res.data;
};
