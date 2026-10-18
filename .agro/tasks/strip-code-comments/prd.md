# PRD: Strip explanatory code comments

Status: DRAFT

## User Stories

### US-001: Strip comments from root config, scripts, and src/app

**Description:** As the operator, I want no explanatory comments in root config, `scripts/`, `src/app/`, and `src/page.tsx` so that code alone describes behavior.

**Acceptance Criteria:**

- [ ] The inventory script reports 0 comments in `next.config.mjs`, `postcss.config.js`, `tailwind.config.ts`, `scripts/**`, `src/app/**`, and `src/page.tsx`, except the `/** @type {import('next').NextConfig} */` annotation in `next.config.mjs`.
- [ ] The comment-insensitive token hash of each owned file is equal before and after the change.
- [ ] Each removed JSX comment removes the whole `{/* ... */}` expression, and no empty `{}` expression remains.
- [ ] The worker report lists each removed comment that holds a fact that no other tracked source records.
- [ ] `npm run lint` exits 0 in the worker worktree.

### US-002: Strip comments from shared modules

**Description:** As the operator, I want no explanatory comments in the shared module directories so that the code is the only description of behavior. The directories are `src/components/`, `src/config/`, `src/data/`, `src/lib/`, `src/types/`, and `src/utils/`.

**Acceptance Criteria:**

- [ ] The inventory script reports 0 comments in `src/components/**`, `src/config/**`, `src/data/**`, `src/lib/**`, `src/types/**`, and `src/utils/**`.
- [ ] The comment-insensitive token hash of each owned file is equal before and after the change.
- [ ] Each removed JSX comment removes the whole `{/* ... */}` expression, and no empty `{}` expression remains.
- [ ] The worker report lists each removed comment that holds a fact that no other tracked source records, including the OVH flavor IDs in `src/config/cloud-pricing.ts`.
- [ ] `npm run lint` exits 0 in the worker worktree.

### US-003: Strip comments from src/sections

**Description:** As the operator, I want no explanatory comments in `src/sections/` so that the code is the only description of behavior.

**Acceptance Criteria:**

- [ ] The inventory script reports exactly 1 comment in `src/sections/**`: `// eslint-disable-next-line jsx-a11y/role-supports-aria-props` in `src/sections/AgentPickerSection.tsx`.
- [ ] The `eslint-disable-next-line` directive stays on the line directly above the element that it suppresses.
- [ ] The comment-insensitive token hash of each owned file is equal before and after the change.
- [ ] Each removed JSX comment removes the whole `{/* ... */}` expression, and no empty `{}` expression remains.
- [ ] The worker report lists each removed comment that holds a fact that no other tracked source records.
- [ ] `npm run lint` exits 0 in the worker worktree.

## Summary

The root `AGENTS.md` rule "Code is the source of truth" forbids explanatory comments in tracked code. PR #89 fixed stale comments in `src/config/cloud-pricing.ts`. The operator approved one PR that removes every explanatory comment from tracked code and config.

Verified current state on `master` at `b0caa5d`:

- 94 tracked `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, and `.css` files are in scope.
- The TypeScript-scanner inventory finds 308 comments in 53 files.
- 2 comments are machine-read directives. Both stay.
- The repository has no test runner and no GitHub Actions. The checks are `npm run lint` and `npm run build`.
- The `prebuild` script runs `node scripts/generate-llm-txt.mjs`, which rewrites `public/llm.txt`.

The advisor commits one verification script at `.agro/tasks/strip-code-comments/evidence/comment-inventory.cjs`. The script reads the TypeScript package in `node_modules` and has two jobs:

- `<root> list` and `<root> full` count comments with the TypeScript scanner for code and with a block-comment pattern for CSS. Both modes flag directive comments.
- `<root> tokens` prints a SHA-256 hash of the comment-insensitive token stream of each file.

The work splits into three stories with disjoint file sets. The stories run in one parallel wave.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `next.config.mjs` | `/** @type {import('next').NextConfig} */` | Kept directive. The TypeScript language service reads the JSDoc type. |
| `src/sections/AgentPickerSection.tsx` | `// eslint-disable-next-line jsx-a11y/role-supports-aria-props` | Kept directive. ESLint reads the suppression. |
| `src/config/cloud-pricing.ts` | file header comment | Holds the OVH flavor IDs and price provenance. The fact goes to the PR Lessons section. |
| `scripts/generate-llm-txt.mjs` | `prebuild` | Rewrites `public/llm.txt` during each build. Never stage that file. |
| `package.json` | `lint`, `build` | The two gate commands. |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| Rendered pages | None | Comments do not reach the rendered output. The built route list stays the same. |
| API routes | None | `src/app/api/**` loses comments only. |

