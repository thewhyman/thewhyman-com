import { SOURCE_LAST_MODIFIED } from './_build-meta.js';

const MARKDOWN_BY_PATH = new Map([
  ['/', '/llms.txt'],
  ['/meet', '/pricing.md'],
  ['/resources', '/AGENTS.md'],
]);

function parseMediaRange(value, index) {
  const [rawType, ...rawParameters] = value.split(';');
  const type = rawType.trim().toLowerCase();
  if (!/^(?:\*|[a-z0-9!#$&^_.+-]+)\/(?:\*|[a-z0-9!#$&^_.+-]+)$/.test(type)) return null;

  let quality = 1;
  for (const parameter of rawParameters) {
    const [name, rawValue] = parameter.split('=').map((part) => part.trim());
    if (name?.toLowerCase() !== 'q') continue;
    if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(rawValue || '')) quality = 0;
    else quality = Number(rawValue);
  }

  const [major, minor] = type.split('/');
  const specificity = (major === '*' ? 0 : 1) + (minor === '*' ? 0 : 1);
  return { major, minor, quality, specificity, index };
}

function qualityFor(mediaType, ranges) {
  const [targetMajor, targetMinor] = mediaType.split('/');
  const matches = ranges.filter(({ major, minor }) => (
    (major === '*' || major === targetMajor)
    && (minor === '*' || minor === targetMinor)
  ));
  if (matches.length === 0) return 0;
  matches.sort((left, right) => right.specificity - left.specificity || left.index - right.index);
  return matches[0].quality;
}

function prefersMarkdown(acceptHeader) {
  if (!acceptHeader) return false;
  const ranges = acceptHeader
    .split(',')
    .map(parseMediaRange)
    .filter(Boolean);
  const markdownQuality = qualityFor('text/markdown', ranges);
  const htmlQuality = Math.max(
    qualityFor('text/html', ranges),
    qualityFor('application/xhtml+xml', ranges),
  );
  return markdownQuality > 0 && markdownQuality > htmlQuality;
}

function appendVaryAccept(headers) {
  const vary = headers.get('Vary');
  if (!vary) headers.set('Vary', 'Accept');
  else if (!/(^|,)\s*accept\s*(,|$)/i.test(vary)) headers.set('Vary', `${vary}, Accept`);
}

function negotiated(response, contentType) {
  const headers = new Headers(response.headers);
  if (contentType) headers.set('Content-Type', contentType);

  // Vary goes on BOTH representations. The same URL can return HTML or
  // Markdown, so a cache that saw one must not serve it for a request that
  // prefers the other. Setting it only on the Markdown branch is the bug.
  appendVaryAccept(headers);

  // Last-Modified comes from the real source date baked in at build time.
  // It previously used new Date() per request, which announced "just changed"
  // on every single response — a fabricated freshness signal. If the asset
  // already carries one, that wins; otherwise use the build date; never invent.
  if (!headers.has('Last-Modified') && SOURCE_LAST_MODIFIED) {
    headers.set('Last-Modified', SOURCE_LAST_MODIFIED);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request } = context;
  const methodCanNegotiate = request.method === 'GET' || request.method === 'HEAD';
  const pathname = new URL(request.url).pathname;
  const markdownPath = MARKDOWN_BY_PATH.get(pathname);

  if (methodCanNegotiate && markdownPath && prefersMarkdown(request.headers.get('Accept'))) {
    const assetUrl = new URL(markdownPath, request.url);
    const assetResponse = await context.env.ASSETS.fetch(new Request(assetUrl, { method: request.method }));
    if (assetResponse.ok) return negotiated(assetResponse, 'text/markdown; charset=utf-8');
  }

  return negotiated(await context.next());
}
