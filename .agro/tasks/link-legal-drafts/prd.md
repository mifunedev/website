# PRD: Website links to legal drafts

Status: DRAFT

The operator authorized public draft policy links from both footers. Existing analytics integration remains unchanged.

## User Stories

### US-001: Add website footer links

**Description:** As a beta visitor, I want footer links to console-hosted legal drafts so that I can review proposed policies before sign-in.

**Acceptance Criteria:**

- [ ] Add four links labeled as drafts in `src/sections/FooterSection.tsx`.
- [ ] Use the existing `OFFERING_URLS.cloud` origin for `/legal/terms`, `/legal/privacy`, `/legal/refunds`, and `/legal/acceptable-use`.
- [ ] Keep footer links keyboard-accessible and visible at desktop and mobile widths.
- [ ] Add red regression tests before the footer change. Focused tests, `npm run lint`, and `npm run build` exit 0.
- [ ] Preserve all existing footer content and the Google Analytics integration. Do not reuse the closed PR #70.
- [ ] Add an Unreleased changelog entry and a short draft-status operation note.
- [ ] Verify in browser using agent-browser skill

### US-002: Record website footer review

**Description:** As the operator, I want evidence for website draft links so that I can verify navigation without declaring policies effective.

Depends on US-001.

**Acceptance Criteria:**

- [ ] Use agent-browser to inspect desktop and mobile footers and follow all four links.
- [ ] For local review only, route the canonical console origin to the local console review server in the browser.
- [ ] Record annotated screenshots, destinations, and keyboard results in this task's evidence directory.
- [ ] Stop only the owned review servers and browser sessions after review.
- [ ] Verify in browser using agent-browser skill

## Summary

The public console origin already exists in `src/config/offerings.ts`. The footer links use that origin, not a new configuration value.

The code targets the repository's `development` integration branch. Production deployment remains separate.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `src/sections/FooterSection.tsx` | `FooterSection` | Render draft-labeled policy links. |
| `src/config/offerings.ts` | `OFFERING_URLS` | Reuse the cloud origin. |
| `scripts/legal-footer.test.mjs` (proposed) | Node tests | Check routes, labels, and origin reuse. |

## Interface Integration Points

The website footer changes. Policy content remains console-hosted and explicitly ineffective until human approval.

## Storage

N/A. The footer adds no stored data.

## Architectural Decisions

Do not duplicate console policy text or add an analytics feature flag.

Host and sandbox: applied, workers and tests stay in the sandbox. Lifecycle, provider mirrors, root scaffold: not applicable.

Interactive processes: applied with owned Herdr review panes. Local and remote operation: applied with canonical console URLs.

Parallel operation: applied with a separate website worktree. Public documentation and verification: applied.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| `scripts/legal-footer.test.mjs` (proposed) | Four routes, draft labels, cloud origin, accessible navigation | Public draft destinations. |
| `evidence/manual-review.md` | Desktop, mobile, keyboard, local console interception | Visible and usable links. |

## Design Principles

- Use one canonical policy set.
- Keep draft labels visible.
- Preserve analytics and all unrelated content.
- Add no explanatory source comments.

## Out of Scope

Analytics removal, final legal approval, production deployment, and live payments remain outside this change.

## Open Questions

Issue #281 retains analytics/consent verification and policy approval. These gates do not block draft links.

## Acceptance Criteria

- [ ] Both website viewport sizes expose all four draft links.
- [ ] The links reach the corresponding console draft pages in the local review.

## Lessons

Filled by the advisor before undraft.
