---
title: "How to Configure Anthropic Extended Thinking (Reasoning) in Langchain init_chat_model"
date: "2025-12-30"
excerpt: "A complete guide to enabling Claude's extended thinking mode in Langchain, persisting reasoning blocks in LangGraph checkpoints, and exporting them to disk. Includes working code examples."
categories: ["How-To", "Langchain", "Anthropic", "Extended Thinking", "LangGraph"]
coverImage: "https://github.com/ruska-ai/static/blob/master/blog/reasoning.png?raw=true"
author:
  name: "Ryan Eggleston"
  picture: "https://avatars.githubusercontent.com/u/40816745?s=96&v=4"
  linkedin: https://www.linkedin.com/in/ryan-eggleston
---

Anthropic's Claude models support **extended thinking**—a feature that exposes the model's step-by-step reasoning process before it produces a final answer. This guide shows you how to enable extended thinking in Langchain using `init_chat_model`, persist reasoning blocks in LangGraph state, and export them to disk.

This is especially useful for:

- **Debugging agent behavior** — See exactly how Claude reasoned through a problem
- **Audit trails** — Capture and store the reasoning chain for compliance or review
- **Chain-of-thought visibility** — Give users insight into how the AI reached its conclusion
- **Building better prompts** — Understand model reasoning to improve future interactions

---

## What is Extended Thinking?

Extended thinking is Anthropic's name for explicit chain-of-thought reasoning. When enabled, Claude returns two types of content blocks:

1. **Reasoning blocks** — The model's internal reasoning process (type: `"thinking"`)
2. **Text blocks** — The final answer (type: `"text"`)

Without extended thinking, you only get the final answer. With it, you get the full reasoning chain.

---

## Prerequisites

- Python 3.10+
- `langchain` and `langchain-anthropic` installed
- An Anthropic API key (set as `ANTHROPIC_API_KEY`)
- (Optional) `langgraph` for state persistence

```bash
pip install langchain langchain-anthropic langgraph
```

---

## Step 1: Enable Extended Thinking with init_chat_model

The `init_chat_model` function provides a unified interface for initializing chat models. To enable extended thinking, pass the `thinking` parameter:

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "anthropic:claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
)
```

### Parameter Breakdown

| Parameter | Description |
|-----------|-------------|
| `model` | The model identifier in `provider:model_name` format |
| `max_tokens` | Maximum tokens for the response (must be > budget_tokens) |
| `thinking.type` | Set to `"enabled"` to activate extended thinking |
| `thinking.budget_tokens` | Token budget for the reasoning phase |

> **Important:** `max_tokens` must be greater than `budget_tokens`. The model uses the budget for reasoning, then the remainder for the final response.

---

## Step 2: Invoke the Model and Access Reasoning

When you invoke the model, the response includes both reasoning and text blocks:

```python
from langchain_core.messages import HumanMessage

response = model.invoke([
    HumanMessage(content="What is 17 * 19? Show your work.")
])

# Access the full content blocks
for block in response.content:
    if isinstance(block, dict):
        if block.get("type") == "thinking":
            print("REASONING:", block.get("thinking"))
        elif block.get("type") == "text":
            print("ANSWER:", block.get("text"))
```

### Example Output

```
REASONING: Let me calculate 17 * 19 step by step.
I can break this down as:
17 * 19 = 17 * (20 - 1)
       = 17 * 20 - 17 * 1
       = 340 - 17
       = 323

ANSWER: 17 * 19 = 323
```

---

## Step 3: Persist Reasoning in LangGraph State

To persist reasoning blocks across agent runs, add a `reasoning` channel to your LangGraph state:

```python
from typing import Annotated
from typing_extensions import TypedDict
from operator import add

class State(TypedDict):
    messages: list
    reasoning: Annotated[list[str], add]  # Append-only list
```

The `Annotated[list[str], add]` pattern ensures that each node's reasoning output appends to the existing list rather than replacing it.

---

## Step 4: Extract Reasoning in a Node

Create a node that invokes the model and extracts reasoning blocks:

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "anthropic:claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
)

def call_model(state: State):
    """Invoke the model and extract reasoning blocks."""
    ai_msg = model.invoke(state["messages"])

    # Extract reasoning from content blocks
    reasoning_blocks = []
    for block in ai_msg.content:
        if isinstance(block, dict) and block.get("type") == "thinking":
            reasoning_blocks.append(block.get("thinking", ""))

    return {
        "messages": [ai_msg],
        "reasoning": reasoning_blocks,
    }
```

---

## Step 5: Compile the Graph with a Checkpointer

Use a checkpointer to persist state across runs:

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

# Build the graph
workflow = StateGraph(State)
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")
workflow.add_edge("model", END)

