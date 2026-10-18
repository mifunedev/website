export const DAY_START_HOUR = 7;

export const NIGHT_START_HOUR = 18;

export const THEME_CHOICE_STORAGE_KEY = "theme-choice";

export const LEGACY_THEME_STORAGE_KEY = "theme";
export const LEGACY_THEME_AUTO_STORAGE_KEY = "theme-auto";

export const AUTO_THEME_ATTRIBUTE = "data-theme-auto";

export type TimeOfDayTheme = "light" | "dark";

export const THEME_COLORS: Record<TimeOfDayTheme, string> = {
  light: "#ffffff",
  dark: "#09090b",
};

export function resolveTimeOfDayTheme(hour: number): TimeOfDayTheme {
  return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR ? "dark" : "light";
}

export function resolveAutoTheme(
  hour: number,
  prefersDark: boolean,
): TimeOfDayTheme {
  return prefersDark ? "dark" : resolveTimeOfDayTheme(hour);
}

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
