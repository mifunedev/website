# PRD: Retire agro-web and move AGRO docs into the website

Status: DRAFT

## User Stories

### US-001: Apache-2.0 license

**Description:** As the operator, I want the website repository under Apache-2.0 so that the AGRO docs keep the license that agro-web gives them today.

**Acceptance Criteria:**

- [ ] `LICENSE` at the repository root holds the full Apache-2.0 text.
- [ ] `NOTICE` at the repository root carries the copyright line from agro-web `NOTICE` at `74b27f2`.
- [ ] `README.md` has a `License` section that links to `LICENSE`.

### US-002: Framework upgrade to Next 16, React 19.2, and Tailwind 4

**Description:** As a docs maintainer, I want the website on the framework versions that `fumadocs-ui@16` requires so that the docs work starts on a current stack.

**Acceptance Criteria:**

- [ ] `package.json` pins `next` 16.x, `react` and `react-dom` at `^19.2.0` or later, `eslint-config-next` 16.x, and `tailwindcss` 4.x.
- [ ] `npm run build` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm test` exits 0.
- [ ] If `@ducanh2912/next-pwa` builds on Next 16, the production build registers the service worker and excludes `/docs` from `aggressiveFrontEndNavCaching`.
- [ ] If `@ducanh2912/next-pwa` does not build on Next 16, the story removes the plugin, `src/app/offline/`, and the generated worker files. The story records the result in `notes`.
- [ ] `docs/deployment.md` names Vercel as the host and contains no Netlify instructions.
- [ ] Verify in browser using agent-browser skill: `/`, `/pricing`, `/blog`, and one post render at 1280 px and 414 px. The layout matches the `fbf7bf1` production pages.

### US-003: Harness docs sync script

**Description:** As a docs maintainer, I want the build to copy harness `docs/` from one release tag so that the harness stays the only docs source.

**Acceptance Criteria:**

- [ ] `scripts/sync-agro-docs.mjs` and `scripts/oh-source.mjs` exist, ported from agro-web at `74b27f2`, with the Docusaurus-specific rewrites replaced by fumadocs `meta.json` output.
- [ ] The script writes to `content/docs/agro/`, and `.gitignore` lists that directory.
- [ ] The script reads the release tag from `AGRO_SCRIPTS_REF`. When the variable is empty, the script uses the latest release.
- [ ] `node --test scripts/sync-agro-docs.test.mjs` exits 0. The test covers title frontmatter, link rewrites, and `_category_.json` to `meta.json` conversion.
- [ ] The `prebuild` script in `package.json` runs the sync script before `next build`.

### US-004: fumadocs at `/docs`

**Description:** As a reader, I want AGRO and Mifune Console docs at `mifune.dev/docs` so that the docs and the product pages share one site.

**Acceptance Criteria:**

- [ ] `fumadocs-core` and `fumadocs-ui` are dependencies at the same major version, and `fumadocs-mdx` satisfies their peer range.
- [ ] `source.config.ts`, `src/lib/source.ts`, `src/app/docs/layout.tsx`, and `src/app/docs/[[...slug]]/page.tsx` exist.
- [ ] `/docs/agro/intro` renders the synced harness page.
- [ ] The docs sidebar has two roots: `Console` and `AGRO`.
- [ ] The docs search returns `/docs/agro/quickstart` for the query `quickstart`.
- [ ] The search index includes each blog post in `posts/`. A query for a word in one post title returns that post.
- [ ] A fenced `mermaid` block renders through the existing `MermaidDiagram` component.
- [ ] A click on a docs image opens the fumadocs `ImageZoom` view.
- [ ] `npm run build` exits 0.
- [ ] Verify in browser using agent-browser skill: the sidebar, search, a mermaid page, and image zoom work at 1280 px and 414 px. Check light mode and dark mode.

### US-005: Port the Mifune-owned docs pages

**Description:** As a reader, I want the Console guide and the four standalone pages on the website so that agro-web holds no unique docs content.

**Acceptance Criteria:**

- [ ] The 9 files in agro-web `docs/console/` at `74b27f2` exist under `content/docs/console/`.
- [ ] `glossary`, `model-selection`, `open-core`, and `resources` exist under `content/docs/`.
- [ ] Each image under agro-web `static/img/console/` exists under `public/docs/console/`, and each ported page resolves each image.
- [ ] `/docs` renders the Console introduction, as agro-web `slug: /` does today.
- [ ] `npm run build` exits 0 with no broken internal links.
- [ ] Verify in browser using agent-browser skill: each ported page renders at 1280 px.

### US-006: Merge the two blogs

**Description:** As a reader, I want one AGRO blog at `mifune.dev/blog` so that no post exists in two places.

**Acceptance Criteria:**

- [ ] Each other post in agro-web `blog/` at `74b27f2`, including `blog/archive/`, exists in `posts/` with its images under `public/blog/`.
- [ ] The story does not port agro-web `blog/2026-07-11-deploy-open-harness-with-docker.md` or `blog/2026-07-07-open-harness-demo-guide.md`. The website posts `agro-getting-started` and `daily-work-with-agro` are the canonical posts.
- [ ] The redirect map in US-009 sends the old URLs of the two skipped posts to the two canonical posts.
- [ ] Author data from agro-web `blog/authors.yml` renders on each ported post.
- [ ] `src/app/sitemap.ts` lists each post.
- [ ] Verify in browser using agent-browser skill: `/blog` lists every post, and two ported posts render with images.

### US-007: Serve the installer and CLI files

**Description:** As a user with an old install command, I want the website to serve the four installer files so that no install breaks.

**Acceptance Criteria:**

- [ ] `scripts/sync-external-scripts.mjs` and `scripts/build-oh-cli.mjs` exist, ported from agro-web at `74b27f2`, and write the four files to `public/`.
- [ ] `node --test scripts/sync-external-scripts.test.mjs scripts/build-oh-cli.test.mjs` exits 0.
- [ ] `.gitignore` lists the four generated files.
- [ ] The PWA configuration excludes the four files from the service-worker cache.
- [ ] After `npm run build && npm start`, `curl -s localhost:3000/install.sh | head -1` prints a line that starts with `#!`.

