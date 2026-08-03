"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type Faq } from "@/data/faqs";

function FAQItem({
  faq,
  index,
  idPrefix,
}: {
  faq: Faq;
  index: number;
  idPrefix: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerId = `${idPrefix}-${index}-trigger`;
  const panelId = `${idPrefix}-${index}-panel`;

  return (
    <div className="border-b border-border last:border-0">
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left font-montserrat text-base font-semibold text-foreground transition-colors hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-oh-focus sm:text-lg"
        >
          <span>{faq.question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className="pb-6 pr-8"
      >
        <p className="font-montserrat leading-relaxed text-muted-foreground">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

type FAQSectionProps = {
  faqs: Faq[];
  eyebrow: string;
  heading: string;
  /**
   * Required, not optional: every caller states its own third line. A default
   * here would render the homepage's copy verbatim under another page's
   * heading.
   */
  subheading: string;
  /**
   * Namespaces the trigger and panel ids, so `aria-controls` cannot collide if
   * two instances ever render on one route.
   */
  idPrefix: string;
};

export default function FAQSection({
  faqs,
  eyebrow,
  heading,
  subheading,
  idPrefix,
}: FAQSectionProps) {
  return (
    <section
      id="faq"
      className="relative scroll-mt-24 bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-[0.22em] text-oh-accent">
            {eyebrow}
          </p>
          <h2 className="text-balance font-montserrat text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-montserrat text-lg text-muted-foreground">
            {subheading}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-5 sm:px-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              idPrefix={idPrefix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
