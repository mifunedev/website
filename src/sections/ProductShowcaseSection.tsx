"use client";
import { motion } from "framer-motion";
import { MdCheck } from "react-icons/md";

const deliverables: { title: string; description: string }[] = [
  {
    title: "AI worker configured for your business",
    description:
      "We map your workflows, then build and deploy an AI worker tuned to your specific processes — not a generic chatbot.",
  },
  {
    title: "Human approval before sensitive actions",
    description:
      "Every AI worker is set up with approval gates so your team stays in control of anything that matters.",
  },
  {
    title: "CRM, email, and docs integration",
    description:
      "Your AI worker connects to the tools you already use — HubSpot, Gmail, Google Docs, Notion, and more.",
  },
  {
    title: "Weekly performance report",
    description:
      "Plain-language reports show you exactly what the AI worker did, how much time it saved, and where to improve.",
  },
  {
    title: "A quantified log of everything we build together",
    description:
      "See exactly what was shipped each session — value you can measure.",
  },
  {
    title: "Ongoing monitoring and improvements",
    description:
      "We stay on retainer to tune, expand, and maintain your AI workers as your business grows.",
  },
];

export default function ProductShowcaseSection() {
  return (
    <section id="what-you-get" className="relative scroll-mt-20 px-4 py-24">
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
            What You Actually Get
          </p>
          <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
            Everything delivered. Nothing to manage.
          </h2>
        </motion.div>

        {/* Deliverables checklist */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                <MdCheck className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="mb-2 font-montserrat text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="font-montserrat text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
