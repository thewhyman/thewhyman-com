#!/usr/bin/env node
/**
 * Builds the AI Search corpus from canonical.json + linkedin_public.json.
 *
 * WHY ONE FILE PER IDEA, NOT ONE FILE PER JSON BLOCK
 * Retrieval quality is decided by chunk boundaries. A single 12k-token JSON blob
 * chunks arbitrarily — a chunk can start mid-project and end mid-sentence, so the
 * embedding describes a fragment nobody asked about. Each interview answer, each
 * STAR story and each project is already a self-contained idea, so each becomes
 * its own document with a title and tags. That gives the retriever units that
 * mean something on their own.
 *
 * WHAT DELIBERATELY STAYS OUT OF RETRIEVAL
 * `basics` and `keyMetricsTripwire` are NOT emitted here. They are the ONLY two
 * deliberate exclusions; every other top-level section in canonical.json must be
 * emitted, and scripts/__tests__ enforces that so the corpus cannot silently drift
 * behind canonical.json again. They stay pinned in the
 * system prompt on every request. The tripwire is the authoritative numbers list
 * that governs every figure the bot states; if a semantic retriever failed to
 * return it for, say, a leadership question, the model would be free to invent
 * numbers. Retrieval decides what is RELEVANT — it must never decide what is
 * TRUE. Together they are ~560 tokens, which is cheap insurance.
 *
 * Usage:  node scripts/build-ai-search-corpus.js [outDir]
 */

const fs = require('fs');
const path = require('path');

const canonical = require('../data/canonical.json');
const linkedin = require('../data/linkedin_public.json');

const outDir = process.argv[2] || path.join(__dirname, '../.ai-search-corpus');
fs.mkdirSync(outDir, { recursive: true });

const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const docs = [];
const add = (name, title, tags, body) => {
  if (!body || !body.trim()) return;
  docs.push({
    name,
    text: `# ${title}\n\ntags: ${tags.join(', ')}\n\n${body.trim()}\n`,
  });
};

const asText = (v, indent = '') => {
  if (v == null) return '';
  if (typeof v === 'string') return indent + v;
  if (Array.isArray(v)) return v.map((x) => asText(x, indent + '- ').replace(/^- - /, '- ')).join('\n');
  if (typeof v === 'object') {
    return Object.entries(v)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, val]) => `${indent}${k}: ${typeof val === 'object' ? '\n' + asText(val, indent + '  ') : val}`)
      .join('\n');
  }
  return indent + String(v);
};

// ── how he works: the method block, one doc ─────────────────────────────────
if (canonical.howHeWorks) {
  add('how-he-works', 'How Anand works — operating method',
      ['method', 'execution', 'process', 'how he works', 'discipline', 'judgment', 'decision making'],
      asText(canonical.howHeWorks));
}

// ── the sections that describe HOW HE OPERATES, one doc per idea ────────────
// These were present in canonical.json but never emitted, so a rebuild silently
// produced a corpus missing ~20KB of real content. build-cloudflare-function.js
// already registers every one of them as a retrievable block; this file had
// simply drifted behind it. Parity is the invariant: a section the chatbot can
// retrieve must also exist in the search corpus, or the two surfaces disagree.
const SECTION_DOCS = [
  ['leadershipStyle', 'leadership-style',
   'How Anand leads — style, culture and the bar he sets',
   ['leadership', 'management style', 'culture', 'how he leads', 'team', 'postmortem']],
  ['seniorSignals', 'senior-signals',
   'Seniority signals — how Anand operates at executive altitude',
   ['seniority', 'executive', 'judgment', 'scope', 'ai adoption', 'productivity', 'culture under pressure']],
  ['domainDepth', 'domain-depth',
   'Domain depth — industries, compliance and systems Anand has owned',
   ['industries', 'compliance', 'domain', 'regulated', 'fisma', 'hipaa', 'pci']],
  ['education', 'education',
   'Education, degrees and certifications',
   ['education', 'degree', 'mba', 'emba', 'berkeley', 'haas', 'credentials', 'certifications']],
  ['speaking', 'speaking',
   'Speaking, teaching and talks',
   ['speaking', 'teaching', 'talks', 'conference', 'instructor', 'workshop']],
];
for (const [key, name, title, tags] of SECTION_DOCS) {
  if (canonical[key]) add(name, title, tags, asText(canonical[key]));
}

// ── growth areas: one doc per area, each carrying the framing ───────────────
// Split per area for the chunking reason at the top of this file. The framing
// rules ride along in EVERY area doc on purpose: they are what stop an answer
// becoming "he struggles with X" or an interpersonal deficit, and retrieval must
// never be able to return the flaw without the rule that governs how it is said.
// Same principle as the pinned tripwire — retrieval decides relevance, never truth.
if (canonical.growthAreas) {
  const g = canonical.growthAreas;
  const framing = [
    g.framingRules ? `HOW THIS MUST BE FRAMED: ${g.framingRules}` : '',
    g.answerShape ? `ANSWER SHAPE: ${g.answerShape}` : '',
  ].filter(Boolean).join('\n\n');
  const areas = Array.isArray(g.areas) ? g.areas : [];
  areas.forEach((a) => {
    add(`growth-area-${slug(a.area)}`, `Growth area — ${a.area}`,
        ['growth areas', 'weaknesses', 'development', 'blind spots', 'self-awareness', a.area],
        [framing, '', asText(a)].filter(Boolean).join('\n'));
  });
  if (!areas.length) {
    add('growth-areas', 'Growth areas', ['growth areas', 'weaknesses'], asText(g));
  }
}