### US-008: CI gates and release rebuild

**Description:** As the operator, I want the website CI to run the agro-web checks so that the website keeps each gate.

**Acceptance Criteria:**

- [ ] `scripts/check-docs-drift.mjs` and `scripts/check-ste.mjs` exist, ported from agro-web at `74b27f2`, with their tests.
- [ ] `check-ste.mjs` reads the STE checker from the release tag of the docs sync. The script scans `posts/` and `content/docs/`, and it skips `content/docs/agro/`.
- [ ] `package.json` has the scripts `check:docs-drift` and `check:ste`.
- [ ] `.github/workflows/ci.yml` runs `npm ci`, `npm test`, `npm run lint`, `npm run check:docs-drift`, `npm run check:ste`, and `npm run build` on each pull request to `master`.
- [ ] `.github/workflows/rebuild.yml` runs on `repository_dispatch` type `agro-release`, on a daily schedule, and on `workflow_dispatch`. The workflow sends an HTTP POST to the Vercel deploy hook in the secret `VERCEL_DEPLOY_HOOK_URL`.
- [ ] Each existing page and post passes `npm run check:ste`.
- [ ] `external`: The operator adds the secret `VERCEL_DEPLOY_HOOK_URL` to the website repository before the PR merges.

### US-009: Host redirects and internal links

**Description:** As a reader with an old `agro.mifune.dev` link, I want each old URL to reach its new page so that links and ranking survive.

**Acceptance Criteria:**

