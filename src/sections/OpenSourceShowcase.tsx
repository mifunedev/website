"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { GITHUB_ORG_URL, type FlagshipRepo } from "@/lib/github";

export default function OpenSourceShowcase({
  repos,
}: {
  repos: FlagshipRepo[];
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="open-source" className="relative scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: "easeOut" }
          }
          className="mb-16 text-center"
        >
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
            MIFUNE OPEN SOURCE
          </p>
          <h2 className="text-balance font-montserrat text-3xl font-bold text-foreground md:text-4xl">
            Open infrastructure, built in public.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-montserrat text-lg leading-relaxed text-muted-foreground">
            Explore Open Harness and related Mifune agent projects on GitHub.
            Read the code, inspect how the pieces work, and evaluate the
            projects for your workflow.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.fullName}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }
              }
              className="group flex min-h-11 flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-green-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                  <FaGithub
                    className="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <ExternalLink
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-oh-accent"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-montserrat text-base font-semibold text-foreground transition-colors group-hover:text-oh-accent">
                {repo.name}
              </h3>
              <p className="mb-3 font-mono text-xs text-muted-foreground">
                {repo.fullName}
              </p>
              <p className="font-montserrat text-sm leading-relaxed text-muted-foreground">
                {repo.tagline}
              </p>
              {repo.language && (
                <span className="mt-4 inline-flex w-fit items-center rounded-full border border-border px-3 py-1 font-montserrat text-xs text-muted-foreground">
                  {repo.language}
                </span>
              )}
              <span className="sr-only">(opens in a new tab)</span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.4, delay: 0.25, ease: "easeOut" }
          }
          className="mt-12 text-center"
        >
          <a
            href={GITHUB_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-montserrat text-sm font-medium text-foreground transition-colors hover:border-green-500/40 hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            Explore all our projects on GitHub
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
