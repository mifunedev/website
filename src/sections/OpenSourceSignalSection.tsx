import { FaStar } from "react-icons/fa";
import { OFFERING_URLS } from "@/config/offerings";
import { getFlagshipRepos } from "@/lib/github";

export default async function OpenSourceSignalSection() {
  const agroRepo = (await getFlagshipRepos()).find(
    (repo) => repo.fullName === "mifunedev/agro",
  );
  const starCount = agroRepo?.starsVerified
    ? agroRepo.stars.toLocaleString("en-US")
    : "Count unavailable";

  return (
    <section className="px-4 pt-20 sm:pt-24">
      <div className="mx-auto max-w-5xl">
        <aside
          className="grid min-w-0 gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] lg:items-center"
          aria-labelledby="open-source-signal-heading"
        >
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
              OPEN SOURCE SIGNAL
            </p>
            <h2
              id="open-source-signal-heading"
              className="mt-3 text-balance font-montserrat text-2xl font-bold leading-tight text-foreground sm:text-3xl"
            >
              Help more agent builders find AGRO.
            </h2>
            <p className="mt-3 max-w-3xl font-montserrat text-sm leading-relaxed text-muted-foreground sm:text-base">
              If the workspace model saves you from one broken local agent
              setup, star the repo so the next Claude Code, Codex, OpenCode, or
              Hermes user can find it faster.
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-background/70 p-5 shadow-sm">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              GITHUB STARS
            </p>
            <p className="mt-2 flex min-w-0 items-center gap-2 font-montserrat text-4xl font-bold tracking-tight text-foreground">
              <FaStar
                className="h-7 w-7 shrink-0 text-green-500"
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">{starCount}</span>
            </p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              mifunedev/agro
            </p>
            <a
              href={OFFERING_URLS.openSource}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-md font-montserrat text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
            >
              Star on GitHub →
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
