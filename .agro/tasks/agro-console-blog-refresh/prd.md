# PRD: Archive stale posts and publish three AGRO and Mifune Console guides

Status: DRAFT

## User Stories

### US-001: Archive the existing posts

**Description:** As a site reader, I want stale posts hidden from the blog index so that I read only current guides. Each old URL still resolves and shows a visible warning.

**Acceptance Criteria:**

- [ ] `src/types/post.ts` declares `archived?: boolean`, and `src/lib/posts.ts` reads `data.archived` into each `Post`.
- [ ] `getSortedPosts` returns no post that has `archived: true`. `getAllPostSlugs` and `getPostBySlug` still return archived posts.
- [ ] These 6 files set `archived: true` in the frontmatter: `posts/anthropic-reasoning-langchain-init-chat-model.md`, `posts/api-walkthrough-creating-agents.md`, `posts/connect-mcp-tools-to-orchestra-agents.md`, `posts/remote-dev-cloudflare-tunnel-claude-hooks.md`, `posts/rendering-interactive-charts.md`, `posts/swe-toolkit-2026.md`.
- [ ] `src/app/blog/[slug]/page.tsx` shows the banner text "This post is archived and can be out of date." above the content of each archived post. The banner links to `/blog`.
- [ ] `generateMetadata` in `src/app/blog/[slug]/page.tsx` returns `robots: { index: false }` for an archived post.
- [ ] After `npm run build`, `/blog` lists no archived post, `/sitemap.xml` holds no archived URL, and `/blog/swe-toolkit-2026` returns HTTP 200 with the banner.
- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] Verify in browser using agent-browser skill.

### US-002: Rewrite the getting-started post as "Self-host AGRO"

**Description:** As a developer, I want a current, illustrated self-host guide at `/blog/agro-getting-started`. With the guide, I can install AGRO, open a sandbox, start Herdr, install a harness, and delete the sandbox.

**Acceptance Criteria:**

- [ ] `posts/agro-getting-started.md` replaces the old body. The post covers, in this order: host prerequisites, install, `agro sandbox install docker`, `agro shell <name>`, `agro tool install herdr` and `herdr`, `agro harness install <id>`, optional `gh auth login && gh auth setup-git`, `agro ps <name>`, `agro stop`, and `agro destroy <name>`.
- [ ] The post places a data-loss warning before the `agro destroy` command.
- [ ] Each command in the post matches `docs/quickstart.md` and `docs/lifecycle-commands.md` in the agro repository at version 0.24.0. The post states "As of AGRO v0.24.0" at the top.
- [ ] The post links to `docs/quickstart.md`, `docs/installation.md`, `docs/connecting.md`, `docs/integrations/herdr.md`, and `docs/harnesses/overview.md` instead of copying their detail.
- [ ] The post uses the name "Mifune Console" and links to `/blog/run-agro-on-mifune-console` for the managed path.
- [ ] The post embeds at least 3 real screenshots from the agro `docs/img/` set and at least 1 muted looping MP4 terminal clip. All media files are under `public/blog/agro-getting-started/`.
- [ ] Each `<video>` element has `autoplay`, `muted`, `loop`, `playsinline`, and `preload="none"`. Each image has alt text.
- [ ] The frontmatter sets `date` to the publish date, `coverImage: "/blog/agro-getting-started/cover.png"`, and no `archived` key. The cover is 1200x630 pixels.
- [ ] Each media file is 4 MB or less.
- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] Verify in browser using agent-browser skill.

### US-003: Publish "Run AGRO on Mifune Console"

**Description:** As a developer, I want a hands-on Mifune Console guide. With the guide, I can sign in, create a free `n4` node, connect, install a harness, and manage nodes from the `agro` CLI.

**Acceptance Criteria:**

