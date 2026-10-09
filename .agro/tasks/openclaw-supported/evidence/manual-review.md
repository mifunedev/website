# Manual review: OpenClaw supported in the agent picker (#76)

Worktree: `website/.worktrees/feat/76-openclaw-supported`, branch `feat/76-openclaw-supported`, base `origin/master` `b6374d7`.

## Logo

- Source: `https://openclaw.ai/apple-touch-icon.png` (referenced by `<link rel="apple-touch-icon">` on `https://openclaw.ai`).
- `https://openclaw.ai/favicon.ico` and `https://docs.openclaw.ai/favicon.ico` return 404.
- The file is a 180x180 PNG of 5920 bytes. Other assets in `public/brand/agents/` range from 100x100 to 816x816, so the file is used without conversion.
- `sha256sum public/brand/agents/openclaw.png` and the sha256 of the live URL are both `e8c7ce0a3a6c52bd904cc55e31a5b3a8b6392dcd70ba9e220ecf0ef1d6bd8c16`.

## Order

The picker already follows the order of the agro `docs/harnesses/overview.md` table, except for OpenClaw. OpenClaw moves to the position after Hermes.

## Commands

| Command | Exit |
|---|---|
| `npm ci --no-audit --no-fund` (lockfile is `package-lock.json`) | 0 |
| `pnpm lint` (`✔ No ESLint warnings or errors`) | 0 |
| `pnpm build` | 0 |
| `tmux new-session -d -s web76-serve "pnpm start -p 3076"` | 0 |
| `curl -s -o /dev/null -w "%{http_code}" http://localhost:3076/` -> `200` | 0 |
| `agent-browser --session web76 open http://localhost:3076/#agents` (agent-browser 0.38.1) | 0 |
| `agent-browser --session web76 eval <card extraction>` -> `agent-cards.json` | 0 |
| `agent-browser --session web76 screenshot agent-picker.png`, `agent-picker-openclaw.png` | 0 |
| `agent-browser --session web76 close` | 0 |
| `tmux kill-session -t web76-serve` | 0 |
| `curl -s -o /dev/null -w "%{http_code}" https://agro.mifune.dev/docs/harnesses/openclaw` -> `404` | 0 |

## Browser result

From `agent-cards.json`:

- The OpenClaw card has the description `Gateway-first personal agent runtime.`, the href `https://agro.mifune.dev/docs/harnesses/openclaw`, and the image `/brand/agents/openclaw.png` with `complete && naturalWidth > 0`.
- All 11 cards are links. The `#agents` section text has no `Coming soon` (`comingSoon: false`).
- `agent-picker-openclaw.png` shows the OpenClaw card with the red OpenClaw logo, after Hermes.

## Open item

The docs target returns 404 now. The page goes live when mifunedev/agro-web#77 merges and deploys.
