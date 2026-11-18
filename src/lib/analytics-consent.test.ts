import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  cookieDomainsFor,
  listGoogleAnalyticsCookies,
  mayLoadAnalytics,
  readAnalyticsConsent,
  removeGoogleAnalyticsCookies,
  writeAnalyticsConsent,
} from "./analytics-consent.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

function throwingStorage() {
  return {
    getItem: (): string | null => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
}

function cookieJar(initial: string[]) {
  const cookies = new Map(
    initial.map((pair) => {
      const [name, value] = pair.split("=");
      return [name, value];
    }),
  );
  const writes: string[] = [];
  return {
    writes,
    get cookie() {
      return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
    },
    set cookie(entry: string) {
      writes.push(entry);
      const [pair, ...attributes] = entry.split(";").map((part) => part.trim());
      const [name, value] = pair.split("=");
      if (attributes.some((attribute) => attribute.includes("1970"))) {
        cookies.delete(name);
      } else {
        cookies.set(name, value);
      }
    },
  };
}

test("no stored choice means no consent and no analytics load", () => {
  const storage = memoryStorage();
  assert.equal(readAnalyticsConsent(storage), null);
  assert.equal(mayLoadAnalytics(readAnalyticsConsent(storage)), false);
});

test("null storage means no choice and writes fail safely", () => {
  assert.equal(readAnalyticsConsent(null), null);
  assert.equal(writeAnalyticsConsent(null, "granted"), false);
});

test("reject stores denied, blocks analytics, and removes GA cookies", () => {
  const storage = memoryStorage();
  assert.equal(writeAnalyticsConsent(storage, "denied"), true);
  assert.equal(storage.values.get(ANALYTICS_CONSENT_STORAGE_KEY), "denied");
  assert.equal(readAnalyticsConsent(storage), "denied");
  assert.equal(mayLoadAnalytics(readAnalyticsConsent(storage)), false);

  const jar = cookieJar(["_ga=GA1.1.1", "_ga_ABC123=GS1.1", "theme=dark"]);
  const removed = removeGoogleAnalyticsCookies(jar, "www.mifune.dev");
  assert.deepEqual(removed, ["_ga", "_ga_ABC123"]);
  assert.equal(jar.cookie, "theme=dark");
  assert.ok(jar.writes.includes("_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.www.mifune.dev"));
  assert.ok(jar.writes.includes("_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.mifune.dev"));
});

test("accept stores granted and allows analytics", () => {
  const storage = memoryStorage();
  assert.equal(writeAnalyticsConsent(storage, "granted"), true);
  assert.equal(storage.values.get(ANALYTICS_CONSENT_STORAGE_KEY), "granted");
  assert.equal(readAnalyticsConsent(storage), "granted");
  assert.equal(mayLoadAnalytics(readAnalyticsConsent(storage)), true);
});

test("an invalid stored value means no choice", () => {
  const storage = memoryStorage({ [ANALYTICS_CONSENT_STORAGE_KEY]: "yes" });
  assert.equal(readAnalyticsConsent(storage), null);
  assert.equal(mayLoadAnalytics(readAnalyticsConsent(storage)), false);
});

test("throwing storage means no choice and writes fail safely", () => {
  const storage = throwingStorage();
  assert.equal(readAnalyticsConsent(storage), null);
  assert.equal(writeAnalyticsConsent(storage, "denied"), false);
});

test("GA cookie listing ignores unrelated cookies", () => {
  assert.deepEqual(listGoogleAnalyticsCookies(cookieJar([])), []);
  assert.deepEqual(
    listGoogleAnalyticsCookies(cookieJar(["_gat=1", "_gab=2", "_ga_X=3"])),
    ["_ga_X"],
  );
});

test("cookie domains cover host and parent domain, not IPs or localhost", () => {
  assert.deepEqual(cookieDomainsFor("www.mifune.dev"), ["www.mifune.dev", "mifune.dev"]);
  assert.deepEqual(cookieDomainsFor("mifune.dev"), ["mifune.dev"]);
  assert.deepEqual(cookieDomainsFor("localhost"), []);
  assert.deepEqual(cookieDomainsFor("127.0.0.1"), []);
});