- [ ] `posts/run-agro-on-mifune-console.md` exists. The post covers, in this order: GitHub sign-in at `https://console.mifune.dev`, free-tier terms, node creation with the `n4` spec, the Connect menu (code-server and the Ghostty browser terminal), `agro harness install <id> --host`, the CLI path (`agro auth login`, `agro node create --spec n4 --free-tier`, `agro node list`, `agro node delete <id>`), and node deletion.
- [ ] The post states that no sandbox container runs on a node created in the Console UI, as `projects/mifunedev/agro-console/README.md` states. The post states the profile that `agro node create` uses, as `docs/lifecycle-commands.md:351` states.
- [ ] Prices and free-tier limits in the post match `projects/mifunedev/agro-console/README.md`. The post links to `/pricing` for current prices.
- [ ] The post states "As of Mifune Console v1.17.0 and AGRO v0.24.0" at the top.
- [ ] The post embeds at least 3 screenshots and 1 muted looping MP4 clip from the live Console: the create form, the running node page, and the Connect menu or terminal. All media files are under `public/blog/run-agro-on-mifune-console/`. No screenshot shows an email address, a token, an IP address, or an SSH key.
- [ ] The worker creates at most 1 free `n4` node for capture and deletes the node after capture. `agro node list` or the Console node list shows no capture node at the end.
- [ ] If no signed-in Console session is available, the worker stops and reports `BLOCKED: operator sign-in required`.
- [ ] Each `<video>` element has `autoplay`, `muted`, `loop`, `playsinline`, and `preload="none"`. Each image has alt text. Each media file is 4 MB or less.
- [ ] The frontmatter sets `coverImage: "/blog/run-agro-on-mifune-console/cover.png"`. The cover is 1200x630 pixels.
- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] Verify in browser using agent-browser skill.

### US-004: Publish "Daily work with AGRO"

**Description:** As an AGRO user, I want a guide to the daily agent workflow. With the guide, I can clone a project, isolate work in worktrees, and run `/prd`, `/delegate`, and `/council`.

**Acceptance Criteria:**

- [ ] `posts/daily-work-with-agro.md` exists. The post covers, in this order: project clones under `projects/<owner>/<repo>/`, worktrees under `.worktrees/`, Herdr panes for parallel agents, `/council` for scope decisions, `/prd` for a plan, `/delegate` for bounded workers, and CI checks before review.
- [ ] Each skill description in the post matches the canonical `SKILL.md` under `.agro/skills/` in the agro repository at version 0.24.0.
- [ ] The post states "As of AGRO v0.24.0" at the top and links to `/blog/agro-getting-started` and `/blog/run-agro-on-mifune-console`.
- [ ] The post embeds at least 2 screenshots and 1 muted looping MP4 clip of a real Herdr session with two or more panes. All media files are under `public/blog/daily-work-with-agro/`.
- [ ] Each `<video>` element has `autoplay`, `muted`, `loop`, `playsinline`, and `preload="none"`. Each image has alt text. Each media file is 4 MB or less.
- [ ] The frontmatter sets `coverImage: "/blog/daily-work-with-agro/cover.png"`. The cover is 1200x630 pixels.
- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] Verify in browser using agent-browser skill.

### US-005: Record the manual review journey

**Description:** As the operator, I want an annotated browser journey of the finished blog so that I can review the change without a local build.

**Acceptance Criteria:**

- [ ] The journey runs against the Vercel preview URL of the PR, or against `npm run start` after `npm run build`.
- [ ] `.agro/tasks/agro-console-blog-refresh/evidence/` holds annotated screenshots of: `/blog` with exactly 3 cards, one archived post with the banner, each of the 3 new posts with media in view, and `/sitemap.xml`.
- [ ] `.agro/tasks/agro-console-blog-refresh/evidence/manual-review.md` lists each screenshot, the URL, and the observed result.
- [ ] Each of the 3 new posts plays its video in the browser, and no image returns HTTP 404.
- [ ] Verify in browser using agent-browser skill.

## Summary

The blog loads every `posts/*.md` file through `src/lib/posts.ts:14-57`. `getSortedPosts` feeds the blog index (`src/app/blog/page.tsx:19`) and the sitemap (`src/app/sitemap.ts:42`). `getAllPostSlugs` feeds `generateStaticParams` (`src/app/blog/[slug]/page.tsx:22`). `MarkdownContent` renders Markdown with `rehype-raw` (`src/components/ui/MarkdownContent.tsx:47`), so raw `<video>` and `<img>` tags render.

The 7 current posts describe Orchestra, an old toolkit, and an old AGRO on-ramp. The on-ramp misses AGRO v0.20 to v0.24 and calls Mifune Console a managed Docker workspace. The footer (`src/sections/FooterSection.tsx:85`), the About section (`src/sections/AboutSection.tsx:114`), and a redirect (`next.config.mjs:57`) point to `/blog/agro-getting-started`.

The operator approved this approach in a council session on 2026-10-18:

