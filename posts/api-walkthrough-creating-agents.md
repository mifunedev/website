---
title: "How to Build and Schedule a Real Production AI Agent with Orchestra’s API"
date: "2025-12-14"
excerpt: "A hands-on, step-by-step guide to building, verifying, and scheduling a durable AI agent using Orchestra’s API—including tools, assistants, threads, and autonomous scheduling. Curl examples included!"
categories: ["How-To", "API Walkthrough", "Agent Automation"]
coverImage: "https://github.com/ruska-ai/static/blob/master/blog/scheduler.png?raw=true"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

Building production-grade AI agents is hard. This practical guide shows you, step-by-step, how to use Orchestra’s API to:

- Register and test a powerful API tool (with validation for LLMs)
- Wire tools into a persistent agent “Assistant”
- Run your agent with a streaming response
- Create a persistent thread for long-term context
- Schedule your agent to run itself on a recurring basis

All with real-world `curl` commands you can copy and try today.

---

## Step 1: Create an API Tool

First, teach Orchestra how to talk to your chosen data source. Here, we’ll create a `create_post` API tool that publishes a blog post using [JSONPlaceholder](https://jsonplaceholder.typicode.com/):

```bash
curl -X POST "https://chat.enso.sh/api/tools" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "name": "create_post",
    "description": "Create a new blog post on JSONPlaceholder.",
    "type": "api",
    "config": {
      "api_tool": {
        "base_url": "https://jsonplaceholder.typicode.com",
        "method": "POST",
        "endpoint": "/posts",
        "args_schema": {
          "type": "object",
          "properties": {
            "title": {"type": "string", "required": true},
            "body": {"type": "string", "required": true},
            "userId": {"type": "integer", "default": 1}
          },
          "required": ["title", "body", "userId"]
        }
      }
    }
  }'
```

This endpoint registers the tool and its required arguments for model-safe calling.

## Step 2: Test the Tool Directly

Verify your tool works as expected by calling `/api/tools/invoke` directly:

```bash
curl -X POST "https://chat.enso.sh/api/tools/invoke" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '[
    {
      "name": "create_post",
      "args": {
        "title": "My New Agent",
        "body": "This was created by an agent.",
        "userId": 1
      }
    }
  ]'
```

You should see a generated object: if you do, your grounding tool works!

## Step 3: LLM-Driven Tool Use

Now prove the LLM can use your tool through `/api/llm/invoke`:

```bash
curl -X POST "https://chat.enso.sh/api/llm/invoke" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "model": "openai:gpt-5.2",
    "input": {
      "messages": [
        {"role": "user", "content": "Write a short blog post about AI and publish it."}
      ]
    },
    "tools": ["create_post"]
  }'
```

The model should call the `create_post` tool—check its arguments in the output.

## Step 4: Create a Production-Ready Assistant

Don’t want to pass tools on every call? Define an **Assistant** (an agent spec) once:

```bash
curl -X POST "https://chat.enso.sh/api/assistants" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "name": "blog_writer_bot",
    "description": "An agent that writes and publishes blogs.",
    "model": "openai:gpt-5.2",
    "system_prompt": "You are a helpful assistant that writes and publishes blog posts.",
    "tools": ["create_post"],
    "mcp": {},
    "a2a": {},
    "subagents": []
  }'
```

You’ll get back an `assistant_id`—save it!

## Step 5: Run the Agent, See the Stream

Kick off a session and watch a full agent run (streamed in real time):

```bash
curl -X POST "https://chat.enso.sh/api/llm/stream" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "input": {
      "messages": [
        {"role": "user", "content": "Publish a post announcing our new feature."}
      ]
    },
    "metadata": {
      "assistant_id": "8e4db28c-be8f-4a44-92e7-b8ccd841d6cc"
    }
  }'
```

You’ll see the agent reason, call the tool, and emit a confirmation.

## Step 6: (Optional) Persistent Memory with Threads

Create a research “workspace” for your agent to store memories and files across runs:

```bash
curl -X POST "https://chat.enso.sh/api/threads" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "metadata": {
      "assistant_id": "8e4db28c-be8f-4a44-92e7-b8ccd841d6cc",
      "title": "Daily Blog Research"
    }
  }'
```

The `thread_id` acts as your agent’s long-term context anchor.

## Step 7: Schedule Autonomous Runs

Let your agent run itself—forever—on a schedule, with full access to its memory:

```bash
curl -X POST "https://chat.enso.sh/api/schedules" \
  -H "Content-Type: application/json" \
  -H "x-api-key: enso_abc123..." \
  -d '{
    "title": "Daily Blog Post Generator",
    "trigger": {
      "type": "cron",
      "expression": "0 9 * * 1"
    },
    "task": {
      "input": {
        "messages": [
          {"role": "user", "content": "Write and publish a post about the latest AI news."}
        ]
      },
      "metadata": {
        "assistant_id": "8e4db28c-be8f-4a44-92e7-b8ccd841d6cc",
        "thread_id": "2727f69b-8acb-4c8b-a983-29d4fad7e9f5"
      }
    }
  }'
```

Orchestra will rerun your agent every Monday at 9am, with full thread memory.

---

## What’s Next: Filesystem Skills and Self-Hosting

Orchestra is adding persistent file systems and execution of user scripts—letting agents natively use Python “skills” and manage local data, _without_ wasting prompt tokens.

And for teams: our official self-hosted Docker image is now live! [Get it here.](https://github.com/ruska-ai/orchestra/pkgs/container/orchestra)

Ready to start? [Explore Orchestra on GitHub.](https://github.com/ruska-ai/orchestra)
