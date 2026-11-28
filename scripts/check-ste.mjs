import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { get, MirrorError, REPO, resolveReleaseTag } from "./oh-source.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROSE = /\.mdx?$/;
export const SCANNED = ["posts", "content/docs"];
export const SKIPPED = ["content/docs/agro"];

export function steCheckUrl(tag) {
  return `https://raw.githubusercontent.com/${REPO}/${tag}/.agro/skills/ste/scripts/ste-check.sh`;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const under = (rel, dir) => rel === dir || rel.startsWith(dir + "/");

export function proseFiles(root = ROOT) {
  return SCANNED.flatMap((dir) => walk(join(root, dir)))
    .map((path) => relative(root, path))
    .filter((rel) => PROSE.test(rel) && !SKIPPED.some((dir) => under(rel, dir)))
    .sort();
}

export async function fetchSteCheck(tag, fetchImpl = globalThis.fetch.bind(globalThis)) {
  const url = steCheckUrl(tag);
  const res = await get(url, fetchImpl);
  if (!res.ok) throw new MirrorError(`${REPO}@${tag} has no STE checker (${url} -> HTTP ${res.status})`);
  return { url, body: await res.text() };
}

const invokedDirectly =
  Boolean(process.argv[1]) &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedDirectly) {
  const workDir = mkdtempSync(join(tmpdir(), "website-ste-"));
  let checker;
  try {
    const tag = await resolveReleaseTag();
    const { url, body } = await fetchSteCheck(tag);
    checker = join(workDir, "ste-check.sh");
    writeFileSync(checker, body);
    console.log(`[ste] ${url}`);
  } catch (err) {
    console.error(`[ste] FATAL: ${err.message}`);
    process.exit(1);
  }
  const files = proseFiles();
  console.log(`[ste] ${files.length} file(s) under ${SCANNED.map((d) => `${d}/`).join(", ")} (skipping ${SKIPPED.map((d) => `${d}/`).join(", ")})`);
  const run = spawnSync("bash", [checker, ...files], { cwd: ROOT, stdio: "inherit" });
  process.exit(run.status ?? 1);
}
