# Critique — mifune-website-refactor

Generated 2026-06-02; reviews `prd.md` post-/prd, pre-issue. 2-critic adversarial gate (ship-spec).

## Critic A — Implementer lens (verbatim summary)
Overall: **REVISE-PRD**. Confirmed against ground-truth code:
- **[H]** `src/app/api/utils/airtable.ts:18` `delete body.Message` — audit form Message silently dropped before Airtable write.
- **[H]** `services/page.tsx:13-14` CTAButton hardcodes `https://cal.com/ruska-ai/ai-audit` + `target="_blank"` — copying it yields external stale-brand link, not `#audit`.
- **[M]** US-001 grep excludes `github.com/ruska-ai` but Slack invite `join.slack.com/t/ruska-ai/...` won't match → false-failure gate.
- **[M]** US-010 conflates page-assembly + nav + form-wiring (3 concerns).
- **[M]** `next.config.mjs` redirect must be a key in `nextConfig`, not in the `withPWAInit()` options object.
- **[M]** ContactSection pattern renders only Name+Email and uses `alert()` — copy only the handleSubmit API logic, build inputs fresh, add Phone+Message.
- **[M]** Airtable base may lack a `Referrer` column → 422/silent drop; confirm before e2e.
- **[L]** `src/app/v1.page.tsx`, `src/app/blog/page.tsx`, `WaitlistButton.tsx` contain stale strings/cormorant not scoped → grep-gate noise.
- Note: `font-cormorant`/`text-gold-500` are undefined Tailwind classes (no-ops) — purge via repo-wide grep, not per-file only.
- Note: prefer Server Components for US-005/006/007 (only FAQ + audit form need `"use client"`).

## Critic B — User lens (verbatim summary)
Overall: **REVISE-PRD**. Confirmed:
- **[H]** Same `delete body.Message` data-loss (Message is the qualification field for a $500–$2,500 audit).
- **[H]** Same `BOOKING_LINK`/`COMPANY_TAG` stale-brand leak on the highest-traffic conversion path.
- **[H]** 3-package homepage Offer vs 4-tier `/pricing` ladder — different names at purchase intent = buyer confusion.
- **[H, PROTECTED-PATH]** `.claude/ICP.md` is listed in protected-paths.txt but the file does not exist (harness-side gate inconsistency — NOT a deletion proposed by this PRD; see disposition).
- **[M]** Form failure UX: `alert()` is a trust regression on a premium site → inline success/error banner; require `res.ok` error branch.
- **[M]** Homepage Offer has no money/ROI framing (spec demands "how does this save me money?" per section).
- **[M]** Secondary hero CTA "See Example AI Workers" has no defined target.
- **[M]** US-006 case-study card links `/case-studies` (US-012) → must not ship before US-012.
- **[M]** `/services` 308 redirect needs a documented revert path (`permanent:false` first).
- **[L]** Footer `/login` 404 + stale `/#features`/`/#pricing` anchors; mobile nav overflow with 5 items + button; no privacy-consent line; no GA4 conversion event on submit.

## Synthesis
- **High-severity findings**: 4 distinct (H1 Message-drop, H2 CTAButton/BOOKING_LINK leak, H3 pricing naming mismatch, H4 missing ICP.md).
- **Medium-severity findings**: ~9. **Low**: ~6.
- **Disposition**:
  - **H1, H2, H3** → mitigated at AC level in prd.md **v2** (new US-000 fixes airtable.ts; every CTA story builds inline `#audit` button + US-001 updates services BOOKING_LINK/COMPANY_TAG; US-002/US-011 add explicit ladder mapping + ROI framing). **Resolved.**
  - **H4 (ICP.md)** → out of scope for this *website* repo PRD; this PRD proposes no deletion of any protected path. It is a pre-existing *harness* hygiene gap (protected-paths.txt references a nonexistent file). Recorded for the orchestrator to fix separately; does NOT block this PRD. **Not a gate violation** (no protected path is being deleted).
  - All actionable MED/LOW findings folded into prd.md v2 ACs (form UX, res.ok branch, grep exclusions, US-010 split into 10a/10b, redirect placement + revert note, hero secondary CTA target, footer link cleanup, repo-wide purge gate).
- **Recommendation**: **PROCEED** after prd.md v2 revision (below) — confirmed by focused re-review.
