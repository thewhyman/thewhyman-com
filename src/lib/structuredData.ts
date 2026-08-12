import { execFileSync } from 'node:child_process';
import canonical from '../../data/canonical.json';
import linkedin from '../../data/linkedin_public.json';
import { FAQ_ITEMS } from '@/data/faq';
import { NAVBAR_EXTERNAL_LINKS } from '@/data/navbarExternalLinks';

export const SITE_URL = 'https://thewhyman.com';

const SOURCE_PATHS = [
  'data/canonical.json',
  'data/linkedin_public.json',
  'src/data/navbarExternalLinks.ts',
] as const;
const STABLE_DATE_FALLBACK = '1970-01-01T00:00:00.000Z';

function sourceCommitDate() {
  try {
    const value = execFileSync(
      'git',
      ['-C', process.cwd(), 'log', '-1', '--format=%cI', '--', ...SOURCE_PATHS],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();

    return value && !Number.isNaN(Date.parse(value)) ? value : STABLE_DATE_FALLBACK;
  } catch {
    return STABLE_DATE_FALLBACK;
  }
}

const currentExperience = linkedin.experience[0];
const sameAs = [
  ...NAVBAR_EXTERNAL_LINKS.products.map(({ href }) => href),
  ...Object.values(NAVBAR_EXTERNAL_LINKS.profiles).map(({ href }) => href),
];

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: canonical.basics.name,
  jobTitle: canonical.basics.title,
  description: canonical.basics.summary,
  url: SITE_URL,
  image: `${SITE_URL}/icon.png`,
  knowsAbout: linkedin.skills,
  ...(currentExperience
    ? {
        worksFor: {
          '@type': 'Organization',
          name: currentExperience.company,
          description: currentExperience.description,
        },
      }
    : {}),
  sameAs,
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
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profile`,
      url: SITE_URL,
      dateModified: sourceCommitDate(),
      mainEntity: { '@id': person['@id'] },
    },
  ],
};

export const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: a,
    },
  })),
};
