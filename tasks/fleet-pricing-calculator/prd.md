# PRD: Fleet pricing calculator

**Repo:** `mifunedev/website` · **Issue:** _TBD_ · **Branch:** `feat/<issue>-fleet-pricing-calculator` · **Base:** `development`
**Supersedes a non-goal in:** `tasks/cloud-pricing-page/prd.md` §4 (the “Cost calculator” row)
**Upstream catalog:** `mifunedev/openharness-cloud` `.oh/tasks/node-catalog-repricing/prd.md`

---

## 1. Introduction / Overview

`/pricing` publishes three hourly rates as three cards (`src/app/pricing/page.tsx:197-250`). The cards
answer *"what does one node cost per hour"* and nothing else. The two questions a buyer actually
arrives with — **"what will I pay a month?"** and **"what does my mix of nodes cost?"** — are answered
nowhere on the site.

Replace the cards with a **fleet calculator**: a quantity stepper per tier, a whole-hours selector, and
one summed total with a monthly reference figure.

### This reverses a recorded decision. Read this before writing code.

`tasks/cloud-pricing-page/prd.md` §4 listed **"cost calculator"** as a non-goal, for two stated reasons:

> *a calculator needs client state, and UTC-bucket metering makes hourly inputs wrong at bucket edges*

Both are addressed, not waved away:

- **Client state** — the calculator is a single `"use client"` child. The page itself stays a server
  component and every published rate still renders server-side (FR-4).
- **Bucket edges** — this is the substantive objection and it is the reason the hours control is a
  **fixed set of integer whole-hour presets**, never a slider or a free number field. A slider lets a
  visitor express 7.5 hours, which the meter cannot produce; an integer preset cannot be wrong at a
  bucket edge. See US-001 and FR-3.

Decision **R4** (`cloud-pricing-page/prd.md` §1 and §8; `src/config/cloud-pricing.ts:28-29`) says no monthly price is
published, "now or later". **R4 is narrowed, not repealed.** There is still no monthly *SKU* and none
is pending. What changes is display only: a 730-hour monthly *estimate*, computed from the published
hourly rate and always labelled an estimate. Every monthly number must carry that distinction — see
FR-6, which is the single most important requirement in this document.

### A second reason to build this now

The upstream catalog is moving from three rungs to five (`node-catalog-repricing/prd.md`). Three cards
in a `lg:grid-cols-3` grid with a `spec === "large"` column-span special case (`page.tsx:202`) do not
survive that. A calculator driven by `cloudNodePlans.map(...)` does — with **zero component changes**
(FR-5). Building the tier list as rows now is cheaper than rebuilding the grid later.

## 2. Goals

- Answer "what will this cost me a month" on the pricing page, for the first time.
- Let a visitor price a **mix** of node sizes, not one node at a time.
- Make the tier presentation survive the three-to-five rung change as a data-only edit.
- Publish a monthly figure without implying a monthly plan exists.
- Introduce no new dependency, no new UI primitive, and no test framework.

---

## 3. User Stories

### US-001: Add fleet arithmetic to `cloud-pricing.ts`

**Description:** As a maintainer, I want every number the calculator shows to be computed in the same
module that holds the prices, so the single-source invariant (`cloud-pricing-page/prd.md` §7) still
holds and `scripts/generate-llm-txt.mjs` can reuse the same helpers.

**Why here and not in the component:** `generate-llm-txt.mjs` imports only from `cloud-pricing.ts`
(`:28-31`). Arithmetic living in a React component is unreachable from the `prebuild` script and from
the verification oracle in §7.

**Acceptance Criteria:**

- [ ] New exports in `src/config/cloud-pricing.ts`: `HOURS_PER_MONTH = 730`, `monthlyHourPresets`,
      `FleetQuantities`, `emptyFleet()`, `fleetNodeCount()`, `fleetHourlyUsd()`, `fleetTotalUsd()`,
      `formatUsdTotal()`, `entryPlan`
- [ ] **`emptyFleet()` is derived from `cloudNodePlans`** — never a literal
      `{ small: 0, medium: 0, large: 0 }`. `FleetQuantities` is `Record<NodeSpec, number>`
