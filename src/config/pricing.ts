export type PricingTier = {
  id: string;
  name: string;
  badge?: string;
  price: string; // "$1,500" | "$2,500–$10,000" | "Free" | "Custom"
  period?: string; // "/mo" | "one-time" | undefined
  description: string;
  bullets: string[];
  cta: string;
  ctaHref: string; // homepage tiers → "#audit"
  highlight: boolean;
  ladderStage?: string; // optional — maps to value-ladder stage
  positionLabel?: "intake" | "base" | "upsell" | "top";
  roiHint?: string; // money framing, e.g. "Cheaper than a $5k–$10k/mo AI consultant"
};

// TODO: confirm AI Partner price + ladder with client
export const homepageTiers: PricingTier[] = [
  {
    id: "ai-partner",
    name: "AI Partner",
    badge: "START HERE",
    price: "$1,500",
    period: "/mo",
    description:
      "Your recurring AI implementation partner — two done-with-you sessions a month where we build the AI workers that run your business on your screen, so your team owns every piece.",
    bullets: [
      "Two 45-minute done-with-you sessions a month — built on your screen",
      "Fix the process first, then automate it — Audit, Optimize, Automate",
      "At least one automation live after session one",
      "Unlimited async support with same-day replies for AI Partner clients",
      "A running, quantified log of everything we build",
      "You learn to drive — you own it all",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: true,
    positionLabel: "base",
    roiHint: "Cheaper than a $5k–$10k/mo AI consultant",
  },
  {
    id: "done-for-you-deployment",
    name: "Done-For-You Deployment",
    price: "$2,500–$10,000",
    period: "one-time",
    description:
      "The upsell when you'd rather we build it for you — we design, build, and deploy a production-ready AI worker into your workflow, tested and documented.",
    bullets: [
      "Custom AI worker built for your specific workflow",
      "CRM, email, and docs integration",
      "Human-in-the-loop approval flows",
      "Handoff documentation and training included",
      "You own everything",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: false,
    positionLabel: "upsell",
    roiHint: "One-time build that pays for itself in recovered hours",
  },
  {
    id: "managed-ai-workforce",
    name: "Managed AI Workforce",
    price: "Custom",
    description:
      "A fully managed AI workforce running on OpenHarness — enterprise infrastructure, continuous improvement, and a dedicated partner so your team focuses on high-value work.",
    bullets: [
      "Unlimited AI workers on OpenHarness",
      "Managed cloud deployment and monitoring",
      "Ongoing optimization and new automations",
      "Custom integrations",
      "Dedicated partner + SLA and audit logging",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: false,
    positionLabel: "top",
    roiHint: "Replaces multiple full-time hires at a fraction of the cost",
  },
];

export const pricingPageTiers: PricingTier[] = [
  {
    id: "ai-workflow-audit",
    name: "AI Workflow Audit",
    badge: "INTAKE",
    price: "Free",
    period: undefined,
    description:
      "A quick intake that surfaces your highest-ROI AI opportunities before your first session — no commitment, no credit card.",
    bullets: [
      "10-minute intake questionnaire",
      "Surfaces 1–3 AI opportunities before our first session",
      "Prioritized by ROI",
      "Feeds straight into your AI Partner engagement",
    ],
    cta: "Start Your Free Audit",
    ctaHref: "#audit",
    highlight: false,
    positionLabel: "intake",
    roiHint: undefined,
  },
  {
    id: "ai-partner",
    name: "AI Partner",
    badge: "START HERE",
    price: "$1,500",
    period: "/mo",
    description:
      "Your recurring AI implementation partner — two done-with-you sessions a month where we build the AI workers that run your business on your screen, so your team owns every piece.",
    bullets: [
      "Two 45-minute done-with-you sessions a month — built on your screen",
      "Fix the process first, then automate it — Audit, Optimize, Automate",
      "At least one automation live after session one",
      "Unlimited async support with same-day replies for AI Partner clients",
      "A running, quantified log of everything we build",
      "You learn to drive — you own it all",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: true,
    positionLabel: "base",
    roiHint: "Cheaper than a $5k–$10k/mo AI consultant",
  },
  {
    id: "done-for-you-deployment",
    name: "Done-For-You Deployment",
    price: "$2,500–$10,000",
    period: "one-time",
    description:
      "The upsell when you'd rather we build it for you — we design, build, and deploy a production-ready AI worker into your workflow, tested and documented.",
    bullets: [
      "Custom AI worker built for your specific workflow",
      "CRM, email, and docs integration",
      "Human-in-the-loop approval flows",
      "Handoff documentation and training included",
      "You own everything",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: false,
    positionLabel: "upsell",
    roiHint: "One-time build that pays for itself in recovered hours",
  },
  {
    id: "managed-ai-workforce",
    name: "Managed AI Workforce",
    price: "Custom",
    description:
      "A fully managed AI workforce running on OpenHarness — enterprise infrastructure, continuous improvement, and a dedicated partner so your team focuses on high-value work.",
    bullets: [
      "Unlimited AI workers on OpenHarness",
      "Managed cloud deployment and monitoring",
      "Ongoing optimization and new automations",
      "Custom integrations",
      "Dedicated partner + SLA and audit logging",
    ],
    cta: "Get Your Free Audit",
    ctaHref: "#audit",
    highlight: false,
    positionLabel: "top",
    roiHint: "Replaces multiple full-time hires at a fraction of the cost",
  },
];
