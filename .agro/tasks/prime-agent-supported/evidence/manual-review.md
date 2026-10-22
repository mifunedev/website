# Manual review: Prime Agent in the agent picker (#96)

Worktree: `website/.worktrees/feat/96-prime-agent-picker`, branch `feat/96-prime-agent-picker`, base `origin/master` `21116fb`.

## Logo

- Source: `https://www.primeintellect.ai/favicon.ico` (HTTP 200, `image/vnd.microsoft.icon`, 15086 bytes, sha256 `5a605d5f6b6042b5433caa4f2f383bcc311118d1d79632efe4257109db1798cf`).
- The ICO has three 32-bit BMP frames: 48x48, 32x32, and 16x16.
- `ffmpeg -i favicon.ico -map 0:0 -frames:v 1 -pix_fmt rgba public/brand/agents/prime-agent.png` converts the 48x48 frame. ImageMagick and Pillow are not installed.
- `public/brand/agents/prime-agent.png` is a 48x48 RGBA PNG of 1857 bytes, sha256 `03da7a87654883471fbe4590a188c6d15fe247e3ff0138e9db6b40703e869c93`.

## Order

Prime Agent follows fx and precedes T3 Code. Like fx, the entry uses `docsUrl` to the agro GitHub docs.

## Commands

| Command | Exit |
|---|---|
| `npx --no-install prettier --check src/sections/AgentPickerSection.tsx` | 0 |
| `npm run lint` (`✔ No ESLint warnings or errors`) | 0 |
| `npm run build` | 0 |
| `tmux new-session -d -s web96-serve "npm start -- -p 3096"` | 0 |
| `curl -s -o /dev/null -w "%{http_code}" http://localhost:3096/` -> `200` | 0 |
| `agent-browser --session web96 set viewport 1280 720`, `open http://localhost:3096/#agents` (agent-browser 0.38.1) | 0 |
| `agent-browser --session web96 eval <card extraction>` -> `agent-cards.json` | 0 |
| `agent-browser --session web96 scrollintoview 'a[href$="prime-agent.md"]'` | 0 |
| `annotate-screenshot.sh agent-picker-prime-agent.png 'a[href$="prime-agent.md"]=the Prime Agent card'` | 0 |
| `agent-browser --session web96 close` | 0 |
| `tmux kill-session -t web96-serve` | 0 |
| `curl -s -o /dev/null -w "%{http_code}" https://github.com/mifunedev/agro/blob/main/docs/harnesses/prime-agent.md` -> `404` | 0 |

## Browser result

From `agent-cards.json`:

- Card 10 is `Prime Agent` with the description `Prime Intellect's coding agent.`, the href `https://github.com/mifunedev/agro/blob/main/docs/harnesses/prime-agent.md` (equal to the `docsUrl`), and the image `/brand/agents/prime-agent.png` with `complete && naturalWidth > 0`.
- Card 9 is `fx` and card 11 is `T3 Code`. All 12 cards are links.

`agent-picker-prime-agent.png`:

Callouts: 1 is the Prime Agent card.

The screenshot shows the Prime Agent card with the Prime Intellect logo, between fx and T3 Code.

## Open item

The docs target returns 404 now. The page goes live when mifunedev/agro#1501 merges.
