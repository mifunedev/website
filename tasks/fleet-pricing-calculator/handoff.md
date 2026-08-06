# Handoff: fleet pricing calculator (issue #61)

**Repo:** `mifunedev/website` at `/home/sandbox/harness/.oh/worktrees/project/mifunedev/website`
**Issue:** [#61](https://github.com/mifunedev/website/issues/61) · **Branch:** `feat/61-fleet-pricing-calculator`
**Base:** `feat/59-cloud-pricing-page` (stacked — *not* `development`) · **Spec:** `tasks/fleet-pricing-calculator/prd.md`

> **State: all four stories are written, nothing is committed.** The working tree holds the entire
> implementation. A `git checkout .` loses it. Commit before anything else.

---

## Context

`/pricing` published three hourly-rate cards that answer *"what does one node cost per hour"* and
nothing else. The two questions a buyer arrives with — **"what will I pay a month?"** and **"what
does my mix of nodes cost?"** — were answered nowhere on the site. Separately, the upstream catalog
is moving from three node specs to five, and a `lg:grid-cols-3` grid with a `plan.spec === "large"`
column-span special case cannot survive that.

The spec (`tasks/fleet-pricing-calculator/prd.md`, 315 lines, US-001→US-004) replaces the cards with
a fleet calculator: a quantity stepper per tier, whole-hour presets, one summed total, and a
730-hour monthly reference. It was written and approved in a prior session as **specs-only**; the
operator approved implementation this session with the definition of done:

> *"the PR's submitted and apps updating and running in tmux sessions for me to verify finished result"*

---

## What is built (uncommitted)

```
 M scripts/generate-llm-txt.mjs      +27
 M src/app/pricing/page.tsx          -61 net
 M src/config/cloud-pricing.ts      +126
 M src/data/faqs.ts                  +27
 M src/sections/PricingSection.tsx     7
 ?? src/components/pricing/FleetCalculator.tsx   (untracked — 280 lines)
                                     5 files changed, 178 insertions(+), 70 deletions(-)
```

| Story | Where | State |
|---|---|---|
| **US-001** arithmetic | `src/config/cloud-pricing.ts` | done — `HOURS_PER_MONTH`, `monthlyHourPresets`, `FleetQuantities`, `emptyFleet()`, `fleetNodeCount()`, `fleetHourlyUsd()`, `fleetTotalUsd()`, `formatUsdTotal()`, `entryPlan`, plus the FR-7 R4 rewrite |
| **US-002** component | `src/components/pricing/FleetCalculator.tsx` | done — `"use client"`, no price arithmetic, calls US-001 helpers only |
| **US-003** page swap | `src/app/pricing/page.tsx` | done — grid deleted, `<FleetCalculator />` in place, orphaned `cloudNodePlans`/`formatHourlyUsd`/`isDefault` imports removed |
| **US-004** propagation | `src/data/faqs.ts`, `scripts/generate-llm-txt.mjs` | done in source — **`public/llm.txt` not yet regenerated** |
| *(spec-optional)* | `src/sections/PricingSection.tsx` | refactored to import `entryPlan` instead of its duplicate local reduce |

### Implementation decisions a successor should not re-litigate

- **Starts empty.** Initial state is `emptyFleet()`, so the first view is the spec's empty state
  ("Add a node above to price a fleet." + "Nodes start at $0.0384 an hour."), never `$0.0000/hr`.
- **Three per-card CTAs collapsed to one** fleet-level `Open the Console`. The spec records that all
  three pointed at the same `OFFERING_URLS.cloud`, so nothing is lost.
- **Hero's "Running more than three nodes? Talk to us" left alone.** It duplicates the node cap that
  `cloud-pricing-page/prd.md` wants in the FAQ only, but it is PR #60's shipped copy and out of this
  PRD's scope. Flagged to the operator, deliberately not changed.
- **`MAX_NODES_PER_SPEC = 24`** — required by the US-002 clamp criterion; spec §9 flags it as an
  implicit published number with no explanatory copy. Unresolved by design.
- **Sums in integer ten-thousandths, divided once.** Not stylistic: naive float gives
  `0.0384 × 5 = 0.19199999999999998`, and that error would be multiplied by 730.

---

## Verification already collected

**Gates green:**

```
npx tsc --noEmit    → EXIT 0
npm run lint        → EXIT 0   ("✔ No ESLint warnings or errors")
npx prettier --write <6 touched files>  → only FleetCalculator.tsx changed (class order)
```

**Arithmetic oracle** (spec §7 gate 5), run under Node v22.23.1 type-stripping — every value matches
the spec's pinned references:

```
formatUsdTotal:  $0.00  $28.03  $1,234.50
mixed fleet   :  1.1244  $820.81          (3 small + 2 large @ 730 h)
730h per spec :  Small $28.03 | Medium $50.52 | Large $368.36
emptyFleet    :  {"small":0,"medium":0,"large":0}  derived, count 0
presets       :  730 Always on | 240 Weekdays, 12 h | 160 Weekdays, 8 h — all integer
```

**Verified by rejection, not by exit 0:**

- grouping: `$1,000.00` · `$999,999.50` · `$1,234,567.89` (carry groups correctly after rounding)
- half-cent up: `50.516 → $50.52`, not `$50.51`
- drift genuinely avoided: naive `0.19199999999999998` vs integer path exactly `0.192`

**In-browser on the running `:3000` dev server** (session `pair`, headed):

- empty state correct, no `$0.0000/hr`; all three rates render unconditionally
- 3 Small + 2 Large → panel `$1.1244/hr` and `About $820.81 for 730 running hours in a month — an
  estimate from the hourly rates above, and there is no monthly plan.`
- row subtotals `3 × $0.0384 = $0.1152/hr` and `2 × $0.5046 = $1.0092/hr`
- live region: `5 nodes. $1.1244 per hour, or $820.81 for 730 running hours in a month — an
  estimate, and there is no monthly plan.` (FR-6 satisfied: figure and disclaimer in one sentence)
- steppers use `aria-disabled="true"` with **no** real `disabled` attribute; focus stays on `−` after
  clicking it at quantity 0

---

## Remaining work, in order

1. **Commit in three steps** (spec §7): data + docs (US-001) → component + swap (US-002/003) →
   propagation (US-004). Commit format `<type>: <description>`.
2. **`npm run build`** → exit 0, then `git restore public/sw.js`. Regenerates `public/llm.txt`;
   commit the regenerated file, never hand-edit it.
3. **Assertions against `.next/server/app/pricing.html`** (spec §7 gate 6): all three rates present
   as *static* text; every monthly figure co-located with `estimate`; `whole` and `not included`
   still present.
4. **`npx prettier --check`** on touched files only — repo-wide fails on 38 pre-existing files.
5. **Remaining browser checks** — light theme; 375 / 800 / 1280 px with no horizontal scroll;
   hours-preset switching updates the total; clamp at 24; a cleared field resolving to 0; and the
   focus ring on an hours pill, which comes from the `<label>` via `has-[:focus-visible]:` because
   the `sr-only` radio is 1px-clipped and `globals.css:145-148`'s `!important` outline renders
   invisible on it.
6. **`tasks/fleet-pricing-calculator/progress.txt`** — does not exist yet; the folder holds only
   `prd.md`.
7. **Push and open the PR against `feat/59-cloud-pricing-page`**, title matching the repo's
   convention (`feat(#61): …`, as #59/#51 use — *not* the `/git` skill's `FROM … TO …` form, which
   this repo does not follow).
8. **Leave `pnpm dev` running** in the `app-oh-website` tmux session — it is half the definition of
   done.

---

## Traps that cost time this session

- **The stack is mandatory.** `origin/development` has an old `/pricing` page but **no**
  `src/config/cloud-pricing.ts`. Basing on `development` will not compile.
- **Merge order.** PR #60 must merge first, and must **not** be merged with `--delete-branch` while
  #61 is stacked on it — that closes the child PR and it cannot be reopened. Retarget #61 to
  `development` first, delete branches last.
- **`next build` fights the dev server.** `pnpm dev` (pid 2893234) runs from this same checkout and
  shares `.next`. Stop it, build, then restart — do not run both.
- **`innerText` applies CSS `text-transform`.** Searching rendered text for `Your fleet` returns
  nothing; the uppercase eyebrow renders as `YOUR FLEET`. Cost one false "panel missing" reading.
- **Playwright's snapshot prints `aria-disabled` as `[disabled]`.** The tree cannot distinguish the
  two, and the distinction is an acceptance criterion — assert on the DOM attributes instead.
- **`$?` after a pipe is the pipe's last command**, not the tool's. `npx tsc --noEmit | head` reports
  `head`'s status. Redirect to a file and check the code directly.
- **agent-browser 0.8.5**: global options go *before* the subcommand; the full-page flag is `--full`
  not `--full-page`; viewport is `agent-browser set viewport <w> <h>`; and clicking by text silently
  reports success while missing — use `@ref`s from `snapshot -i`.

## Open questions carried from the spec (§9), still unresolved

- The monthly anchor: `$368.36/mo` is the *maximum* a Large can cost, presented as the headline
  monthly figure. Fallback if review rejects it is to ship the calculator **hourly-only** — it still
  replaces the cards and sums a fleet, with zero new pricing claims.
- The hours preset labels are new claims ("Weekdays, 12 h" assumes a 20-day month). Fallback is
  shipping `730` as the only preset — no component change needed.
- The 24-node cap is an implicit published number with no explanatory copy.
