import type { Metadata } from "next";
import { SITE_URL } from "@/config/app";

const description =
  "Mifune engineering support for AGRO Cloud customers who want help planning, implementing, integrating, troubleshooting, or handing off a deployment.";

export const metadata: Metadata = {
  title: "AGRO Cloud Engineering Support",
  description,
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "AGRO Cloud support",
    "forward-deployed engineering",
    "AGRO implementation",
    "AGRO integration",
    "AGRO deployment support",
  ],
  openGraph: {
    title: "AGRO Cloud Engineering Support | Mifune",
    description,
    url: `${SITE_URL}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGRO Cloud Engineering Support | Mifune",
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
