import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation as a Service",
  description:
    "AI automation systems built and maintained for your business. Saint George, UT and beyond.",
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "automation as a service",
    "AI automation",
    "AI integration",
    "trusted AI partner",
    "Saint George",
    "Utah",
    "business automation",
    "workflow automation",
  ],
  openGraph: {
    title: "Automation as a Service",
    description:
      "AI automation systems built and maintained for your business. Trusted AI integration partner for SMBs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Automation as a Service",
    description:
      "AI automation systems built and maintained for your business. Trusted AI integration partner for SMBs.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
