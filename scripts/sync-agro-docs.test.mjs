import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  addTitleFrontmatter,
  buildMeta,
  readmeOrder,
  rewriteLinks,
  sidebarPosition,
  transformDocs,
  transformPage,
} from "./sync-agro-docs.mjs";

const TAG = "v0.18.1";
const BLOB = `https://github.com/mifunedev/agro/blob/${TAG}`;

test("a page without frontmatter gets a title from its first # heading", () => {
  const out = addTitleFrontmatter("Intro text.\n\n# AGRO \"docs\"\n\n## Later\n");
  assert.equal(out, '---\ntitle: "AGRO \\"docs\\""\n---\n\nIntro text.\n\n# AGRO "docs"\n\n## Later\n');
});

test("a page with frontmatter but no title gets a title field", () => {
  const out = addTitleFrontmatter("---\nsidebar_position: 2\n---\n\n# Configuration\n");
  assert.equal(out, '---\ntitle: "Configuration"\nsidebar_position: 2\n---\n\n# Configuration\n');
});

test("a page that already has a title is unchanged", () => {
  const page = '---\ntitle: "Introduction"\n---\n\n# AGRO\n';
  assert.equal(addTitleFrontmatter(page), page);
});

test("a # line inside a fenced code block is not a heading", () => {
  const out = addTitleFrontmatter("```bash\n# comment\n```\n\n# Real title\n");
  assert.match(out, /^---\ntitle: "Real title"\n---\n/);
});

test("a page with no # heading takes the fallback title, or stays unchanged without one", () => {
  assert.equal(addTitleFrontmatter("## Only h2\n"), "## Only h2\n");
  assert.equal(addTitleFrontmatter("## Only h2\n", "notes"), '---\ntitle: "notes"\n---\n\n## Only h2\n');
});

test("a generated title drops inline Markdown and keeps the text", () => {
  const title = (heading) => addTitleFrontmatter(`# ${heading}\n`).match(/^title: (.*)$/m)[1];
  assert.equal(title("Creating a sandbox: `agro sandbox install docker`"), '"Creating a sandbox: agro sandbox install docker"');
  assert.equal(title("`.agro/` directory layout"), '".agro/ directory layout"');
  assert.equal(title("**Bold** and __strong__ and *em* and _under_ text"), '"Bold and strong and em and under text"');
  assert.equal(title("See [the guide](./guide.md) now"), '"See the guide now"');
  assert.equal(title("Keep snake_case_name"), '"Keep snake_case_name"');
});

test("a relative page link becomes a /docs/agro route without the .md suffix", () => {
  const page = "[a](../connecting.md) [b](./pi.md#x) [c](codex.mdx) [d](../README.md)\n";
  assert.equal(
    rewriteLinks(page, "harnesses/pi.md", TAG),
    "[a](/docs/agro/connecting) [b](/docs/agro/harnesses/pi#x) [c](/docs/agro/harnesses/codex) [d](/docs/agro)\n",
  );
  assert.equal(
    rewriteLinks("[h](./integrations/herdr.md#install)", "quickstart.md", TAG),
    "[h](/docs/agro/integrations/herdr#install)",
  );
});

test("a relative link that leaves docs/ becomes a blob URL at the tag", () => {
  const page = "See [hook](../../.pi/UPSTREAM.md#top).\n";
  assert.equal(rewriteLinks(page, "integrations/slack.md", TAG), `See [hook](${BLOB}/.pi/UPSTREAM.md#top).\n`);
  assert.equal(rewriteLinks("[l](../LICENSE)", "intro.md", TAG), `[l](${BLOB}/LICENSE)`);
});

test("images, absolute links, schemes, and anchors are unchanged", () => {
  const page = "![i](img/a.png) ![j](../img/b.png) [c](https://x.dev/a.md) [d](#here) [e](/docs/x.md) [f](mailto:a@b.c)\n";
  assert.equal(rewriteLinks(page, "harnesses/pi.md", TAG), page);
});

test("reference-style definitions and link titles are rewritten", () => {
  const page = '[x]: ../agro.json\n[y](../.agro/hooks/ "Hooks")\n[z]: ./quickstart.md#top\n';
  assert.equal(
    rewriteLinks(page, "security-considerations.md", TAG),
    `[x]: ${BLOB}/agro.json\n[y](${BLOB}/.agro/hooks/ "Hooks")\n[z]: /docs/agro/quickstart#top\n`,
  );
});

test("links inside fenced code blocks are unchanged", () => {
  const page = "```md\n[l](../LICENSE)\n[q](quickstart.md)\n```\n";
  assert.equal(rewriteLinks(page, "intro.md", TAG), page);
});

