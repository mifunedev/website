/**
 * Client-local time-of-day theme default.
 *
 * The browser's own wall-clock hour is the client-timezone signal:
 * `new Date().getHours()` already resolves in the visitor's zone and is
 * DST-correct by construction. No `Intl` lookup, no geo-IP, no server clock,
 * no build-time constant.
 *
 * This module is the single source of the boundary constants. The inline
 * bootstrap script is built from those same constants (see
 * `buildTimeOfDayThemeScript`) so the two can never drift apart.
 */

/** 07:00 inclusive — start of the light window. */
export const DAY_START_HOUR = 7;

/** 18:00 inclusive — start of the dark window. */
export const NIGHT_START_HOUR = 18;

/** next-themes' storage key. Must match the `storageKey` the provider uses. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Companion key holding the value the bootstrap script last auto-applied.
 *
 * next-themes re-applies `defaultTheme` in a mount effect, so a script that
 * only sets the class is overwritten right after hydration. Seeding
 * `localStorage["theme"]` is therefore structurally required here — and this
 * marker is what keeps a required seed from freezing the default forever:
 * while `theme === theme-auto`, no human has actually chosen anything, so the
 * hour is re-resolved on every load. Any explicit selection clears the marker
 * and permanently ends the time rule.
 */
export const THEME_AUTO_STORAGE_KEY = "theme-auto";

export type TimeOfDayTheme = "light" | "dark";

/**
 * Mobile browser-chrome colours, matching the `--background` tokens in
 * `globals.css` (`0 0% 100%` light, `240 10% 3.9%` dark).
 *
 * The static `viewport.themeColor` cannot track a theme resolved from the
 * client clock, so the bootstrap script keeps the `<meta name="theme-color">`
 * in sync. Without this the feature would introduce a mismatch it did not have
 * before: pre-change the page was always dark, so dark chrome matched; a light
 * 14:00 page under dark chrome is a regression this feature would have caused.
 */
export const THEME_COLORS: Record<TimeOfDayTheme, string> = {
  light: "#ffffff",
  dark: "#09090b",
};

/**
 * Pure boundary rule. Reads no `Date`, no `window`, no `localStorage` — the
 * hour is always supplied by the caller, which is what keeps the client-side
 * clock read in exactly one place per page load.
 *
 * | Local hour  | Theme |
 * | ----------- | ----- |
 * | 00:00–06:59 | dark  |
 * | 07:00–17:59 | light |
 * | 18:00–23:59 | dark  |
 */
export function resolveTimeOfDayTheme(hour: number): TimeOfDayTheme {
  return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR ? "dark" : "light";
}

/**
 * Build the synchronous inline `<head>` script that applies the time-of-day
 * default before anything paints and before next-themes' own script runs.
 *
 * Precedence, evaluated once per document load:
 *
 * - `theme` absent            → resolve by hour, write both keys, apply.
 * - `theme === theme-auto`    → still an unmade choice → re-resolve by hour,
 *                               write both keys, apply.
 * - otherwise                 → a real explicit choice → touch neither storage
 *                               nor the class; next-themes owns both.
 *
 * In every branch the resolved colour is mirrored into
 * `<meta name="theme-color">`, which Next renders ahead of this script, so the
 * mobile chrome cannot disagree with the painted page.
 *
 * The whole body is exception-wrapped: if `localStorage` is unavailable or
 * throws, the script does nothing at all and the page falls through to
 * next-themes' pre-existing `defaultTheme` behaviour.
 *
 * `theme-auto` is written before `theme` on purpose. If the second write
 * fails (quota, denied storage) the surviving state is `theme` absent, which
 * simply re-resolves next load — the opposite order would leave a seeded
 * `theme` with no marker and freeze it as a fake explicit choice.
 */
export function buildTimeOfDayThemeScript(): string {
  return [
    "(function(){try{",
    `var K=${JSON.stringify(THEME_STORAGE_KEY)},A=${JSON.stringify(THEME_AUTO_STORAGE_KEY)};`,
    `var DAY=${DAY_START_HOUR},NIGHT=${NIGHT_START_HOUR};`,
    `var C=${JSON.stringify(THEME_COLORS)};`,
    "var s=window.localStorage;",
    "var raw=s.getItem(K),auto=s.getItem(A),t;",
    "if(raw!==null&&raw!==auto){",
    // An explicit choice: never touch storage or the class (next-themes owns
    // both). Only mirror the resolved colour into the chrome meta.
    "t=raw==='light'?'light':raw==='dark'?'dark':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');",
    "}else{",
    "var h=new Date().getHours();",
    "t=(h>=NIGHT||h<DAY)?'dark':'light';",
    "s.setItem(A,t);s.setItem(K,t);",
    "var e=document.documentElement;",
    "e.classList.remove('light','dark');",
    "e.classList.add(t);",
    "e.style.colorScheme=t;",
    "}",
    "var m=document.querySelector('meta[name=\"theme-color\"]');",
    "if(m&&C[t])m.setAttribute('content',C[t]);",
    "}catch(err){}})();",
  ].join("");
}
