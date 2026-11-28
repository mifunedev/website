#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  cloudNodePlans,
  countWord,
  DISK_SIZE_STEP_GB,
  DISPOSABLE_BOOT_STORAGE_HOURLY_USD,
  emptyFleet,
  EXTRA_DISK_USD_PER_GB_MONTH,
  fleetTotalUsd,
  formatHourlyUsd,
  formatPausedMonthlyList,
  formatSpecList,
  formatUsdTotal,
  FREE_PAUSED_DAYS,
  FREE_TIER_NODE_COUNT,
  FREE_TIER_NODE_SPECS,
  FREE_TIER_PAUSED_RETENTION_DAYS,
  FREE_TIER_RUNNING_HOURS_PER_MONTH,
  fullHourUsd,
  GRACE_WINDOW_HOURS,
  HOURS_PER_MONTH,
  LOW_BALANCE_WARNING_HOURS,
  MAX_DISK_GB,
  MINIMUM_BILLED_SECONDS,
  NODE_LIMIT_SUPPORT_EMAIL,
  PAID_NODE_LIMIT_PER_ORG,
  PAUSED_DISK_USD_PER_GB_MONTH,
  TOP_UP_AMOUNTS_USD,
} from "../src/config/cloud-pricing.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const HOURLY_RATES = cloudNodePlans
  .map(
    (plan) =>
      `- ${plan.label} (${plan.vcpu} vCPU / ${plan.ramGb} GB RAM / ${plan.diskGb} GB SSD): compute ${formatHourlyUsd(plan.computeHourlyUsd)} per hour, storage ${formatHourlyUsd(plan.storageHourlyUsd)} per started hour, ${formatHourlyUsd(fullHourUsd(plan))} per full running hour`,
  )
  .join("\n");

const TOP_UP_AMOUNTS = `${TOP_UP_AMOUNTS_USD.slice(0, -1).join(", ")}, or ${TOP_UP_AMOUNTS_USD[TOP_UP_AMOUNTS_USD.length - 1]} USD`;

const MONTHLY_ESTIMATES = cloudNodePlans
  .map(
    (plan) =>
      `- ${plan.label}: about ${formatUsdTotal(
        fleetTotalUsd({ ...emptyFleet(), [plan.spec]: 1 }, HOURS_PER_MONTH),
      )} for ${HOURS_PER_MONTH} running hours — an estimate from the hourly rate, not a monthly plan`,
  )
  .join("\n");

