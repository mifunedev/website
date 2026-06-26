"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { faqs, type Faq } from "@/data/faqs";

function FAQItem({ faq, index }: { faq: Faq; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-foreground"
      >
        <h3 className="font-montserrat text-lg font-semibold text-foreground md:text-xl">
          {faq.question}
        </h3>
        <MdExpandMore
          className={`h-6 w-6 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p className="font-montserrat leading-relaxed text-muted-foreground">
          {faq.answer}
        </p>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Common Questions
          </p>
          <h2 className="mb-6 font-montserrat text-4xl font-bold text-foreground md:text-5xl">
            What Business Owners{" "}
            <span className="text-green-500">Ask Us First</span>
          </h2>
          <p className="font-montserrat text-xl text-muted-foreground">
            Straight answers before you reach out.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
