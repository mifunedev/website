"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OFFERING_URLS } from "@/config/offerings";

const menuItems = [
  {
    href: OFFERING_URLS.cloud,
    label: "Cloud",
    external: true,
  },
  {
    href: OFFERING_URLS.openSource,
    label: "Open Source",
    external: true,
  },
  {
    href: OFFERING_URLS.docs,
    label: "Docs",
    external: true,
  },
  {
    href: OFFERING_URLS.pricing,
    label: "Open Harness Options",
    external: false,
  },
  { href: OFFERING_URLS.support, label: "Support", external: false },
];

const TopNavbar = () => {
  const pathname = usePathname();
  const [showSolidBackground, setShowSolidBackground] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSolidBackground(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-background px-4 py-3 font-montserrat text-sm font-semibold text-foreground shadow-xl transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <nav
        aria-label="Primary navigation"
        className={`fixed left-0 top-0 z-50 w-full transition-colors duration-200 ${
          showSolidBackground
            ? "border-b border-border bg-background/90 shadow-lg backdrop-blur-lg"
            : "bg-background/40 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 shrink-0 items-center">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className="flex min-h-11 shrink-0 items-center rounded-md pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              aria-label="Mifune home"
            >
              <Image
                src="/images/ruska_logo_200.png"
                alt=""
                width={28}
                height={28}
                className="mr-2 rounded-full"
              />
              <span className="font-montserrat text-xl font-medium tracking-wide text-foreground sm:text-2xl">
                Mifune
              </span>
            </Link>
          </div>

          <div className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1">
            {menuItems.map((item) => {
              const isCurrent = !item.external && pathname === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 font-montserrat text-sm font-medium transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus xl:px-3 ${
                    isCurrent
                      ? "bg-green-500/10 text-foreground shadow-[inset_0_-2px_0_0_var(--oh-accent)]"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {item.external ? (
                    <>
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </>
                  ) : null}
                </a>
              );
            })}

            <a
              href={OFFERING_URLS.cloud}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-oh-solid px-3 font-montserrat text-sm font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:ml-2 xl:px-4"
            >
              Open Console
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>

            <div className="ml-1">
              <ModeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ModeToggle />
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Toggle navigation menu"
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
                >
                  {menuOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2">
                {menuItems.map((item) => {
                  const isCurrent = !item.external && pathname === item.href;

                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <a
                        href={item.href}
                        aria-current={isCurrent ? "page" : undefined}
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`flex min-h-11 w-full items-center justify-between px-3 font-montserrat text-sm ${
                          isCurrent
                            ? "bg-green-500/10 font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                        {item.external ? (
                          <>
                            <ExternalLink
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              (opens in a new tab)
                            </span>
                          </>
                        ) : null}
                      </a>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem asChild>
                  <a
                    href={OFFERING_URLS.cloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-oh-solid px-4 font-montserrat text-sm font-semibold text-black focus:bg-green-400 focus:text-black"
                  >
                    Open Console
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavbar;
