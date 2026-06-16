"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/utils/client";
import { socialIcons } from "@/config/app";

const technologies = [
  "LangGraph",
  "LangChain",
  "DeepAgents",
  "Claude Code",
  "OpenAI Codex",
  "Hermes",
  "Pi",
  "DSPy",
  "FastAPI",
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "MCP",
  "A2A",
  "PostgreSQL + pgvector",
  "Redis",
  "Playwright",
  "Ollama",
];

const technologyRail = [...technologies, ...technologies];

const FooterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTechnologyRailPaused, setIsTechnologyRailPaused] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.subscribeToNewsletter({email});
      setEmail('');
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error);
      setLoading(false);
    }
  };

  return (
    <footer className="bg-background border-t border-border text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/images/ruska_logo_200.png"
                  alt="Orchestra Logo"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <span className="ml-3 text-xl font-cormorant font-medium text-foreground">
                RUSKA
              </span>
            </div>
            <p className="text-sm font-montserrat text-muted-foreground leading-relaxed">
              Build dependable agent systems on the tools your team already trusts.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Product</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="https://chat.ruska.ai" className="hover:text-foreground transition-colors duration-200">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Resources</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <a href="https://github.com/ruska-ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-200">
                  GitHub Projects
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors duration-200">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Stay Updated</h3>
            <p className="text-sm font-montserrat text-muted-foreground mb-4">
              Get the latest updates and news.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors font-montserrat"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-foreground text-background px-4 py-2 text-sm font-montserrat font-medium hover:bg-muted-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Technologies Slider */}
        <section
          className="mb-12 overflow-hidden rounded-2xl border border-border bg-card/40 px-4 py-5"
          aria-labelledby="footer-technologies-heading"
        >
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-montserrat text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Technologies we use
              </p>
              <h3
                id="footer-technologies-heading"
                className="font-cormorant text-2xl font-medium text-foreground"
              >
                A broader stack than any single framework
              </h3>
            </div>
            <div className="flex max-w-xl flex-col gap-3 sm:items-end">
              <p className="font-montserrat text-sm text-muted-foreground sm:text-right">
                From agent runtimes to production infrastructure, Orchestra is built across the modern AI engineering ecosystem.
              </p>
              <button
                type="button"
                aria-pressed={isTechnologyRailPaused}
                onClick={() => setIsTechnologyRailPaused((paused) => !paused)}
                className="rounded-full border border-border px-3 py-1 font-montserrat text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background motion-reduce:hidden"
              >
                {isTechnologyRailPaused ? "Resume slider" : "Pause slider"}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]">
            <div
              className={`flex w-max animate-[footer-tech-scroll_58s_linear_infinite] gap-3 hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:animate-none ${
                isTechnologyRailPaused ? "[animation-play-state:paused]" : ""
              }`}
            >
              {technologyRail.map((technology, index) => {
                const isDuplicate = index >= technologies.length;

                return (
                  <span
                    key={`${technology}-${index}`}
                    aria-hidden={isDuplicate}
                    className={`rounded-full border border-border bg-background/80 px-4 py-2 font-montserrat text-sm text-foreground shadow-sm ${
                      isDuplicate ? "motion-reduce:hidden" : ""
                    }`}
                  >
                    {technology}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <style jsx global>{`
          @keyframes footer-tech-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm font-montserrat text-muted-foreground">
              © {new Date().getFullYear()} Ruska Labs. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialIcons.map((social) => {
                const Icon = social.Icon;
                return (
                  <a
                    key={social.key}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={social.tooltip}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
