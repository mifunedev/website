#!/usr/bin/env node
/**
 * Generates public/llm.txt. Run by `prebuild`, so `npm run build` refreshes it.
 *
 * Prices are imported from src/config/cloud-pricing.ts — the single source of
 * every published price — rather than re-hardcoded here, so llm.txt cannot
 * drift from the site. That import is a TypeScript module loaded by plain
 * `node`, which relies on Node's built-in type stripping: unflagged from
 * v22.18.0 and v23.6.0. On an older runtime this script fails loudly with
 * ERR_UNKNOWN_FILE_EXTENSION rather than emitting a stale file.
 *
 * The build runtime is pinned by `.nvmrc` at the repo root. That file is what
 * actually selects the version — `engines.node` in package.json does NOT:
 * Netlify chooses from `.nvmrc` / `.node-version` / `NODE_VERSION`, each of
 * which overrides the version the site is pinned to in the UI, while npm only
 * *warns* (EBADENGINE) when the running Node disagrees with `engines`. Relying
 * on `engines` alone broke a deploy: the build ran on the image default (Node
 * 18.20.8), warned, and then died here. `engines` stays as the declaration of
 * what the repo needs; `.nvmrc` is the enforcement.
 *
 * Node also logs a MODULE_TYPELESS_PACKAGE_JSON warning for the .ts import
 * (this package is CommonJS-by-default and Next.js requires it to stay that
 * way). It is informational and does not affect the output.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  cloudNodePlans,
  emptyFleet,
  fleetTotalUsd,
  formatHourlyUsd,
  formatUsdTotal,
  HOURS_PER_MONTH,
} from "../src/config/cloud-pricing.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const HOURLY_RATES = cloudNodePlans
  .map(
    (plan) =>
      `- ${plan.label} (${plan.vcpu} vCPU / ${plan.ramGb} GB RAM / ${plan.diskGb} GB SSD): ${formatHourlyUsd(plan.hourlyUsd)}`,
  )
  .join("\n");

/**
 * Monthly figures, computed from the hourly rates above rather than written
 * down. Each line carries "not a monthly plan" on the line itself, not in a
 * heading above the list: this file exists to be quoted by language models,
 * and a model quoting one bullet must not be able to drop the qualifier.
 */
const MONTHLY_ESTIMATES = cloudNodePlans
  .map(
    (plan) =>
      `- ${plan.label}: about ${formatUsdTotal(
        fleetTotalUsd({ ...emptyFleet(), [plan.spec]: 1 }, HOURS_PER_MONTH),
      )} for ${HOURS_PER_MONTH} running hours — an estimate from the hourly rate, not a monthly plan`,
  )
  .join("\n");

const LLM_TXT_CONTENT = `# Mifune — Open Harness workspaces for coding agents

> Run coding agents in a sandbox, not on your machine.

## Category and value

Open Harness is coding-agent workspace infrastructure: one repository connects to an isolated, persistent Docker workspace for its coding agents. It keeps project toolchains off the host and runs locally or on a remote VM.

Bring your preferred coding agent. Open Harness supports Claude Code, Codex, Pi, and other opt-in agent CLIs. On a VM, agents can work unattended or on schedules and can be reachable over Slack. Isolated git worktrees support parallel branches and delegation.

Grounded outcomes:

- Isolate each project in its own sandbox.
- Keep project toolchains off the host or laptop.
- Run the workspace locally or on a remote VM.
- Separate parallel branches with isolated git worktrees.

## Vendor

Mifune maintains the Apache-2.0 licensed open-source Open Harness project, operates Open Harness Cloud as the managed path, and offers forward-deployed engineering support to Cloud customers.

## Offering hierarchy

### 1. Open Harness Cloud — recommended managed path

Open Harness Cloud gives coding agents an isolated, persistent workspace while Mifune operates the managed environment.

- Cloud Console: https://console.mifune.dev
- Pricing: https://mifune.dev/pricing

Nodes are billed by the hour they run, each on a dedicated VM rather than shared infrastructure. Only whole running UTC hours meter; queued, building, and failed time is free; destroying a node is how you stop paying for it. AI usage is not included: you sign in to Claude, Pi, or another opt-in agent CLI inside the workspace with your own account and pay that provider directly.

Hourly rates, per whole hour a node is running:

${HOURLY_RATES}

There is no monthly plan, no free tier, and no trial. Signing in is free; a card is required before the first node.

A node left running for a whole month is billed as ${HOURS_PER_MONTH} whole hours at the rate above, which works out to:

${MONTHLY_ESTIMATES}

Those are arithmetic on the hourly rate for a node that never stops; a node that runs only on weekdays costs proportionally less, and there is no monthly plan to buy at any usage.

### 2. Open Harness Open Source — self-hosted path

The Apache-2.0 licensed project is for teams that want to inspect, adapt, and operate Open Harness themselves, locally or on a remote VM.

- GitHub: https://github.com/mifunedev/openharness
- Documentation: https://oh.mifune.dev

### 3. Forward-Deployed Engineering Support — optional for Cloud customers

Mifune engineers can work alongside a Cloud customer's team to plan, implement, integrate, troubleshoot, and hand off an Open Harness Cloud deployment. An established deployment is not required before discussing a scope.

- Support: https://mifune.dev/services
- Contact: hello@mifune.dev

## Website

- Homepage: https://mifune.dev
- Pricing: https://mifune.dev/pricing
- Open Harness documentation: https://oh.mifune.dev
- Blog: https://mifune.dev/blog
`;

function generateLlmTxt() {
  const outputPath = path.join(rootDir, "public", "llm.txt");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, LLM_TXT_CONTENT, "utf-8");
  console.log(`Generated llm.txt at ${outputPath}`);
}

generateLlmTxt();
