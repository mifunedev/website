# PRD — Refactor Ruska AI website → Mifune (v2)

> **v2 revision** — incorporates the 2-critic adversarial gate (`critique.md`). Resolves 3 HIGH
> findings (Airtable Message-drop, CTAButton/BOOKING_LINK stale-brand leak, pricing-ladder naming
> mismatch) at AC level, plus folded MED/LOW fixes. A 4th HIGH (missing `.claude/ICP.md`) is a
> harness-side gate gap, not a deletion proposed here — recorded for the orchestrator, not a blocker.

## CTA rule (applies to ALL stories — read first)

The `CTAButton` in `services/page.tsx:17-49` hardcodes `href={BOOKING_LINK}` (an external
`https://cal.com/<COMPANY_TAG>/ai-audit` link) with `target="_blank"`. **Never import or copy that
component for a homepage/marketing CTA.** Every primary CTA in US-003…US-011 must be an **inline
`<a href="#audit">`** that reuses only the green *button styling* (`rounded-xl bg-green-500 px-8 py-4
font-montserrat text-lg font-medium text-black hover:bg-green-400`), NOT the `BOOKING_LINK` href and
NOT `target="_blank"`. `RegisterButton` (hardcodes `chat.ruska.ai`) is likewise banned from
marketing CTAs.

## Introduction

The marketing site (Next.js 14, App Router) is currently positioned as **"Ruska AI /
Orchestra"** — a developer-tool / agent-orchestration platform. This effort repositions it as
**Mifune** — an AI implementation company that sells **managed AI workers** to non-technical
business owners. It encodes the value-ladder sales process and the X-post tier model: a paid
**AI Workflow Audit** as the front door → **AI Partner** (recurring advisory, base) →
**Done-For-You Deployment** → **Managed AI Workforce on OpenHarness** (top tier). OpenHarness is
demoted from headline product to credibility/infrastructure layer.

**Key constraint that shapes the work:** the existing `/services` page
(`src/app/services/page.tsx`) is already the desired aesthetic and is the **visual base standard** —
green-only accent (`#22c55e`), `font-montserrat` body/headings, `font-space` green emphasis,
grid-background + ambient-glow hero. The work promotes that idiom to the homepage and repositions
copy; it is not a visual redesign. Purple/blue gradients and `font-cormorant` are dropped.

