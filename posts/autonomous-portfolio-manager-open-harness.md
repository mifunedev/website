---
title: "How I Built an Autonomous Portfolio Manager Using Open Harness"
date: "2026-03-29"
excerpt: "Isolated Docker sandboxes for AI coding agents — with persistent memory, quality gate skills, and cron-driven autonomy."
categories: ["Behind the Build", "Agent Automation", "Claude Code"]
coverImage: "https://github.com/ruska-ai/static/blob/master/blog/autonomous-portfolio-manager-open-harness.png?raw=true"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

AI coding agents like Claude Code and OpenAI Codex are incredibly powerful — but they need full system access to be useful. File writes, shell commands, package installs, Docker operations. The moment you hand an agent `--dangerously-skip-permissions`, you're trusting it with your entire machine.

I wasn't comfortable with that trade-off. So I built [Open Harness](https://github.com/ryaneggz/open-harness) — isolated Docker sandboxes where AI agents can operate with full permissions without touching your host system. And to prove it works, I built an autonomous portfolio manager that runs entirely inside one of these sandboxes.

## The Problem

Most AI coding agent setups look like this: clone a repo, run the agent on your laptop, hope it doesn't `rm -rf` something important. You either nerf the agent's permissions (making it useless for real work) or give it full access (making you nervous).

What I wanted was a middle ground — full agent autonomy inside a disposable container. If the agent breaks something, you tear down the container and spin up a new one. Your host machine never knows the difference.

## The Solution: Open Harness

Open Harness provisions isolated Docker sandboxes with everything an AI agent needs pre-installed: Node.js, Bun, uv, Docker CLI, GitHub CLI, ripgrep, tmux, and the agents themselves. Each sandbox gets:

- **Persistent identity** — `SOUL.md` defines who the agent is, `MEMORY.md` gives it long-term recall across sessions
- **Workspace isolation** — only the `workspace/` directory is bind-mounted and persists; everything else is ephemeral
- **Autonomous heartbeats** — a cron-based system that wakes agents on a schedule to perform background tasks
- **Multi-agent support** — named sandboxes run in parallel, each with its own container, worktree, and git branch

Spinning up a new agent takes one command:

```bash
make NAME=portfolio-mgr BASE_BRANCH=main quickstart
```

This creates a git worktree on `agent/portfolio-mgr`, builds the Docker image, starts the container, and provisions all tools non-interactively. You're inside a fully equipped sandbox in under two minutes.

## The Showcase: An Autonomous Portfolio Manager

To stress-test Open Harness, I built something non-trivial — a quantitative portfolio manager that runs a mock $100K portfolio based on Bridgewater Associates' Q4 2025 13F filing and Ray Dalio's All Weather strategy.

The agent's `SOUL.md` defines it as a data-driven quant that leads with numbers, not prose. It uses yfinance for real market prices and WebSearch for macro sentiment. Here's how the portfolio breaks down:

| Asset Class | Allocation | Vehicle |
|---|---|---|
| US Equities (broad) | 30% | SPY |
| Tech/Growth Overweight | 10% | NVDA, AMZN, GOOGL |
| Long-Term US Bonds | 22% | TLT |
| Intermediate US Bonds | 8% | IEF |
| Bitcoin (cycle-out) | 10% | BTC-USD |
| Emerging Markets | 5% | IEMG |
| Gold | 5% | GLD |
| Commodities | 5% | DBC |
| Cash Reserve | 5% | — |

The allocation isn't a generic All Weather split — it's informed by Bridgewater's actual Q4 2025 moves. Their 10x increase in SPY to $4.8B (22% of their portfolio), heavy tech conviction in NVDA and GOOGL, and the gutting of consumer defensives like PG and JNJ all shaped the initial positioning.

### Skills as Quality Gates

This is where it gets interesting. The agent can't just rebalance on a whim. It has four skills that act as **quality gates** — every one must pass before a trade executes.

**Risk Metrics** — the hard gates:

| Metric | Threshold |
|---|---|
| Sharpe Ratio | > 0.5 (annualized) |
| Sortino Ratio | > 0.7 |
| Max Drawdown | < 20% |
| Portfolio Beta | 0.4 – 1.2 |
| Annualized Volatility | < 15% |

