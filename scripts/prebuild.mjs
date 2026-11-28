import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { reportAndExit, resolveReleaseTag } from "./oh-source.mjs";
import { DEST } from "./sync-agro-docs.mjs";
import { INSTALLER } from "./sync-external-scripts.mjs";
import { DESTS } from "./build-oh-cli.mjs";

const TAG = "prebuild";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STEPS = [
  "generate-llm-txt.mjs",
  "sync-agro-docs.mjs",
  "sync-external-scripts.mjs",
  "build-oh-cli.mjs",
];
const ARTIFACTS = [join(ROOT, DEST), ...INSTALLER.dests.map((dest) => join(ROOT, dest)), ...DESTS];

const runNode = (script, env) =>
  spawnSync(process.execPath, [join(ROOT, "scripts", script)], { cwd: ROOT, env, stdio: "inherit" }).status;

export async function prebuild({
  resolve: resolveTag = resolveReleaseTag,
  run = runNode,
  env = process.env,
  onResolveError = (err) => reportAndExit(TAG, err, ARTIFACTS),
} = {}) {
  let stepEnv = env;
  try {
    const tag = await resolveTag();
    console.log(`[${TAG}] pinned AGRO_SCRIPTS_REF=${tag}`);
    stepEnv = { ...env, AGRO_SCRIPTS_REF: tag };
  } catch (err) {
    onResolveError(err);
  }
  for (const step of STEPS) {
    const status = run(step, stepEnv);
    if (status !== 0) return { failed: step, status: status ?? 1 };
  }
  return { failed: null, status: 0 };
}

const invokedDirectly =
  Boolean(process.argv[1]) &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedDirectly) {
  const { failed, status } = await prebuild();
  if (failed) {
    console.error(`[${TAG}] FATAL: ${failed} exited with status ${status}`);
    process.exit(status);
  }
}
