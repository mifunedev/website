"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section id="about" className="relative px-4 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            About
          </p>
          <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
            Built by a senior software leader who manages{" "}
            <span className="text-green-500">real AI agent infrastructure.</span>
          </h2>
        </motion.div>

        {/* Founder card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-border bg-card p-8 md:p-12"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Founder image */}
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border border-green-500/30 bg-green-500/10">
              <Image
                src="/images/ryan_egg.png"
                alt="Ryan Eggleston"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Founder bio */}
            <div>
              <p className="mb-6 font-montserrat text-lg leading-relaxed text-muted-foreground">
                I&apos;m{" "}
                <span className="text-foreground">Ryan Eggleston</span>,
                founder of Mifune. I was shipping production software long
                before AI wrote its first line of code.
              </p>
              <p className="mb-6 font-montserrat text-lg leading-relaxed text-muted-foreground">
                I don&apos;t vibe-code demos. I architect multi-agent systems
                that run reliably at scale — tested, monitored, and
                maintainable. Every AI worker I deploy lives in a hardened,
                isolated environment so your business data never leaks and
                your systems never go dark unexpectedly.
              </p>
              <p className="mb-8 font-montserrat text-muted-foreground">
                Based in Saint George, UT. I take remote clients for the
                right fit.
              </p>

              {/* Social links */}
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/ryan-eggleston"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://github.com/ryaneggz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="GitHub"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OpenHarness credibility callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-2xl border border-green-500/30 bg-green-500/5 p-8"
        >
          <h3 className="mb-3 font-montserrat text-xl font-semibold text-foreground">
            Powered by{" "}
            <span className="text-green-500">OpenHarness</span>
          </h3>
          <p className="font-montserrat text-muted-foreground">
            OpenHarness is an isolated operating environment for reliable AI
            workers. Every agent Mifune deploys runs inside a hardened,
            auditable sandbox — so your workflows stay predictable, your
            data stays private, and you own every configuration from day
            one.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
