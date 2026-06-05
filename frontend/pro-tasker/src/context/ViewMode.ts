import { createContext, useContext } from "react";

export type ViewMode = "tiles" | "list";

export type ViewModeContextType = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

export function useViewMode() {
  const context = useContext(ViewModeContext);

  if (!context) {
    throw new Error(
      "useViewMode must be used inside ViewModeProvider"
    );
  }

  return context;
}