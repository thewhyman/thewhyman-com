import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import canonical from '../../data/canonical.json';
import linkedin from '../../data/linkedin_public.json';
import { FAQ_ITEMS, HOMEPAGE_FAQ_ITEMS } from '@/data/faq';

export const SITE_URL = 'https://thewhyman.com';

const SOURCE_PATHS = [
  'data/canonical.json',
  'data/linkedin_public.json',
] as const;

function sourceMtime() {
  const newestMtime = Math.max(
    ...SOURCE_PATHS.map((sourcePath) => statSync(resolve(process.cwd(), sourcePath)).mtimeMs),
  );
  const value = new Date(newestMtime).toISOString();
  if (value.startsWith('1970-')) throw new Error('Source-file mtime resolved to an invalid epoch date');
  return value;
}

function sourceCommitDate() {
  try {
    const value = execFileSync(
      'git',
      ['-C', process.cwd(), 'log', '-1', '--format=%cI', '--', ...SOURCE_PATHS],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();

    return value && !Number.isNaN(Date.parse(value)) ? value : sourceMtime();
  } catch {
    return sourceMtime();
  }
}

const currentExperience = linkedin.experience[0];
const GENERIC_SELF_EMPLOYMENT = /^(?:self[-\s]?employ(?:ed|ment)|freelanc(?:e|er)|independent(?:\s+(?:consultant|contractor))?)$/i;
const currentOrganization = currentExperience
  && !GENERIC_SELF_EMPLOYMENT.test(currentExperience.company.trim())
  ? currentExperience
  : null;

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: canonical.basics.name,
  jobTitle: canonical.basics.title,
  description: canonical.basics.summary,
  url: SITE_URL,
  knowsAbout: linkedin.skills,
  ...(currentOrganization
    ? {
        worksFor: {
          '@type': 'Organization',
          name: currentOrganization.company,
          description: currentOrganization.description,
        },
      }
    : {}),
  sameAs: linkedin.sameAs,
};

export const siteWideSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    person,
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: canonical.basics.name,
      url: SITE_URL,
    },
  ],
};

export const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  dateModified: sourceCommitDate(),
  mainEntity: { '@id': person['@id'] },
  author: { '@id': person['@id'] },
};

function buildFaqPageSchema(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

/** All thirteen — used on /meet, which renders all thirteen. */
export const faqPageSchema = buildFaqPageSchema(FAQ_ITEMS);

/**
 * The homepage's five — used on /, which renders exactly those five.
 *
 * Built from the SAME array the page renders, so the schema cannot describe
 * questions a visitor cannot see. Emitting all thirteen here while showing five
 * would be invisible schema: it scores the checkpoint without delivering the
 * content, which is the pattern this ticket exists to avoid.
 */
export const homepageFaqSchema = buildFaqPageSchema(HOMEPAGE_FAQ_ITEMS);
