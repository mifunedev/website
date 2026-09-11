"use client";
import { motion } from "framer-motion";

const painCards = [
  {
    id: "leads-go-cold",
    icon: "📩",
    pain: "Leads go cold",
    solution: "AI Sales Assistant drafts follow-ups",
    detail:
      "Every new lead gets a personalized follow-up drafted within minutes — no more prospects slipping through the cracks because your team ran out of time.",
  },
  {
    id: "crm-gets-messy",
    icon: "🗂️",
    pain: "CRM gets messy",
    solution: "AI Operations Assistant updates records",
    detail:
      "Call notes, deal stages, and contact details stay current automatically — your CRM reflects reality instead of last month's manual update.",
  },
  {
    id: "projects-drift",
    icon: "📋",
    pain: "Projects drift",
    solution: "AI Project Manager tracks tasks and blockers",
    detail:
      "Status updates, blocker flags, and task reminders run on autopilot — your team spends time executing, not chasing down what's stuck.",
  },
  {
    id: "customers-get-ignored",
    icon: "💬",
    pain: "Customers get ignored",
    solution: "AI Customer Success Assistant drafts check-ins",
    detail:
      "Proactive check-in messages go out on schedule — every customer hears from you before they have to ask what's going on.",
  },
];

export default function PainSection() {
  return (
    <section id="pain" className="relative px-4 py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            The Problem
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            <span className="font-montserrat text-foreground">
              Your team is losing hours to work{" "}
            </span>
            <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              AI can already handle.
            </span>
          </h2>
        </motion.div>

        {/* Pain Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {painCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6"
            >
              {/* Card header */}
              <div className="mb-4 flex items-start gap-4">
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <p className="font-montserrat text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {card.pain}
                  </p>
                  <h3 className="mt-1 font-montserrat text-lg font-semibold text-foreground">
                    <span className="font-space text-green-400">→</span>{" "}
                    {card.solution}
                  </h3>
                </div>
              </div>

              {/* Card detail */}
              <p className="font-montserrat text-sm leading-relaxed text-muted-foreground">
                {card.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center font-montserrat text-lg text-muted-foreground"
        >
          If your team spends{" "}
          <span className="text-foreground">10+ hours a week</span> on any of
          these,{" "}
          <span className="text-green-400">an AI worker can cover it.</span>
        </motion.p>
      </div>
    </section>
  );
}
