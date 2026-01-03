---
title: "Remote Agent Development with Cloudflare Tunnels and Claude Code Hooks"
date: "2025-12-30"
excerpt: "Set up persistent Cloudflare Tunnels for remote access to your dev environment, then supercharge it with Claude Code hooks for an automated agent feedback loop."
categories: ["How-To", "Developer Productivity", "Claude Code", "Remote Development"]
coverImage: "https://github.com/ruska-ai/static/blob/master/blog/hooks_tunnels.png?raw=true"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

You're deep in a coding session with Claude Code. The agent just refactored your authentication module, and you want to verify the changes on your phone while grabbing coffee. Or maybe you're pair-programming with a teammate across the globe who needs to see your local dev server.

The problem? Your development servers are trapped on `localhost`. Quick tunnels like `ngrok` generate random URLs that change every session. What you need is a **persistent, secure connection** to your local environment—and ideally, an automated way to know when Claude has finished making changes.

This guide shows you how to set up **static Cloudflare Tunnels** for remote access to your frontend and backend, then wire in **Claude Code hooks** to create an automated feedback loop that notifies you, runs builds, and keeps your remote preview always up-to-date.

---

## What You'll Build

- A persistent Cloudflare Tunnel exposing both your frontend (port 5173) and backend (port 8000)
- Custom Claude Code hooks that auto-build, notify, and inject context
- An automated agent feedback loop for remote development review

---

## Prerequisites

- **Cloudflare account** with a registered domain
- **cloudflared CLI** installed ([installation guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/))
- **Claude Code** installed and configured
- A local development environment with:
  - Frontend running on port 5173 (e.g., Vite, Next.js dev server)
  - Backend running on port 8000 (e.g., FastAPI, Express)
- Basic familiarity with terminal commands

---

## Part 1: Setting Up a Static Cloudflare Tunnel

Unlike quick tunnels that generate random `trycloudflare.com` URLs, static tunnels give you **permanent subdomains** on your own domain. Once configured, `app.yourdomain.com` will always point to your local frontend.

### Step 1: Authenticate with Cloudflare

First, log in to your Cloudflare account:

```bash
cloudflared tunnel login
```

This opens a browser window. Select the domain you want to use and authorize cloudflared.

### Step 2: Create the Tunnel

Create a named tunnel that will persist across sessions:

```bash
cloudflared tunnel create dev-tunnel
```

This generates:
- A **tunnel UUID** (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- A **credentials file** at `~/.cloudflared/<UUID>.json`

Save the UUID—you'll need it for the config file.

### Step 3: Configure Multi-Service Routing

Create a config file at `~/.cloudflared/config.yml`:

```yaml
tunnel: a1b2c3d4-e5f6-7890-abcd-ef1234567890
credentials-file: /home/youruser/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

ingress:
  # Frontend (Vite dev server)
  - hostname: app.yourdomain.com
    service: http://localhost:5173

  # Backend API (FastAPI/Express)
  - hostname: api.yourdomain.com
    service: http://localhost:8000

  # Catch-all (required by cloudflared)
  - service: http_status:404
```

**Key points:**
- Each service gets its own subdomain
- The `ingress` rules are evaluated top-to-bottom
- The catch-all rule is **required**—cloudflared won't start without it

### Step 4: Create DNS Records

Route your subdomains to the tunnel:

```bash
cloudflared tunnel route dns dev-tunnel app.yourdomain.com
cloudflared tunnel route dns dev-tunnel api.yourdomain.com
```

This creates CNAME records pointing to your tunnel.

### Step 5: Validate and Run

Validate your configuration:

```bash
cloudflared tunnel ingress validate
```

If everything looks good, start the tunnel:

```bash
cloudflared tunnel run dev-tunnel
```

Your services are now accessible at:
- `https://app.yourdomain.com` → Frontend (localhost:5173)
- `https://api.yourdomain.com` → Backend (localhost:8000)

### Step 6: Run as a Background Service (Optional)

For persistent operation, install cloudflared as a system service:

```bash
# Linux
sudo cloudflared service install

# macOS
sudo cloudflared service install
```

Now your tunnel starts automatically on boot.

---

## Part 2: Claude Code Hooks for Remote Review

With your tunnel running, anyone with the URL can access your dev environment. But how do you know when Claude has made changes worth reviewing? That's where **hooks** come in.

### What Are Claude Code Hooks?

Hooks are user-defined shell commands that execute at specific lifecycle events:

| Hook Type | When It Fires | Use Case |
|-----------|---------------|----------|
| `PreToolUse` | Before a tool runs | Block risky operations |
| `PostToolUse` | After a tool completes | Auto-format, rebuild, notify |
| `SessionStart` | When a session begins | Inject context |
| `Stop` | When a session ends | Send completion notification |

Configuration lives in `~/.claude/settings.json`. The easiest way to manage hooks is via the `/hooks` command in Claude Code.

### Hook 1: Auto-Build After File Changes

Automatically rebuild your frontend whenever Claude edits a file:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "cd ~/projects/myapp/frontend && npm run build 2>&1 | tail -5"
      },
      {
        "matcher": "Edit",
        "command": "cd ~/projects/myapp/frontend && npm run build 2>&1 | tail -5"
      }
    ]
  }
}
```

Now every file edit triggers a rebuild. The output appears in Claude's context, so the agent knows if the build failed.

### Hook 2: Inject Tunnel URLs at Session Start

Give Claude awareness of your remote preview URLs:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "echo 'Remote Preview URLs:\\n- Frontend: https://app.yourdomain.com\\n- Backend API: https://api.yourdomain.com\\n- API Docs: https://api.yourdomain.com/docs'"
      }
    ]
  }
}
```

Claude now knows exactly where to tell you to preview changes.

