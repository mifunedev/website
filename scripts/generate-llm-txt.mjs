#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LLM_TXT_CONTENT = `# Orchestra by Ruska AI

> AI Agent Orchestration Platform built on LangGraph

Orchestra is an AI agent orchestration platform that lets you create, deploy, and manage specialized AI agents that can access tools, collaborate with each other, and automate your workflows. Think of it as the operating system for your AI digital workforce.

## Website
- Homepage: https://ruska.ai
- App: https://chat.ruska.ai
- GitHub: https://github.com/ruska-ai/orchestra

## Core Features

### Projects
Organize AI work with context-aware document collections and semantic search.

### Assistants
Deploy specialized AI agents with MCP tools and A2A (Agent-to-Agent) communication.

### Threads
Manage persistent conversations with full history and checkpoints.

### Schedules
Automate agents to run on cron schedules for recurring tasks.

### Prompts
Build and share reusable system prompts for consistent agent behavior.

### Tools
Extensible MCP tool ecosystem for browser automation, file access, and more.

## Supported AI Models
- Anthropic Claude
- OpenAI GPT
- Google Gemini
- Groq
- xAI Grok
- Local models via Ollama

## Key Technologies
- MCP (Model Context Protocol): Open standard for AI agents to access external tools and data sources
- A2A (Agent-to-Agent): Enables agents to communicate and collaborate with each other
- LangGraph: Powers the agent execution runtime

## API Endpoints

### Tools
- POST /api/tools - Register a new tool
- POST /api/tools/invoke - Test a tool directly

### LLM
- POST /api/llm/invoke - Invoke LLM with tools
- POST /api/llm/stream - Stream agent responses

### Assistants
- POST /api/assistants - Create an assistant (agent spec)
- GET /api/assistants - List assistants
- GET /api/assistants/:id - Get assistant details

### Threads
- POST /api/threads - Create a persistent thread
- GET /api/threads - List threads
- GET /api/threads/:id - Get thread details

### Schedules
- POST /api/schedules - Create a scheduled task
- GET /api/schedules - List schedules

## Quick Start Example

Create an API tool:
\`\`\`bash
curl -X POST "https://chat.ruska.ai/api/tools" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "name": "my_tool",
    "description": "Tool description",
    "type": "api",
    "config": { ... }
  }'
\`\`\`

Create an assistant:
\`\`\`bash
curl -X POST "https://chat.ruska.ai/api/assistants" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "name": "my_assistant",
    "description": "Assistant description",
    "model": "openai:gpt-4",
    "tools": ["my_tool"]
  }'
\`\`\`

Stream an agent response:
\`\`\`bash
curl -X POST "https://chat.ruska.ai/api/llm/stream" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "input": {
      "messages": [{"role": "user", "content": "Your prompt here"}]
    },
    "metadata": {
      "assistant_id": "YOUR_ASSISTANT_ID"
    }
  }'
\`\`\`

## Social Links
- YouTube: https://www.youtube.com/@ruska-ai
- X/Twitter: https://x.com/ruska_ai
- GitHub: https://github.com/ruska-ai
- LinkedIn: https://www.linkedin.com/company/ruska-ai
- Slack: https://join.slack.com/t/ruska-ai/shared_invite/zt-3l2lnevo6-hOe5ZeoAz~xj7CFAJk2bzg

## Contact
For support and inquiries, visit https://ruska.ai or join our Slack community.

## Services - Automation as a Service

Ruska AI offers managed AI automation for small and medium businesses. We leverage tools including Claude Code, OpenClaw, and our Orchestra platform to build production-ready automation systems.

### What We Automate
- Customer Support
- Data Processing
- Lead Management
- Property Management
- Content Operations
- Internal Ops

### How It Works
1. Discovery Call (Free) - We assess your workflows and identify automation opportunities
2. Setup ($2,500 - $5,000) - We build your custom automation system
3. Retainer ($990 - $3,000/mo) - We maintain, improve, and add new automations

### Contact for Services
- Book a call: https://cal.com/ruska-ai/ai-audit
- Email: reggleston@ruska.ai
`;

function generateLlmTxt() {
  const outputPath = path.join(rootDir, 'public', 'llm.txt');

  // Ensure public directory exists
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, LLM_TXT_CONTENT, 'utf-8');
  console.log(`Generated llm.txt at ${outputPath}`);
}

generateLlmTxt();
