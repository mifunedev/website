import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import OpenHarnessBrandBar from "@/components/brand/OpenHarnessBrandBar";
import { socialIcons } from "@/config/app";
import { OFFERING_URLS } from "@/config/offerings";

const footerLinkClass =
  "inline-flex min-h-11 items-center gap-1 rounded-md font-montserrat text-sm text-muted-foreground transition-colors hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus";

const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 border-b border-border pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-md pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              aria-label="Mifune home"
            >
              <Image
                src="/images/ruska_logo_200.png"
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="ml-3 font-montserrat text-xl font-medium text-foreground">
                Mifune
              </span>
            </Link>
            <p className="mt-4 font-montserrat text-sm leading-relaxed text-muted-foreground">
              Mifune operates managed workspaces for coding agents and leads
              optional engineering support for Cloud customers.
            </p>
            <OpenHarnessBrandBar
              density="compact"
              status=" · Maintained by Mifune"
              className="mt-6 w-fit border-t border-border pt-5 text-foreground"
            />
          </div>

          <div>
            <h2 className="mb-2 font-montserrat text-sm font-semibold text-foreground">
              Product
            </h2>
            <ul>
              <li>
                <a
                  href={OFFERING_URLS.cloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Open Harness Cloud
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href={OFFERING_URLS.pricing} className={footerLinkClass}>
                  Deploy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 font-montserrat text-sm font-semibold text-foreground">
              Open Harness
            </h2>
            <ul>
              <li>
                <a
                  href={OFFERING_URLS.openSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Open source
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFERING_URLS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Documentation
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/blog/openharness-getting-started"
                  className={footerLinkClass}
                >
                  Getting started
                </Link>
              </li>
              <li>
                <Link href="/blog" className={footerLinkClass}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 font-montserrat text-sm font-semibold text-foreground">
              Mifune engineering
            </h2>
            <ul>
              <li>
                <Link href={OFFERING_URLS.support} className={footerLinkClass}>
                  Cloud engineering support
                </Link>
              </li>
              <li>
                <a
                  href={OFFERING_URLS.supportContact}
                  className={footerLinkClass}
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {OFFERING_URLS.supportEmail}
                </a>
              </li>
              <li>
                <Link href="/socials" className={footerLinkClass}>
                  Socials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-montserrat text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mifune. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {socialIcons
              .filter((social) => social.link.startsWith("http"))
              .map((social) => {
                const Icon = social.Icon;
                return (
                  <a
                    key={social.key}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
                    aria-label={`${social.tooltip} (opens in a new tab)`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
