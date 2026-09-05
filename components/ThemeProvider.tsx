// Persistent light and dark themes with resilient browser preferences | TypeScript
"use client";
import { createContext, useContext, useEffect } from "react";
import { usePreference, writePreference } from "@/lib/tool-history";
type Theme = "light" | "dark";
interface ThemeContextType { theme: Theme; setTheme: (theme: Theme) => void; resolvedTheme: Theme; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = usePreference("theme", "dark");
  const theme: Theme = preference === "light" ? "light" : "dark";
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme: value => writePreference("theme", value) }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