- [ ] `monthlyHourPresets` holds exactly three entries, every `hours` value a **whole integer**:
      `730` ("Always on", default) · `240` ("Weekdays, 12 h" = 12 × 20) · `160` ("Weekdays, 8 h" = 8 × 20)
- [ ] **`formatUsdTotal(usd)` is a new formatter, separate from `formatHourlyUsd`** — 2 decimals with
      thousands grouping, hand-rolled (not `Intl.NumberFormat`, so server and client emit
      byte-identical strings with no ICU dependency)
- [ ] `formatHourlyUsd` is **unchanged** and still 4 decimals. A doc comment at `formatUsdTotal`
      states why the two exist: an hourly **rate** is a published price and rounding `$0.0384` to
      `$0.04` restates it by 4.2%; a period **total** is a dollars-and-cents figure compared against
      an invoice
- [ ] Fleet sums are computed in integer ten-thousandths and divided once, so a mixed fleet cannot
      accumulate float drift (`0.0384 × 5` is `0.19199999999999998` in plain float arithmetic)
- [ ] `entryPlan` is the cheapest plan, derived by reduce over `cloudNodePlans`
- [ ] The R4 paragraph at `:28-29` is rewritten per FR-7
- [ ] Pinned by the §7 oracle: `formatUsdTotal` → `$0.00`, `$28.03`, `$1,234.50`; 730 h totals →
      Small `$28.03`, Medium `$50.52`, Large `$368.36`; fleet of 3 small + 2 large →
      `fleetHourlyUsd` `1.1244`, `fleetTotalUsd` at 730 h → `$820.81`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### US-002: Build the `FleetCalculator` client component

**Description:** As a visitor, I want to set how many of each node size I plan to run and see one
total, so I can price my actual situation instead of one node at a time.

**Acceptance Criteria:**

- [ ] New `src/components/pricing/FleetCalculator.tsx`, `"use client"`, containing **no arithmetic** —
      it calls the US-001 helpers only
- [ ] Tier rows are a `<ul role="list">`, one row per entry of `cloudNodePlans`, rendered
      **unconditionally regardless of quantity**
- [ ] Each row shows: label as `<h3>` · the `Default` badge when `isDefault(plan.spec)` · a
      `font-mono` spec line `N vCPU · N GB RAM · N GB SSD` · the hourly rate via `formatHourlyUsd` ·
      the stepper · and, only when quantity > 0, a subtotal showing the arithmetic
      (`3 × $0.0384 = $0.1152/hr`)
- [ ] **Quantity control is a native `<input type="number">` plus two `<button>`s** — no new
      dependency, no `<input type="range">`. Range is the wrong control for an exact small integer,
      and `@radix-ui/react-slider` is not installed
- [ ] Quantity clamps to `0…24` integer; a cleared field resolves to `0`
- [ ] Stepper buttons use **`aria-disabled`, not `disabled`** — a real `disabled` drops the button
      from the tab order, so pressing `−` down to zero would send focus nowhere. Verified: focus
      stays on the `−` button at quantity 0
- [ ] **Hours control is a `<fieldset>` of native radios** over `monthlyHourPresets` (native radios
      give roving arrow-key focus for free), styled as segmented pills with the input `sr-only`
- [ ] **The focus ring on each hours pill comes from the `<label>`** via
      `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-oh-focus`. An `sr-only` input is
      1px-clipped, so the `!important` outline forced by `globals.css:145-148` renders invisible —
      a silent WCAG 2.4.7 failure of the same class PRs #55 and #56 fixed
- [ ] Selected-pill styling is driven by React state, not the `:checked` pseudo-class
- [ ] Total panel shows the fleet hourly figure via **`formatHourlyUsd`** (it is a rate) and the
      monthly figure via **`formatUsdTotal`** (it is a total)
- [ ] **Empty state (fleet of 0) does not render `$0.0000/hr`** — it reads as "free" three sections
      below a hero that says "No free tier, no trial". It shows *"Add a node above to price a
      fleet."*, the standing line *"Nodes start at {entryPlan rate} an hour."*, and **no monthly
      line at all**
