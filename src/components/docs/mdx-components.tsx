import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { MermaidDiagram } from "@/components/ui/MermaidDiagram";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => (
      <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />
    ),
    Mermaid: ({ chart }: { chart: string }) => <MermaidDiagram chart={chart} />,
    ...components,
  };
}
