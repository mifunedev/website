"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdCheck } from "react-icons/md";
import { homepageTiers } from "@/config/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            The Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-montserrat font-semibold text-foreground mb-6">
            Start with an AI Partner.{" "}
            <span className="text-green-500">Scale to a managed workforce.</span>
          </h2>
          <p className="text-xl font-montserrat text-muted-foreground max-w-2xl mx-auto">
            Begin as the base with a recurring AI Partner engagement, add done-for-you builds as the upsell, and step up to a fully managed AI workforce at the top.
          </p>
        </motion.div>

        {/* Pricing Cards — 3 columns */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {homepageTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex"
            >
              <div
                className={`relative flex flex-col w-full p-8 rounded-3xl border shadow-xl ${
                  tier.highlight
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-card border-border"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-green-500 text-black text-xs font-montserrat font-bold shadow-lg whitespace-nowrap">
                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Position label chip */}
                {tier.positionLabel && (
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-green-500/10 text-green-400 text-xs font-montserrat uppercase tracking-wide px-3 py-1">
                      {tier.positionLabel}
                    </span>
                  </div>
                )}

                {/* Tier name */}
                <h3
                  className={`font-montserrat text-xl font-semibold mb-4 ${
                    tier.badge ? "mt-3" : ""
                  } ${tier.highlight ? "text-green-400" : "text-foreground"}`}
                >
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <span className="font-montserrat text-3xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="font-montserrat text-sm text-muted-foreground ml-1">
                      {tier.period}
                    </span>
                  )}
                </div>

                {/* ROI Hint */}
                {tier.roiHint && (
                  <p className="font-montserrat text-sm font-medium text-green-500 mb-4">
                    {tier.roiHint}
                  </p>
                )}

                {/* Description */}
                <p className="font-montserrat text-sm text-muted-foreground mb-6">
                  {tier.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                        <MdCheck className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="font-montserrat text-sm text-muted-foreground">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#audit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-montserrat text-base font-medium text-black transition-all duration-200 hover:bg-green-400 shadow-lg"
                >
                  {tier.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full pricing ladder link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/pricing"
            className="font-montserrat text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200"
          >
            See the full path to a managed AI workforce →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
