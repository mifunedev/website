import type { Metadata } from "next";
import type { ReactNode } from "react";

// The Socials page is a client component, so its metadata lives in this
// route-level server layout (Next.js App Router pattern).
export const metadata: Metadata = {
  title: "Socials",
  description:
    "Follow Mifune across YouTube, X, GitHub, and LinkedIn for AI automation walkthroughs, agent-building guides, and product updates.",
  alternates: {
    canonical: "/socials",
  },
};

export default function SocialsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
