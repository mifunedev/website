---
title: "Getting Started with OpenHarness: From a Bare Host to a Running AI Sandbox"
date: "2026-07-02"
excerpt: "A concise on-ramp to OpenHarness — the open, isolated environment every Mifune AI worker runs inside. Go from a fresh host to a running, authenticated sandbox in a few commands, then follow the canonical docs for depth."
categories: ["OpenHarness", "Getting Started", "AI Infrastructure", "Developer Guide"]
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

OpenHarness is the open, isolated operating environment every Mifune AI worker runs inside — one project, one hardened Docker sandbox, with **you owning every configuration from day one**. This post is a concise on-ramp: enough to get a sandbox running and authenticated on your own machine. It deliberately does **not** reproduce the full setup manual — for depth, follow the canonical docs:

- **Docs:** [oh.mifune.dev/docs](https://oh.mifune.dev/docs)
- **Install reference:** [github.com/mifunedev/openharness#-install](https://github.com/mifunedev/openharness#-install)

## What you'll need

A host (Linux, macOS, or WSL2) with:

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Git](https://git-scm.com/)
- `make` (build-essential)

## 1. Clone and own

The recommended path is **clone-and-own**: clone upstream, then make it yours.

```bash
git clone https://github.com/mifunedev/openharness.git ~/.openharness
cd ~/.openharness
```

**Edit `harness.yaml` before you build.** Set your `sandbox.name`, `sandbox.timezone`, `git.user_name`, and `git.user_email` (plus any optional installs). Secrets never go in this file — they live in `.devcontainer/.env`.

```bash
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

From here you have an authenticated, isolated agent sandbox. For a private-repo `origin` with `mifunedev/openharness` as `upstream`, Slack gateways, and the full end-to-end walkthrough, keep going in the [canonical docs](https://oh.mifune.dev/docs).

---

### Prefer we build it for you?

Getting started yourself is the developer path. If you'd rather hand it off, that's what Mifune does — we design, build, and manage the AI workers that run your business, all on OpenHarness. [Get a free AI Workflow Audit →](/#audit)
