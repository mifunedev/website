"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaTimes } from "react-icons/fa";

type Technology = {
  name: string;
  description: string;
  logo?: string;
};

const technologies: Technology[] = [
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", description: "Advanced language models" },
  { name: "Anthropic", logo: "https://cdn.simpleicons.org/anthropic", description: "Constitutional AI assistant" },
  { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg", description: "Cloud platform" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", description: "Containerization" },
  { name: "Google Cloud", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", description: "AI/ML services" },
  { name: "Kubernetes", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", description: "Orchestration" },
  { name: "LangChain", logo: "https://cdn.simpleicons.org/langchain", description: "LLM application framework" },
  { name: "Microsoft Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg", description: "Enterprise cloud" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", description: "Document database" },
  { name: "Vercel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", description: "Frontend cloud platform" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", description: "Server runtime" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", description: "Relational database" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", description: "AI/ML backend" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", description: "UI framework" },
  { name: "Slack", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg", description: "Team integration" },
  { name: "Supabase", logo: "https://supabase.com/dashboard/img/supabase-logo.svg", description: "Postgres & vector storage" },
  { name: "Tailwind CSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg", description: "Utility-first CSS" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", description: "Type-safe JavaScript" },
  { name: "Vite", logo: "https://vitejs.dev/logo.svg", description: "Next-gen frontend tooling" },
  { name: "Microsoft Teams", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Microsoft_Office_Teams_%282019%E2%80%932025%29.svg", description: "Team collaboration" },
  { name: "Zoho", logo: "https://cdn.simpleicons.org/zoho", description: "Business apps suite" },
];

const firstRowTechnologies = technologies.slice(0, 11);
const secondRowTechnologies = technologies.slice(11);

// A single logo card: theme-aware surface (white in light, an elevated muted
// gray in dark) with a constant white logo chip so near-black brand marks stay
// legible in both themes, a green-tinted initials fallback when no logo is
// provided or the remote logo 404s, and a hover tooltip carrying the one-line
// description. The tech name is always rendered as visible text so information
// is never carried by the tooltip alone.
//
// The fallback is driven by a client `failed` flag rather than DOM mutation so
// it survives SSR: a logo that 404s during server render (before hydration)
// would otherwise paint a broken-image glyph because `onError` never fires on
// the server. The `ref` callback below catches an already-failed image on
// mount (`complete && naturalWidth === 0`) and `onError` catches future
// failures — either path degrades cleanly to the initials box.
const TechCard = ({
  tech,
  duplicate = false,
  compact = false,
  className = "",
}: {
  tech: Technology;
  duplicate?: boolean;
  compact?: boolean;
  className?: string;
}) => {
  const initials = tech.name.substring(0, 2).toUpperCase();
  const [failed, setFailed] = useState(false);

  return (
    <div
      aria-hidden={duplicate}
      className={[
        "group relative flex-shrink-0",
        duplicate ? "motion-reduce:hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "mx-auto flex h-28 flex-col items-center justify-center rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:border-green-500 hover:shadow-lg dark:bg-muted",
          compact ? "w-[4.5rem] gap-1.5 p-2" : "w-28 gap-2 p-3",
        ].join(" ")}
      >
        {tech.logo && !failed ? (
          // Constant white chip keeps near-black brand marks legible on the
          // dark card surface; this tile never flips theme.
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tech.logo}
              alt={`${tech.name} logo`}
              className="max-h-full max-w-full object-contain"
              onError={() => setFailed(true)}
              ref={(node) => {
                if (node && node.complete && node.naturalWidth === 0) {
                  setFailed(true);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-xs font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300">
            {initials}
          </div>
        )}
        <span
          className={[
            "text-center font-montserrat font-medium leading-tight text-foreground",
            compact ? "text-[11px]" : "text-xs",
          ].join(" ")}
        >
          {tech.name}
        </span>
      </div>
      {/* Tooltip (enhancement only — the name above is the source of truth) */}
      <div
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 font-montserrat text-xs text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
      >
        {tech.description}
      </div>
    </div>
  );
};

// One scrolling carousel row. The rail is the row's techs duplicated so the
// CSS keyframes can translate exactly one set's width (-50%) for a seamless
// loop. Inter-card spacing is a per-card right margin (mr-4) rather than a
// flex gap, so the duplicated set is an exact 50% of the rail and -50% lands
// precisely on the seam (a flex gap would leave the loop half a gap short and
// jump every cycle). The duplicated half is aria-hidden and hidden under
// reduced motion, where the row collapses to a static wrapped layout (gap-y-4
// restores the vertical rhythm the removed flex gap used to provide). Hover
// and the explicit Pause/Resume control both pause the animation. The row
// uses overflow-x-clip (not overflow-hidden) for the horizontal mask; the
// extra top padding gives the -top-9 tooltip room to render within the box.
const TechCarouselRow = ({
  technologies: rowTechnologies,
  reverse = false,
  paused = false,
}: {
  technologies: Technology[];
  reverse?: boolean;
  paused?: boolean;
}) => {
  const rail = [...rowTechnologies, ...rowTechnologies];

  return (
    <div className="relative overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]">
      <div
        className={`flex w-max gap-y-4 pb-4 pt-10 hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-start motion-reduce:animate-none ${
          reverse
            ? "animate-tech-ecosystem-scroll-reverse"
            : "animate-tech-ecosystem-scroll"
        } ${paused ? "[animation-play-state:paused]" : ""}`}
      >
        {rail.map((tech, index) => (
          <TechCard
            key={`${tech.name}-${index}`}
            tech={tech}
            duplicate={index >= rowTechnologies.length}
            className="mr-4"
          />
        ))}
      </div>
    </div>
  );
};

const TechnologyEcosystemSection = () => {
  const [isTechnologyRailPaused, setIsTechnologyRailPaused] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);

  return (
    <section
      id="technology"
      aria-labelledby="technology-heading"
      className="relative px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Technologies
          </p>
          <h2
            id="technology-heading"
            className="font-montserrat text-3xl font-bold text-foreground md:text-4xl"
          >
            Our Technology Ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-lg leading-relaxed text-muted-foreground">
            From agent runtimes to production infrastructure, Mifune builds
            across the modern AI engineering ecosystem.
          </p>
        </motion.div>

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-border bg-card p-6 md:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
            {!showAllTech && (
              <button
                type="button"
                aria-pressed={isTechnologyRailPaused}
                onClick={() => setIsTechnologyRailPaused((paused) => !paused)}
                className="rounded-full border border-border px-3 py-1.5 font-montserrat text-xs text-muted-foreground transition-colors hover:border-green-500 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background motion-reduce:hidden"
              >
                {isTechnologyRailPaused ? "Resume slider" : "Pause slider"}
              </button>
            )}
            <button
              type="button"
              aria-expanded={showAllTech}
              onClick={() => setShowAllTech((shown) => !shown)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-montserrat text-xs font-medium text-muted-foreground transition-colors hover:border-green-500 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background"
            >
              {showAllTech ? (
                <>
                  <FaTimes aria-hidden className="h-3 w-3" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <FaEye aria-hidden className="h-3 w-3" />
                  <span>View All</span>
                </>
              )}
            </button>
          </div>

          {showAllTech ? (
            // Two static rows (11 + 10) inside a single horizontal-scroll
            // container: centered when they fit the panel, left-anchored scroll
            // on narrow screens. It never wraps to a third row. pt-10 gives the
            // row-one tooltips room so the scroll box does not clip them.
            <div className="overflow-x-auto">
              <div className="mx-auto flex w-max flex-col gap-4 pb-2 pt-10">
                <div className="flex justify-center gap-2">
                  {firstRowTechnologies.map((tech, index) => (
                    <TechCard
                      key={`${tech.name}-${index}`}
                      tech={tech}
                      compact
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  {secondRowTechnologies.map((tech, index) => (
                    <TechCard
                      key={`${tech.name}-${index}`}
                      tech={tech}
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <TechCarouselRow
                technologies={firstRowTechnologies}
                paused={isTechnologyRailPaused}
              />
              <TechCarouselRow
                technologies={secondRowTechnologies}
                reverse
                paused={isTechnologyRailPaused}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyEcosystemSection;
