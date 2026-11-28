---
title: "SWE Toolkit (2026): A Practical Guide to Agentic Coding Workflows"
date: "2026-01-21"
excerpt: "The 4 tools I use to turn vague ideas into merged PRs: a multi-agent planning council (/team), a ticket-to-PR automator (/ticket), an autonomous execution loop (Ralph), and a ruthlessly curated AGENTS.md that keeps the agent in the 'Smart Zone' of the context window."
categories: ["Agentic Coding", "Developer Productivity", "Workflow", "AI Engineering"]
coverImage: "https://github.com/mifunedev/static/blob/master/blog/swe-toolkit.png?raw=true"
archived: true
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

In 2026, “agentic coding” is no longer a party trick. It’s a production workflow—if (and only if) you treat it like engineering: clear contracts, tight feedback loops, and deliberate context management.

This post is a practical guide to the four tools I keep coming back to. Together they form a workflow that scales from “I have an idea” to “here’s a tested PR” without turning your codebase into AI-generated sludge.

---

## The 4 Tools (and what each is *for*)

### 1) `/team`: multi-agent analysis → one plan you’d actually execute

When I don’t know the right approach yet, I don’t want one agent guessing in a single pass. I want **multiple expert perspectives** exploring the solution space, then a synthesis that turns into an actionable plan.

That’s what our `/team` workflow is for:

- **Phase 0**: load baseline context (the repo’s guiding docs) so agents don’t reinvent conventions
- **Phase 1**: spawn a small council of specialists (architecture, craftsmanship, security/testing)
- **Phase 2**: synthesize a unified approach and resolve tradeoffs
- **Phase 3**: produce an ordered, atomic, and verifiable task contract (`TASKS.md`)

Here’s the simplest mental model for `/team`:

```mermaid
flowchart TD
  A["Phase 0: Initialize Context<br/>Read repo guidance + set output_dir"] --> B["Phase 1: Parallel Research + Draft Proposals"]

  B --> BA["Architect<br/>Research system boundaries + propose design"]
  B --> BC["Craftsman<br/>Research implementation + propose tasks"]
  B --> BG["Guardian<br/>Research risks + propose tests/controls"]

  BA --> C["Phase 2: Council Review<br/>Compare tradeoffs and converge on one approach"]
  BC --> C
  BG --> C
  C --> D["Phase 3: Task Contract<br/>Generate TASKS.md"]
  D --> E["Phase 4: Builder Execution<br/>Implement tasks in order"]
  E --> F["Phase 5: Validation<br/>Run checks + record results"]
  F -.-> G["(Optional) Phase 6: Reflection<br/>Generate review questions for next run"]
```

The point isn’t to “ask AI what to do.” The point is to **maximize surface area**, gather options, then deliberately converge.

