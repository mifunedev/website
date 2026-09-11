---
title: "How to Connect MCP Tools to Orchestra Agents (Cursor, Claude Desktop, or API)"
date: "2025-12-25"
excerpt: "A hands-on guide to using Orchestra's MCP endpoint with the MCP Inspector, Cursor, Claude Desktop, and the Orchestra API—complete with streaming examples and troubleshooting."
categories: ["How-To", "MCP", "API Walkthrough", "Agent Automation"]
coverImage: "https://github.com/mifunedev/static/blob/master/blog/mcp.png?raw=true"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

MCP (Model Context Protocol) is the open standard for connecting AI agents to external tools. Orchestra exposes a native MCP endpoint—and the best part? **The same config format works everywhere**: in your IDE, in the MCP Inspector, and directly in API calls.

This guide shows you the pattern:

1. **Explore** — Use MCP Inspector to discover available tools
2. **Connect** — Wire the same config into Cursor or Claude Desktop
3. **Call** — Pass the config inline to the Orchestra API for full programmatic control

One config. Three ways to use it. All with copy/paste commands.

---

## What You'll Build

- Inspect available MCP tools on `https://chat.ruska.ai/mcp`
- Configure Cursor or Claude Desktop to call Orchestra tools natively
- Make a streaming API call with **inline MCP config** (no pre-built Assistant required)
- Understand expected SSE behavior and common failure modes

---

## Prerequisites

- **Node.js 18+** (for MCP Inspector)
- **A Ruska AI API key** (starts with `otk_`) — get one free at [chat.ruska.ai](https://chat.ruska.ai)
- **Cursor** or **Claude Desktop** (optional, for IDE integration)
- Basic CLI comfort

---

## Step 1: Explore with MCP Inspector

The MCP Inspector lets you browse and test any MCP server before wiring it into your IDE.

### Start MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

This launches a local web UI (usually at `http://localhost:6274`).

### Connect to Orchestra's MCP Endpoint

In the Inspector UI:

1. Select **HTTP transport**
2. Enter the URL: `https://chat.ruska.ai/mcp`
3. Add the header:
   - **Key:** `x-api-key`
   - **Value:** `otk_abc1234...` (your API key)
4. Click **Connect**

You'll see a list of available tools. Try invoking one to verify the connection works.

> **Tip:** If you see a 401 error, double-check your API key. If you see a timeout, ensure you're not behind a corporate proxy blocking outbound connections.

---

## Step 2: Configure Cursor to Use the MCP Server

Cursor natively supports MCP. Add Orchestra's endpoint to your MCP config:

### Cursor MCP Config

Create or edit your Cursor MCP configuration file (usually `~/.cursor/mcp.json` or via Cursor settings):

```json
{
  "mcpServers": {
    "ruska_mcp": {
      "transport": "http",
      "url": "https://chat.ruska.ai/mcp",
      "headers": {
        "x-api-key": "otk_abc1234..."
      }
    }
  }
}
```

### What This Does

- **`transport: "http"`** — Uses HTTP (not stdio) for remote MCP servers
- **`url`** — Points to Orchestra's MCP endpoint
- **`headers`** — Authenticates requests with your API key

After saving, restart Cursor. Orchestra's tools are now available in your AI assistant.

> **Note:** Claude Desktop uses a similar config format. Place it in `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows).

---

## Step 3: Call the Orchestra API with Inline MCP Config

Here's where it all comes together. You can pass the **exact same MCP config** directly in your API request—no pre-configured Assistant required:

```bash
curl 'https://chat.ruska.ai/api/llm/stream' \
  -H 'accept: text/event-stream' \
  -H 'x-api-key: otk_abc1234...' \
  -H 'content-type: application/json' \
  --data-raw '{
  "input": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Use python_sandbox to get first 20 of fib"
          }
        ]
      }
    ]
  },
  "model": "openai:gpt-4.1-mini",
  "mcp": {
    "ruska_mcp": {
      "transport": "http",
      "url": "https://chat.ruska.ai/mcp",
      "headers": {
        "x-api-key": "otk_abc1234..."
      }
    }
  },
  "metadata": {
    "current_utc": "2025-12-26T03:55:27.829Z",
    "timezone": "America/Denver",
    "language": "en-US"
  }
}'
```

### What This Does

| Field | Purpose |
|-------|---------|
| `input.messages` | The user prompt (here: run Fibonacci via Python sandbox) |
| `model` | The LLM to use (e.g., `openai:gpt-4.1-mini`) |
| `mcp` | **Inline MCP server config** — same format as Cursor/Claude Desktop |
| `metadata` | Optional context (timezone, language) for the agent |

### The Key Insight

Notice the `mcp` block? It's the **exact same structure** as the Cursor config from Step 2. Orchestra dynamically connects to any MCP server you specify at request time. No setup required.

This means you can:
- Connect to **any MCP server** on the fly
- Use **different MCP configs** per request
- Build agents that **dynamically choose their tools**

### Expected Output

You'll receive Server-Sent Events (SSE) like:

```
data: ["messages", [{"type": "AIMessageChunk", "content": "The first 20 Fibonacci numbers are: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181"}]]

