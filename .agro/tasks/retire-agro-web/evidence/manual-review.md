# US-012 manual review evidence

Tested revision: `3b77aabd1e02b2a9feff69da02262ea6f4a7f1b2` on `feat/105-retire-agro-web`
(application code identical to `74ed1df`; the later commit changes only `prd.json`).
Observed on 2026-11-28 on hand `agro-sbx-dev-001`, image `ghcr.io/mifunedev/agro:0.41.0`.
Every expected result below is copied from that run.

## Server, CLI, or API shape

### Setup

Prerequisites: a checkout of `feat/105-retire-agro-web` with `npm install` done, Docker,
and the `agro` CLI (0.41.0). Network access to `github.com` for the `prebuild` docs and
installer sync. No env file; the commands pass no environment.

1. Port check. Runs on the host of the checkout.

   ```bash
   agro run -- bash -c 'ss -ltnp'
   ss -ltnp | grep -E ':3000\b' || echo "host :3000 free"
   ```

   Expected output: the `agro run` namespace lists only the header
   `State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess`, and the host prints
   `host :3000 free`. Expected exit status: 0. If a line shows `:3000`, stop: the process
   in that line holds the port.

   The browser journey also uses a local forward on port 3105. On the review machine,
   `ss -ltnp | grep -E ':3105\b' || echo "brain :3105 free"` printed `brain :3105 free`.

2. Build and start. Runs on the host, in a named tmux session so a disconnect does not
   stop the server.

   ```bash
   tmux new -d -s web105 "agro run -- bash -c 'npm run build && npm start -- -p 3000' 2>&1 | tee /tmp/web105/run.log"
   ```

   Output, trimmed to the summary lines (webpack cache warnings, `MODULE_TYPELESS_PACKAGE_JSON`
   warnings, PWA notes, and the npm update notice removed):

   ```text
   > client@0.1.0 prebuild
   > node scripts/generate-llm-txt.mjs && node scripts/sync-agro-docs.mjs && node scripts/sync-external-scripts.mjs && node scripts/build-oh-cli.mjs

   Generated llm.txt at /home/exedev/projects/mifunedev/website/public/llm.txt
   [sync-agro-docs] wrote content/docs/agro/ <- https://github.com/mifunedev/agro/archive/v0.41.0.tar.gz (mifunedev/agro@v0.41.0, 35 pages)
   [sync-scripts] wrote public/install.sh <- https://github.com/mifunedev/agro/releases/download/v0.41.0/install.sh (mifunedev/agro@v0.41.0, 10522 bytes)
   [sync-scripts] wrote public/get-agro.sh <- https://github.com/mifunedev/agro/releases/download/v0.41.0/install.sh (mifunedev/agro@v0.41.0, 10522 bytes)
   [build-oh-cli] wrote agro.js <- https://github.com/mifunedev/agro/releases/download/v0.41.0/agro.js (mifunedev/agro@v0.41.0, 440151 bytes)
   [build-oh-cli] wrote oh.js <- https://github.com/mifunedev/agro/releases/download/v0.41.0/agro.js (mifunedev/agro@v0.41.0, 440151 bytes)

   > client@0.1.0 build
   > next build --webpack

   ▲ Next.js 16.4.6 (webpack)
   ✓ Compiled successfully in 97s
     Finished TypeScript in 12.0s ...
   ✓ Generating static pages using 1 worker (84/84) in 9.2s

   Route (app)                                                Revalidate  Expire
   ┌ ○ /                                                              1h      1y
   ├ ƒ /api/search
   ├ ○ /blog
   ├   /blog/[slug]
   │ ├ ● /blog/agro-getting-started
   │ ├ ● /blog/anthropic-reasoning-langchain-init-chat-model
   │ ├ ● /blog/api-walkthrough-creating-agents
   │ └ ● [+14 more paths]
   ├   /docs/[[...slug]]
   │ ├ ● /docs/agro/agro-directory-layout
   │ ├ ● /docs/agro/configuration
   │ ├ ● /docs/agro/connecting
   │ └ ● [+45 more paths]
   ├ ○ /sitemap.xml
   └ ○ /socials

   > client@0.1.0 start
   > next start -p 3000

   ▲ Next.js 16.4.6
   - Local:         http://localhost:3000
   ✓ Ready in 282ms
   ```

   Expected: the log ends with `✓ Ready in`. Expected exit status: the server keeps
   running. `git status --short` shows no tracked change after the build.

