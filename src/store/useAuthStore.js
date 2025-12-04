// src/store/useAuthStore.js
import { create } from "zustand";

const AUTH_LOCAL_KEY = "hsa_auth_v1";

const useAuthStore = create((set, get) => ({
  // state
  token: null,
  user: null,

  // set auth (and persist)
  setAuth: ({ token, user }) => {
    set({ token: token || null, user: user || null });
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_LOCAL_KEY, JSON.stringify({ token: token || null, user: user || null }));
      }
    } catch (e) {
      // don't crash app if localStorage blocked
      // console.warn("Failed to persist auth:", e);
    }
  },

  // load persisted auth from localStorage
  loadAuthFromStorage: () => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(AUTH_LOCAL_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({ token: parsed.token || null, user: parsed.user || null });
    } catch (e) {
      console.warn("Failed to read persisted auth:", e);
    }
  },

  // alias for backward compatibility (some places may call initFromStorage)
  initFromStorage: () => {
    const fn = get().loadAuthFromStorage;
    if (typeof fn === "function") fn();
  },

  // clear auth (logout)
  logout: () => {
    set({ token: null, user: null });
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_LOCAL_KEY);
      }
    } catch (e) {
      // ignore
    }
  },
}));

export default useAuthStore;
