// Stores authentication state and automatically clears invalid or expired JWTs.
import { useCallback, useEffect, useState } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("protasker_token")
  );

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem("protasker_token", newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("protasker_token");
  }, []);

  useEffect(() => {
    if (!token) return;

    let msUntilExpiry = 0;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      msUntilExpiry = Math.max(0, (payload.exp ?? 0) * 1000 - Date.now());
    } catch { /* Invalid tokens expire immediately. */ }

    const timer = window.setTimeout(logout, msUntilExpiry);
    return () => window.clearTimeout(timer);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
