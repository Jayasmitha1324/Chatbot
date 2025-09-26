// src/api/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

interface FailedQueueItem {
  resolve: (value?: AxiosResponse) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig;
}

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// localStorage token key used by the rest of the app
const TOKEN_KEY = "token";
const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
const setAccessToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  // optional: redirect to login root
  window.location.href = "/";
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = async (error: any, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      if (token) {
        prom.config.headers = prom.config.headers || {};
        (prom.config.headers as any).Authorization = `Bearer ${token}`;
      }
      try {
        const response = await instance(prom.config);
        prom.resolve(response);
      } catch (err) {
        prom.reject(err);
      }
    }
  }
  failedQueue = [];
};

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = error.config;
    if (!originalConfig) return Promise.reject(error);

    // If not 401, just forward
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // If refresh endpoint itself failed -> logout
    if (originalConfig.url?.includes("/auth/refresh")) {
      clearAuth();
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isRefreshing = true;
    try {
      // call refresh endpoint on backend. Ensure backend issues new token and sets cookie if needed.
      const resp = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
      const newToken = resp.data?.token;
      if (!newToken) throw new Error("No token in refresh response");
      setAccessToken(newToken);

      // attach to original request
      originalConfig.headers = originalConfig.headers || {};
      (originalConfig.headers as any).Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);
      return instance(originalConfig);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAuth();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
