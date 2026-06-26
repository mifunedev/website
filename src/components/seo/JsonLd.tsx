/**
 * Renders a JSON-LD structured-data block. Server component — render it inside
 * server components (layouts, pages). Mirrors the inline pattern previously used
 * on the Services page, centralized so every page emits valid schema the same way.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema content is built from our own trusted config — not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
