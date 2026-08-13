// Acceptance gate for the built agent-facing surface (XOS-230).
//
// This deliberately reads out/, not implementation source. A source change that
// never reaches the static export is not a shipped feature. Exceptions are
// derivation evidence (canonical JSON, the declared route table, git history, and
// the repository image path) and source-only contracts for conditionally mounted UI.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'out');
const SITE_URL = 'https://thewhyman.com';
const GENERATED_FILES = [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'AGENTS.md',
  'pricing.md',
  'openapi.json',
  '_headers',
];
const SOURCE_COMMIT_PATHS = [
  'data/canonical.json',
  'data/linkedin_public.json',
];
const NAMED_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'CCBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
  'OAI-SearchBot',
  'Claude-SearchBot',
  'Applebot-Extended',
  'Amazonbot',
  'meta-externalagent',
  'Bytespider',
];

let fail = 0;
const check = (name, condition, detail = '') => {
  const ok = Boolean(condition);
  const readableDetail = detail.length > 1200 ? `…${detail.slice(-1200)}` : detail;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !readableDetail ? '' : `  <- ${readableDetail}`}`);
  if (!ok) fail++;
  return ok;
};

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function walkFiles(directory, predicate, found = []) {
  if (!fs.existsSync(directory)) return found;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(absolute, predicate, found);
    else if (predicate(absolute)) found.push(absolute);
  }
  return found;
}

function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, code) => {
    if (code[0] !== '#') return named[code.toLowerCase()];
    const number = code[1].toLowerCase() === 'x'
      ? Number.parseInt(code.slice(2), 16)
      : Number.parseInt(code.slice(1), 10);
    return String.fromCodePoint(number);
  });
}

function normalizeText(value) {
  return decodeEntities(String(value)).replace(/\s+/g, ' ').trim();
}

function validateXmlEntities(value) {
  const residue = value.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, '');
  if (residue.includes('&')) throw new Error('contains an unescaped or unknown entity');
}

function assertWellFormedXml(xml) {
  const stack = [];
  let cursor = 0;
  let roots = 0;
  const tokenPattern = /<[^>]*>/g;
  let token;

  while ((token = tokenPattern.exec(xml))) {
    const text = xml.slice(cursor, token.index);
    validateXmlEntities(text);
    if (stack.length === 0 && text.trim()) throw new Error('text exists outside the root element');

    const tag = token[0];
    if (/^<\?xml\s+version=["']1\.0["'](?:\s+encoding=["'][^"']+["'])?\s*\?>$/i.test(tag)) {
      if (token.index !== 0) throw new Error('XML declaration is not first');
    } else if (/^<!--(?:[\s\S]*?)-->$/.test(tag)) {
      // Comments do not affect nesting.
    } else if (/^<\//.test(tag)) {
      const closing = tag.match(/^<\/([A-Za-z_][\w:.-]*)\s*>$/);
      if (!closing) throw new Error(`invalid closing tag ${tag}`);
      const expected = stack.pop();
      if (expected !== closing[1]) throw new Error(`closing ${closing[1]} while ${expected || 'nothing'} is open`);
    } else {
      const opening = tag.match(/^<([A-Za-z_][\w:.-]*)([\s\S]*?)(\/?)>$/);
      if (!opening) throw new Error(`invalid opening tag ${tag}`);
      const attributeText = opening[2];
      const withoutAttributes = attributeText.replace(
        /\s+[A-Za-z_:][\w:.-]*\s*=\s*(?:"[^"]*"|'[^']*')/g,
        '',
      );
      if (withoutAttributes.trim()) throw new Error(`invalid attributes in ${tag}`);
      validateXmlEntities(attributeText);
      if (stack.length === 0) roots++;
      if (!opening[3]) stack.push(opening[1]);
    }
    cursor = tokenPattern.lastIndex;
  }

  const trailing = xml.slice(cursor);
  validateXmlEntities(trailing);
  if (trailing.trim()) throw new Error('trailing text exists outside the root element');
  if (stack.length) throw new Error(`unclosed tag ${stack[stack.length - 1]}`);
  if (roots !== 1) throw new Error(`expected one root element, found ${roots}`);
}

function routeForHtml(file) {
  let relative = path.relative(OUT, file).split(path.sep).join('/').replace(/\.html$/, '');
  if (relative === 'index') return '/';
  relative = relative.replace(/\/index$/, '');
  return `/${relative}`;
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function extractJsonLd(html, filename) {
  const blocks = [];
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(script[1])) continue;
    try {
      blocks.push(JSON.parse(script[2]));
    } catch (error) {
      throw new Error(`${filename} JSON-LD does not parse: ${error.message}`);
    }
  }
  return blocks;
}

function collectStringLeaves(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((child) => collectStringLeaves(child, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((child) => collectStringLeaves(child, output));
  return output;
}

function collectTypedNodes(value, output = []) {
  if (Array.isArray(value)) value.forEach((child) => collectTypedNodes(child, output));
  else if (value && typeof value === 'object') {
    if (typeof value['@type'] === 'string') output.push(value);
    Object.values(value).forEach((child) => collectTypedNodes(child, output));
  }
  return output;
}

function extractVisibleTextNodes(html) {
  const withoutNonVisible = html
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  return withoutNonVisible
    .split(/<[^>]+>/g)
    .map(normalizeText)
    .filter(Boolean);
}

function hiddenHeadingViolations(html, filename) {
  const violations = [];
  const withoutScripts = html.replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const tags = [...withoutScripts.matchAll(/<\/?([A-Za-z][\w:-]*)\b([^>]*)>/g)];
  const stack = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const isHidden = (attributes) => {
    const className = (attributes.match(/\bclass=["']([^"']*)["']/i) || [])[1] || '';
    const style = (attributes.match(/\bstyle=["']([^"']*)["']/i) || [])[1] || '';
    return /(?:^|\s)(?:sr-only|visually-hidden|screen-reader-only|a11y-hidden|hidden|invisible)(?:\s|$)/.test(className)
      || /(?:^|\s)aria-hidden=["']true["']/i.test(attributes)
      || /(?:^|\s)hidden(?:\s|=|$)/i.test(attributes)
      || /(?:display\s*:\s*none|visibility\s*:\s*hidden|clip(?:-path)?\s*:)/i.test(style);
  };

  for (const match of tags) {
    const raw = match[0];
    const name = match[1].toLowerCase();
    if (raw.startsWith('</')) {
      const index = stack.map((entry) => entry.name).lastIndexOf(name);
      if (index !== -1) stack.splice(index);
      continue;
    }
    const inheritedHidden = stack.some((entry) => entry.hidden);
    const hidden = inheritedHidden || isHidden(match[2]);
    if (/^h[1-6]$/.test(name) && hidden) violations.push(`${filename}: ${raw.slice(0, 160)}`);
    if (!voidTags.has(name) && !raw.endsWith('/>')) stack.push({ name, hidden });
  }
  return violations;
}

function hasButtonWithName(html, accessibleName) {
  return [...html.matchAll(/<button\b([^>]*)>/gi)].some((match) => {
    const label = (match[1].match(/\baria-label=["']([^"']+)["']/i) || [])[1];
    return normalizeText(label || '') === accessibleName;
  });
}

console.log('\ngenerated files:');
const outputs = {};
for (const filename of GENERATED_FILES) {
  const contents = readText(path.join(OUT, filename));
  outputs[filename] = contents;
  check(`${filename} has emitted content`, contents.trim().length > 0, 'missing or empty in out/');
}
check('llms.txt is markdown content', /^#\s+\S/m.test(outputs['llms.txt']), 'missing Markdown heading');
check('llms-full.txt is markdown content', /^#\s+\S/m.test(outputs['llms-full.txt']), 'missing Markdown heading');
check('AGENTS.md is markdown content', /^#\s+\S/m.test(outputs['AGENTS.md']), 'missing Markdown heading');
check('pricing.md is markdown content', /^#\s+\S/m.test(outputs['pricing.md']), 'missing Markdown heading');
check('_headers contains a header rule', /^\/\*/m.test(outputs._headers), 'missing /* rule');
const publicText = [outputs['llms.txt'], outputs['llms-full.txt'], outputs['AGENTS.md']].join('\n');
check('public agent text omits internal steering literals',
  !/not public|Never answer|Use this for/i.test(publicText));
check('public agent text omits underscore-prefixed key markers',
  !/(?:^|[\s[{(,])_[A-Za-z][\w-]*\s*(?::|\*\*:)/m.test(publicText));
check('AGENTS.md omits internal repository paths and precedence rules',
  !/data\/(?:canonical|linkedin_public)\.json|takes precedence/i.test(outputs['AGENTS.md']));

console.log('\ncanonical publication projection:');
const publicationBoundaries = JSON.parse(readText(path.join(ROOT, 'data/canonical.json')))._publicationBoundaries || {};
const expectedProjectionKeys = [
  'basics',
  'brand',
  'howHeWorks',
  'tracks',
  'interviewQA',
  'behavioralStories',
  'whyExponentialOs',
  'coDialecticDepth',
  'writingLibrary',
  'aiFundLessons',
  // Added on main while this branch was in flight. Each was declared
  // deliberately rather than left to deny-by-default: leadershipStyle and
  // speaking are recruiter-facing public material; domainDepth is outcome-only
  // because its securityPosture field can carry implementation detail.
  // This pin is intentionally exact — a new canonical block must force a human
  // decision about its public boundary instead of silently defaulting.
  'leadershipStyle',
  'domainDepth',
  'speaking',
];
check('canonical declares the exact public projection key set',
  JSON.stringify(Object.keys(publicationBoundaries)) === JSON.stringify(expectedProjectionKeys),
  Object.keys(publicationBoundaries).join(', '));
check('every public projection block declares a level and justification',
  expectedProjectionKeys.every((key) => publicationBoundaries[key]?.level && publicationBoundaries[key]?.justification));
check('llms-full includes declared-safe Exponential OS reasoning',
  outputs['llms-full.txt'].includes('If you used these tools yesterday and today feels exactly like starting over'));
check('llms-full includes fully public Co-Dialectic proof-of-work',
  outputs['llms-full.txt'].includes('Co-Dialectic is a free, open-source LLM prompt and context optimizer'));
check('llms-full includes the published writing library',
  outputs['llms-full.txt'].includes('The Cyborg — The Customer Is No Longer Human'));
check('llms-full excludes unpublished writing metadata',
  !/PUBLISHING 2026|publishes today|Forthcoming/i.test(outputs['llms-full.txt']));
check('llms-full includes public AI Fund lessons',
  outputs['llms-full.txt'].includes('Commercial signal is not the same as user delight'));

const publicMechanismPattern = /\b(?:isolated\s+(?:git\s+)?)?worktrees?\b|\blifecycle\s+hooks?\b|\bpre[-\s]?prompt(?:\s+hooks?)?\b|\bsession[-\s]?end(?:\s+hooks?)?\b|\b(?:model|task)\s+(?:routing|selection)\b|\b(?:cross[-\s]?LLM\s+)?jury\b|\bcascad(?:ing|ed)\s+escalation\b|\b(?:gate|enforcement)\s+wiring\b|\b(?:structural|semantic|hard|verification|independent[-\s]?verification)\s+gates?\b|\benforced\s+in\s+(?:his|the)\s+workflow\s+as\s+a\s+gate\b|\bcross[-\s]?agent\s+coordination\b|\bcarry[-\s]?forward\s+mechanism\b|\brehydrat(?:e|ed|ion)\b|\bmemory\s+subsystem\b|\blong[-\s]?term\s+index\b|\bcontrol\s+plane\b|\bmodel\s+right[-\s]?sizing\b|\bsecurity\s+(?:scanning|tooling)\b|\bSonarQube\b|\bGitHub\s+Actions\s+CI\b|\bvision[-\s]?model\s+review\b|\bproduction\s+agentic\s+systems\s+on\s+it\b/i;
check('all generated public outputs omit denied mechanism vocabulary',
  !publicMechanismPattern.test(Object.values(outputs).join('\n')));

console.log('\nrobots.txt:');
// Regression guard: a named agent's group must carry BOTH directives.
// This shipped wrong — the named groups had only "Allow: /", so per RFC 9309
// the Content-Signal in the "*" group never reached GPTBot, ClaudeBot or any
// other named crawler. The policy was inert for exactly its target audience.
{
  const groups = outputs['robots.txt'].split(/\n\s*\n/).map((g) => g.trim())
    .filter((g) => g.startsWith('User-agent:'));
  const missing = groups.filter((g) => !/^Content-Signal:.*ai-train=yes/m.test(g) || !/^Allow: \/$/m.test(g))
    .map((g) => g.split('\n')[0]);
  check('robots.txt has the wildcard group plus one per named AI agent',
    groups.length >= 14, `found ${groups.length}`);
  check('every robots.txt group carries BOTH Content-Signal and Allow',
    missing.length === 0, missing.join(', '));
  check('no robots.txt group carries Disallow',
    !/^Disallow: \//m.test(outputs['robots.txt']));
}

const robots = outputs['robots.txt'];
const universalRobotsGroup = robots.split(/\r?\n\s*\r?\n/).find((group) => /^User-agent:\s*\*\s*$/mi.test(group)) || '';
check('robots has the allow-all policy', /^Allow:\s*\/\s*$/mi.test(universalRobotsGroup));
check('robots has Content-Signal', /(?:^|\n)Content-Signal:\s*\S+/m.test(robots));
check('robots has Sitemap', new RegExp(`(?:^|\\n)Sitemap:\\s*${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/sitemap\\.xml(?:\\r?$)`, 'm').test(robots));
check('robots has zero Disallow lines', !/(?:^|\n)Disallow:/mi.test(robots));
check('robots has zero HTML doctypes', !/<!doctype/i.test(robots));
// Match the agent's GROUP, not "User-agent" immediately followed by "Allow".
// Each named group now also carries Content-Signal between those two lines, so
// an adjacency regex would fail on a correct file.
const robotsGroups = robots.split(/\n\s*\n/).map((g) => g.trim()).filter((g) => g.startsWith('User-agent:'));
const groupFor = (agent) => robotsGroups.find((g) => new RegExp(`^User-agent:\\s*${agent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im').test(g));
for (const agent of NAMED_AGENTS) {
  const group = groupFor(agent);
  check(`robots explicitly allows ${agent}`, Boolean(group) && /^Allow:\s*\/$/m.test(group));
  check(`robots gives ${agent} its own Content-Signal`, Boolean(group) && /^Content-Signal:.*ai-train=yes/m.test(group));
}

console.log('\nsitemap.xml:');
let xmlError = '';
try {
  assertWellFormedXml(outputs['sitemap.xml']);
} catch (error) {
  xmlError = error.message;
}
check('sitemap is well-formed XML', !xmlError, xmlError);
const sitemapLocations = new Set(
  [...outputs['sitemap.xml'].matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decodeEntities(match[1].trim())),
);
const htmlRoutes = new Set(
  walkFiles(OUT, (file) => file.endsWith('.html') && path.basename(file) !== '404.html')
    .map(routeForHtml),
);
const sitemapRoutes = new Set();
const invalidLocations = [];
for (const location of sitemapLocations) {
  try {
    const url = new URL(location);
    if (url.origin !== SITE_URL || url.search || url.hash) invalidLocations.push(location);
    else sitemapRoutes.add(url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, ''));
  } catch {
    invalidLocations.push(location);
  }
}
check('every sitemap loc is a canonical site URL', invalidLocations.length === 0, invalidLocations.join(', '));
const routesMissingFromSitemap = setDifference(htmlRoutes, sitemapRoutes);
const routesMissingFromOut = setDifference(sitemapRoutes, htmlRoutes);
// Slide fragments are DELIBERATELY excluded from the sitemap. A deck's
// slide-NN pages are parts of one document; indexing them individually
// fragments content an agent should read as a single piece. The deck's entry
// point IS indexed, so nothing becomes unreachable — and that is asserted
// below rather than assumed, so the exclusion is a checked claim, not a gap.
const SLIDE_FRAGMENT = /^\/presentations\/[^/]+\/slide-\d+$/;
const setHas = (collection, value) => (typeof collection?.has === 'function'
  ? collection.has(value)
  : Array.from(collection || []).includes(value));
const unexplainedMissing = routesMissingFromSitemap.filter((route) => !SLIDE_FRAGMENT.test(route));
check('every built HTML route is in sitemap (slide fragments excluded by rule)',
  unexplainedMissing.length === 0, unexplainedMissing.join(', '));

const orphanFragments = routesMissingFromSitemap
  .filter((route) => SLIDE_FRAGMENT.test(route))
  .filter((route) => !setHas(sitemapRoutes, route.replace(/\/slide-\d+$/, '')));
check('every excluded slide fragment has its parent deck in the sitemap',
  orphanFragments.length === 0, orphanFragments.join(', '));
check('every sitemap route exists as built HTML', routesMissingFromOut.length === 0, routesMissingFromOut.join(', '));

console.log('\nopenapi.json:');
let openapi;
let openapiError = '';
try {
  openapi = JSON.parse(outputs['openapi.json']);
} catch (error) {
  openapiError = error.message;
}
check('openapi.json parses as JSON', !openapiError, openapiError);
check('openapi.json declares OpenAPI 3.x', /^3(?:\.|$)/.test(openapi?.openapi || ''), `got ${openapi?.openapi}`);
check('openapi.json declares POST /api/chat', Boolean(openapi?.paths?.['/api/chat']?.post));
const chatSchema = openapi?.components?.schemas;
check('OpenAPI request requires messages', chatSchema?.ChatRequest?.required?.includes('messages'));
check('OpenAPI message requires role and content', ['role', 'content'].every((key) => chatSchema?.ChatMessage?.required?.includes(key)));
check('OpenAPI response declares SSE and JSON', Boolean(
  openapi?.paths?.['/api/chat']?.post?.responses?.[200]?.content?.['text/event-stream']
  && openapi?.paths?.['/api/chat']?.post?.responses?.[200]?.content?.['application/json'],
));
const handlerSource = readText(path.join(ROOT, 'functions/api/chat.js'));
check('OpenAPI roles match the shipped handler',
  ['user', 'bot', 'assistant'].every((role) => handlerSource.includes(`m.role === '${role}'`))
    && ['user', 'bot', 'assistant'].every((role) => chatSchema?.ChatMessage?.properties?.role?.enum?.includes(role)),
  'handler/schema role contract drifted');
check('OpenAPI streaming default matches the shipped handler',
  handlerSource.includes("url.searchParams.get('stream') !== '0'")
    && Boolean(openapi?.paths?.['/api/chat']?.post?.parameters?.find((item) => item.name === 'stream')),
  'stream query contract drifted');

console.log('\nJSON-LD anti-fabrication contract:');
const canonical = JSON.parse(readText(path.join(ROOT, 'data/canonical.json')));
const linkedin = JSON.parse(readText(path.join(ROOT, 'data/linkedin_public.json')));
const sourceLeaves = new Set([...collectStringLeaves(canonical), ...collectStringLeaves(linkedin)]);
const builtHtml = {
  'index.html': readText(path.join(OUT, 'index.html')),
  'meet.html': readText(path.join(OUT, 'meet.html')),
};
const blocksByFile = {};
let jsonLdError = '';
try {
  for (const [filename, html] of Object.entries(builtHtml)) blocksByFile[filename] = extractJsonLd(html, filename);
} catch (error) {
  jsonLdError = error.message;
}
check('all emitted JSON-LD blocks parse as JSON', !jsonLdError, jsonLdError);

const nodesByFile = Object.fromEntries(
  Object.entries(blocksByFile).map(([filename, blocks]) => [filename, collectTypedNodes(blocks)]),
);
const typesFor = (filename) => new Set((nodesByFile[filename] || []).map((node) => node['@type']));
check('index ships Person, WebSite, and ProfilePage',
  ['Person', 'WebSite', 'ProfilePage'].every((type) => typesFor('index.html').has(type)));
check('meet ships Person, WebSite, and FAQPage but no root ProfilePage',
  ['Person', 'WebSite', 'FAQPage'].every((type) => typesFor('meet.html').has(type))
    && !typesFor('meet.html').has('ProfilePage'));

const allNodes = Object.values(nodesByFile).flat();
const findNodes = (type) => allNodes.filter((node) => node['@type'] === type);
const people = findNodes('Person');
const websites = findNodes('WebSite');
const profilePages = findNodes('ProfilePage');
const faqPages = findNodes('FAQPage');
check('every Person has required non-empty values', people.length > 0 && people.every((person) =>
  ['name', 'jobTitle', 'url'].every((key) => typeof person[key] === 'string' && person[key].trim())));
check('every WebSite has required non-empty values', websites.length > 0 && websites.every((website) =>
  ['name', 'url'].every((key) => typeof website[key] === 'string' && website[key].trim())));
check('root ProfilePage has Person author attribution',
  profilePages.length === 1 && profilePages[0].author?.['@id'] === `${SITE_URL}/#person`);
check('ProfilePage dateModified never emits the Unix epoch',
  profilePages.length === 1 && !String(profilePages[0].dateModified).startsWith('1970-'));
check('FAQPage has exactly 13 entries', faqPages.length === 1 && faqPages[0].mainEntity?.length === 13,
  `found ${faqPages.length} FAQPage nodes and ${faqPages[0]?.mainEntity?.length ?? 0} entries`);
check('every FAQ entry has a non-empty question and answer', faqPages.length === 1 && faqPages[0].mainEntity?.every((question) =>
  typeof question.name === 'string' && question.name.trim()
    && typeof question.acceptedAnswer?.text === 'string' && question.acceptedAnswer.text.trim()));

const externalRouteSource = readText(path.join(ROOT, 'src/data/navbarExternalLinks.ts'));
const productRouteSource = externalRouteSource.match(/products:\s*\[([\s\S]*?)\],\s*profiles:/)?.[1] || '';
const profileRouteSource = externalRouteSource.match(/profiles:\s*\{([\s\S]*?)\n  \},\n\};/)?.[1] || '';
const declaredProductUrls = [...productRouteSource.matchAll(/\bhref:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
const declaredPersonalProfileUrls = [...profileRouteSource.matchAll(/\bhref:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
const expectedCommitDate = execFileSync(
  'git',
  ['-C', ROOT, 'log', '-1', '--format=%cI', '--', ...SOURCE_COMMIT_PATHS],
  { encoding: 'utf8' },
).trim();
const ALLOWED_PROPERTIES = new Set([
  '@context', '@graph', '@type', '@id', 'name', 'jobTitle', 'description', 'url',
  'knowsAbout', 'alumniOf', 'worksFor', 'sameAs', 'dateModified', 'mainEntity',
  'author', 'acceptedAnswer', 'text',
]);
const ALLOWED_STRUCTURAL_VALUES = new Set([
  'https://schema.org', 'Person', 'Organization', 'EducationalOrganization', 'WebSite',
  'ProfilePage', 'FAQPage', 'Question', 'Answer',
]);
const ALLOWED_IDS = new Set(['#person', '#website', '#profile']);
const classCounts = { 1: 0, 2: 0, 3: 0 };
const classificationErrors = [];

function validateDerived(key, value, location) {
  if (key === 'dateModified') {
    return value === expectedCommitDate ? '' : `${location}: dateModified is not ${expectedCommitDate}`;
  }
  try {
    const url = new URL(value);
    if (url.origin !== SITE_URL) return `${location}: derived URL is outside ${SITE_URL}`;
    const route = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
    if (!htmlRoutes.has(route)) return `${location}: ${route} is absent from the built route table`;
    if (key === '@id' && !ALLOWED_IDS.has(url.hash)) return `${location}: undeclared identity fragment ${url.hash}`;
    return '';
  } catch {
    return `${location}: invalid derived URL ${value}`;
  }
}

function classifyJsonLd(value, location = '$', schemaType = '') {
  if (Array.isArray(value)) {
    value.forEach((child, index) => classifyJsonLd(child, `${location}[${index}]`, schemaType));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const currentType = typeof value['@type'] === 'string' ? value['@type'] : schemaType;
  for (const [key, child] of Object.entries(value)) {
    const childLocation = `${location}.${key}`;
    if (!ALLOWED_PROPERTIES.has(key)) classificationErrors.push(`${childLocation}: schema property is not allowlisted`);

    if (typeof child === 'string') {
      if (key === '@context' || key === '@type') {
        classCounts[2]++;
        if (!ALLOWED_STRUCTURAL_VALUES.has(child)) classificationErrors.push(`${childLocation}: structural value ${JSON.stringify(child)} is not allowlisted`);
        continue;
      }

      const isClass1 = (
        (currentType === 'Person' && ['name', 'jobTitle', 'description'].includes(key))
        || (currentType === 'Organization' && ['name', 'description'].includes(key))
        || (currentType === 'EducationalOrganization' && ['name', 'description'].includes(key))
        || (currentType === 'WebSite' && key === 'name')
        || (currentType === 'Question' && key === 'name')
        || (currentType === 'Answer' && key === 'text')
      );
      if (isClass1) {
        classCounts[1]++;
        if (!sourceLeaves.has(child)) classificationErrors.push(`${childLocation}: Class-1 value has no canonical JSON source`);
        continue;
      }

      if (['@id', 'url', 'dateModified'].includes(key)) {
        classCounts[3]++;
        const error = validateDerived(key, child, childLocation);
        if (error) classificationErrors.push(error);
        continue;
      }

      classificationErrors.push(`${childLocation}: string leaf falls outside Classes 1-3`);
      continue;
    }

    if (Array.isArray(child) && currentType === 'Person' && ['knowsAbout', 'sameAs'].includes(key)) {
      child.forEach((leaf, index) => {
        const leafLocation = `${childLocation}[${index}]`;
        if (typeof leaf !== 'string') {
          classificationErrors.push(`${leafLocation}: expected a Class-1 string leaf`);
          return;
        }
        classCounts[1]++;
        if (!sourceLeaves.has(leaf)) classificationErrors.push(`${leafLocation}: Class-1 value has no canonical JSON source`);
      });
      continue;
    }

    classifyJsonLd(child, childLocation, currentType);
  }
}

for (const [filename, blocks] of Object.entries(blocksByFile)) {
  blocks.forEach((block, index) => classifyJsonLd(block, `${filename}[${index}]`));
}
check('Class 1: every biographical/FAQ leaf equals a canonical JSON value',
  !classificationErrors.some((error) => /Class-1/.test(error)),
  classificationErrors.filter((error) => /Class-1/.test(error)).join(' | '));
check('Class 2: every schema property and structural constant is allowlisted',
  !classificationErrors.some((error) => /schema property|structural value/.test(error)),
  classificationErrors.filter((error) => /schema property|structural value/.test(error)).join(' | '));
check('Class 3: every derived value is reproduced by its derivation rule',
  !classificationErrors.some((error) => /derived|dateModified|image source|identity fragment|built route table/.test(error)),
  classificationErrors.filter((error) => /derived|dateModified|image source|identity fragment|built route table/.test(error)).join(' | '));
check('no JSON-LD string leaf falls outside Classes 1-3',
  !classificationErrors.some((error) => /falls outside/.test(error)),
  classificationErrors.filter((error) => /falls outside/.test(error)).join(' | '));
check('all three anti-fabrication classes were exercised', Object.values(classCounts).every((count) => count > 0), JSON.stringify(classCounts));

for (const person of people) {
  check('Person.name equals canonical.basics.name', person.name === canonical.basics.name);
  check('Person.jobTitle equals canonical.basics.title', person.jobTitle === canonical.basics.title);
  check('Person.description equals canonical.basics.summary', person.description === canonical.basics.summary);
  check('Person.knowsAbout equals linkedin.skills', JSON.stringify(person.knowsAbout) === JSON.stringify(linkedin.skills));
  check('Person.image is omitted when no public headshot exists', person.image === undefined);
  check('Person.worksFor never emits generic self-employment',
    person.worksFor === undefined
      || !/^(?:self[-\s]?employ(?:ed|ment)|freelanc(?:e|er)|independent(?:\s+(?:consultant|contractor))?)$/i.test(person.worksFor.name));
  check('Person.sameAs equals linkedin_public.sameAs source key',
    JSON.stringify(person.sameAs) === JSON.stringify(linkedin.sameAs));
  check('Person.sameAs contains only declared personal-profile URLs',
    Array.isArray(person.sameAs) && person.sameAs.length > 0
      && person.sameAs.every((url) => declaredPersonalProfileUrls.includes(url)));
  check('Person.sameAs excludes every declared product URL',
    Array.isArray(person.sameAs)
      && declaredProductUrls.every((url) => !person.sameAs.includes(url)));
}

const faq = faqPages[0];
const schemaFaqPairs = (faq?.mainEntity || []).map((question) => ({
  q: question.name,
  a: question.acceptedAnswer?.text,
}));
check('all 13 FAQ schema pairs equal canonical.interviewQA',
  JSON.stringify(schemaFaqPairs) === JSON.stringify(canonical.interviewQA));

console.log('\nFAQ DOM/schema equality:');
console.log('\nJSON-LD script safety:');
// Asserted against the SHIPPED HTML, not by require()-ing the component.
// An earlier pass converted JsonLd.tsx to CommonJS JavaScript purely so this
// test could require it — restructuring production code to suit a test. The
// component is TSX again; this checks the artifact that actually reaches users,
// which is the stronger assertion anyway.
for (const [filename, html] of Object.entries(builtHtml)) {
  const bodies = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  check(`${filename}: JSON-LD blocks present`, bodies.length > 0);
  for (const [i, body] of bodies.entries()) {
    check(`${filename}[${i}]: no raw '<' survives into the JSON-LD body`,
      !body.includes('<'), body.slice(0, 200));
    check(`${filename}[${i}]: no raw U+2028/U+2029 in the JSON-LD body`,
      !body.includes('\u2028') && !body.includes('\u2029'));
    let parsed = null;
    try { parsed = JSON.parse(body); } catch (e) { parsed = null; }
    check(`${filename}[${i}]: escaped JSON-LD still parses`, parsed !== null);
  }
}

const visibleMeetTextNodes = new Set(extractVisibleTextNodes(builtHtml['meet.html']));
for (const [index, item] of schemaFaqPairs.entries()) {
  check(`FAQ ${index + 1} question is visible and string-equal`, visibleMeetTextNodes.has(normalizeText(item.q)), item.q);
  check(`FAQ ${index + 1} answer is visible and string-equal`, visibleMeetTextNodes.has(normalizeText(item.a)), item.a);
}

console.log('\nHTML semantics and accessibility:');
const allHtmlFiles = walkFiles(OUT, (file) => file.endsWith('.html'));
const profilePageRoutes = [];
for (const file of allHtmlFiles) {
  try {
    const hasProfilePage = collectTypedNodes(extractJsonLd(readText(file), path.relative(OUT, file)))
      .some((node) => node['@type'] === 'ProfilePage');
    if (hasProfilePage) profilePageRoutes.push(routeForHtml(file));
  } catch (error) {
    profilePageRoutes.push(`parse-error:${path.relative(OUT, file)}:${error.message}`);
  }
}
check('ProfilePage schema appears on the root route only',
  JSON.stringify(profilePageRoutes) === JSON.stringify(['/']), profilePageRoutes.join(', '));
const hiddenHeadings = allHtmlFiles.flatMap((file) => hiddenHeadingViolations(readText(file), path.relative(OUT, file)));
check('zero visually-hidden headings exist in built HTML', hiddenHeadings.length === 0, hiddenHeadings.join(' | '));
check('mobile-menu icon button has an accessible name in built HTML',
  hasButtonWithName(builtHtml['index.html'], 'Open menu'));
const conciergeSource = readText(path.join(ROOT, 'src/components/WhyManConcierge.tsx'));
const closeHandler = 'onClick={() => setIsOpen(false)}';
const closeHandlerIndex = conciergeSource.indexOf(closeHandler);
const closeButtonStart = closeHandlerIndex >= 0 ? conciergeSource.lastIndexOf('<button', closeHandlerIndex) : -1;
const closeButtonEnd = closeHandlerIndex >= 0 ? conciergeSource.indexOf('>', closeHandlerIndex + closeHandler.length) : -1;
const closeButtonOpeningTag = closeButtonStart >= 0 && closeButtonEnd >= 0
  ? conciergeSource.slice(closeButtonStart, closeButtonEnd + 1)
  : '';
const closeButtonAccessibleName = closeButtonOpeningTag.match(/\baria-label\s*=\s*['"]([^'"]+)['"]/)?.[1]?.trim() || '';
check('conditionally mounted concierge-close button has an accessible name in source',
  closeButtonAccessibleName.length > 0,
  closeButtonOpeningTag || 'close button opening tag was not found');

console.log('\nclean-checkout build isolation:');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'xos-230-agent-surface-'));
let cleanResult;
let cleanBuildResult;
let cleanLeakResult;
let cleanMechanismLeakResult;
let cleanDetail = '';
const cleanOutputs = {};
let cleanSchemaDate = '';
try {
  const archive = spawnSync('git', ['-C', ROOT, 'archive', '--format=tar', 'HEAD'], {
    encoding: null,
    maxBuffer: 50 * 1024 * 1024,
  });
  if (archive.status !== 0) throw new Error(`git archive failed: ${String(archive.stderr)}`);
  const extract = spawnSync('tar', ['-xf', '-', '-C', tempDirectory], {
    input: archive.stdout,
    encoding: null,
    maxBuffer: 50 * 1024 * 1024,
  });
  if (extract.status !== 0) throw new Error(`archive extraction failed: ${String(extract.stderr)}`);

  const workingDiff = spawnSync('git', ['-C', ROOT, 'diff', '--binary', 'HEAD', '--'], {
    encoding: null,
    maxBuffer: 50 * 1024 * 1024,
  });
  if (workingDiff.status !== 0) throw new Error(`working-tree diff failed: ${String(workingDiff.stderr)}`);
  if (workingDiff.stdout.length > 0) {
    const apply = spawnSync('git', ['apply', '--unsafe-paths', '-'], {
      cwd: tempDirectory,
      input: workingDiff.stdout,
      encoding: null,
      maxBuffer: 50 * 1024 * 1024,
    });
    if (apply.status !== 0) throw new Error(`working-tree overlay failed: ${String(apply.stderr)}`);
  }

  const untracked = execFileSync(
    'git',
    ['-C', ROOT, 'ls-files', '--others', '--exclude-standard', '-z'],
    { encoding: 'utf8' },
  ).split('\0').filter(Boolean);
  for (const relativePath of untracked) {
    const destination = path.join(tempDirectory, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(ROOT, relativePath), destination);
  }

  const cleanEnvironment = { ...process.env };
  delete cleanEnvironment.HOME;
  cleanEnvironment.NEXT_TELEMETRY_DISABLED = '1';
  cleanResult = spawnSync(process.execPath, ['scripts/build-agent-surface.js'], {
    cwd: tempDirectory,
    env: cleanEnvironment,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  cleanDetail = [cleanResult.stdout, cleanResult.stderr].filter(Boolean).join('\n').trim();
  for (const filename of GENERATED_FILES) {
    cleanOutputs[filename] = readText(path.join(tempDirectory, 'public', filename));
  }

  // The clean archive intentionally has no .next font cache, and CI/test sandboxes
  // may have no network. Remove only the temporary archive's Google-font fetch so
  // this build isolates the git-less schema/date path under test.
  const cleanLayoutPath = path.join(tempDirectory, 'src/app/layout.tsx');
  const cleanLayout = readText(cleanLayoutPath)
    .replace('import { Inter } from "next/font/google";\n', '')
    .replace('const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });', "const inter = { className: '' };");
  fs.writeFileSync(cleanLayoutPath, cleanLayout);

  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(tempDirectory, 'node_modules'), 'dir');
  cleanBuildResult = spawnSync(
    process.execPath,
    [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'build'],
    {
      cwd: tempDirectory,
      env: cleanEnvironment,
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    },
  );
  cleanDetail = [cleanDetail, cleanBuildResult.stdout, cleanBuildResult.stderr].filter(Boolean).join('\n').trim();
  if (cleanBuildResult.status === 0) {
    const cleanIndex = readText(path.join(tempDirectory, 'out/index.html'));
    const cleanBlocks = extractJsonLd(cleanIndex, 'clean out/index.html');
    const cleanProfile = collectTypedNodes(cleanBlocks).find((node) => node['@type'] === 'ProfilePage');
    cleanSchemaDate = cleanProfile?.dateModified || '';
  }

  const cleanCanonicalPath = path.join(tempDirectory, 'data/canonical.json');
  const cleanCanonicalSource = readText(cleanCanonicalPath);
  const poisonedCanonical = JSON.parse(cleanCanonicalSource);
  poisonedCanonical.basics.summary = 'This value is not public';
  fs.writeFileSync(cleanCanonicalPath, `${JSON.stringify(poisonedCanonical, null, 2)}\n`);
  cleanLeakResult = spawnSync(process.execPath, ['scripts/build-agent-surface.js'], {
    cwd: tempDirectory,
    env: cleanEnvironment,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  const mechanismPoisonedCanonical = JSON.parse(cleanCanonicalSource);
  mechanismPoisonedCanonical.coDialecticDepth.whatItIs = 'Public worktree implementation details.';
  fs.writeFileSync(cleanCanonicalPath, `${JSON.stringify(mechanismPoisonedCanonical, null, 2)}\n`);
  cleanMechanismLeakResult = spawnSync(process.execPath, ['scripts/build-agent-surface.js'], {
    cwd: tempDirectory,
    env: cleanEnvironment,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
} catch (error) {
  cleanDetail = error.message;
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}
check('generator exits 0 in git archive with HOME unset', cleanResult?.status === 0, cleanDetail);
for (const filename of GENERATED_FILES) {
  check(`clean archive emits non-empty ${filename}`, cleanOutputs[filename]?.trim().length > 0, cleanDetail);
}
check('clean archive builds through rendered schema emission',
  cleanBuildResult?.status === 0,
  `status=${cleanBuildResult?.status} signal=${cleanBuildResult?.signal} error=${cleanBuildResult?.error?.message || ''}\n${cleanDetail.slice(-5000)}`);
check('clean archive rendered ProfilePage dateModified is not 1970',
  cleanSchemaDate.length > 0 && !cleanSchemaDate.startsWith('1970-'), cleanSchemaDate || cleanDetail);
check('public leak guard fails hard and names the offending literal',
  cleanLeakResult?.status !== 0 && /Public leak guard rejected public\/.*literal "not public"/.test(cleanLeakResult?.stderr || ''),
  [cleanLeakResult?.stdout, cleanLeakResult?.stderr].filter(Boolean).join('\n'));
check('public mechanism guard fails hard and names the offending mechanism',
  cleanMechanismLeakResult?.status !== 0
    && /Public mechanism guard rejected public\/.*isolated worktree implementation/.test(cleanMechanismLeakResult?.stderr || ''),
  [cleanMechanismLeakResult?.stdout, cleanMechanismLeakResult?.stderr].filter(Boolean).join('\n'));

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
