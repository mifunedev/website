"use client";
import { motion } from "framer-motion";
import { FaGithub, FaStar } from "react-icons/fa";
import { GITHUB_ORG_URL, type FlagshipRepo } from "@/lib/github";

export default function OpenSourceShowcase({
  repos,
}: {
  repos: FlagshipRepo[];
}) {
  return (
    <section id="open-source" className="relative scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Open Source
          </p>
          <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
            We build our AI workers{" "}
            <span className="text-green-500">in the open.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-lg text-muted-foreground">
            The same harnesses we deploy for clients are public on GitHub. Read
            the code, star the repos, and see exactly what runs your business —
            no black boxes, no lock-in.
          </p>
        </motion.div>

        {/* Repo cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.fullName}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-green-500/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                  <FaGithub className="h-5 w-5 text-green-500" />
                </div>
                <span className="flex items-center gap-1.5 font-montserrat text-sm font-medium text-muted-foreground">
                  <FaStar className="h-4 w-4 text-green-500" />
                  {repo.stars.toLocaleString()}
                </span>
              </div>
              <h3 className="font-montserrat text-base font-semibold text-foreground transition-colors group-hover:text-green-500">
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
            </motion.a>
          ))}
        </div>

        {/* Org CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href={GITHUB_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-montserrat text-sm font-medium text-foreground transition-colors hover:border-green-500/40 hover:text-green-500"
          >
            <FaGithub className="h-4 w-4" />
            Explore all our projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
