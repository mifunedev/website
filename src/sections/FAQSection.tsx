"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

const faqs = [
  {
    question: "How fast can an AI worker go live in my business?",
    answer:
      "Every engagement starts with a free AI Workflow Audit — a 10-minute intake that surfaces 1–3 automation opportunities before your first session. From there, your AI Partner engagement begins: we build together in two ~45-minute sessions per month, and you typically have your first automation running after session one.",
  },
  {
    question: "Do I own the AI workers and my data?",
    answer:
      "Yes — you own everything. The workflows we build, the integrations, the data your workers process — all of it belongs to your business. We never resell your data or lock you into a proprietary platform you can't leave.",
  },
  {
    question: "What is the difference between an audit and a deployment?",
    answer:
      "The AI Workflow Audit is a free intake: a short questionnaire that maps your highest-value automation opportunities and feeds directly into your AI Partner engagement. A deployment is the build itself — during your sessions we install the AI workers in your systems following the Audit, Optimize, Automate framework. You leave every session with working automation, not just a plan.",
  },
  {
    question: "How is this different from hiring a virtual assistant?",
    answer:
      "A VA works business hours, costs $15–$25 per hour, and has a learning curve with every new task. An AI worker runs 24/7, handles volume spikes without extra cost, and follows the same process every time. Mifune builds, monitors, and improves those workers — so you get the output of a full-time hire without the management overhead.",
  },
  {
    question: "What does Mifune manage on an ongoing basis?",
    answer:
      "After deployment, we monitor uptime, catch errors before they affect your business, tune performance as your processes change, and integrate new tools when they make sense. You get a monthly report showing what your AI workers did and what was improved. You focus on outcomes; we handle the infrastructure.",
  },
  {
    question: "What is OpenHarness?",
    answer:
      "OpenHarness is the isolated operating environment your AI workers run inside. Think of it as a secure, dedicated workspace — separate from the public internet — where each worker has controlled access only to the tools and data it needs. This is what makes the workers reliable and auditable rather than unpredictable.",
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "The AI Workflow Audit is free with no obligation. If you move into an AI Partner engagement, it runs month-to-month — no long-term contract. We want you to stay because the results justify it, not because of a lock-in.",
  },
  {
    question: "What's the difference between done-with-you and done-for-you?",
    answer:
      "AI Partner is done-with-you: we build the automations on your screen, in your tools, during our sessions together. You see every decision, learn to drive, and own everything when we're done. Done-For-You Deployment is the upsell: when you'd rather hand us a scoped build and have us deliver it without your hands on the keyboard. Both use the same Audit, Optimize, Automate framework — the difference is who does the building.",
  },
  {
    question: "What happens in a typical month?",
    answer:
      "Two ~45-minute done-with-you sessions where we build or improve automations live on your screen. Unlimited async support with same-day replies in between. A day-one win — at least one automation running after your first session. And a quantified deliverables log so you always know exactly what we built and what it's saving you.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-foreground"
      >
        <h3 className="font-montserrat text-lg font-semibold text-foreground md:text-xl">
          {faq.question}
        </h3>
        <MdExpandMore
          className={`h-6 w-6 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p className="font-montserrat leading-relaxed text-muted-foreground">
          {faq.answer}
        </p>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Common Questions
          </p>
          <h2 className="mb-6 font-montserrat text-4xl font-bold text-foreground md:text-5xl">
            What Business Owners{" "}
            <span className="text-green-500">Ask Us First</span>
          </h2>
          <p className="font-montserrat text-xl text-muted-foreground">
            Straight answers before you book a call.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
