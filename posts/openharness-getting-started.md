---
title: "Getting Started with Open Harness: Choose Your Coding-Agent Workspace"
date: "2026-07-02"
excerpt: "Open Harness is an isolated, persistent Docker workspace for coding agents. Choose managed Cloud or the self-hosted path, then follow this concise on-ramp."
categories:
  ["Open Harness", "Getting Started", "AI Infrastructure", "Developer Guide"]
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

Open Harness is an isolated, persistent Docker workspace for coding agents, maintained by Mifune. It keeps one project and its toolchain in one sandbox instead of putting project dependencies on your host. Run it locally or on a remote VM, and choose Claude Code, Codex, Pi, or another opt-in agent CLI.

> **Updated 2026-09-08.** This post was first published on 2026-07-02, and four things have changed since then. The setup steps below are the current ones; the list here is what they replaced.
>
> - **The `make` targets are gone.** The original walkthrough used `make harness-config`, `harness.yaml`, `make sandbox`, and `make shell`. The `Makefile` was removed, and the `agro` CLI is now the only front door to the sandbox lifecycle.
> - **The project relicensed from MIT to Apache-2.0** on 2026-07-24. The original post said MIT, which was accurate on the day it went out.
> - **The repository and docs moved** to `github.com/mifunedev/agro` and `agro.mifune.dev`. The former addresses still redirect.
> - **A boot-time issue is open** against the currently published image. See the note in step 2 before you install.

This post is a concise on-ramp. It does **not** reproduce the full setup manual — for depth, follow the canonical docs:

