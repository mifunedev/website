import {
  Check,
  Cloud,
  Code2,
  ExternalLink,
  GitBranch,
  Mail,
  PanelsTopLeft,
  Settings,
  Waypoints,
} from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import TopNavBar from "@/components/nav/TopNavBar";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/app";
import { OFFERING_URLS } from "@/config/offerings";
import { breadcrumbSchema, supportServiceSchema } from "@/lib/schema";
import FooterSection from "@/sections/FooterSection";

const supportAreas = [
  {
    icon: Waypoints,
    title: "Deployment planning",
    description:
      "Translate your workflow, constraints, environment, and access needs into a practical Open Harness Cloud deployment plan.",
    bullets: [
      "Workflow and constraint review",
      "Environment and access planning",
      "Implementation sequence",
    ],
  },
  {
    icon: Code2,
    title: "Implementation and integration",
    description:
      "Bring Mifune engineers alongside your team for hands-on implementation work connected to Open Harness Cloud.",
    bullets: [
      "Open Harness implementation",
      "System and workflow integration",
      "Deployment configuration",
    ],
  },
  {
    icon: Settings,
    title: "Troubleshooting and handoff",
    description:
      "Work through deployment problems with Mifune, then leave your team with an agreed operating plan and handoff.",
    bullets: [
      "Deployment troubleshooting",
      "Operational workflow guidance",
      "Team handoff",
    ],
  },
];

