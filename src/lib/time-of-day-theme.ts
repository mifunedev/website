/**
 * Client-local automatic theme default.
 *
 * The browser's own wall-clock hour is the client-timezone signal:
 * `new Date().getHours()` already resolves in the visitor's zone and is
 * DST-correct by construction. No `Intl` lookup, no geo-IP, no server clock,
 * no build-time constant.
 *
 * Two rules compose into the automatic default, and the order matters:
 *
 * 1. `prefers-color-scheme: dark` is a *declared* preference — the only channel
 *    a platform gives a user to say "light surfaces hurt me". It wins outright.
 * 2. The hour is an *inferred* preference, and may only ever upgrade light →
 *    dark, never dark → light.
 *
 * This module is the single source of the boundary constants. The inline
 * bootstrap script is built from those same constants (see
 * `buildTimeOfDayThemeScript`) so the two can never drift apart.
 */

/** 07:00 inclusive — start of the light window. */
export const DAY_START_HOUR = 7;

/** 18:00 inclusive — start of the dark window. */
export const NIGHT_START_HOUR = 18;

/**
 * next-themes' storage key.
 *
 * It holds an explicit user choice and **nothing else**. The automatic default
 * is never written to storage, which is precisely what stops it propagating
 * between tabs: `storage` events fire in every *other* document of the origin,
 * and next-themes listens for them, so anything the automatic path persisted
 * would retheme an already-open tab with no reload and no user action.
 *
 * Because only choices land here, "key absent" is an exact, self-describing
 * test for "no human has chosen" — no companion marker key is needed to tell a
 * seeded default apart from a real selection.
 */
export const THEME_CHOICE_STORAGE_KEY = "theme-choice";

/**
 * Keys written by the previous seeding design, read once for migration.
 *
 * They are read and never removed. Removing `theme` would emit a `storage`
 * event that a tab still running the old bundle would answer by writing its own
 * default straight back — resurrecting the key without its marker, where it
 * then reads as a permanent explicit choice. Leaving both in place is inert:
 * nothing in the current design writes or watches either one.
 */
export const LEGACY_THEME_STORAGE_KEY = "theme";
export const LEGACY_THEME_AUTO_STORAGE_KEY = "theme-auto";

/**
 * Attribute the bootstrap stamps on `<html>` with the theme it auto-applied.
 *
 * This is how the resolved default reaches React without going through
 * storage. `ThemeProvider` reads it during the client render and passes it as
 * next-themes' `defaultTheme`, so next-themes' own mount effect re-applies the
 * value already on screen instead of overwriting it.
 *
 * Absent means an explicit choice was in play, so nothing was auto-applied.
 */
export const AUTO_THEME_ATTRIBUTE = "data-theme-auto";

export type TimeOfDayTheme = "light" | "dark";

/**
 * Mobile browser-chrome colours, matching the `--background` tokens in
 * `globals.css` (`0 0% 100%` light, `240 10% 3.9%` dark).
 *
 * The static `viewport.themeColor` cannot track a theme resolved on the client,
 * so the bootstrap script keeps the `<meta name="theme-color">` in sync.
 * Without this the feature would introduce a mismatch it did not have before:
 * pre-change the page was always dark, so dark chrome matched; a light 14:00
 * page under dark chrome is a regression this feature would have caused.
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
 * The full automatic default: a declared OS-dark preference outranks the hour,
 * so the clock can only ever darken a light result, never lighten a dark one.
 */
export function resolveAutoTheme(
  hour: number,
  prefersDark: boolean,
): TimeOfDayTheme {
  return prefersDark ? "dark" : resolveTimeOfDayTheme(hour);
}

/**
 * Build the synchronous inline script that settles the theme before anything
 * paints.
 *
 * It must render **after** next-themes' own inline script, which applies
 * `localStorage[storageKey] || defaultTheme` and would otherwise overwrite the
 * automatic result with the server-serialised default. `ThemeProvider` owns
 * that ordering by rendering this script as its first child; both are
 * parser-blocking and no paintable markup precedes either.
 *
 * Precedence, evaluated once per document load:
 *
 * - explicit `light` / `dark` → apply it; next-themes agrees on mount.
 * - explicit `system`         → apply the OS preference, as next-themes will.
 * - no choice                 → resolve from OS preference + hour, apply it,
 *                               and stamp `data-theme-auto`. **No storage is
 *                               written**, so no other tab is disturbed.
 *
 * In every branch the resolved colour is mirrored into
 * `<meta name="theme-color">`, which Next renders ahead of this script, so the
 * mobile chrome cannot disagree with the painted page.
 *
 * Storage access is wrapped separately from the rest of the body: if
 * `localStorage` is unavailable or throws, the automatic default still applies
 * rather than the page falling through to next-themes' static default.
 */
export function buildTimeOfDayThemeScript(): string {
  return [
    "(function(){try{",
    `var C=${JSON.stringify(THEME_CHOICE_STORAGE_KEY)},L=${JSON.stringify(LEGACY_THEME_STORAGE_KEY)},M=${JSON.stringify(LEGACY_THEME_AUTO_STORAGE_KEY)};`,
    `var ATTR=${JSON.stringify(AUTO_THEME_ATTRIBUTE)};`,
    `var DAY=${DAY_START_HOUR},NIGHT=${NIGHT_START_HOUR};`,
    `var COLORS=${JSON.stringify(THEME_COLORS)};`,
    "var e=document.documentElement,s=null,c=null;",
    "try{s=window.localStorage;}catch(err){}",
    "if(s){",
    "c=s.getItem(C);",
    "if(c===null){",
    // A legacy value that differs from the legacy marker was a real choice; a
    // value equal to it was only ever a seeded default, so it stays unmigrated
    // and this visitor simply returns to the automatic path.
    "var lg=s.getItem(L);",
    "if(lg!==null&&lg!==s.getItem(M)){s.setItem(C,lg);c=lg;}",
    "}}",
    "var d=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);",
    "var t;",
    "if(c==='light'||c==='dark'){t=c;}",
    "else if(c!==null){t=d?'dark':'light';}",
    "else{",
    "var h=new Date().getHours();",
    "t=(d||h>=NIGHT||h<DAY)?'dark':'light';",
    "e.setAttribute(ATTR,t);",
    "}",
    "e.classList.remove('light','dark');",
    "e.classList.add(t);",
    "e.style.colorScheme=t;",
    "var m=document.querySelector('meta[name=\"theme-color\"]');",
    "if(m&&COLORS[t])m.setAttribute('content',COLORS[t]);",
    "}catch(err){}})();",
  ].join("");
}
