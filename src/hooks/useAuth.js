import { useCallback, useSyncExternalStore } from "react";
import { isTokenExpired } from "../utils/jwt";

const TOKEN_KEY = "token";

function subscribe(callback) {
  window.addEventListener("auth:change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("auth:change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(TOKEN_KEY);
}

export default function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);
  const isAuthenticated = Boolean(token) && !isTokenExpired(token);

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    window.dispatchEvent(new Event("auth:change"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("auth:change"));
  }, []);

  return {
    token,
    isAuthenticated,
    login,
    logout,
  };
}
