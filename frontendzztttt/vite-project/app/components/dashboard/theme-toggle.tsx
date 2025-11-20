"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import { useTheme } from "next-themes";
import { startThemeTransition } from "@/lib/dashboard/theme-transition";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    startThemeTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