## Storage

N/A. The change removes comment text and adds no state.

## Architectural Decisions

- Code is the only description of behavior. No comment text moves into a new file.
- A comment stays only when a tool reads it: `eslint-disable*`, `@ts-expect-error`, `@ts-ignore`, `@ts-nocheck`, `/// <reference ...>`, `prettier-ignore`, webpack magic comments, and JSDoc type annotations in JavaScript files.
- `"use client"` and `"use server"` are not comments. They stay.
- Commented-out code is a comment. It goes.
- The advisor collects the facts that only comments record. The PR body lists them under Lessons. The operator decides where each fact belongs.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| `node .agro/tasks/strip-code-comments/evidence/comment-inventory.cjs <root> list` | Comment count and kept directives before and after | D3 |
| `node .agro/tasks/strip-code-comments/evidence/comment-inventory.cjs <root> tokens` | Per-file token hash on `master` equals the hash on the branch | D4 |
| `git diff --stat master...HEAD` | Changed paths are in-scope code files only | D4 |
| `npm run lint` | Exit 0 on the final branch | D1 |
| `flock /tmp/website-build.lock npm run build` | Exit 0 on the final branch | D2 |
| Build route table | The route list on `master` equals the route list on the branch | D5 |

## Design Principles

- Change only comment text and the whitespace that held the comment.
- Keep each directive that a tool reads.
- Run each build as `flock /tmp/website-build.lock npm run build`, because parallel Next.js builds exhaust memory.
- Work in a worktree under `.worktrees/`. Do not switch the branch of the main checkout, because the operator preview server in Herdr pane `w4:p1` runs from the main checkout.

## Out of Scope

- Markdown content: `posts/`, `docs/`, `README.md`, and `tasks/`.
- `.agro/` and `public/`.
- Any change to code behavior, formatting, or names.
- New documentation files for facts from removed comments.
- A manual review evidence story. The change has no user interface change and no server, CLI, or API change. The token-hash check and the route-list check prove that behavior stays the same.

## Open Questions

None.

## Acceptance Criteria

- [ ] D1: `npm run lint` exits 0 on the final branch.
- [ ] D2: `flock /tmp/website-build.lock npm run build` exits 0 on the final branch.
- [ ] D3: the PR body shows the in-scope comment count before (308) and after (2), and lists each kept directive with its reason.
- [ ] D4: every changed file has the same comment-insensitive token hash on `master` and on the branch, and the PR body records the method.
- [ ] D5: the built route list on the branch equals the built route list on `master`.
- [ ] D6: the PR is ready for review, the checks pass, and the advisor reports the PR URL.
- [ ] `public/llm.txt` is not in the PR diff.

## Lessons

1. The first token hash counted JSDoc text as code.
   - Evidence: `ts.Node.getChildren()` returns attached JSDoc nodes. Each JSDoc removal changed the hash of an unchanged file. All three workers reported the false difference.
   - Outcome: fixed in this PR. Commit `0c5a79e` skips JSDoc nodes in `tokens()`.
