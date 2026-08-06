# Handoff: the node ladder, across two surfaces

One initiative, two repos. **New hardware options drive the Console; the pricing calculator is the
downstream website consequence.** This maps that intent — it is not a build log. The build log is
`progress.txt` beside this file.

---

## The decision

The node catalog moves from **three t-shirt specs to five RAM-numbered rungs**, on gen-3 hardware,
with price becoming a stated input rather than a computed output.

Three changes that had to ship together, because each alone leaves the catalog incoherent
(`openharness-cloud/.oh/tasks/node-catalog-repricing/prd.md`):

1. **Gen-3 flavors.** `b3-32` beats `b2-30` on every hourly axis — same 8 cores, +2 GB RAM, 28%
   cheaper per hour.
2. **Close the ladder gap, add a top rung.** `medium`→`large` was a **7.3× price jump** with nothing
   between. New rungs at 16 GB and 64 GB bring the largest step down to 2.2×.
3. **Invert how price is computed.** `pricing.ts` derived `price = cost × (1 + margin)`, which is why a
   flavor swap turned into a pricing decision. Price becomes the input; margin becomes a value the
   catalog *asserts*, with a 40% floor enforced by `catalog:check`.

| rung | flavor | vCPU / RAM / disk | $/hr | ~/month @ 730 h |
|---|---|---|---|---|
| `n4` | `d2-4` | 2 / 4 GB / 50 GB | $0.0450 | $32.85 |
| `n8` | `d2-8` | 4 / 8 GB / 50 GB | $0.1000 | $73.00 |
| `n16` | `b3-16` | 4 / 16 GB / 100 GB | $0.2100 | $153.30 |
| `n32` | `b3-32` | 8 / 32 GB / 200 GB | $0.4500 | $328.50 |
| `n64` | `r3-64` | 8 / 64 GB / 200 GB | $0.6000 | $438.00 |

Against today: `n4` **+17%**, `n8` **+45%**, `n32` **−11%**. Repricing is free only while pre-revenue —
no grandfathering, no migration email, no churn — which is why it lands before Stripe goes live.

---

## Surface 1 — Console (`mifunedev/openharness-cloud`)

- **US-003 renames the specs.** `NODE_SPECS` → `["n4","n8","n16","n32","n64"]`. T-shirt sizes *"break
  the moment a rung is added in the middle"*. Reusing `large` for a different machine was rejected
  outright: `node_hour_large` is a live billing identifier and `billed_node_hours.spec` is
  `text not null` with no CHECK constraint — it keeps whatever string it was given, permanently.
  Changing what an existing value *means* in a billing ledger is the defect class
  `billing-meter-name-mismatch` exists to fix.
- **The migration touches two tables.** `nodes.spec` *and* `billed_node_hours.spec`, or the ledger
  stops joining to nodes.
- **US-006 renders five cards, hourly *and* monthly.** *"Every card shows the hourly rate **and** the
  730-hour monthly run estimate"* — so the monthly figure is a shared decision across both surfaces,
  not a website invention.
- **Labels stay human-readable** — "4 GB", "32 GB", never the raw enum. The website matches this.

## Surface 2 — Website (`mifunedev/website`, this PR)

The `/pricing` page published three hourly-rate cards in a `lg:grid-cols-3` grid with a
`plan.spec === "large"` column-span special case. That shape **cannot survive a fourth rung**, and it
answered only *"what does one node cost per hour"* — not *"what will I pay a month"* or *"what does my
mix cost"*.

So the cards became a fleet calculator: a quantity stepper per rung, integer hour presets, one summed
total, and a 730-hour monthly reference.

**FR-5 is the seam between the two surfaces.** Everything renders by mapping `cloudNodePlans`; no
component enumerates a spec key. That is what made the three-to-five change a **one-file edit** —
`git diff --name-only` for commit `85abb22` lists `src/config/cloud-pricing.ts` and `public/llm.txt`
(generated), and nothing under `src/components/`.

