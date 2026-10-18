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

Mifune Console is the control plane for dedicated AGRO nodes. You pick a node spec, and the Console creates a dedicated cloud VM for you. The node then builds its own workspace: it installs the `agro` CLI, creates an AGRO workspace, and adds the browser apps and tools that you select.

This guide takes you from sign-in to a running node, then shows the same work from the `agro` CLI. To run AGRO on your own machine or VM instead, read [Self-host AGRO](/blog/agro-getting-started).

## 1. Sign in with GitHub

Open [https://console.mifune.dev](https://console.mifune.dev) and select **Continue with GitHub**. Your first GitHub sign-in creates your account. There is no separate sign-up form.

<img src="/blog/run-agro-on-mifune-console/console-sign-in.png" alt="The Mifune Console sign-in card with the Continue with GitHub button" width="560" height="330" />

Mifune Console is in public beta. Expect rough edges and frequent changes. During the beta, payments are off, so you can use only the free tier.

The free tier belongs to your personal context. If you also belong to an organization, use the context switcher in the sidebar to select your personal context before you create a free node. In an organization context, the create form shows "The free tier is not available for this account."

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

When payments open, paid nodes are billed a la carte per node, by the hour. The meter counts whole running UTC hours. There is no monthly plan, and destroying a node stops the charge.

| Spec | vCPU | RAM | Disk | Each running hour |
| --- | --- | --- | --- | --- |
| `n4` (default) | 2 | 4 GB | 50 GB SSD | $0.0450 |
| `n8` | 4 | 8 GB | 50 GB SSD | $0.1000 |
| `n16` | 4 | 16 GB | 100 GB SSD | $0.2100 |
| `n32` | 8 | 32 GB | 200 GB SSD | $0.4500 |
| `n64` | 8 | 64 GB | 200 GB SSD | $0.6000 |

The node price covers the machine and the workspace. It does not include AI usage. You sign in to your AI provider with your own account, and the provider bills you directly. See [Pricing](/pricing) for current prices.

## 3. Create an `n4` node

On the **Nodes** page, select **Create node**. The form has five parts:

- **Billing.** **Free** is selected. The option shows the free hours left this month, the reset date, and how many of your three free nodes are in use. At three free nodes, the form disables the free option.
- **Setup.** **Agro** is the default: Ubuntu with `agro` and the web terminal. **Sandbox** is Ubuntu with your SSH keys.
- **Browser apps.** The web terminal is always available. **Browser editor (code-server)** and **T3 Code** are off by default. Each app uses memory on the node: about 70 MiB for code-server and about 175 MiB for T3 Code.
- **Tools.** **Docker** is on by default and uses about 40 MiB.
- **Node 1.** The name is optional. Without a name, the Console shows the node alias. SSH keys are optional, under **Advanced: direct SSH access**. A free node always uses the `n4` size: 2 vCPU, 4 GB RAM, and 50 GB disk.

<img src="/blog/run-agro-on-mifune-console/create-form.png" alt="The Create your free node form with Free billing, the Agro setup, code-server and Docker selected, and the fixed n4 size" width="712" height="1310" />

For this guide, select the **Agro** setup, turn on **Browser editor (code-server)**, keep **Docker**, and name the node. Then select **Create free node**.

<video src="/blog/run-agro-on-mifune-console/create-free-node.mp4" poster="/blog/run-agro-on-mifune-console/create-free-node-poster.png" autoplay muted loop playsinline preload="none" width="1032" height="720" aria-label="Filling the free node form: turning on code-server, naming the node, and pointing at Create free node"></video>

The node page opens at once and shows the status. The capture node for this guide went from **Bootstrapping** to **Running** in less than a minute. A cold build can take longer.

<img src="/blog/run-agro-on-mifune-console/node-running.png" alt="The node page of a running free n4 node, with Restart, Pause, and Destroy buttons and the Metadata and Billing panels; the IP address and owner are redacted" width="1024" height="720" />

A node with the **Agro** setup runs **no sandbox container**. The AGRO workspace lives directly on the VM, at `~/.agro/workspaces/harness`. You install agents on the VM host in step 5.

Two safety rules apply to every node:

- A port that a container publishes on a node is open to the internet. No default firewall closes it.
- The SSH user has sudo. Do not use a node for untrusted code.

## 4. Connect from the browser

On the node page, open the arrow next to **Connect**. The menu has four items:

- **Browser editor (code-server)**, marked **Default**. The **Connect** button opens the default item. On this node, code-server was turned on in the create form.
- **Browser terminal (Ghostty)**. The terminal runs on a persistent zmx session, so a closed tab does not end your shell.
- **SSH**.
- **Remote desktop (RDP)**.

<img src="/blog/run-agro-on-mifune-console/connect-menu.png" alt="The Connect menu open on a running node, listing Browser editor (code-server) as Default, Browser terminal (Ghostty), SSH, and Remote desktop (RDP)" width="1024" height="720" />

The browser terminal opens in a new tab. The node's hostname is its alias, so the prompt shows `sandbox@<alias>`. The node ships with AGRO v0.24.0:

<img src="/blog/run-agro-on-mifune-console/terminal-harness-list.png" alt="The Ghostty browser terminal on the node: agro --version prints 0.24.0, and agro harness list shows claude-code, codex, pi, and other harnesses, none installed" width="1280" height="720" />

## 5. Install a coding agent

In the browser terminal, list the supported harnesses, then install one on the node host:

```bash
agro harness list
agro harness install claude-code --host
```

The install puts the CLI under `~/.local` and prints the command that starts the agent in the AGRO workspace:

<img src="/blog/run-agro-on-mifune-console/terminal-harness-install.png" alt="The browser terminal after agro harness install claude-code --host: Claude Code is installed at /home/sandbox/.local, with the command to run it in the AGRO workspace" width="1280" height="720" />

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

`agro node create` creates a node with the profile **`sandbox`**. In the Console, that is the **Sandbox** setup, and the node list marks the node with a **Sandbox** badge. It is not the **Agro** setup from step 3, which runs no sandbox container.

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

In the Console, select **Destroy** on the node page. The dialog says: "The VM is deleted and billing stops. This cannot be undone." A node can keep its latest snapshot after a destroy, but on a free node, Destroy also deletes the snapshot. Select **Destroy node** to confirm.

To stop a node but keep its files, select **Pause** instead.

The destroyed node leaves the active list. Select **Show archived** to see it with the status **Destroyed**:

<img src="/blog/run-agro-on-mifune-console/nodes-after-delete.png" alt="The Nodes page after the delete: Total 0 and Running 0, with the archived list showing blog-capture as Destroyed" width="1024" height="660" />

From the CLI, run `agro node list` again to confirm that the node is gone.

## Further reading

- [Lifecycle commands: `agro auth` and `agro node`](https://github.com/mifunedev/agro/blob/main/docs/lifecycle-commands.md)
- [Harnesses overview](https://github.com/mifunedev/agro/blob/main/docs/harnesses/overview.md)
- [Self-host AGRO](/blog/agro-getting-started)
- [Pricing](/pricing)
