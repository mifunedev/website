import {
  cloudNodePlans,
  countWord,
  DISK_SIZE_STEP_GB,
  DISPOSABLE_BOOT_STORAGE_HOURLY_USD,
  emptyFleet,
  EXTRA_DISK_USD_PER_GB_MONTH,
  fleetTotalUsd,
  formatHourlyUsd,
  formatSpecList,
  formatTopUpAmounts,
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
  PAUSED_DISK_USD_PER_GB_MONTH,
  TOP_UP_AMOUNTS_USD,
} from "@/config/cloud-pricing";

const freeTierOffer = `${countWord(FREE_TIER_NODE_COUNT)} free ${formatSpecList(FREE_TIER_NODE_SPECS)} nodes that share ${FREE_TIER_RUNNING_HOURS_PER_MONTH} running hours each UTC month`;

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What is AGRO?",
    answer:
      "AGRO, formerly Open Harness, is an Apache-2.0 licensed, isolated, persistent workspace for coding agents. It runs on a laptop, a remote VM, or a Mifune Console node; Docker is one supported runtime. It keeps one project and its toolchain in one workspace and supports Claude Code, Codex, Pi, and other opt-in agent CLIs.",
  },
  {
    question: "What problem does it solve?",
    answer:
      "AGRO keeps project toolchains off your host and gives coding agents a workspace that persists between sessions. It can run locally or on a remote VM; remote agents can work unattended or on schedules and can be reachable over Slack. Isolated git worktrees support parallel branches and delegation.",
  },
  {
    question: "What does Mifune provide?",
    answer:
      "Mifune maintains the open-source AGRO project, operates the Mifune Console as the managed path, and offers forward-deployed engineering support to Console customers.",
  },
  {
    question: "How do the Mifune Console and open source differ?",
    answer:
      "With the Mifune Console, Mifune operates the managed environment. With open source, your team can inspect and adapt AGRO, then operate it locally or on a remote VM. Choose based on who should own the environment and review each destination for path-specific details.",
  },
  {
    question: "When should I use engineering support?",
    answer:
      "Forward-deployed support is optional for Console customers who want Mifune engineers alongside their team to plan, implement, integrate, troubleshoot, or hand off a Console deployment.",
  },
  {
    question: "How do I start?",
    answer: `Open console.mifune.dev and start free with a personal account: ${freeTierOffer}, no card, opened in your browser. Visit github.com/mifunedev/agro and read the docs at agro.mifune.dev for the self-hosted path. Email hello@mifune.dev to discuss engineering support for the Console.`,
  },
];

const hourlyRateSentence = cloudNodePlans
  .map(
    (plan) =>
      `${plan.label} (${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.diskGb} GB SSD) is ${formatHourlyUsd(plan.computeHourlyUsd)} an hour for compute plus ${formatHourlyUsd(plan.storageHourlyUsd)} for each started hour of storage, ${formatHourlyUsd(fullHourUsd(plan))} for a full running hour`,
  )
  .join("; ");

const monthlyEstimateList = cloudNodePlans
  .map(
    (plan) =>
      `${plan.label} about ${formatUsdTotal(
        fleetTotalUsd({ ...emptyFleet(), [plan.spec]: 1 }, HOURS_PER_MONTH),
      )}`,
  )
  .join(", ");

export const pricingFaqs: Faq[] = [
  {
    question: "How does billing work?",
    answer: `You pay from prepaid credit for two parts while your node runs. Compute bills for each second, at the compute price for its size, with a minimum of ${MINIMUM_BILLED_SECONDS} seconds for each run. Storage for the node volumes bills for each started clock hour, at the storage price for its size. Time spent queued, building, or on a build that failed is not billed. Pause a node in the Console to stop the running charge and keep its workspace, or destroy it to delete it for good. A paused paid node pays nothing for the first ${FREE_PAUSED_DAYS} days of a pause. After ${FREE_PAUSED_DAYS} days, it pays $${PAUSED_DISK_USD_PER_GB_MONTH.toFixed(2)} per GB-month for its whole disk until you resume or destroy it. Each new pause starts a new ${FREE_PAUSED_DAYS}-day period.`,
  },
  {
    question: "What does a node cost?",
    answer: `Each size has a compute price, billed per second with a ${MINIMUM_BILLED_SECONDS}-second minimum for each run, and a storage price, billed for each started clock hour while the node runs: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan. The storage price covers the included data disk of each size. You can choose a larger data disk in steps of ${DISK_SIZE_STEP_GB} GB, up to ${MAX_DISK_GB} GB. Extra disk costs $${EXTRA_DISK_USD_PER_GB_MONTH.toFixed(2)} per GB-month, billed for each started hour while the node runs, on every node with a data volume. On a free node, the included disk stays free, and extra disk bills from prepaid credit. A disposable hand costs less: it has no data volume, so it pays only a boot storage fee of about $${DISPOSABLE_BOOT_STORAGE_HOURLY_USD.toFixed(3)} for each started hour on top of compute. A disposable hand cannot pause or fork. The Console deletes a disposable hand at the end of the grace window or when the free allowance runs out.`,
  },
  {
    question: "Is AI usage included?",
    answer:
      "No. The price covers the node and the AGRO workspace running on it. You sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account, and you pay that provider directly for the AI usage. Mifune holds no model credential and does not mark up tokens.",
  },
  {
    question: "Do I need a card to start?",
    answer: `No, not for the free tier. A personal account gets ${freeTierOffer}, and no card. At the limit, the nodes pause, and each workspace is kept for ${FREE_TIER_PAUSED_RETENTION_DAYS} days. A paid node runs from prepaid credit, which you buy with a card. Free spots are limited.`,
  },
  {
    question: "How does prepaid credit work?",
    answer: `A paid node runs from your organization's prepaid credit. The Console debits compute for each second the node runs, with a ${MINIMUM_BILLED_SECONDS}-second minimum for each run, and storage for each started clock hour. Buy credit in the Console in amounts of ${formatTopUpAmounts(TOP_UP_AMOUNTS_USD)}. Turn on automatic top-up to charge your saved card, in the same amounts, when the balance falls below a threshold that you set. When the balance covers less than ${LOW_BALANCE_WARNING_HOURS} hours at your current spend, each org admin and billing account manager gets an email, and the Console shows a banner. A negative balance starts a ${GRACE_WINDOW_HOURS}-hour grace window. A top-up during the window keeps your nodes running. At the end of the window, the Console pauses each running paid node.`,
  },
  {
    question: "What happens when my free hours run out?",
    answer: `Your free nodes pause automatically, and nothing is billed. Add credit to continue now, or wait for the next UTC month. The workspace is kept for ${FREE_TIER_PAUSED_RETENTION_DAYS} days after each pause.`,
  },
  {
    question: "Do I need an SSH key?",
    answer:
      "No. You open every node in your browser, with a terminal and an editor. Add an SSH key only if you also want direct SSH access.",
  },
  {
    question: "How many nodes can I run?",
    answer:
      "Three by default. If you need more than that, tell us what you are planning to run in the deployment form on this page and we will work it out with you.",
  },
];
