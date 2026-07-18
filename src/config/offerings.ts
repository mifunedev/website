export const OFFERING_URLS = {
  cloud: "https://console.mifune.dev",
  openSource: "https://github.com/mifunedev/openharness",
  docs: "https://oh.mifune.dev",
  pricing: "/pricing",
  support: "/services",
  supportEmail: "hello@mifune.dev",
  supportContact:
    "mailto:hello@mifune.dev?subject=Discuss%20an%20Open%20Harness%20Cloud%20deployment",
} as const;

export type OfferingPath = {
  id: "cloud" | "open-source" | "support";
  eyebrow: string;
  name: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  external: boolean;
  primary: boolean;
  operator: string;
  bestFor: string;
};

export const offeringPaths: OfferingPath[] = [
  {
    id: "cloud",
    eyebrow: "Recommended · Managed by Mifune",
    name: "Open Harness Cloud",
    description:
      "Give coding agents an isolated, persistent Open Harness workspace while Mifune operates the managed environment.",
    bullets: [
      "Persistent workspace for coding agents",
      "Environment operated by Mifune",
      "Start in the Mifune Cloud Console",
    ],
    cta: "Open Mifune Cloud Console",
    href: OFFERING_URLS.cloud,
    external: true,
    primary: true,
    operator: "Mifune operates the managed environment.",
    bestFor:
      "Teams that want the workspace value without operating the environment themselves.",
  },
  {
    id: "open-source",
    eyebrow: "Self-hosted · Maintained by Mifune",
    name: "Open Harness Open Source",
    description:
      "Inspect, adapt, and operate the MIT-licensed Open Harness workspace yourself, locally or on a remote VM.",
    bullets: [
      "Claude Code, Codex, Pi, and other opt-in CLIs",
      "Local or remote Docker workspace",
      "Isolated git worktrees for parallel branches",
    ],
    cta: "Explore Open Harness on GitHub",
    href: OFFERING_URLS.openSource,
    external: true,
    primary: false,
    operator: "Your team operates its local or remote environment.",
    bestFor:
      "Teams that want self-host control and are prepared to run the workspace.",
  },
  {
    id: "support",
    eyebrow: "Optional · For Cloud customers",
    name: "Forward-Deployed Engineering Support",
    description:
      "Bring Mifune engineers alongside your team to plan, implement, integrate, troubleshoot, and hand off your Open Harness Cloud deployment.",
    bullets: [
      "Workflow and deployment planning",
      "Hands-on implementation and integration",
      "Troubleshooting and team handoff",
    ],
    cta: "Explore Cloud Engineering Support",
    href: OFFERING_URLS.support,
    external: false,
    primary: false,
    operator: "Mifune engineers work alongside your team on an agreed scope.",
    bestFor:
      "Cloud customers that want hands-on help with adoption or deployment work.",
  },
];

export const cloudOptions = offeringPaths.filter(
  (offering) => offering.id !== "support",
);

export const supportOffering = offeringPaths.find(
  (offering) => offering.id === "support",
)!;
