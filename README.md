This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment variables

See the [canonical environment-variable guide](./docs/environment-variables.md) before starting local development.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Blog Roadmap

#### How to Pre-Configure files for Deep Agents  

```py
from deepagents import create_deep_agent
from deepagents.middleware.filesystem import FilesystemMiddleware  
from deepagents.backends.utils import create_file_data  
from deepagents.backends.state import StateBackend  
from langchain.tools import ToolRuntime
from langchain.chat_models import init_chat_model
from langgraph.store.memory import InMemoryStore  

# Pre-configure files  
initial_files = {  
	"/project/README.md": create_file_data("# My Project\n\nInitial documentation."),  
	"/project/src/app.py": create_file_data("def main():\n    print('Hello!')")  
}  

# Create runtime with pre-populated state  
runtime = ToolRuntime(  
	state={"messages": [], "files": initial_files},  
	context=None,  
	tool_call_id="tc",  
	store=InMemoryStore(),  
	stream_writer=lambda _: None,  
	config={},  
)  

# Create backend with pre-configured files  
backend = StateBackend(runtime)
model = init_chat_model(model="openai:gpt-4.1-mini")
agent = create_deep_agent(backend=backend, model=model)
input = {
	"messages": [{"role": "user", "content": "List the project files."}],
	"files": initial_files,
}
for chunk in agent.stream(  
	input,  
	config={"configurable": {"thread_id": "openai"}},  # Dual-mode for HITL support  
	stream_mode=["values"],

): 
	if "messages" in chunk:
		chunk["messages"][-1].pretty_print()
```