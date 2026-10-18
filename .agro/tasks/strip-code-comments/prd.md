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

Filled by the advisor before undraft.
