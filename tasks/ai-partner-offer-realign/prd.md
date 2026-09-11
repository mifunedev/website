# PRD — Align Mifune offer to the X-post "AI Partner" base model (v2)

> **v2** — incorporates the 2-critic gate (`critique.md`). Resolves 5 HIGH findings at AC level:
> unguarded "ROI Framing" empty box, required `ladderStage` breaking tsc, "jump straight to DFY"
> purge, "What's in every AI Partner month" block placement, and SLA wording + atomic highlight flip.

## Introduction

The Mifune site (branch `feat/36-mifune-website-refactor`, PR #37) shipped a managed-AI-workers
repositioning, but its offer architecture diverges from the Corey Ganim X-post being replicated. The
post's business is a **recurring "AI Partner" base offer** ($1,000–$2,000/mo; two ~45-min
*done-WITH-you* sessions/mo) where **done-for-you is the explicit upsell** and managed infra is the
top. The site leads with done-for-you/managed framing and never surfaces the AI Partner base on the
homepage — the user's complaint: "I'm not seeing the base offer of AI Partner like in the X post."

This effort recasts the offer so **AI Partner is the visible base** (homepage + /pricing), encodes
the four signature mechanics, and reframes the audit as a **free intake** that feeds the partner.
Source of truth is `src/config/pricing.ts`; the two pricing surfaces consume it.

This is a refinement on the existing `feat/36-mifune-website-refactor` branch / PR #37 — **no new
branch or PR**.

## Goals

1. Recast the homepage Offer + /pricing ladder so **AI Partner (base) → Done-For-You (upsell) →
   Managed AI Workforce on OpenHarness (top)** reads clearly, with AI Partner highlighted.
2. Encode the four AI Partner mechanics: two done-with-you sessions/mo (you learn to drive),
   intake-form = the audit, day-one win + AOA (Audit→Optimize→Automate), async support + same-day
   SLA + a quantified deliverables log.
3. Reframe the audit as a **free intake** funneling into AI Partner (keep the `#audit` form + wiring).
4. Purge stale done-for-you/"managed in 30 days" copy that contradicts the partner-first framing.

## Non-Goals

- No backend/form-wiring changes — `EnterpriseSection`'s `apiClient.contactFormSubmit`,
  `Referrer:"audit-form"`, field names, and `id="audit"` stay exactly as shipped.
- No new routes. Don't reintroduce the hidden Workflow Academy case study (the `/case-studies → /`
  redirect in `next.config.mjs` and the orphaned `SocialProofSection` stay as-is, untouched).
- Keep the literal "OpenHarness" as top-tier infra credibility.
- Don't name Corey's specific tools (Voxer/Notion/JotForm) — use generic equivalents.
- No new colors/components; green idiom only. No services-page `CTAButton`/`RegisterButton` in
  marketing CTAs. Prices remain placeholders (flag for client confirmation).

## Visual standard
Green only (`#22c55e`), `font-montserrat`/`font-space`. Banned in edited files:
`purple-`/`blue-`/`font-cormorant`/`text-gold-500`/`CTAButton`/`RegisterButton`/`cal.com`.

---

## User Stories

### US-001 — Recast `src/config/pricing.ts` (offer source of truth)

As a developer, I want the pricing config to encode the AI-Partner-base ladder so both pricing
surfaces render the new offer from one place.

Scope:
- Extend `PricingTier` with optional `positionLabel?: "intake" | "base" | "upsell" | "top"` (optional
  → existing consumers still compile).
- **Make `ladderStage` OPTIONAL** (`ladderStage?: string`) — it's currently required and no consumer
  reads it; rewritten tier literals would otherwise fail `tsc`. (HIGH fix.)
- **Rewrite EVERY tier object fresh** (all 3 homepage + all 4 pricing) — do not leave stale
  descriptions/bullets from the old Starter/Ops/DFY copy (e.g. "handed off in 30 days").
- Add a `// TODO: confirm AI Partner price + ladder with client` comment above `homepageTiers`.
- In the AI Partner bullets, spell out the framework as "fix the process first, then automate it —
  **Audit, Optimize, Automate**" (don't ship the bare acronym "AOA"). Scope the async SLA wording to
  enrolled clients: "Unlimited async support with same-day replies for AI Partner clients".
