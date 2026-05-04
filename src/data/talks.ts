// Canonical talks registry. Add a new talk by appending an entry below — the
// /talks index, /talks/[slug] detail page, and Resources page all read from
// this single source. `slug` is the URL key and must be unique.

export type ThemeColor = 'teal' | 'blue' | 'red' | 'purple' | 'emerald';
export type AccentColor = 'teal' | 'blue' | 'purple' | 'emerald';

export type TalkTheme = {
  label: string;
  text: string;
  color: ThemeColor;
};

export type LinkedInPost = {
  url: string;
  author: string;
  authorTitle?: string;
  quote: string;
  type: 'discussion' | 'praise';
};

export type Talk = {
  slug: string;
  title: string;
  tagline: string;
  event: string;
  date: string;
  dateISO: string;
  description: string;
  pdfPath: string;
  accentColor: AccentColor;
  themes: TalkTheme[];
  substackUrl: string;
  linkedinPosts?: LinkedInPost[];
};

export const talks: Talk[] = [
  {
    slug: 'cyborg',
    title: 'Your Cyborg Goes to Work',
    tagline: "Not your employer's model of you.",
    event: 'ClawCamp · AI Infra Summit 5',
    date: 'May 1, 2026',
    dateISO: '2026-05-01',
    description:
      'Your employer is about to give you an AI assistant. The question is: whose assistant is it? A talk on AI sovereignty, the walled garden problem, and why the identity + sovereignty layer is the missing primitive.',
    pdfPath: '/presentations/clawcamp-2026-05-01.pdf',
    accentColor: 'blue',
    themes: [
      {
        label: 'THE WALLED GARDEN PROBLEM',
        text: 'Claude. Copilot. Cursor. Gemini. Separate memory. Separate context. Separate compute. No agent passport exists — the fragmentation is intentional.',
        color: 'teal',
      },
      {
        label: 'DIGITAL TWIN ≠ CYBORG',
        text: 'A digital twin imitates you and is owned by your employer. A Cyborg has its own soul — owned by YOU — operating at the interests layer, not the positions layer.',
        color: 'blue',
      },
      {
        label: "THE PROTOCOL DOESN'T EXIST YET",
        text: 'LangChain + CrewAI add abstraction on top of walled gardens. Not bridges between them. The identity + sovereignty layer is missing.',
        color: 'red',
      },
      {
        label: 'xHUMANOS ↔ xTEAMOS',
        text: 'Private context stays private. Shared context flows through. The separation IS the enterprise compliance story.',
        color: 'purple',
      },
    ],
    substackUrl: 'https://thewhyman.blog',
    linkedinPosts: [
      {
        url: 'https://www.linkedin.com/posts/thewhyman_personalagents-agenticai-aiinfrasummit-share-7455796961032572928-gnVQ',
        author: 'Anand Vallamsetla',
        authorTitle: 'Engineering Leader · @thewhyman',
        quote: 'The post that started the conversation at AI Infra Summit 5. Your employer is about to give you an AI assistant — the question is whose assistant is it.',
        type: 'discussion',
      },
      {
        url: 'https://www.linkedin.com/posts/damonmoon_amazing-talk-with-the-why-man-anand-cyborgs-share-7456056409147850752-3jrm',
        author: 'Damon Moon',
        quote: 'Amazing talk with the why man Anand — cyborgs and the future of personal AI in the enterprise.',
        type: 'praise',
      },
    ],
  },
];

export function getTalkBySlug(slug: string): Talk | undefined {
  return talks.find((t) => t.slug === slug);
}
