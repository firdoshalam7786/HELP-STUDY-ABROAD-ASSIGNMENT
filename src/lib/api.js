// src/lib/api.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

/**
 * Axios instance used across app.
 * Base URL controlled by NEXT_PUBLIC_DUMMYJSON_BASE (client-side config).
 */
const API_BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE || "https://dummyjson.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor to add Authorization header if token present in Zustand store
api.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().token; // read token from store (works outside React)
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if 401 -> clear auth and redirect to login (client-side)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // clear local token & redirect
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