data: ["messages", [{"type": "AIMessageChunk", "content": "", "response_metadata": {"finish_reason": "stop", "model_name": "gpt-4.1-mini-2025-04-14"}}]]

data: ["values", {"messages": [{"type": "human", "content": [{"type": "text", "text": "Use python_sandbox to get first 20 of fib"}]}]}]
```

The agent reasons, calls `python_sandbox`, executes Python code, and returns the result—all streamed in real time.

---

## Expected SSE Stream Behavior

A healthy stream looks like this:

1. **`messages`** — Each streamed chunk includes LLM and tool output/state as the agent thinks and acts
2. **`values`** — Final tool and human state (such as the original prompt)
3. **(Optional `response_metadata`)** — End-of-stream status including model, finish_reason, etc.

Each `data:` line is a Server-Sent Event (SSE) containing an array with a label ("messages" or "values") and its payload.

---

## Troubleshooting Checklist

- **401 Unauthorized**: Verify your `x-api-key` header is correct and the key is active.
- **404 Not Found**: Confirm the URL is `https://chat.ruska.ai/mcp` (not `/api/mcp`).
- **Connection refused in Inspector**: Ensure `transport` is set to `http`, not `stdio`.
- **Cursor doesn't see tools**: Restart Cursor after editing `mcp.json`. Check for JSON syntax errors.
- **SSE buffering issues**: If using a proxy (nginx, Cloudflare), ensure SSE passthrough is enabled. Disable response buffering.
- **Tool timeout**: Some tools (like `python_sandbox`) have execution limits. Simplify your request or check rate limits.
- **CORS errors (browser)**: The MCP endpoint is not designed for browser-side calls. Use a backend proxy or the CLI.

---

## Why This Pattern Matters

The inline MCP pattern unlocks serious flexibility:

1. **One Config, Three Uses** — The same JSON structure works in MCP Inspector, Cursor/Claude Desktop, and the Orchestra API.
2. **No Pre-Configuration Required** — Connect to any MCP server at request time. No Assistants, no setup.
3. **Dynamic Tool Selection** — Your backend can decide which MCP servers to use per request based on user context.
4. **Streaming by Default** — Real-time feedback on tool execution, not just final results.
5. **Vendor-Neutral** — MCP is an open standard. Your config works across compatible clients.

This is how production agent systems work: dynamic tool registries, inline configuration, and streaming execution.

---

## Next Steps

- **Connect multiple MCP servers** — Pass multiple servers in the `mcp` block for agents with diverse tool access
- **Create an Assistant** — Bundle MCP config, system prompts, and model settings into a reusable agent spec
- **Use Threads** — Persist conversation state across sessions with `thread_id`
- **Schedule runs** — Automate your agent on a cron schedule with the Schedules API
- **Build your own MCP server** — Expose your internal APIs as MCP tools

---

## Start Building

Orchestra is free to use during beta—no credit card required.

[Build Now](https://chat.ruska.ai) | [GitHub](https://github.com/mifunedev/orchestra) | [Follow us on X](https://x.com/ruska_ai)
