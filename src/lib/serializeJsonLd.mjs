/**
 * Serialize a schema.org graph for embedding in a <script type="application/ld+json"> block.
 *
 * `<` is escaped to \\u003c. Without it, any source string containing `</script>`
 * would terminate the element and the remainder would be parsed as HTML — an
 * injection path leading straight from data into the document.
 *
 * U+2028/U+2029 are escaped too: both are legal inside a JSON string but are
 * line terminators in JavaScript, so an unescaped one breaks any consumer that
 * evaluates rather than parses the block.
 *
 * The escapes remain valid JSON — \\u003c parses back to `<` — so consumers read
 * exactly the intended values.
 *
 * Kept as a plain .mjs module, separate from the JsonLd component, so a node
 * test can feed it hostile input directly. The alternative (asserting only on
 * the built HTML) is vacuous: the real data contains no `<`, so the assertion
 * passes whether or not the escaping runs. Verified by mutation — bypassing the
 * escaping produced zero failures against the built-HTML check.
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export default serializeJsonLd;