- [ ] `src/config/agro-redirects.ts` maps each URL in the agro-web sitemap fixture to a `mifune.dev` path. Each of the 44 legacy client redirects in agro-web `docusaurus.config.ts` reaches its final page in one hop.
- [ ] `next.config.mjs` applies the map as permanent redirects, guarded by `has: [{ type: "host", value: "agro.mifune.dev" }]`.
- [ ] `next.config.mjs` serves `/install.sh`, `/get-agro.sh`, `/agro.js`, and `/oh.js` on host `agro.mifune.dev` with HTTP 200 and no redirect.
- [ ] `node --test src/config/agro-redirects.test.ts` exits 0. The test reads `.agro/tasks/retire-agro-web/evidence/agro-web-sitemap.xml` and fails when one sitemap URL has no mapping.
- [ ] `src/config/offerings.ts`, `src/sections/AgentPickerSection.tsx`, `scripts/generate-llm-txt.mjs`, and `posts/agro-getting-started.md` link to `mifune.dev/docs` paths. `git grep -n "agro.mifune.dev" -- src scripts posts` prints only the redirect host guard.
- [ ] `src/app/sitemap.ts` lists each docs page.

### US-010: Harness release dispatch and skill links

**Description:** As the operator, I want the harness to notify and link to the website so that nothing points at agro-web.

**Acceptance Criteria:**

- [ ] `external`: The operator creates a fine-grained token for `mifunedev/website` and stores it in the harness as the secret `WEBSITE_DISPATCH_TOKEN`.
- [ ] `external`: In the harness repository, `.github/workflows/release.yml` sends the `agro-release` dispatch with `WEBSITE_DISPATCH_TOKEN`. The target is `repos/mifunedev/website/dispatches`.
- [ ] `external`: In the harness repository, `.agro/scripts/__tests__/release-dispatch.test.ts` asserts the new target and passes.
- [ ] `external`: In the harness repository, `.agro/skills/agent-browser/SKILL.md` and `.agro/skills/agent-browser/references/recording.md` link to `https://mifune.dev/docs/agro/integrations/agent-browser`.
- [ ] `external`: The harness change ships as its own pull request after US-009 deploys.

### US-011: Domain cutover and archive

**Description:** As the operator, I want `agro.mifune.dev` served by the website and agro-web archived so that one site remains.

**Acceptance Criteria:**

- [ ] `external`: The operator adds `agro.mifune.dev` to the Vercel website project and points the Cloudflare DNS record at Vercel.
- [ ] `external`: `curl -sI https://agro.mifune.dev/docs/agro/intro` returns HTTP 308 with `location: https://mifune.dev/docs/agro/intro`.
- [ ] `external`: `curl -s https://agro.mifune.dev/install.sh | head -1` prints a line that starts with `#!`.
- [ ] `external`: After 4 weeks with no kill criterion met, the operator disables GitHub Pages on agro-web and archives the repository.
- [ ] `external`: The DNS record for `agro.mifune.dev` stays in place for 12 months after the archive.
- [ ] `external`: After the archive, the operator deletes the harness secret `AGRO_WEB_DISPATCH_TOKEN`.

### US-012: Manual review evidence

**Description:** As the reviewer, I want a browser journey and a redirect transcript so that I can accept the move without a second check.

**Acceptance Criteria:**

- [ ] Verify in browser using agent-browser skill: a journey goes from `/` to `/docs`, then through search to an AGRO page. The journey ends at `/blog` and one ported post. Annotated screenshots go to `.agro/tasks/retire-agro-web/evidence/`.
- [ ] Before the local boot, the story confirms that port 3000 is free. If the port is busy, the story sets `blocked` and names the process.
- [ ] `.agro/tasks/retire-agro-web/evidence/manual-review.md` holds a transcript of `npm run build && npm start`. The transcript then runs `curl -sI -H 'Host: agro.mifune.dev' localhost:3000<path>` for 10 sampled sitemap URLs and the four installer paths.

## Summary

Verified current state:

