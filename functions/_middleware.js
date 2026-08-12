const MARKDOWN_BY_PATH = new Map([
  ['/', '/llms.txt'],
  ['/meet', '/pricing.md'],
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

function markdownPath(pathname) {
  if (MARKDOWN_BY_PATH.has(pathname)) return MARKDOWN_BY_PATH.get(pathname);
  if (/\.(?:txt|md)$/i.test(pathname)) return pathname;
  return '/AGENTS.md';
}

function withLastModified(response, contentType) {
  const headers = new Headers(response.headers);
  if (contentType) headers.set('Content-Type', contentType);
  if (!headers.has('Last-Modified')) headers.set('Last-Modified', new Date().toUTCString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request } = context;
  const methodCanNegotiate = request.method === 'GET' || request.method === 'HEAD';

  if (methodCanNegotiate && prefersMarkdown(request.headers.get('Accept'))) {
    const assetUrl = new URL(markdownPath(new URL(request.url).pathname), request.url);
    const assetResponse = await context.env.ASSETS.fetch(new Request(assetUrl, { method: request.method }));
    if (assetResponse.ok) return withLastModified(assetResponse, 'text/markdown; charset=utf-8');
  }

  return withLastModified(await context.next());
}
