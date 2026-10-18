"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {
  AUTO_THEME_ATTRIBUTE,
  THEME_CHOICE_STORAGE_KEY,
  buildTimeOfDayThemeScript,
  type TimeOfDayTheme,
} from "@/lib/time-of-day-theme"

const timeOfDayThemeScript = buildTimeOfDayThemeScript()

function readAutoTheme(): TimeOfDayTheme | undefined {
  if (typeof document === "undefined") return undefined
  const applied = document.documentElement.getAttribute(AUTO_THEME_ATTRIBUTE)
  return applied === "light" || applied === "dark" ? applied : undefined
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      storageKey={THEME_CHOICE_STORAGE_KEY}
      defaultTheme={readAutoTheme() ?? props.defaultTheme}
    >
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: timeOfDayThemeScript }}
      />
      {children}
    </NextThemesProvider>
  )
}
