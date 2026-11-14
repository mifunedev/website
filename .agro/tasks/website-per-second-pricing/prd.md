# PRD: Website per-second pricing

Status: DRAFT

## User Stories

### US-001: Write the copy deck and get design scope sign-off

**Description:** As the design team, I want one copy deck for each changed surface. I can then approve the scope before any page changes.

**Acceptance Criteria:**

- [ ] `.agro/tasks/website-per-second-pricing/copy-deck.md` lists each surface in the Key Integration Points table with its current text and its new text.
- [ ] Each new value in the copy deck matches the approved value in `mifunedev/agro-console` `.agro/tasks/per-second-prepaid-billing/prd.md`.
- [ ] `external` The design team approves the scope of the copy deck. The approval names the copy deck commit.
- [ ] `bash .agro/skills/ste/scripts/ste-check.sh` exits 0 on the copy deck.

### US-002: Update the pricing data

**Description:** As a visitor, I want each displayed rate to match the Console. The calculator then shows what the Console charges.

**Acceptance Criteria:**

- [ ] `hourlyUsd` of each plan in `src/config/cloud-pricing.ts` equals the approved Console price for that spec.
- [ ] `src/config/cloud-pricing.ts` exports the per-run minimum as `MINIMUM_BILLED_SECONDS`, equal to `300`.
- [ ] `src/config/cloud-pricing.ts` exports the hot paused storage price per GB-month and the free paused days.
- [ ] `src/config/cloud-pricing.ts` exports the free-tier values: one live `n4` node, `24` running hours each UTC month, and `14` days of paused retention.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-003: Update the pricing page and the calculator

**Description:** As a visitor, I want the pricing page to state per-second billing from prepaid credit. I then know what I pay before I add credit.

**Acceptance Criteria:**

- [ ] `/pricing` contains no "Whole running hours" and no "Only whole running UTC hours meter".
- [ ] A billing fact states per-second billing and the per-run minimum from `MINIMUM_BILLED_SECONDS`.
- [ ] A billing fact states prepaid credit, the low-balance email, the optional automatic top-up, and the grace window before a pause.
- [ ] `src/config/cloud-pricing.ts` exports the free-tier values. The values are two free `n4` nodes, `24` running hours each UTC month, and `14` days of paused retention.
- [ ] The pause billing fact states the free paused days and the paused storage price.
- [ ] The free-tier card and the CTA strip state two free `n4` nodes, `24` running hours each UTC month, no card, and `14` days of retention.
- [ ] The `FleetCalculator` summary text contains no "whole".
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-004: Update the FAQ and its JSON-LD

**Description:** As a visitor, I want the FAQ to state the new billing model. My questions about credit and pause then have one answer.

**Acceptance Criteria:**

- [ ] The billing answer in `src/data/faqs.ts` states per-second billing and contains no "whole running UTC hours".
- [ ] The rates answer derives each rate from `cloudNodePlans` and states the per-second unit.
- [ ] The card answer states that the free tier needs no card and that a paid node runs from prepaid credit.
- [ ] The free-hours answer states `14` days of retention and contains no "60 days".
- [ ] A new question "How does prepaid credit work?" states the top-up amounts, the automatic top-up, the low-balance email, and the grace window.
- [ ] The `FAQPage` JSON-LD on `/pricing` contains each changed question and each changed answer.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-005: Update the home page offering

**Description:** As a visitor, I want the home page Console offering to match the pricing page. The two pages then state one offer.

**Acceptance Criteria:**

- [ ] The Console bullets in `src/config/offerings.ts` state two free `n4` nodes that share `24` running hours a month, and contain no "up to three".
- [ ] The Console bullets state per-second billing from prepaid credit.
- [ ] Verify in browser using agent-browser skill.
- [ ] `npm run lint` and `npm run build` exit 0.

### US-006: Update the Console blog guide

**Description:** As a reader of the Console guide, I want the free-tier terms and the billing section to match the Console. My first node then behaves as the guide states.

**Acceptance Criteria:**

- [ ] `posts/run-agro-on-mifune-console.md` states two free nodes, `24` running hours each UTC month, and `14` days of retention.
- [ ] The guide contains no "three free nodes", no "60 days", and no "archives the node's files".
- [ ] The billing section states per-second billing from prepaid credit and links to `/pricing`.
- [ ] The guide contains no "payments are off" sentence.
- [ ] Verify in browser using agent-browser skill.

### US-007: Mirror the changes in llm.txt

**Description:** As an AI assistant that reads the site, I want `public/llm.txt` to state the new offer. My answers then match the Console.

**Acceptance Criteria:**

- [ ] `scripts/generate-llm-txt.mjs` states per-second billing, prepaid credit, the per-run minimum, the pause behavior, and the free-tier values from `src/config/cloud-pricing.ts`.
- [ ] `public/llm.txt` contains no "whole running UTC hours", no "up to three n4 nodes", and no "60 days".
- [ ] `npm run build` regenerates `public/llm.txt` with no diff after the commit.

### US-008: Capture review evidence and get design quality sign-off

**Description:** As the design team, I want before and after screenshots of each changed surface. I can then confirm that the result meets or exceeds the expected quality.

**Acceptance Criteria:**

