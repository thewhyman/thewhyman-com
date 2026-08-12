// Pins the OPENING chip row of the concierge.
//
// Two regressions this guards against:
//   1. The row had silently drifted to three Exponential OS chips out of five —
//      a product pitch to a recruiter who came to evaluate a candidate.
//   2. The chips were all narrow specifics. A real interviewer opens broad
//      ("tell me about yourself", then "tell me about his leadership") and
//      narrows from the answer.
//
// This test reads the REAL component source and re-derives the row from the
// same rules the component uses. It deliberately asserts on properties of the
// row rather than on five hardcoded titles, so renaming a chip does not break
// it but losing a whole category does.

const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../../src/components/WhyManConcierge.tsx', 'utf8');

// --- parse the QUESTIONS array out of the component -------------------------
const arrayStart = src.indexOf('const QUESTIONS: Q[] = [');
if (arrayStart === -1) { console.error('FAIL: QUESTIONS array not found'); process.exit(1); }
const arrayBody = src.slice(arrayStart, src.indexOf('\n  ];', arrayStart));

const entries = [...arrayBody.matchAll(/\{\s*chip:\s*"([^"]+)"[\s\S]*?\},?\n/g)].map(m => {
  const body = m[0];
  return {
    chip: m[1],
    dim: (body.match(/dim:\s*'(BUILD|INVENT|LEAD)'/) || [])[1],
    opener: /opener:\s*true/.test(body),
    broad: /broad:\s*true/.test(body),
  };
}).filter(e => e.chip);

// --- mirror OPENING_SLOTS + pickOpeners from the component ------------------
const slotMatch = src.match(/const OPENING_SLOTS[^=]*=\s*\[([\s\S]*?)\];/);
if (!slotMatch) { console.error('FAIL: OPENING_SLOTS not found'); process.exit(1); }
const OPENING_SLOTS = [...slotMatch[1].matchAll(/'(LEAD|BUILD|INVENT|HUMAN)'/g)].map(m => m[1]);

function pickOpeners(pool) {
  const out = [];
  const take = (want, broadOnly) =>
    pool.find(q =>
      !out.includes(q) &&
      (broadOnly ? q.broad : (q.broad || q.opener)) &&
      (want === 'HUMAN' ? !q.dim : q.dim === want));
  for (const want of OPENING_SLOTS) {
    const q = take(want, true) ?? take(want, false);
    if (q) out.push(q);
  }
  for (const q of pool) {
    if (out.length >= 5) break;
    if (!out.includes(q) && (q.broad || q.opener)) out.push(q);
  }
  return out.slice(0, 5);
}

const row = pickOpeners(entries);
let fail = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  <- ' + detail}`);
  if (!cond) fail++;
};

console.log('\nopening row:');
row.forEach((r, i) => console.log(`  ${i + 1}. ${r.chip}${r.dim ? '  [' + r.dim + ']' : '  [human]'}`));
console.log('');

check('row has 5 chips', row.length === 5, `got ${row.length}`);

// Broad-to-narrow: the opening row offers themes, not specifics.
check('every opening chip is broad', row.every(r => r.broad),
  'narrow chips leaked into the opening row: ' + row.filter(r => !r.broad).map(r => r.chip).join(', '));

// The universal interview opener leads.
check('first chip is the "tell me about" opener', /tell me about/i.test(row[0]?.chip ?? ''),
  `first chip is "${row[0]?.chip}"`);

// Category breadth — the site is organised around these three.
for (const dim of ['BUILD', 'INVENT', 'LEAD']) {
  check(`covers ${dim}`, row.some(r => r.dim === dim), `no ${dim} chip in the opening row`);
}

// The original bug: product chips dominating a candidate evaluation.
const buildCount = row.filter(r => r.dim === 'BUILD').length;
check('at most 1 BUILD chip (was 3 — the reported bug)', buildCount <= 1, `${buildCount} BUILD chips`);

// No Exponential OS product chip in the first impression.
check('no product-name chip in the opening row',
  !row.some(r => /exponential os|harness|memory layer|constitution|co-dialectic/i.test(r.chip)),
  'product chip present: ' + row.filter(r => /exponential os|harness|memory layer|constitution|co-dialectic/i.test(r.chip)).map(r => r.chip).join(', '));

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
