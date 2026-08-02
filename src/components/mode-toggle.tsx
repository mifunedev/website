"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_AUTO_STORAGE_KEY } from "@/lib/time-of-day-theme";

export function ModeToggle() {
  const { setTheme } = useTheme();

  // Every selection here is an explicit choice, so it must permanently end the
  // time-of-day default — including the case where the user picks the same
  // value the clock had already auto-applied. Clearing the marker is what makes
  // that airtight instead of heuristic.
  const chooseTheme = React.useCallback(
    (theme: string) => {
      try {
        window.localStorage.removeItem(THEME_AUTO_STORAGE_KEY);
      } catch {
        // Storage unavailable: next-themes' own setTheme is best-effort too.
      }
      setTheme(theme);
    },
    [setTheme],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 focus-visible:ring-2 focus-visible:ring-oh-focus"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="min-h-11"
          onClick={() => chooseTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-11"
          onClick={() => chooseTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-11"
          onClick={() => chooseTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
