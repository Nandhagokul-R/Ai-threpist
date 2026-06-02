"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-600 dark:to-purple-700 hover:from-amber-500 hover:to-orange-600 dark:hover:from-indigo-700 dark:hover:to-purple-800 text-white shadow-lg shadow-amber-500/30 dark:shadow-purple-500/30 hover:shadow-xl hover:shadow-amber-500/40 dark:hover:shadow-purple-500/40 transform hover:scale-110 hover:rotate-12 transition-all duration-300 border-0"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 drop-shadow-lg" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 drop-shadow-lg" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