### A. Host redirects for agro.mifune.dev

Prerequisites: the server from Setup step 2 is ready. Runs inside the running `agro run`
container, because `localhost:3000` is that container's namespace:

```bash
CID=$(docker ps -q --filter ancestor=ghcr.io/mifunedev/agro:0.41.0 | head -1)
docker exec -it "$CID" bash
```

1. Ten sampled URLs from `evidence/agro-web-sitemap.xml` (root, docs/agro, docs/console,
   dated blog, skipped-duplicate blog, same-slug blog):

   ```bash
   for p in / /docs/agro/quickstart /docs/agro/harnesses/claude-code /docs/console/connect /docs/console/nodes /blog/2026/05/19/four-words-multi-agent /blog/2026/04/28/archive/byoh /blog/deploy-open-harness-with-docker /blog/open-harness-demo-guide /blog/first-sandbox-agent-auth; do
     echo "== $p"; curl -sI -H 'Host: agro.mifune.dev' localhost:3000$p | grep -iE '^(HTTP|location|content-type)'
   done
   ```

   Observed output:

   | Path | Kind | Status | `location` |
   |---|---|---|---|
   | `/` | root | `HTTP/1.1 308 Permanent Redirect` | `https://mifune.dev/docs` |
   | `/docs/agro/quickstart` | docs/agro | `308` | `https://mifune.dev/docs/agro/quickstart` |
   | `/docs/agro/harnesses/claude-code` | docs/agro | `308` | `https://mifune.dev/docs/agro/harnesses/claude-code` |
   | `/docs/console/connect` | docs/console | `308` | `https://mifune.dev/docs/console/connect` |
   | `/docs/console/nodes` | docs/console | `308` | `https://mifune.dev/docs/console/nodes` |
   | `/blog/2026/05/19/four-words-multi-agent` | blog dated | `308` | `https://mifune.dev/blog/four-words-multi-agent` |
   | `/blog/2026/04/28/archive/byoh` | blog dated | `308` | `https://mifune.dev/blog/byoh` |
   | `/blog/deploy-open-harness-with-docker` | blog skipped duplicate | `308` | `https://mifune.dev/blog/agro-getting-started` |
   | `/blog/open-harness-demo-guide` | blog skipped duplicate | `308` | `https://mifune.dev/blog/daily-work-with-agro` |
   | `/blog/first-sandbox-agent-auth` | blog same slug | `308` | `https://mifune.dev/blog/first-sandbox-agent-auth` |

   Expected exit status: 0.

2. The four installer paths:

   ```bash
   for p in /install.sh /get-agro.sh /agro.js /oh.js; do
     echo "== $p"; curl -sI -H 'Host: agro.mifune.dev' localhost:3000$p | grep -iE '^(HTTP|location|content-type)'
   done
   ```

   Observed output:

   ```text
   == /install.sh
   HTTP/1.1 200 OK
   Content-Type: text/plain; charset=utf-8
   == /get-agro.sh
   HTTP/1.1 200 OK
   Content-Type: text/plain; charset=utf-8
   == /agro.js
   HTTP/1.1 200 OK
   Content-Type: application/javascript; charset=utf-8
   == /oh.js
   HTTP/1.1 200 OK
   Content-Type: application/javascript; charset=utf-8
   ```

   Expected: no `location` header on any installer path. Expected exit status: 0.

3. Control path. Without the agro host header, the same paths serve the site; an unknown
   agro path falls back to the docs:

   ```bash
   curl -sI localhost:3000/ | grep -iE '^(HTTP|content-type)'
   curl -sI localhost:3000/docs/agro/quickstart | grep -iE '^(HTTP|content-type)'
   curl -sI -H 'Host: agro.mifune.dev' localhost:3000/no-such-page | grep -iE '^(HTTP|location)'
   ```

   Observed output: `HTTP/1.1 200 OK` with `Content-Type: text/html; charset=utf-8` for the
   first two, and `HTTP/1.1 308 Permanent Redirect` with `location: https://mifune.dev/docs`
   for the third. Expected exit status: 0.

