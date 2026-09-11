"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./MermaidDiagram";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Partial<Components> = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeString = String(children).replace(/\n$/, "");

      // Handle mermaid diagrams
      if (language === "mermaid") {
        return <MermaidDiagram chart={codeString} />;
      }

      // For inline code (no language specified and no newlines)
      if (!match && !codeString.includes("\n")) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      // For regular code blocks, let rehype-highlight handle syntax highlighting
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
