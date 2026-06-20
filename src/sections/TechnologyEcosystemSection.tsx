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
  { name: "LangGraph", logo: "https://cdn.simpleicons.org/langgraph", description: "Stateful multi-agent graphs" },
  { name: "LangChain", logo: "https://cdn.simpleicons.org/langchain", description: "LLM application framework" },
  { name: "DeepAgents", description: "Deep agent runtime" },
  { name: "Claude Code", logo: "https://cdn.simpleicons.org/anthropic", description: "Anthropic coding agent" },
  { name: "OpenAI Codex", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", description: "OpenAI coding agent" },
  { name: "Hermes", description: "Open-weight LLM" },
  { name: "Pi", description: "Coding-agent runtime" },
  { name: "DSPy", description: "Declarative LM programming" },
  { name: "FastAPI", logo: "https://cdn.simpleicons.org/fastapi", description: "Python API framework" },
  { name: "Python", logo: "https://cdn.simpleicons.org/python", description: "Backend language" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript", description: "Typed JavaScript" },
  { name: "React", logo: "https://cdn.simpleicons.org/react", description: "UI library" },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs", description: "React framework" },
  { name: "Tailwind CSS", logo: "https://cdn.simpleicons.org/tailwindcss", description: "Utility-first CSS" },
  { name: "MCP", logo: "https://cdn.simpleicons.org/modelcontextprotocol", description: "Model Context Protocol" },
  { name: "A2A", description: "Agent-to-Agent protocol" },
  { name: "PostgreSQL + pgvector", logo: "https://cdn.simpleicons.org/postgresql", description: "Vector-enabled SQL" },
  { name: "Redis", logo: "https://cdn.simpleicons.org/redis", description: "In-memory data store" },
  { name: "Playwright", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg", description: "Browser automation" },
  { name: "Ollama", logo: "https://cdn.simpleicons.org/ollama", description: "Local model runtime" },
];

const firstRowTechnologies = technologies.slice(0, 10);
const secondRowTechnologies = technologies.slice(10);

// A single logo card: light surface (the one intentional light surface here,
// since most brand logos are dark) with a green-tinted initials fallback when
// no logo is provided or the remote logo 404s, plus a hover tooltip carrying
// the one-line description. The tech name is always rendered as visible text so
// information is never carried by the tooltip alone.
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
  fluid = false,
  className = "",
}: {
  tech: Technology;
  duplicate?: boolean;
  fluid?: boolean;
  className?: string;
}) => {
  const initials = tech.name.substring(0, 2).toUpperCase();
  const [failed, setFailed] = useState(false);

  return (
    <div
      aria-hidden={duplicate}
      className={[
        "group relative",
        fluid ? "w-full" : "flex-shrink-0",
        duplicate ? "motion-reduce:hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={`mx-auto flex h-28 ${
          fluid ? "w-full max-w-[7rem]" : "w-28"
        } flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-3 shadow-sm transition-all duration-300 hover:border-green-500 hover:shadow-lg`}
      >
        <div className="flex h-10 w-10 items-center justify-center">
          {tech.logo && !failed ? (
            <>
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
            </>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-700">
              {initials}
            </div>
          )}
        </div>
        <span className="text-center font-montserrat text-xs font-medium leading-tight text-gray-900">
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
            <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {technologies.map((tech, index) => (
                <TechCard key={`${tech.name}-${index}`} tech={tech} fluid />
              ))}
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
