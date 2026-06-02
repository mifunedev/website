export type PricingTier = {
  id: string;
  name: string;
  badge?: string;
  price: string; // "$500–$2,500" | "Custom"
  period?: string; // "/mo" | "one-time" | undefined
  description: string;
  bullets: string[];
  cta: string;
  ctaHref: string; // homepage tiers → "#audit"
  highlight: boolean;
  ladderStage: string; // maps to the /pricing value-ladder, e.g. "deployment" | "department" | "managed"
  roiHint?: string; // money framing, e.g. "Replaces ~$40k/yr admin hire"
};

export const homepageTiers: PricingTier[] = [
  {
    id: "starter-ai-worker",
    name: "Starter AI Worker",
    price: "$2,500–$10,000",
    period: "one-time",
    description:
      "One AI worker deployed into your most time-consuming workflow — built, tested, and handed off to you in 30 days.",
    bullets: [
      "Single AI worker configured for your workflow",
      "CRM, email, or docs integration",
      "Human approval before sensitive actions",
      "30-day deployment window",
      "You own everything",
    ],
    cta: "Book an AI Workflow Audit",
    ctaHref: "#audit",
    highlight: false,
    ladderStage: "deployment",
    roiHint: "Replaces ~$40k/yr junior admin hire",
  },
  {
    id: "ai-operations-system",
    name: "AI Operations System",
    badge: "MOST POPULAR",
    price: "$3,000–$7,000",
    period: "/mo",
    description:
      "A coordinated team of AI workers covering sales, ops, and customer success — managed ongoing so your stack stays current.",
    bullets: [
      "Up to 3 AI workers deployed",
      "Ongoing monitoring and tuning",
      "Weekly performance reports",
      "New automations as your business grows",
      "Priority support",
    ],
    cta: "Book an AI Workflow Audit",
    ctaHref: "#audit",
    highlight: true,
    ladderStage: "department",
    roiHint: "Replaces a ~$120k/yr ops department",
  },
  {
    id: "ai-workforce-partner",
    name: "AI Workforce Partner",
    price: "Custom",
    description:
      "A fully managed AI workforce running on OpenHarness — enterprise infrastructure, continuous improvement, and a dedicated partner.",
    bullets: [
      "Unlimited AI workers",
      "OpenHarness managed deployment",
      "Custom integrations",
      "Dedicated partner access",
      "SLA and audit logging",
    ],
    cta: "Book an AI Workflow Audit",
    ctaHref: "#audit",
    highlight: false,
    ladderStage: "managed",
    roiHint: "Replaces multiple full-time hires at a fraction of the cost",
  },
];

export const pricingPageTiers: PricingTier[] = [
  {
    id: "ai-workflow-audit",
    name: "AI Workflow Audit",
    price: "$500–$2,500",
    period: "one-time",
    description:
      "A structured 2-hour deep-dive into your workflows — identifying the highest-ROI automation opportunities and delivering a prioritized action plan.",
    bullets: [
      "2-hour workflow mapping session",
      "Prioritized automation opportunities",
      "ROI estimate per workflow",
      "Recommended AI worker stack",
      "Written action plan delivered in 48 hours",
    ],
    cta: "Book Your Audit",
    ctaHref: "#audit",
    highlight: false,
    ladderStage: "audit",
    roiHint: "Cheaper than one week of manual busywork",
  },
  {
    id: "ai-partner",
    name: "AI Partner",
    price: "$1,500–$3,000",
    period: "/mo",
    description:
      "Recurring advisory and hands-on guidance — your AI strategy partner for tool selection, prompt engineering, and workflow design.",
    bullets: [
      "Monthly strategy session",
      "Tool vetting and recommendations",
      "Prompt engineering support",
      "Workflow design reviews",
      "Async support via email/chat",
    ],
    cta: "Book Your Audit",
    ctaHref: "#audit",
    highlight: false,
    ladderStage: "advisory",
    roiHint: "Cheaper than a part-time AI consultant",
  },
  {
    id: "done-for-you-deployment",
    name: "Done-For-You Deployment",
    price: "$2,500–$10,000",
    period: "one-time",
    description:
      "We build and deploy production-ready AI workers into your workflows — tested, documented, and yours to keep.",
    bullets: [
      "Custom AI worker built for your workflow",
      "Production deployment in 30 days",
      "CRM, email, and docs integration",
      "Human-in-the-loop approval flows",
      "Handoff documentation included",
    ],
    cta: "Book Your Audit",
    ctaHref: "#audit",
    highlight: true,
    ladderStage: "deployment",
    roiHint: "Replaces ~$40k/yr in admin labor",
  },
  {
    id: "managed-ai-workforce",
    name: "Managed AI Workforce",
    price: "Custom",
    description:
      "A fully managed AI workforce on OpenHarness — built, monitored, and continuously improved so your team can focus on high-value work.",
    bullets: [
      "Unlimited AI workers on OpenHarness",
      "Managed cloud deployment",
      "Ongoing monitoring and optimization",
      "Custom integrations and new automations",
      "Dedicated partner + SLA",
    ],
    cta: "Book Your Audit",
    ctaHref: "#audit",
    highlight: false,
    ladderStage: "managed",
    roiHint: "Replaces multiple full-time hires at a fraction of the cost",
  },
];
