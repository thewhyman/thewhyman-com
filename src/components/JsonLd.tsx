import { serializeJsonLd } from '@/lib/serializeJsonLd.mjs';

/**
 * Renders a schema.org graph as a JSON-LD <script> block.
 * The escaping that makes this safe lives in lib/serializeJsonLd.mjs, kept
 * separate so a node test can feed it hostile input directly.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
