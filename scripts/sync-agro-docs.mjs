import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { REPO, MirrorError, get, reportAndExit, resolveReleaseTag } from "./oh-source.mjs";

const TAG = "sync-agro-docs";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DEST = "content/docs/agro";
export const ROUTE = "/docs/agro";
export const ROOT_TITLE = "AGRO";
export const INDEX = "README.md";
const CATEGORY = "_category_.json";
const PAGE = /\.mdx?$/;

const FENCE = /^\s*(```|~~~)/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;

function mapOutsideFences(text, fn) {
  let inFence = false;
  return text
    .split("\n")
    .map((line) => {
      if (FENCE.test(line)) {
        inFence = !inFence;
        return line;
      }
      return inFence ? line : fn(line);
    })
    .join("\n");
}

function plainText(markdown) {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|\W)[*_](\S(?:.*?\S)?)[*_](?=\W|$)/g, "$1$2");
}

function firstHeading(text) {
  let inFence = false;
  for (const line of text.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    else if (!inFence) {
      const match = line.match(/^#\s+(.+?)\s*#*\s*$/);
      if (match) return plainText(match[1]);
    }
  }
  return null;
}

export function addTitleFrontmatter(text, fallback) {
  const frontmatter = text.match(FRONTMATTER);
  if (frontmatter && /^title\s*:/m.test(frontmatter[1])) return text;
  const title = firstHeading(frontmatter ? text.slice(frontmatter[0].length) : text) ?? fallback;
  if (!title) return text;
  const field = `title: ${JSON.stringify(title)}`;
  if (frontmatter) return text.replace(/^---\n/, `---\n${field}\n`);
  return `---\n${field}\n---\n\n${text}`;
}

function linkTarget(target, pagePath, tag) {
  if (!target || target.startsWith("#") || target.startsWith("/") || SCHEME.test(target)) return null;
  const [path, fragment = ""] = target.split(/(?=#)/);
  const resolved = posix.normalize(posix.join("docs", posix.dirname(pagePath), path));
  if (resolved.startsWith("..")) return null;
  if (resolved.startsWith("docs/")) {
    if (!PAGE.test(resolved)) return null;
    const slug = resolved.slice("docs/".length).replace(PAGE, "");
    return `${slug === "README" ? ROUTE : `${ROUTE}/${slug}`}${fragment}`;
  }
  if (resolved === "docs") return null;
  return `https://github.com/${REPO}/blob/${tag}/${resolved}${fragment}`;
}

