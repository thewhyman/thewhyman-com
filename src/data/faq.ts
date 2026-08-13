import canonical from '../../data/canonical.json';

export type FaqItem = Readonly<{
  q: string;
  a: string;
}>;

export const FAQ_ITEMS: ReadonlyArray<FaqItem> = canonical.interviewQA;

/**
 * The subset shown on the homepage.
 *
 * The homepage is where a recruiter lands first, so it carries the five
 * questions they are actually thinking on arrival — the differentiator, the
 * IC-or-manager screen, the scale question, the intent question, and the
 * flight-risk objection. The remaining eight live on /meet, which is linked.
 *
 * Selected by matching the question text against canonical.json rather than by
 * index, so reordering interviewQA cannot silently change which questions the
 * homepage shows. A question that stops matching FAILS THE BUILD instead of
 * quietly disappearing from the page and its schema.
 */
const HOMEPAGE_QUESTIONS: ReadonlyArray<string> = [
  'What makes him different from other senior AI candidates?',
  'Is he a manager or an individual contributor?',
  'What scale has he operated at?',
  'Why is he looking, and what is he optimizing for?',
  'He has run his own thing. Will he leave in a year to start a company?',
];

export const HOMEPAGE_FAQ_ITEMS: ReadonlyArray<FaqItem> = HOMEPAGE_QUESTIONS.map((question) => {
  const match = FAQ_ITEMS.find((item) => item.q === question);
  if (!match) {
    throw new Error(
      `Homepage FAQ references a question absent from canonical.json interviewQA: ${JSON.stringify(question)}. `
      + 'Update HOMEPAGE_QUESTIONS to match the canonical text, or restore the question.',
    );
  }
  return match;
});