// ── origin story ────────────────────────────────────────────────────────────
if (canonical.brand) {
  add('brand-origin', 'Origin of the name "The Why Man"',
      ['name', 'brand', 'origin story', 'why man', 'nickname'],
      asText(canonical.brand));
}

// ── one doc per PROJECT inside each track ───────────────────────────────────
for (const [track, data] of Object.entries(canonical.tracks || {})) {
  const projects = (data && data.projects) || [];
  projects.forEach((p) => {
    const body = [
      p.period ? `Period: ${p.period}` : '',
      p.role ? `Role: ${p.role}` : '',
      p.link ? `Link: ${p.link}` : '',
      '',
      ...(p.achievements || []).map((a) => `- ${a}`),
    ].filter(Boolean).join('\n');
    add(`project-${track}-${slug(p.title)}`, p.title,
        [track, 'project', 'what he built', p.title], body);
  });
  // anything on the track that is not the project list
  const rest = Object.fromEntries(Object.entries(data || {}).filter(([k]) => k !== 'projects'));
  if (Object.keys(rest).length) {
    add(`track-${track}-overview`, `${track.toUpperCase()} track — overview`,
        [track, 'overview'], asText(rest));
  }
}

// ── one doc per interview Q&A: these are natural retrieval units ────────────
(canonical.interviewQA || []).forEach((qa) => {
  add(`interview-${slug(qa.q)}`, qa.q,
      ['interview question', 'fit', 'screening', qa.q], qa.a);
});

// ── one doc per behavioural STAR story ──────────────────────────────────────
(canonical.behavioralStories || []).forEach((s) => {
  add(`behavioral-${slug(s.question)}`, s.question,
      ['behavioural', 'tell me about a time', 'STAR', s.story || ''].filter(Boolean),
      [s.story ? `Situation: ${s.story}` : '', s.answer || ''].filter(Boolean).join('\n\n'));
});

// ── depth blocks ────────────────────────────────────────────────────────────
const depth = [
  ['exponential-os', 'Exponential OS — what it is', ['exponential os', 'harness', 'architecture', 'layers'], canonical.exponentialOsDepth],
  ['why-exponential-os', 'Why he built his own harness', ['why', 'harness', 'loyalty', 'compounding', 'motivation'], canonical.whyExponentialOs],
  ['co-dialectic', 'Co-Dialectic — open source prompt optimizer', ['co-dialectic', 'codi', 'open source', 'prompt'], canonical.coDialecticDepth],
  ['writing-library', 'What Anand has written', ['writing', 'articles', 'substack', 'thought leadership'], canonical.writingLibrary],
];
depth.forEach(([n, t, tags, data]) => add(n, t, tags, asText(data)));

// ── AI Fund lessons: one doc per lesson keeps attributions with their lesson ─
const af = canonical.aiFundLessons;
if (af) {
  if (af.metaThesis) add('ai-fund-meta-thesis', 'AI Fund — the meta thesis',
      ['ai fund', 'andrew ng', 'lessons', 'product judgment'], asText(af.metaThesis));
  const lessons = af.lessons || [];
  (Array.isArray(lessons) ? lessons : Object.values(lessons)).forEach((l, i) => {
    const title = (l && (l.title || l.lesson)) || `AI Fund lesson ${i + 1}`;
    add(`ai-fund-lesson-${i + 1}-${slug(title)}`, `AI Fund lesson: ${title}`,
        ['ai fund', 'andrew ng', 'lessons', 'product judgment', 'eir'], asText(l));
  });
  const rest = Object.fromEntries(Object.entries(af).filter(([k]) => !['lessons', 'metaThesis'].includes(k) && !k.startsWith('_')));
  if (Object.keys(rest).length) add('ai-fund-context', 'AI Fund — context and attributions',
      ['ai fund', 'attributions', 'andrew ng'], asText(rest));
}

// ── chronology ──────────────────────────────────────────────────────────────
add('chronology', 'Chronological history (LinkedIn)',
    ['chronology', 'dates', 'employers', 'titles', 'timeline'], asText(linkedin));

// ── write ───────────────────────────────────────────────────────────────────
let bytes = 0;
for (const d of docs) {
  const f = path.join(outDir, `${d.name}.md`);
  fs.writeFileSync(f, d.text);
  bytes += d.text.length;
}

const sizes = docs.map((d) => d.text.length).sort((a, b) => a - b);
const median = sizes[Math.floor(sizes.length / 2)] || 0;
console.log(`✅ ${docs.length} documents → ${outDir}`);
console.log(`   total ${(bytes / 1024).toFixed(1)}KB · median doc ~${Math.round(median / 4)} tokens · largest ~${Math.round(sizes[sizes.length - 1] / 4)} tokens`);
console.log(`   NOT emitted (pinned in the prompt instead): basics, keyMetricsTripwire`);