test("transformPage adds a title and rewrites links", () => {
  const out = transformPage("# Security\n\n[e](../.example.env) [q](quickstart.md)\n", "security-considerations.md", TAG);
  assert.equal(out, `---\ntitle: "Security"\n---\n\n# Security\n\n[e](${BLOB}/.example.env) [q](/docs/agro/quickstart)\n`);
});

test("readmeOrder lists relative .md links in order, first occurrence wins", () => {
  const readme = [
    "- [Intro](intro.md)",
    "- [Quick](./quickstart.md#top) · [Intro again](intro.md)",
    "- [Out](../.agro/x.md) [Web](https://x.dev/a.md) [Abs](/docs/a.md) [Img](logo.png)",
    "```md",
    "[Fenced](fenced.md)",
    "```",
    "- [Codex](harnesses/codex.md \"Codex\")",
  ].join("\n");
  assert.deepEqual(readmeOrder(readme), ["intro.md", "quickstart.md", "harnesses/codex.md"]);
});

test("sidebarPosition reads the frontmatter field only", () => {
  assert.equal(sidebarPosition("---\ntitle: x\nsidebar_position: 7\n---\n\n# X\n"), 7);
  assert.equal(sidebarPosition("# X\n\nsidebar_position: 3\n"), undefined);
});

test("buildMeta takes the category label, puts the linked doc first, and orders by position", () => {
  const meta = buildMeta({
    title: "harnesses",
    category: { label: "Harnesses", position: 9, collapsed: true, link: { type: "doc", id: "harnesses/overview" } },
    entries: [
      { name: "pi", position: 3 },
      { name: "zeta" },
      { name: "codex", position: 2 },
      { name: "overview", position: 5 },
      { name: "alpha" },
    ],
  });
  assert.deepEqual(meta, { title: "Harnesses", pages: ["overview", "codex", "pi", "alpha", "zeta"] });
  assert.deepEqual(buildMeta({ title: "AGRO", root: true, entries: [] }), { title: "AGRO", root: true, pages: [] });
  assert.equal(buildMeta({ title: "x", category: { collapsed: false }, entries: [] }).defaultOpen, true);
});

test("transformDocs converts _category_.json to meta.json and drops README.md", async () => {
  const docs = await mkdtemp(join(tmpdir(), "sync-agro-docs-test-"));
  try {
    await mkdir(join(docs, "harnesses"));
    await mkdir(join(docs, "integrations"));
    await mkdir(join(docs, "img"));
    const files = {
      "README.md": "- [Intro](intro.md)\n- [Quick](quickstart.md)\n- [Over](harnesses/overview.md) [Pi](harnesses/pi.md)\n- [Contrib](contributing.md)\n",
      "intro.md": "# Intro\n\nSee [quick](quickstart.md).\n",
      "quickstart.md": "# Quickstart\n",
      "contributing.md": "# Contributing\n",
      "extra.md": "---\nsidebar_position: 1.5\n---\n\n# Extra\n",
      "harnesses/_category_.json": JSON.stringify({ label: "Harnesses", position: 2, link: { type: "doc", id: "harnesses/overview" } }),
      "harnesses/pi.md": "# Pi\n",
      "harnesses/overview.md": "# Harnesses Overview\n\n[Pi](pi.md)\n",
      "integrations/_category_.json": JSON.stringify({ label: "Integrations", position: 50 }),
      "integrations/slack.md": "# Slack\n",
      "img/a.png": "png",
    };
    for (const [path, body] of Object.entries(files)) await writeFile(join(docs, path), body);

    const pages = await transformDocs(docs, TAG);
    const read = async (path) => readFile(join(docs, path), "utf8");
    const meta = async (path) => JSON.parse(await read(path));

    assert.equal(pages.length, 7);
    assert.equal(existsSync(join(docs, "README.md")), false);
    assert.equal(existsSync(join(docs, "harnesses/_category_.json")), false);
    assert.equal(existsSync(join(docs, "img/meta.json")), false);
    assert.deepEqual(await meta("meta.json"), {
      title: "AGRO",
      root: true,
      pages: ["intro", "quickstart", "extra", "harnesses", "contributing", "integrations"],
    });
    assert.deepEqual(await meta("harnesses/meta.json"), { title: "Harnesses", pages: ["overview", "pi"] });
    assert.deepEqual(await meta("integrations/meta.json"), { title: "Integrations", pages: ["slack"] });
    assert.equal(await read("intro.md"), '---\ntitle: "Intro"\n---\n\n# Intro\n\nSee [quick](/docs/agro/quickstart).\n');
    assert.match(await read("harnesses/overview.md"), /\[Pi\]\(\/docs\/agro\/harnesses\/pi\)/);
  } finally {
    await rm(docs, { recursive: true, force: true });
  }
});
