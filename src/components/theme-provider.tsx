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

/**
 * The theme the bootstrap script auto-applied, read back off `<html>`.
 *
 * Undefined on the server and whenever an explicit choice was in play — in both
 * cases next-themes falls back to the `defaultTheme` the caller passed.
 */
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
      // Handing the auto-applied theme to next-themes as its default is what
      // keeps the automatic path out of storage entirely. next-themes reads
      // `localStorage[storageKey] || defaultTheme` once, in a state
      // initialiser, then re-applies that value in a mount effect — so without
      // this the effect would overwrite the bootstrap's result, and the only
      // other way to satisfy it is to persist the default, which is exactly
      // what leaks the automatic theme into other tabs.
      defaultTheme={readAutoTheme() ?? props.defaultTheme}
    >
      {/*
        Renders immediately after next-themes' own inline script, which applies
        `localStorage[storageKey] || defaultTheme` from values serialised during
        the *server* render and would otherwise clobber the automatic theme.
        Both scripts are parser-blocking and nothing paintable precedes either,
        so the last write still lands before first paint.
      */}
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: timeOfDayThemeScript }}
      />
      {children}
    </NextThemesProvider>
  )
}
