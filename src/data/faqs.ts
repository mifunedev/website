export interface Faq {
  question: string;
  answer: string;
}

/**
 * Homepage FAQ content. This is shared by the visible disclosure list and the
 * FAQPage JSON-LD so buyer-facing copy and structured data stay aligned.
 */
export const faqs: Faq[] = [
  {
    question: "What is Open Harness?",
    answer:
      "Open Harness is an Apache-2.0 licensed, isolated, persistent Docker workspace for coding agents. It keeps one project and its toolchain in one sandbox and supports Claude Code, Codex, Pi, and other opt-in agent CLIs.",
  },
  {
    question: "What problem does it solve?",
    answer:
      "Open Harness keeps project toolchains off your host and gives coding agents a workspace that persists between sessions. It can run locally or on a remote VM; remote agents can work unattended or on schedules and can be reachable over Slack. Isolated git worktrees support parallel branches and delegation.",
  },
  {
    question: "What does Mifune provide?",
    answer:
      "Mifune maintains the open-source Open Harness project, operates Open Harness Cloud as the managed path, and offers forward-deployed engineering support to Cloud customers.",
  },
  {
    question: "How do Open Harness Cloud and open source differ?",
    answer:
      "With Open Harness Cloud, Mifune operates the managed environment. With open source, your team can inspect and adapt Open Harness, then operate it locally or on a remote VM. Choose based on who should own the environment and review each destination for path-specific details.",
  },
  {
    question: "When should I use engineering support?",
    answer:
      "Forward-deployed support is optional for Open Harness Cloud customers who want Mifune engineers alongside their team to plan, implement, integrate, troubleshoot, or hand off a Cloud deployment.",
  },
  {
    question: "How do I start?",
    answer:
      "Open console.mifune.dev for the managed Cloud path. Visit github.com/mifunedev/openharness and read the docs at oh.mifune.dev for the self-hosted path. Email hello@mifune.dev to discuss engineering support for Cloud.",
  },
];