**Allocation Check** — structural constraints like no single position exceeding 40%, bonds + gold + commodities maintaining at least 25% of the portfolio, and individual stocks capped at 10%.

**Sentiment Score** — aggregates macro sentiment across seven categories (equity sentiment, Fed policy, bond market, inflation, geopolitical, crypto, earnings) into a single score. Below -1.0? Manual review required before increasing equity exposure. Above 1.5? Euphoria warning.

**Strategy Review** — the meta-gate. It evaluates whether the agent's decisions are actually improving risk-adjusted returns over time by comparing backtest predictions against forward performance for each strategy version.

If a proposed rebalance would push Sharpe below 0.5 or max drawdown above 20%, the agent flags it for review instead of auto-executing. The skills aren't suggestions — they're hard constraints.

### Strategy Performance Ledger

Every strategy version gets tracked in `ledger.json` with its predicted metrics at entry and actual forward performance. The `strategy-review` skill compares the portfolio against three benchmarks:

- **Pure All Weather** — 30% VTI / 40% TLT / 15% IEF / 7.5% GLD / 7.5% DBC
- **SPY buy-and-hold** — 100% SPY
- **60/40 Traditional** — 60% SPY / 40% AGG

This isn't just tracking returns — it's tracking whether the agent is getting *better* at making decisions. Rolling 30-day and 90-day Sharpe ratios get classified as improving, flat, or declining.

### The BTC Cycle-Out Strategy

The agent starts with 10% in Bitcoin and systematically sells into strength, rotating proceeds into the All Weather core (bonds, gold, commodities). The constraint: each sale must maintain or improve the portfolio's Sharpe ratio. If selling BTC would worsen risk-adjusted returns, the agent holds.

Every rotation gets logged in a BTC Cycle-Out Scorecard — date, amount, rotation target, Sharpe before and after. It's a quantitative record of whether the cycle-out thesis is working.

### Heartbeat-Driven Autonomy

The agent doesn't wait for me to prompt it. Four cron-scheduled heartbeats keep it running autonomously:

```
# Daily market check — weekdays at market close
30 14 * * 1-5 | heartbeats/market-check.md | claude

# Weekly rebalance review — Friday evening
0 17 * * 5 | heartbeats/rebalance-review.md | claude

# Monthly retrospective — 1st of each month
0 10 1 * * | heartbeats/monthly-retro.md | claude

# Weekly memory distillation — Sunday evening
0 20 * * 0 | heartbeats/memory-distill.md | claude
```

**Daily**: fetch prices for all 10 tickers, calculate P&L and allocation drift, run risk metrics, check sentiment, flag anything drifting more than 5%.

**Weekly**: run all four quality gates, evaluate BTC cycle-out opportunities, generate rebalance recommendations. Only execute if every gate passes.

**Monthly**: full strategy review, benchmark comparison, rolling Sharpe analysis, position attribution, and a "State of the Portfolio" entry written to long-term memory.

**Sunday**: distill the week's daily logs into durable memories, keeping the signal and discarding the noise.

The agent wakes up, does its job, and goes back to sleep. I check in when I want to, not because I have to.

## Why This Matters

Open Harness isn't just for portfolio managers. It's infrastructure for any autonomous AI agent that needs:

- Full system permissions without host risk
- Persistent identity and memory across sessions
- Scheduled background work without human prompting
- Quantitative quality gates before taking action

The same pattern works for CI/CD agents, monitoring bots, content pipelines, data processing workers — anything where you want an AI agent running continuously with guardrails.

## Get Started

```bash
git clone https://github.com/ryaneggz/open-harness.git && cd open-harness
make NAME=my-agent BASE_BRANCH=main quickstart
```

Check out the [portfolio-mgr branch](https://github.com/ryaneggz/open-harness/tree/agent/portfolio-mgr) for the full implementation — SOUL.md, skills, heartbeats, and all the portfolio state files.

[Star the repo](https://github.com/ryaneggz/open-harness), fork it, and try building your own agent. If you want help designing an autonomous agent system for your business, [book a call](https://cal.com/ruska-ai/ai-audit) or visit [ruska.ai/services](https://ruska.ai/services).
