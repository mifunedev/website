# Lead the hero with persistent workspaces and drop Docker-only copy

Issue: #92

## Summary

Keep the H1 "A portable home for autonomous coding agents." Lead the hero subtitle with persistent workspaces. Replace visible copy that calls AGRO a "Docker workspace" or "Docker environment". AGRO workspaces run on a laptop, a remote VM, or a Mifune Console node. Docker is one supported runtime.

## User Stories

### US-001: Persistent subtitle and runtime-neutral workspace copy

**Description:** As a first-time visitor, I want the hero to say the workspace is persistent and the site to describe AGRO without a Docker-only claim, so that the copy matches the Mifune Console and self-hosted AGRO.

**Acceptance Criteria:**

- [ ] The hero `<h1>` still reads exactly "A portable home for autonomous coding agents.", and `APP_DEFAULT_TITLE` is unchanged.
- [ ] The hero subtitle reads exactly "Persistent workspaces for Claude Code, Codex, Pi, or any harness: isolated, and still working after you disconnect. Self-host it, or start free in your browser."
- [ ] `git grep -n -i -E "docker (workspace|environment)" -- src scripts public/llm.txt` returns no match.
- [ ] The FAQ answer for what AGRO is, and the `llm.txt` category paragraph, each state that workspaces run on a laptop, a remote VM, or a Mifune Console node, and that Docker is one supported runtime.
- [ ] `public/llm.txt` equals the output of `node scripts/generate-llm-txt.mjs`.
- [ ] `npm run lint` exits 0, and `npm run build` exits 0.

## Lessons