- **`homepageTiers` (3, in order):**
  1. **AI Partner** — `id:"ai-partner"`, `positionLabel:"base"`, `highlight:true`, `badge:"START HERE"`,
     `price:"$1,500"`, `period:"/mo"`. Bullets encode mechanics: two 45-min done-with-you sessions/mo
     (built on your screen); fix the process first, then automate (AOA); at least one automation live
     after session one; unlimited async support, same-day replies; a running quantified log of
     everything we build; you learn to drive — you own it all. `roiHint:"Cheaper than a $5k–$10k/mo AI
     consultant"`, `cta:"Book a Free AI Workflow Audit"`, `ctaHref:"#audit"`.
  2. **Done-For-You Deployment** — `id:"done-for-you-deployment"`, `positionLabel:"upsell"`,
     `price:"$2,500–$10,000"`, `period:"one-time"`, `highlight:false`; description notes it's the
     upsell "when you'd rather we build it for you".
  3. **Managed AI Workforce** — `id:"managed-ai-workforce"`, `positionLabel:"top"`, `price:"Custom"`,
     OpenHarness; existing bullets.
- **`pricingPageTiers` (4, in this order; KEEP existing `id`s — they key `hiringComparisons`):**
  1. **AI Workflow Audit** — `id:"ai-workflow-audit"`, `positionLabel:"intake"`, `price:"Free"`,
     **`period: undefined`** (NOT `"intake"` — it would render "Free intake"), **`roiHint: undefined`**
     (no "vs. Hiring" panel on a free product), `badge:"INTAKE"`. Bullets: 10-minute intake
     questionnaire; surfaces 1–3 AI opportunities before our first session; prioritized by ROI; feeds
     straight into your AI Partner engagement.
  2. **AI Partner** — `id:"ai-partner"`, `positionLabel:"base"`, `highlight:true`, full mechanic
     bullets (expanded), done-with-you description.
  3. **Done-For-You Deployment** — `id:"done-for-you-deployment"`, `positionLabel:"upsell"`,
     `highlight:false`.
  4. **Managed AI Workforce** — `id:"managed-ai-workforce"`, `positionLabel:"top"`.

Acceptance criteria:
- `PricingTier` has optional `positionLabel` and optional `ladderStage`; `npx tsc --noEmit` clean.
- `homepageTiers` length 3, order [ai-partner, done-for-you-deployment, managed-ai-workforce];
  `homepageTiers[0].id==="ai-partner"` and `highlight===true`;
  `homepageTiers.filter(t=>t.highlight).length===1`.
- `pricingPageTiers` length 4, order [ai-workflow-audit, ai-partner, done-for-you-deployment,
  managed-ai-workforce]; ids unchanged from shipped; audit tier `price==="Free"`,
  `period===undefined`, `roiHint===undefined`; `pricingPageTiers.filter(t=>t.highlight).length===1`
  (ai-partner).
- `grep -ni "30 days" src/config/pricing.ts` returns nothing; bullets spell out "Audit, Optimize,
  Automate" (no bare "AOA"); same-day SLA scoped to "AI Partner clients".
- No tier names mention Voxer/Notion/JotForm.

### US-002 — Update `src/app/pricing/page.tsx` (single agent — same file)

As a prospect, I want the /pricing ladder to read intake → AI Partner → DFY → managed with the
partner mechanics shown in depth.

Scope (ONE file — do all of the following together):
- `hiringComparisons` record: keys must equal the 4 `pricingPageTiers` ids; rewrite the
  `ai-workflow-audit` entry (free-intake framing, drop "VA's week") and `ai-partner` entry (done-with-you,
  drop "part-time consultant").
- **HIGH FIX — guard the "ROI Framing" box:** the lower `<div>` (≈lines 170-177) renders
  `{tier.roiHint}` UNguarded; wrap it in `{tier.roiHint ? ( …ROI Framing div… ) : null}` so the free
  audit tier (no `roiHint`) does not render an empty styled box. (The upper "vs. Hiring" block ≈line
  160 is already guarded — match that pattern.)
- Reorder is data-driven (from US-001); confirm `Step {index+1}` reads Step 1=intake … Step 4=managed.
- Price render: with audit `period:undefined`, the existing `{tier.period && …}` guard skips it —
  confirm "Free" renders without a trailing period string.
