import { useState } from "react";
import type { ReactNode } from "react";
import type {ViewMode} from "./ViewMode"
import { ViewModeContext } from "./ViewMode";

export function ViewModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (
      (localStorage.getItem("viewMode") as ViewMode) ||
      "tiles"
    );
  });

  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("viewMode", mode);
  };

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode: updateViewMode,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

