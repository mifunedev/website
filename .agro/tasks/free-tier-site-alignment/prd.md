# PRD: Align mifune.dev with the free tier and the browser-first Console

Status: DRAFT

Issue: [#72](https://github.com/mifunedev/website/issues/72). Base branch: `master`, the branch that the live site serves. Sources: agro-console `CHANGELOG.md` 1.5.0 to 1.8.0, AGRO `CHANGELOG.md` 0.16.0 to 0.18.0, a designer review, and a council review on 2026-10-08. The screenshots of the live site before the change are in `evidence/before/`.

## User Stories

### US-001: State the free tier and remove the false denial on the pricing page

**Description:** As a visitor, I want the pricing page to state the free tier with its limits so that I start without a card.

**Acceptance Criteria:**

- [ ] `/pricing` contains no "No free tier", no "no trial", and no "A card is required before your first node".
- [ ] Below the hero, `/pricing` shows a card with the heading "Start your free workspace" and the text "Personal accounts get one n4 node with 24 running hours each UTC month. No credit card. No SSH key."
- [ ] The free card has one button "Create free node" that links to `https://console.mifune.dev`, and the note "Limited free spots."
- [ ] The CTA strip reads "Free for personal accounts: 24 running hours a month on one n4 node, no card · Limited free spots · Paid nodes need a card".
- [ ] The billing fact "Destroy to stop paying" becomes "Pause or destroy to stop paying", with the detail "Only running time is billed. Pause a node to stop billing and keep its workspace. Destroy it to delete it for good."
- [ ] The n4 row of the rate calculator carries the label "Free tier eligible".
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-002: Correct the FAQ and its JSON-LD

**Description:** As a visitor, I want the FAQ to match the Console so that I know what is free and how to stop paying.

**Acceptance Criteria:**

- [ ] The billing FAQ answer names Pause and contains no "destroying the node in the Console is how you stop paying".
- [ ] The card FAQ question reads "Do I need a card to start?".
- [ ] The card FAQ answer reads "No, not for the free tier. A personal account gets one n4 node with 24 running hours each UTC month and no card. At the limit, the node pauses, and its workspace is kept for 60 days. A paid node needs a card. Free spots are limited."
- [ ] A new FAQ "What happens when my free hours run out?" answers "The node pauses automatically, and nothing is billed. Add a card to continue now, or wait for the next UTC month. The workspace is kept for 60 days after each pause."
- [ ] A new FAQ "Do I need an SSH key?" answers "No. You open every node in your browser, with a terminal and an editor. Add an SSH key only if you also want direct SSH access."
- [ ] The `FAQPage` JSON-LD on `/pricing` contains each new question and each new answer.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-003: State the free, browser-first Console on the home page

**Description:** As a visitor, I want the home page to show the free Console so that I try it first.

**Acceptance Criteria:**

- [ ] The Console offering card bullets include "Free: 24 running hours a month on one n4 node" and "Browser terminal and editor, no SSH key".
- [ ] The "How do I start?" FAQ answer names the free Console path.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-004: Correct the install command and the agent wording

**Description:** As a self-hosting developer, I want the current install command and agent wording so that my first steps succeed.

**Acceptance Criteria:**

- [ ] `posts/agro-getting-started.md` contains `curl -fsSL https://github.com/mifunedev/agro/releases/latest/download/install.sh | bash` and contains no `get-agro.sh`.
- [ ] `src/sections/AgentPickerSection.tsx` states that `agro harness install <id>` adds an agent, and contains no "preinstalled" and no "Dockerfile".
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-005: Mirror the changes in llm.txt

**Description:** As an AI assistant that reads the site, I want `llm.txt` to state the current offer so that my answers match the Console.

**Acceptance Criteria:**

- [ ] `scripts/generate-llm-txt.mjs` contains no "no free tier", no "no trial", no "card is required before", no "how you stop paying", and no "until you destroy".
- [ ] The generator states "A personal free tier gives one n4 node 24 running hours per UTC month with no card; the node auto-pauses at the limit and its workspace is kept 60 days after each pause. Free spots are limited, and a paid node needs a card."
- [ ] The generator states that Pause stops billing and that a node opens in the browser with no SSH key.
- [ ] After `npm run build`, `public/llm.txt` matches the generator output.

### US-006: Align the hero headline with the AGRO description

**Description:** As a first-time visitor, I want the hero to say what AGRO is and how to start free so that I pick a path.

**Acceptance Criteria:**

- [ ] The hero `<h1>` reads exactly "A portable home for autonomous coding agents.", and the page has one `<h1>`.
- [ ] The `<h1>` equals the `mifunedev/agro` GitHub description without its prefix "AGRO — Agent Governance Runtime Orchestrator. ".
- [ ] The hero subtitle reads exactly "Give Claude Code, Codex, Pi, or any harness an isolated, persistent workspace that keeps working after you disconnect. Self-host it, or start free in your browser."
- [ ] The primary CTA reads "Start your free workspace" and links to `OFFERING_URLS.cloud`.
- [ ] The secondary CTA reads "Self-host AGRO on GitHub" and links to `OFFERING_URLS.openSource`.
- [ ] Both CTAs keep the screen-reader text "(opens in a new tab)".
- [ ] The line "Free for personal accounts · No card · No SSH key" sits directly below the CTA row.
- [ ] The hero footer line reads "Apache-2.0 · Agent Governance Runtime Orchestrator · works with any coding harness".
- [ ] The hero contains no "not on your machine", no "Open Mifune Cloud Console", and no scarcity number.
- [ ] At 414x896, the `<h1>` wraps to 3 lines or fewer, and the `<h1>`, the subtitle, and the primary CTA show without a scroll.
- [ ] At 1440x900, the `<h1>`, the subtitle, and both CTAs show without a scroll.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-007: Manual review evidence

**Description:** As the operator, I want a recorded browser review of the changed pages so that I can accept the change from evidence.

**Acceptance Criteria:**

- [ ] Depends on US-001 through US-006.
- [ ] `.agro/tasks/free-tier-site-alignment/evidence/manual-review.md` holds annotated screenshots of `/pricing`, the FAQ section, the home hero, and the Console card, and of the hero before and after the headline change, at 1280x720 and 414x896.
- [ ] Each screenshot of a changed page has a matching screenshot in `evidence/before/`, so a reviewer compares the two.
- [ ] The run checks that `scrollWidth <= innerWidth` on `/` and `/pricing` at 414x896.
- [ ] The run uses a local `npm run build` and `npm run start`, and stops each process that the run starts.

### US-008: Use "workspace" for the agent environment

**Description:** As a visitor, I want the site to call the agent environment "workspace" so that the site matches the Console.

**Acceptance Criteria:**

- [ ] `git grep -n -i sandbox -- src scripts public/llm.txt` returns only comments, identifiers, or code that is not visible copy.
- [ ] The site title, the Open Graph image, and the `llm.txt` tagline read "A portable home for autonomous coding agents."
- [ ] Blog posts keep "sandbox" where the text names an `agro sandbox` command or the self-hosted CLI.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-009: Move harness support up and open source below the contact section

**Description:** As a visitor, I want agent support after the hero and the open-source showcase at the end, so that the free start comes first.

**Acceptance Criteria:**

- [ ] On `/`, the section order is the hero, `AgentPickerSection`, `AgroValueSection`, `PricingSection`, the FAQ, `CTASection`, then `OpenSourceSection`.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-010: List each harness in the AGRO catalog

**Description:** As a visitor, I want the agent picker to list each harness that `agro harness install` supports so that I find my agent.

**Acceptance Criteria:**

- [ ] The agent picker lists each `installable` and `on-demand` entry in the AGRO harness catalog (`.agro/cli/src/lib/harnesses/catalog.ts`).
- [ ] The agent picker lists no harness that the catalog omits, except the OpenClaw "Coming soon" card.
- [ ] Each harness card with a published docs page links to that page.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

## Summary

agro-console 1.7.0 and 1.8.0 added a personal free tier and made the SSH key optional, and production runs that release. The free tier gives one n4 node 24 running hours per UTC month, with no card, for personal accounts only. The Console caps enrollment at 250 (`agro-console/config.yaml`, `enrollmentCap`). The Console bills only running time: `billing.ts` meters only `node_hour_<spec>`, so a paused node costs nothing. A personal-account owner holds the `admin` role, and the Pause route requires `operator` or higher (`nodes.controller.ts:254`).

The live site serves `master` (`883c9ed`), which is 17 commits ahead of `development`. On `master`, mifune.dev says "No free tier, no trial" (`src/app/pricing/page.tsx:131-132`, `src/data/faqs.ts:101`, `scripts/generate-llm-txt.mjs:99`) and "Destroy to stop paying" (`src/app/pricing/page.tsx:62`). The blog post installs from `agro.mifune.dev/get-agro.sh`. `AgentPickerSection.tsx:258-260` says three agents ship preinstalled.

The prices in `src/config/cloud-pricing.ts` match the Console catalog for each of the five specs, so the plan changes no price.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `src/app/pricing/page.tsx` | `billingFacts`, CTA strip | Free card, billing fact, strip |
| `src/components/pricing/FleetCalculator.tsx` | n4 row | "Free tier eligible" label |
| `src/data/faqs.ts` | billing, card, start FAQs | FAQ text and JSON-LD source |
| `src/config/offerings.ts` | `offeringPaths` (Console card) | Free and browser bullets |
| `src/sections/HeroSection.tsx` | `<h1>`, subtitle, CTAs, footer line | Hero headline and free start |
| `src/sections/AgentPickerSection.tsx` | harness copy, line 258 | Install-on-demand wording |
| `posts/agro-getting-started.md` | install steps, lines 64-75 | `install.sh` command |
| `scripts/generate-llm-txt.mjs` | text lines 93 and 99 | `llm.txt` source |
| `public/llm.txt` | generated file | Build output |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| `/pricing` | Modified | Free card, CTA strip, billing fact, FAQ |
| `/` | Modified | Hero headline, subtitle, CTAs, Console card, start FAQ, agent wording |
| `/blog/agro-getting-started` | Modified | Install command |
| `/llm.txt` | Modified | Offer text |

## Storage

N/A. The site is static content and stores no data.

## Architectural Decisions

- **Source of truth:** the Console code and the two changelogs set each claim. `src/config/cloud-pricing.ts` stays the only price source.
- **Static copy:** the site states the free tier in static text. The site reads no Console state at run time.
- **Qualified offer:** each free-tier claim names personal accounts and limited spots, and each card claim names paid nodes.
- **Base branch:** `master`, because the live site serves `master`.
- **One tagline:** the hero `<h1>` repeats the `mifunedev/agro` GitHub description. The subtitle adds the harnesses, the unattended work, and the free browser start. A designer scored this headline 21 of 25, and the current headline 16 of 25.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| N/A: the repository has no test script | `npm run lint`, `npm run build` | Each story |
| `git grep` checks | `No free tier`, `no trial`, `card is required before`, `how you stop paying`, `until you destroy`, `get-agro.sh`, `preinstalled` | US-001 to US-005 |
| `.agro/tasks/free-tier-site-alignment/evidence/manual-review.md` | before and after screenshots | US-007 |

## Design Principles

- Match the Console wording: "Start your free workspace", "Create free node", "No credit card. No SSH key."
- State each limit next to each free claim.
- State only verified facts. Copy each price from `src/config/cloud-pricing.ts`.
- Keep the copy short, in plain language.

## Out of Scope

- Phase 2, in a separate plan: the free-first layout redesign, the "n4 · 4 GB" calculator labels, the mobile button order, the Console card restyle, Console product screenshots as site visuals, and the docs-link move from `agro.mifune.dev`.
- Phase 3, scoped after this task: a demo video of the platform in the hero. The new headline stays true with and without the video.
- The rename of `mifunedev/agro-web` (mifunedev/agro-web#69).
- UTM tags on the Console links.
- A price change, and any Console change.

## Open Questions

1. Production runs the free tier, but `agro-console/deploy/config.yaml` still sets `features.freeTier: false`. The operator updates the production config later. Does this PR merge before that update?
2. Production billing still runs in Stripe test mode. Does the site state the free tier before production billing goes live?

## Acceptance Criteria

- [ ] mifune.dev contains no "No free tier", no "no trial", no "card is required before your first node", and no "how you stop paying".
- [ ] mifune.dev states the personal free tier with its limits, and states that a paid node needs a card.
- [ ] mifune.dev states that Pause stops billing and that a node opens in the browser with no SSH key.
- [ ] `npm run lint` and `npm run build` exit 0.

## Lessons

- In Next.js 14.2.4, `next build` and `next dev` share the `.next` directory. A build in the main checkout breaks a running dev server. The advisor ran each `npm run build` in a scratch copy of the tracked files.
- `npx next start` runs `next-server` as a child process. A stop of the `npx` process leaves the server on its port. Stop the process that listens on the port.
- `FleetCalculator.tsx` forbids a comparison against one spec. The free-tier label reads `isFreeTierEligible()` from `src/config/cloud-pricing.ts`, so the calculator stays a map over `cloudNodePlans`.
- The `mifunedev/agro` GitHub description starts with an emoji before "AGRO — Agent Governance Runtime Orchestrator. ". The hero `<h1>` uses only the text after that prefix.
- The sticky navigation bar hides an element that a scroll puts at the top of the viewport. Scroll each callout target 110 pixels below the top before an annotated screenshot.
- Phase 2 follow-up: the agent picker still shows a DeepAgents card. The AGRO docs have no page at `docs/harnesses/deepagents`.
