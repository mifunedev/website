# PRD: Cloud Pricing Page

**Repo:** `mifunedev/website` · **Issue:** [#59](https://github.com/mifunedev/website/issues/59) · **Branch:** `feat/59-cloud-pricing-page` · **Base:** `development`
**Program spec + margin analysis:** `.oh/tasks/cloud-pricing-launch/prd.md`
**Blocked on:** `.oh/tasks/cloud-billing-guardrails/` (mifunedev/openharness-cloud#114) and operator gates #115, #116, #117

---

## 1. Introduction / Overview

`/pricing` deliberately publishes no prices — `src/app/pricing/page.tsx:108` says so verbatim: *"Mifune does not publish prices on this page."* The nav labels it "Deploy". Meanwhile any free sign-in already sees the real rates in the console's node-creation form, so the marketing site is the only surface hiding them.

Publish **hourly prices only**, and explain the billing mechanic plainly. Per decision R4, no monthly price is published: small and medium monthly are dominated SKUs (strictly worse for the customer than staying hourly at any usage), and large monthly is **retired** — it is only ever chosen above its break-even, which is exactly where it costs Mifune money. There is no monthly price to publish, now or later, until a repriced committed-use tier exists.

> **Amended 2026-08-04 — R4 is narrowed, not repealed.** Everything above still holds for a monthly
> **SKU**: none exists, none is pending, and large monthly stays retired. What changed is *display*.
> `tasks/fleet-pricing-calculator/prd.md` adds a 730-hour monthly **estimate**, computed from the
> hourly rate and always labelled an estimate, because "what will I pay a month" is the largest
> objection to hourly pricing and this page answered it nowhere. Every monthly figure the site emits
> must carry "there is no monthly plan" **in the same sentence** — see that PRD's FR-6.

| spec | vCPU / RAM / disk | hourly |
|---|---|---|
| Small (default) | 2 / 4 GB / 50 GB | **$0.0384** |
| Medium | 4 / 8 GB / 50 GB | **$0.0692** |
| Large | 8 / 30 GB / 200 GB | **$0.5046** |

## 2. Goals

- Correct the licence claim — the site says MIT in 15 places; it is Apache-2.0.
- Let an evaluator see what a node costs without signing up.
- Explain the billing mechanic: hourly, whole running UTC hours, destroy to stop.
- Say plainly that AI usage is not included, before anyone pays.
- Give the buyer who is bigger than self-serve a visible path to a conversation.

---

## 3. User Stories

### US-001: Replace every "MIT" licence claim with Apache-2.0

**Description:** As a visitor, I want the site to state the correct licence so I can trust what I am adopting.

**Why:** Open Harness was relicensed to Apache-2.0 in `c0d43afa` on 2026-07-24. Three of the 15 claims are JSON-LD that propagates into licence scanners and SBOM tooling; one is the social share card. Per `.oh/docs/open-core.md`, Apache-2.0 was chosen specifically for its patent grant, patent-retaliation clause, and §6 trademark withholding — so misstating it misrepresents the exact provisions that constitute the stated moat.

**Independent of every other story — ship this first, as its own commit.**

**Acceptance Criteria:**
- [ ] All 15 occurrences corrected across 9 files: `src/lib/schema.ts:41,66,98` · `src/app/opengraph-image.tsx:67` · `src/sections/HeroSection.tsx:90` · `src/config/offerings.ts:51` · `src/sections/PricingSection.tsx:20` · `src/app/pricing/page.tsx:20,75` · `src/app/services/page.tsx:365` · `src/data/faqs.ts:14` · `scripts/generate-llm-txt.mjs:29,42`
- [ ] `public/llm.txt` regenerated via `npm run build` and committed — lines 20 and 33 no longer say MIT
- [ ] `grep -rn "MIT" src/ public/llm.txt scripts/` returns nothing licence-related
- [ ] Copy reads naturally — "Apache-2.0 licensed", not a substitution that breaks a sentence
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill — homepage hero and `/services` show the corrected licence

### US-002: Add `cloud-pricing.ts` as the single source of published prices

**Description:** As a maintainer, I want every published price to come from one module, so a price change is a one-file edit and nothing can silently drift.

**Acceptance Criteria:**
- [ ] New `src/config/cloud-pricing.ts` exports `CloudNodePlan[]` with fields `spec`, `label`, `vcpu`, `ramGb`, `diskGb`, `hourlyUsd`
- [ ] Values exactly: small `2 / 4 / 50 / 0.0384` · medium `4 / 8 / 50 / 0.0692` · large `8 / 30 / 200 / 0.5046`
- [ ] **Also export `DEFAULT_NODE_SPEC = "small"`** (or an `isDefault` boolean on the plan). US-004 badges Small "Default" and must be able to verify that *inside this repo* — the upstream constant is not importable from here
- [ ] Field names mirror the upstream `node-specs.ts` so a side-by-side diff is legible
- [ ] **No monthly price field** — monthly is withdrawn per R4
- [ ] The dead `src/config/pricing.ts` shim is left untouched (zero importers)
- [ ] `OfferingPath` in `src/config/offerings.ts` is not extended
- [ ] Typecheck passes

**Provenance — copy this into the header comment verbatim; do not go looking for it.** The upstream repo is a *separate* repository and is not reachable from a `website` checkout. These values were transcribed from:

```
repo:   mifunedev/openharness-cloud
commit: b56c2dfe673aa3ac3f95b8018568130666f6ae7c   ("task: delete the unreachable theme reader, keep the tested rule (#111)", 2026-08-02)
specs:  packages/shared/src/node-specs.ts:18-23
prices: packages/shared/src/provider-catalog.yaml
```

Upstream `node-specs.ts:18-20` reads `small { vcpu 2, ramGb 4, diskGb 50 }`, `medium { 4, 8, 50 }`, `large { 8, 30, 200 }`, and `:23` is `export const DEFAULT_NODE_SPEC: NodeSpec = "small"`. The published hourly rates are `$0.0384 / $0.0692 / $0.5046` — **transcribe these, do not derive them.** Upstream computes each rate from a provider cost and a margin; **neither belongs in this repository**, in source or in a task file.

### US-003: Rewrite the `/pricing` hero and add the billing-facts strip

**Description:** As an evaluator, I want the page to open by telling me what I pay for and what I don't, and to explain the billing mechanic before showing me numbers.

**Scope note:** this story touches the hero, the new billing-facts section, page metadata, and **one sentence inside the operating-paths section**. That section (`page.tsx:94–223`, `aria-labelledby="operating-options-heading"`) is otherwise left standing — its `h2` at `:104` and every card below it survive until US-004 replaces them, so the page builds and renders correctly between the two stories.

The one exception: the sentence to delete at `:108` is the second half of the intro paragraph at `:106–109`, which lives *inside* that section. Delete that sentence only. Do not touch the heading or the cards.

**Acceptance Criteria:**
- [ ] `src/app/pricing/page.tsx:108` — *"Mifune does not publish prices on this page."* — deleted
- [ ] `:20` `description` and `:23` `title` rewritten for a page that publishes prices
- [ ] **Hero**: headline *"Pay by the hour your node runs."*; a paragraph stating AI usage is **not** included and the customer signs in to Claude or Pi with their own account; trust line `Signing in is free · A card is required before your first node · No free tier, no trial`
- [ ] Hero primary CTA `Open the Console` → `OFFERING_URLS.cloud`; tertiary link `Running more than three nodes? Talk to us →` → anchor `#deploy` (the target arrives in US-006; the anchor may dangle until then)
- [ ] **New "How billing works" section** states exactly four facts — one node is a dedicated VM, not shared infrastructure · only whole running UTC hours meter · queued, building, and failed time is free · destroying a node is how you stop paying
- [ ] `h1 → h2` order preserved; the new section has `aria-labelledby`
- [ ] Existing page shell and the three `JsonLd` blocks preserved
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill — light and dark themes at 1280px and 375px

### US-004: Replace the operating-paths section with hourly price cards and self-host

**Description:** As an evaluator, I want to see what each node size costs, without signing up.

**Acceptance Criteria:**
- [ ] The "two operating paths" section is replaced by a price-card grid importing from `cloud-pricing.ts`
- [ ] Three cards; primary number is the hourly rate (`text-4xl sm:text-5xl`, `tabular-nums`) captioned *"per whole hour the node is running"*, then `N vCPU` / `N GB RAM` / `N GB SSD` / `A dedicated VM, not shared infrastructure`, then a `min-h-11` CTA `Create a Small/Medium/Large node` → `OFFERING_URLS.cloud`
- [ ] Small badged **"Default"** — verifiable against the `DEFAULT_NODE_SPEC` / `isDefault` that US-002 adds to `cloud-pricing.ts`, not against the upstream repo — never "Most popular" (no data supports it)
- [ ] Badge uses an eyebrow `<span>` + `border-oh-accent/40`, **not** the `bg-green-500/10` treatment at `pricing/page.tsx:121`
- [ ] **Self-host section** follows the cards: Apache-2.0, genuinely free; retains who-operates-it / best-fit; CTA → `OFFERING_URLS.openSource`
- [x] **No monthly price appears anywhere on the page** — *held at ship time. Superseded 2026-08-04: `tasks/fleet-pricing-calculator/prd.md` deletes this card grid entirely and displays a monthly **estimate**. No monthly **SKU** appears, then or now.*
- [ ] Card `<h3>` is the spec name, not the price
- [ ] Grid reflows `grid-cols-1 → sm:grid-cols-2` (Large `sm:col-span-2`) `→ lg:grid-cols-3`, skipping `md`
- [ ] `text-oh-accent-raised` used on any `bg-oh-raised` surface
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill — light and dark themes at 1280px and 375px, no horizontal scroll

### US-005: Parameterise `FAQSection` and add pricing FAQs

**Description:** As an evaluator, I want my remaining pricing questions answered on the page.

**Why:** `src/data/faqs.ts` feeds both the homepage list and the homepage `faqPageSchema`, so appending would render pricing entries on the homepage. And `FAQSection.tsx:9-10` hardcodes `homepage-faq-${index}-trigger|panel`, which is wrong on `/pricing` and would collide on `aria-controls` if both rendered on one route.

**Acceptance Criteria:**
- [ ] `src/data/faqs.ts` gains a second export `pricingFaqs`; the existing `faqs` export is unchanged
- [ ] `FAQSection` accepts `faqs`, `heading`, `eyebrow`, `subheading`, `idPrefix` props instead of importing the module constant
- [ ] **`subheading` is required, not optional to skip.** `FAQSection.tsx:61-63` hardcodes a third line of homepage-specific copy — *"What the workspace does, who operates it, and how Mifune can help."* — which would otherwise render verbatim under the pricing FAQ heading
- [ ] Homepage render is byte-identical
- [ ] Five entries: how billing works · what a node costs · is AI usage included · do I need a card to sign up · how many nodes can I run
- [ ] The node-limit answer says "**three by default**" and appears **only in the FAQ**, never on a card — `USER_SANDBOX_CAP` is a deployment env var, not a public commitment
- [ ] `<JsonLd data={faqPageSchema(pricingFaqs)} />` renders on `/pricing` only
- [ ] Every price string in an answer traces to `cloud-pricing.ts`
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill — keyboard-expand each entry, `aria-expanded` and `aria-controls` correct

### US-006: Add the deployment conversation as the page's final section

**Description:** As a buyer too big for self-serve, I want to start a conversation without leaving the page.

**Why (CEO decision):** primary stays self-serve — at ship time Stripe is live, so the console is a working checkout and a contact form in front of it would destroy the only zero-cost acquisition channel. But $8.23/month of net gross profit on a small node is not the first dollar, so the page needs a visible path for the larger buyer. The form goes *after* the FAQ: the FAQ answers objections, the form catches the buyer whose objection it didn't.

**Acceptance Criteria:**
- [ ] `CTASection` gains **one** optional prop `referrer?: string`, defaulting to `"open-harness-deployment-form"`, threaded into the existing `payload.Referrer` (hardcoded today at `CTASection.tsx:54`)
- [ ] Homepage render of `CTASection` is byte-identical — no prop passed, same default
- [ ] `/pricing` renders `<CTASection referrer="pricing-page-deployment-form" />` as its final section, after the FAQ
- [ ] The support panel at `pricing/page.tsx:225-260` is removed; its job survives as one inline link `Mifune engineering support →` → `/services`
- [ ] **Strip the imports US-004 and this story orphan** — `cloudOptions`, `Check`, `Mail`, `supportOffering`. Nothing catches these: `eslint-config-next` ships no `no-unused-vars` rule and `tsconfig.json` sets neither `noUnusedLocals` nor `noUnusedParameters`, so they will pass lint and build while sitting dead in the diff
- [ ] The hero's `#deploy` anchor resolves to this section
- [ ] The words **"design partner"** do not appear on the page
- [ ] The three-node line is phrased as a **question**, not a published limit
- [ ] No new client component — `CTASection` is already `"use client"` (`:1`)
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill — submit the form and confirm the `Referrer` value reaching `/api/contact`

### US-007: Relabel nav and footer, propagate prices to homepage and llm.txt

**Description:** As a visitor, I want the nav to say "Pricing" when the page shows prices, and to see the entry price on the homepage.

**Acceptance Criteria:**
- [ ] `src/components/nav/TopNavBar.tsx:30` label `"Deploy"` → `"Pricing"` (one `menuItems` array serves both desktop and mobile)
- [ ] `src/sections/FooterSection.tsx` Product-column link relabelled to match
- [ ] Route stays `/pricing`; `src/app/sitemap.ts` unchanged (already listed at 0.85) and not accidentally edited
- [ ] Homepage `src/sections/PricingSection.tsx` gains one line — *"Nodes start at $0.0384 an hour."* — plus a link to `/pricing`, importing from `cloud-pricing.ts`. It does **not** mirror the card grid
- [ ] `scripts/generate-llm-txt.mjs` includes the three hourly rates sourced from `cloud-pricing.ts`, not re-hardcoded; `public/llm.txt` regenerated and committed
- [ ] **Verify the import actually resolves under plain `node`, and record what it depends on.** `prebuild` runs `node scripts/generate-llm-txt.mjs` with no tsx/ts-node, so importing a `.ts` module relies on Node's unflagged type-stripping. It works on the Node in use here (v22.23.1), but the repo pins no version — no `.nvmrc`, no `engines`, no CI or Dockerfile node config — so a different environment could silently break `llm.txt` generation. Either add an `engines.node` floor to `package.json`, or route the shared values through a `.mjs`/`.json` sibling that both the TS app code and plain-Node script can import. State which you chose and why
- [ ] Nav active state still highlights on `/pricing`
- [ ] `npm run lint` passes
- [ ] Typecheck passes
- [ ] Verify in browser using agent-browser skill

---

## 4. Non-Goals

| Not doing | Why |
|---|---|
| Publishing any monthly **SKU** | Withdrawn per R4. A monthly *estimate* is now displayed — see the §1 amendment |
| JSON-LD `offers` / `PriceSpecification` | A rich result surfaces a price stripped of its mechanic — the exact failure this design prevents. **Still a non-goal**, and more so now: a monthly estimate in a rich result is worse, not better |
| Hourly/monthly toggle | No annual plan exists |
| Competitor comparison table | Competitor data is unsourced |
| ~~Cost calculator~~ — **moved out 2026-08-04** | Now `tasks/fleet-pricing-calculator/prd.md`. The two stated objections were met, not waived: client state is confined to one child component with the page still a server component and every rate still rendering server-side; and the bucket-edge objection is answered by restricting the hours control to **integer whole-hour presets**, since a slider would let a visitor express a fractional hour the meter cannot produce |
| Self-host as a "$0" card in the price grid | A licence and a machine do not belong in the same row |
| A separate 6-step "how it works" or "not included" band | Folded into the hero and the billing-facts strip |
| Marketing the browser IDE | `README.md:778` lists it as an MVP non-goal |
| "Unlimited orgs and members" as a written claim | True in code, but absence of a limit is not a commitment never to charge |
| Deleting `src/config/pricing.ts` | Dead shim, zero importers — unrelated churn |
| Adding a test framework | None exists; do not add one as a side effect |

## 5. Design Considerations

Reuse the house idioms; introduce no new primitives.

- Shell: `<header><TopNavBar/></header>` + `<main id="main-content" tabIndex={-1} className="scroll-mt-20">` + `<FooterSection/>`.
- Cards `rounded-2xl border border-border bg-card p-6 sm:p-8`; containers `mx-auto max-w-6xl`; sections `py-20 sm:py-24`.
- Primary CTA: copy the existing class string (`inline-flex min-h-11 … bg-oh-solid … focus-visible:ring-oh-focus`).
- Type: `font-montserrat`; h2 `text-3xl font-semibold sm:text-4xl`; eyebrows `font-mono text-xs font-semibold uppercase tracking-[0.22em]`.
- **No new shadcn primitives** — Badge, Table, Tabs, Switch, Accordion do not exist here and the house style is hand-rolled. A `<span>` is the badge; a `<ul>` is the spec list.
- Every interactive target `min-h-11`; external links `target="_blank" rel="noopener noreferrer"` + `<ExternalLink aria-hidden="true"/>` + sr-only "(opens in a new tab)".
- Price block `flex flex-wrap items-baseline gap-1` with `tabular-nums`, so `/hr` wraps rather than overflowing at 320px.
- Accessibility is load-bearing — the last three commits on this repo were all a11y fixes.

## 6. Technical Considerations

- **No test framework exists.** Verification is `npm run lint`, `npm run build`, `npx prettier --check .`, plus browser checks. "Typecheck passes" means `npx tsc --noEmit` is clean **and** `npm run build` completes — `next build` logs ESLint failures but still exits 0, so a build alone does not prove lint is green.
- **`npm run lint` was broken at baseline in this worktree and is now fixed** (commit `b0eeba9`). ESLint's legacy resolver walked past the project root into the parent checkout's `.eslintrc.json`, double-loading `@next/next` and exiting 1 regardless of code. `"root": true` was added to `.eslintrc.json`. If you see *"Plugin @next/next was conflicted between…"*, that fix has been reverted — restore it rather than working around it.
- `npm run build` regenerates `public/llm.txt` via `prebuild`; commit it.
- `public/sw.js` regenerates on every build (PWA plugin) — `git restore` it to keep diffs focused.
- Prettier with `prettier-plugin-tailwindcss` enforces class order — run `npx prettier --write` on the files you touched before committing.
- **Check prettier on your own files only, never repo-wide.** `npx prettier --check src/ scripts/` fails on **38 files at baseline** on untouched `HEAD` (verified by stashing). That drift is pre-existing and reformatting it would bury a pricing diff under hundreds of unrelated lines. `npx prettier --check <the files you changed>` is the criterion.
- Use `git -C <abs-path>` — the clones share a shell working directory.

## 7. Success Metrics

- Zero MIT claims remain in the repo.
- Zero price strings on the site that do not trace to `cloud-pricing.ts`.
- A visitor can learn what a node costs without signing up — the current answer is "no".
- The rendered `/pricing` contains the substrings `whole`, `not included`, and **no** monthly price.
  *(Amended 2026-08-04: the first two still hold and are re-asserted by the calculator PRD. The third
  becomes "no monthly **SKU** price" — a labelled 730-hour estimate is now expected in the output, and
  the replacement metric is that every monthly figure sits in the same sentence as "no monthly plan".)*
- Lead attribution distinguishes pricing-page enquiries from homepage enquiries.

## 8. Resolved decisions

1. **The hero's "Talk to us" line carries no response time.** `CTASection` already promises a reply within 24 hours at the point of commitment. The hero line is wayfinding to an in-page anchor, not a promise surface — repeating the commitment above the fold only doubles the places it can be broken.
2. **No monthly price will be published later either.** Large monthly is retired, not suspended (see §1), so there is no pending SKU this page is holding a slot for.

   > **Amended 2026-08-04.** Still true of a monthly **SKU** — nothing is being held a slot for. A
   > monthly **estimate** derived from the hourly rate is now displayed per
   > `tasks/fleet-pricing-calculator/prd.md`. The distinction is load-bearing and must appear in the
   > copy itself, not only here: a figure a visitor can compute from a published rate is not a price
   > we are offering to charge.

3. **The three price cards were replaced, not supplemented** (2026-08-04). The calculator is the
   pricing section, so there is one place to look. This also removes the `lg:grid-cols-3` grid and its
   `spec === "large"` column-span special case at `page.tsx:202`, which would not have survived the
   upstream move from three node rungs to five
   (`mifunedev/openharness-cloud` `.oh/tasks/node-catalog-repricing/prd.md`).