Full plan + adversarial PM audit:
`/home/sandbox/harness/.claude/plans/task-refactor-ruska-ai-crispy-parrot.md` (§ "PM Audit
Corrections" is authoritative where it conflicts with the body).

## Goals

1. Reposition all homepage copy + structure to "managed AI workers for business owners" per the
   spec homepage outline (Hero → Pain → Offer → What-you-get → Case study → Trust → FAQ → audit
   form → CTA → Footer).
2. Encode the pricing value-ladder on a dedicated `/pricing` route and a simplified 3-package
   Offer on the homepage, both sourced from one typed config (`src/config/pricing.ts`).
3. Wire the on-page audit intake form to Airtable via `apiClient.contactFormSubmit`.
4. Complete the Ruska → Mifune brand migration with zero stale-branding leaks in user-facing
   surfaces (verified by a grep gate).
5. Adopt the `/services`-page green idiom across every rebuilt section; remove
   purple/blue/`font-cormorant`/`text-gold-500` artifacts.

## Non-Goals

- No visual redesign — the `/services` idiom is the standard; do not invent new styling.
- Do not rewrite the 6 `posts/*.md` developer tutorials or their embedded URLs.
- Do not change `/api/contact` or `/api/subscribe` backend logic — reuse as-is.
- Do not touch inert (unimported) sections except as explicitly scoped: `ServiceSection`,
  `ProjectSection`, `VideoSection`, `ContactSection`, `RoadmapSection`, `SuggestionSection`,
  `offline/page.tsx`.
- No new pricing numbers invented beyond the spec ranges (placeholders flagged for client confirm).
- The literal string **"OpenHarness"** is intentional and must remain in trust/dev copy.

## Visual standard (lift from `src/app/services/page.tsx`)

- Accent: green only — `text-green-500/400`, `bg-green-500/10`, `border-green-500/30`,
  `drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]`. No purple/blue gradients.
- Type: `font-montserrat` body+headings; `font-space` green for emphasis. No `font-cormorant`.
- Eyebrow: `font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground`.
- Cards: `rounded-2xl/3xl border border-border bg-card p-6/8`.
- CTA button: the `CTAButton` pattern (`services/page.tsx:241-273`) — `bg-green-500 px-8 py-4
  text-black hover:bg-green-400`, target `#audit`.
- Hero: grid background + ambient glow + two-tone headline (`services/page.tsx:314-567`).
- FAQ accordion: reuse `FAQItem` (`services/page.tsx:207-238`).

---

## User Stories

### US-000 — Fix Airtable to persist the audit form `Message` field (backend prerequisite)

As a sales operator, I want the audit form's `Message` (what the prospect wants automated) to land
in Airtable so leads carry qualification data.

Scope: `src/app/api/utils/airtable.ts:18` unconditionally runs `delete body.Message` before the
POST, silently dropping the field. Remove that line so `Message` persists. (Overrides the Non-Goal
"do not change /api/contact backend logic" — this single line is a prerequisite for US-010b.)

Acceptance criteria:
- `src/app/api/utils/airtable.ts` no longer contains `delete body.Message`.
- A POST to `/api/contact` with `{Name,Email,Phone,Message,Referrer}` forwards all five fields in
  `{ fields: body }` to Airtable (verify by reading the code path; e2e confirmation in US-010b).
- Confirm the Airtable base (`app6sU4AprV9uZze6/Contacts`) has columns for `Message` and `Referrer`
  (Airtable ignores unknown fields silently — note in `notes` if a column is missing so it can be
  added in the Airtable UI).
- Typecheck passes.

### US-001 — Brand chrome sweep (Ruska → Mifune)

As a visitor, I want every piece of site chrome (titles, metadata, manifest, social handles, OG
images, nav/footer wordmark) to say "Mifune" so the brand is consistent and no stale "Ruska" leaks.

Scope (this story only — text/metadata substitution, no layout change):
- `src/app/layout.tsx` — `APP_NAME`, titles, template "| Ruska Labs" → "| Mifune", description,
  keywords, OG/twitter, viewport themeColor (→ green).
- `src/components/nav/TopNavBar.tsx` + `src/sections/FooterSection.tsx` — logo src/alt, "RUSKA"
  wordmark (drop `font-cormorant`), "Ruska Labs" copyright. (Menu items + footer columns handled
  in US-010/US-014 — touch only branding strings here.)
- `src/config/app.ts` — all social handles + `MEDIUM_RSS_URL`.
- `src/app/robots.ts`, `src/app/sitemap.ts` — `https://ruska.ai` → `https://mifune.dev` (base URL
  only; route list handled in US-013).
- `src/app/blog/[slug]/page.tsx:34` — fallback `"https://ruska.ai"` → `"https://mifune.dev"`.
- `src/app/opengraph-image.tsx`, `src/app/services/opengraph-image.tsx` — "RUSKA" text → "Mifune".
- `src/app/services/layout.tsx` — three "… | Ruska AI" title/OG/twitter strings → Mifune.
- `src/app/socials/page.tsx` — all ~12 hardcoded `ruska-ai`/`@ruska_ai`/`Ruska Labs`/`ruska.ai`
  handles + URLs → Mifune equivalents.
- `src/app/services/page.tsx` — **chrome-only**: `COMPANY_TAG` (→ `mifune` placeholder),
  `BOOKING_LINK` (the cal.com slug now resolves to `https://cal.com/mifune/ai-audit` — flagged open
  item), `EMAIL` (→ `hello@mifune.dev`), JSON-LD. Do NOT alter its copy/layout — it is the read-only
  visual reference for later stories. (Rationale: `/services` still renders until US-013 lands the
  redirect; its CTA must not leak `ruska-ai` or an external ruska cal.com link in the interim.)
- `public/manifest.json` — name/short_name "Orchestra" → "Mifune"; `theme_color` `#00ff00` → green.
- `src/app/v1.page.tsx`, `src/app/blog/page.tsx`, `src/components/buttons/WaitlistButton.tsx` —
  rebrand any Ruska/Orchestra chrome strings (these are chrome, not the `posts/` tutorials). If
  `v1.page.tsx` is a dead snapshot, deleting it is acceptable (note in `notes`).
- Slack: `src/config/app.ts` + `src/app/socials/page.tsx` contain `join.slack.com/t/ruska-ai/...`.
  No Mifune Slack exists yet → set to a placeholder `#` (or remove the Slack entry) and flag in Open
  Items, so it does not trip the grep gate.

Acceptance criteria:
- `grep -rIn -iE "ruska|orchestra" src public --include='*.tsx' --include='*.ts' --include='*.json' | grep -viE "openharness|/blog/|posts/|ProjectSection|github\.com/ruska-ai"` returns only the intentional `chat.ruska.ai` dev link (footer/RegisterButton, handled in US-014) — no marketing/metadata strings, no `cal.com/ruska-ai`, no `join.slack.com/t/ruska-ai`.
- `public/manifest.json` `name`/`short_name` = "Mifune"; `theme_color` is green (`#22c55e`).
- `src/app/services/page.tsx` diff is limited to `COMPANY_TAG`, `BOOKING_LINK`, `EMAIL`, JSON-LD.
- Typecheck passes.

### US-002 — Pricing config + Pain section (additive scaffolding)

As a developer, I want a single typed pricing source and a new Pain section so later stories have a
shared contract and a reusable section, without breaking the build.

Scope:
- New `src/config/pricing.ts` exporting:
  ```ts
  export type PricingTier = {
    id: string; name: string; badge?: string;
    price: string;            // "$500–$2,500" | "Custom"
    period?: string;          // "/mo" | "one-time" | undefined
    description: string; bullets: string[];
    cta: string; ctaHref: string;   // homepage tiers → "#audit"
    highlight: boolean;
    ladderStage: string;      // maps to the /pricing value-ladder, e.g. "deployment" | "department" | "managed"
    roiHint?: string;         // money framing, e.g. "Replaces ~$40k/yr admin hire"
  };
  export const homepageTiers: PricingTier[];    // exactly 3: Starter AI Worker / AI Operations System (badge "MOST POPULAR") / AI Workforce Partner
  export const pricingPageTiers: PricingTier[];  // exactly 4: AI Workflow Audit / AI Partner / Done-For-You Deployment / Managed AI Workforce ("Custom")
  ```
  Use spec ranges as placeholder prices ($500–$2,500 audit; $2,500–$10,000 deployment; AI Partner
  monthly placeholder; "Custom" managed). **Pricing-ladder coherence (resolves critic H3):** the 3
  homepage packages are *entry points into* the 4-tier ladder, not a competing scheme. Each
  `homepageTiers` item sets `ladderStage` pointing at its `pricingPageTiers` counterpart
  (Starter→Done-For-You / AI Operations System→AI Department-Managed / AI Workforce
  Partner→Managed), and each carries a `roiHint`. `/pricing` (US-011) is the authoritative ladder
  and links back so a buyer never sees two unmapped naming schemes.
- New `src/sections/PainSection.tsx` — `id="pain"`, 4 cards (Leads go cold → AI Sales Assistant /
  CRM gets messy → AI Operations Assistant / Projects drift → AI Project Manager / Customers get
  ignored → AI Customer Success Assistant). **Inline** the card markup in the green idiom; do NOT
  import `FeatureCard` (it carries `bg-purple-500/10` + `font-cormorant`).

Acceptance criteria:
- `src/config/pricing.ts` exports `PricingTier`, `homepageTiers` (length 3), `pricingPageTiers`
  (length 4).
- `PainSection.tsx` contains no `font-cormorant`, `purple-`, `blue-`, or `gold-500`; not yet
  imported anywhere (additive).
- Typecheck passes.

### US-003 — Rewrite HeroSection (managed AI workers idiom)

As a business-owner visitor, I want the hero to say "Deploy AI workers into your business without
hiring more staff" with a "Book an AI Workflow Audit" primary CTA so I instantly grasp the value.

Scope: rewrite `src/sections/HeroSection.tsx` in the services-hero idiom (grid + glow + two-tone
headline). Primary CTA → inline `<a href="#audit">` using the green button *style* only (per the
CTA rule above). Secondary CTA "See Example AI Workers" → `href="#pain"` (the AI-worker cards
section) so it resolves to a real anchor. **Do NOT use `RegisterButton` or the services-page
`CTAButton`.**

Acceptance criteria:
- Headline + subhead match spec hero copy; primary CTA href is exactly `#audit`; secondary CTA href
  is `#pain` (no dead/undefined target).
- No `RegisterButton`/`CTAButton` import; no `font-cormorant`/`purple-`/`blue-`/`gold-500`/
  `chat.ruska.ai`/`cal.com`/`target="_blank"` on the primary CTA.
- Typecheck passes; agent-browser assertion: hero primary CTA visible and clicking it scrolls to the
  `#audit` form.

### US-004 — Rewrite PricingSection as homepage Offer (3 packages)

As a visitor, I want a simple 3-package offer ("We install managed AI workers in 30 days") so I can
self-select before booking.

Scope: rewrite `src/sections/PricingSection.tsx` to render `homepageTiers` from
`src/config/pricing.ts` as 3 cards (green idiom, "MOST POPULAR" badge on the middle tier). Each card
shows its `roiHint` (money framing — resolves critic: "how does this save me money?") and each CTA →
inline `#audit`. Add a "See the full path to a managed AI workforce →" link to `/pricing`.

Acceptance criteria:
- Imports `homepageTiers`; renders exactly 3 cards, each displaying `price`/range + `roiHint`.
- All CTAs href `#audit` (inline, not `CTAButton`); a visible link to `/pricing` is present.
- No `#enterprise`, `RegisterButton`, `CTAButton`, `font-cormorant`, purple/blue/gold.
- Typecheck passes; agent-browser assertion: 3 cards render, CTA scrolls to `#audit`.

### US-005 — Rewrite ProductShowcaseSection as "What you actually get"

As a visitor, I want a plain deliverables checklist (no architecture diagrams) so I know what I
receive.

Scope: rewrite `src/sections/ProductShowcaseSection.tsx` into a green checklist (AI worker
configured / human approval before sensitive actions / CRM-email-docs integration / weekly
performance report / ongoing monitoring). Reuse the offerings-card pattern from `services/page.tsx`.

Acceptance criteria:
- Renders the 5 spec deliverables as a checklist; green idiom only.
- No purple/blue/gold/cormorant; typecheck passes; verify in browser.

### US-006 — Rewrite SocialProofSection as case-study teaser

As a visitor, I want a "Case Study Coming Soon: The Workflow Academy" card linking to `/case-studies`
so the social-proof slot reads credible pre-launch.

Scope: rewrite `src/sections/SocialProofSection.tsx` into a single coming-soon card linking to
`/case-studies`.

Acceptance criteria:
- Single card with spec copy + link to `/case-studies`; green idiom; typecheck passes; verify in
  browser.

### US-007 — Rewrite AboutSection as Trust + OpenHarness credibility

As a visitor, I want a trust block ("Built by a senior software leader who manages real AI agent
infrastructure") plus an OpenHarness credibility callout so I trust the operator.

Scope: rewrite `src/sections/AboutSection.tsx`, `id="about"`. Keep existing founder image
(`/images/ryan_egg.png`) as placeholder. Add an OpenHarness callout ("Powered by OpenHarness — an
isolated operating environment for reliable AI workers"). Drop the indigo background → green idiom.

Acceptance criteria:
- Contains trust copy + OpenHarness callout; `id="about"`; no indigo/purple/blue/gold/cormorant;
  typecheck passes; verify in browser.

### US-008 — Rewrite CTASection (hire-vs-AI framing)

As a visitor, I want a closing band ("Before hiring another employee, let us deploy an AI worker")
with a `#audit` CTA.

Scope: rewrite `src/sections/CTASection.tsx`. **Drop `text-gold-500`** (undefined class → invisible
headline) → `text-green-500`. CTA → inline `#audit` button; no `RegisterButton`.

Acceptance criteria:
- Spec CTA copy; CTA href `#audit`; no `text-gold-500`/`RegisterButton`/purple/blue/cormorant;
  typecheck passes; verify in browser.

### US-009 — Rewrite FAQSection (buyer-facing)

As a business-owner visitor, I want buyer-facing FAQs so common objections are handled.

Scope: rewrite `src/sections/FAQSection.tsx` Q&As to buyer-facing (model on
`services/page.tsx:18-59`); reuse `FAQItem` pattern. Remove any `chat.ruska.ai`/`github.com/ruska-ai`
marketing links.

Acceptance criteria:
- Buyer-facing Q&As; no marketing-facing ruska links; green idiom; typecheck passes; verify in
  browser.

### US-010a — Homepage assembly + nav

As a visitor, I want the homepage in the new order with a working "Book Audit" nav button.

Scope:
- `src/app/page.tsx` — new import list + order: TopNavBar → Hero → Pain → Offer(Pricing) →
  What-you-get(ProductShowcase) → Case study(SocialProof) → Trust(About) → FAQ → audit
  form(Enterprise) → CTA → Footer. **Remove `FeaturesOverviewSection`** import (new order has no
  slot — this is an eviction, and `AboutSection` is a NEW import not previously on the homepage).
- `src/components/nav/TopNavBar.tsx` — `menuItems`: AI Workers (`/#pain`) · Case Studies
  (`/case-studies`) · Pricing (`/pricing`) · About (`/#about`) · **Book Audit** green button →
  `/#audit`. Bases off US-001's branding output. Verify mobile rendering (5 items + button) does not
  overflow at 375px; collapse to existing mobile pattern if present (note if none exists).

Acceptance criteria:
- `src/app/page.tsx` renders sections in the specified order; no `FeaturesOverviewSection` import;
  `AboutSection` imported.
- Nav shows the 5 items; "Book Audit" links to `/#audit`.
- Typecheck passes; agent-browser assertion: each nav item scrolls/navigates to its target; no
  horizontal overflow at 375px.

### US-010b — Wire the audit intake form to Airtable

As a prospect, I want to submit an audit request and get clear confirmation so I trust the process.
(Depends on US-000 — Message must persist.)

Scope: `src/sections/EnterpriseSection.tsx` — rename `id="enterprise"` → `id="audit"`; rewrite to an
audit intake form with fields Name (required), Email (required), **Phone**, Message (required —
"What would you automate first?"). Copy ONLY the `handleSubmit` API-call logic from
`ContactSection.tsx:24-39`, build inputs fresh, and **call
`apiClient.contactFormSubmit({Name, Email, Phone, Message, Referrer:"audit-form"})`** (payload
matches `Contact` type `src/types/index.ts:16-22`). Replace the current `console.log`-only
`handleSubmit`. **Do NOT reuse `ContactSection`'s `alert()` UX** — render an inline success banner
(green) and an inline error banner (red) driven by checking `res.ok` (note: `contactFormSubmit`
returns the raw `Response`, so the caller must `await res` then branch on `res.ok` / parse JSON).

Acceptance criteria:
- Section `id="audit"`; repo-wide zero `#enterprise` / `id="enterprise"` matches remain (coordinate
  with US-004/US-010a CTA hrefs).
- Submit calls `apiClient.contactFormSubmit` with all 5 fields incl. `Referrer:"audit-form"`; Name,
  Email, Message are required (form blocks empty submit).
- Success → inline green banner; failure (`res.ok === false`) → inline red banner. No `alert()`.
- Typecheck passes; agent-browser e2e: a valid submit returns success UX AND a row appears in the
  Airtable "Contacts" base with `Message` and `Referrer=audit-form` populated (validates US-000).
  If `AIRTABLE_API_KEY` is unset in the dev env, note that e2e is deferred and assert the error
  banner instead (no silent pass).

### US-011 — `/pricing` route (full value ladder)

As a prospect comparing options, I want a `/pricing` page showing the 4-tier ladder vs hiring so I
understand the progression.

Scope: new `src/app/pricing/page.tsx` rendering `pricingPageTiers` with the services-page "How It
Works" stepped-card pattern (`services/page.tsx:818-923`): Audit → AI Partner → Done-For-You →
Managed (Custom). Include "position against hiring" framing (compare each tier to a VA / admin hire /
SDR) + "You Own Everything" / "Full Transparency" trust blocks (`services/page.tsx:925-962`). State
that the 3 homepage packages are entry points into this ladder (resolves H3 naming coherence). CTAs
are inline `#audit` links / `/#audit` (no services-page `CTAButton`, no `cal.com`).

Acceptance criteria:
- `/pricing` renders 4 tiers from `pricingPageTiers` in ladder order; green idiom; "vs hiring"
  framing + 2 trust blocks present.
- CTAs are inline anchors to `#audit` / `/#audit`; no `CTAButton`/`cal.com`/`target="_blank"`.
- Typecheck passes; agent-browser assertion: 4 tiers render top-to-bottom, CTA resolves to audit.

### US-012 — `/case-studies` route (coming-soon)

As a prospect, I want a `/case-studies` page so the nav link resolves and signals momentum.

Scope: new `src/app/case-studies/page.tsx` — "Coming Soon: The Workflow Academy" placeholder in the
services-page idiom (metrics-to-capture list).

Acceptance criteria:
- `/case-studies` renders; green idiom; typecheck passes; verify in browser.

### US-013 — `/services` redirect + sitemap routes

As a crawler/old-link visitor, I want `/services` to redirect to `/pricing` and the sitemap to list
the new routes.

Scope:
- `next.config.mjs` — add an `async redirects()` key **inside the `nextConfig` object** (NOT inside
  the `withPWAInit({...})` options) returning `{ source: '/services', destination: '/pricing',
  permanent: true }`. Ship atomically with US-011 (`/pricing` must exist first — never ship the
  redirect without the destination). Revert path documented: flip `permanent: true` → `false`,
  deploy, confirm, then remove.
- `src/app/sitemap.ts` — replace `/services` with `/pricing`; add `/case-studies`.

Acceptance criteria:
- `/services` redirects (308) to `/pricing`; verify by inspecting the HTTP status code, not just the
  final page content (no redirect loop).
- `/sitemap.xml` lists `/pricing` + `/case-studies`, not `/services`.
- Typecheck passes; `npm run build` succeeds with the PWA wrap intact.

### US-014 — Footer Developers column + RegisterButton demotion

As a developer visitor, I want OpenHarness/dev links in a footer "Developers" column so the
marketing surface stays clean.

Scope:
- `src/sections/FooterSection.tsx` — add a "Developers" column (Blog, GitHub
  `github.com/ruska-ai/*`, Launch OpenHarness). Base off US-001's branding output. Also fix stale
  footer links surfaced by critics: remove/repoint the `/login` link (no such route → 404) and the
  dead `/#features` / `/#pricing` anchors (features section removed; pricing moved to `/pricing`).
- `src/components/buttons/RegisterButton.tsx` — demote to the footer "Launch OpenHarness" link
  (keep `chat.ruska.ai` only here). Confirm it is no longer imported by any marketing section
  (Hero/CTA/Pricing) after US-003/US-004/US-008.

Acceptance criteria:
- Footer has a Developers column with Blog + GitHub + OpenHarness links; no `/login` 404 link; no
  dead `/#features` anchor; pricing link points to `/pricing`.
- `grep -rln "RegisterButton" src/sections src/components/nav` shows no marketing-section usage.
- `chat.ruska.ai`/`github.com/ruska-ai` survive ONLY in footer/blog/dev contexts; typecheck passes;
  agent-browser assertion: footer Developers column links resolve (no 404).

---

## Dependencies & sequencing (for wave planning)

- **Wave 0:** US-000 (airtable Message fix — isolated backend, 1 line) + US-001 (chrome baseline) +
  US-002 (additive: pricing config + PainSection). US-000 and US-002 are independent of US-001 and
  may run alongside it, but US-001 establishes the nav/footer branding baseline.
- **Wave 1:** US-003…US-009 — **mutually independent section files → safe to parallelize** (7 agents).
  Each depends on US-002 (pricing config) and US-001 (branding baseline).
- **Wave 2:** US-011 + US-012 (new routes, parallel with each other); depend on US-002.
- **Wave 3:** US-010a (homepage assembly + nav — serial; touches `page.tsx`, nav) + US-010b (audit
  form wiring — depends on US-000). US-010a/b touch different files so can run together.
- **Wave 4:** US-013 (redirect — needs `/pricing` from US-011; touches `next.config.mjs`,
  `sitemap.ts`) + US-014 (footer/RegisterButton — bases off US-001 footer + US-003/004/008
  de-referencing).

Serialization points (never two concurrent agents): `src/app/page.tsx` (US-010a),
`TopNavBar.tsx` (US-001→US-010a), `FooterSection.tsx` (US-001→US-014), `sitemap.ts`
(US-001→US-013), `next.config.mjs` (US-013). US-006's `/case-studies` link must not ship before
US-012 exists.

## Verification (end-to-end)

1. `npm run dev` click-through: home order + `/pricing` + `/case-studies` + `/blog` + `/socials`;
   green-only accent, no purple/blue/cormorant/gold leftovers; every "Book Audit" scrolls to
   `#audit`; `/services` redirects to `/pricing`.
2. Audit form e2e → row in Airtable "Contacts" with `Referrer=audit-form`.
3. `npm run build` (runs `scripts/generate-llm-txt.mjs` prebuild) passes; spot-check `llm.txt`.
4. Branding grep gate (excludes openharness, /blog/, posts/, ProjectSection, github.com/ruska-ai)
   near-zero.
5. **Repo-wide idiom purge gate** (after Wave 1):
   `grep -rIn -E "font-cormorant|text-gold-500|from-purple|to-blue|bg-purple-|border-purple-" src/sections src/app/page.tsx`
   returns zero (these are no-op/undefined classes or off-brand gradients).
6. `<title>` / manifest / OG = Mifune; robots + sitemap use `mifune.dev` + list new routes.

## Open items (placeholders; client to confirm — flagged, non-blocking)

- Domain `mifune.dev`; email `hello@mifune.dev`; logo `ruska_logo_200.png` placeholder.
- Exact prices + AI Partner monthly figure (spec ranges used as placeholders).
- **Cal.com slug** — `BOOKING_LINK` set to `cal.com/mifune/ai-audit` placeholder; confirm the real
  Mifune cal.com handle (marketing CTAs use the on-page `#audit` form, so this only affects the
  legacy `/services` page until it redirects).
- **Slack** — no Mifune Slack workspace yet; `join.slack.com/t/ruska-ai` set to `#`/removed.
- **Founder asset** (US-007) — real headshot/name/title pending; `ryan_egg.png` is a launch-blocker
  placeholder, not final.
- Privacy-consent line + GA4 conversion event on audit submit — deferred (note for a follow-up).

## Harness-side note (not part of this PRD)

Critic flagged `.claude/ICP.md` is listed in the harness `protected-paths.txt` but the file does not
exist — a harness gate inconsistency. This website PRD deletes no protected path, so it is not a gate
violation here; recorded for the orchestrator to reconcile separately.