- [ ] `.agro/tasks/website-per-second-pricing/evidence/before/` and `.agro/tasks/website-per-second-pricing/evidence/after/` hold desktop and mobile screenshots of `/`, `/pricing`, the pricing FAQ, the calculator, and the Console guide.
- [ ] An agent-browser journey records the pricing page and the FAQ with annotated screenshots.
- [ ] `.agro/tasks/website-per-second-pricing/evidence/manual-review.md` lists each acceptance criterion with its evidence.
- [ ] `external` The design team signs off that the result meets or exceeds the expected quality. The sign-off names the evidence commit.

## Summary

The site states the current Console terms in five places: `src/config/cloud-pricing.ts`, the pricing page, the FAQ, the offerings, and `public/llm.txt`. The Console guide in `posts/run-agro-on-mifune-console.md` repeats the free-tier terms.

The site already differs from the Console in three facts:

1. The site states up to three free nodes. `config.yaml` in `mifunedev/agro-console` sets `platform.freeTier.maxLiveNodes` to `10`.
2. The site states 60 days of free retention. The Console uses `platform.pause.freeRetentionDays`, which is `14`.
3. The site states that a pause keeps only `/home/sandbox` and no Docker data. Since ADR #711 in `mifunedev/agro-console`, a pause keeps the overlay data volume with packages and Docker state.

The Console task `per-second-prepaid-billing` changes the billing model to per-second debits from prepaid credit at new prices. This task changes each site surface to the approved Console values. The design team approves the scope before the build and the quality after the build.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `src/config/cloud-pricing.ts` | `cloudNodePlans`, `formatHourlyUsd`, `HOURS_PER_MONTH`, `monthlyHourPresets`, `FREE_TIER_NODE_SPEC` | Single source of displayed prices |
| `src/app/pricing/page.tsx` | billing facts, hero, free-tier card, CTA strip, metadata description | Pricing page |
| `src/components/pricing/FleetCalculator.tsx` | `describeFleet` | Calculator text |
| `src/data/faqs.ts` | billing, rates, card, and free-hours answers | FAQ and JSON-LD source |
| `src/config/offerings.ts` | Console bullets | Home page offering |
| `posts/run-agro-on-mifune-console.md` | free-tier terms, billing table | Console guide |
| `scripts/generate-llm-txt.mjs` | static text, `HOURLY_RATES`, `MONTHLY_ESTIMATES` | `public/llm.txt` generator |
| `src/lib/schema.ts` | JSON-LD builders | Structured data |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| `/pricing` | Changed | Per-second billing, prepaid credit, pause facts, free-tier terms |
| `/` | Changed | Console offering bullets |
| `/blog/run-agro-on-mifune-console` | Changed | Free-tier terms and billing section |
| `/llm.txt` | Changed | Offer summary for AI assistants |
| `FAQPage` JSON-LD | Changed | New and changed answers |

## Storage

N/A. The site is static content and holds no state.

## Architectural Decisions

- `src/config/cloud-pricing.ts` stays the single source of each displayed value. Each page and `scripts/generate-llm-txt.mjs` reads from that file.
- The approved values in the Console task are the source of truth. This task copies those values and changes no Console behavior.
- The site states plans with included hours only after the Console ships the plans.
- The site states pause storage tiers only after the Console ships the tiers.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| `npm run lint` | lint of each changed file | US-002 to US-005 |
| `npm run build` | build and `llm.txt` generation | US-002 to US-007 |
| agent-browser journey | `/pricing`, FAQ, `/`, Console guide on desktop and mobile | US-003 to US-006, US-008 |

The repository has no unit test runner. The plan adds none.

## Design Principles

- One source of truth for each displayed value.
- Each page states the same offer.
- State only shipped behavior.
- The design team owns the scope approval and the quality sign-off.

## Out of Scope

- Plans with included hours. The Console places plans in a later stage.
- Pause storage tiers. The Console task `pause-storage-tiers` holds that decision.
- New pages, new visual design, and new illustrations.
- Changes to the Console.

## Open Questions

1. Who on the design team approves the scope and signs off on the quality: `<design approver>`? Gate G3 in `mifunedev/agro-console` `.agro/tasks/mifune-launch/PROGRAM.md` tracks this question.

The operator approved the Console values on 2026-11-14. Each spec price is `n4` `0.07`, `n8` `0.11`, `n16` `0.26`, `n32` `0.52`, and `n64` `0.64` per hour. The per-run minimum is 300 seconds. The hot paused disk price is `0.16` per GB-month. Top-ups are 10, 25, 50, and 100 USD. The low-balance warning and the grace window are 24 hours each. The free tier holds two `n4` nodes that share 24 running hours each month, with 14 days of paused retention.

A separate PR corrects the three facts that differ from production. That PR ships after agro-console#732 merges, as story E4-00 in the program record.

## Acceptance Criteria

- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] Each displayed price, minimum, and free-tier value equals the approved Console value.
- [ ] `/pricing`, `/`, the FAQ, the Console guide, and `public/llm.txt` contain no "whole running UTC hours", no "up to three", and no "60 days".
- [ ] `external` The design team approves the scope before US-002 starts.
- [ ] `external` The design team signs off that the result meets or exceeds the expected quality.
- [ ] `external` The site deploys only after the Console deploys the task `per-second-prepaid-billing` and the operator sets `features.payments` to `true`.

## Lessons
