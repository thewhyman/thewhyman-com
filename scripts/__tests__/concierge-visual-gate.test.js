// Mirror of pickVisual from WhyManConcierge.tsx
function makePicker() {
  const shown = new Set();
  return function pickVisual(question) {
    const q = question.toLowerCase();
    const harnessAsk = ['exponential os','exponentialos','your harness','his harness','the harness',
      'multi-agent harness','agent harness','harness architecture','system architecture',
      'how is it built','how does it work','show me the architecture','control plane',
      'memory layer','what are the layers','diagram'];
    const codiAsk = ['co-dialectic','codialectic','codi','open source','open-source','socratic',
      'dialectic','prompt optimizer','prompt quality'];
    const wantsHarness = harnessAsk.some(k => q.includes(k));
    const wantsCodi = !wantsHarness && codiAsk.some(k => q.includes(k));
    const choice = wantsHarness ? 'harness' : wantsCodi ? 'codi' : undefined;
    if (!choice) return undefined;
    if (shown.has(choice)) return undefined;
    shown.add(choice);
    return choice;
  };
}

const cases = [
  // [question, expected]  — the three that FAILED live on 2026-08-11
  ["What does Anand do?", undefined],
  ["Tell me about his Google experience", undefined],
  ["What is his biggest failure?", undefined],
  // ordinary recruiter questions that must stay clean
  ["Is he hands-on or a manager?", undefined],
  ["What is his AI depth?", undefined],
  ["Why did the AI Fund role end?", undefined],
  ["What scale has he operated at?", undefined],
  ["Tell me about a time he disagreed with leadership", undefined],
  ["What are his salary expectations?", undefined],
  ["Does he do machine learning research?", undefined],
  ["What has he written about evals?", undefined],
  ["Why is he called The Why Man?", undefined],
  // genuine asks that SHOULD show the diagram
  ["What is Exponential OS?", 'harness'],
  ["Show me the architecture of his harness", undefined], // 2nd harness ask -> suppressed
];

let fail = 0;
const pick = makePicker();
for (const [q, expected] of cases) {
  const got = pick(q);
  const ok = got === expected;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${JSON.stringify(q)} -> ${got} (expected ${expected})`);
}

// codi path, fresh conversation
const pick2 = makePicker();
const codiCases = [["Tell me about Co-Dialectic", 'codi'], ["is codi open source?", undefined]];
for (const [q, expected] of codiCases) {
  const got = pick2(q);
  const ok = got === expected;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${JSON.stringify(q)} -> ${got} (expected ${expected})`);
}

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