# Compile with checkpointer
graph = workflow.compile(checkpointer=InMemorySaver())
```

---

## Step 6: Run the Graph with a Thread ID

Execute the graph with a `thread_id` to enable state persistence:

```python
config = {"configurable": {"thread_id": "reasoning-demo-1"}}

result = graph.invoke(
    {
        "messages": [{"role": "user", "content": "Compute 17 * 19"}],
        "reasoning": []
    },
    config
)

print("Final messages:", result["messages"])
print("Captured reasoning:", result["reasoning"])
```

---

## Step 7: Retrieve Persisted Reasoning

After the run completes, retrieve the persisted state:

```python
# Get the current state
snapshot = graph.get_state({"configurable": {"thread_id": "reasoning-demo-1"}})
print("Persisted reasoning:", snapshot.values["reasoning"])

# Get full state history
history = list(graph.get_state_history({"configurable": {"thread_id": "reasoning-demo-1"}}))
for state in history:
    print(f"Step: {state.metadata.get('step')}, Reasoning: {state.values.get('reasoning')}")
```

---

## Step 8: Export Reasoning to Disk

Export the complete thread state to a JSON file for archival or analysis:

```python
import json
from pathlib import Path

snapshot = graph.get_state({"configurable": {"thread_id": "reasoning-demo-1"}})

export_data = {
    "thread_id": "reasoning-demo-1",
    "values": {
        "reasoning": snapshot.values.get("reasoning", []),
        # Serialize messages (AIMessage objects need conversion)
        "messages": [
            {
                "role": getattr(msg, "type", "unknown"),
                "content": str(msg.content) if hasattr(msg, "content") else str(msg)
            }
            for msg in snapshot.values.get("messages", [])
        ]
    },
    "metadata": snapshot.metadata,
    "created_at": str(snapshot.created_at) if snapshot.created_at else None,
}

Path("reasoning_export.json").write_text(json.dumps(export_data, indent=2, default=str))
print("Exported to reasoning_export.json")
```

---

## Complete Working Example

Here's the full code in one place:

```python
import json
from pathlib import Path
from typing import Annotated
from typing_extensions import TypedDict
from operator import add

from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver


# Define state with reasoning channel
class State(TypedDict):
    messages: list
    reasoning: Annotated[list[str], add]


# Initialize model with extended thinking
model = init_chat_model(
    "anthropic:claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
)


def call_model(state: State):
    """Invoke model and extract reasoning."""
    ai_msg = model.invoke(state["messages"])

    reasoning_blocks = []
    for block in ai_msg.content:
        if isinstance(block, dict) and block.get("type") == "thinking":
            reasoning_blocks.append(block.get("thinking", ""))

    return {
        "messages": [ai_msg],
        "reasoning": reasoning_blocks,
    }


# Build and compile graph
workflow = StateGraph(State)
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")
workflow.add_edge("model", END)
graph = workflow.compile(checkpointer=InMemorySaver())


# Run with thread persistence
config = {"configurable": {"thread_id": "t1"}}
result = graph.invoke(
    {"messages": [{"role": "user", "content": "Compute 17 * 19"}], "reasoning": []},
    config
)

# Retrieve and export
snapshot = graph.get_state(config)
export_data = {
    "thread_id": "t1",
    "reasoning": snapshot.values.get("reasoning", []),
    "created_at": str(snapshot.created_at),
}
Path("reasoning_export.json").write_text(json.dumps(export_data, indent=2))
print("Done! Check reasoning_export.json")
```

---

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| No reasoning blocks returned | Ensure `thinking.type` is `"enabled"`, not `"disabled"` |
| `max_tokens` error | Set `max_tokens` higher than `budget_tokens` |
| Empty reasoning list | Check that you're iterating over `ai_msg.content`, not `ai_msg.content_blocks` |
| Model doesn't support thinking | Use a compatible model like `claude-sonnet-4-5-20250929` or newer |
| Serialization errors | Use `default=str` in `json.dumps()` for non-serializable objects |

---

## When to Use Extended Thinking

**Use it when:**
- Debugging complex agent behavior
- Building explainable AI systems
- Creating audit trails for regulated industries
- Developing educational or tutoring applications
- Optimizing prompts based on model reasoning

**Skip it when:**
- Latency is critical (thinking adds overhead)
- You only need the final answer
- Token budget is very constrained

---

## Next Steps

- **Add tool use** — Combine extended thinking with LangGraph tools for explainable agent actions
- **Use persistent checkpointers** — Replace `InMemorySaver` with PostgreSQL or SQLite for production
- **Stream reasoning** — Display reasoning in real-time to users
- **Analyze patterns** — Mine reasoning exports to improve prompts and model performance

---

## Start Building

Orchestra supports extended thinking out of the box. Try it today at [chat.ruska.ai](https://chat.ruska.ai).

[Build Now](https://chat.ruska.ai) | [GitHub](https://github.com/ruska-ai/orchestra) | [Docs](https://docs.ruska.ai)
