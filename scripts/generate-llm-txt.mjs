#!/usr/bin/env node
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

AGRO is coding-agent workspace infrastructure: one repository connects to an isolated, persistent Docker workspace for its coding agents. It keeps project toolchains off the host and runs locally or on a remote VM.

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

Nodes are billed by the hour they run, each on a dedicated VM rather than shared infrastructure. Only whole running UTC hours meter; queued, building, and failed time is free. Pausing a node stops billing and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.

Hourly rates, per whole hour a node is running:

${HOURLY_RATES}

A personal free tier gives up to three n4 nodes that share 24 running hours per UTC month, with no card; the nodes auto-pause at the limit and each workspace is kept 60 days after each pause. Free spots are limited, and a paid node needs a card. There is no monthly plan.

A node left running for a whole month is billed as ${HOURS_PER_MONTH} whole hours at the rate above, which works out to:

${MONTHLY_ESTIMATES}

Those are arithmetic on the hourly rate for a node that never stops; a node that runs only on weekdays costs proportionally less, and there is no monthly plan to buy at any usage.

### 2. AGRO Open Source — self-hosted path

The Apache-2.0 licensed project is for teams that want to inspect, adapt, and operate AGRO themselves, locally or on a remote VM.

- GitHub: https://github.com/mifunedev/agro
- Documentation: https://agro.mifune.dev

### 3. Forward-Deployed Engineering Support — optional for Console customers

Mifune engineers can work alongside a Console customer's team to plan, implement, integrate, troubleshoot, and hand off a Mifune Console deployment. An established deployment is not required before discussing a scope.

- Support: https://mifune.dev/services
- Contact: hello@mifune.dev

## Website

- Homepage: https://mifune.dev
- Pricing: https://mifune.dev/pricing
- AGRO documentation: https://agro.mifune.dev
- Blog: https://mifune.dev/blog
`;

function generateLlmTxt() {
  const outputPath = path.join(rootDir, "public", "llm.txt");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, LLM_TXT_CONTENT, "utf-8");
  console.log(`Generated llm.txt at ${outputPath}`);
}

generateLlmTxt();
