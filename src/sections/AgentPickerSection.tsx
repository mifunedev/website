import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { OFFERING_URLS } from "@/config/offerings";
import { getFlagshipRepos } from "@/lib/github";

const DOCS_BASE_URL = "https://agro.mifune.dev";

type Agent = {
  name: string;
  description: string;
  docsPath?: string;
  logo:
    | "claude-code"
    | "codex"
    | "opencode"
    | "pi"
    | "deepagents"
    | "hermes"
    | "grok-build"
    | "t3-code"
    | "openclaw";
};

const agents: Agent[] = [
  {
    name: "Claude Code",
    description: "Anthropic's terminal coding agent.",
    docsPath: "/docs/harnesses/claude-code",
    logo: "claude-code",
  },
  {
    name: "Codex",
    description: "OpenAI's CLI coding agent.",
    docsPath: "/docs/harnesses/codex",
    logo: "codex",
  },
  {
    name: "OpenCode",
    description: "Terminal agent with OpenAI OAuth support.",
    docsPath: "/docs/harnesses/opencode",
    logo: "opencode",
  },
  {
    name: "Pi",
    description: "A lightweight, customizable agent.",
    docsPath: "/docs/harnesses/pi",
    logo: "pi",
  },
  {
    name: "DeepAgents",
    description: "LangChain's multi-provider terminal agent.",
    docsPath: "/docs/harnesses/deepagents",
    logo: "deepagents",
  },
  {
    name: "Hermes",
    description: "Nous Research's self-improving agent CLI.",
    docsPath: "/docs/harnesses/hermes",
    logo: "hermes",
  },
  {
    name: "Grok Build",
    description: "xAI's terminal coding agent and CLI.",
    docsPath: "/docs/harnesses/grok-build",
    logo: "grok-build",
  },
  {
    name: "T3 Code",
    description: "Browser UI over Claude/Codex/OpenCode (port 3773).",
    docsPath: "/docs/harnesses/t3code",
    logo: "t3-code",
  },
  {
    name: "OpenClaw",
    description: "Coming soon.",
    logo: "openclaw",
  },
];

const imageLogos = {
  "claude-code": "/brand/agents/claude-code.png",
  codex: "/brand/agents/codex.png",
  deepagents: "/brand/agents/deepagents.png",
  hermes: "/brand/agents/hermes.ico",
  "grok-build": "/brand/agents/grok-build.ico",
  "t3-code": "/brand/agents/t3-code.png",
} as const;

