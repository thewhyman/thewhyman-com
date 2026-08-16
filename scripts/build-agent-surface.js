#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://thewhyman.com';
const OUTPUT_DIR = path.join(ROOT, 'public');

const SOURCE_PATHS = {
  canonical: 'data/canonical.json',
  linkedin: 'data/linkedin_public.json',
  talks: 'src/data/talks.ts',
  meet: 'src/app/meet/MeetPageContent.tsx',
};

const STATIC_ROUTES = [
  '/',
  '/meet',
  '/resources',
  '/build-details',
  '/invent-details',
  '/lead-details',
  '/talks',
];

const AI_AGENTS = [
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

const ALWAYS_PRIVATE_KEYS = new Set([
  'note',
  'boundary',
  '_note',
  'internal',
  'instructions',
  'handling',
]);

const PUBLIC_LINKEDIN_FIELDS = {
  name: true,
  headline: true,
  about: true,
  skills: [true],
  sameAs: [true],
  experience: [{ role: true, company: true, period: true, description: true }],
  awards: [{ title: true, date: true }],
  featured_posts: [{ title: true, date: true, image: true, description: true, url: true }],
  recommendations: [{ author: true, title: true, quote: true }],
};

const PUBLIC_LEAK_PATTERNS = [
  { name: 'literal "not public"', pattern: /not public/i },
  { name: 'literal "Never answer"', pattern: /Never answer/ },
  { name: 'literal "Use this for"', pattern: /Use this for/ },
  {
    name: 'underscore-prefixed key marker',
    pattern: /(?:^|[\s[{(,])_[A-Za-z][\w-]*\s*(?::|\*\*:)/m,
  },
];

// A literal instruction scan cannot recognize semantically private mechanism
// detail. These terms name the wiring that canonical.json's own boundaries keep
// private. The same list both strips outcome-only blocks and fail-hard checks
// every emitted public artifact, so a newly public block cannot bypass it.
const PUBLIC_MECHANISM_DENYLIST = [
  { name: 'isolated worktree implementation', pattern: /\b(?:isolated\s+(?:git\s+)?)?worktrees?\b/i },
  { name: 'lifecycle hook implementation', pattern: /\blifecycle\s+hooks?\b/i },
  { name: 'pre-prompt hook implementation', pattern: /\bpre[-\s]?prompt(?:\s+hooks?)?\b/i },
  { name: 'session-end hook implementation', pattern: /\bsession[-\s]?end(?:\s+hooks?)?\b/i },
  { name: 'model/task routing implementation', pattern: /\b(?:model|task)\s+(?:routing|selection)\b/i },
  { name: 'jury escalation implementation', pattern: /\b(?:cross[-\s]?LLM\s+)?jury\b|\bcascad(?:ing|ed)\s+escalation\b/i },
  { name: 'gate wiring implementation', pattern: /\b(?:gate|enforcement)\s+wiring\b|\b(?:structural|semantic|hard|verification|independent[-\s]?verification)\s+gates?\b/i },
  { name: 'workflow gate implementation', pattern: /\benforced\s+in\s+(?:his|the)\s+workflow\s+as\s+a\s+gate\b/i },
  { name: 'cross-agent coordination implementation', pattern: /\bcross[-\s]?agent\s+coordination\b/i },
  { name: 'carry-forward implementation', pattern: /\bcarry[-\s]?forward\s+mechanism\b|\brehydrat(?:e|ed|ion)\b/i },
  { name: 'memory subsystem implementation', pattern: /\bmemory\s+subsystem\b|\blong[-\s]?term\s+index\b/i },
  { name: 'control-plane implementation', pattern: /\bcontrol\s+plane\b/i },
  { name: 'model right-sizing implementation', pattern: /\bmodel\s+right[-\s]?sizing\b/i },
  { name: 'security-tooling implementation', pattern: /\bsecurity\s+(?:scanning|tooling)\b|\bSonarQube\b|\bGitHub\s+Actions\s+CI\b/i },
  { name: 'render-review implementation', pattern: /\bvision[-\s]?model\s+review\b/i },
  { name: 'dangling implementation reference', pattern: /\bproduction\s+agentic\s+systems\s+on\s+it\b/i },
];

function repoPath(relativePath) {
  const resolved = path.resolve(ROOT, relativePath);
  if (resolved !== ROOT && !resolved.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error(`Refusing to access a path outside the repository: ${relativePath}`);
  }
  return resolved;
}

function readRequiredJson(relativePath) {
  let source;
  try {
    source = fs.readFileSync(repoPath(relativePath), 'utf8');
  } catch (error) {
    throw new Error(`Required JSON source ${relativePath} could not be read: ${error.message}`);
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Required JSON source ${relativePath} is not valid JSON: ${error.message}`);
  }
}

function readRequiredText(relativePath) {
  try {
    return fs.readFileSync(repoPath(relativePath), 'utf8');
  } catch (error) {
    throw new Error(`Required source ${relativePath} could not be read: ${error.message}`);
  }
}

function assertSourceShape(canonical, linkedin) {
  const requiredCanonicalKeys = [
    'basics',
    'brand',
    'howHeWorks',
    'tracks',
    'interviewQA',
    'behavioralStories',
  ];

  for (const key of requiredCanonicalKeys) {
    if (canonical[key] === undefined || canonical[key] === null) {
      throw new Error(`data/canonical.json is missing required key: ${key}`);
    }
  }

  if (!canonical.basics.name || !canonical.basics.title || !canonical.basics.summary) {
    throw new Error('data/canonical.json basics must include non-empty name, title, and summary values');
  }
  if (!Array.isArray(canonical.interviewQA) || !Array.isArray(canonical.behavioralStories)) {
    throw new Error('data/canonical.json interviewQA and behavioralStories must be arrays');
  }
  if (!linkedin || typeof linkedin !== 'object' || Array.isArray(linkedin)) {
    throw new Error('data/linkedin_public.json must contain a JSON object');
  }
}

function assertPublicationBoundaries(canonical) {
  const boundaries = canonical._publicationBoundaries;
  if (!boundaries || typeof boundaries !== 'object' || Array.isArray(boundaries)) {
    throw new Error('data/canonical.json must declare _publicationBoundaries');
  }

  const validLevels = new Set(['public', 'outcome-only', 'published-only']);
  for (const [key, declaration] of Object.entries(boundaries)) {
    if (!Object.prototype.hasOwnProperty.call(canonical, key)) {
      throw new Error(`Publication boundary references missing canonical block: ${key}`);
    }
    if (!declaration || !validLevels.has(declaration.level) || !String(declaration.justification || '').trim()) {
      throw new Error(`Publication boundary for ${key} must have a valid level and justification`);
    }
  }
}

function isAlwaysPrivateKey(key) {
  return key.startsWith('_') || ALWAYS_PRIVATE_KEYS.has(key.toLowerCase());
}

function projectPublicFields(value, allowlist, location = '$') {
  if (allowlist === true) {
    if (value !== null && typeof value === 'object') {
      throw new Error(`Public allowlist leaf ${location} unexpectedly contains an object`);
    }
    return value;
  }

  if (Array.isArray(allowlist)) {
    if (!Array.isArray(value)) return undefined;
    return value.map((item, index) => projectPublicFields(item, allowlist[0], `${location}[${index}]`));
  }

  if (!allowlist || typeof allowlist !== 'object' || !value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const projected = {};
  for (const [key, childAllowlist] of Object.entries(allowlist)) {
    if (isAlwaysPrivateKey(key) || !Object.prototype.hasOwnProperty.call(value, key)) continue;
    const child = projectPublicFields(value[key], childAllowlist, `${location}.${key}`);
    if (child !== undefined) projected[key] = child;
  }
  return projected;
}

function mechanismViolation(value) {
  return PUBLIC_MECHANISM_DENYLIST.find(({ pattern }) => pattern.test(String(value)));
}

function stripMechanismSentences(value) {
  const sentences = String(value).split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
  const publicSentences = sentences.filter((sentence) => !mechanismViolation(sentence));
  return publicSentences.join(' ').trim() || undefined;
}

function projectDeclaredValue(value, level) {
  if (typeof value === 'string') {
    return level === 'outcome-only' ? stripMechanismSentences(value) : value.trim();
  }
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => projectDeclaredValue(item, level))
      .filter((item) => item !== undefined && item !== null);
  }

  const projected = {};
  for (const [key, child] of Object.entries(value)) {
    if (isAlwaysPrivateKey(key)) continue;
    const projectedChild = projectDeclaredValue(child, level);
    if (projectedChild !== undefined) projected[key] = projectedChild;
  }
  return projected;
}

function projectCanonicalByBoundary(canonical) {
  assertPublicationBoundaries(canonical);
  const projected = {};

  for (const [key, declaration] of Object.entries(canonical._publicationBoundaries)) {
    if (declaration.level === 'published-only') {
      const block = canonical[key];
      projected[key] = projectDeclaredValue({ where: block.where, articles: block.articles }, 'public');
      continue;
    }
    projected[key] = projectDeclaredValue(canonical[key], declaration.level);
  }

  return projected;
}

function assertNoPublicLeaks(outputs) {
  for (const [filename, contents] of Object.entries(outputs)) {
    for (const leak of PUBLIC_LEAK_PATTERNS) {
      const match = contents.match(leak.pattern);
      if (match) {
        throw new Error(`Public leak guard rejected public/${filename}: ${leak.name} at ${JSON.stringify(match[0])}`);
      }
    }
    for (const mechanism of PUBLIC_MECHANISM_DENYLIST) {
      const match = contents.match(mechanism.pattern);
      if (match) {
        throw new Error(`Public mechanism guard rejected public/${filename}: ${mechanism.name} at ${JSON.stringify(match[0])}`);
      }
    }
  }
}

function extractTalkSlugs(talksSource) {
  const slugs = [...talksSource.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
  if (slugs.length === 0) {
    throw new Error('No talk slugs found in src/data/talks.ts');
  }
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('Duplicate talk slugs found in src/data/talks.ts');
  }
  return slugs;
}

function extractQuotedField(objectSource, field) {
  const match = objectSource.match(new RegExp(`\\b${field}:\\s*(['"])([\\s\\S]*?)\\1\\s*,`));
  if (!match) {
    throw new Error(`Could not read ${field} from an ENGAGEMENT_CARDS entry`);
  }
  return match[2];
}

function extractEngagementCards(meetSource) {
  // Source of truth: src/app/meet/page.tsx ENGAGEMENT_CARDS. Rates are never duplicated here.
  const declaration = meetSource.indexOf('const ENGAGEMENT_CARDS');
  const arrayStart = meetSource.indexOf('[', declaration);
  const arrayEnd = meetSource.indexOf('\n];', arrayStart);
  if (declaration === -1 || arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Could not find ENGAGEMENT_CARDS in src/app/meet/page.tsx');
  }

  const arraySource = meetSource.slice(arrayStart + 1, arrayEnd);
  const objectSources = [...arraySource.matchAll(/\{\s*icon:[\s\S]*?\n\s*\},?/g)].map((match) => match[0]);
  if (objectSources.length === 0) {
    throw new Error('ENGAGEMENT_CARDS contains no readable entries');
  }

  return objectSources.map((objectSource) => ({
    title: extractQuotedField(objectSource, 'title'),
    price: extractQuotedField(objectSource, 'price'),
    description: extractQuotedField(objectSource, 'description'),
    href: extractQuotedField(objectSource, 'ctaHref'),
  }));
}

function getLastModifiedDate() {
  try {
    return execFileSync(
      'git',
      ['-C', ROOT, 'log', '-1', '--format=%cs', '--', ...Object.values(SOURCE_PATHS)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim() || new Date().toISOString().slice(0, 10);
  } catch {
    const newestMtime = Math.max(
      ...Object.values(SOURCE_PATHS).map((sourcePath) => fs.statSync(repoPath(sourcePath)).mtimeMs),
    );
    return new Date(newestMtime).toISOString().slice(0, 10);
  }
}

function writeBuildMeta(lastModifiedDate) {
  // The middleware must not fabricate Last-Modified. It previously stamped
  // new Date() on every request, which told every cache and agent the page had
  // just changed — a false freshness signal, the same class of defect as the
  // 1970 epoch fallback. This exports the REAL source date instead.
  // Underscore-prefixed files in functions/ are not routed, so this is importable
  // without becoming an endpoint.
  const httpDate = new Date(`${lastModifiedDate}T00:00:00Z`).toUTCString();
  const out = `// AUTO-GENERATED by scripts/build-agent-surface.js — DO NOT EDIT\nexport const SOURCE_LAST_MODIFIED = ${JSON.stringify(httpDate)};\n`;
  const dir = path.join(ROOT, 'functions');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '_build-meta.js'), out);
  return httpDate;
}

function xmlEscape(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character]);
}

function firstSentence(value) {
  const text = String(value || '').trim();
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

function humanize(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase());
}

function renderMarkdownValue(value, level = 3) {
  if (value === null || value === undefined) return '_Not provided._';
  if (typeof value !== 'object') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '_None._';
    if (value.every((item) => typeof item !== 'object' || item === null)) {
      return value.map((item) => `- ${String(item)}`).join('\n');
    }

    return value.map((item, index) => {
      const titleKey = ['title', 'q', 'question', 'name', 'story', 'role'].find((key) => item?.[key]);
      const title = titleKey ? item[titleKey] : `Entry ${index + 1}`;
      const remaining = Object.entries(item || {}).filter(([key]) => key !== titleKey);
      const body = remaining.map(([key, child]) => renderMarkdownEntry(key, child, level + 1)).join('\n\n');
      return `${'#'.repeat(Math.min(level, 6))} ${title}\n\n${body}`;
    }).join('\n\n');
  }

  return Object.entries(value)
    .map(([key, child]) => renderMarkdownEntry(key, child, level))
    .join('\n\n');
}

function renderMarkdownEntry(key, value, level = 3) {
  if (value === null || typeof value !== 'object') {
    return `- **${humanize(key)}:** ${value === null ? 'Not provided' : String(value)}`;
  }
  return `${'#'.repeat(Math.min(level, 6))} ${humanize(key)}\n\n${renderMarkdownValue(value, level + 1)}`;
}

// Each named agent gets its OWN group carrying BOTH the Content-Signal and the
// Allow. This is deliberately redundant, because the two obvious structures each
// fail a different reader:
//
//   one group per agent with only "Allow: /"   -> per RFC 9309 a named agent
//     obeys its own group and IGNORES the "*" group, so the Content-Signal never
//     reaches it. The policy is inert for exactly the crawlers it targets.
//
//   13 consecutive User-agent lines sharing one group -> RFC-correct, but real
//     parsers vary; isagentready attributes the directives only to the LAST
//     agent listed and reports the other twelve as "not mentioned".
//
// Repeating both directives per agent is unambiguous under either reading.
function buildRobots() {
  const groups = [
    `User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /`,
    ...AI_AGENTS.map((agent) => `User-agent: ${agent}\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /`),
  ];
  return `${groups.join('\n\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// Published slide decks live as static HTML under public/presentations/ rather
// than as App Router routes, so they must be discovered from disk. Deck ENTRY
// POINTS are indexed; individual slide-NN pages are not — they are fragments of
// one deck, and indexing them separately fragments the content an agent would
// otherwise read as a single piece.
function discoverPresentationRoutes() {
  const dir = repoPath('public/presentations');
  if (!fs.existsSync(dir)) return [];
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      routes.push(`/presentations/${entry.name.replace(/\.html$/, '')}`);
    } else if (entry.isDirectory()) {
      if (fs.existsSync(path.join(dir, entry.name, 'index.html'))) {
        routes.push(`/presentations/${entry.name}`);
      }
    }
  }
  return routes.sort();
}

function buildSitemap(talkSlugs, lastModified) {
  const routes = [
    ...STATIC_ROUTES,
    ...talkSlugs.map((slug) => `/talks/${slug}`),
    ...discoverPresentationRoutes(),
  ];
  const urls = routes.map((route) => [
    '  <url>',
    `    <loc>${xmlEscape(`${SITE_URL}${route}`)}</loc>`,
    `    <lastmod>${xmlEscape(lastModified)}</lastmod>`,
    '  </url>',
  ].join('\n')).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

function trackDescription(track) {
  const firstEntry = track?.projects?.[0] || track?.wins?.[0];
  if (!firstEntry) return 'Selected work, decisions, and outcomes.';
  const achievement = firstEntry.achievements?.[0];
  return [firstEntry.title, achievement].filter(Boolean).join(' — ');
}

function buildLlms(canonical) {
  const { basics, brand, howHeWorks, tracks } = canonical;
  return [
    `# ${basics.name} — The Why Man`,
    '',
    `> ${basics.summary}`,
    '',
    '## Profile',
    '',
    `- [Home](${SITE_URL}/): ${basics.title}.`,
    `- [Meet](${SITE_URL}/meet): Book a recruiter conversation, consulting session, invited meeting, or introduction. ${firstSentence(howHeWorks.decideDoneFirst)}`,
    '',
    '## Work',
    '',
    `- [Build](${SITE_URL}/build-details): ${trackDescription(tracks.build)}`,
    `- [Invent](${SITE_URL}/invent-details): ${trackDescription(tracks.invent)}`,
    `- [Lead](${SITE_URL}/lead-details): ${trackDescription(tracks.lead)}`,
    '',
    '## Resources and talks',
    '',
    `- [Resources](${SITE_URL}/resources): Writing, projects, and the origin of The Why Man. ${firstSentence(brand.originStory)}`,
    `- [Talks](${SITE_URL}/talks): Public talks and presentation materials by ${basics.name}.`,
    '',
    '## Agent resources',
    '',
    `- [Full profile](${SITE_URL}/llms-full.txt): Expanded canonical profile, interview Q&A, behavioral stories, and work tracks.`,
    `- [Agent guide](${SITE_URL}/AGENTS.md): Site map, canonical sources, and API usage.`,
    `- [Pricing](${SITE_URL}/pricing.md): Public meeting and consulting rates.`,
    `- [Chat API](${SITE_URL}/openapi.json): OpenAPI 3.1 description of the concierge endpoint.`,
    '',
  ].join('\n');
}

function buildLlmsFull(canonical, linkedin) {
  return [
    `# ${canonical.basics.name} — Full Agent Profile`,
    '',
    `> ${canonical.basics.summary}`,
    '',
    '## Main routes',
    '',
    ...STATIC_ROUTES.map((route) => `- [${route === '/' ? 'Home' : humanize(route.slice(1))}](${SITE_URL}${route}): Canonical site content for ${route === '/' ? canonical.basics.name : route.slice(1).replace(/-/g, ' ')}.`),
    '',
    '## Basics',
    '',
    renderMarkdownValue(canonical.basics),
    '',
    '## Brand',
    '',
    renderMarkdownValue(canonical.brand),
    '',
    '## How he works',
    '',
    renderMarkdownValue(canonical.howHeWorks),
    '',
    '## Tracks',
    '',
    renderMarkdownValue(canonical.tracks),
    '',
    '## Interview Q&A',
    '',
    renderMarkdownValue(canonical.interviewQA),
    '',
    '## Behavioral stories',
    '',
    renderMarkdownValue(canonical.behavioralStories),
    '',
    '## Why Exponential OS',
    '',
    renderMarkdownValue(canonical.whyExponentialOs),
    '',
    '## Co-Dialectic',
    '',
    renderMarkdownValue(canonical.coDialecticDepth),
    '',
    '## Published writing',
    '',
    renderMarkdownValue(canonical.writingLibrary),
    '',
    '## AI Fund lessons',
    '',
    renderMarkdownValue(canonical.aiFundLessons),
    '',
    // Declared public in _publicationBoundaries but previously never rendered.
    // The publication decision was already made in canonical.json; the renderer
    // simply had not caught up, so approved content never reached the surface.
    // A test below asserts declared === rendered so this cannot drift again.
    '## Leadership',
    '',
    renderMarkdownValue(canonical.leadershipStyle),
    '',
    '## Domain depth',
    '',
    renderMarkdownValue(canonical.domainDepth),
    '',
    '## Speaking',
    '',
    renderMarkdownValue(canonical.speaking),
    '',
    '## Public LinkedIn profile',
    '',
    renderMarkdownValue(linkedin),
    '',
  ].join('\n');
}

function buildAgents(canonical, linkedin) {
  const headline = linkedin.headline || canonical.basics.title;
  return [
    `# Agent guide for ${SITE_URL}`,
    '',
    '## Who this site is about',
    '',
    `This is the official professional site for ${canonical.basics.name}, ${headline}.`,
    '',
    canonical.basics.summary,
    '',
    '## What agents can find',
    '',
    `- [Home](${SITE_URL}/): professional overview and primary navigation.`,
    `- [Meet](${SITE_URL}/meet): public engagement options, rates, and booking links.`,
    `- [Resources](${SITE_URL}/resources): writing and project resources.`,
    `- [Build](${SITE_URL}/build-details), [Invent](${SITE_URL}/invent-details), and [Lead](${SITE_URL}/lead-details): evidence grouped by professional track.`,
    `- [Talks](${SITE_URL}/talks): public talk abstracts and presentation materials.`,
    `- [llms.txt](${SITE_URL}/llms.txt) and [llms-full.txt](${SITE_URL}/llms-full.txt): concise and expanded machine-readable profiles.`,
    `- [pricing.md](${SITE_URL}/pricing.md): machine-readable public engagement rates.`,
    '',
    '## Public machine-readable sources',
    '',
    `- [Concise profile](${SITE_URL}/llms.txt)`,
    `- [Expanded public profile](${SITE_URL}/llms-full.txt)`,
    `- [Public engagement rates](${SITE_URL}/pricing.md)`,
    '',
    '## Concierge API',
    '',
    `- Endpoint: \`POST ${SITE_URL}/api/chat\``,
    `- Contract: [OpenAPI 3.1](${SITE_URL}/openapi.json)`,
    '- Request body: a `messages` array whose entries contain `role` (`user`, `bot`, or `assistant`) and string `content`.',
    '- The endpoint streams `text/event-stream` by default. Add `?stream=0` for a buffered JSON response containing `role` and `content`.',
    '',
  ].join('\n');
}

function buildPricing(cards) {
  return [
    '# Engagement pricing',
    '',
    '> Public engagement options and rates from the booking cards on the Meet page.',
    '',
    '## Options',
    '',
    ...cards.flatMap((card) => [
      `### ${card.title}`,
      '',
      `- **Rate and duration:** ${card.price}`,
      `- **Best for:** ${card.description}`,
      `- [Book ${card.title}](${card.href})`,
      '',
    ]),
    `See [Meet](${SITE_URL}/meet) for the current public presentation of these options.`,
    '',
  ].join('\n');
}

function buildOpenApi() {
  return `${JSON.stringify({
    openapi: '3.1.0',
    info: {
      title: 'The Why Man Concierge API',
      version: '1.0.0',
      description: 'The public chat endpoint used by thewhyman.com to answer questions about Anand Vallamsetla.',
    },
    servers: [{ url: SITE_URL }],
    paths: {
      '/api/chat': {
        post: {
          operationId: 'chatWithWhyManConcierge',
          summary: 'Send a conversation to The Why Man Concierge',
          parameters: [
            {
              name: 'stream',
              in: 'query',
              required: false,
              description: 'The handler streams SSE unless this value is exactly 0. Use 0 for buffered JSON.',
              schema: { type: 'string' },
            },
            {
              name: 'ctx',
              in: 'query',
              required: false,
              description: 'The handler forces the full canonical knowledge context only when this value is full; other values use automatic context selection.',
              schema: { type: 'string' },
            },
            {
              name: 'model',
              in: 'query',
              required: false,
              description: 'Known aliases are kimi, fast, gemma, qwen, scout, and mistral. Any missing or unknown value falls back to mistral.',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChatRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'An SSE stream by default, or a JSON chat response when streaming is disabled or unavailable.',
              content: {
                'text/event-stream': {
                  schema: {
                    type: 'string',
                    description: 'Opaque server-sent event stream returned by Cloudflare Workers AI.',
                  },
                },
                'application/json': {
                  schema: { $ref: '#/components/schemas/ChatResponse' },
                },
              },
            },
            400: {
              description: 'No supported messages were supplied. The handler returns a JSON-encoded error body without an explicit JSON Content-Type header.',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    contentMediaType: 'application/json',
                    examples: ['{"error":"No messages"}'],
                  },
                },
              },
            },
            500: {
              description: 'The request could not be processed.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ChatMessage: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            role: { type: 'string', enum: ['user', 'bot', 'assistant'] },
            content: { type: 'string' },
          },
          additionalProperties: true,
        },
        ChatRequest: {
          type: 'object',
          required: ['messages'],
          properties: {
            messages: {
              type: 'array',
              items: { $ref: '#/components/schemas/ChatMessage' },
            },
          },
          additionalProperties: true,
        },
        ChatResponse: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            role: { const: 'bot' },
            content: { type: 'string' },
          },
          additionalProperties: false,
        },
        ErrorResponse: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
          },
          additionalProperties: false,
        },
      },
    },
  }, null, 2)}\n`;
}

function buildHeaders() {
  // CSP rolls out in Report-Only mode first. Promote this exact policy to an
  // enforcing Content-Security-Policy only after production reports show zero
  // violations: blocked hydration/GA code can look rendered while being inert.
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https://media.licdn.com https://substack-post-media.s3.amazonaws.com https://substackcdn.com https://*.google-analytics.com https://*.googletagmanager.com",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "frame-src 'self' https://docs.google.com",
    "form-action 'self'",
  ].join('; ');

  return [
    '/*',
    '  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    '  X-Frame-Options: SAMEORIGIN',
    `  Content-Security-Policy-Report-Only: ${contentSecurityPolicy}`,
    '  Link: </llms.txt>; rel="alternate"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"',
    '',
  ].join('\n');
}

function writeOutputs(outputs) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const stagedFiles = [];

  try {
    for (const [filename, contents] of Object.entries(outputs)) {
      if (!contents || contents.trim().length === 0) {
        throw new Error(`Refusing to emit empty file: public/${filename}`);
      }
      const stagedPath = path.join(OUTPUT_DIR, `.${filename}.${process.pid}.tmp`);
      fs.writeFileSync(stagedPath, contents, 'utf8');
      stagedFiles.push({ filename, stagedPath, targetPath: path.join(OUTPUT_DIR, filename) });
    }

    for (const file of stagedFiles) {
      fs.renameSync(file.stagedPath, file.targetPath);
    }
  } catch (error) {
    for (const file of stagedFiles) {
      if (fs.existsSync(file.stagedPath)) fs.unlinkSync(file.stagedPath);
    }
    throw error;
  }
}

function main() {
  // Load and validate every required source before writing any output. A bad source
  // must fail the build without leaving a partially generated agent surface.
  const canonical = readRequiredJson(SOURCE_PATHS.canonical);
  const linkedin = readRequiredJson(SOURCE_PATHS.linkedin);
  assertSourceShape(canonical, linkedin);
  const publicCanonical = projectCanonicalByBoundary(canonical);
  const publicLinkedin = projectPublicFields(linkedin, PUBLIC_LINKEDIN_FIELDS, 'linkedin');
  assertSourceShape(publicCanonical, publicLinkedin);

  const talksSource = readRequiredText(SOURCE_PATHS.talks);
  const meetSource = readRequiredText(SOURCE_PATHS.meet);
  const talkSlugs = extractTalkSlugs(talksSource);
  const engagementCards = extractEngagementCards(meetSource);
  const lastModified = getLastModifiedDate();
  const lastModifiedHttp = writeBuildMeta(lastModified);

  const outputs = {
    'robots.txt': buildRobots(),
    'sitemap.xml': buildSitemap(talkSlugs, lastModified),
    'llms.txt': buildLlms(publicCanonical),
    'llms-full.txt': buildLlmsFull(publicCanonical, publicLinkedin),
    'AGENTS.md': buildAgents(publicCanonical, publicLinkedin),
    'pricing.md': buildPricing(engagementCards),
    'openapi.json': buildOpenApi(),
    '_headers': buildHeaders(),
  };

  assertNoPublicLeaks(outputs);

  writeOutputs(outputs);

  console.log('Generated agent surface:');
  for (const [filename, contents] of Object.entries(outputs)) {
    console.log(`  public/${filename} (${Buffer.byteLength(contents, 'utf8')} bytes)`);
  }
}

try {
  main();
} catch (error) {
  console.error(`build-agent-surface failed: ${error.message}`);
  process.exit(1);
}