export function rewriteLinks(text, pagePath, tag) {
  const swap = (whole, before, target, after) => {
    const url = linkTarget(target, pagePath, tag);
    return url ? `${before}${url}${after}` : whole;
  };
  return mapOutsideFences(text, (line) =>
    line
      .replace(/(\]\(\s*)([^\s)]+)((?:\s+"[^"]*")?\s*\))/g, swap)
      .replace(/^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/, swap),
  );
}

export function readmeOrder(readme) {
  const order = [];
  mapOutsideFences(readme, (line) => {
    for (const [, target] of line.matchAll(/\]\(\s*([^\s)#]+\.mdx?)(?:#[^\s)]*)?(?:\s+"[^"]*")?\s*\)/g)) {
      if (SCHEME.test(target) || target.startsWith("/")) continue;
      const path = posix.normalize(target);
      if (path.startsWith("..") || order.includes(path)) continue;
      order.push(path);
    }
    return line;
  });
  return order;
}

export function sidebarPosition(text) {
  const frontmatter = text.match(FRONTMATTER);
  const match = frontmatter?.[1].match(/^sidebar_position\s*:\s*(-?\d+(?:\.\d+)?)\s*$/m);
  return match ? Number(match[1]) : undefined;
}

export function transformPage(text, pagePath, tag) {
  const fallback = posix.basename(pagePath).replace(PAGE, "");
  return rewriteLinks(addTitleFrontmatter(text, fallback), pagePath, tag);
}

function byPosition(a, b) {
  const pa = a.position ?? Infinity;
  const pb = b.position ?? Infinity;
  if (pa !== pb) return pa < pb ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export function buildMeta({ title, root = false, category, entries }) {
  const sorted = [...entries].sort(byPosition).map((entry) => entry.name);
  const linked = category?.link?.type === "doc" ? posix.basename(category.link.id) : null;
  const pages = linked && sorted.includes(linked) ? [linked, ...sorted.filter((name) => name !== linked)] : sorted;
  const meta = { title: category?.label ?? title };
  if (root) meta.root = true;
  if (category?.collapsed === false) meta.defaultOpen = true;
  meta.pages = pages;
  return meta;
}

export function folderMetas(pages, categories, order) {
  const folders = new Map([["", []]]);
  const folderOf = (path) => (posix.dirname(path) === "." ? "" : posix.dirname(path));
  const ensure = (folder) => {
    if (folders.has(folder)) return;
    folders.set(folder, []);
    const parent = folderOf(folder);
    ensure(parent);
    folders.get(parent).push({ name: posix.basename(folder), folder });
  };
  for (const page of pages) {
    const folder = folderOf(page.path);
    ensure(folder);
    const readmeIndex = order.indexOf(page.path);
    folders.get(folder).push({
      name: posix.basename(page.path).replace(PAGE, ""),
      position: page.position ?? (readmeIndex < 0 ? undefined : readmeIndex),
    });
  }
  const metas = new Map();
  for (const [folder, children] of folders) {
    const entries = children.map((child) =>
      child.folder === undefined ? child : { name: child.name, position: categories.get(child.folder)?.position },
    );
    const meta = folder === ""
      ? buildMeta({ title: ROOT_TITLE, root: true, entries })
      : buildMeta({ title: posix.basename(folder), category: categories.get(folder), entries });
    metas.set(folder, meta);
  }
  return metas;
}

async function extractDocs(tag, fetchImpl, workDir) {
  const url = `https://github.com/${REPO}/archive/${tag}.tar.gz`;
  const res = await get(url, fetchImpl);
  if (!res.ok) throw new MirrorError(`${REPO}@${tag} has no source archive (${url} -> HTTP ${res.status})`);
  const archive = join(workDir, "source.tar.gz");
  await writeFile(archive, Buffer.from(await res.arrayBuffer()));
  const tar = spawnSync("tar", ["-xzf", archive, "-C", workDir], { encoding: "utf8" });
  if (tar.status !== 0) throw new MirrorError(`tar could not extract ${url}: ${tar.stderr || tar.error}`);
  const top = (await readdir(workDir, { withFileTypes: true })).find((e) => e.isDirectory());
  const docs = top && join(workDir, top.name, "docs");
  if (!docs || !existsSync(docs)) throw new MirrorError(`${url} holds no docs/ directory`);
  return { url, docs };
}

export async function transformDocs(docs, tag) {
  const index = join(docs, INDEX);
  const order = existsSync(index) ? readmeOrder(await readFile(index, "utf8")) : [];
  await rm(index, { force: true });
  const files = (await readdir(docs, { recursive: true })).map((f) => f.split(sep).join("/"));
  const pages = [];
  for (const file of files.filter((f) => PAGE.test(f))) {
    const full = join(docs, file);
    const text = await readFile(full, "utf8");
    pages.push({ path: file, position: sidebarPosition(text) });
    await writeFile(full, transformPage(text, file, tag));
  }
  const categories = new Map();
  for (const file of files.filter((f) => posix.basename(f) === CATEGORY)) {
    const full = join(docs, file);
    categories.set(posix.dirname(file), JSON.parse(await readFile(full, "utf8")));
    await rm(full);
  }
  for (const [folder, meta] of folderMetas(pages, categories, order)) {
    await writeFile(join(docs, folder, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  }
  return pages.map((page) => page.path);
}

export async function syncAgroDocs({
  fetchImpl = globalThis.fetch.bind(globalThis),
  destRoot = ROOT,
  resolve: resolveTag = resolveReleaseTag,
} = {}) {
  const tag = await resolveTag();
  const workDir = await mkdtemp(join(tmpdir(), "agro-docs-"));
  try {
    const { url, docs } = await extractDocs(tag, fetchImpl, workDir);
    const pages = await transformDocs(docs, tag);
    const out = join(destRoot, DEST);
    await rm(out, { recursive: true, force: true });
    await cp(docs, out, { recursive: true });
    console.log(`[${TAG}] wrote ${DEST}/ <- ${url} (${REPO}@${tag}, ${pages.length} pages)`);
    return { tag, url, pages };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

const invokedDirectly =
  Boolean(process.argv[1]) &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedDirectly) {
  try {
    await syncAgroDocs();
  } catch (err) {
    reportAndExit(TAG, err, [join(ROOT, DEST)]);
  }
}
