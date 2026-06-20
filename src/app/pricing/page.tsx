import type { Metadata } from "next";
import TopNavBar from "@/components/nav/TopNavBar";
import FooterSection from "@/sections/FooterSection";
import { pricingPageTiers } from "@/config/pricing";

export const metadata: Metadata = {
  title: "Pricing | Mifune",
  description:
    "The full Mifune value ladder — from AI Workflow Audit to a fully Managed AI Workforce. Compare every tier to the cost of a hire.",
};

const hiringComparisons: Record<string, string> = {
  "ai-workflow-audit":
    "A free 10-minute intake — complete it once, arrive at your first session with 1–3 prioritized AI opportunities already on the table.",
  "ai-partner":
    "Done-with-you at $1,500/mo is a fraction of a $5k–$10k/mo AI consultant. Two sessions a month, and you own every automation we build.",
  "done-for-you-deployment":
    "Hiring a skilled admin or SDR runs $40k–$60k/yr before benefits. One AI worker does the same job for a one-time deployment fee.",
  "managed-ai-workforce":
    "A full operations team — sales, support, admin — can exceed $300k/yr in payroll. A Managed AI Workforce replaces that at a fraction of the cost.",
};

export default function PricingPage() {
  return (
    <>
      <header>
        <TopNavBar />
      </header>
      <main className="bg-background">
        {/* Hero */}
        <section className="relative px-4 pb-16 pt-32">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          {/* Ambient glow */}
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Pricing
            </p>
            <h1 className="mb-6 font-montserrat text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-foreground">The Full Path to a</span>
              <br />
              <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                Managed AI Workforce
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl font-montserrat text-lg text-muted-foreground">
              Every engagement starts with a <strong className="text-green-400">free</strong> AI Workflow Audit. From there, you move through the ladder at your own pace — the intake feeds straight into your AI Partner engagement.
            </p>
            <p className="mx-auto max-w-2xl font-montserrat text-sm text-muted-foreground">
              The intake is a quick free form you complete before your first session — no homepage card, no commitment. The{" "}
              <a href="/" className="text-green-400 hover:underline">
                3 homepage offers
              </a>{" "}
              (AI Partner, Done-For-You, Managed) map to steps 2–4 below.
            </p>
          </div>
        </section>

        {/* Value Ladder */}
        <section className="relative px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                The Value Ladder
              </p>
            </div>

            <div className="space-y-8">
              {pricingPageTiers.map((tier, index) => (
                <div key={tier.id}>
                  {/* Stepped card */}
                  <div
                    className={
                      tier.highlight
                        ? "relative rounded-2xl border border-green-500/30 bg-green-500/10 p-8"
                        : "relative rounded-2xl border border-border bg-card p-8"
                    }
                  >
                    {/* Stage label */}
                    <div
                      className={`mb-2 font-montserrat text-sm font-medium uppercase tracking-wider ${
                        tier.highlight ? "text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      Step {index + 1}
                      {tier.positionLabel ? (
                        <span className="ml-2 font-montserrat text-xs uppercase tracking-wider opacity-60">
                          {tier.positionLabel}
                        </span>
                      ) : null}
                      {tier.badge ? (
                        <span className="ml-3 rounded-full bg-green-500/20 px-3 py-0.5 text-xs text-green-400">
                          {tier.badge}
                        </span>
                      ) : null}
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Left: tier info */}
                      <div>
                        <h2 className="mb-2 font-montserrat text-2xl font-semibold text-foreground">
                          {tier.name}
                        </h2>
                        <p className="mb-1 font-montserrat text-xl font-bold text-green-400">
                          {tier.price}
                          {tier.period ? (
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                              {tier.period}
                            </span>
                          ) : null}
                        </p>
                        <p className="mb-4 font-montserrat text-sm text-muted-foreground">
                          {tier.description}
                        </p>

                        <ul className="mb-6 space-y-2">
                          {tier.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex items-start gap-2 font-montserrat text-sm text-muted-foreground"
                            >
                              <svg
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
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
                              {bullet}
                            </li>
                          ))}
                        </ul>

                        <a
                          href="/#audit"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-base font-medium text-black transition-all duration-200 hover:bg-green-400 whitespace-nowrap"
                        >
                          {tier.cta}
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
                        </a>
                      </div>

                      {/* Right: vs hiring framing */}
                      <div className="flex flex-col justify-between">
                        {tier.roiHint ? (
                          <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                            <p className="mb-1 font-montserrat text-xs font-medium uppercase tracking-wider text-green-400">
                              vs. Hiring
                            </p>
                            <p className="font-montserrat text-sm text-muted-foreground">
                              {hiringComparisons[tier.id] ?? tier.roiHint}
                            </p>
                          </div>
                        ) : null}
                        {tier.roiHint ? (
                          <div className="rounded-xl border border-border bg-background/50 p-4">
                            <p className="mb-1 font-montserrat text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              ROI Framing
                            </p>
                            <p className="font-montserrat text-sm font-medium text-foreground">
                              {tier.roiHint}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* AI Partner month details — shown immediately after Step 2 card */}
                  {tier.id === "ai-partner" ? (
                    <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-8">
                      <h3 className="mb-4 font-montserrat text-lg font-semibold text-green-400">
                        What&apos;s in every AI Partner month
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Two 45-minute done-with-you sessions — we build on your screen so your team owns it",
                          "Unlimited async support with same-day replies for AI Partner clients",
                          "A day-one win — at least one automation live after session one",
                          "Audit, Optimize, Automate — fix the process first, then systematically automate it",
                          "A running, quantified deliverables log — every automation named, measured, and yours",
                        ].map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 font-montserrat text-sm text-muted-foreground"
                          >
                            <svg
                              className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
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
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Arrow connector between steps */}
                  {index < pricingPageTiers.length - 1 ? (
                    <div className="flex justify-center py-2">
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
                  ) : null}
                </div>
              ))}
            </div>

            {/* Trust Blocks */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
                <h3 className="mb-3 font-montserrat text-xl font-semibold text-foreground">
                  You Own Everything
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  Every automation, every integration, every line of
                  configuration&mdash;it&apos;s yours. If we part ways, you keep
                  everything. No lock-in, no hostage data, no proprietary black
                  boxes.
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
                <h3 className="mb-3 font-montserrat text-xl font-semibold text-foreground">
                  Full Transparency
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  You&apos;ll always know exactly what we&apos;re building, why,
                  and how much it costs. No surprise invoices, no scope creep
                  without your approval. Regular progress updates and full
                  visibility into every system.
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
                <h3 className="mb-3 font-montserrat text-xl font-semibold text-foreground">
                  Measurable Deliverables
                </h3>
                <p className="font-montserrat text-muted-foreground">
                  Every month you receive a quantified log of everything we
                  built together — automations named, hours saved estimated,
                  and outcomes recorded. You always know what your investment
                  produced.
                </p>
              </div>
            </div>

            {/* Closing CTA */}
            <div className="mt-12 text-center">
              <p className="mb-6 font-montserrat text-muted-foreground">
                Every engagement starts with a{" "}
                <span className="text-green-400">free AI Workflow Audit</span>{" "}
                — the fastest way to find where AI saves you time and money,
                before you spend a dollar.
              </p>
              <a
                href="/#audit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-lg font-medium text-black transition-all duration-200 hover:bg-green-400 whitespace-nowrap"
              >
                Book Your Free Audit
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
              </a>
            </div>
          </div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}
