"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

const TopNavbar = () => {
  const [showSolidBackground, setShowSolidBackground] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setShowSolidBackground(currentScroll > 50);

      // Detect which section is currently in view
      const sections = ["pain", "about", "audit"];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define menu items in one place for consistency
  const menuItems = [
    { href: "/#pain", label: "AI Workers" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#about", label: "About" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          showSolidBackground
            ? "border-b border-border/10 bg-background/90 py-2 shadow-lg backdrop-blur-lg dark:shadow-black/20"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <a href="/" className="ml-2 flex items-center">
                <Image
                  src="/images/ruska_logo_200.png"
                  alt="Mifune Logo"
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />
                <span className="font-montserrat text-2xl font-medium tracking-wide text-foreground transition-colors duration-200 hover:text-muted-foreground">
                  Mifune
                </span>
              </a>
            </motion.div>

            {/* Menu items - visible on all screens */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {menuItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  className={`font-montserrat text-sm transition-colors duration-200 ${
                    activeSection === item.href.replace("/#", "")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Book Audit CTA button */}
              <motion.a
                href="/#audit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-green-500 px-4 py-2 font-montserrat text-sm font-medium tracking-wide text-black shadow-lg transition-all duration-200 hover:bg-green-400"
              >
                Book Audit
              </motion.a>

              <ModeToggle />
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default TopNavbar;
