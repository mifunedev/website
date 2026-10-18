# Manual review evidence: agro-console-blog-refresh

Observed run on 2026-10-18 against base commit `499e8d37d0cfebc137f7b8fc41a234581736b265` (branch `feat/88-us-005`).

## Setup

Runs in the sandbox, in the worktree of `feat/88-us-005`.

1. `npm run build`. Exit status: 0. The build output lists `/blog`, `/blog/[slug]` with 9 paths, and `/sitemap.xml`.
2. `npm run start -- -p 3505` in tmux session `w-us-005`. `curl -s -o /dev/null -w '%{http_code}' http://localhost:3505/blog` printed `200`.
3. agent-browser 0.38.1, one named session for the worktree. Viewport 1280x720 for the index, archive, and sitemap screenshots. Viewport 1280x1600 for the 3 post screenshots, so that a video and an image fit in one view.

## Screenshots

### A. Blog index

- File: `blog-index-3-cards.png`
- URL: `http://localhost:3505/blog`
- Assertion: the page has exactly 3 cards (`main div.cursor-pointer.rounded-lg.border` count is `3`). Each card cover image is loaded (`naturalWidth` 422, `complete` true): `/blog/agro-getting-started/cover.png`, `/blog/daily-work-with-agro/cover.png`, `/blog/run-agro-on-mifune-console/cover.png`.
- Observed: card titles "Self-host AGRO: Your Coding-Agent Workspace in Docker", "Daily work with AGRO: worktrees, Herdr panes, and planned delegation", "Run AGRO on Mifune Console". Each card shows "Ryan Eggleston" and "October 18, 2026".

Callouts: 1 is card 1 cover. 2 is card 1 title. 3 is card 2 cover. 4 is card 2 title. 5 is card 3 cover. 6 is card 3 title.

### B. Archived post

- File: `archived-swe-toolkit-banner.png`
- URL: `http://localhost:3505/blog/swe-toolkit-2026`
- Observed: title "SWE Toolkit (2026): A Practical Guide to Agentic Coding Workflows", date "January 21, 2026", banner (`role="note"`) "This post is archived and can be out of date. Read current posts".

Callouts: 1 is the post date. 2 is the archive banner.

### C. Self-host AGRO post

- File: `post-agro-getting-started-media.png`
- URL: `http://localhost:3505/blog/agro-getting-started`
- Assertion: video `/blog/agro-getting-started/agro-cli.mp4` has `paused` false and `readyState` 4. The article has 7 images and 0 images with `naturalWidth` 0.
- Observed: the video frame shows "$ agro --version", "0.24.0", "$ agro ha". The caption reads "A real recording with the v0.24.0 CLI: agro --version prints 0.24.0, and agro harness list shows each harness and whether it is installed." The image below is `quickstart-harness-install.png` with "$ agro harness install claude-code" and "claude-code: installed".

Callouts: 1 is the playing video. 2 is the loaded image.

### D. Run AGRO on Mifune Console post

- File: `post-run-agro-on-mifune-console-media.png`
- URL: `http://localhost:3505/blog/run-agro-on-mifune-console`
- Assertion: video `/blog/run-agro-on-mifune-console/create-free-node.mp4` has `paused` false and `readyState` 4. The article has 9 images and 0 images with `naturalWidth` 0.
- Observed: the video frame shows "Create your free node", "Free", "24 free running hours each month — no credit card required", "Agro". The text between reads "The node page opens at once and shows the status." The image below is `node-running.png` with "blog-capture", "Running", "Restart", "Pause", "Destroy". The IP and Owner values are redacted in the image.

Callouts: 1 is the playing video. 2 is the loaded image.

### E. Daily work with AGRO post

- File: `post-daily-work-with-agro-media.png`
- URL: `http://localhost:3505/blog/daily-work-with-agro`
- Assertion: video `/blog/daily-work-with-agro/herdr-panes.mp4` has `paused` false and `readyState` 4. The article has 4 images and 0 images with `naturalWidth` 0.
- Observed: the video frame shows a Herdr pane with "website $ ls -1 .worktrees/feat/" and "88-us-001" to "88-us-004". The image below is `herdr-two-panes.png` with two panes; the right pane lists "### US-001: Archive the existing posts" to "### US-005: Record the manual review journey".

