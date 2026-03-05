import React, { createContext, useContext } from "react";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeContextValue } from "../../types/theme";

export type { Theme } from "../../types/theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeState = useTheme();
  return <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