function AgentLogo({ logo }: { logo: Agent["logo"] }) {
  if (logo in imageLogos) {
    return (
      <Image
        src={imageLogos[logo as keyof typeof imageLogos]}
        alt=""
        width={28}
        height={28}
        unoptimized
        className="h-7 w-7 object-contain"
      />
    );
  }

  if (logo === "opencode") {
    return (
      <svg
        viewBox="0 0 28 28"
        width="28"
        height="28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <rect
          x="3"
          y="3"
          width="22"
          height="22"
          rx="5"
          fill="currentColor"
          opacity="0.14"
        />
        <path
          fill="currentColor"
          d="M8 14c0-3.6 2.5-6.2 6-6.2s6 2.6 6 6.2-2.5 6.2-6 6.2-6-2.6-6-6.2Zm3.1 0c0 2 1.1 3.4 2.9 3.4s2.9-1.4 2.9-3.4-1.1-3.4-2.9-3.4-2.9 1.4-2.9 3.4Z"
        />
      </svg>
    );
  }

  if (logo === "pi") {
    return (
      <svg
        viewBox="0 0 800 800"
        width="28"
        height="28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"
        />
        <path fill="currentColor" d="M517.36 400 H634.72 V634.72 H517.36 Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 28 28"
      width="28"
      height="28"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <rect
        x="3"
        y="3"
        width="22"
        height="22"
        rx="5"
        fill="currentColor"
        opacity="0.14"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.5 8.2c1.4 1.6 1.9 3.6 1.5 6.1" />
        <path d="M14 7.6c1.5 1.8 2 4 1.6 6.8" />
        <path d="M18.5 8.2c1.4 1.6 1.9 3.6 1.5 6.1" />
        <path d="M9 18.4c1.7 1.6 3.2 2.4 5 2.4s3.3-.8 5-2.4" />
      </g>
    </svg>
  );
}

export default async function AgentPickerSection() {
  const openHarnessRepo = (await getFlagshipRepos()).find(
    (repo) => repo.fullName === "mifunedev/agro",
  );
  const starCount = openHarnessRepo?.starsVerified
    ? openHarnessRepo.stars.toLocaleString("en-US")
    : "Count unavailable";

  return (
    <section
      id="agents"
      className="relative scroll-mt-20 overflow-hidden border-y border-border bg-card/25 px-4 py-20 sm:py-24"
      aria-labelledby="pick-your-agent-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative mx-auto max-w-6xl">
        <aside
          className="grid min-w-0 gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] lg:items-center"
          aria-labelledby="open-source-signal-heading"
        >
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
              OPEN SOURCE SIGNAL
            </p>
            <h2
              id="open-source-signal-heading"
              className="mt-3 text-balance font-montserrat text-2xl font-bold leading-tight text-foreground sm:text-3xl"
            >
              Help more agent builders find Open Harness.
            </h2>
            <p className="mt-3 max-w-3xl font-montserrat text-sm leading-relaxed text-muted-foreground sm:text-base">
              If the sandbox model saves you from one broken local agent setup,
              star the repo so the next Claude Code, Codex, OpenCode, or Hermes
              user can find it faster.
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-background/70 p-5 shadow-sm">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              GITHUB STARS
            </p>
            <p className="mt-2 flex min-w-0 items-center gap-2 font-montserrat text-4xl font-bold tracking-tight text-foreground">
              <FaStar
                className="h-7 w-7 shrink-0 text-green-500"
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">{starCount}</span>
            </p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              mifunedev/agro
            </p>
            <a
              href={OFFERING_URLS.openSource}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-md font-montserrat text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
            >
              Star on GitHub →
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </aside>

        <div className="mx-auto mb-10 mt-20 max-w-4xl text-center">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
            SUPPORTED HARNESSES
          </p>
          <h2
            id="pick-your-agent-heading"
            className="text-balance font-montserrat text-3xl font-bold text-foreground sm:text-4xl"
          >
            Pick your agent.
          </h2>
          <p className="mx-auto mt-4 font-montserrat text-base leading-relaxed text-muted-foreground sm:text-lg">
            Claude Code, Codex, and Pi ship preinstalled. OpenCode, DeepAgents,
            Hermes, and Grok Build are opt-in image installs. Switch between
            them inside the sandbox — or add your own by editing the Dockerfile.
          </p>
        </div>

        <ul
          className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4"
          aria-labelledby="pick-your-agent-heading"
        >
          {agents.map((agent) => (
            <li key={agent.name} className="min-w-0">
              {agent.docsPath ? (
                <a
                  href={`${DOCS_BASE_URL}${agent.docsPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full min-h-28 min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 text-foreground transition-colors hover:border-green-500/50 hover:bg-green-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background/70 text-green-500"
                    aria-hidden="true"
                  >
                    <AgentLogo logo={agent.logo} />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <h3 className="break-words font-montserrat text-sm font-semibold text-current transition-colors group-hover:text-oh-accent">
                      {agent.name}
                    </h3>
                    <p className="mt-1 break-words font-montserrat text-xs leading-relaxed text-muted-foreground">
                      {agent.description}
                    </p>
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              ) : (
                // The docs reference uses a deliberately noninteractive disabled card.
                // eslint-disable-next-line jsx-a11y/role-supports-aria-props
                <article
                  aria-disabled="true"
                  className="flex h-full min-h-28 min-w-0 cursor-default items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4 text-muted-foreground opacity-60"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60"
                    aria-hidden="true"
                  >
                    <AgentLogo logo={agent.logo} />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <h3 className="break-words font-montserrat text-sm font-semibold text-current">
                      {agent.name}
                    </h3>
                    <p className="mt-1 break-words font-montserrat text-xs leading-relaxed text-muted-foreground">
                      {agent.description}
                    </p>
                  </span>
                </article>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