Callouts: 1 is the playing video. 2 is the loaded image.

### F. Sitemap

- File: `sitemap-xml.png`
- URL: `http://localhost:3505/sitemap.xml`
- Observed: 8 `<loc>` entries: `https://mifune.dev`, `https://mifune.dev/pricing`, `https://mifune.dev/services`, `https://mifune.dev/blog`, `https://mifune.dev/socials`, `https://mifune.dev/blog/agro-getting-started`, `https://mifune.dev/blog/daily-work-with-agro`, `https://mifune.dev/blog/run-agro-on-mifune-console`. No archived slug is present.
- Note: the Chrome XML viewer document creates elements without the XHTML namespace. Before the annotation script ran, the session set `document.createElement` to `createElementNS("http://www.w3.org/1999/xhtml", ...)` and added `data-review` attributes to the 4 callout lines. The page content was not changed.

Callouts: 1 is the blog index URL. 2 is the Self-host AGRO URL. 3 is the Daily work URL. 4 is the Mifune Console URL.

## Media URL check (curl)

Command: each `/blog/<slug>/<file>` path in `posts/agro-getting-started.md`, `posts/run-agro-on-mifune-console.md`, and `posts/daily-work-with-agro.md`, requested with `curl -s -o /dev/null -w '%{http_code}' http://localhost:3505<path>`.

Result: 22 URLs, 22 returned `200`, 0 returned another status.

```text
200 /blog/agro-getting-started/agro-cli-poster.png
200 /blog/agro-getting-started/agro-cli.mp4
200 /blog/agro-getting-started/cover.png
200 /blog/agro-getting-started/herdr-two-panes.png
200 /blog/agro-getting-started/lifecycle-commands-ps.png
200 /blog/agro-getting-started/quickstart-harness-install.png
200 /blog/agro-getting-started/quickstart-sandbox-install.png
200 /blog/agro-getting-started/quickstart-shell.png
200 /blog/daily-work-with-agro/cover.png
200 /blog/daily-work-with-agro/herdr-panes.mp4
200 /blog/daily-work-with-agro/herdr-three-panes.png
200 /blog/daily-work-with-agro/herdr-two-panes.png
200 /blog/run-agro-on-mifune-console/connect-menu.png
200 /blog/run-agro-on-mifune-console/console-sign-in.png
200 /blog/run-agro-on-mifune-console/cover.png
200 /blog/run-agro-on-mifune-console/create-form.png
200 /blog/run-agro-on-mifune-console/create-free-node-poster.png
200 /blog/run-agro-on-mifune-console/create-free-node.mp4
200 /blog/run-agro-on-mifune-console/node-running.png
200 /blog/run-agro-on-mifune-console/nodes-after-delete.png
200 /blog/run-agro-on-mifune-console/terminal-harness-install.png
200 /blog/run-agro-on-mifune-console/terminal-harness-list.png
```

## Browser assertions

On each new post, the session scrolled the full page to load lazy images, scrolled the video into view, waited 2.5 s, then evaluated the video state and the image state.

| Post | Video | paused | readyState | Images | naturalWidth 0 |
|---|---|---|---|---|---|
| agro-getting-started | agro-cli.mp4 | false | 4 | 7 | 0 |
| run-agro-on-mifune-console | create-free-node.mp4 | false | 4 | 9 | 0 |
| daily-work-with-agro | herdr-panes.mp4 | false | 4 | 4 | 0 |

## Archived URLs (curl)

Each archived URL returned `200`, contains "This post is archived and can be out of date.", and is absent from `/sitemap.xml`: `anthropic-reasoning-langchain-init-chat-model`, `api-walkthrough-creating-agents`, `connect-mcp-tools-to-orchestra-agents`, `remote-dev-cloudflare-tunnel-claude-hooks`, `rendering-interactive-charts`, `swe-toolkit-2026`.

## Cleanup

The agent-browser session was closed. tmux session `w-us-005` was killed.