- **Add a separate "What's in every AI Partner month" section** — a standalone `<div>`/`<section>`
  with that EXACT heading, placed immediately AFTER the AI Partner (Step 2) card closes and before the
  next arrow connector (NOT inside the tier's bullets). Contents: two 45-min done-with-you sessions,
  unlimited async + same-day replies, a day-one win, Audit→Optimize→Automate, a quantified
  deliverables log.
- Trust blocks: add a 3rd — **"Measurable Deliverables"**; change the grid `md:grid-cols-2` →
  `md:grid-cols-3` (≈line 205).
- **Supporting paragraphs (≈lines 49 and 51-57):** reframe the first to "Every engagement starts with
  a **free** AI Workflow Audit…" and REMOVE "jump straight to Done-For-You"; fix the second so it
  doesn't claim the 3 homepage packages "each map to a tier below" (the free intake has no homepage
  card) — say the intake is a quick free form you complete before your first session.
- **Closing CTA**: the paragraph AND the `<a>` button label must say "free" — button →
  "Book a free AI Workflow Audit". The h1 "The Full Path to a Managed AI Workforce" may stay.
- Render `positionLabel` (INTAKE/BASE/UPSELL/TOP) next to the `Step N` label.

Acceptance criteria:
- `Object.keys(hiringComparisons)` equals `pricingPageTiers.map(t=>t.id)` (no `undefined` lookups).
- The free audit tier renders NO empty "ROI Framing" box (the box is guarded by `tier.roiHint`).
- `/pricing` DOM contains the standalone "What's in every AI Partner month" section and 3 trust-block
  headings incl. "Measurable Deliverables"; ladder renders Step 1–4 intake→partner→DFY→managed; "Free"
  tier shows no stray period text.
- `grep -ni "jump straight" src/app/pricing/page.tsx` returns nothing; closing CTA **button** text
  contains "free".
- `grep -nE "purple-|blue-|font-cormorant|text-gold-500|CTAButton|cal\.com" src/app/pricing/page.tsx`
  returns nothing. `npx tsc --noEmit` clean. Verify in browser via agent-browser.

### US-003 — Update `src/sections/PricingSection.tsx` (homepage Offer)

As a visitor, I want the homepage Offer to lead with AI Partner as the base.

Scope:
- Header: "We install managed AI workers in 30 days." → **"Start with an AI Partner. Scale to a
  managed workforce."** Subhead explains base → upsell → top.
- Render `homepageTiers` (3 cards; highlight + "START HERE" badge on AI Partner). Add a small green
  `positionLabel` chip (BASE/UPSELL/TOP) above each tier name (reuse green chip styling — e.g.
  `rounded-full bg-green-500/10 text-green-400 text-xs uppercase`; no new colors).
- Keep all CTAs inline `#audit`; keep the `/pricing` link (line ~129) as-is.

Acceptance criteria:
- Header text matches; 3 cards render with BASE/UPSELL/TOP chips in order; "START HERE" badge +
  highlight on AI Partner; each card shows price + roiHint.
- All CTAs `href="#audit"`; no `CTAButton`/`RegisterButton`/banned classes.
- `npx tsc --noEmit` clean. Verify in browser via agent-browser.

### US-004 — Update `src/sections/HeroSection.tsx` (lead with the partner)

As a business-owner visitor, I want the hero to position Mifune as my AI implementation partner.

Scope (copy only; keep structure + flow visual):
- Subhead → partner framing, e.g. "Your AI implementation partner. In two short sessions a month we
  build the AI workers that run your follow-ups, admin, CRM, and reporting — on your screen, so your
  team owns them."
- Primary CTA label → **"Book a Free AI Workflow Audit"** (href stays `#audit`).
- Trust chips: **remove "Up and running in 30 days"** (line ~90); use e.g. "Two sessions a month",
  "A win on day one", "You own everything".

Acceptance criteria:
- Subhead mentions "partner" + "two … sessions"; primary CTA label is "Book a Free AI Workflow Audit",
  href `#audit`; no "Up and running in 30 days" chip remains; secondary CTA href stays `#pain`.
- `npx tsc --noEmit` clean. Verify in browser via agent-browser.

### US-005 — Update `src/sections/EnterpriseSection.tsx` (audit form = free intake, copy only)

As a prospect, I want the form to read as a quick free intake.

Scope (COPY ONLY — wiring untouched):
- Headline → **"Book your free AI Workflow Audit"**; subcopy → "A 10-minute intake surfaces 1–3 AI
  opportunities before our first session."
- Relabel the Message field → **"What work eats the most time each week?"**.
- Rewrite the hardcoded `auditBenefits` array (lines ~9-14) to free-intake framing — remove
  "Free 1-on-1 session"/paid-session language.

