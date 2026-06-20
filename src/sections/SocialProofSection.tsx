"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const metrics = [
  "Hours saved per week",
  "Follow-up speed",
  "Tasks automated",
  "Revenue opportunities recovered",
];

export default function SocialProofSection() {
  return (
    <section className="relative py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Case Studies
          </p>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mb-6">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl font-montserrat text-muted-foreground max-w-3xl mx-auto">
            See how managed AI workers are already changing operations for business owners like you.
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto rounded-2xl border border-green-500/30 bg-green-500/10 p-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="font-montserrat text-sm font-medium text-green-400">
              Coming Soon
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-montserrat text-2xl md:text-3xl font-bold text-foreground mb-4">
            Case Study Coming Soon:{" "}
            <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              The Workflow Academy
            </span>
          </h3>

          {/* Sub-heading */}
          <p className="font-montserrat text-lg text-muted-foreground mb-8">
            How The Workflow Academy reclaimed X hours/week with an AI Operations Assistant.
          </p>

          {/* Metrics list */}
          <ul className="space-y-3 mb-8">
            {metrics.map((metric) => (
              <li key={metric} className="flex items-center gap-3 font-montserrat text-muted-foreground">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-green-500"
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
                {metric}
              </li>
            ))}
          </ul>

          {/* Link to /case-studies */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-montserrat text-sm font-medium text-green-400 hover:text-green-300 transition-colors duration-200"
          >
            View all case studies
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
