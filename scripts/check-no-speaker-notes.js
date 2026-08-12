#!/usr/bin/env node
/**
 * Blocks speaker prep material from shipping to the public site.
 *
 * WHY: talk decks in the workspace come in pairs — an .html or .pdf deck that was
 * PRESENTED, and an .md that is the speaker's prep doc. On 2026-08-12 the
 * ClawCamp 3 markdown was inspected before publishing and turned out to contain
 * an "IP Firewall — what NOT to give away" section plus private intel on named
 * attendees. Publishing it would have leaked both the private notes and the list
 * of things deliberately withheld. The deck HTML was clean; the markdown was not.
 *
 * RULE: no .md, .markdown or .pptx under public/, and no file whose content
 * carries speaker-note markers. Deck assets must be .html, .pdf or images.
 */
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const BANNED_EXT = new Set(['.md', '.markdown', '.pptx', '.docx', '.key']);
const MARKERS = [
  'SPEAKER NOTE', 'Speaker Intel', 'IP Firewall', 'NOT to Give Away',
  'Prepared Answers', 'over-shared', 'DO NOT add claims',
];

const problems = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full); continue; }
    const rel = path.relative(PUBLIC, full);
    if (BANNED_EXT.has(path.extname(e.name).toLowerCase())) {
      problems.push(`${rel} — ${path.extname(e.name)} files are prep material, not deck assets`);
      continue;
    }
    if (/\.(html?|txt|json)$/i.test(e.name)) {
      let body = '';
      try { body = fs.readFileSync(full, 'utf8'); } catch { continue; }
      for (const m of MARKERS) {
        if (body.includes(m)) { problems.push(`${rel} — contains speaker-note marker "${m}"`); break; }
      }
    }
  }
};
walk(PUBLIC);

if (problems.length) {
  console.error('FAIL  speaker-note material found under public/:\n');
  problems.forEach((p) => console.error('  ' + p));
  console.error('\nFIX  remove the file, or publish the presented deck (.html/.pdf) instead of the prep doc.');
  process.exit(1);
}
console.log('PASS  no speaker-note material under public/');
