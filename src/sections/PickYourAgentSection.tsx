import type { IconType } from "react-icons";
import { FaCode, FaGithub, FaRobot, FaStar, FaTerminal } from "react-icons/fa";
import { SiOpenai, SiX } from "react-icons/si";
import { OPEN_HARNESS_REPO_URL } from "@/lib/github";

type Agent = {
  name: string;
  description: string;
  icon: IconType;
  iconClassName: string;
  tileClassName: string;
  unavailable?: boolean;
};

const agents: Agent[] = [
  {
    name: "Claude Code",
    description: "Anthropic's terminal coding agent.",
    icon: FaRobot,
    iconClassName: "text-orange-700 dark:text-orange-300",
    tileClassName: "bg-orange-100 dark:bg-orange-950/60",
  },
  {
    name: "Codex",
    description: "OpenAI's CLI coding agent.",
    icon: SiOpenai,
    iconClassName: "text-blue-700 dark:text-blue-300",
    tileClassName: "bg-blue-100 dark:bg-blue-950/60",
  },
  {
    name: "OpenCode",
    description: "Terminal agent with OpenAI OAuth support.",
    icon: FaTerminal,
    iconClassName: "text-foreground",
    tileClassName: "bg-muted",
  },
  {
    name: "Pi",
    description: "A lightweight, customizable agent.",
    icon: FaCode,
    iconClassName: "text-foreground",
    tileClassName: "bg-muted",
  },
  {
    name: "DeepAgents",
    description: "LangChain's multi-provider terminal agent.",
    icon: FaRobot,
    iconClassName: "text-cyan-700 dark:text-cyan-300",
    tileClassName: "bg-cyan-100 dark:bg-cyan-950/60",
  },
  {
    name: "Hermes",
    description: "Nous Research's self-improving agent CLI.",
    icon: FaTerminal,
    iconClassName: "text-violet-700 dark:text-violet-300",
    tileClassName: "bg-violet-100 dark:bg-violet-950/60",
  },
  {
    name: "Grok Build",
    description: "xAI's terminal coding agent and CLI.",
    icon: SiX,
    iconClassName: "text-foreground",
    tileClassName: "bg-muted",
  },
  {
    name: "T3 Code",
    description: "Browser UI over Claude/Codex/OpenCode (port 3773).",
    icon: FaCode,
    iconClassName: "text-green-700 dark:text-green-300",
    tileClassName: "bg-green-100 dark:bg-green-950/60",
  },
  {
    name: "OpenClaw",
    description: "Coming soon.",
    icon: FaRobot,
    iconClassName: "text-muted-foreground/60",
    tileClassName: "bg-muted/60",
    unavailable: true,
  },
];

export default function PickYourAgentSection({ stars }: { stars: number }) {
  const starCount = stars.toLocaleString("en-US");

  return (
    <section
      className="border-y border-border bg-muted/30 px-4 py-20 md:py-24"
      aria-labelledby="pick-your-agent-heading"
    >
      <div className="mx-auto max-w-6xl">
        <a
          href={OPEN_HARNESS_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open Harness on GitHub: ${starCount} GitHub stars`}
          className="mx-auto mb-16 flex max-w-5xl flex-col gap-4 rounded-xl border border-green-500/30 bg-card p-5 text-foreground transition-colors hover:border-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <FaGithub className="h-5 w-5 text-green-500" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-montserrat font-semibold">
                Open Harness on GitHub
              </span>
              <span className="block font-mono text-xs text-muted-foreground">
                mifunedev/openharness
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 font-montserrat text-sm text-muted-foreground sm:justify-end">
            <FaStar className="h-4 w-4 text-green-500" aria-hidden="true" />
            <strong className="text-lg text-foreground">{starCount}</strong>
            GitHub stars
          </span>
        </a>

        <div className="mb-10 text-center">
          <h2
            id="pick-your-agent-heading"
            className="font-montserrat text-3xl font-bold text-foreground md:text-4xl"
          >
            Pick your agent.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-montserrat text-base leading-relaxed text-muted-foreground md:text-lg">
            Claude Code, Codex, and Pi ship preinstalled. OpenCode, DeepAgents,
            Hermes, and Grok Build are opt-in image installs. Switch between
            them inside the sandbox — or add your own by editing the Dockerfile.
          </p>
        </div>

        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => {
            const Icon = agent.icon;

            return (
              <li
                key={agent.name}
                aria-label={
                  agent.unavailable
                    ? `${agent.name}, unavailable. ${agent.description}`
                    : undefined
                }
                className={`flex min-h-28 items-start gap-3 rounded-xl border p-4 ${
                  agent.unavailable
                    ? "border-border/60 bg-muted/30 text-muted-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${agent.tileClassName}`}
                  aria-hidden="true"
                >
                  <Icon className={`h-4 w-4 ${agent.iconClassName}`} />
                </span>
                <span className="min-w-0 pt-0.5">
                  <h3 className="font-montserrat text-sm font-semibold">
                    {agent.name}
                  </h3>
                  <p className="mt-1 font-montserrat text-xs leading-relaxed text-muted-foreground">
                    {agent.description}
                  </p>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