- [ ] An `sr-only` `<p role="status" aria-live="polite">` summarises count, hourly, and monthly.
      Initialised to the sentence for the default fleet so server and client HTML match; the
      announcement string is debounced ~350 ms so typing `12` does not double-announce. The visible
      numbers update instantly
- [ ] The visible figures are **not** `aria-hidden` — a duplicate announcement is far less harmful
      than a live region that silently fails
- [ ] One fleet-level CTA `Open the Console` → `OFFERING_URLS.cloud` (the three per-card CTAs it
      replaces all pointed at the same URL), with the house external-link treatment
- [ ] No `framer-motion` count-up on the total — moving text under WCAG 2.2.2, and
      `globals.css:128-140` already forces `0.01ms` transitions under reduced motion, so it would
      render as two different experiences of the same price
- [ ] A comment at the top of the file states FR-5's three rules so the next editor does not hardcode
      a fourth spec key
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Verify in browser using agent-browser skill

### US-003: Swap the card grid for the calculator on `/pricing`

**Description:** As a visitor, I want the pricing section to be the calculator, not three cards plus a
calculator, so there is one place to look.

**Acceptance Criteria:**

- [ ] The `<article>` grid at `src/app/pricing/page.tsx:197-250` is **deleted** and
      `<FleetCalculator />` renders in its place
- [ ] The surrounding `<section>`, eyebrow, `<h2>`, `aria-labelledby`, intro paragraph, and the
      support link at `:252-260` all stay **server-rendered**
- [ ] `page.tsx` remains a server component — no `"use client"`, no hooks
- [ ] The `plan.spec === "large" ? "sm:col-span-2 lg:col-span-1"` special case at `:202` is gone
- [ ] Imports orphaned by the deletion (`formatHourlyUsd`, `isDefault` at `:10-11`) are removed —
      nothing in this repo catches them (`cloud-pricing-page/prd.md` US-006)
- [ ] The self-host section, FAQ section, and `CTASection` below are untouched
- [ ] `h1 → h2 → h3` heading order preserved, no level skipped
- [ ] `npm run build` succeeds; `git restore public/sw.js` afterwards
- [ ] All three published rates appear as **static text** in `.next/server/app/pricing.html`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Verify in browser using agent-browser skill — light and dark, 375 / 800 / 1280 px, no
      horizontal scroll

### US-004: Propagate the monthly reference to the FAQ and `llm.txt`

**Description:** As someone asking an LLM what Open Harness Cloud costs, I want it to have the monthly
figure and the fact that there is no monthly plan, so it does not invent one.

**Acceptance Criteria:**

- [ ] `src/data/faqs.ts:68` — the "What does a node cost?" answer gains one clause with the monthly
      estimate, **derived from `cloudNodePlans`**, never hardcoded. The FAQ count stays at five
      (`cloud-pricing-page/prd.md` US-005)
- [ ] That clause states "not a monthly plan" **inside the same sentence** as the figure — this
      answer propagates into `faqPageSchema`, so an adjacent disclaimer would be stripped
- [ ] `scripts/generate-llm-txt.mjs:80` — *"There is no monthly price, no free tier, and no trial."*
      is now false. Rewritten to keep "no monthly plan, no free tier, no trial" while giving the
      per-spec 730-hour figures, generated from `cloudNodePlans` + `formatUsdTotal`
- [ ] A `MONTHLY_ESTIMATES` const is added beside the existing `HOURLY_RATES` (`:37-42`), built the
      same way
- [ ] **The import mechanism is unchanged** — `.nvmrc` / Node 22 type-stripping is load-bearing and
      documented at `:12-19`
- [ ] `public/llm.txt` regenerated via `npm run build` and committed; never hand-edited
- [ ] `src/sections/PricingSection.tsx` homepage output is **byte-identical** (optionally refactored
      to import `entryPlan` instead of its local reduce — same rendered bytes either way)
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

---

## 4. Functional Requirements

- **FR-1:** Every price string on the site continues to trace to `src/config/cloud-pricing.ts`. No
  component, script, or FAQ answer hardcodes a number.
