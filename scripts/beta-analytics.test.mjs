import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);

test("root layout never imports or mounts Google Analytics", () => {
  assert.doesNotMatch(layout, /GoogleAnalytics|@next\/third-parties\/google/);
});

test("root layout never imports or mounts initial active-user tracking", () => {
  assert.doesNotMatch(layout, /InitialLoadActiveUsers/);
});

test("analytics stays disabled regardless of runtime mode or GA identifier", () => {
  assert.doesNotMatch(layout, /\b(?:GA_ID|NODE_ENV)\b|NEXT_PUBLIC_GA_ID/);
  assert.match(layout, /import \{ SITE_URL \} from "@\/config\/app";/);
});

test("root layout retains font imports, metadata, viewport, and site URL", () => {
  for (const font of ["Montserrat", "Space_Grotesk"]) {
    assert.match(
      layout,
      new RegExp(
        `import\\s*\\{[^}]*\\b${font}\\b[^}]*\\}\\s*from\\s*["']next/font/google["']`,
      ),
    );
  }
  assert.match(layout, /export\s+const\s+metadata\b/);
  assert.match(layout, /export\s+const\s+viewport\b/);
  assert.match(layout, /metadataBase\s*:\s*new\s+URL\s*\(\s*SITE_URL\s*\)/);
});

test("root layout retains structured data, theme provider, and children", () => {
  assert.match(layout, /<JsonLd\b/);
  assert.match(layout, /<ThemeProvider\b/);
  assert.match(layout, /<\/ThemeProvider\s*>/);
  assert.match(layout, /\{\s*children\s*\}/);
});
