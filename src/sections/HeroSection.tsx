import { ExternalLink, Headphones } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import { OFFERING_URLS } from "@/config/offerings";

const terminalRows = [
  ["PROJECT", "one connected repository"],
  ["SANDBOX", "isolated · persistent · Docker"],
  ["AGENT", "your preferred coding CLI"],
  ["OPERATOR", "Mifune-managed Cloud or self-hosted"],
] as const;

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-16 pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_90%_60%_at_50%_0%,#000_65%,transparent_100%)]" />
      <div className="absolute left-1/2 top-1/4 h-[28rem] w-[min(50rem,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto my-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <OpenHarnessBrandBar
            density="hero"
            status="Maintained by Mifune"
            className="mx-auto mb-7 w-fit justify-center text-foreground lg:mx-0 lg:justify-start"
          />

          <h1 className="mb-6 text-balance font-montserrat text-4xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Run coding agents in a sandbox, not on your machine.
          </h1>

          <p className="mx-auto mb-8 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground lg:mx-0 lg:text-xl">
            Open Harness connects one repository to an isolated, persistent
            Docker workspace. Bring your preferred coding agent, keep its
            toolchain off your host, then self-host it or choose Mifune-managed
            Open Harness Cloud.
          </p>

          <div className="mb-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <a
              href={OFFERING_URLS.cloud}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-oh-solid px-7 py-3 text-center font-montserrat text-base font-semibold text-black shadow-lg transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open Mifune Cloud Console
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={OFFERING_URLS.openSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-7 py-3 text-center font-montserrat text-base font-medium text-foreground transition-colors hover:border-green-500/50 hover:bg-green-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore Open Harness on GitHub
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <a
            href={OFFERING_URLS.support}
            className="decoration-current/40 inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-1 font-montserrat text-sm font-semibold text-oh-accent underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
          >
            <Headphones className="h-4 w-4" aria-hidden="true" />
            Need hands-on help? Explore Mifune engineering support
          </a>

          <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
            MIT licensed · one repo / one sandbox · no host toolchains
          </p>
        </div>

        <figure
          className="relative mx-auto w-full min-w-0 max-w-xl"
          aria-labelledby="cloud-operating-model-caption"
        >
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/5 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-oh-rule bg-oh-raised text-oh-ink shadow-2xl">
            <div className="flex min-h-11 min-w-0 items-center gap-2 border-b border-oh-rule px-4 py-3 sm:px-5">
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
              <span className="ml-2 min-w-0 truncate font-mono text-[11px] text-oh-muted sm:text-sm">
                ~/open-harness — workspace
              </span>
            </div>

            <dl className="divide-y divide-oh-rule bg-oh-paper px-4 sm:px-6">
              {terminalRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid min-w-0 gap-1 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="font-mono text-[10px] font-semibold tracking-[0.18em] text-oh-accent sm:text-xs">
                    {label}
                  </dt>
                  <dd className="min-w-0 break-words font-mono text-xs leading-relaxed text-oh-ink sm:text-sm">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-oh-rule bg-oh-raised px-4 py-3 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-oh-muted sm:px-6 sm:text-xs">
              Open Harness Cloud · Managed by Mifune
            </div>
          </div>
          <figcaption id="cloud-operating-model-caption" className="sr-only">
            Open Harness connects one project and a preferred coding agent to an
            isolated, persistent Docker workspace that can be self-hosted or
            operated through Mifune-managed Open Harness Cloud.
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default HeroSection;
