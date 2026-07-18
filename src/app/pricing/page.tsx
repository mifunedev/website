import type { Metadata } from "next";
import { Check, ExternalLink, Mail } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import TopNavBar from "@/components/nav/TopNavBar";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/app";
import {
  cloudOptions,
  OFFERING_URLS,
  supportOffering,
} from "@/config/offerings";
import {
  breadcrumbSchema,
  cloudServiceSchema,
  openHarnessSoftwareSchema,
} from "@/lib/schema";
import FooterSection from "@/sections/FooterSection";

const description =
  "Compare Open Harness workspace options by who operates the environment: Mifune through Open Harness Cloud or your team through the MIT-licensed open-source project.";

export const metadata: Metadata = {
  title: "Deploy Open Harness",
  description,
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Deploy Open Harness",
    description,
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deploy Open Harness",
    description,
  },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={cloudServiceSchema()} />
      <JsonLd data={openHarnessSoftwareSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Mifune", url: SITE_URL },
          { name: "Deploy Open Harness", url: `${SITE_URL}/pricing` },
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
              status="Workspace options by Mifune"
              className="mx-auto mb-7 w-fit justify-center text-foreground"
            />
            <h1 className="text-balance font-montserrat text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Choose who operates your Open Harness workspace.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
              Choose Mifune-managed Open Harness Cloud when you want Mifune to
              operate the environment, or self-host the MIT-licensed project
              when your team wants that responsibility.
            </p>
            <p className="mt-4 font-montserrat text-sm text-muted-foreground">
              Need implementation details?{" "}
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
        </section>

        <section
          className="px-4 py-16"
          aria-labelledby="operating-options-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2
                id="operating-options-heading"
                className="font-montserrat text-3xl font-semibold text-foreground md:text-4xl"
              >
                Two operating paths
              </h2>
              <p className="mx-auto mt-4 max-w-2xl font-montserrat text-muted-foreground">
                Compare who runs the environment and what each path includes.
                Mifune does not publish prices on this page.
              </p>
            </div>

            <div className="space-y-6">
              {cloudOptions.map((option) => {
                const isCloud = option.id === "cloud";

                return (
                  <article
                    key={option.id}
                    className={`relative overflow-hidden rounded-2xl border ${
                      isCloud
                        ? "border-green-500/40 bg-green-500/10 p-6 shadow-xl sm:p-9"
                        : "border-border bg-card p-6 sm:p-8"
                    }`}
                  >
                    <OpenHarnessBrandBar
                      density="card"
                      context={
                        isCloud
                          ? "CLOUD · MANAGED BY MIFUNE"
                          : "OPEN SOURCE · MAINTAINED BY MIFUNE"
                      }
                      className={`mb-7 border-b pb-5 text-foreground ${
                        isCloud ? "border-green-500/30" : "border-border"
                      }`}
                    />

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-oh-accent">
                            {option.eyebrow}
                          </p>
                          {isCloud ? (
                            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-oh-accent">
                              Recommended managed path
                            </span>
                          ) : null}
                        </div>
                        <h3
                          className={`font-montserrat font-semibold text-foreground ${
                            isCloud
                              ? "text-3xl sm:text-4xl"
                              : "text-2xl sm:text-3xl"
                          }`}
                        >
                          {option.name}
                        </h3>
                        <p className="mt-4 font-montserrat leading-relaxed text-muted-foreground">
                          {option.description}
                        </p>
                        <div className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
                          <div>
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                              Who operates it
                            </p>
                            <p className="mt-2 font-montserrat text-sm leading-relaxed text-muted-foreground">
                              {option.operator}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                              Best fit
                            </p>
                            <p className="mt-2 font-montserrat text-sm leading-relaxed text-muted-foreground">
                              {option.bestFor}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 rounded-xl border border-border bg-background/60 p-5">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                          What you get
                        </p>
                        <ul className="mt-4 space-y-3">
                          {option.bullets.map((bullet) => (
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
                        <a
                          href={option.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-7 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-center font-montserrat text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            isCloud
                              ? "bg-oh-solid text-black hover:bg-green-400"
                              : "border border-border bg-background text-foreground hover:border-green-500/50 hover:text-oh-accent"
                          }`}
                        >
                          {option.cta}
                          <ExternalLink
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="px-4 py-20"
          aria-labelledby="support-option-heading"
        >
          <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-6 sm:p-10">
            <OpenHarnessBrandBar
              density="compact"
              context="FOR CLOUD · MIFUNE ENGINEERING"
              className="mb-6 border-b border-border pb-4 text-foreground"
            />
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-oh-accent">
                  Optional for Cloud customers
                </p>
                <h2
                  id="support-option-heading"
                  className="font-montserrat text-3xl font-semibold text-foreground"
                >
                  Add Mifune engineering support
                </h2>
                <p className="mt-4 max-w-3xl font-montserrat leading-relaxed text-muted-foreground">
                  {supportOffering.description} This is a scoped service for
                  Cloud adoption, not another workspace option.
                </p>
              </div>
              <a
                href={OFFERING_URLS.supportContact}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-center font-montserrat text-sm font-semibold text-foreground transition-colors hover:border-green-500/50 hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Discuss your Cloud deployment
              </a>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