Acceptance criteria:
- `grep -n 'Referrer: "audit-form"'` still present; `apiClient.contactFormSubmit` call unchanged;
  field state names (Name/Email/Phone/Message) unchanged; `id="audit"` unchanged.
- `grep -niE "paid|1-on-1" src/sections/EnterpriseSection.tsx` returns nothing; new headline + Message
  label present.
- `npx tsc --noEmit` clean. Verify in browser via agent-browser.

### US-006 — Update `src/sections/FAQSection.tsx` (rewrite paid-audit answers + add 2 Q&As)

As a buyer, I want FAQs consistent with the free-intake / AI Partner model.

Scope:
- Rewrite the existing answers that call the audit a "paid AI Workflow Audit" / "paid discovery
  engagement" (≈ indices 0 and 2), the "one-time engagement"/minimum-commitment answer (≈ index 6),
  and any "live in 30 days" deployment promise tied to the entry point — all must reflect the FREE
  intake + recurring AI Partner model.
- Add 2 Q&As: "What's the difference between done-with-you and done-for-you?" and "What happens in a
  typical month?" (two sessions, async, day-one win, deliverables log). Reuse `FAQItem`; total ≤ 9.

Acceptance criteria:
- `grep -niE "paid AI Workflow Audit|one-time engagement" src/sections/FAQSection.tsx` returns
  nothing; 2 new Q&As present; `FAQItem` reused (no new component); ≤ 9 FAQs.
- `npx tsc --noEmit` clean. Verify in browser via agent-browser.

### US-007 — Update `src/sections/ProductShowcaseSection.tsx` (visible-value deliverable)

As a visitor, I want "what you get" to include the measurable-deliverables mechanism.

Scope: add one deliverable entry — "A quantified log of everything we build together" — in the green
idiom; no new imports/components.

Acceptance criteria:
- New deliverable present; no banned classes; `npx tsc --noEmit` clean. Verify in browser.

### US-008 — Update `src/sections/CTASection.tsx` (drop the 30-day deployment promise)

As a visitor, I want the closing CTA consistent with the recurring-partner framing.

Scope (copy only): revise the body line that says "We deploy managed AI workers … in 30 days"
(line ~52-55) and the trust note "Free audit call · No commitment · **Results in 30 days**"
(line ~94) — keep "Free audit call · No commitment"; drop the 30-day deployment promise. CTA stays
inline `#audit`.

Acceptance criteria:
- `grep -ni "30 days" src/sections/CTASection.tsx` returns nothing (or only non-promise usage); CTA
  href `#audit`; no banned classes/components.
- `npx tsc --noEmit` clean. Verify in browser via agent-browser.

---

## Dependencies & sequencing (waves for /delegate)
- **W0:** US-001 (`pricing.ts`) — serial, source of truth.
- **W1:** US-002 (`pricing/page.tsx`), US-003 (`PricingSection.tsx`) — parallel, distinct files,
  depend on US-001. (`pricing/page.tsx` is ONE task — never split across agents.)
- **W2:** US-004, US-005, US-006, US-007, US-008 — parallel, distinct files; copy-only. (US-006
  depends on US-001's free-intake decision being settled — it is, by W0.)

Serialization: `src/app/pricing/page.tsx` (US-002 only), `src/config/pricing.ts` (US-001 only).

## Verification (end-to-end)
1. `npx tsc --noEmit` clean; `npm run build` green (PWA intact).
2. Runtime smoke (prod server, Node fetch): homepage Offer shows **AI Partner highlighted base** with
   BASE/UPSELL/TOP chips; `/pricing` reads intake→partner→DFY→managed with "What's in every AI Partner
   month" + 3 trust blocks; `#audit` reads as a **free** intake.
3. Served HTML for `/` and `/pricing` contains the mechanics (two sessions, done-with-you, intake-as-
   audit, day-one win, AOA, async/same-day, quantified log).
4. Grep gates clean across edited files (no purple/blue/cormorant/gold; no `cal.com`/`CTAButton`/
   `RegisterButton`; no "paid AI Workflow Audit"; no stray "30 days" deployment promise; no stale brand).

## Open items (placeholders; client to confirm)
- AI Partner monthly price ($1,500 placeholder; post ladder $1,000 → $1,500 → $1,800/$2,000).
- Session cadence/length (two 45-min sessions/mo) + async SLA wording (same-day vs 12h).
- Whether to state a client cap (post caps at 6) — omitted by default.
