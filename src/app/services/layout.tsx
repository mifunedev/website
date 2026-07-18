import type { Metadata } from "next";
import { SITE_URL } from "@/config/app";

const description =
  "Mifune engineering support for Open Harness Cloud customers who want help planning, implementing, integrating, troubleshooting, or handing off a deployment.";

export const metadata: Metadata = {
  title: "Open Harness Cloud Engineering Support",
  description,
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "Open Harness Cloud support",
    "forward-deployed engineering",
    "Open Harness implementation",
    "Open Harness integration",
    "Open Harness deployment support",
  ],
  openGraph: {
    title: "Open Harness Cloud Engineering Support | Mifune",
    description,
    url: `${SITE_URL}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Harness Cloud Engineering Support | Mifune",
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
