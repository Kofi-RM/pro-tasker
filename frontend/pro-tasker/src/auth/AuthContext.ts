

import { createContext } from "react";

type AuthContextType = {
  token: string;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