1. An `archived: true` flag hides 6 posts from the index and the sitemap and keeps their URLs with a banner.
2. Post 1 replaces the body of `posts/agro-getting-started.md` in place.
3. Post 2 is a hands-on Mifune Console guide. The production free tier is live.
4. Post 3 covers the daily agent workflow.

## Key Integration Points

| File | Function(s) / Symbol(s) | Role |
|---|---|---|
| `src/types/post.ts` | `Post` | Adds the `archived` field |
| `src/lib/posts.ts` | `getSortedPosts`, `getPostBySlug` | Reads the flag and filters the index list |
| `src/app/blog/[slug]/page.tsx` | `generateMetadata`, page component | Adds the banner and `robots` metadata |
| `src/app/sitemap.ts` | default export | Inherits the filter through `getSortedPosts` |
| `src/components/cards/BlogCard.tsx` | `BlogCard` | Shows `coverImage`; the fallback `/images/placeholder-blog.jpg` does not exist |
| `posts/*.md` | frontmatter | Archive flags and the 3 guides |
| `public/blog/<slug>/` | static media | Screenshots, clips, and covers |

## Interface Integration Points

| Surface | Change Type | Description |
|---|---|---|
| `/blog` | Modified | Lists only the 3 new posts |
| `/blog/<archived-slug>` | Modified | Shows the archive banner and sets `noindex` |
| `/blog/agro-getting-started` | Modified | New self-host guide at the same URL |
| `/blog/run-agro-on-mifune-console` | New | Mifune Console guide |
| `/blog/daily-work-with-agro` | New | Daily workflow guide |
| `/sitemap.xml` | Modified | Drops archived URLs |

## Storage

Posts stay as Markdown files in `posts/`. Media goes into `public/blog/<slug>/`, and Next.js serves each file at `/blog/<slug>/<file>`. Media capture sources, such as terminal tape files, go into `.agro/tasks/agro-console-blog-refresh/media/`.

## Architectural Decisions

- The `archived` frontmatter key is the single source of truth for archive state. `getSortedPosts` is the only filter.
- Archived pages stay statically generated, so old links keep working.
- Videos are MP4 files, not GIFs, because MP4 loops are smaller at equal quality. The 4 MB limit for each file is a budget that this plan sets.
- Each post records the product versions it describes, because AGRO and Mifune Console release about once a day.
- Terminal clips use the `agro` CLI from the agro repository at v0.24.0. The installed sandbox CLI is v0.16.0 and does not have `agro auth` or `agro node`. The worker shows `agro --version` in a frame or records the version in the evidence.
- Post 1 reuses real captures from the agro `docs/img/` set for host-side steps.

## Test Plan (TDD)

| Test File | Case(s) | Validates |
|---|---|---|
| N/A: the repository has no test runner | `npm run lint` | Lint passes |
| N/A | `npm run build` | Static generation succeeds for all 7 old slugs and the 2 new slugs |
| N/A | `grep -c '<loc>' .next/server/app/sitemap.xml.body` or the served `/sitemap.xml` | The sitemap holds no archived URL |
| N/A | agent-browser journey (US-005) | Index, banner, media, and sitemap behave as stated |
| N/A | Vercel and Vercel Preview Comments checks on the PR | The deploy preview builds |

## Design Principles

- Keep the smallest change that meets the objectives: one flag, one filter, one banner.
- Link to the canonical docs. Do not copy setup detail into posts.
- Use real captures only. Do not fake a terminal or a Console screen.
- Add no explanatory comments to tracked code.
- Write post prose in plain, direct English.

## Out of Scope

- An archive section or archive page on the site.
- One post for each harness.
- OpenShell and microsandbox runtimes, Langfuse, Slack gateways, and Console self-hosting.
- Changes to the agro or agro-console repositories.
- A test runner or GitHub Actions CI for the website.

## Open Questions

- US-003 needs a signed-in Mifune Console session for agent-browser and for `agro auth login`. The agent cannot complete GitHub sign-in alone. The operator signs in once when US-003 reports `BLOCKED: operator sign-in required`.

## Acceptance Criteria

- [ ] `/blog` lists exactly 3 posts: `agro-getting-started`, `run-agro-on-mifune-console`, and `daily-work-with-agro`.
- [ ] Each of the 6 archived URLs returns HTTP 200 with the archive banner.
- [ ] `npm run lint` and `npm run build` exit 0.
- [ ] The Vercel checks on the PR report success.
- [ ] No capture node remains in the Console after US-003.

## Lessons

Filled by the advisor before undraft.
