"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { OFFERING_URLS } from "@/config/offerings";
import type { Contact } from "@/types";
import { apiClient } from "@/utils/client";

type Status = "idle" | "loading" | "success" | "error";

const deploymentBenefits = [
  "A persistent, isolated workspace for your coding agents",
  "A Mifune-managed Open Harness Cloud option",
  "Optional hands-on deployment support for Cloud customers",
];

const fieldClassName =
  "min-h-11 w-full min-w-0 rounded-xl border border-[var(--oh-control-border)] bg-oh-paper px-4 py-3 font-montserrat text-base text-oh-ink placeholder:text-oh-muted focus-visible:border-oh-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus disabled:cursor-not-allowed disabled:opacity-60";

type CTASectionProps = {
  /**
   * Lead attribution for the page this form was submitted from. Defaults to
   * the homepage value, so an existing `<CTASection />` render is unchanged.
   */
  referrer?: string;
};

export default function CTASection({
  referrer = "open-harness-deployment-form",
}: CTASectionProps) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const resultRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);

  const loading = status === "loading";
  const successful = status === "success";
  const controlsDisabled = loading || successful;

  useEffect(() => {
    if (status === "success" || status === "error") {
      resultRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current || successful) {
      return;
    }

    submittingRef.current = true;
    setStatus("loading");

    const payload: Contact = {
      Name,
      Email,
      Phone,
      Message,
      Referrer: referrer,
    };

    try {
      const response = await apiClient.contactFormSubmit(payload);
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <section
      id="deploy"
      aria-labelledby="deployment-heading"
      className="relative scroll-mt-24 overflow-hidden border-y border-oh-rule bg-oh-paper px-4 py-20 text-oh-ink sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--oh-rule)_1px,transparent_1px),linear-gradient(to_bottom,var(--oh-rule)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
      />

      <div className="relative mx-auto grid min-w-0 max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
        <div className="min-w-0 lg:py-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-oh-accent">
            CLOUD · DEPLOYMENT
          </p>
          <h2
            id="deployment-heading"
            className="mt-4 text-balance font-montserrat text-4xl font-bold leading-tight tracking-tight text-oh-ink sm:text-5xl"
          >
            Discuss your Open Harness deployment.
          </h2>
          <p className="mt-6 max-w-2xl font-montserrat text-base leading-relaxed text-oh-muted sm:text-lg">
            Tell us how your team plans to run coding agents. We’ll use the
            details to discuss Open Harness Cloud and, for Cloud customers,
            optional hands-on deployment support.
          </p>

          <ul className="mt-8 space-y-4">
            {deploymentBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex min-w-0 items-start gap-3 font-montserrat text-sm leading-relaxed text-oh-ink sm:text-base"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10">
                  <Check
                    className="h-3.5 w-3.5 text-oh-accent"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">{benefit}</span>
              </li>
            ))}
          </ul>

          <aside className="mt-10 rounded-2xl border border-oh-rule bg-oh-raised p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-oh-accent-raised">
              What happens next
            </p>
            <p className="mt-3 font-montserrat text-sm leading-relaxed text-oh-ink sm:text-base">
              We’ll review your request and reply within 24 hours with a
              practical next step.
            </p>
          </aside>
        </div>

        <div className="min-w-0 rounded-3xl border border-oh-rule bg-oh-raised p-5 shadow-xl shadow-black/5 sm:p-8 lg:p-10">
          <h3
            id="deployment-form-heading"
            className="font-montserrat text-2xl font-bold text-oh-ink"
          >
            Tell us about your deployment
          </h3>
          <p className="mt-2 font-montserrat text-sm leading-relaxed text-oh-muted">
            Share enough context for a useful first reply.
          </p>

          {status === "success" ? (
            <div
              ref={resultRef}
              role="status"
              aria-live="polite"
              tabIndex={-1}
              className="mt-6 break-words rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-4 font-montserrat text-sm leading-relaxed text-[var(--oh-success-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
            >
              Thanks — we received your deployment request. We’ll reply to{" "}
              {Email} within 24 hours.
            </div>
          ) : null}

          {status === "error" ? (
            <div
              ref={resultRef}
              role="alert"
              tabIndex={-1}
              className="mt-6 break-words rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 font-montserrat text-sm leading-relaxed text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus dark:text-red-300"
            >
              Something went wrong. Please try again, or email{" "}
              <a
                href={`mailto:${OFFERING_URLS.supportEmail}`}
                className="font-semibold underline underline-offset-4 hover:text-oh-accent-raised"
              >
                {OFFERING_URLS.supportEmail}
              </a>
              .
            </div>
          ) : null}

          <form
            aria-labelledby="deployment-form-heading"
            aria-busy={loading}
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <span className="sr-only" role="status" aria-live="polite">
              {loading ? "Sending your deployment request." : ""}
            </span>

            <div>
              <label
                htmlFor="deployment-name"
                className="mb-2 block font-montserrat text-sm font-medium text-oh-ink"
              >
                Name{" "}
                <span className="font-normal text-oh-muted">(required)</span>
              </label>
              <input
                id="deployment-name"
                name="Name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Smith"
                value={Name}
                onChange={(event) => setName(event.target.value)}
                disabled={controlsDisabled}
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="deployment-email"
                className="mb-2 block font-montserrat text-sm font-medium text-oh-ink"
              >
                Work email{" "}
                <span className="font-normal text-oh-muted">(required)</span>
              </label>
              <input
                id="deployment-email"
                name="Email"
                type="email"
                autoComplete="email"
                required
                placeholder="jane@company.com"
                value={Email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={controlsDisabled}
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="deployment-phone"
                className="mb-2 block font-montserrat text-sm font-medium text-oh-ink"
              >
                Phone{" "}
                <span className="font-normal text-oh-muted">(optional)</span>
              </label>
              <input
                id="deployment-phone"
                name="Phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={Phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={controlsDisabled}
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="deployment-message"
                className="mb-2 block font-montserrat text-sm font-medium text-oh-ink"
              >
                What are you planning to deploy?{" "}
                <span className="font-normal text-oh-muted">(required)</span>
              </label>
              <textarea
                id="deployment-message"
                name="Message"
                rows={4}
                required
                placeholder="Tell us about your repositories, coding agents, current environment, and where you want help."
                value={Message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={controlsDisabled}
                className={`${fieldClassName} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={controlsDisabled}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-oh-solid px-6 py-3 font-montserrat text-base font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-oh-raised disabled:cursor-not-allowed disabled:opacity-60"
            >
              {successful
                ? "Request sent"
                : loading
                  ? "Sending…"
                  : "Discuss my deployment"}
            </button>

            <p className="text-center font-montserrat text-xs leading-relaxed text-oh-muted">
              No spam. We’ll use your details only to respond to this deployment
              request.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