const LLM_TXT_CONTENT = `# Mifune — AGRO workspaces for coding agents

> A portable home for autonomous coding agents.

## Category and value

AGRO is coding-agent workspace infrastructure: one repository connects to an isolated, persistent workspace for its coding agents. It keeps project toolchains off the host. Workspaces run on a laptop, a remote VM, or a Mifune Console node; Docker is one supported runtime.

Bring your preferred coding agent. AGRO supports Claude Code, Codex, Pi, OpenCode, Hermes, OpenClaw, Grok Build, Muse Code, Antigravity CLI, and fx, and two or more can run side by side in one workspace. On a VM, agents can work unattended or on schedules and can be reachable over Slack. Isolated git worktrees support parallel branches and delegation.

Grounded outcomes:

- Isolate each project in its own workspace.
- Keep project toolchains off the host or laptop.
- Run the workspace locally or on a remote VM.
- Separate parallel branches with isolated git worktrees.

## Vendor

Mifune maintains the Apache-2.0 licensed open-source AGRO project, operates the Mifune Console as the managed path, and offers forward-deployed engineering support to Console customers.

## Offering hierarchy

### 1. Mifune Console — recommended managed path

The Mifune Console gives coding agents an isolated, persistent workspace while Mifune operates the managed environment.

- Mifune Console: https://console.mifune.dev
- Pricing: https://mifune.dev/pricing

Nodes run from prepaid credit, each on a dedicated VM rather than shared infrastructure. Compute bills per second, with a minimum of ${MINIMUM_BILLED_SECONDS} seconds for each run. Storage for the node volumes bills for each started clock hour while the node runs. Queued, building, and failed time is free. The storage price covers the included data disk of each size. A larger data disk comes in steps of ${DISK_SIZE_STEP_GB} GB, up to ${MAX_DISK_GB} GB. Extra disk costs ${EXTRA_DISK_USD_PER_GB_MONTH.toFixed(2)} USD per GB-month, billed for each started hour while the node runs, on every node with a data volume; on a free node, the included disk stays free and extra disk bills from prepaid credit. Credit comes in top-ups of ${TOP_UP_AMOUNTS}, with an optional automatic top-up in the same amounts. When the balance covers less than ${LOW_BALANCE_WARNING_HOURS} hours of spend, the org admins get an email; a negative balance starts a ${GRACE_WINDOW_HOURS}-hour grace window, and running paid nodes pause at its end. Pausing a node stops the running charge and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. Each paid node gets ${FREE_PAUSED_DAYS} free paused days per UTC calendar month, summed across all its pauses that month; a new pause does not restart the free days. After the free days, a paused paid node pays ${PAUSED_DISK_USD_PER_GB_MONTH.toFixed(2)} USD per GB-month for its whole disk, prorated per second, until it is resumed or destroyed; each billable paused second bills once. With the included disk, the paused price is ${formatPausedMonthlyList()}. A disposable hand costs less: it has no data volume, so it pays only a boot storage fee of about ${DISPOSABLE_BOOT_STORAGE_HOURLY_USD.toFixed(3)} USD for each started hour on top of compute. A disposable hand cannot pause or fork, and the Console deletes it at the end of the grace window or when the free allowance runs out. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.

Hourly rates: compute bills per second with a ${MINIMUM_BILLED_SECONDS}-second minimum for each run, and storage bills for each started clock hour while the node runs:

${HOURLY_RATES}

A personal free tier gives ${countWord(FREE_TIER_NODE_COUNT)} ${formatSpecList(FREE_TIER_NODE_SPECS)} nodes that share ${FREE_TIER_RUNNING_HOURS_PER_MONTH} running hours per UTC month, with no card; the nodes auto-pause at the limit and each workspace is kept ${FREE_TIER_PAUSED_RETENTION_DAYS} days after each pause. Free spots are limited, and a paid node runs from prepaid credit. There is no monthly plan.

Each org can run ${PAID_NODE_LIMIT_PER_ORG} paid nodes by default. To request more, email ${NODE_LIMIT_SUPPORT_EMAIL}. The free-tier limits are separate.

A node left running for a whole month pays compute for ${HOURS_PER_MONTH} hours and storage for ${HOURS_PER_MONTH} started hours at the rates above, which works out to:

${MONTHLY_ESTIMATES}

Those are arithmetic on the hourly rate for a node that never stops; a node that runs only on weekdays costs proportionally less, and there is no monthly plan to buy at any usage.

### 2. AGRO Open Source — self-hosted path

The Apache-2.0 licensed project is for teams that want to inspect, adapt, and operate AGRO themselves, locally or on a remote VM.

- GitHub: https://github.com/mifunedev/agro
- Documentation: https://mifune.dev/docs/agro/intro

### 3. Forward-Deployed Engineering Support — optional for Console customers

Mifune engineers can work alongside a Console customer's team to plan, implement, integrate, troubleshoot, and hand off a Mifune Console deployment. An established deployment is not required before discussing a scope.

- Support: https://mifune.dev/services
- Contact: hello@mifune.dev

## Website

- Homepage: https://mifune.dev
- Pricing: https://mifune.dev/pricing
- Documentation: https://mifune.dev/docs
- AGRO documentation: https://mifune.dev/docs/agro/intro
- Blog: https://mifune.dev/blog
`;

function generateLlmTxt() {
  const outputPath = path.join(rootDir, "public", "llm.txt");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, LLM_TXT_CONTENT, "utf-8");
  console.log(`Generated llm.txt at ${outputPath}`);
}

generateLlmTxt();