- agro-web is a Docusaurus 3.10.1 site on GitHub Pages at `agro.mifune.dev`. Its `pages.yml` build has failed on each run since 2026-11-07, so the live site is stale.
- agro-web copies harness `docs/` from a release tag (`scripts/sync-agro-docs.mjs`). Only 13 docs pages and 9 blog posts are unique to agro-web.
- agro-web serves `install.sh`, `get-agro.sh`, `agro.js`, and `oh.js`. All four return HTTP 200 today.
- The website runs Next 15.5.28, React 19, and Tailwind 3 on Vercel behind Cloudflare. The website has no license and no GitHub workflow. Its `docs/deployment.md` still names Netlify.
- `fumadocs-ui@16.19.7` requires `next` 16.x and `react` `^19.2.0`.
- A 10-member council recommended the move. The operator chose Apache-2.0, docs at `mifune.dev/docs`, and no fix to agro-web.

Approach: upgrade the stack, add fumadocs fed by harness `docs/`, port the unique content and checks, then move the domain with host-guarded redirects.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `package.json` | `prebuild`, `test`, `check:*` | Build hooks and gates |
| `next.config.mjs` | `redirects()`, `rewrites()`, `withPWAInit` | Host redirects, installer paths, PWA cache rules |
| `src/lib/posts.ts` | `getSortedPosts` | Blog source for ported posts |
| `src/app/sitemap.ts` | `sitemap` | Lists docs and posts |
| `src/config/offerings.ts` | `docs` | Docs link in the navigation |
| `src/sections/AgentPickerSection.tsx` | `DOCS_BASE_URL` | Harness docs links |
| `scripts/generate-llm-txt.mjs` | docs URLs | `public/llm.txt` content |
| agro-web `scripts/*.mjs` at `74b27f2` | sync, mirror, drift, and STE scripts | Port sources |
| agro-web `docusaurus.config.ts` at `74b27f2` | `plugin-client-redirects` | Legacy redirect map |
| harness `.github/workflows/release.yml` | `Notify agro-web of the release` | Release dispatch target |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| `mifune.dev/docs/*` | New | fumadocs docs for Console and AGRO |
| `mifune.dev/blog/*` | Extended | Ported agro-web posts |
| `agro.mifune.dev/*` | Changed | Permanent redirects to `mifune.dev` |
| `agro.mifune.dev/{install.sh,get-agro.sh,agro.js,oh.js}` | Preserved | HTTP 200 from the website build |
| `repository_dispatch` `agro-release` | Retargeted | The harness notifies the website |

## Storage

N/A. The site is a build output. The sync scripts write generated files at build time, and git ignores them.

## Architectural Decisions

- Harness `docs/` is the only source of AGRO docs. The website stores no copy in git.
- The website repository owns Console docs, the four standalone pages, and the blog.
- One Vercel project serves `mifune.dev` and the redirect host `agro.mifune.dev`.
- The installer paths stay HTTP 200, because old `curl` commands without `-L` do not follow a redirect.
- The release rebuild keeps the existing `repository_dispatch` contract. Only the target repository changes.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| `scripts/sync-agro-docs.test.mjs` | title frontmatter, link rewrite, `meta.json` output | US-003 |
| `scripts/sync-external-scripts.test.mjs` | shebang check, missing asset fails | US-007 |
| `scripts/build-oh-cli.test.mjs` | version stamp, output paths | US-007 |
| `scripts/check-docs-drift.test.mjs` | retired reference fails | US-008 |
| `scripts/check-ste.test.mjs` | release-tag checker URL, scan scope | US-008 |
| `src/config/agro-redirects.test.ts` | each sitemap URL maps, one hop | US-009 |
| `src/lib/analytics-consent.test.ts` | existing cases | US-002 regression |

## Design Principles

- One source of truth for each page.
- Delete the obsolete site after the cutover; do not keep a dormant copy.
- Preserve every public URL with one redirect hop or an HTTP 200.
- Keep each gate that agro-web runs today.

