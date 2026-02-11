"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopNavBar from "@/components/nav/TopNavBar";
import FooterSection from "@/sections/FooterSection";
import { MdExpandMore } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// CTA Button Link - Update this with your actual Calendly/Cal.com link
const COMPANY_TAG = 'ruska-ai'
const BOOKING_LINK = `https://cal.com/${COMPANY_TAG}/ai-audit`;
const EMAIL = "reggleston@ruska.ai";

// FAQ Data
const faqs = [
  {
    question: "What's Claude Code?",
    answer:
      "It's Anthropic's AI that can actually do work—write code, process data, handle workflows. Think of it as an AI employee, not a chat window.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer:
      "ChatGPT is for conversation. Claude Code is for work. I build systems that run autonomously, not just answer questions.",
  },
  {
    question: "Can't I just do this myself?",
    answer:
      "You could. But it takes time to learn and more time to maintain. I handle all of that so you can focus on your business.",
  },
  {
    question: "Why a retainer?",
    answer:
      "AI systems need tuning. Your business changes, you'll want new automations. Retainer means I'm always improving it, not setting and forgetting.",
  },
  {
    question: "Do you have case studies?",
    answer:
      "I'm building my first few this quarter—that's why founding clients get better rates in exchange for being references.",
  },
  {
    question: "Do you work with businesses outside Utah?",
    answer:
      "Yes, for the right fit. But I prefer local clients where we can meet face-to-face.",
  },
];

// Automation Categories Data
const automationCategories = [
  {
    title: "Customer Support",
    examples: "Ticket triage, FAQ responses, follow-up emails",
  },
  {
    title: "Data Processing",
    examples: "Moving data between systems, formatting reports",
  },
  {
    title: "Lead Management",
    examples: "CRM updates, prospect research, follow-up sequences",
  },
  {
    title: "Property Management",
    examples: "Guest comms, review responses, turnover coordination",
  },
  {
    title: "Content Operations",
    examples: "Reformatting, scheduling, repurposing",
  },
  {
    title: "Internal Ops",
    examples: "Meeting prep, status updates, documentation",
  },
];

// Solution Pillars
const solutionPillars = [
  {
    icon: "🔍",
    title: "Identify",
    description: "Map your workflows. Find automation opportunities.",
  },
  {
    icon: "🛠️",
    title: "Build",
    description: "Create Claude Code systems that run in production.",
  },
  {
    icon: "🔄",
    title: "Maintain",
    description: "Stay on retainer to improve and add new automations.",
  },
];

// FAQ Item Component
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

