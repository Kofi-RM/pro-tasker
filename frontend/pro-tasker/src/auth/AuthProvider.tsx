
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
const {projectId} = useParams() 
const checkedProjectId = projectId ?? "";
  return (
    <AuthContext.Provider value={{ token, login, logout, checkedProjectId }}>
      {children}
    </AuthContext.Provider>
  );
};