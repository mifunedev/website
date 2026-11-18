export const ANALYTICS_CONSENT_STORAGE_KEY = "mifune-analytics-consent";

export const COOKIE_SETTINGS_EVENT = "mifune:cookie-settings";

export type AnalyticsConsent = "granted" | "denied";

export type ConsentStorage = Pick<Storage, "getItem" | "setItem">;

export type CookieJar = { cookie: string };

export function readAnalyticsConsent(
  storage: ConsentStorage | null | undefined,
): AnalyticsConsent | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(
  storage: ConsentStorage | null | undefined,
  consent: AnalyticsConsent,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
    return true;
  } catch {
    return false;
  }
}

export function mayLoadAnalytics(consent: AnalyticsConsent | null): boolean {
  return consent === "granted";
}

export function isGoogleAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name.startsWith("_ga_");
}

export function listGoogleAnalyticsCookies(jar: CookieJar): string[] {
  return jar.cookie
    .split(";")
    .map((pair) => pair.split("=")[0].trim())
    .filter(isGoogleAnalyticsCookie);
}

export function cookieDomainsFor(hostname: string): string[] {
  const labels = hostname.split(".").filter(Boolean);
  if (labels.length < 2 || /^\d+$/.test(labels[labels.length - 1])) {
    return [];
  }
  const parent = labels.slice(-2).join(".");
  return parent === hostname ? [hostname] : [hostname, parent];
}

export function removeGoogleAnalyticsCookies(
  jar: CookieJar,
  hostname: string,
): string[] {
  const names = listGoogleAnalyticsCookies(jar);
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  for (const name of names) {
    jar.cookie = `${name}=; ${expired}`;
    for (const domain of cookieDomainsFor(hostname)) {
      jar.cookie = `${name}=; ${expired}; domain=.${domain}`;
    }
  }
  return names;
}