- **Docs:** [agro.mifune.dev](https://agro.mifune.dev)
- **Install reference:** [github.com/mifunedev/agro#-install](https://github.com/mifunedev/agro#-install)

## Choose your path

- **Open Harness Cloud:** Mifune operates the managed environment while your coding agents work in an isolated, persistent workspace. Start in the [Mifune Cloud Console](https://console.mifune.dev).
- **Open Harness Open Source:** Inspect, adapt, and operate the Apache-2.0 licensed project yourself, locally or on a remote VM. The self-hosted walkthrough below follows this path.
- **Engineering support for Cloud:** Cloud customers can ask Mifune engineers to help plan, implement, integrate, troubleshoot, and hand off a deployment. [Explore support](/services).

## What you get

- One project per isolated, persistent Docker workspace
- Project toolchains kept off your host
- Claude Code, Codex, Pi, and other opt-in agent CLIs
- The same workspace model on a local machine or remote VM
- Unattended or scheduled agent work and Slack reachability when configured on a VM
- Isolated git worktrees for parallel branches and delegation

## A note on where you type each command

Every step below is labelled **on the host** or **inside the sandbox**, because `agro` resolves a different execution target for each and one verb is host-only:

- **`agro sandbox install` is host-only.** Run inside a sandbox it refuses with a host-only error, because it changes the sandbox's own Docker configuration.
- **`agro shell`** is typed on the host and drops you inside.
- **`agro harness install` and `agro tool install`** work from either side. This walkthrough runs them inside, from the sandbox shell.

## Self-hosted prerequisites

**On the host** (Linux, macOS, or WSL2):

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20 or newer

Node runs the `agro` CLI and nothing else. Everything else — Python, pnpm, the agent CLIs — lives inside the sandbox.

## 1. Install `agro` — on the host

`agro` is the only front door to the sandbox lifecycle. If you already have Node 20 or newer:

```bash
npm install -g @mifune/agro
```

If you do not have Node yet, the bootstrap downloads the prebuilt `agro` artifact from the latest release and offers to install Node for you:

```bash
curl -fsSL https://github.com/mifunedev/agro/releases/latest/download/get-agro.sh | bash
```

Review-first, if you would rather read the script before running it:

```bash
curl -fsSL -o get-agro.sh https://github.com/mifunedev/agro/releases/latest/download/get-agro.sh
# Review get-agro.sh in your editor or pager before running it.
bash get-agro.sh
```

The bootstrap installs to `~/.local/bin/agro`. Add that directory to your `PATH` if it is not there already. Later, `agro update` upgrades the executable in place.

## 2. Create the sandbox — on the host

`agro sandbox install docker` runs from **any** directory on the host — no checkout required. The wizard asks for the sandbox name, timezone, git identity, SSH, and Docker socket access.

> **Known issue, observed 2026-09-08 — read this before running either command below.** A fresh sandbox created from the currently published image can fail during first boot. The image `ghcr.io/mifunedev/openharness:0.9.0` bakes in a `pnpm` lifecycle hook that performs a live security-advisory query as part of boot. After advisory [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) was published on 2026-09-08, that query reports a finding and the hook exits non-zero, so `openharness-bootstrap.service` fails and the sandbox does not finish coming up. The container itself keeps running. What you see is a failed `openharness-bootstrap.service` and `[entrypoint] pnpm install failed — see /tmp/pnpm-install.log`.
>
> This is tracked as [mifunedev/agro#1019](https://github.com/mifunedev/agro/issues/1019), which was open when this note was written, and a fix is expected to ship in a later release. Two cases are worth keeping apart. A **new cold boot from the published image** depends on a manifest baked into an image layer, which cannot be altered locally — only a newly published image resolves that one. An **existing seeded workspace volume** is a separate case and is repairable in place; #1019 is where that recovery is tracked. Check that issue for current status and detail rather than improvising a fix. This observation is pinned to the `0.9.0` tag deliberately: `latest` is a moving tag, and what it points at when you read this may already carry the fix.

```bash
agro sandbox install docker
```

To point the sandbox at a project checkout instead of the seeded workspace, pass `--repo`. The checkout is bind-mounted at `/home/sandbox/harness`. This is still a host command — run it **instead of** the plain form above, before you open a shell:

```bash
agro sandbox install docker --repo ~/my-project --name my-project
```

## 3. Enter the sandbox

Two ways in, both started **on the host**:

```bash
agro shell <name>
```

- or **VS Code Dev Containers** → _Attach to Running Container_ (works locally or over Remote-SSH)

Everything from here on runs **inside the sandbox**.

Nothing installs at boot, so a fresh sandbox has no terminal workspace manager yet. Install and open Herdr first, then run the rest of your setup, agents, tests, and servers from its persistent panes:

```bash
agro tool install herdr
herdr
```

That's already a working sandbox.

## 4. Install the agent you want — inside the sandbox

Nothing arrives at boot, and that includes the coding agents. A harness enters the sandbox only through `agro harness install <id>`, so install the one you intend to use before you try to authenticate it:

```bash
agro harness install claude-code   # Claude Code
agro harness install codex         # Codex
agro harness install pi            # Pi
```

Install only what you need — these are three examples from the catalog, not a set you are expected to install together. `agro harness list` shows every available id and what is already present. Each install lands in `~/.local` in the persistent home volume, so it survives a restart.

## 5. Authenticate — inside the sandbox

From the first Herdr pane, authenticate GitHub:

```bash
gh auth login
```

Then authenticate the harness you installed in step 4. The simplest cross-provider path: launch the agent, run `/login`, and pick **device mode** — you get a code and a URL that work even on a headless or remote host. Where a provider exposes a one-liner, these are equivalents:

```bash
claude auth login            # Claude Code, after `agro harness install claude-code`
codex login --device-auth    # Codex, after `agro harness install codex`
```

Secrets never go in a tracked file. Use `agro secret set <KEY>` to write them to the sandbox's gitignored `.env`.

To make a checkout yours — your own private `origin` with the upstream kept as a second remote — run `agro config repo`. It asks before it changes any remote.

From here you have an authenticated, isolated agent sandbox. For Slack gateways, schedules, worktrees, and the full end-to-end walkthrough, keep going in the [canonical docs](https://agro.mifune.dev).

---

### Where to go next

Continue with the [Open Harness docs](https://agro.mifune.dev) for private-repository remotes, optional agent CLIs, Slack setup, schedules, and worktrees.

Prefer Mifune to operate the environment? Open the [Mifune Cloud Console](https://console.mifune.dev). If your Cloud adoption needs hands-on planning, implementation, integration, troubleshooting, or handoff help, [discuss engineering support](/services).
