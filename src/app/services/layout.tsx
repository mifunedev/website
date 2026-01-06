import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code Automation Services",
  description:
    "I set up Claude Code as your AI employee. Automation systems for businesses in Saint George, UT and beyond.",
  keywords: [
    "Claude Code",
    "AI automation",
    "Saint George",
    "Utah",
    "business automation",
    "workflow automation",
    "AI employee",
  ],
  openGraph: {
    title: "Claude Code Automation Services | Ruska AI",
    description:
      "I set up Claude Code as your AI employee. Automation systems for businesses in Saint George, UT and beyond.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Automation Services | Ruska AI",
    description:
      "I set up Claude Code as your AI employee. Automation systems for businesses in Saint George, UT and beyond.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
