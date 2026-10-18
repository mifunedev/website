---
title: "Daily work with AGRO: worktrees, Herdr panes, and planned delegation"
date: "2026-10-18"
excerpt: "A day inside an AGRO sandbox: clone a project, isolate each change in a worktree, run parallel agents in Herdr panes, and move a task from /council to /prd to /delegate to a green CI run."
categories: ["AGRO", "Workflow", "AI Agents", "Developer Guide"]
coverImage: "/blog/daily-work-with-agro/cover.png"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

> **As of AGRO v0.24.0.** AGRO releases often. If a command or a skill differs from this post, the [AGRO repository](https://github.com/mifunedev/agro) is the source of truth.

This guide starts where the setup guides stop. You have a running sandbox, Herdr, and a coding harness. If you do not, read [Self-host AGRO](/blog/agro-getting-started) or [Run AGRO on Mifune Console](/blog/run-agro-on-mifune-console) first.

The workflow has one rule at its center: **the active session decides, and bounded workers implement.** The AGRO repository calls the active session the *advisor*. The advisor owns scope, plans, verification, and acceptance. A *worker* implements one assignment in its own worktree and never accepts its own result.

This post follows that flow in order:

1. Clone a project under `projects/<owner>/<repo>/`.
2. Isolate each change in a worktree under `.worktrees/`.
3. Run parallel agents in Herdr panes.
4. Use `/council` to decide scope.
5. Use `/prd` to write the plan.
6. Use `/delegate` to run the stories as bounded workers.
7. Check CI before review.

Every capture in this post comes from a real session. The task that produced this post is the example.

## 1. Clone a project into `projects/`

The sandbox checkout at `~/harness` is the AGRO harness. Your application code lives in separate clones under `projects/`. The folder shape mirrors the remote:

```text
~/harness/projects/<owner>/<repo>/
```

Each clone is its own git boundary, with its own remote, branches, CI, and history. You do not commit into a project from the harness root. The lifecycle is a plain `git clone` and `rm -rf`, not `git worktree`.

You do not need to type the commands. Ask your agent from a session in `~/harness`:

```text
Clone <owner>/<repo> into projects.
```

The `/worktrees` skill owns the procedure. Its description reads: "Manage .worktrees/ lifecycle: create worktree, list worktrees, remove worktree, clean worktrees, stale worktrees audit, isolate work, project clone." Before the skill removes a clone, it refuses when the clone has uncommitted changes.

## 2. Isolate each change in a worktree

Each repository keeps its worktrees at its own root. For a project clone, that is `projects/<owner>/<repo>/.worktrees/`. The subfolder names follow the branch prefix: `feat/`, `bug/`, `task/`, `audit/`, and `skill/`.

Ask for a workspace for an issue:

```text
Create a worktree in <owner>/<repo> for issue #123.
```

The agent creates a branch such as `task/123-my-change` at `.worktrees/task/123-my-change`. Worktrees share the project's git history but keep separate checked-out files. Each parallel agent gets its own branch and worktree, so agents do not overwrite each other's work.

The `/git` skill holds the canonical commands:

```bash
git worktree add -b <prefix>/<issue#>-<short-desc> \
  "$WORKTREES_ROOT/<prefix>/<issue#>-<short-desc>" $BASE
```

A new worktree has no `node_modules`. When the worktree has a `package.json`, install dependencies in the worktree before you start work. After the pull request merges, ask the agent to clean up the merged worktree and keep any uncommitted work.

## 3. Run parallel agents in Herdr panes

[Herdr](https://github.com/mifunedev/agro/blob/main/docs/integrations/herdr.md) is the interactive workspace of AGRO. It runs as a server inside the sandbox, so your panes survive a terminal disconnect. Detach with `Ctrl-b q`. Run `herdr` again to reattach.

A Herdr session holds workspaces, tabs, and panes. Use one pane for each agent, test run, or development server. With the default keys, `Ctrl-b v` splits a pane side by side, and `Ctrl-b -` splits top and bottom. Run `herdr --default-config` to see every default binding. From a script, use `herdr pane split --current --direction right` or `--direction down`.

The clip below is a real Herdr session in this sandbox. The left pane lists the worktrees of the task that produced this post: one integration branch and four story branches. The right pane opens in the `feat/88-us-004` worktree and reads the plan. A third pane checks the CLI version and lists the AGRO skills.

<video src="/blog/daily-work-with-agro/herdr-panes.mp4" poster="/blog/daily-work-with-agro/herdr-two-panes.png" autoplay muted loop playsinline preload="none" style="width:100%;height:auto"></video>

![A Herdr session with two panes. The left pane lists four story worktrees and the feat/88 branches. The right pane, in the feat/88-us-004 worktree, shows the five user stories of the plan.](/blog/daily-work-with-agro/herdr-two-panes.png)

Herdr detects agents in panes without extra setup. The `/herdr` skill lets one agent inspect other panes from the command line. Its description reads: "Drive the Herdr terminal workspace manager from the CLI inside the AGRO sandbox — inspect and control workspaces, tabs, panes, agents, and git worktrees over the Herdr socket API, and read or steer other running agents headlessly."

Two commands do most of the work:

```bash
herdr agent list | jq -r '.result.agents[] | "\(.pane_id)\t\(.agent)\t\(.agent_status)"'
herdr agent read w1:p1E --source recent --lines 80 | jq -r '.result.read.text'
```

The skill also sets limits. An agent does not run bare `herdr` from inside a run, does not stop the Herdr server, and does not close or type into a pane that it did not create.

Headless services, such as the Slack gateway and Cloudflared tunnels, do not belong in Herdr. They stay in their own named tmux sessions.

## 4. Decide scope with `/council`

Some decisions have more than one reasonable answer. Use `/council` for those decisions before you write a plan. The skill description reads: "Compare independent perspectives on a bounded question and return one Council Brief. The active advisor owns verification and synthesis."

```text
/council Should the blog archive old posts or delete them?
```

The council runs two or three read-only research lenses in fresh, isolated contexts. Each member reports options, evidence, counterevidence, risks, and a falsifier. The advisor then checks the decisive claims against the sources and writes one Council Brief with an outcome of `COMPLETE`, `PARTIAL`, or `BLOCKED`.

A council gives advice only. The skill states: "Council advice does not authorize execution or publication." The operator still approves the scope. The plan for this post records that approval: the operator approved the approach in a council session, and the plan starts from that decision.

## 5. Write the plan with `/prd`

`/prd` turns the decision into a plan. The skill description reads: "Write or revise a repository-grounded plan for one task at `.agro/tasks/<slug>/prd.md`, with user stories, binary acceptance criteria, and the section headings of the feature issue template." The skill plans only. It never implements the plan.

```text
/prd archive stale posts and publish three AGRO guides
```

The plan lives in the target repository, at `.agro/tasks/<slug>/prd.md`. The skill reads the applicable `AGENTS.md` files and the code before it writes, and it marks each missing value as a placeholder and an open question. Each user story has binary acceptance criteria, so a reviewer can check each criterion with a command or a browser.

Writing a plan is never approval. After the operator approves the plan, the advisor converts it to `.agro/tasks/<slug>/prd.json`. That file is the tracker for `/delegate`.

## 6. Run the stories with `/delegate`

`/delegate` executes the plan. The skill description reads: "Runs the stories in `.agro/tasks/<slug>/prd.json` as bounded workers in dependency waves. The active session verifies each result, accepts it, and records it in `prd.json`."

```text
/delegate agro-console-blog-refresh
```

The advisor groups ready stories into waves. A story is ready when each story in its `dependsOn` list passes. A wave runs at most five workers in parallel. Each parallel worker gets its own worktree, branched from the task branch, and a dispatch record that names:

- the read scope and the owned write paths;
- the deliverable, which is one commit on the worker branch;
- the verification commands from the acceptance criteria;
- the execution directory and the model.

Workers edit only their owned paths, commit on their own branch, and never push. They report each criterion as **executed**, with the command and exit status, or **reasoned**, with a one-line argument. Workers never spawn workers.

A worker report is not acceptance. The advisor inspects each commit, brings it onto the task branch, and reruns the verification there. Only then does the advisor write `passes: true` in `prd.json`. If a check fails, the story goes back to the same worker with a bounded repair.

This post is a delegated story. The worktree list in the clip above shows the task branch and one worktree for each story.

## 7. Check CI before review

A pushed branch is not done until CI is green. The `/ci-status` skill description reads: "Check the CI pipeline status for the current branch after pushing changes. Reports pass/fail with failure details. Use this after every push to confirm your changes are truly done — CI must be green."

The `/git` skill sets the order for review. The advisor pushes the task branch, runs `/ci-status`, and runs `gh pr ready` only when every condition holds:

- every story in `prd.json` has `passes: true`;
- `prd.md` ends with a `## Lessons` section;
- the pull request body has its evidence and manual review sections;
- the repository's checks pass on the pushed branch.

If one condition is false, the pull request stays in draft.

## The loop in one view

![A Herdr session with three panes. The left pane lists the task worktrees. The top-right pane shows the plan's user stories. The bottom-right pane shows AGRO version 0.24.0 and the list of AGRO skills.](/blog/daily-work-with-agro/herdr-three-panes.png)

| Step | Where it runs | Owner | Output |
|---|---|---|---|
| Clone | `projects/<owner>/<repo>/` | Agent, on request | An independent clone |
| Isolate | `.worktrees/<prefix>/<branch>` | Agent, on request | One branch and checkout per change |
| Work in parallel | Herdr panes | Operator and agents | Durable sessions |
| `/council` | Read-only workers | Advisor | A Council Brief |
| `/prd` | Active session | Advisor | `.agro/tasks/<slug>/prd.md` |
| `/delegate` | Worker worktrees | Workers implement, advisor accepts | One accepted commit per story |
| `/ci-status` | Pushed branch | Advisor | Green checks before `gh pr ready` |

## Read more

- [Self-host AGRO](/blog/agro-getting-started)
- [Run AGRO on Mifune Console](/blog/run-agro-on-mifune-console)
- [Herdr in AGRO](https://github.com/mifunedev/agro/blob/main/docs/integrations/herdr.md)
- [Directory layout and shared skills](https://github.com/mifunedev/agro/blob/main/docs/agro-directory-layout.md)
- [The canonical skills](https://github.com/mifunedev/agro/tree/main/.agro/skills)