### Hook 3: Desktop Notification on Session End

Get notified when Claude finishes a task so you can review on your remote device:

**Linux (notify-send):**
```json
{
  "hooks": {
    "Stop": [
      {
        "command": "notify-send 'Claude Code' 'Session complete. Review at https://app.yourdomain.com'"
      }
    ]
  }
}
```

**macOS (osascript):**
```json
{
  "hooks": {
    "Stop": [
      {
        "command": "osascript -e 'display notification \"Session complete. Review at https://app.yourdomain.com\" with title \"Claude Code\"'"
      }
    ]
  }
}
```

### Hook 4: Run Tests After Backend Changes

Ensure backend changes don't break tests:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'backend/'; then cd ~/projects/myapp/backend && make test 2>&1 | tail -10; fi"
      }
    ]
  }
}
```

### Complete Configuration Example

Here's a full `~/.claude/settings.json` combining all hooks:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "echo 'Remote Preview URLs:\\n- Frontend: https://app.yourdomain.com\\n- Backend: https://api.yourdomain.com'"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "cd ~/projects/myapp/frontend && npm run build 2>&1 | tail -5"
      },
      {
        "matcher": "Edit",
        "command": "cd ~/projects/myapp/frontend && npm run build 2>&1 | tail -5"
      }
    ],
    "Stop": [
      {
        "command": "notify-send 'Claude Code' 'Session complete. Check https://app.yourdomain.com'"
      }
    ]
  }
}
```

---

## The Agent Feedback Loop

Here's where everything comes together. This workflow creates a continuous feedback loop between you and Claude, regardless of where you are:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT FEEDBACK LOOP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. You give Claude a task                                     │
│          ↓                                                      │
│   2. Claude makes changes (Write/Edit tools)                    │
│          ↓                                                      │
│   3. PostToolUse hook triggers build                            │
│          ↓                                                      │
│   4. Changes are live on your tunnel                            │
│          ↓                                                      │
│   5. Stop hook sends notification                               │
│          ↓                                                      │
│   6. You review on any device (phone, tablet, laptop)           │
│          ↓                                                      │
│   7. You provide feedback via Claude Code                       │
│          ↓                                                      │
│   8. Loop continues                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Practical Example

**Scenario:** You're at a coffee shop with only your phone. You want Claude to add a dark mode toggle to your React app.

1. **You (via Claude Code on laptop at home):**
   > "Add a dark mode toggle to the navigation bar. Use the existing theme context."

2. **Claude works:** Edits `Navbar.tsx`, updates `ThemeContext.tsx`, modifies Tailwind config.

3. **PostToolUse hooks fire:** Frontend rebuilds automatically after each edit.

4. **Stop hook fires:** You get a notification: "Session complete. Check https://app.yourdomain.com"

5. **You (on your phone):** Open `https://app.yourdomain.com`, test the dark mode toggle, notice the animation is janky.

6. **You (back in Claude Code):**
   > "The dark mode toggle works but the transition animation is choppy. Use CSS transitions instead of JavaScript."

7. **Claude iterates.** The loop continues.

This workflow eliminates context-switching. You don't need to be at your development machine to see results—you just need the URL.

---

## Security Considerations

Exposing your dev environment to the internet requires caution:

### 1. Use Cloudflare Access (Recommended)

Add authentication to your tunnel with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/):

```bash
# Require email authentication
cloudflared access policy create \
  --name "Dev Access" \
  --hostname app.yourdomain.com \
  --allow-email you@example.com
```

### 2. Never Expose Production Secrets

Your `.env` files should never contain production credentials in a dev environment. Use mock data and test APIs.

### 3. Hook Security

When writing hooks, follow these practices:

- **Quote all variables:** Use `"$VAR"` not `$VAR`
- **Validate inputs:** Check for path traversal (`..`) in file paths
- **Limit scope:** Only run hooks on specific directories

```bash
# Safe: Check file is in allowed directory
if [[ "$CLAUDE_TOOL_INPUT" == ~/projects/myapp/* ]]; then
  # Run build
fi
```

### 4. Tunnel Lifecycle

Stop your tunnel when not in use:

```bash
cloudflared tunnel stop dev-tunnel
```

Or use the system service to control it:

```bash
sudo systemctl stop cloudflared
```

---

## Troubleshooting

### Tunnel not connecting

```bash
# Check tunnel status
cloudflared tunnel info dev-tunnel

# Verify credentials file exists
ls ~/.cloudflared/*.json

# Test connectivity
cloudflared tunnel --config ~/.cloudflared/config.yml ingress validate
```

### Hooks not firing

```bash
# Verify hooks are configured
claude config get hooks

# Check Claude Code logs
tail -f ~/.claude/logs/claude-code.log
```

### Frontend not updating

If your frontend uses HMR (Hot Module Replacement), you may need to configure it to accept external connections:

```javascript
// vite.config.js
export default {
  server: {
    host: true,  // Listen on all interfaces
    hmr: {
      host: 'app.yourdomain.com',
      protocol: 'wss'
    }
  }
}
```

### API CORS issues

Update your backend CORS configuration to allow your tunnel domain:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Next Steps

You now have a persistent remote development environment with automated feedback loops. Here's where to go next:

- **Add more services:** Database admin panels, documentation sites, Storybook
- **Configure Cloudflare Access:** Require authentication for your tunnel
- **Expand your hooks:** Slack notifications, automated screenshots, test reports
- **Try headless mode:** Run Claude Code in CI/CD with `claude -p "<prompt>" --output-format stream-json`

---

## Start Building

Cloudflare Tunnels are free for personal use. Claude Code hooks are available now.

[Get Claude Code](https://claude.ai/code) | [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | [Orchestra on GitHub](https://github.com/ruska-ai/orchestra)
