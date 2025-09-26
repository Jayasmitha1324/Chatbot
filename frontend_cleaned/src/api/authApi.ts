// src/api/authApi.ts
import axios from "./axiosInstance";

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password }, { withCredentials: true });
  // backend should return token in body; axiosInstance expects token stored as localStorage.token
  return res.data;
};

export const refreshToken = async () => {
  const res = await axios.post("/auth/refresh", {}, { withCredentials: true });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
};
