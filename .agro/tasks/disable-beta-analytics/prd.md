# PRD: Disable optional beta analytics

Status: DRAFT

The operator approved the council recommendation to disable optional analytics for beta. This change does not publish legal policies or authorize live payments.

## User Stories

### US-001: Remove optional analytics from the root layout

**Description:** As a beta visitor, I want optional analytics disabled so that the beta does not load optional visitor tracking before legal review.

**Acceptance Criteria:**

- [ ] Remove Google Analytics and the associated initial active-user tracking mount from `src/app/layout.tsx`.
- [ ] Remove their unused imports without changing metadata, fonts, theme, page children, or unrelated processing.
- [ ] Add a focused Node regression test before changing the layout.
- [ ] `node --test scripts/beta-analytics.test.mjs` exits 0.
- [ ] `npm run lint` and `npm run build` exit 0, or report existing blockers with exact output.
- [ ] Document the beta analytics decision and the production verification gate in `docs/beta-analytics.md`.
- [ ] The documentation links console issue #281 and states that necessary data processing continues.
- [ ] Keep public legal pages and footer links outside this change until approved content exists.
- [ ] Add a linked `[Unreleased]` changelog entry for optional beta analytics removal.

## Summary

The current root layout conditionally mounts Google Analytics and initial active-user tracking for production with a GA identifier.

Remove those optional mounts. Do not add a consent system, a runtime feature flag, or dependencies.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `src/app/layout.tsx` | `RootLayout` | Remove optional tracking mounts. |
| `scripts/beta-analytics.test.mjs` (proposed) | Node test runner | Guard absence of optional tracking. |
| `docs/beta-analytics.md` (proposed) | Beta operation note | Record scope and unverified deployment state. |

## Interface Integration Points

The page UI stays unchanged. The change removes optional background visitor tracking.

## Storage

N/A. Add no database schema or runtime state. Existing operational and customer data remain unchanged.

## Architectural Decisions

Remove the optional mounts instead of adding a new flag or consent framework.

Host and sandbox: applied; workers implement inside the sandbox. Lifecycle, provider mirrors, scaffold, and persistent processes: not applicable.

Local and remote operation: applied; the change requires a website deployment. Parallel operation: applied with an isolated website worktree.

Public documentation and verification: applied. Legal publication and live payments remain human gates.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| `scripts/beta-analytics.test.mjs` (proposed) | No Google Analytics or initial active-user tracking mount; preserved layout structure | Optional tracking does not render from the root layout. |

Run the focused test, lint, and build from the website worktree in the sandbox. Record actual exit statuses.

## Design Principles

- Change no necessary operational data flow.
- Do not equate analytics removal with privacy compliance.
- Add no explanatory source comments.

## Out of Scope

Legal policies, footer links, data deletion, account changes, payments, and deployment configuration remain outside this change.

The change has no visible UI change. Browser screenshots do not prove absence of tracking; use command evidence for the root-layout regression test.

## Open Questions

Issue #281 retains production verification, data inventory, consent, legal review, and publication decisions. No missing business fact blocks removal of optional tracking.

## Acceptance Criteria

- [ ] The root layout no longer mounts optional analytics or active-user tracking.
- [ ] Verification evidence distinguishes source changes from production deployment.

## Lessons

Claim: Analytics regression tests must not freeze unrelated marketing copy or layout formatting.

Evidence: The accepted repair replaces an opaque metadata checksum and full-layout string comparison with semantic assertions.

Outcome: fixed in this PR.
