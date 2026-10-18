---
title: "Run AGRO on Mifune Console"
date: "2026-10-18"
excerpt: "Sign in to Mifune Console with GitHub, create a free n4 node, connect from the browser, install a coding agent, and manage nodes from the agro CLI."
categories: ["Mifune Console", "AGRO", "Developer Guide"]
coverImage: "/blog/run-agro-on-mifune-console/cover.png"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

> **As of Mifune Console v1.17.0 and AGRO v0.24.0.** Both products release often. Check the linked docs when a step does not match what you see.

Mifune Console is the control plane for dedicated AGRO nodes. You pick a node spec, and the Console creates a dedicated cloud VM for you. The node then builds its own workspace: it installs the `agro` CLI, creates an AGRO workspace, and installs code-server and the GitHub CLI.

This guide takes you from sign-in to a running node, then shows the same work from the `agro` CLI. To run AGRO on your own machine or VM instead, read [Self-host AGRO](/blog/agro-getting-started).

## 1. Sign in with GitHub

Open [https://console.mifune.dev](https://console.mifune.dev) and select **Continue with GitHub**. Your first GitHub sign-in creates your account. There is no separate sign-up form.

<img src="/blog/run-agro-on-mifune-console/console-sign-in.png" alt="The Mifune Console sign-in card with the Continue with GitHub button" width="560" height="330" />

Mifune Console is in public beta. Expect rough edges and frequent changes.

## 2. Know the free-tier terms

The free tier lets you try a node without a card. The terms are:

- You can hold up to **three free nodes** at the same time. Each free node uses the `n4` spec.
- A free node needs no card and no SSH key.
- All your free nodes share **24 running hours each UTC calendar month**. Two running free nodes use the allowance twice as fast.
- The allowance resets at 00:00 UTC on the 1st of each month. Unused hours do not carry over.
- Only running time counts. Queued time and build time are free.
- When the allowance runs out, the Console pauses each running free node. A pause archives the node's files and deletes the VM. No process state and no memory state survive a pause.
- A paused free node keeps its workspace for **60 days**. After 60 days without a resume, the Console deletes the files.
- A paused node does not resume by itself after the monthly reset. You resume it.
- A paused free node still counts toward the limit of three. Destroy a free node to free its place.

Paid nodes are billed a la carte per node, by the hour. The meter counts whole running UTC hours. There is no monthly plan, and destroying a node stops the charge.

| Spec | vCPU | RAM | Disk | Each running hour |
| --- | --- | --- | --- | --- |
| `n4` (default) | 2 | 4 GB | 50 GB SSD | $0.0450 |
| `n8` | 4 | 8 GB | 50 GB SSD | $0.1000 |
| `n16` | 4 | 16 GB | 100 GB SSD | $0.2100 |
| `n32` | 8 | 32 GB | 200 GB SSD | $0.4500 |
| `n64` | 8 | 64 GB | 200 GB SSD | $0.6000 |

The node price covers the machine and the workspace. It does not include AI usage. You sign in to your AI provider with your own account, and the provider bills you directly. See [Pricing](/pricing) for current prices.

## 3. Create an `n4` node

Open the create form and select the `n4` spec. Select the free option to put the node on the free tier. The form shows how many of your three free nodes are in use. When you hold three free nodes, the form disables the free option.

The Console queues the node, creates the VM, and runs the node's build. The node page shows the status until the node is `running`.

A node that you create in the Console UI runs **no sandbox container**. The AGRO workspace lives directly on the VM. You install agents on the VM host in step 5.

Two safety rules apply to every node:

- A port that a container publishes on a node is open to the internet. No default firewall closes it.
- The SSH user has sudo. Do not use a node for untrusted code.

## 4. Connect from the browser

Open the node page, then open the **Connect** menu.

- The default Connect action opens **code-server**, a VS Code editor in the browser.
- The Connect menu also opens a **Ghostty browser terminal**. The terminal runs on a persistent zmx session, so a closed tab does not end your shell.

The node's hostname is its alias, so the prompt shows `sandbox@<alias>`. You need no local setup for either surface.

## 5. Install a coding agent

In the browser terminal, list the supported harnesses, then install one on the node host:

```bash
agro harness list
agro harness install claude-code --host
```

Replace `claude-code` with any id from `agro harness list`, such as `codex` or `pi`. You can install two or more agents on one node. They work side by side in the same workspace. Start the agent and sign in to your AI provider with your own account.

[Harnesses overview](https://github.com/mifunedev/agro/blob/main/docs/harnesses/overview.md) describes each harness and the install flags.

## 6. Manage nodes from the `agro` CLI

`agro node` creates, lists, and deletes Console nodes from any terminal. `agro auth`, new in AGRO v0.24.0, signs the CLI in to the Console. Run both on the same machine.

### Sign in

```bash
agro auth login
agro auth status
```

`agro auth login` starts a device sign-in. It prints `Open <url> and enter the code <code>`. Open the URL, approve the code, and the command prints `logged in to <url> as <login>`. The CLI stores the token in `~/.config/agro/console.json` with mode `0600`. `agro auth status` shows your login and a token prefix. It never prints the full token.

The CLI uses `https://console.mifune.dev` by default. In CI, set `AGRO_CONSOLE_TOKEN` instead of signing in.

### Create a node

```bash
agro node create --spec n4 --free-tier --name demo
```

`agro node create` creates a node with the profile **`sandbox`**. This is different from a node that you create in the Console UI, which runs no sandbox container.

- `--free-tier` requests the free tier.
- `--name` sets the node name.
- Without `--ssh-key`, the command reads `~/.ssh/id_ed25519.pub`. It reuses the matching Console SSH key, or registers the key as `agro-cli@<hostname>`. If the file does not exist, the command exits 1.
- The command waits up to 15 minutes for the status `running`. Then it prints the node id, the status, and the SSH command.

### List nodes

```bash
agro node list
```

The command prints one row for each node: id, name, profile, status, and IPv4 address. Add `--json` for machine-readable output. With no nodes, it prints `no nodes`.

## 7. Delete the node

A node that you no longer need still uses free hours or money while it runs. Delete it when you are done.

> **Warning:** Deleting a node destroys the VM and its workspace. Push your work before you delete a node.

From the CLI:

```bash
agro node delete <id>
```

The command asks for a confirmation. `--yes` skips it. Destroy needs the admin role in your Console organization. Without it, the command exits 1 and prints `destroy needs the admin role in agro-console`.

You can also destroy the node from its node page in the Console. To stop a node but keep its files, pause it instead of deleting it.

Run `agro node list` again to confirm that the node is gone.

## Further reading

- [Lifecycle commands: `agro auth` and `agro node`](https://github.com/mifunedev/agro/blob/main/docs/lifecycle-commands.md)
- [Harnesses overview](https://github.com/mifunedev/agro/blob/main/docs/harnesses/overview.md)
- [Self-host AGRO](/blog/agro-getting-started)
- [Pricing](/pricing)
