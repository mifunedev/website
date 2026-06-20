# Critique — ai-partner-offer-realign

Generated 2026-06-02; reviews `prd.md` post-/prd, pre-issue. 2-critic adversarial gate (ship-spec).

## Critic A — Implementer lens
Verdict **REVISE-PRD**. Blocking + notable:
- **[H]** `pricing/page.tsx:170-177` "ROI Framing" `<div>` renders `{tier.roiHint}` UNguarded → the
  free audit tier (`roiHint:undefined`) renders an empty styled box. Only the upper "vs. Hiring"
  block (line ~160) is guarded.
- **[H]** `PricingTier.ladderStage: string` is **required** (`pricing.ts:12`). US-001 rewrites all
  tier literals; omitting `ladderStage` breaks `tsc`. No consumer reads it (grep-confirmed).
- **[M]** Stale "30 days" bullets/descriptions in `pricing.ts` (e.g. DFY "Production deployment in 30
  days" L129; Starter "handed off … in 30 days" L23) — cleared only if US-001 rewrites every tier
  fresh; needs a grep AC.
- **[M]** `pricing/page.tsx` second paragraph (L51-57, "3 homepage packages … each maps to a tier
  below") becomes misleading (audit tier has no homepage counterpart) — not in scope.
- **[L]** closing CTA AC "contains free" is loose; textarea placeholder (L279) not updated; dead
  `hiringComparisons["ai-workflow-audit"]` entry (cosmetic).

## Critic B — User lens
Verdict **PROCEED** (with 6 H/M addressed). Key:
- **[H]** Empty "ROI Framing" box (same as Critic A).
- **[H]** `pricing/page.tsx:49` "jump straight to Done-For-You" contradicts partner-first funnel —
  must be purged (grep gate).
- **[H]** "What's in every AI Partner month" block placement ambiguous — specify a separate section
  with that exact heading after the Step 2 card (not inside bullets).
- **[H]** SLA mismatch: form success banner "within one business day" vs AI Partner "same-day
  replies." Scope same-day to enrolled AI Partner clients; leave the prospect form banner as-is.
- **[H]** exactly-one-`highlight` flip is atomic — add `filter(t=>t.highlight).length===1` AC for both
  arrays (current shipped state has DFY highlighted, ai-partner not — opposite of target).
- **[M]** FAQ index 6 "one-time engagement"/minimum-commitment answer also goes stale → include in
  US-006; grep "one-time engagement".
- **[M]** "AOA" is jargon — spell out "Audit, Optimize, Automate" in the bullet.
- **[M]** $1,500/mo placeholder renders publicly next to "$5k–$10k consultant" — add a TODO comment;
  flagged open item.
- **[M]** closing CTA **button label** should say "free" (button currently "Book an AI Workflow Audit").
- **[L]** hero flow visual depicts done-for-you automation vs new done-with-you copy — accepted as
  aspirational end-state (US-004 is copy-only).

## Synthesis
- **High-severity**: 5 distinct (ROI-Framing empty box, required `ladderStage`, "jump straight to
  DFY" purge, "What's in every AI Partner month" placement, SLA wording + atomic highlight flip).
- **Medium**: ~6. **Low**: ~4.
- **Disposition**: all mitigated at AC level in **prd.md v2** (US-001 makes `ladderStage` optional +
  rewrites every tier fresh + atomic-highlight AC + TODO; US-002 adds the ROI-Framing guard +
  "jump straight" grep + block-placement spec + button-label AC + second-paragraph fix; US-001 bullet
  spells out AOA + scopes same-day SLA to clients; US-006 adds index-6/"one-time engagement"). No
  protected paths touched (different repo).
- **Recommendation**: **PROCEED** after v2 — confirmed by focused re-review.
