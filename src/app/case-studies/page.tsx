import type { Metadata } from "next";
import TopNavBar from "@/components/nav/TopNavBar";
import FooterSection from "@/sections/FooterSection";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from AI workers deployed inside client businesses. Coming soon.",
};

const metricsToCapture = [
  "Hours saved per week",
  "Follow-up speed (hours → minutes)",
  "Number of tasks automated",
  "Revenue opportunities recovered",
];

export default function CaseStudiesPage() {
  return (
    <>
      <header>
        <TopNavBar />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="scroll-mt-20 bg-background"
      >
        {/* Hero / Coming-soon section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          {/* Ambient glow */}
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 blur-[120px]" />

          <div className="relative mx-auto w-full max-w-4xl text-center">
            {/* Eyebrow badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="font-montserrat text-sm font-medium text-green-400">
                Coming Soon
              </span>
            </div>

            {/* Two-tone headline */}
            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              <span className="font-montserrat text-foreground">
                Case Studies
              </span>
              <br />
              <span className="font-space text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                The Workflow Academy
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl font-montserrat text-lg font-light leading-relaxed text-muted-foreground lg:text-xl">
              How The Workflow Academy reclaimed{" "}
              <span className="font-medium text-foreground">
                hours every week
              </span>{" "}
              with an AI Operations Assistant — eliminating manual follow-ups,
              automating repetitive tasks, and recovering revenue that used to
              slip through the cracks.
            </p>

            {/* Metrics-to-capture card */}
            <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-border bg-card p-8 text-left">
              <h2 className="mb-2 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Metrics We&#39;re Capturing
              </h2>
              <ul className="mt-4 space-y-3">
                {metricsToCapture.map((metric) => (
                  <li
                    key={metric}
                    className="flex items-center gap-3 font-montserrat text-base text-foreground"
                  >
                    <span className="flex-shrink-0 text-green-500">✓</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft CTA */}
            <p className="mb-6 font-montserrat text-base text-muted-foreground">
              Want results like these for your business?
            </p>
            <a
              href="/#audit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-lg font-medium text-black shadow-lg transition-all duration-200 hover:bg-green-400"
            >
              Get My Free AI Workflow Audit
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
        </section>

        <FooterSection />
      </main>
    </>
  );
}
