"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiClient } from "@/utils/client";
import { Contact } from "@/types";
import {
  wizardSteps,
  composeMessage,
  type WizardStep,
} from "@/data/auditWizard";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
};

function isValid(step: WizardStep, value: string): boolean {
  if (step.optional) return true;
  const v = (value || "").trim();
  if (step.type === "email") return EMAIL_RE.test(v);
  return v.length > 0;
}

export default function AuditWizard() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [website, setWebsite] = useState(""); // honeypot
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const step = wizardSteps[index];
  const value = answers[step.id] ?? "";
  const isLast = index === wizardSteps.length - 1;
  const canAdvance = isValid(step, value);
  const progress = ((index + 1) / wizardSteps.length) * 100;
  const submitting = status === "loading";

  // Auto-focus text inputs as each step enters.
  useEffect(() => {
    if (step.type !== "select") {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [index, step.type]);

  const setAnswer = (id: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const goNext = () => {
    if (isLast) {
      submit();
      return;
    }
    setDirection(1);
    setIndex((i) => Math.min(i + 1, wizardSteps.length - 1));
  };

  const goBack = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const pickOption = (val: string) => {
    setAnswer(step.id, val);
    // Brief highlight, then advance — feels responsive without being jarring.
    setDirection(1);
    setTimeout(() => {
      if (index === wizardSteps.length - 1) submit({ ...answers, [step.id]: val });
      else setIndex((i) => Math.min(i + 1, wizardSteps.length - 1));
    }, 240);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step.type !== "textarea") {
      e.preventDefault();
      if (canAdvance) goNext();
    }
  };

  async function submit(finalAnswers?: Record<string, string>) {
    const data = finalAnswers ?? answers;

    // Honeypot — bots fill the hidden field. Fake success, never hit the API.
    if (website.trim()) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    const payload: Contact = {
      Name: data.name || "",
      Email: data.email || "",
      Phone: "",
      Message: composeMessage(data),
      Referrer: "audit-wizard",
    };

    try {
      const res = await apiClient.contactFormSubmit(payload);
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="audit"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-background to-green-500/5 px-4 py-24"
    >
      {/* Ambient glow + grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl">
        {/* Eyebrow */}
        <div className="mb-8 text-center">
          <p className="mb-3 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Free AI Workflow Audit
          </p>
          <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
            Get your{" "}
            <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.55)]">
              free audit
            </span>{" "}
            in 60 seconds
          </h2>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-card/80 p-6 shadow-2xl backdrop-blur-sm md:p-10">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <SuccessScreen key="success" email={answers.email} />
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between font-montserrat text-xs text-muted-foreground">
                    <span>
                      Step {index + 1} of {wizardSteps.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-green-500"
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    />
                  </div>
                </div>

                {/* Step */}
                <div className="min-h-[320px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step.id}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 260, damping: 30 }}
                      onKeyDown={onKeyDown}
                    >
                      <h3 className="font-montserrat text-2xl font-bold text-foreground md:text-3xl">
                        {step.question}
                      </h3>
                      {step.subtext && (
                        <p className="mt-3 font-montserrat text-base text-muted-foreground">
                          {step.subtext}
                        </p>
                      )}

                      <div className="mt-8">
                        {step.type === "select" && step.options && (
                          <div className="grid gap-3">
                            {step.options.map((opt) => {
                              const selected = value === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => pickOption(opt.value)}
                                  className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                                    selected
                                      ? "border-green-500 bg-green-500/10"
                                      : "border-border bg-background hover:border-green-500/50 hover:bg-green-500/5"
                                  }`}
                                >
                                  <span>
                                    <span className="block font-montserrat font-semibold text-foreground">
                                      {opt.label}
                                    </span>
                                    {opt.hint && (
                                      <span className="mt-0.5 block font-montserrat text-sm text-muted-foreground">
                                        {opt.hint}
                                      </span>
                                    )}
                                  </span>
                                  <span
                                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                                      selected
                                        ? "border-green-500 bg-green-500 text-black"
                                        : "border-border text-transparent group-hover:border-green-500/50"
                                    }`}
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {step.type === "textarea" && (
                          <textarea
                            ref={(el) => {
                              inputRef.current = el;
                            }}
                            rows={4}
                            value={value}
                            placeholder={step.placeholder}
                            onChange={(e) => setAnswer(step.id, e.target.value)}
                            className="w-full resize-none rounded-2xl border border-border bg-background px-5 py-4 font-montserrat text-base text-foreground transition-colors focus:border-green-500 focus:outline-none"
                          />
                        )}

                        {(step.type === "text" || step.type === "email") && (
                          <input
                            ref={(el) => {
                              inputRef.current = el;
                            }}
                            type={step.type === "email" ? "email" : "text"}
                            value={value}
                            placeholder={step.placeholder}
                            onChange={(e) => setAnswer(step.id, e.target.value)}
                            className="w-full rounded-2xl border border-border bg-background px-5 py-4 font-montserrat text-lg text-foreground transition-colors focus:border-green-500 focus:outline-none"
                          />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
                  <label htmlFor="wizard-website">Website</label>
                  <input
                    id="wizard-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="mt-6 font-montserrat text-sm text-red-400">
                    Something went wrong. Please try again, or email us at{" "}
                    <a href="mailto:hello@mifune.dev" className="font-semibold underline hover:text-red-300">
                      hello@mifune.dev
                    </a>
                    .
                  </p>
                )}

                {/* Controls — select steps auto-advance, so hide Continue there */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={index === 0}
                    className="font-montserrat text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-0"
                  >
                    ← Back
                  </button>

                  {step.type !== "select" && (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canAdvance || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-7 py-3 font-montserrat text-base font-medium text-black shadow-lg transition-all duration-200 hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending…
                        </>
                      ) : isLast ? (
                        "Get My Free Audit"
                      ) : (
                        "Continue"
                      )}
                    </button>
                  )}
                </div>

                {step.optional && step.type === "select" && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="mt-4 w-full text-center font-montserrat text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Skip this one
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center font-montserrat text-xs text-muted-foreground">
          No spam, ever. We reply within one business day — no call required to start.
        </p>
      </div>
    </section>
  );
}

function SuccessScreen({ email }: { email?: string }) {
  return (
    <motion.div
      key="success-inner"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center py-10 text-center"
      role="alert"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10"
      >
        <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      <h3 className="mt-6 font-montserrat text-2xl font-bold text-foreground">
        You&apos;re in. Audit incoming.
      </h3>
      <p className="mt-3 max-w-md font-montserrat text-muted-foreground">
        We&apos;ll email your 1–3 highest-impact AI opportunities to{" "}
        <span className="font-semibold text-foreground">{email || "your inbox"}</span>{" "}
        within one business day. If it&apos;s not there, check your spam folder.
      </p>
    </motion.div>
  );
}
