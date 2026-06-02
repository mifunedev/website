"use client";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col px-4 pt-20">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/4 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto flex flex-1 max-w-7xl items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            {/* Badge chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="font-montserrat text-sm font-medium text-green-400">
                Managed AI Workers for Business
              </span>
            </motion.div>

            {/* Two-tone headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            >
              <span className="font-montserrat text-foreground">Deploy AI workers into your business</span>
              <br />
              <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                without hiring more staff.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-8 max-w-xl font-montserrat text-lg font-light leading-relaxed text-muted-foreground lg:mx-0 lg:text-xl"
            >
              Your AI implementation partner. In two short sessions a month we build the AI workers that run your follow-ups, admin, CRM, and reporting — on your screen, so your team owns them.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
            >
              <a
                href="#audit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-lg font-medium text-black shadow-lg transition-all duration-200 hover:bg-green-400"
              >
                Book a Free AI Workflow Audit
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#pain"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 font-montserrat text-lg font-medium text-foreground transition-all duration-200 hover:border-green-500/50 hover:bg-green-500/5"
              >
                See Example AI Workers
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start"
            >
              {["No new hires needed", "Two sessions a month", "A win on day one", "You own everything"].map((item) => (
                <span key={item} className="flex items-center gap-2 font-montserrat text-sm text-muted-foreground">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column — AI Worker Flow Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Background glow */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl" />

            {/* Terminal card */}
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">ai-worker-pipeline.mifune</span>
              </div>

              {/* Flow nodes */}
              <div className="space-y-0 p-6">
                {[
                  {
                    label: "Lead comes in",
                    detail: "New inquiry received via web form",
                    borderColor: "border-green-500/50",
                    bgColor: "bg-green-500/5",
                    iconColor: "text-green-400",
                    pulse: true,
                    delay: 0.6,
                  },
                  {
                    label: "AI Worker follows up",
                    detail: "Personalised email sent within 2 minutes",
                    borderColor: "border-green-500/30",
                    bgColor: "bg-green-500/5",
                    iconColor: "text-green-400",
                    pulse: false,
                    delay: 0.8,
                  },
                  {
                    label: "CRM updated automatically",
                    detail: "Contact, notes, and next step logged",
                    borderColor: "border-green-500/30",
                    bgColor: "bg-green-500/5",
                    iconColor: "text-green-400",
                    pulse: false,
                    delay: 1.0,
                  },
                  {
                    label: "You get a summary report",
                    detail: "Weekly digest — zero manual effort",
                    borderColor: "border-green-500/50",
                    bgColor: "bg-green-500/5",
                    iconColor: "text-green-400",
                    pulse: false,
                    delay: 1.2,
                  },
                ].map((node, index) => (
                  <div key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: node.delay }}
                      className={`flex items-center gap-4 rounded-xl border ${node.borderColor} ${node.bgColor} p-4`}
                    >
                      <div className="relative flex-shrink-0">
                        <svg className={`h-5 w-5 ${node.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {node.pulse && (
                          <span className="absolute -right-1 -top-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-montserrat text-sm font-semibold text-foreground">{node.label}</p>
                        <p className="font-montserrat text-xs text-muted-foreground">{node.detail}</p>
                      </div>
                    </motion.div>
                    {index < 3 && (
                      <div className="ml-6 flex h-4 items-center">
                        <div className="h-full w-px bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-2 shadow-lg"
            >
              <p className="font-montserrat text-xs font-medium text-muted-foreground">AI Workers Live</p>
              <p className="font-montserrat text-lg font-bold text-green-500">Managed 24/7</p>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="absolute -right-4 -top-4 rounded-xl border border-border bg-card px-4 py-2 shadow-lg"
            >
              <p className="font-montserrat text-xs font-medium text-muted-foreground">Staff Hours Saved</p>
              <p className="font-montserrat text-lg font-bold text-green-500">40+ / wk</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
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
  );
};

export default HeroSection;