const engagementSteps = [
  {
    step: "01",
    title: "Share your workflow and constraints",
    description:
      "Tell Mifune how your team works, where Open Harness Cloud should fit, and what environment, access, or integration constraints matter.",
  },
  {
    step: "02",
    title: "Agree on the scope",
    description:
      "Choose the planning, implementation, integration, troubleshooting, or handoff work Mifune engineers will take on alongside your team.",
  },
  {
    step: "03",
    title: "Plan, implement, and hand off",
    description:
      "Work through the agreed Cloud deployment scope together. You do not need an established deployment before the conversation starts.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={supportServiceSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Mifune", url: SITE_URL },
          {
            name: "Open Harness Cloud Engineering Support",
            url: `${SITE_URL}/services`,
          },
        ])}
      />
      <header>
        <TopNavBar />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="scroll-mt-20 bg-background"
      >
        <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_90%_60%_at_50%_0%,#000_65%,transparent_100%)]" />
          <div className="absolute left-1/2 top-1/4 h-[28rem] w-[min(50rem,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/15 blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-oh-accent">
                Mifune Engineering | Open Harness Cloud
              </p>
              <OpenHarnessBrandBar
                density="compact"
                context="FOR CLOUD · MIFUNE ENGINEERING"
                className="mx-auto mb-6 w-fit text-foreground lg:mx-0"
              />
              <h1 className="text-balance font-montserrat text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Adopt Open Harness Cloud with Mifune engineers{" "}
                <span className="font-space text-oh-accent">
                  alongside your team.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground lg:mx-0 lg:text-xl">
                Support is useful when your team wants help translating its
                workflow and constraints into a Cloud deployment, integrating
                current systems, troubleshooting adoption, or preparing a clear
                handoff.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <a
                  href={OFFERING_URLS.supportContact}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-oh-solid px-7 py-3 font-montserrat text-base font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Discuss your Cloud deployment
                </a>
                <a
                  href={OFFERING_URLS.cloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-7 py-3 font-montserrat text-base font-medium text-foreground transition-colors hover:border-green-500/50 hover:bg-green-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Explore Open Harness Cloud
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <p className="mt-7 font-montserrat text-sm leading-relaxed text-muted-foreground">
                For Cloud customers · No established deployment required ·{" "}
                <a
                  href={OFFERING_URLS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
                >
                  Read the Open Harness docs
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
            </div>

            <figure
              className="relative mx-auto w-full min-w-0 max-w-xl"
              aria-labelledby="support-workflow-caption"
            >
              <div className="absolute -inset-6 rounded-3xl bg-green-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl backdrop-blur-sm">
                <div className="flex min-h-11 min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500"
                      aria-hidden="true"
                    />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500"
                      aria-hidden="true"
                    />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <span className="ml-1 truncate font-mono text-[11px] text-muted-foreground sm:text-sm">
                      ~/open-harness — support-workflow
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-oh-accent">
                    Optional
                  </span>
                </div>
                <div className="space-y-3 p-4 sm:p-6">
                  {[
                    {
                      icon: PanelsTopLeft,
                      label: "Your workflow and constraints",
                      detail: "Share goals, environment, and integration needs",
                    },
                    {
                      icon: Waypoints,
                      label: "Agreed engineering scope",
                      detail: "Choose where Mifune works alongside your team",
                    },
                    {
                      icon: Cloud,
                      label: "Cloud deployment work",
                      detail: "Plan, implement, troubleshoot, and hand off",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label}>
                        <div
                          className={`flex items-center gap-4 rounded-xl border p-4 ${
                            index === 0
                              ? "border-green-500/40 bg-green-500/10"
                              : "border-border bg-background/60"
                          }`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10">
                            <Icon
                              className="h-4 w-4 text-oh-accent"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-montserrat text-sm font-semibold text-foreground">
                              {item.label}
                            </p>
                            <p className="mt-0.5 font-montserrat text-xs leading-relaxed text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                        {index < 2 ? (
                          <div className="ml-8 h-3 w-px bg-border" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border bg-background/40 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-6 sm:text-xs">
                  YOUR TEAM + MIFUNE ENGINEERING
                </div>
              </div>
              <figcaption id="support-workflow-caption" className="sr-only">
                Open Harness Cloud engineering support begins with your workflow
                and constraints, moves through an agreed scope, and continues
                through planning, implementation, troubleshooting, and handoff.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="px-4 py-24" aria-labelledby="support-scope-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-[0.22em] text-oh-accent">
                Support scope
              </p>
              <h2
                id="support-scope-heading"
                className="text-balance font-montserrat text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl"
              >
                Use support when Cloud adoption needs hands-on engineering.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
                Bring Mifune in when your team needs help turning constraints
                into a plan, integrating Open Harness Cloud, troubleshooting the
                deployment, or preparing a handoff.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {supportAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <article
                    key={area.title}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-7"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10">
                      <Icon
                        className="h-5 w-5 text-oh-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-montserrat text-xl font-semibold text-foreground">
                      {area.title}
                    </h3>
                    <p className="mt-3 flex-1 font-montserrat text-sm leading-relaxed text-muted-foreground">
                      {area.description}
                    </p>
                    <ul className="mt-6 space-y-3 border-t border-border pt-5">
                      {area.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 font-montserrat text-sm text-muted-foreground"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-oh-accent"
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="border-y border-border bg-card/40 px-4 py-24"
          aria-labelledby="relationship-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-[0.22em] text-oh-accent">
                How the offering fits together
              </p>
              <h2
                id="relationship-heading"
                className="text-balance font-montserrat text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Cloud is managed. Open source is self-hosted. Support adds
                Mifune engineering.
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
              <article className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6">
                <OpenHarnessBrandBar
                  density="card"
                  context="CLOUD · MANAGED BY MIFUNE"
                  className="mb-6 border-b border-green-500/30 pb-4 text-foreground"
                />
                <Cloud className="h-6 w-6 text-oh-accent" aria-hidden="true" />
                <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-oh-accent">
                  Primary managed path
                </p>
                <h3 className="mt-2 font-montserrat text-2xl font-semibold text-foreground">
                  Open Harness Cloud
                </h3>
                <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
                  An isolated, persistent coding-agent workspace with Mifune
                  operating the managed environment.
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6">
                <OpenHarnessBrandBar
                  density="card"
                  context="OPEN SOURCE · MAINTAINED BY MIFUNE"
                  className="mb-6 border-b border-border pb-4 text-foreground"
                />
                <GitBranch
                  className="h-6 w-6 text-oh-accent"
                  aria-hidden="true"
                />
                <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-oh-accent">
                  Self-hosted path
                </p>
                <h3 className="mt-2 font-montserrat text-2xl font-semibold text-foreground">
                  Open Harness Open Source
                </h3>
                <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
                  The MIT-licensed project for teams that want to inspect,
                  adapt, and operate Open Harness locally or on a remote VM.
                </p>
              </article>
            </div>

            <aside className="mt-4 rounded-2xl border border-border bg-background p-5 sm:p-6">
              <OpenHarnessBrandBar
                density="compact"
                context="FOR CLOUD · MIFUNE ENGINEERING"
                className="mb-4 text-foreground"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-oh-accent">
                    Optional for Cloud customers
                  </p>
                  <h3 className="mt-2 font-montserrat text-lg font-semibold text-foreground">
                    Mifune-led engineering support
                  </h3>
                </div>
                <p className="max-w-2xl font-montserrat text-sm leading-relaxed text-muted-foreground sm:text-right">
                  Add Mifune engineers for an agreed planning, implementation,
                  integration, troubleshooting, or handoff scope.
                </p>
              </div>
            </aside>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={OFFERING_URLS.cloud}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-oh-solid px-6 py-3 font-montserrat text-sm font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                Explore Open Harness Cloud
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={OFFERING_URLS.openSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-montserrat text-sm font-semibold text-foreground transition-colors hover:border-green-500/50 hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                Explore Open Harness on GitHub
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-24" aria-labelledby="engagement-heading">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-[0.22em] text-oh-accent">
                Engage support
              </p>
              <h2
                id="engagement-heading"
                className="font-montserrat text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Begin with your workflow and constraints.
              </h2>
            </div>

            <ol className="grid gap-5 md:grid-cols-3">
              {engagementSteps.map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <span className="font-mono text-sm font-semibold text-oh-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-montserrat text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 pb-24 pt-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-card p-8 text-center sm:p-12 md:p-16">
            <p className="font-montserrat text-sm font-medium uppercase tracking-[0.22em] text-oh-accent">
              Mifune engineering
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance font-montserrat text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Discuss your Open Harness Cloud deployment.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
              Share the workflow, constraints, or deployment work where your
              team wants Mifune engineers alongside it. We will agree on the
              scope before work begins.
            </p>
            <a
              href={OFFERING_URLS.supportContact}
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-oh-solid px-7 py-3 font-montserrat text-base font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Discuss your Cloud deployment
            </a>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