Kill criteria for US-011 are four events. An installer path returns HTTP 404. More than 5% of the sampled redirect map fails. Docs search stops working. Organic traffic stays down for 4 weeks.

If one kill criterion occurs, the operator points `agro.mifune.dev` back at GitHub Pages.

## Out of Scope

- A separate `docs.mifune.dev` host.
- Docs versioning.
- A fix to the current agro-web build failure.
- Changes to agro-console.
- Edits to harness `docs/` content beyond what the STE gate requires.

## Open Questions

None. The operator accepted these decisions on 2026-11-28:

1. The website posts `agro-getting-started` and `daily-work-with-agro` are canonical over their agro-web duplicates.
2. Docs search indexes the blog.
3. US-002 corrects `docs/deployment.md` from Netlify to Vercel.
4. The operator creates `VERCEL_DEPLOY_HOOK_URL` and `WEBSITE_DISPATCH_TOKEN` before the PR merges. US-001 to US-007 do not need these secrets.
5. If `@ducanh2912/next-pwa` does not build on Next 16, US-002 removes the PWA.
6. `feat/100-website-per-second-pricing` merged in PR #101 before this task, so US-002 has no rebase.

## Acceptance Criteria

- [ ] Each story except US-010 and US-011 has `passes: true`.
- [ ] `npm run build`, `npm run lint`, `npm test`, `npm run check:docs-drift`, and `npm run check:ste` exit 0 on the task branch.
- [ ] `git grep -n "agro.mifune.dev" -- src scripts posts` prints only the redirect host guard.

## Lessons

1. Claim: synced README links pointed at `/docs/agro`, which had no page on `mifune.dev`. Evidence: review finding 1. Outcome: fixed in this PR (`55a7a8d`).
2. Claim: the three prebuild mirror scripts resolved the latest release one at a time, so one build could mix releases. Evidence: review finding 2. Outcome: fixed in this PR (`826d4c3`). The script `scripts/prebuild.mjs` resolves the tag one time.
3. Claim: a GitHub rate limit fails a Vercel build, because the mirrored files are not in git. Evidence: review finding 3, and one rate-limited run on the hand. Outcome: dropped. The operator adds `GITHUB_TOKEN` to the Vercel build environment before the cutover in US-011.
4. Claim: the search index listed archived posts. Evidence: review finding 4. Outcome: fixed in this PR (`72f837a`).
5. Claim: the AGRO links on `/services` and in the FAQ opened the Console introduction. Evidence: review finding 5. Outcome: fixed in this PR (`b8da2d5`).
6. Claim: `scrollbar-none` is not a Tailwind 4 utility. Evidence: review finding 6. Outcome: fixed in this PR (`6904249`).
7. Claim: ESLint scanned generated build files. Evidence: review finding 7. Outcome: fixed in this PR (`37c897a`).
8. Claim: CI runs `ste-check.sh` from the AGRO release. Evidence: review finding 8. Outcome: dropped. The script comes from the same organization, the tag matches the synced docs, and agro-web used the same design.
9. Claim: `docs/deployment.md` omitted `agro.mifune.dev`. Evidence: review finding 9. Outcome: fixed in this PR (`e4c742d`).
10. Claim: `fumadocs-mdx` has no major version 16. Evidence: `npm view`. Outcome: fixed in this PR. The US-004 criterion now requires a peer-compatible version.
11. Claim: an `agro` CLI upgrade on the hand pulled a 1.7 GB image and filled the disk. Evidence: hand `df` showed 0 bytes free during US-004. Outcome: dropped. The advisor removed the unused `agro:0.37.0` image, and the hand environment is outside this task.
12. Claim: the Vercel preview build did not run, because the Ignored Build Step skipped it. Evidence: PR checks. Outcome: dropped. "What remains unverified" in the PR lists the Vercel build.