## User-journey shape

### Setup

1. On the machine with the browser, forward a local port to the container (replace
   `<ip>` with `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$CID"`;
   the run used `172.17.0.3`):

   ```bash
   tmux new -d -s fwd105 "ssh -N -L 3105:<ip>:3000 <hand-host>"
   ```

   Expected: `curl -sI localhost:3105/ | head -1` prints `HTTP/1.1 200 OK`.

2. Open `http://localhost:3105/` at 1280x720 CSS.

### B. Home to docs, search, AGRO page, blog, post (1280 px)

1. On `/`, click the nav **Docs** link. Expected: the same tab goes to
   `http://localhost:3105/docs` with title "Introduction | Mifune"; the tab list shows one
   tab; the link has `href="/docs"` and no `target`.
   Screenshot before the click: `US-012/01-home-1280.png`.
   Callouts: 1 is the nav Docs link. 2 is the nav Blog link.

2. On `/docs`. Expected: the page heading "Mifune Console" and the sidebar search button
   "Search Ctrl K". Screenshot: `US-012/02-docs-1280.png`.
   Callouts: 1 is the docs page title. 2 is the search button with Ctrl K.

3. Press Ctrl+K (Cmd+K on macOS) and type `quickstart`. Expected: the search dialog lists
   "Quickstart" first (option id `fd-search-option-/docs/agro/quickstart`), then
   "Installation", "Introduction", "Contributing". Screenshot:
   `US-012/03-search-quickstart-1280.png`.
   Callouts: 1 is the typed query. 2 is the top Quickstart result.

4. Press Enter. Expected: URL `http://localhost:3105/docs/agro/quickstart`, title
   "Quickstart | Mifune", heading "Quickstart", the sidebar entry marked
   `aria-current="page"`. Screenshot: `US-012/04-agro-quickstart-1280.png`.
   Callouts: 1 is the Quickstart title. 2 is the active AGRO sidebar entry.

5. Go to `/blog`. Expected: heading "Mifune Blog" and title "Blog | Mifune".
   Screenshot: `US-012/05-blog-index-1280.png`.
   Callouts: 1 is the blog index title.

6. Scroll to the card "Your first sandbox: signing in gh, Claude, Pi, and Hermes".
   Screenshot: `US-012/06-blog-index-post-link-1280.png`.
   Callouts: 1 is the ported post card.

7. Click the card. Expected: URL `http://localhost:3105/blog/first-sandbox-agent-auth`,
   heading "Your first sandbox: signing in gh, Claude, Pi, and Hermes", date
   "July 6, 2026". Screenshot: `US-012/07-blog-post-1280.png`.
   Callouts: 1 is the ported post title. 2 is the publish date.

   The page reported no JavaScript errors (`agent-browser errors --json` returned `[]`).

### C. Docs at 414 px

1. Set the viewport to 414x896 CSS and open `/docs`. Expected: heading "Mifune Console",
   the "Open Sidebar" and "Open Search" buttons in the top bar, and no horizontal scroll
   (`scrollWidth` 414 equals `clientWidth` 414). Screenshot: `US-012/08-docs-414.png`.
   Callouts: 1 is the docs page title. 2 is sidebar.

## Cleanup

1. On the browser machine: `tmux kill-session -t fwd105`. Expected: `ss -ltn | grep 3105`
   prints nothing.
2. On the host: `tmux kill-session -t web105`, then stop the `agro run` container if it is
   still listed (`docker ps --filter ancestor=ghcr.io/mifunedev/agro:0.41.0`;
   `docker stop <id>`). In the run, the container stayed up after the tmux kill and
   `docker stop` removed it.
3. On the host: `agro run -- bash -c 'rm -rf .next'`. Expected: `git status --short` shows
   no tracked change.
