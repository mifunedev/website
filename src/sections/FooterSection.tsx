"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/utils/client";
import { socialIcons } from "@/config/app";

const FooterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/images/ruska_logo_200.png"
                  alt="Mifune Logo"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <span className="ml-3 text-xl font-montserrat font-medium text-foreground">
                Mifune
              </span>
            </div>
            <p className="text-sm font-montserrat text-muted-foreground leading-relaxed">
              Build your AI digital workforce with intelligent agents powered by LangChain DeepAgents.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Product</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="/#pain" className="hover:text-foreground transition-colors duration-200">
                  AI Workers
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-foreground transition-colors duration-200">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/#audit" className="hover:text-foreground transition-colors duration-200">
                  Book Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Resources</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="/#about" className="hover:text-foreground transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/socials" className="hover:text-foreground transition-colors duration-200">
                  Socials
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers Column */}
          <div>
            <h3 className="text-foreground font-montserrat font-medium mb-4">Developers</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="/blog" className="hover:text-green-500 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <a href="https://github.com/ruska-ai" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors duration-200">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://chat.ruska.ai" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 transition-colors duration-200">
                  Launch OpenHarness
                </a>
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm font-montserrat text-muted-foreground">
              © {new Date().getFullYear()} Mifune. All rights reserved.
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
