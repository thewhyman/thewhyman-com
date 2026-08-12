import canonical from '../../data/canonical.json';

export type FaqItem = Readonly<{
  q: string;
  a: string;
}>;

export const FAQ_ITEMS: ReadonlyArray<FaqItem> = canonical.interviewQA;
