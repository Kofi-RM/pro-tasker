

import { createContext } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkedProjectId: string 
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
