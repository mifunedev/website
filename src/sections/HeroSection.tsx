"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Headphones } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import { OFFERING_URLS } from "@/config/offerings";

const flowNodes = [
  {
    label: "Repository connected",
    detail: "One project linked to its workspace",
    emphasis: true,
  },
  {
    label: "Sandbox isolated",
    detail: "Persistent Docker environment; tools stay off host",
    emphasis: false,
  },
  {
    label: "Agent launched",
    detail: "Your preferred coding CLI runs inside the sandbox",
    emphasis: false,
  },
  {
    label: "Operator chooses",
    detail: "Mifune-managed Cloud or self-hosted",
    emphasis: true,
  },
] as const;

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

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

        <motion.figure
          initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3 }
          }
          className="relative mx-auto w-full min-w-0 max-w-xl px-1 pb-12 pt-5 sm:px-5 sm:pb-10 lg:px-0 lg:py-7"
          aria-labelledby="cloud-operating-model-caption"
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl sm:-inset-8"
            aria-hidden="true"
          />

          <div aria-hidden="true" className="relative z-10 min-w-0">
            <div className="relative mx-1 overflow-hidden rounded-2xl border border-border bg-card/80 shadow-[0_28px_80px_-30px_rgba(0,0,0,0.72)] backdrop-blur-sm sm:mx-4 lg:mx-0">
              <div className="flex min-h-11 min-w-0 items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-3 w-3 shrink-0 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 shrink-0 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 shrink-0 rounded-full bg-green-500/80" />
                <span className="ml-2 min-w-0 truncate font-mono text-[11px] text-muted-foreground sm:text-xs">
                  open-harness-flow.mifune
                </span>
              </div>

              <div className="space-y-0 p-3 sm:p-6">
                {flowNodes.map((node, index) => (
                  <div key={node.label}>
                    <motion.div
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, x: -20 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.5,
                              delay: 0.6 + index * 0.2,
                            }
                      }
                      className={`flex min-w-0 items-center gap-4 rounded-xl border bg-green-500/5 p-4 ${
                        node.emphasis
                          ? "border-green-500/50"
                          : "border-green-500/30"
                      }`}
                    >
                      <span className="relative shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {index === 0 ? (
                          <span className="absolute -right-1 -top-1 flex h-2 w-2">
                            {!shouldReduceMotion ? (
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            ) : null}
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                          </span>
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block break-words font-montserrat text-sm font-semibold text-foreground">
                          {node.label}
                        </span>
                        <span className="mt-0.5 block break-words font-montserrat text-xs leading-relaxed text-muted-foreground">
                          {node.detail}
                        </span>
                      </span>
                    </motion.div>
                    {index < flowNodes.length - 1 ? (
                      <div className="ml-6 flex h-4 items-center">
                        <div className="h-full w-px bg-border" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 1.4 }
              }
              className="absolute bottom-0 left-0 rounded-xl border border-border bg-card px-4 py-2 shadow-lg sm:-left-1 lg:-bottom-4 lg:-left-4"
            >
              <p className="font-montserrat text-xs font-medium text-muted-foreground">
                Sandbox
              </p>
              <p className="font-montserrat text-lg font-bold text-oh-accent">
                Isolated
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 1.6 }
              }
              className="absolute right-0 top-0 rounded-xl border border-border bg-card px-4 py-2 shadow-lg sm:-right-1 lg:-right-4 lg:-top-4"
            >
              <p className="font-montserrat text-xs font-medium text-muted-foreground">
                Coding agent
              </p>
              <p className="font-montserrat text-lg font-bold text-oh-accent">
                Your choice
              </p>
            </motion.div>
          </div>

          <figcaption id="cloud-operating-model-caption" className="sr-only">
            Open Harness workspace flow: one repository connects to a
            persistent, isolated Docker sandbox, the operator launches a
            preferred coding agent inside it, and chooses Mifune-managed Cloud
            or self-hosting.
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default HeroSection;
