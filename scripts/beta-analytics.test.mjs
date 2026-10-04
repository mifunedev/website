import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);

const rootLayout = `export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={\`\${montserrat.variable} \${spaceGrotesk.variable}\`}
      suppressHydrationWarning
    >
      <body className="font-montserrat">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

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

test("fonts, marketing metadata, and viewport remain unchanged", () => {
  const preserved = layout.slice(
    layout.indexOf("const montserrat ="),
    layout.indexOf("export default function RootLayout"),
  );
  assert.equal(
    createHash("sha256").update(preserved).digest("hex"),
    "ec85b1114e8bf70669728a56bb1c21bb2b138f90403efc39f5e6b16b2a73e52f",
  );
});

test("root layout preserves SEO, theme, fonts, and child rendering", () => {
  assert.equal(
    layout.slice(layout.indexOf("export default function RootLayout")),
    rootLayout,
  );
});
