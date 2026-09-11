"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ModeToggle() {
  // Every selection here is an explicit choice, and `setTheme` is all it takes
  // to record one: the automatic default never writes storage, so the mere
  // presence of a stored value permanently ends the automatic path — including
  // when the user picks the same value the clock had already applied.
  const { theme, resolvedTheme, setTheme: chooseTheme } = useTheme();

  // The active theme is not knowable during SSR, and on the client it is
  // resolved from the DOM — so rendering it before mount would hydrate against
  // markup the server could not have produced. Until then the control keeps its
  // previous, state-free name.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const selected = THEME_OPTIONS.find((option) => option.value === theme);
  const triggerLabel =
    mounted && selected
      ? selected.value === "system"
        ? `Theme: System (currently ${resolvedTheme === "dark" ? "dark" : "light"})`
        : `Theme: ${selected.label}`
      : "Toggle theme";

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
          <span className="sr-only">{triggerLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/*
          A radio group rather than plain items: it is what gives each option
          `role="menuitemradio"` and an `aria-checked` state, so the menu reports
          which theme is active instead of only offering destinations.
        */}
        <DropdownMenuRadioGroup
          value={mounted ? theme : undefined}
          onValueChange={chooseTheme}
        >
          {THEME_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="min-h-11"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
