import {
  cloudNodePlans,
  emptyFleet,
  fleetTotalUsd,
  formatHourlyUsd,
  formatUsdTotal,
  HOURS_PER_MONTH,
} from "@/config/cloud-pricing";

export interface Faq {
  question: string;
  answer: string;
}

/**
 * Homepage FAQ content. This is shared by the visible disclosure list and the
 * FAQPage JSON-LD so buyer-facing copy and structured data stay aligned.
 */
export const faqs: Faq[] = [
  {
    question: "What is Open Harness?",
    answer:
      "Open Harness is an Apache-2.0 licensed, isolated, persistent Docker workspace for coding agents. It keeps one project and its toolchain in one sandbox and supports Claude Code, Codex, Pi, and other opt-in agent CLIs.",
  },
  {
    question: "What problem does it solve?",
    answer:
      "Open Harness keeps project toolchains off your host and gives coding agents a workspace that persists between sessions. It can run locally or on a remote VM; remote agents can work unattended or on schedules and can be reachable over Slack. Isolated git worktrees support parallel branches and delegation.",
  },
  {
    question: "What does Mifune provide?",
    answer:
      "Mifune maintains the open-source Open Harness project, operates Open Harness Cloud as the managed path, and offers forward-deployed engineering support to Cloud customers.",
  },
  {
    question: "How do Open Harness Cloud and open source differ?",
    answer:
      "With Open Harness Cloud, Mifune operates the managed environment. With open source, your team can inspect and adapt Open Harness, then operate it locally or on a remote VM. Choose based on who should own the environment and review each destination for path-specific details.",
  },
  {
    question: "When should I use engineering support?",
    answer:
      "Forward-deployed support is optional for Open Harness Cloud customers who want Mifune engineers alongside their team to plan, implement, integrate, troubleshoot, or hand off a Cloud deployment.",
  },
  {
    question: "How do I start?",
    answer:
      "Open console.mifune.dev for the managed Cloud path. Visit github.com/mifunedev/openharness and read the docs at oh.mifune.dev for the self-hosted path. Email hello@mifune.dev to discuss engineering support for Cloud.",
  },
];

/**
 * Every rate below is read from `cloud-pricing.ts`, so a price change stays a
 * one-file edit and an answer can never drift from the price cards.
 */
const hourlyRateSentence = cloudNodePlans
  .map(
    (plan) =>
      `${plan.label} (${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.diskGb} GB SSD) is ${formatHourlyUsd(plan.hourlyUsd)} an hour`,
  )
  .join("; ");

/**
 * Monthly figures for one node of each size, computed from the published
 * hourly rates rather than written down. The "no monthly plan" clause must
 * stay in the same sentence as these numbers: this answer is fed to
 * `faqPageSchema`, and structured data strips whatever sits next to it, so a
 * disclaimer in an adjacent sentence would not survive into a rich result.
 */
const monthlyEstimateList = cloudNodePlans
  .map(
    (plan) =>
      `${plan.label} about ${formatUsdTotal(
        fleetTotalUsd({ ...emptyFleet(), [plan.spec]: 1 }, HOURS_PER_MONTH),
      )}`,
  )
  .join(", ");

/**
 * Pricing-page FAQ content, kept separate from the homepage `faqs` export so
 * neither list leaks into the other page or its FAQPage JSON-LD.
 */
export const pricingFaqs: Faq[] = [
  {
    question: "How does billing work?",
    answer:
      "You pay for the hours your node runs. Only whole running UTC hours meter, so any UTC hour in which the node was running counts as one full hour at the rate for its size. Time spent queued, building, or on a build that failed is not billed, and destroying the node in the Console is how you stop paying for it.",
  },
  {
    question: "What does a node cost?",
    answer: `Each size is priced per whole running hour: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan.`,
  },
  {
    question: "Is AI usage included?",
    answer:
      "No. The price covers the node and the Open Harness workspace running on it. You sign in to Claude, Pi, or another opt-in agent CLI inside the workspace with your own account, and you pay that provider directly for the AI usage.",
  },
  {
    question: "Do I need a card to sign up?",
    answer:
      "Signing in is free and costs you nothing to look around. A card is required before you create your first node, because a running node meters from its first whole hour. There is no free tier and no trial.",
  },
  {
    question: "How many nodes can I run?",
    answer:
      "Three by default. If you need more than that, tell us what you are planning to run in the deployment form on this page and we will work it out with you.",
  },
];
