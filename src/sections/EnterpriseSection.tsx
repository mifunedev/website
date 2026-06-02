"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/utils/client";
import { Contact } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

const auditBenefits = [
  "A 10-minute intake — no prep, no tech knowledge needed",
  "1–3 prioritised AI opportunities surfaced before our first session",
  "A clear picture of which workflows to fix first (and why)",
  "Your answers feed straight into your AI Partner engagement",
];

export default function EnterpriseSection() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const loading = status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const payload: Contact = {
      Name,
      Email,
      Phone,
      Message,
      Referrer: "audit-form",
    };

    const res = await apiClient.contactFormSubmit(payload);

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <section id="audit" className="relative py-24 px-4 bg-gradient-to-b from-background to-green-500/5">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Free AI Workflow Audit
          </p>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mb-6">
            Book your{" "}
            <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              free AI Workflow Audit
            </span>
          </h2>
          <p className="text-xl font-montserrat text-muted-foreground max-w-2xl mx-auto">
            A 10-minute intake surfaces 1–3 AI opportunities before our first session.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-montserrat text-lg font-semibold text-foreground mb-6">
              What you&apos;ll walk away with:
            </h3>
            <ul className="space-y-4">
              {auditBenefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="font-montserrat text-sm text-muted-foreground">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 p-6 rounded-2xl bg-card/50 border border-green-500/20"
            >
              <p className="font-montserrat text-sm text-muted-foreground mb-3">
                Response time guarantee:
              </p>
              <p className="font-montserrat text-base font-semibold text-foreground">
                We reply within{" "}
                <span className="text-green-500">1 business day</span> — no
                sales pitch, just answers.
              </p>
            </motion.div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 md:p-10 rounded-3xl bg-card border border-green-500/20 shadow-xl">
              <h3 className="font-montserrat text-xl font-bold text-foreground mb-2">
                Request Your Free Audit
              </h3>
              <p className="font-montserrat text-sm text-muted-foreground mb-8">
                Takes 2 minutes. No credit card. No commitment.
              </p>

              {/* Success banner */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-montserrat text-sm text-green-400">
                    Thanks — we&apos;ll be in touch within one business day.
                  </p>
                </motion.div>
              )}

              {/* Error banner */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-montserrat text-sm text-red-400">
                    Something went wrong. Please try again or email us directly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="audit-name"
                    className="block font-montserrat text-sm text-muted-foreground mb-2"
                  >
                    Name <span className="text-green-500">*</span>
                  </label>
                  <input
                    id="audit-name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-montserrat text-sm text-foreground focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="audit-email"
                    className="block font-montserrat text-sm text-muted-foreground mb-2"
                  >
                    Email <span className="text-green-500">*</span>
                  </label>
                  <input
                    id="audit-email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-montserrat text-sm text-foreground focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="audit-phone"
                    className="block font-montserrat text-sm text-muted-foreground mb-2"
                  >
                    Phone{" "}
                    <span className="text-muted-foreground/50">(optional)</span>
                  </label>
                  <input
                    id="audit-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={Phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-montserrat text-sm text-foreground focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="audit-message"
                    className="block font-montserrat text-sm text-muted-foreground mb-2"
                  >
                    What work eats the most time each week?{" "}
                    <span className="text-green-500">*</span>
                  </label>
                  <textarea
                    id="audit-message"
                    required
                    rows={4}
                    placeholder="e.g. chasing invoices, updating the CRM, weekly reporting…"
                    value={Message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="w-full resize-none px-4 py-3 rounded-xl bg-background border border-border font-montserrat text-sm text-foreground focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full rounded-xl bg-green-500 px-8 py-4 font-montserrat text-lg font-medium text-black shadow-lg transition-all duration-200 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Sending…
                    </span>
                  ) : (
                    "Book My Free Audit"
                  )}
                </motion.button>

                <p className="text-center font-montserrat text-xs text-muted-foreground">
                  No spam, ever. We&apos;ll only use your details to schedule the audit.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
