import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Headphones } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import { cloudNodePlans, formatHourlyUsd } from "@/config/cloud-pricing";
import {
  cloudOptions,
  OFFERING_URLS,
  supportOffering,
} from "@/config/offerings";

/** The cheapest published node, so this line cannot drift from the cards. */
const entryPlan = cloudNodePlans.reduce((cheapest, plan) =>
  plan.hourlyUsd < cheapest.hourlyUsd ? plan : cheapest,
);

export default function PricingSection() {
  return (
    <section
      id="options"
      className="relative scroll-mt-24 bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
            Open Harness options
          </p>
          <h2 className="text-balance font-montserrat text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            Managed Cloud first. Self-host when you want control.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
            Choose Mifune-managed Open Harness Cloud or operate the Apache-2.0
            licensed project yourself. Cloud customers can add Mifune
            engineering support when adoption needs hands-on help.
          </p>
          <p className="mx-auto mt-5 font-montserrat text-base text-muted-foreground">
            Nodes start at {formatHourlyUsd(entryPlan.hourlyUsd)} an hour.{" "}
            <Link
              href={OFFERING_URLS.pricing}
              className="decoration-oh-accent/40 inline-flex min-h-11 items-center gap-1 rounded-md font-semibold text-oh-accent underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
            >
              See Cloud pricing <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>

        <div className="space-y-5">
          {cloudOptions.map((offering) => {
            const isCloud = offering.id === "cloud";

            return (
              <article
                key={offering.id}
                className={`relative min-w-0 overflow-hidden rounded-2xl border ${
                  isCloud
                    ? "border-green-500/40 bg-green-500/10 p-6 shadow-xl sm:p-9"
                    : "border-border bg-card p-6 sm:p-8"
                }`}
              >
                {isCloud ? (
                  <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-green-500/10 blur-3xl" />
                ) : null}
                <div className="relative">
                  <OpenHarnessBrandBar
                    density="card"
                    context={
                      isCloud
                        ? "CLOUD · MANAGED BY MIFUNE"
                        : "OPEN SOURCE · MAINTAINED BY MIFUNE"
                    }
                    className={`mb-7 border-b pb-5 ${
                      isCloud
                        ? "border-green-500/30 text-foreground"
                        : "border-border text-foreground"
                    }`}
                  />

                  <div
                    className={`grid gap-7 ${
                      isCloud
                        ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)] lg:items-end"
                        : "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] lg:items-end"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-oh-accent">
                        {offering.eyebrow}
                      </p>
                      <h3
                        className={`font-montserrat font-semibold text-foreground ${
                          isCloud
                            ? "text-3xl sm:text-4xl"
                            : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {offering.name}
                      </h3>
                      <p
                        className={`mt-4 max-w-3xl font-montserrat leading-relaxed text-muted-foreground ${
                          isCloud
                            ? "text-base sm:text-lg"
                            : "text-sm sm:text-base"
                        }`}
                      >
                        {offering.description}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <ul className="grid gap-3">
                        {offering.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 font-montserrat text-sm text-muted-foreground"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-oh-accent"
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={offering.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-7 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-center font-montserrat text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          isCloud
                            ? "bg-oh-solid text-black hover:bg-green-400"
                            : "border border-border bg-background text-foreground hover:border-green-500/50 hover:text-oh-accent"
                        }`}
                      >
                        {offering.cta}
                        <ExternalLink
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="mt-5 rounded-2xl border border-border bg-card px-6 py-5 sm:px-8">
          <OpenHarnessBrandBar
            density="compact"
            context="FOR CLOUD · MIFUNE ENGINEERING"
            className="mb-5 border-b border-border pb-4 text-foreground"
          />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-oh-accent">
                Optional for Cloud customers
              </p>
              <h3 className="mt-2 font-montserrat text-xl font-semibold text-foreground">
                {supportOffering.name}
              </h3>
              <p className="mt-2 font-montserrat text-sm leading-relaxed text-muted-foreground">
                Mifune engineers work alongside your team on an agreed Cloud
                deployment scope. Support is an add-on, not a third operating
                path.
              </p>
            </div>
            <a
              href={supportOffering.href}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-center font-montserrat text-sm font-semibold text-foreground transition-colors hover:border-green-500/50 hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Explore Mifune engineering support
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
