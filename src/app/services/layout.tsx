import type { Metadata } from "next";
import { SITE_URL } from "@/config/app";

const description =
  "Mifune engineering support for Mifune Console customers who want help planning, implementing, integrating, troubleshooting, or handing off a deployment.";

export const metadata: Metadata = {
  title: "Mifune Console engineering support",
  description,
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "Mifune Console support",
    "forward-deployed engineering",
    "AGRO implementation",
    "AGRO integration",
    "AGRO deployment support",
  ],
  openGraph: {
    title: "Mifune Console engineering support | Mifune",
    description,
    url: `${SITE_URL}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mifune Console engineering support | Mifune",
    description,
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
