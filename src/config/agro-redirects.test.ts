import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { INSTALLER } from "../../scripts/sync-external-scripts.mjs";
import { DESTS } from "../../scripts/build-oh-cli.mjs";
import {
  AGRO_FALLBACK,
  AGRO_HOST,
  AGRO_REDIRECTS,
  LEGACY_REDIRECTS,
  MIFUNE_ORIGIN,
  SITEMAP_REDIRECTS,
  agroHostRedirects,
  passthroughPattern,
} from "./agro-redirects.ts";

const SITEMAP = new URL("../../.agro/tasks/retire-agro-web/evidence/agro-web-sitemap.xml", import.meta.url);
const INSTALLER_FILES = [...INSTALLER.dests, ...DESTS].map((dest: string) => basename(dest));

function sitemapPaths(): string[] {
  const xml = readFileSync(SITEMAP, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    assert.equal(url.host, AGRO_HOST);
    return url.pathname.replace(/(.)\/$/, "$1");
  });
}

test("the fixture holds the 83 agro-web sitemap URLs", () => {
  assert.equal(sitemapPaths().length, 83);
});

test("each sitemap URL has a mapping", () => {
  const missing = sitemapPaths().filter((path) => !(path in SITEMAP_REDIRECTS));
  assert.deepEqual(missing, []);
});

test("the map holds only sitemap URLs and the 44 legacy redirects", () => {
  const sitemap = new Set(sitemapPaths());
  assert.deepEqual(
    Object.keys(SITEMAP_REDIRECTS).filter((path) => !sitemap.has(path)),
    [],
  );
  assert.equal(Object.keys(LEGACY_REDIRECTS).length, 44);
  assert.deepEqual(
    Object.keys(LEGACY_REDIRECTS).filter((path) => path in SITEMAP_REDIRECTS),
    [],
  );
});

test("each legacy redirect reaches a final page in one hop", () => {
  const finalPages = new Set(Object.values(SITEMAP_REDIRECTS));
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    assert.ok(!(to in LEGACY_REDIRECTS), `${from} -> ${to} chains into another legacy redirect`);
    assert.ok(finalPages.has(to), `${from} -> ${to} is not a mapped final page`);
  }
});

test("no destination is a retired agro-web path", () => {
  for (const [from, to] of Object.entries(AGRO_REDIRECTS)) {
    assert.ok(!(to in LEGACY_REDIRECTS), `${from} -> ${to}`);
    assert.notEqual(to, "/docs/agro/runtimes/openshell");
  }
});

test("each redirect is permanent, host-guarded, and absolute", () => {
  const rules = agroHostRedirects(INSTALLER_FILES);
  assert.equal(rules.length, Object.keys(AGRO_REDIRECTS).length + 1);
  for (const rule of rules) {
    assert.equal(rule.permanent, true);
    assert.deepEqual(rule.has, [{ type: "host", value: AGRO_HOST }]);
    assert.ok(rule.destination.startsWith(`${MIFUNE_ORIGIN}/`), rule.destination);
  }
  assert.equal(rules.at(-1)?.destination, `${MIFUNE_ORIGIN}${AGRO_FALLBACK}`);
});

test("the installer paths are not redirected", () => {
  assert.equal(INSTALLER_FILES.length, 4);
  const catchAll = new RegExp(`^/(?:${passthroughPattern(INSTALLER_FILES)})$`);
  for (const file of INSTALLER_FILES) {
    assert.ok(!(`/${file}` in AGRO_REDIRECTS), file);
    assert.ok(!catchAll.test(`/${file}`), file);
  }
  assert.ok(catchAll.test("/some/old/page"));
  assert.ok(catchAll.test(`/${INSTALLER_FILES[0]}.bak`));
});
