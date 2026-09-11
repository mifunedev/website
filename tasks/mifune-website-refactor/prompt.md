# Ralph iteration prompt — mifune-website-refactor

You are implementing one user story per iteration for the Mifune website refactor
(repo: `mifunedev/website`, branch `feat/36-mifune-website-refactor`).

## On each iteration

1. Read context, in order:
   - `tasks/mifune-website-refactor/prd.md` — full spec (v2). The top-level **CTA rule** and the
     **PM Audit Corrections** are binding.
   - `tasks/mifune-website-refactor/prd.json` — the story list + acceptance criteria.
   - `tasks/mifune-website-refactor/critique.md` — the resolved-findings record (do not regress them).
   - `tasks/mifune-website-refactor/progress.txt` — what is already done.
2. Pick the **lowest-priority-number** story where `passes: false`, honoring the dependency waves in
   prd.md (US-000/001/002 before the section rewrites; US-011 before US-013; US-012 before US-006
   ships; US-000 before US-010b).
3. Implement ONLY that story. Match the existing `/services` page idiom — green accent
   (`#22c55e`), `font-montserrat`/`font-space`, no purple/blue/`font-cormorant`/`text-gold-500`.
4. Verify every acceptance criterion. For UI stories run the **agent-browser** skill and assert the
   stated condition. Run `npx tsc --noEmit` (or `npm run build` for US-013).
5. On success: set the story's `passes: true` in prd.json, append a dated line to progress.txt
   (story id + what changed + verification result), and commit:
   `feat: <story-id> <short desc> (#36)`.
6. If blocked, write the blocker to progress.txt and `notes` on the story; do not fake a pass.

## Guardrails
- Never reuse the services-page `CTAButton` or `RegisterButton` for a marketing CTA — inline
  `<a href="#audit">` with the green button style only.
- Do not touch inert sections (`ServiceSection`, `ProjectSection`, `VideoSection`,
  `ContactSection`, `RoadmapSection`, `SuggestionSection`, `offline/page.tsx`) except as a story
  explicitly scopes.
- Keep the literal "OpenHarness" string; keep `posts/*.md` tutorials as-is.
- Serialization points (one writer at a time): `src/app/page.tsx`, `TopNavBar.tsx`,
  `FooterSection.tsx`, `sitemap.ts`, `next.config.mjs`.

STATUS: COMPLETE when every story has `passes: true`.
