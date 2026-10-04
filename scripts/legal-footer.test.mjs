import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as offerings from "../src/config/offerings.ts";

const footer = await readFile(
  new URL("../src/sections/FooterSection.tsx", import.meta.url),
  "utf8",
);
const legalNav = footer.match(
  /<nav\b[^>]*aria-label="Legal drafts"[^>]*>([\s\S]*?)<\/nav>/,
)?.[1];

const expectedPolicies = [
  { slug: "terms", label: "Terms (DRAFT)" },
  { slug: "privacy", label: "Privacy (DRAFT)" },
  { slug: "refunds", label: "Refunds (DRAFT)" },
  { slug: "acceptable-use", label: "Acceptable use (DRAFT)" },
];

test("the footer offers exactly the four known console policy destinations", () => {
  assert.ok(offerings.legalDraftLinks, "Export the draft policy links");
  assert.deepEqual(
    offerings.legalDraftLinks.map(({ slug }) =>
      new URL(`/legal/${slug}`, offerings.OFFERING_URLS.cloud).toString(),
    ),
    [
      "https://console.mifune.dev/legal/terms",
      "https://console.mifune.dev/legal/privacy",
      "https://console.mifune.dev/legal/refunds",
      "https://console.mifune.dev/legal/acceptable-use",
    ],
  );
});

test("each policy has a visible DRAFT label", () => {
  assert.deepEqual(offerings.legalDraftLinks, expectedPolicies);
  assert.ok(legalNav, "Render a named Legal drafts navigation landmark");
  assert.match(legalNav, />\s*\{label\}\s*<\/a>/);
  assert.doesNotMatch(legalNav, /sr-only|aria-hidden|hidden/);
});

test("the footer builds policy links from the canonical cloud origin", () => {
  assert.ok(legalNav, "Render a named Legal drafts navigation landmark");
  assert.match(
    footer,
    /import\s*\{[^}]*legalDraftLinks[^}]*OFFERING_URLS[^}]*\}\s*from\s*["']@\/config\/offerings["']/,
  );
  assert.match(legalNav, /legalDraftLinks\.map\(\(\{\s*slug,\s*label\s*\}\)/);
  assert.match(
    legalNav,
    /href=\{`\$\{OFFERING_URLS\.cloud\}\/legal\/\$\{slug\}`\}/,
  );
  assert.doesNotMatch(legalNav, /https?:\/\/|process\.env/);
});

test("legal navigation uses a list of native same-tab links", () => {
  assert.ok(legalNav, "Render a named Legal drafts navigation landmark");
  assert.match(
    legalNav,
    /<ul\b[\s\S]*<li\b[\s\S]*<a\b[\s\S]*<\/a>[\s\S]*<\/li>[\s\S]*<\/ul>/,
  );
  assert.match(legalNav, /<li\s+key=\{slug\}/);
  assert.doesNotMatch(legalNav, /target=|onClick=|tabIndex=|role="button"/);
});

test("legal links reuse the footer keyboard focus and touch target styles", () => {
  assert.ok(legalNav, "Render a named Legal drafts navigation landmark");
  assert.match(legalNav, /className=\{footerLinkClass\}/);
  const linkClass = footer.match(/const footerLinkClass\s*=\s*"([^"]+)";/)?.[1];
  assert.ok(linkClass, "Keep the shared footer link styles");
  assert.match(linkClass, /\bmin-h-11\b/);
  assert.match(linkClass, /\bfocus-visible:ring-2\b/);
  assert.match(linkClass, /\bfocus-visible:ring-oh-focus\b/);
});

test("the legal list wraps at narrow viewport widths", () => {
  assert.ok(legalNav, "Render a named Legal drafts navigation landmark");
  const listClass = legalNav.match(/<ul\s+className="([^"]+)"/)?.[1];
  assert.ok(listClass, "Style the legal navigation list");
  assert.match(listClass, /\bflex\b/);
  assert.match(listClass, /\bflex-wrap\b/);
});