// Primary CTA Button Component
function CTAButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      href={BOOKING_LINK}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-lg font-medium text-black shadow-lg transition-all duration-200 hover:bg-green-400 ${className}`}
    >
      {children}
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </motion.a>
  );
}

export default function ServicesPage() {
  return (
    <>
      <header>
        <TopNavBar />
      </header>
      <main className="bg-background">
        {/* Hero Section */}
        <section className="relative flex min-h-screen flex-col px-4 pt-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative mx-auto flex flex-1 max-w-4xl items-center text-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-5xl font-light leading-tight tracking-tight md:text-6xl lg:text-7xl"
              >
                <span className="font-space font-bold text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                  Ruska Automation as a Service
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mx-auto mb-10 max-w-2xl font-montserrat text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
              >
                I build AI automation systems for your business.
                <br />
                Then I keep them running and improving.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CTAButton>Book a Discovery Call</CTAButton>
              </motion.div>
            </div>
          </div>

          {/* Bottom scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative flex justify-center pb-8"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-montserrat text-xs uppercase tracking-wider text-gray-600">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-8 text-center font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                The Problem
              </h2>
              <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
                <p className="mb-8 font-montserrat text-xl leading-relaxed text-foreground md:text-2xl">
                  AI is moving too fast for most businesses to keep up.
                </p>
                <ul className="mb-8 space-y-4 font-montserrat text-lg text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-red-400">•</span>
                    <span>New AI tools launch every week—you don&apos;t know which ones to trust</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-red-400">•</span>
                    <span>You don&apos;t have in-house AI or security expertise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-red-400">•</span>
                    <span>Managing infrastructure and keeping systems secure takes specialized knowledge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-red-400">•</span>
                    <span>You need automation that works reliably, not just impressive demos</span>
                  </li>
                </ul>
                <p className="font-montserrat text-xl font-medium text-foreground">
                  You need a trusted partner who lives and breathes this stuff.{" "}
                  <span className="text-green-500">That&apos;s where I come in.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                What I Do
              </h2>
            </motion.div>
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              {solutionPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-8 text-center"
                >
                  <div className="mb-4 text-4xl">{pillar.icon}</div>
                  <h3 className="mb-3 font-montserrat text-2xl font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="font-montserrat text-muted-foreground">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center font-montserrat text-lg text-muted-foreground"
            >
              Not chatbots.{" "}
              <span className="text-foreground">
                Real automation that handles workflows end-to-end.
              </span>
            </motion.p>
          </div>
        </section>

        {/* What Can Be Automated Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                What Can Be Automated
              </h2>
            </motion.div>
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {automationCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="mb-2 font-montserrat text-lg font-semibold text-foreground">
                    {category.title}
                  </h3>
                  <p className="font-montserrat text-sm text-muted-foreground">
                    {category.examples}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center font-montserrat text-lg text-muted-foreground"
            >
              If you&apos;re spending{" "}
              <span className="text-foreground">10+ hours/week</span> on
              repetitive work, it can probably be automated.
            </motion.p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                How It Works
              </h2>
            </motion.div>

            <div className="space-y-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl border border-green-500/30 bg-green-500/10 p-8"
              >
                <div className="mb-2 font-montserrat text-sm font-medium uppercase tracking-wider text-green-400">
                  Step 1
                </div>
                <h3 className="mb-3 font-montserrat text-2xl font-semibold text-foreground">
                  Discovery Call{" "}
                  <span className="text-green-400">(Free)</span>
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  We map your workflows and identify what&apos;s worth automating.
                  <br />
                  30 minutes. No commitment.
                </p>
              </motion.div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-2 font-montserrat text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Step 2
                </div>
                <h3 className="mb-3 font-montserrat text-2xl font-semibold text-foreground">
                  Setup{" "}
                  <span className="text-muted-foreground">
                    ($2,500 - $5,000)
                  </span>
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  I build your Claude Code automation system.
                  <br />
                  Typically 2-4 weeks depending on complexity.
                </p>
              </motion.div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-2 font-montserrat text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Step 3
                </div>
                <h3 className="mb-3 font-montserrat text-2xl font-semibold text-foreground">
                  Retainer{" "}
                  <span className="text-muted-foreground">
                    ($1,000 - $3,000/mo)
                  </span>
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  I maintain, improve, and add new automations as your needs
                  evolve.
                  <br />
                  Cancel anytime.
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center font-montserrat text-muted-foreground"
            >
              <span className="text-green-400">Founding clients</span> get
              preferred rates in exchange for case study participation.
            </motion.p>
          </div>
        </section>

        {/* About Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                About
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-border bg-card p-8 md:p-12"
            >
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                {/* Headshot placeholder - replace with actual image */}
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                  <Image
                    src="/images/ruska_logo_200.png"
                    alt="Ryan Eggleston"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="mb-6 font-montserrat text-lg leading-relaxed text-muted-foreground">
                    I&apos;m{" "}
                    <span className="text-foreground">Ryan Eggleston</span>,
                    founder of Ruska AI.
                  </p>
                  <p className="mb-6 font-montserrat text-lg leading-relaxed text-muted-foreground">
                    I built{" "}
                    <Link
                      href="https://github.com/enso-labs/orchestra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      Orchestra
                    </Link>
                    , an open-source agent orchestration platform, because I
                    needed reliable infrastructure for AI automation.
                  </p>
                  <p className="mb-8 font-montserrat text-lg leading-relaxed text-muted-foreground">
                    Now I help businesses implement Claude Code systems that
                    actually work in production—not just demos that break after
                    a week.
                  </p>
                  <p className="mb-8 font-montserrat text-muted-foreground">
                    Based in Saint George, UT. I prefer working with local
                    businesses but take on remote clients for the right fit.
                  </p>
                  {/* Social Links */}
                  <div className="flex gap-4">
                    <a
                      href="https://www.linkedin.com/in/ryan-eggleston/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FaLinkedin size={24} />
                    </a>
                    <a
                      href="https://github.com/ruska-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FaGithub size={24} />
                    </a>
                    <a
                      href="https://x.com/ruska_ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FaXTwitter size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Common Questions
              </h2>
            </motion.div>

            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-blue-500/10 p-12 text-center md:p-16"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl" />

              <div className="relative z-10">
                <h2 className="mb-6 text-4xl font-light text-foreground md:text-5xl">
                  Ready to{" "}
                  <span className="font-space font-bold text-green-500">
                    automate
                  </span>
                  ?
                </h2>
                <p className="mx-auto mb-10 max-w-xl font-montserrat text-xl text-muted-foreground">
                  Book a free discovery call. We&apos;ll map your workflows and see
                  if automation makes sense.
                  <br />
                  <span className="text-foreground">
                    No pressure. No commitment.
                  </span>
                </p>
                <CTAButton>Book a Discovery Call</CTAButton>
                <p className="mt-6 font-montserrat text-sm text-muted-foreground">
                  Or email me directly:{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-green-400 hover:underline"
                  >
                    {EMAIL}
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}
