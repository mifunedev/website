import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { fetchSteCheck, proseFiles, steCheckUrl } from "./check-ste.mjs";
import { resolveReleaseTag } from "./oh-source.mjs";

test("the STE checker URL pins the release tag", () => {
  assert.equal(
    steCheckUrl("v0.18.1"),
    "https://raw.githubusercontent.com/mifunedev/agro/v0.18.1/.agro/skills/ste/scripts/ste-check.sh",
  );
});

test("the STE checker comes from the release tag that the docs sync resolves", async () => {
  const tag = await resolveReleaseTag({ ref: "v0.41.0" });
  const requested = [];
  const fetchImpl = async (url) => {
    requested.push(url);
    return new Response("#!/usr/bin/env bash\n", { status: 200 });
  };
  const { url } = await fetchSteCheck(tag, fetchImpl);
  assert.deepEqual(requested, [steCheckUrl("v0.41.0")]);
  assert.equal(url, steCheckUrl("v0.41.0"));
});

test("a release without the STE checker fails", async () => {
  const fetchImpl = async () => new Response("", { status: 404 });
  await assert.rejects(fetchSteCheck("v0.1.0", fetchImpl), /has no STE checker/);
});

test("the prose set holds the posts and content/docs and skips content/docs/agro", () => {
  const root = mkdtempSync(join(tmpdir(), "website-ste-test-"));
  for (const rel of [
    "posts/first.md",
    "content/docs/index.md",
    "content/docs/console/nodes.mdx",
    "content/docs/meta.json",
    "content/docs/agro/quickstart.md",
    "src/app/page.tsx",
  ]) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), "text\n");
  }
  assert.deepEqual(proseFiles(root), [
    "content/docs/console/nodes.mdx",
    "content/docs/index.md",
    "posts/first.md",
  ]);
});

test("the repository prose set holds every post and the hand-written docs", () => {
  const files = proseFiles();
  assert.ok(files.includes("content/docs/open-core.md"));
  assert.ok(files.includes("content/docs/console/getting-started.md"));
  assert.ok(files.includes("posts/byoh.md"));
  assert.equal(files.filter((f) => f.startsWith("content/docs/agro/")).length, 0);
});
