# Plan: Google Analytics consent banner (lane CK)

## 1. Problem

The operator decided on 2026-11-18 to keep Google Analytics on the website behind a consent banner (agro-console PROGRAM.md, Decisions). At master `3fcda73`, `src/app/layout.tsx:115-117` loads Google Analytics in production when the environment holds `NEXT_PUBLIC_GA_ID`. The site asks for no consent first.

## 2. Scope

- Load Google Analytics only after the visitor accepts.
- A reject or no choice loads no Google Analytics script and sets no analytics cookie.
- Store the choice in the first-party local storage key `mifune-analytics-consent` with the value `granted` or `denied`. No key means no choice.
- Set Google Consent Mode defaults to `denied` before any gtag call. An accept updates `analytics_storage` to `granted`. The ad signals stay `denied`.
- A "Cookie settings" control in the footer opens the choice again. A change from accept to reject sets consent to `denied` and removes the `_ga` and `_ga_<container-id>` cookies.
- Use the site design tokens and the existing button component, so the banner follows the light and dark themes.

Out of scope: other website pages, new analytics tools, new dependencies.

## 3. User stories

### US-001: Add the consent banner and gate Google Analytics

Files: `src/lib/analytics-consent.ts`, `src/lib/analytics-consent.test.ts`, `src/components/consent/AnalyticsConsent.tsx`, `src/app/layout.tsx`, `src/sections/FooterSection.tsx`, `package.json`, `tsconfig.json`, `.agro/tasks/ga-consent-banner/evidence/`.

Acceptance criteria:

1. `npm test` runs the consent tests with `node --test` and exits 0. The tests cover no choice, reject, and accept.
2. `npm run lint` exits 0.
3. `npm run build` exits 0.
4. On a local production build with a test `NEXT_PUBLIC_GA_ID`, a visitor with no choice sees the banner. The page requests no `googletagmanager.com` script, and no `_ga` cookie exists.
5. After a reject, the banner closes. The page requests no `googletagmanager.com` script after a reload, and no `_ga` cookie exists.
6. After an accept, the page loads the Google Analytics script, and the `_ga` cookie exists.
7. The footer "Cookie settings" control opens the banner again.
8. Agent-browser screenshots of the banner, the accepted state, and the rejected state are in `.agro/tasks/ga-consent-banner/evidence/`.

## 4. Verification

The advisor runs `npm test`, `npm run lint`, and `npm run build` in the task worktree. The advisor checks criteria 4 to 7 in agent-browser against `npm start` on a free port, then stops the server.

## Lessons

1. Claim: `docs/environment-variables.md` said that `NEXT_PUBLIC_GA_ID` turns on Google Analytics in production, with no consent step. Evidence: the advisor review of line 41. Outcome: fixed in this PR (US-001 round 2).
2. Claim: a reject after an accept in the same page view keeps the Google Analytics script in the page. Consent goes to `denied` and the `_ga` cookies go away, so the script sets no new cookie. Evidence: the worker browser run. Outcome: dropped. The next page load does not load the script.
3. Claim: `node --test` prints a `MODULE_TYPELESS_PACKAGE_JSON` warning because `package.json` has no `type` field. Evidence: the `npm test` output. Outcome: dropped. The warning does not fail the test, and a `type` change affects the whole build.