- **Reference**: `/team` command spec lives at [`.claude/commands/team.md`](https://github.com/mifunedev/orchestra/blob/development/.claude/commands/team.md)

#### When I reach for `/team`

- New feature where there are multiple legitimate architectures
- Refactors where the blast radius isn’t obvious yet
- Features with tricky edges (auth, streaming, state machines, permissions)

#### What `/team` produces that matters

- A shared vocabulary for the change (“here are the tradeoffs we considered”)
- A plan that you can hand to a human *or* use as the seed for an execution loop
- A clear boundary between “exploration” and “implementation”

---

### 2) `/ticket`: GitHub issue → worktree → spec artifacts → PR

Once the problem has a home (a GitHub issue), I want my workflow to stop being artisanal. The goal is to standardize all the mechanical steps so the human (and the agent) can focus on the actual work.

`/ticket` is the automation glue:

- Validate and parse the issue URL
- Pull issue metadata with `gh`
- Create a scoped worktree off `origin/development`
- Generate a changelog commit to anchor the branch
- Generate user stories with acceptance criteria
- Invoke `/team` using the issue + stories as input
- Push the branch
- Open a PR with a body derived from the artifacts

If you’ve ever lost an hour to “branch naming + worktree + boilerplate PR body,” `/ticket` is the fix.

- **Reference**: `/ticket` command spec lives at [`.claude/commands/ticket.md`](https://github.com/mifunedev/orchestra/blob/development/.claude/commands/ticket.md)

#### Why this matters for agentic workflows

Agents are great at reasoning and editing. They are also great at losing the plot if you don’t give them a predictable runway.

`/ticket` gives you:

- Repeatable structure
- Repeatable artifacts
- Repeatable review surfaces

And that’s what turns “agent output” into “engineering output.”

---

### 3) Ralph: an autonomous execution loop that respects context windows

`/team` is for exploration and convergence. Ralph is for **execution, iteration, and bookkeeping**.

Ralph is an autonomous agent loop that operates on a very specific constraint: **each iteration has a limited context window**. Ralph does not pretend that one run can do everything. Ralph works from a PRD split into small, verifiable user stories (`prd.json`) and executes **one story per iteration**.

Key mechanics:

- **PRD → `prd.json`**: break work into stories, each small enough for one run
- **One story at a time**: pick the highest priority `passes: false`
- **Quality gates**: run checks (typecheck/lint/tests) before committing
- **Progress logging**: append a progress note, and consolidate reusable patterns over time

Ralph gets reliable momentum this way, without the “context window cliff” where the agent loses track of its task halfway through.

- **Reference**: Ralph lives in this repo under [`/.ralph`](https://github.com/mifunedev/orchestra/tree/development/.ralph)
- **Reference**: It’s based on the excellent starting point from [`github.com/snarktank/ralph`](https://github.com/snarktank/ralph)

#### The hidden superpower: you can make the loop observable

The workflow gets dramatically better when you can *see* each iteration. In my setup, I use a **Stop hook** that posts the iteration output to a Slack channel. That gives me a clean, scrollable audit log of:

- what the agent tried
- what changed
- what broke
- what it learned

If you’re going to rely on an agent, you want the same thing you want from any distributed system: **traces**.

---

### 4) `AGENTS.md`: keep the agent in Geoff Huntley’s “Smart Zone”

`AGENTS.md` is the unsexy one—and it’s the one that compounds.

Every serious agentic workflow eventually crashes into the same limit: **context**. Not tokens in the abstract, but *useful context*.

The trick is to keep your “always-on instructions” small, accurate, and high-signal. In this repo, that’s `AGENTS.md` (and any local `AGENTS.md` files nearer to the work). When those files are clean, the agent stays in what Geoff Huntley calls the **“Smart Zone”** of the context window. The Smart Zone has enough constraints to behave like a senior engineer, but not so much noise that the agent misses the important parts.

In practice, `AGENTS.md` should contain:

- the project structure
- how to run tests / formatters
- easy-to-miss conventions
- “when you touch X, don’t forget Y” gotchas
- security do’s and don’ts

And `AGENTS.md` should *not* contain:

- long narratives
- outdated instructions
- one-off story notes

- **Reference**: see [`/AGENTS.md`](https://github.com/mifunedev/orchestra/blob/development/AGENTS.md)

---

## The workflow: from idea → plan → PR (without chaos)

Here’s my loop:

1. **Explore and converge** with `/team` until the approach feels “boring”
2. Decide the execution mode:
   - **Small change**: implement directly with your agent in the IDE
   - **Ticketed work**: run `/ticket` so you get worktree + artifacts + PR scaffolding
   - **Multi-iteration work**: convert the plan into Ralph-sized stories and run the loop
3. Keep context “sharp”:
   - prune and update `AGENTS.md` when you learn a reusable lesson
   - keep acceptance criteria verifiable and binary
   - make the workflow observable (logs, hooks, CI gates)
4. *(Optional)* **Reflect and generate review questions**:
   - I often ask Claude Code to reflect on the latest run (what worked, what broke, what was confusing)
   - then have it generate a short set of **multiple-choice questions** that I (or the next agent run) can answer to tighten the next iteration

The goal isn’t “AI writes the code.” The goal is **a system that reliably turns intent into validated changes**.

---

## How to get better results (fast)

If you want to copy this workflow, here are the two highest-value habits:

### Habit 1: Treat plans like contracts

The moment your “plan” becomes a checklist with acceptance criteria, you can:

- delegate safely
- review quickly
- recover from failures without re-explaining everything

For this reason, `/team` ends in a task contract, and Ralph runs one story at a time.

### Habit 2: Design your context window on purpose

Most agent failures aren’t “the model is bad.” They’re:

- the repo has no documentation
- instructions are stale
- acceptance criteria are vague
- you ask the agent to do too much in one run

Fix those, and your success rate spikes.

---

## Closing thought

Agentic coding in 2026 is about **workflow design**, not model worship. The models will keep changing. The habits that ship—contracts, observability, and clean context—stay useful.

If you want to see how we’re building these workflows in the open, check out [Orchestra on GitHub](https://github.com/mifunedev/orchestra).

---

## References

- `/team`: [`.claude/commands/team.md`](https://github.com/mifunedev/orchestra/blob/development/.claude/commands/team.md)
- `/ticket`: [`.claude/commands/ticket.md`](https://github.com/mifunedev/orchestra/blob/development/.claude/commands/ticket.md)
- Context hygiene: [`AGENTS.md`](https://github.com/mifunedev/orchestra/blob/development/AGENTS.md)
- Ralph in Orchestra: [`.ralph/`](https://github.com/mifunedev/orchestra/tree/development/.ralph)
- Ralph baseline: [`github.com/snarktank/ralph`](https://github.com/snarktank/ralph)

