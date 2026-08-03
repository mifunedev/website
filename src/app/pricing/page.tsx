import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import TopNavBar from "@/components/nav/TopNavBar";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/app";
import {
  cloudNodePlans,
  formatHourlyUsd,
  isDefault,
} from "@/config/cloud-pricing";
import { OFFERING_URLS } from "@/config/offerings";
import { pricingFaqs } from "@/data/faqs";
import {
  breadcrumbSchema,
  cloudServiceSchema,
  faqPageSchema,
  openHarnessSoftwareSchema,
} from "@/lib/schema";
import CTASection from "@/sections/CTASection";
import FAQSection from "@/sections/FAQSection";
import FooterSection from "@/sections/FooterSection";

const title = "Open Harness Cloud pricing";

const description =
  "Open Harness Cloud nodes are billed by the hour they run, on a dedicated VM. AI usage is not included — you sign in to Claude or Pi with your own account. Or self-host the Apache-2.0 licensed project yourself.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const billingFacts = [
  {
    title: "A dedicated VM",
    detail:
      "One node is a dedicated virtual machine, not shared infrastructure. Its vCPU, memory, and disk are yours for as long as the node exists.",
  },
  {
    title: "Whole running hours",
    detail:
      "Only whole running UTC hours meter. Any UTC hour in which your node was running counts as one full hour, at the rate for its size.",
  },
  {
    title: "Queued and failed time is free",
    detail:
      "Time spent queued, building, or on a build that failed is not billed. The meter starts when the node is running.",
  },
  {
    title: "Destroy to stop paying",
    detail:
      "A running node keeps metering until you destroy it. Destroying the node in the Console is how you stop paying for it.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={cloudServiceSchema()} />
      <JsonLd data={openHarnessSoftwareSchema()} />
      <JsonLd data={faqPageSchema(pricingFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Mifune", url: SITE_URL },
          { name: "Pricing", url: `${SITE_URL}/pricing` },
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
        <section className="relative overflow-hidden px-4 pb-16 pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_85%_60%_at_50%_0%,#000_65%,transparent_100%)]" />
          <div className="absolute left-1/2 top-1/4 h-[25rem] w-[min(44rem,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/15 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <OpenHarnessBrandBar
              density="hero"
              status="Cloud pricing by Mifune"
              className="mx-auto mb-7 w-fit justify-center text-foreground"
            />
            <h1 className="text-balance font-montserrat text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Pay by the hour your node runs.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
              A node is a dedicated cloud VM running your Open Harness
              workspace, and you pay for the hours it runs. AI usage is not
              included: you sign in to Claude or Pi inside the workspace with
              your own account, and pay that provider directly.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
              <a
                href={OFFERING_URLS.cloud}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl bg-oh-solid px-7 py-3 text-center font-montserrat text-base font-semibold text-black shadow-lg transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Open the Console
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href="#deploy"
                className="decoration-oh-accent/40 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md px-1 font-montserrat text-sm font-semibold text-oh-accent underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                <span>
                  Running more than three nodes? Talk to us{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </div>

            <p className="mx-auto mt-7 max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Signing in is free · A card is required before your first node ·
              No free tier, no trial
            </p>
          </div>
        </section>

        <section
          className="border-y border-border bg-card/40 px-4 py-16 sm:py-20"
          aria-labelledby="billing-mechanics-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
                Billing mechanic
              </p>
              <h2
                id="billing-mechanics-heading"
                className="text-balance font-montserrat text-3xl font-semibold text-foreground sm:text-4xl"
              >
                How billing works
              </h2>
            </div>

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {billingFacts.map((fact) => (
                <li
                  key={fact.title}
                  className="min-w-0 rounded-2xl border border-border bg-card p-6"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                    {fact.title}
                  </p>
                  <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
                    {fact.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="px-4 py-16 sm:py-20"
          aria-labelledby="node-pricing-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
                Hourly rates
              </p>
              <h2
                id="node-pricing-heading"
                className="text-balance font-montserrat text-3xl font-semibold text-foreground sm:text-4xl"
              >
                What a node costs
              </h2>
              <p className="mt-5 font-montserrat text-lg leading-relaxed text-muted-foreground">
                Choose a size when you create the node. Run more than one and
                each node meters on its own.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cloudNodePlans.map((plan) => (
                <article
                  key={plan.spec}
                  className={`flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 ${
                    plan.spec === "large" ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-montserrat text-2xl font-semibold text-foreground">
                      {plan.label}
                    </h3>
                    {isDefault(plan.spec) ? (
                      <span className="border-oh-accent/40 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                        Default
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-6 flex flex-wrap items-baseline gap-1 font-montserrat text-foreground">
                    <span className="text-4xl font-bold tabular-nums sm:text-5xl">
                      {formatHourlyUsd(plan.hourlyUsd)}
                    </span>
                    <span className="font-mono text-base font-semibold text-muted-foreground">
                      /hr
                    </span>
                  </p>
                  <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
                    per whole hour the node is running
                  </p>

                  <ul className="mt-6 space-y-2 border-t border-border pt-6 font-montserrat text-sm leading-relaxed text-muted-foreground">
                    <li>{plan.vcpu} vCPU</li>
                    <li>{plan.ramGb} GB RAM</li>
                    <li>{plan.diskGb} GB SSD</li>
                    <li>A dedicated VM, not shared infrastructure</li>
                  </ul>

                  <a
                    href={OFFERING_URLS.cloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl bg-oh-solid px-5 py-3 text-center font-montserrat text-sm font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Create a {plan.label} node
                    <ExternalLink
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </article>
              ))}
            </div>

            <p className="mt-8 max-w-3xl font-montserrat text-sm leading-relaxed text-muted-foreground">
              Cloud customers can add hands-on help with adoption from our team:{" "}
              <Link
                href={OFFERING_URLS.support}
                className="decoration-oh-accent/40 inline-flex min-h-11 items-center gap-1 rounded-md font-semibold text-oh-accent underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                Mifune engineering support <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </section>

        <section
          className="relative overflow-hidden border-y border-oh-rule bg-oh-paper px-4 py-20 text-oh-ink sm:py-24"
          aria-labelledby="self-host-heading"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--oh-rule)_1px,transparent_1px),linear-gradient(to_bottom,var(--oh-rule)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
          />
          <div className="relative mx-auto max-w-6xl">
            <OpenHarnessBrandBar
              density="card"
              context="OPEN SOURCE · MAINTAINED BY MIFUNE"
              className="mb-10 border-b border-oh-rule pb-5 text-oh-ink"
            />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:gap-12">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
                  Self-hosted
                </p>
                <h2
                  id="self-host-heading"
                  className="mt-4 text-balance font-montserrat text-3xl font-semibold text-oh-ink sm:text-4xl"
                >
                  Or run it yourself.
                </h2>
                <p className="mt-5 max-w-2xl font-montserrat text-base leading-relaxed text-oh-muted sm:text-lg">
                  Open Harness is Apache-2.0 licensed and genuinely free. Clone
                  it, run the workspace on your own laptop or VM, and pay Mifune
                  nothing. Cloud is for teams that would rather not operate the
                  machine.
                </p>
                <a
                  href={OFFERING_URLS.openSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:border-oh-accent/50 mt-7 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl border border-oh-rule bg-oh-raised px-5 py-3 text-center font-montserrat text-sm font-semibold text-oh-ink transition-colors hover:text-oh-accent-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-oh-paper"
                >
                  Explore Open Harness on GitHub
                  <ExternalLink
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <div className="min-w-0 rounded-2xl border border-oh-rule bg-oh-raised p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent-raised">
                    Who operates it
                  </p>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-oh-muted">
                    Your team operates its local or remote environment.
                  </p>
                </div>
                <div className="mt-6 border-t border-oh-rule pt-6">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent-raised">
                    Best fit
                  </p>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-oh-muted">
                    Teams that want self-host control and are prepared to run
                    the workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection
          faqs={pricingFaqs}
          eyebrow="Common questions"
          heading="Pricing questions, answered."
          subheading="What you pay for, what you don’t, and what happens before your first node."
          idPrefix="pricing-faq"
        />

        <CTASection referrer="pricing-page-deployment-form" />
      </main>
      <FooterSection />
    </>
  );
}
