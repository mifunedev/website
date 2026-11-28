import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import MifuneLockup from "@/components/brand/MifuneLockup";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.getPageTree()}
        nav={{ title: <MifuneLockup size={28} />, url: "/" }}
        links={[{ text: "Blog", url: "/blog" }]}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
