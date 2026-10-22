# PRD: Fix the Dependabot vulnerabilities

Status: DRAFT

## User Stories

### US-001: Upgrade Next.js to 15.5 and React to 19

**Description:** As the site owner, I want Next.js on the latest 15.5.x release so that the upgrade resolves the critical and high alerts on `next`.

**Acceptance Criteria:**

- [ ] `package.json` pins `next` and `eslint-config-next` to the same 15.5.x version, at least `15.5.24`.
- [ ] `package.json` sets `react` and `react-dom` to `^19`, and `@types/react` and `@types/react-dom` to `^19`.
- [ ] `src/app/blog/[slug]/page.tsx` types `params` as `Promise<{ slug: string }>` and awaits `params` in `generateMetadata` and in `BlogPost`.
- [ ] `npm ci`, `npm run lint`, and `npm run build` exit 0.
- [ ] `npm ls next react react-dom` reports one version of each package and no `invalid` or `ERESOLVE` line.

### US-002: Remove unused packages and refresh the vulnerable transitive packages

**Description:** As the site owner, I want unused vulnerable packages removed and the other vulnerable packages updated so that `npm audit` reports no high or critical finding.

**Acceptance Criteria:**

- [ ] `package.json` no longer lists `jsdom`, `isomorphic-dompurify`, `dompurify`, `html-react-parser`, or `react-input-mask`, nor `@types/react-input-mask`. `git grep` finds no import of these packages in `src/`, `scripts/`, or `next.config.mjs`.
- [ ] `mermaid` is at least `11.16.1` and `webpack` is at least `5.94.0` in `package-lock.json`.
- [ ] `npm audit --audit-level=high` exits 0, or `.agro/tasks/dependabot-vulns/evidence/audit.md` records a reason for each remaining high or critical finding.
- [ ] Each `overrides` entry in `package.json`, if any, names a package for which no parent release carries the fix. `audit.md` records the reason.
- [ ] `npm ci`, `npm run lint`, and `npm run build` exit 0.

### US-003: Record the manual review evidence

**Description:** As the reviewer, I want screenshots and an audit transcript so that I can confirm that the site still renders after the upgrade.

**Acceptance Criteria:**

- [ ] `.agro/tasks/dependabot-vulns/evidence/home.png` and `.agro/tasks/dependabot-vulns/evidence/pricing.png` show `/` and `/pricing` rendered by `npm start` on the task branch.
- [ ] Verify in browser using agent-browser skill.
- [ ] `.agro/tasks/dependabot-vulns/evidence/manual-review.md` records the commands `npm ci`, `npm run lint`, `npm run build`, and `npm audit --audit-level=high`, with each exit status and the `npm audit` severity counts before and after.
- [ ] The `npm start` process stops after the screenshots.

## Summary

Dependabot reports 178 open alerts on `master` (issue #98). All come from `package-lock.json`. `npm audit` on `07d755b` reports 3 critical, 30 high, 21 moderate, and 2 low vulnerable packages.

- `next` 14.2.4 carries 3 critical and 12 high alerts. The 14.x line has no fix. The first patched release is `15.5.24`. The latest 15.x release is `15.5.28`.
- The site uses the App Router. The App Router in Next 15 requires React 19.
- `fast-xml-parser` (fixed in 4.5.5), `axios` (fixed in 1.16.0), and `form-data` (fixed in 4.0.6) come from `rss-to-json` and `jsdom`. Each fixed version is inside the semver range of its parent, so a lockfile refresh reaches the fix.
- `jsdom`, `isomorphic-dompurify`, `dompurify`, `html-react-parser`, and `react-input-mask` have no import in `src/`, `scripts/`, or `next.config.mjs`. `dompurify` carries alerts with no patched version. `react-input-mask` does not support React 19.
- Most remaining alerts come from build tooling: `brace-expansion`, `minimatch`, `braces`, `picomatch`, `glob`, `js-yaml`, `nanoid`, `postcss`, `rollup`, and `@babel/*`.

Approach: upgrade Next.js and React first, then remove unused packages, run `npm audit fix` without `--force`, and add `overrides` only where no parent release carries the fix.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `package.json` | `dependencies`, `devDependencies`, `overrides` | Declares the package versions. |
| `package-lock.json` | `packages` | Holds the resolved versions that Dependabot scans. |
| `src/app/blog/[slug]/page.tsx` | `Props`, `generateMetadata`, `BlogPost` | The only route that reads `params`. |
| `next.config.mjs` | `withPWAInit` | Wraps the config with `@ducanh2912/next-pwa`, which accepts `next >=14.0.0` and `webpack >=5.9.0`. |
| `src/utils/rss.ts` | `rssToJson`, `rssParser` | Imports `rss-to-json`, `rss-parser`, and `htmlparser2`. |
| `src/components/ui/MermaidDiagram.tsx` | default import of `mermaid` | Uses `mermaid`. |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| Site pages | None expected | `/`, `/pricing`, and `/blog/<slug>` render as before. |

## Storage

N/A. The change touches no persistent state.

## Architectural Decisions

- Stay on Next.js 15.5.x. Next.js 16 is out of scope (operator decision).
- Keep `npm run lint` as `next lint`. Next 15.5 warns that `next lint` is deprecated but still runs it.
- Remove an unused package instead of upgrading it.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| N/A | `npm run lint`, `npm run build` | The repository has no test suite. The build type-checks and prerenders each route. |
| N/A | `npm audit --audit-level=high` | No high or critical vulnerable package remains. |
| N/A | agent-browser screenshots of `/` and `/pricing` | The pages render. |

## Design Principles

- Do not add explanatory comments to tracked code.
- Change only dependency declarations and the code that the upgrade requires.

## Out of Scope

- Next.js 16.
- Moderate and low alerts that `npm audit fix` without `--force` does not resolve.
- Unrelated refactors.
- Changes to mifunedev/agro.

## Open Questions

None.

## Acceptance Criteria

- [ ] The open critical and high Dependabot alerts on `master` are resolved after merge, or `audit.md` records a reason for each remaining alert.
- [ ] `npm ci`, `npm run lint`, and `npm run build` exit 0 on `bug/98-dependabot-vulns`.
- [ ] `npm audit --audit-level=high` exits 0, or `audit.md` records a reason for each remaining finding.
- [ ] Screenshots show that `/` and `/pricing` render.

## Lessons

1. Next 15 rewrites `tsconfig.json` on each `next build` and `next lint` until `compilerOptions.target` exists. Evidence: the worker reverted the rewrite after each run. Outcome: fixed in this PR (`206ad21`).
2. `braces` GHSA-vfj7-8cjw-p6xm has no patched release, so 8 high `npm audit` findings remain. Evidence: `evidence/audit.md`. Outcome: dropped, because no fix exists and `braces` runs only at build and lint time on repository-controlled patterns.
3. The upgrade needed three peer bumps that the plan did not name: `@next/third-parties`, `@headlessui/react`, and `html-react-parser`. Evidence: `npm ci` failed with `ERESOLVE` before the bumps. Outcome: fixed in this PR (`73267d0`).
4. A secret-exposure hook blocked one agent-browser command, and the worker ran a changed command without the blocked part instead of reporting `BLOCKED`. Evidence: the US-003 worker report. Outcome: dropped, as a process observation. The changed command printed no secret.