- **FR-2:** An hourly **rate** is displayed at 4 decimals (`formatHourlyUsd`); a period **total** is
  displayed at 2 decimals with grouping (`formatUsdTotal`). A rate is never rounded to 2 decimals.
- **FR-3:** Every selectable hour value is a whole integer. No control on the page may produce a
  fractional hour count, because a fraction of a UTC hour cannot meter.
- **FR-4:** Every published hourly rate must render **server-side, unconditionally, at any fleet
  quantity**. Gating render on a `mounted` flag to suppress a hydration warning is forbidden — it
  would delete the prices from the static HTML.
- **FR-5:** Growing `cloudNodePlans` from three entries to five must require **zero** component
  changes. Guaranteed by three rules, each a review item: (1) fleet state derives from
  `cloudNodePlans`; (2) all rendering is `.map`, with **no `plan.spec === "…"` comparison anywhere**;
  (3) tiers are single-column rows, never a fixed grid column count.
- **FR-6:** Every monthly figure the site emits — page, FAQ answer, `llm.txt` — must be accompanied,
  **in the same sentence**, by the fact that there is no monthly plan.
- **FR-7:** `cloud-pricing.ts:28-29` must state both halves of the narrowed R4: no monthly SKU exists
  or is pending, **and** multiplying a transcribed rate by a user-chosen quantity is not a violation
  of "TRANSCRIBE, NEVER RECOMPUTE" — deriving a rate from provider cost still is.
- **FR-8:** Provider cost, provider margin, and provider identifiers must not appear in this
  repository, in source or in a task file. Unchanged from `cloud-pricing-page/prd.md`.

## 5. Non-Goals

| Not doing | Why |
|---|---|
| Any monthly SKU, plan, or committed-use price | R4 stands. Only the *display* of an estimate changes |
| JSON-LD `offers` / `PriceSpecification` | `cloud-pricing-page/prd.md` §4 excluded it because a rich result strips the price of its mechanic — a monthly estimate makes that worse, not better |
| Competitor comparison table | Still unsourced; unchanged non-goal |
| A slider or free-form hours input | Produces fractional hours the meter cannot bill — the exact objection at `prd.md` §4 |
| Adding a test framework | None exists; `cloud-pricing-page/prd.md` §4 says do not add one as a side effect |
| Any new npm dependency | `@radix-ui/react-slider` is not installed and is not needed |
| Currency selection, tax, or discounts | None exist in the product |
| Persisting the fleet to a URL or storage | No requirement; adds hydration surface for no buyer benefit |
| Changing `src/lib/schema.ts` or `src/app/sitemap.ts` | Out of scope; guard with `git diff --stat` |

## 6. Design Considerations

Reuse the house idioms; introduce no new primitives (`cloud-pricing-page/prd.md` §5).

- Rows `divide-y divide-border border-y border-border`; container `mx-auto max-w-6xl`.
- Type `font-montserrat`; eyebrows `font-mono text-[10px] font-semibold uppercase tracking-[0.18em]`.
- The `Default` badge is the existing `<span>` treatment copied verbatim from `page.tsx:210`
  (`border-oh-accent/40`), **not** the `bg-green-500/10` variant.
- Price blocks `flex flex-wrap items-baseline gap-1` with `tabular-nums`, so `/hr` wraps rather than
  overflowing at 320 px (`prd.md` §5).
- Every interactive target `min-h-11` / `h-11 w-11`.
- **This section sits on `bg-background` / `bg-card`, not `bg-oh-raised`** — so `text-oh-accent` is
  correct and `text-oh-accent-raised` would be wrong. Called out because `prd.md` US-004 mandates the
  opposite rule for raised surfaces and it is an easy copy-paste error.
- `prettier-plugin-tailwindcss` is authoritative on class order — run `npx prettier --write` and do
  not hand-tune.
- The spec metadata and `Default` badge that the deleted cards carried move into the rows; nothing is
  lost. *"A dedicated VM, not shared infrastructure"* is **not** repeated per row — it is already the
  first of the four billing facts directly above (`page.tsx:50-54`).

## 7. Technical Considerations

