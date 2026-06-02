# Ralph iteration prompt — ai-partner-offer-realign

Implementing the AI-Partner-base offer realignment on branch `feat/36-mifune-website-refactor`
(repo: mifunedev/website, PR #37). Refinement of already-shipped Mifune work.

## Each iteration
1. Read: `tasks/ai-partner-offer-realign/prd.md` (v2 — binding), `prd.json`, `critique.md`, `progress.txt`.
2. Pick the lowest-priority `passes:false` story, honoring waves (US-001 before US-002/003; the rest after).
3. Implement ONLY that story. Match the green `/services` idiom; no purple/blue/font-cormorant/text-gold-500;
   no services-page CTAButton or RegisterButton in marketing CTAs; inline `#audit` CTAs.
4. Verify every AC: `npx tsc --noEmit`, the grep gates in the story, and agent-browser for UI stories.
5. On success set `passes:true`, append a dated line to progress.txt, commit `feat: <id> <desc> (#38)`.
6. Never alter EnterpriseSection wiring (apiClient.contactFormSubmit / Referrer / field names / id="audit").
   Never reintroduce the hidden Workflow Academy case study. Keep "OpenHarness". Don't name Voxer/Notion/JotForm.

STATUS: COMPLETE when every story has passes:true.