**Decision R4 is narrowed, not repealed.** No monthly SKU exists or is pending. What changed is
*display*: a 730-hour estimate computed from the published hourly rate. FR-6 governs the wording, and
it is load-bearing in two different ways — in the FAQ because the string feeds `faqPageSchema` and
structured data strips whatever sits beside it, and in `llm.txt` because a model quoting one bullet
must not be able to drop the qualifier.

---

## Gates

| gate | state |
|---|---|
| **US-001** — gen-3 availability in `US-EAST-VA-1` | ✅ **CLEARED 2026-08-06.** All five flavors present; every vCPU and disk figure matches the approved sheet. Evidence + UUIDs in the cloud repo's `progress.txt`. |
| **Stripe live mode** ([#117](https://github.com/mifunedev/openharness-cloud/issues/117)) | open — repricing must land in test mode first |
| Stripe Tax ([#116](https://github.com/mifunedev/openharness-cloud/issues/116)), terms ([#115](https://github.com/mifunedev/openharness-cloud/issues/115)) | open |

**Two findings from clearing US-001 that the platform side needs:**

1. **`ram=0` for every flavor** — a documented OVH quirk in the US regions. RAM must come from the
   flavor name. Anything reading the API's `ram` field into the catalog silently records 0.
2. **"NVMe" is unverified.** The approved sheet calls the top three rungs NVMe, but the API puts
   `b3-16`/`b3-32` on `ovh.ssd.eg` — the same family as the outgoing `b2-30` — and `r3-64` on
   `ovh.ssd.ram`; genuinely NVMe flavors carry `ovh.raid-nvme.*`. **The website ships "SSD" on this
   basis.** Provisioning one node under US-007 and reading the disk device settles it.

## Sequencing — website first, platform second

Deliberate, and the operator's call: the website publishes the ladder now; the Console catalog,
migration, and Stripe SKUs follow in phase 2. The module header in `src/config/cloud-pricing.ts` says
so explicitly, so a future reader does not "fix" the site back to three specs on finding upstream
still carries them.

**Merge order for this PR is load-bearing.** #60 first — `development` has no
`src/config/cloud-pricing.ts`, so #62 cannot compile alone. Never merge #60 with `--delete-branch`
while #62 is stacked on it; that closes #62 and it cannot be reopened. Retarget #62 to `development`,
merge, delete branches last.

---

## Artifacts

**Cloud** — [PR #125](https://github.com/mifunedev/openharness-cloud/pull/125) ← [#123](https://github.com/mifunedev/openharness-cloud/issues/123) price-as-input ·
[PR #124](https://github.com/mifunedev/openharness-cloud/pull/124) ← [#122](https://github.com/mifunedev/openharness-cloud/issues/122) $0-invoicing ·
`.oh/tasks/node-catalog-repricing/{prd.md,progress.txt}` ·
`packages/shared/src/{node-specs.ts,provider-catalog.yaml}` · `apps/web/components/spec-picker.tsx` ·
`scripts/{ovh-explore.mjs,stripe-sync.mjs}` · R4 origin [#114](https://github.com/mifunedev/openharness-cloud/issues/114) → [PR #119](https://github.com/mifunedev/openharness-cloud/pull/119)

**Website** — [PR #62](https://github.com/mifunedev/website/pull/62) ← [#61](https://github.com/mifunedev/website/issues/61) this calculator ·
[PR #60](https://github.com/mifunedev/website/pull/60) ← [#59](https://github.com/mifunedev/website/issues/59) publishes the rates (merge first) ·
`tasks/fleet-pricing-calculator/{prd.md,progress.txt}` · `tasks/cloud-pricing-page/prd.md` (§4 non-goal, §8 R4) ·
`src/config/cloud-pricing.ts` · `src/components/pricing/FleetCalculator.tsx` · `src/app/pricing/page.tsx` ·
`src/data/faqs.ts` · `scripts/generate-llm-txt.mjs`

**Operator spec for the gate** — `.claude/specs/ovh-gen3-flavor-verification/spec.md` (harness, gitignored)
