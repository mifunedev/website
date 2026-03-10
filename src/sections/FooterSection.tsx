"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/utils/client";
import { socialIcons } from "@/config/app";

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.subscribeToNewsletter({ email });
      setEmail("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error);
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="mb-4 flex items-center">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/ruska_logo_200.png"
                  alt="Orchestra Logo"
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span className="font-cormorant ml-3 text-xl font-medium text-foreground">
                RUSKA
              </span>
            </div>
            <p className="font-montserrat text-sm leading-relaxed text-muted-foreground">
              Build your AI digital workforce with intelligent agents powered by
              LangChain DeepAgents.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="mb-4 font-montserrat font-medium text-foreground">
              Product
            </h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link
                  href="https://chat.ruska.ai/login"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="https://chat.ruska.ai/login"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="mb-4 font-montserrat font-medium text-foreground">
              Resources
            </h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link
                  href="/blog"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ruska-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  GitHub Projects
                </a>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="mb-4 font-montserrat font-medium text-foreground">
              Stay Updated
            </h3>
            <p className="mb-4 font-montserrat text-sm text-muted-foreground">
              Get the latest updates and news.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 font-montserrat text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-foreground px-4 py-2 font-montserrat text-sm font-medium text-background transition-colors duration-200 hover:bg-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="font-montserrat text-sm text-muted-foreground">
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
                    className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
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