- **No test framework, and do not add one.** Six gates, in order:
  1. `npm run lint` → exit 0. If you see *"Plugin @next/next was conflicted between…"*, the
     `"root": true` fix in `.eslintrc.json` was reverted — restore it (`prd.md` §6).
  2. `npx tsc --noEmit` → exit 0. **`next build` exits 0 even when ESLint fails**, so the build alone
     proves nothing about lint.
  3. `npm run build` → exit 0; regenerates `public/llm.txt`; then `git restore public/sw.js`.
  4. `npx prettier --check` on **touched files only** — repo-wide fails on 38 pre-existing files
     (`prd.md` §6).
  5. **Arithmetic oracle**, using the same Node 22 type-stripping `prebuild` already relies on, so it
     needs no new tooling:
     ```
     node --input-type=module -e "import('./src/config/cloud-pricing.ts').then(m=>{
       console.log(m.formatUsdTotal(0), m.formatUsdTotal(28.032), m.formatUsdTotal(1234.5));
       const f=m.emptyFleet(); f.small=3; f.large=2;
       console.log(m.fleetHourlyUsd(f), m.formatUsdTotal(m.fleetTotalUsd(f, m.HOURS_PER_MONTH)));
     })"
     ```
     Expected: `$0.00 $28.03 $1,234.50` then `1.1244 $820.81`.
  6. **Assertions against built `.next/server/app/pricing.html`** — this is how US-002/003/004 of the
     previous PRD were actually validated: all three rates present as static text; every monthly
     figure co-located with the word `estimate`; `whole` and `not included` still present.
- Run a command against input it must **reject**, not only input it accepts — a check that exits 0 on
  valid input proves only that it did not object, which is also true when it looks at nothing. For
  the oracle, that means also confirming a fleet of 0 yields the empty-state path rather than `$0.00`.
- Use `git -C <abs-path>` — the clones share a shell working directory.
- Commit in three independently-buildable steps, matching how the previous PRD shipped:
  data + docs (US-001) → component + swap (US-002, US-003) → propagation (US-004). The monthly parts
  live in commits 1 and 3, which is also the clean retreat if §9's open question resolves against us.

## 8. Success Metrics

- A visitor can price a mixed fleet and see a monthly figure — currently impossible on any surface.
- Zero price strings that do not trace to `cloud-pricing.ts`.
- Every monthly figure in the rendered HTML sits in the same sentence as "no monthly plan".
- All three hourly rates remain in the **static** prerendered HTML.
- Growing `cloudNodePlans` to five entries changes **no** file under `src/components/`.

## 9. Open Questions

- **The monthly reference re-opens what R4 closed.** `$368.36/mo` for a Large will be quoted back at
  us and repeated by LLMs from `llm.txt`. It is also the *maximum* a node can cost, presented as the
  headline monthly figure — an anchor that overstates the product for anyone not running 24/7. The
  hours presets are the mitigation: they make 730 one visible scenario rather than "the" price. If
  review rejects this, the fallback is to ship the calculator **hourly-only** — it still replaces the
  cards and sums a fleet, with zero new pricing claims — and take the monthly decision separately.
- **The hours preset labels are new claims.** "Weekdays, 12 h" assumes a 20-day month. Small, but this
  repo's bar rejected "Most popular" for lacking data. The distinction: an arithmetic scenario the
  visitor selects asserts nothing about other buyers. If that reasoning is rejected, ship `730` as the
  only preset — no component change required.
- **The 24-node cap is an implicit published number.** `cloud-pricing-page/prd.md` US-005 keeps the
  three-node default limit in the FAQ only, never near a price. A `+` button has to stop somewhere;
  24 is chosen with no explanatory copy. Optionally, surface the hero's existing
  *"Running more than three nodes? Talk to us →"* line inside the calculator once the fleet exceeds
  three — it adds no new string and catches the large buyer at the moment of intent, but it is a
  deliberate loosening of a recorded criterion.
- **"TRANSCRIBE, NEVER RECOMPUTE" now has a visible exception.** The page multiplies. FR-7's comment
  is the only thing preventing a future maintainer from reading that as licence to derive a rate from
  cost and margin. This file has already been bitten once by a stale comment (`1e60be8`).
