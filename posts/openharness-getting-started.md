---
title: "Getting Started with Open Harness: Choose Your Coding-Agent Workspace"
date: "2026-07-02"
excerpt: "Open Harness is an isolated, persistent Docker workspace for coding agents. Choose managed Cloud or the MIT-licensed self-hosted path, then follow this concise on-ramp."
categories:
  ["Open Harness", "Getting Started", "AI Infrastructure", "Developer Guide"]
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

Open Harness is an isolated, persistent Docker workspace for coding agents, maintained by Mifune. It keeps one project and its toolchain in one sandbox instead of putting project dependencies on your host. Run it locally or on a remote VM, and choose Claude Code, Codex, Pi, or another opt-in agent CLI.

This post is a concise on-ramp. It does **not** reproduce the full setup manual — for depth, follow the canonical docs:

- **Docs:** [oh.mifune.dev](https://oh.mifune.dev)
- **Install reference:** [github.com/mifunedev/openharness#-install](https://github.com/mifunedev/openharness#-install)

## Choose your path

- **Open Harness Cloud:** Mifune operates the managed environment while your coding agents work in an isolated, persistent workspace. Start in the [Mifune Cloud Console](https://console.mifune.dev).
- **Open Harness Open Source:** Inspect, adapt, and operate the MIT-licensed project yourself, locally or on a remote VM. The self-hosted walkthrough below follows this path.
- **Engineering support for Cloud:** Cloud customers can ask Mifune engineers to help plan, implement, integrate, troubleshoot, and hand off a deployment. [Explore support](/services).

## What you get

- One project per isolated, persistent Docker workspace
- Project toolchains kept off your host
- Claude Code, Codex, Pi, and other opt-in agent CLIs
- The same workspace model on a local machine or remote VM
- Unattended or scheduled agent work and Slack reachability when configured on a VM
- Isolated git worktrees for parallel branches and delegation

## Self-hosted prerequisites

A host (Linux, macOS, or WSL2) with:

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Git](https://git-scm.com/)
- `make` (build-essential)

## 1. Clone and own

The recommended self-hosted path is **clone-and-own**: clone upstream, then make it yours.

```bash
git clone https://github.com/mifunedev/openharness.git ~/.openharness
cd ~/.openharness
```

**Generate and edit `harness.yaml` before you build.** Set your `sandbox.name`, `sandbox.timezone`, `git.user_name`, and `git.user_email` (plus any optional installs). Secrets never go in this file — they live in `.devcontainer/.env`.

```bash
make harness-config
nano harness.yaml
```

Then build the image and open a shell inside the sandbox:

```bash
make sandbox && make shell
```

That's already a working sandbox.

## 2. Enter the sandbox

Two ways in:

- **VS Code Dev Containers** → _Attach to Running Container_ (recommended — works locally or over Remote-SSH)
- or `make shell` from the terminal

## 3. Authenticate

The simplest cross-provider path: launch the agent, run `/login`, and pick **device mode** — you get a code and a URL that work even on a headless or remote host. Where a provider exposes a one-liner, these are equivalents:

```bash
claude auth login            # Claude Code
codex login --device-auth    # Codex
```

From here you have an authenticated, isolated agent sandbox. For a private-repo `origin` with `mifunedev/openharness` as `upstream`, Slack gateways, and the full end-to-end walkthrough, keep going in the [canonical docs](https://oh.mifune.dev).

---

### Where to go next

Continue with the [Open Harness docs](https://oh.mifune.dev) for private-repository remotes, optional agent CLIs, Slack setup, schedules, and worktrees.

Prefer Mifune to operate the environment? Open the [Mifune Cloud Console](https://console.mifune.dev). If your Cloud adoption needs hands-on planning, implementation, integration, troubleshooting, or handoff help, [discuss engineering support](/services).
