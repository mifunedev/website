import { Box, GitBranch, Laptop } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";

const outcomes = [
  {
    icon: Box,
    title: "Isolation by default",
    description:
      "Keep one project and its toolchain in one Docker sandbox instead of installing project dependencies on your host.",
  },
  {
    icon: Laptop,
    title: "Local or remote",
    description:
      "Use the same persistent workspace locally or on a remote VM, with your preferred coding agent inside it.",
  },
  {
    icon: GitBranch,
    title: "Worktrees for parallel work",
    description:
      "Use isolated git worktrees for parallel branches and delegated work without mixing their working directories.",
  },
];

const agents = ["Claude Code", "Codex", "Pi", "Other CLI"];

export default function OpenHarnessValueSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-oh-rule bg-oh-paper px-4 py-20 text-oh-ink sm:py-24"
      aria-labelledby="openharness-value-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--oh-rule)_1px,transparent_1px),linear-gradient(to_bottom,var(--oh-rule)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      <div className="relative mx-auto max-w-6xl">
        <OpenHarnessBrandBar
          density="card"
          context="OPEN SOURCE · MAINTAINED BY MIFUNE"
          className="mb-12 border-b border-oh-rule pb-5 text-oh-ink"
        />

        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
            PORTABLE AGENT HARNESS
          </p>
          <h2
            id="openharness-value-heading"
            className="text-balance font-montserrat text-4xl font-bold leading-tight tracking-tight text-oh-ink sm:text-5xl"
          >
            One repo. One sandbox.
          </h2>
          <p className="mt-5 font-montserrat text-lg leading-relaxed text-oh-muted">
            Open Harness is the portable layer between your repository and your
            coding agent. The repository defines one isolated, persistent Docker
            workspace, so the agent gets a consistent environment and your
            machine stays clean.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <article
                key={outcome.title}
                className="rounded-2xl border border-oh-rule bg-oh-raised p-6 text-oh-ink"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-oh-rule bg-oh-paper">
                  <Icon className="h-5 w-5 text-oh-accent" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-montserrat text-xl font-semibold text-oh-ink">
                  {outcome.title}
                </h3>
                <p className="mt-3 font-montserrat text-sm leading-relaxed text-oh-muted">
                  {outcome.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex min-w-0 flex-col gap-4 border-y border-oh-rule py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="shrink-0 font-montserrat text-lg font-bold text-oh-ink">
            Pick your agent.
          </p>
          <ul className="flex min-w-0 flex-wrap gap-x-5 gap-y-3 font-mono text-xs text-oh-muted sm:justify-end sm:text-sm">
            {agents.map((agent) => (
              <li key={agent}>{agent}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
