// Verifies the concierge's per-question context selection.
//
// The knowledge base is ~15,200 tokens and used to be sent in full on EVERY
// request; a typical question needs a fraction of it. Prompt processing is the
// floor under answer latency, so that waste WAS the "chatbot takes 10 seconds"
// complaint.
//
// This reads the GENERATED function so it tests what actually ships, and it
// asserts two things that matter in opposite directions:
//   1. selection actually shrinks the prompt (the point), and
//   2. questions that need a block still GET it (the risk).
//
// A miss here means a recruiter gets a thin or wrong answer, which is worse
// than a slow one — so unmatched questions deliberately fall back to the full
// knowledge base.

const fs = require('fs');
const gen = fs.readFileSync(__dirname + '/../../functions/api/chat.js', 'utf8');

const blocksMatch = gen.match(/const KB_BLOCKS = (\[[\s\S]*?\]);\n/);
if (!blocksMatch) { console.error('FAIL: KB_BLOCKS not found in generated function'); process.exit(1); }
const KB_BLOCKS = JSON.parse(blocksMatch[1]);

const tok = s => Math.ceil(s.length / 4);
const FULL = KB_BLOCKS.reduce((n, b) => n + tok(b.json), 0);

// Mirrors the generated function's word-boundary matcher.
const hasKey = (text, k) =>
  new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9])').test(text);

function select(q) {
  const l = q.toLowerCase();
  const matched = KB_BLOCKS.filter(b => !b.always && b.keys.some(k => hasKey(l, k)));
  return matched.length ? KB_BLOCKS.filter(b => b.always || matched.includes(b)) : KB_BLOCKS;
}

let fail = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  <- ' + detail}`);
  if (!cond) fail++;
};

// [question, block that MUST be selected]
const cases = [
  ["Tell me about Anand — who he is and what he's known for.", null],
  ["Tell me about Anand's leadership — team sizes and scope.", 'tracks_lead'],
  ["How does Anand execute and ship?",                         'tracks_build'],
  ["What has Anand invented or taken from zero to one?",       'tracks_invent'],
  ["What's the story behind the name 'The Why Man'?",          'brand'],
  ["Tell me about a time something failed.",                   'behavioralStories'],
  ["What is Exponential OS and what are its layers?",          'exponentialOsDepth'],
  ["Why did he build his own harness?",                        'whyExponentialOs'],
  ["What is Co-Dialectic?",                                    'coDialecticDepth'],
  ["What did he learn at AI Fund?",                            'aiFundLessons'],
  ["What has he written about?",                               'writingLibrary'],
  ["Why is he looking for a new role?",                        'interviewQA'],
  ["What scale has he operated at?",                           'tracks_lead'],
  ["Is he hands-on or a manager?",                             'interviewQA'],
];

console.log(`full knowledge base: ~${FULL.toLocaleString()} tokens\n`);
let totalPct = 0, measured = 0;

for (const [q, mustHave] of cases) {
  const sel = select(q);
  const size = sel.reduce((n, b) => n + tok(b.json), 0);
  const pct = Math.round((size / FULL) * 100);
  const names = sel.map(b => b.name);
  const isFallback = sel.length === KB_BLOCKS.length;
  totalPct += pct; measured++;
  console.log(`  ~${String(size).padStart(6)} tok (${String(pct).padStart(3)}%)  ${isFallback ? 'FULL-FALLBACK' : names.filter(n => !['basics','keyMetricsTripwire'].includes(n)).join(',')}   "${q.slice(0, 44)}"`);
  if (mustHave) check(`  selects ${mustHave}`, names.includes(mustHave), `got ${names.join(',')}`);
}

console.log('');
// The authoritative-numbers block must never be dropped — the prompt says it
// governs every figure, so losing it invites invented numbers.
check('keyMetricsTripwire is always present',
  cases.every(([q]) => select(q).some(b => b.name === 'keyMetricsTripwire')), 'a question dropped it');
check('basics is always present',
  cases.every(([q]) => select(q).some(b => b.name === 'basics')), 'a question dropped it');

const avg = Math.round(totalPct / measured);
console.log(`\naverage prompt size: ${avg}% of full KB`);
check('selection meaningfully shrinks the prompt (avg < 60%)', avg < 60, `avg ${avg}%`);

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
