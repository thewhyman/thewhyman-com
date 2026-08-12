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
 * `basics` and `keyMetricsTripwire` are NOT emitted here. They stay pinned in the
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