2. Some removed comments recorded facts that no other tracked source records. The operator decides where each fact belongs. The list below gives the location on `master` at `b0caa5d`.
   - Outcome for each fact: dropped from the code in this PR, kept here for the operator.
   - `src/config/cloud-pricing.ts:1-59`: the price ladder comes from `mifunedev/agro-console` `.oh/tasks/node-catalog-repricing/prd.md`, the `price/h` column. The same rates are in agro-console `packages/shared/src/provider-catalog.yaml`, so a price change must change both repositories.
   - `src/config/cloud-pricing.ts:16-24`: `pnpm ovh:explore US-EAST-VA-1` ran read-only against the OVHcloud API on 2026-08-06. The flavor table is in the code block below.
   - `src/config/cloud-pricing.ts:26-37`: the OVH API reports `ram=0` for US flavors, so RAM comes from the flavor name. The site says SSD, not NVMe, because `b3-*` is `ovh.ssd.eg` and `r3-64` is `ovh.ssd.ram`.
   - `src/config/cloud-pricing.ts:165-193`: the month is 730 hours because hourly vendors quote 730. The hour presets are whole numbers because nodes meter whole UTC hours.
   - `src/config/cloud-pricing.ts:226-268`: totals sum in ten-thousandths of a dollar to prevent float drift. `formatUsdTotal` does not use `Intl.NumberFormat`, so server output and client output are identical.
   - `src/lib/time-of-day-theme.ts` and `src/components/theme-provider.tsx`: the automatic theme is never written to storage, because `storage` events re-theme other tabs. The legacy keys `theme` and `theme-auto` are read and never removed. The bootstrap script must render after the next-themes script.
   - `src/app/layout.tsx:88-92`: `viewport.themeColor` is a fixed `#000000`, because the theme follows the local hour and the OS preference cannot predict it.
   - `src/app/globals.css:49-52,100-102`: `--oh-accent-raised` is `#166534` in light mode because `--oh-accent` is 4.02:1 on `--oh-raised`. In dark mode the accent is 11.36:1, so the two tokens are equal.
   - `scripts/generate-llm-txt.mjs:2-24`: the script needs Node type stripping (v22.18.0 or later). `.nvmrc` sets the deploy Node version, because a deploy once ran on Node 18.20.8 and failed.
   - `next.config.mjs:52-53`: the `/case-studies` redirect is a temporary 307 until a real case study ships.
   - `src/data/faqs.ts:63-69` and `scripts/generate-llm-txt.mjs:48-53`: each monthly figure carries "not a monthly plan" in the same sentence, because FAQPage data and LLM quotes drop the next sentence.
   - `src/lib/youtube.ts:18-22`: set `YOUTUBE_CHANNEL_ID` when the @ryaneggz channel is live.
   - `src/sections/VideoSection.tsx:25-42`: commented-out video entries used the YouTube IDs `E2AX09cHSTk` and `I44ZQaTsgAc`.
3. The comment removal exposed unused code: the `BrevoApi` import in `src/app/api/contact/route.ts`, and `scroll`, `FaArrowLeft`, and `FaArrowRight` in `src/sections/VideoSection.tsx`.
   - Evidence: the worker reports for US-001 and US-003. `npm run lint` does not flag the unused code.
   - Outcome: dropped. The plan forbids each code change.

```text
n4   d2-4    5051d54d-6341-4860-bf63-c4bddbb7c6f0   2 vcpu / 50 GB
n8   d2-8    9802d615-a353-4668-b581-7b2bdedbf54c   4 vcpu / 50 GB
n16  b3-16   1efeacd6-7639-44b3-b0ce-243c827c5ff2   4 vcpu / 100 GB
n32  b3-32   7df840d0-cbd1-4fd0-9642-4c0f9ba65a9e   8 vcpu / 200 GB
n64  r3-64   cd1d3a46-4167-451c-b97b-44f36d3c7994   8 vcpu / 200 GB
```
