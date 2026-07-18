import { ExternalLink } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import { OFFERING_URLS } from "@/config/offerings";

export default function CTASection() {
  return (
    <section className="relative bg-background px-4 py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-green-500/30 bg-card p-8 text-center sm:p-12 md:p-16">
          <OpenHarnessBrandBar
            density="compact"
            status=" · Maintained by Mifune"
            className="mx-auto mb-6 w-fit justify-center text-foreground"
          />
          <h2 className="text-balance font-montserrat text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Choose a clean, persistent workspace for your coding agents.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
            Start with Open Harness Cloud when you want Mifune to operate the
            environment, or explore the MIT-licensed project when your team
            wants to self-host locally or on a remote VM.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={OFFERING_URLS.cloud}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-oh-solid px-7 py-3 font-montserrat text-base font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open Mifune Cloud Console
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={OFFERING_URLS.openSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-7 py-3 font-montserrat text-base font-medium text-foreground transition-colors hover:border-green-500/50 hover:bg-green-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore Open Harness on GitHub
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <p className="mt-6 font-montserrat text-sm text-muted-foreground">
            MIT-licensed open source · Maintained by Mifune · Local or remote
          </p>
        </div>
      </div>
    </section>
  );
}
