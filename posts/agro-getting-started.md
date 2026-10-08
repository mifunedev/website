---
title: "Getting Started with AGRO: Choose Your Coding-Agent Workspace"
date: "2026-07-02"
excerpt: "AGRO is an isolated, persistent Docker workspace for coding agents. Choose the managed Mifune Console or the Apache-2.0 licensed self-hosted path, then follow this concise on-ramp."
categories: ["AGRO", "Getting Started", "AI Infrastructure", "Developer Guide"]
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

AGRO is an isolated, persistent Docker workspace for coding agents, maintained by Mifune. It keeps one project and its toolchain in one sandbox instead of putting project dependencies on your host. Run it locally or on a remote VM, and choose Claude Code, Codex, Pi, or another opt-in agent CLI.

> **Updated 2026-10-02.** This post was first published on 2026-07-02. The setup steps below are the current ones; this list records what changed since then.
>
> - **The project has a new name.** AGRO was formerly named Open Harness. The repository is now [github.com/mifunedev/agro](https://github.com/mifunedev/agro), and the docs are at [agro.mifune.dev](https://agro.mifune.dev).
> - **The `agro` CLI replaces the `make` targets.** The original walkthrough used `make harness-config`, `harness.yaml`, `make sandbox`, and `make shell`. Those no longer exist. The `agro` CLI is now the only front door to the sandbox lifecycle.
> - **The license is Apache-2.0.** The original post said MIT. The project has been licensed under Apache-2.0 since 2026-07-24.

This post is a concise on-ramp. It does **not** reproduce the full setup manual — for depth, follow the canonical docs:

- **Docs:** [agro.mifune.dev](https://agro.mifune.dev)
- **Quickstart reference:** [github.com/mifunedev/agro](https://github.com/mifunedev/agro#-quickstart)

## Choose your path

- **Mifune Console:** Mifune operates the managed environment while your coding agents work in an isolated, persistent workspace. Start in the [Console](https://console.mifune.dev).
- **AGRO Open Source:** Inspect, adapt, and operate the Apache-2.0 licensed project yourself, locally or on a remote VM. The self-hosted walkthrough below follows this path.
- **Engineering support for Console customers:** Console customers can ask Mifune engineers to help plan, implement, integrate, troubleshoot, and hand off a deployment. [Explore support](/services).

## What you get

- One project per isolated, persistent Docker workspace
- Project toolchains kept off your host
- Claude Code, Codex, Pi, and other opt-in agent CLIs
- The same workspace model on a local machine or remote VM
- Unattended or scheduled agent work and Slack reachability when configured on a VM
- Isolated git worktrees for parallel branches and delegation

## Where you type each command

Every step below is labelled **on the host** or **inside the sandbox**. `agro sandbox install` is host-only: inside a sandbox it refuses with a host-only error, because it changes the sandbox's own Docker configuration. `agro shell` runs on the host and drops you inside.

## Self-hosted prerequisites

**On the host** (Linux, macOS, or WSL2):

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20 or newer

Node runs the `agro` CLI. Everything else — pnpm, Python, the agent CLIs — lives inside the sandbox.

## 1. Install `agro` — on the host

If you already have Node 20 or newer:

```bash
npm install -g @mifune/agro
```

Or run it without a global install by using `npx @mifune/agro` in place of `agro` in later commands.

If you do not have Node yet, the release install script installs `agro` to `~/.local/bin` and offers to install Node for you:

```bash
curl -fsSL https://github.com/mifunedev/agro/releases/latest/download/install.sh | bash
```

To review the script before you run it:

```bash
curl -fsSL -o install.sh https://github.com/mifunedev/agro/releases/latest/download/install.sh
# Review install.sh in your editor or pager before running it.
bash install.sh
```

Later, `agro update` upgrades the installed CLI.

## 2. Create and enter the sandbox — on the host

`agro sandbox install docker` runs from **any** directory on the host — no checkout required. The wizard asks for the sandbox name, timezone, git identity, SSH, and Docker socket access.

```bash
agro sandbox install docker
agro shell <name>
```

To bind a project checkout into the sandbox instead of the seeded workspace, pass `--checkout <dir>` to `agro sandbox install docker`.

You can also attach with **VS Code Dev Containers** → _Attach to Running Container_, locally or over Remote-SSH.

## 3. Open Herdr and authenticate GitHub — inside the sandbox

Herdr is the persistent terminal workspace for your agents, tests, and development servers. Install it and open it:

```bash
agro tool install herdr
herdr
```

From the first Herdr pane, authenticate GitHub once:

```bash
gh auth login && gh auth setup-git
```

## 4. Install and authenticate a coding agent — inside the sandbox

Install only the harness you intend to use. `agro harness list` shows every available id.

```bash
agro harness install claude-code   # Claude Code
agro harness install codex         # Codex
agro harness install pi            # Pi
```

The simplest cross-provider sign-in path: launch the agent, run `/login`, and pick **device mode** — you get a code and a URL that work even on a headless or remote host. Where a provider exposes a one-liner, these are equivalents:

```bash
claude auth login            # Claude Code
codex login --device-auth    # Codex
```

Secrets never go in a tracked file. Use `agro secret set <KEY>` to write them to the sandbox's gitignored `.env`.

## 5. Verify the container — on the host

```bash
agro ps <name>
```

From here you have an authenticated, isolated agent sandbox. For private-repository remotes, Slack gateways, schedules, and worktrees, keep going in the [canonical docs](https://agro.mifune.dev).

---

### Where to go next

Continue with the [AGRO docs](https://agro.mifune.dev) for private-repository remotes, optional agent CLIs, Slack setup, schedules, and worktrees.

Prefer Mifune to operate the environment? Open the [Mifune Console](https://console.mifune.dev). If your Console adoption needs hands-on planning, implementation, integration, troubleshooting, or handoff help, [discuss engineering support](/services).
