import Image from "next/image";

const DOCS_BASE_URL = "https://agro.mifune.dev";

type Agent = {
  name: string;
  description: string;
  docsPath?: string;
  docsUrl?: string;
  logo:
    | "claude-code"
    | "codex"
    | "opencode"
    | "pi"
    | "hermes"
    | "grok-build"
    | "muse-code"
    | "antigravity-cli"
    | "fx"
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
    name: "Hermes",
    description: "Nous Research's self-improving agent CLI.",
    docsPath: "/docs/harnesses/hermes",
    logo: "hermes",
  },
  {
    name: "OpenClaw",
    description: "Gateway-first personal agent runtime.",
    docsPath: "/docs/harnesses/openclaw",
    logo: "openclaw",
  },
  {
    name: "Grok Build",
    description: "xAI's terminal coding agent and CLI.",
    docsPath: "/docs/harnesses/grok-build",
    logo: "grok-build",
  },
  {
    name: "Muse Code",
    description: "Meta's terminal coding agent.",
    docsPath: "/docs/harnesses/muse-code",
    logo: "muse-code",
  },
  {
    name: "Antigravity CLI",
    description: "Google's terminal coding agent.",
    docsPath: "/docs/harnesses/antigravity-cli",
    logo: "antigravity-cli",
  },
  {
    name: "fx",
    description: "Vercel Labs' native coding agent (experimental).",
    docsUrl: "https://github.com/mifunedev/agro/blob/main/docs/harnesses/fx.md",
    logo: "fx",
  },
  {
    name: "T3 Code",
    description: "Browser UI over Claude/Codex/OpenCode (port 3773).",
    docsPath: "/docs/harnesses/t3code",
    logo: "t3-code",
  },
];

const imageLogos = {
  "claude-code": "/brand/agents/claude-code.png",
  codex: "/brand/agents/codex.png",
  hermes: "/brand/agents/hermes.ico",
  "grok-build": "/brand/agents/grok-build.ico",
  "t3-code": "/brand/agents/t3-code.png",
  "muse-code": "/brand/agents/muse-code.ico",
  "antigravity-cli": "/brand/agents/antigravity-cli.png",
  fx: "/brand/agents/fx.png",
  openclaw: "/brand/agents/openclaw.png",
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
        viewBox="0 6 24 30"
        width="28"
        height="28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-7 w-7 text-foreground"
      >
        <path fill="currentColor" opacity="0.3" d="M18 30H6V18H18V30Z" />
        <path fill="currentColor" d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" />
      </svg>
    );
  }

  if (logo === "pi") {
    return (
      <svg
        viewBox="140 140 520 520"
        width="28"
        height="28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path fill="#F09082" d="M165.29 165.29H517.36V400H400V282.65H165.29Z" />
        <path
          fill="#4D9ABF"
          d="M165.29 282.65H282.65V400H400V517.36H282.65V634.72H165.29Z"
        />
        <path fill="#F1BE58" d="M517.36 400H634.72V634.72H517.36Z" />
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

export default function AgentPickerSection() {
  return (
    <section
      id="agents"
      className="relative scroll-mt-20 overflow-hidden border-y border-border bg-card/25 px-4 py-20 sm:py-24"
      aria-labelledby="pick-your-agent-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-4xl text-center">
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
            The workspace starts with no agent. Run{" "}
            <code className="font-mono text-sm text-foreground">
              agro harness install &lt;id&gt;
            </code>{" "}
            to add Claude Code, Codex, Pi, or another harness, then switch
            between them inside the workspace.
          </p>
        </div>

        <ul
          className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4"
          aria-labelledby="pick-your-agent-heading"
        >
          {agents.map((agent) => (
            <li key={agent.name} className="min-w-0">
              {agent.docsPath || agent.docsUrl ? (
                <a
                  href={agent.docsUrl ?? `${DOCS_BASE_URL}${agent.docsPath}`}
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
