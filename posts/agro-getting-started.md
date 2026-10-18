---
title: "Self-host AGRO: Your Coding-Agent Workspace in Docker"
date: "2026-10-18"
excerpt: "Install the agro CLI, create a Docker sandbox, open Herdr, install a coding harness, and tear the sandbox down again. A self-host guide for AGRO v0.24.0."
categories: ["AGRO", "Getting Started", "AI Infrastructure", "Developer Guide"]
coverImage: "/blog/agro-getting-started/cover.png"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

> **As of AGRO v0.24.0.** AGRO ships often. If a command here disagrees with the [quickstart](https://github.com/mifunedev/agro/blob/main/docs/quickstart.md), the quickstart wins.

AGRO gives AI coding agents a workspace you control. It packages a Docker sandbox and shared agent procedures. You choose the coding harness: Claude Code, Codex, Pi, or another. Your host stays clean, because the project toolchain and every agent CLI live inside the sandbox.

This guide is the self-host path: you run Docker on your own laptop or VM. If you want Mifune to run the machine for you, use **Mifune Console** instead. See [Run AGRO on Mifune Console](/blog/run-agro-on-mifune-console).

The guide walks the full lifecycle once, from a bare host to an agent in a sandbox, and back to nothing. It links to the [AGRO docs](https://agro.mifune.dev) for detail instead of copying it.

## Where you type each command

Each step says **on the host** or **inside the sandbox**. The host is the machine that runs Docker. The sandbox is the container that AGRO creates. `agro sandbox install` works only on the host. `agro shell` runs on the host and puts you inside the sandbox.

## 1. Check the host prerequisites — on the host

The host needs three things:

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20 or newer

The host needs nothing else. pnpm, Python, and every agent CLI run inside the sandbox. See [Installation → Prerequisites](https://github.com/mifunedev/agro/blob/main/docs/installation.md#prerequisites).

## 2. Install the `agro` CLI — on the host

With Node 20 or newer, install the npm package:

```bash
npm install -g @mifune/agro
```

Without Node, use the release script. It installs `agro` to `~/.local/bin/agro` and offers to install Node:

```bash
curl -fsSL https://github.com/mifunedev/agro/releases/latest/download/install.sh | bash
```

To read the script before it runs, download it first, then run `bash install.sh`. [Installation](https://github.com/mifunedev/agro/blob/main/docs/installation.md) covers the review-first install, the PATH rules, and upgrades. Run `agro --version` to confirm the install.

## 3. Create the sandbox — on the host

Run this from any directory. You do not need a checkout of AGRO:

```bash
agro sandbox install docker
```

The wizard asks for the sandbox name, the timezone, your git identity, SSH, the host Docker socket, and the host path for `/home/sandbox`. Press Enter to keep each default, or pass `--yes` to keep all of them. The default name is `agro-sbx-<n>`.

![The terminal runs agro sandbox install docker, accepts each default in the wizard, starts the agro-sbx-1 container, and prints the next command: agro shell agro-sbx-1.](/blog/agro-getting-started/quickstart-sandbox-install.png)

*The wizard with every default. Screenshots in this post come from the AGRO docs and were captured with an earlier release (0.18.1). The commands are the same in v0.24.0.*

Without `--checkout <dir>`, the sandbox runs the published image and needs no project checkout. To bind your own checkout instead, see [Installation → Create the sandbox](https://github.com/mifunedev/agro/blob/main/docs/installation.md#create-the-sandbox).

## 4. Enter the sandbox — on the host

```bash
agro shell <name>
```

You get `zsh` inside the container, as the `sandbox` user, in `/home/sandbox/harness`. You can omit `<name>` when you have only one sandbox. `agro sandbox list` shows every sandbox you created.

![The agro shell banner for agro-sbx-1 lists the onboarding status of gh and each harness, tells you to run herdr next, and ends at a zsh prompt inside the sandbox.](/blog/agro-getting-started/quickstart-shell.png)

The banner lists what is installed and what is authenticated, and names the next step. To attach VS Code, or to connect from another machine, see [Connecting to the sandbox](https://github.com/mifunedev/agro/blob/main/docs/connecting.md).

## 5. Start Herdr — inside the sandbox

A fresh sandbox has no `herdr`. Install it, then start it:

```bash
agro tool install herdr
herdr
```

Herdr is the persistent terminal workspace for agents, tests, and development servers. Do every later step inside the sandbox in a Herdr pane. Detach with `Ctrl-b q` and run `herdr` again to reattach. The container keeps running after you detach, so a dropped SSH connection does not stop an agent.

![Herdr shows the harness workspace in the spaces list and two panes side by side: one runs agro --version, the other runs claude --version.](/blog/agro-getting-started/herdr-two-panes.png)

See [Herdr](https://github.com/mifunedev/agro/blob/main/docs/integrations/herdr.md) for panes, worktrees, and the optional provider integrations.

## 6. Install a coding harness — inside the sandbox

The image contains no agent CLI. Install the one you want, then sign in:

```bash
agro harness install claude-code
claude auth login
claude auth status
```

Run `agro harness list` to see every harness id. Each install goes into `~/.local` in the persistent home volume, so it survives a container restart.

<video autoplay muted loop playsinline preload="none" poster="/blog/agro-getting-started/agro-cli-poster.png" width="1200" height="440">
  <source src="/blog/agro-getting-started/agro-cli.mp4" type="video/mp4" />
</video>

*A real recording with the v0.24.0 CLI: `agro --version` prints `0.24.0`, and `agro harness list` shows each harness and whether it is installed.*

![A Herdr pane runs agro harness install claude-code and reports that claude-code is installed, with a link to its authentication guide.](/blog/agro-getting-started/quickstart-harness-install.png)

On a remote or headless sandbox, use device login: start the agent, run `/login`, and choose device mode. Open the printed URL on any device. Each [harness guide](https://github.com/mifunedev/agro/blob/main/docs/harnesses/overview.md) gives its own login command.

The sandbox now works. The next step is optional.

## 7. Authenticate GitHub (optional) — inside the sandbox

Local work needs no GitHub account. A push, a new repository, or a pull request does. A provider login does not give repository access. From a Herdr pane:

```bash
gh auth login && gh auth setup-git
gh auth status
```

Confirm that `gh auth status` names the account you intend to use.

## 8. Check the container — on the host

```bash
agro ps <name>
```

![The terminal runs agro ps agro-sbx-1 and shows one container, agro-sbx-1, with status Up and healthy.](/blog/agro-getting-started/lifecycle-commands-ps.png)

`agro ps` shows the sandbox container and its health. [Lifecycle commands](https://github.com/mifunedev/agro/blob/main/docs/lifecycle-commands.md) lists every verb.

## 9. Stop the sandbox — on the host

`agro stop` stops the containers and keeps the volumes. Your logins and installs stay in the home volume:

```bash
agro stop <name>
agro sandbox install docker --name <name>   # start it again
```

## 10. Destroy the sandbox — on the host

> **Warning: data loss.** `agro destroy` deletes the sandbox home volume, with every agent login and every install in it. The command has no undo. Push any work you want to keep before you run it.

```bash
agro destroy <name>
```

`agro destroy` names the volumes it will delete and asks you to type the sandbox name. Any other input aborts and removes nothing. After the delete, it removes the registry entry, so the name is free again.

## Where to go next

- [Quickstart](https://github.com/mifunedev/agro/blob/main/docs/quickstart.md): the canonical version of these steps
- [Connecting to the sandbox](https://github.com/mifunedev/agro/blob/main/docs/connecting.md): VS Code, SSH, and mobile access
- [Harnesses overview](https://github.com/mifunedev/agro/blob/main/docs/harnesses/overview.md): every supported agent and how to sign in
- [Run AGRO on Mifune Console](/blog/run-agro-on-mifune-console): the managed path, with no Docker host to run
