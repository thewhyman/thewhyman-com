/**
 * Disclosure-boundary regression test.
 *
 * WHY THIS EXISTS (2026-09-10):
 * The concierge was volunteering what a technical disagreement COST Anand personally
 * ("he was removed from a project") in answer to the generic "his leadership" chip.
 * That fact is true and it is a strength story when a recruiter asks a probe question.
 * It is a liability when volunteered unprompted, because a recruiter skimming an answer
 * pattern-matches "removed from a project" long before they read the vindication that
 * follows it. Two blocks carried the fact: leadershipStyle (fires on lead/manage/team/
 * culture/style — the most common recruiter query class) and behavioralStories (which
 * had generic execution keys, so "how does he ship?" pulled it too).
 *
 * THE INVARIANT:
 * Cost-of-conflict disclosure may only reach the user through a block gated to an
 * EXPLICIT probe (weakness / failure / mistake / conflict / "tell me about a time").
 * It must never appear in a block reachable from a leadership, execution, background
 * or overview question.
 *
 * This test reads the GENERATED worker, not the source, so it fails if either the
 * canonical text or the routing keys regress.
 */

const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
const workerSrc = fs.readFileSync(path.join(repo, 'functions/api/chat.js'), 'utf8');

const match = workerSrc.match(/const KB_BLOCKS = (\[[\s\S]*?\]);\n/);
if (!match) {
  console.error('FAIL  could not locate KB_BLOCKS in functions/api/chat.js — did the generator change shape?');
  process.exit(1);
}
const blocks = JSON.parse(match[1]);

// Phrases that disclose the personal cost of the Google visitor-management disagreement.
const COST_MARKERS = [
  'removed from the project',
  'removed from a project',
  'removed him from',
  'cost him the project',
  'cost him the',
  'accepted personal cost',
];

// A block may carry the disclosure ONLY if every one of its routing keys is an explicit
// probe. A single topic key (e.g. 'ship', 'leadership') makes the block reachable from a
// neutral question and therefore disqualifies it.
const PROBE_KEYS = new Set([
  'tell me about a time', 'failure', 'failed', 'fail', 'mistake', 'disagree',
  'conflict', 'pushback', 'wrong', 'stopped', 'killed', 'conviction',
  'initiative', 'migration', 'validate', 'validating',
  'weakness', 'weaknesses', 'weak', 'weakest', 'improve', 'improvement', 'improving',
  'growth area', 'growth areas', 'development area', 'blind spot', 'blind spots',
  'work on', 'working on', 'shortcoming', 'shortcomings', 'limitation',
  'limitations', 'struggle', 'struggles', 'struggled', 'biggest opportunity',
  'area to improve', 'what is he bad at', 'not good at', 'gets wrong',
  'criticism', 'criticized', 'feedback he', 'feedback has he', 'feedback',
  'hard to hear', 'judgment failed', 'failed him', 'bad judgment', 'misjudged',
  'flaw', 'flaws', 'downside', 'red flag', 'self-aware', 'self aware',
  'learned the hard way', 'mistakes', 'where has he struggled', 'room to grow',
  'coachable', 'tough feedback',
]);

let failures = 0;
let carriers = 0;

for (const block of blocks) {
  const body = JSON.stringify(block.json ?? block.data ?? block);
  const hit = COST_MARKERS.find((m) => body.toLowerCase().includes(m));
  if (!hit) continue;

  carriers += 1;
  const keys = block.keys || [];

  if (block.always) {
    console.error(`FAIL  block "${block.name}" is ALWAYS loaded and carries a cost disclosure ("${hit}")`);
    failures += 1;
    continue;
  }

  const topicKeys = keys.filter((k) => !PROBE_KEYS.has(k));
  if (topicKeys.length > 0) {
    console.error(
      `FAIL  block "${block.name}" carries a cost disclosure ("${hit}") but is reachable from ` +
      `non-probe question(s): ${topicKeys.slice(0, 8).map((k) => `'${k}'`).join(', ')}` +
      (topicKeys.length > 8 ? ` … +${topicKeys.length - 8} more` : '')
    );
    failures += 1;
  } else {
    console.log(`PASS  block "${block.name}" carries the disclosure but is probe-gated (${keys.length} probe keys)`);
  }
}

// The story must not silently vanish either — losing it would make the weakness answer
// generic, which is its own failure mode.
if (carriers === 0) {
  console.error('FAIL  no block carries the cost disclosure at all — the weakness answer lost its substance');
  failures += 1;
}

// The generic leadership question must come back clean.
const leadership = blocks.find((b) => b.name === 'leadershipStyle');
if (leadership) {
  const body = JSON.stringify(leadership.json ?? leadership.data ?? leadership).toLowerCase();
  const hit = COST_MARKERS.find((m) => body.includes(m));
  if (hit) {
    console.error(`FAIL  leadershipStyle must never disclose the cost — found "${hit}"`);
    failures += 1;
  } else {
    console.log('PASS  leadershipStyle answers the leadership question without a cost disclosure');
  }
}

if (failures > 0) {
  console.error(`\n${failures} disclosure-boundary violation(s).`);
  console.error('FIX: move the disclosure into growthAreas / behavioralStories, or remove the');
  console.error('     non-probe routing keys from the offending block in');
  console.error('     scripts/build-cloudflare-function.js, then re-run the prebuild.');
  process.exit(1);
}

console.log('\nALL PASS');
