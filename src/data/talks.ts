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
  /** Deck path. Accepts a PDF or a self-contained HTML deck — both render in the
   *  embedded viewer, and HTML actually renders better on mobile. */
  pdfPath: string;
  accentColor: AccentColor;
  themes: TalkTheme[];
  substackUrl: string;
  /** YouTube watch URL. When present the talk page embeds the recording above
   *  the deck — a recording is stronger evidence than slides. */
  videoUrl?: string;
  linkedinPosts?: LinkedInPost[];
};

export const talks: Talk[] = [
  {
    slug: 'customer-no-longer-human',
    title: 'The Customer Is No Longer Human',
    tagline: 'Attention is being replaced by execution.',
    event: 'Health+Tech 2026 · AI Marketing Group session',
    date: 'May 15, 2026',
    dateISO: '2026-05-15',
    description:
      "A roundtable synthesis on agents, attention and economics: what happens to marketing when the buyer is an agent rather than a person, why every brand now writes for two readers with different needs, and what it means when agents get memory, a budget and the right to sign.",
    pdfPath: '/presentations/customer-no-longer-human-2026-05-15/',
    accentColor: 'teal',
    themes: [
      {
        label: 'ATTENTION IS BEING REPLACED BY EXECUTION',
        text: "The internet's primary metric stops being impressions and becomes outcomes. What gets paid for is task completion, not eyeball-time.",
        color: 'teal',
      },
      {
        label: 'TWO READERS, TWO SURFACES',
        text: 'Every brand now writes for two readers. One has a body and a memory. The other has a parser and a budget. They want different things from the same brand, and it has to satisfy both without confusing either.',
        color: 'blue',
      },
      {
        label: 'AGENCY UNDER THE OPTIMIZER',
        text: "Targeting that precise doesn't ask for consent, it predicts it. The question is no longer whether agents will know us — it is who they are loyal to when they do.",
        color: 'red',
      },
      {
        label: 'AGENTS AS ECONOMIC PARTIES',
        text: 'Give an agent memory, reputation, a budget and the right to sign, and it stops being software and starts being a counterparty. Capitalism was not built for that.',
        color: 'purple',
      },
      {
        label: 'AMPLIFY OR REPLACE IS NOT THE CHOICE',
        text: 'The choice is being made slide by slide, contract by contract, build by build. Nobody is voting on it. We are choosing it.',
        color: 'emerald',
      },
    ],
    substackUrl: 'https://www.thewhyman.blog/p/the-customer-is-no-longer-human',
    videoUrl: 'https://www.youtube.com/watch?v=A8-ojnb9ygk',
  },
  {
    slug: 'exponential-advantage',
    title: 'The Exponential Advantage',
    tagline: 'Why co-intelligence compounds — and tool mode does not.',
    event: 'ClawCamp @ Human+Tech Week',
    date: 'May 18, 2026',
    dateISO: '2026-05-18',
    description:
      "Talk 2 of 2. The first talk was the architecture; this one is the math. Why a tool gives you linear returns while a partner compounds, what changes between session 1 and session 90, and the three requirements for intelligence that accumulates instead of resetting.",
    // Cloudflare Pages strips the .html extension and 308-redirects, so the
    // extensionless path is what actually serves. Do not add .html back.
    pdfPath: '/presentations/clawcamp-3-2026-05-18',
    accentColor: 'emerald',
    themes: [
      {
        label: '1.01 TO THE POWER OF 365',
        text: 'One percent better a day is 37x in a year. The interesting part is that it applies to BOTH partners at once — the human gets better at prompting while the system gets better at understanding.',
        color: 'emerald',
      },
      {
        label: "YOU'VE DONE THIS 50 TIMES",
        text: 'Every session starts from zero. You re-explain the context, re-establish the standards, re-teach the same lesson. That is tool mode, and it is why most AI use produces linear returns.',
        color: 'red',
      },
      {
        label: 'TOOL MODE VS PARTNER MODE',
        text: 'A tool executes what you asked. A partner accumulates what it learned. The difference is not model quality — it is whether anything survives the end of the session.',
        color: 'teal',
      },
      {
        label: 'THE COMPOUNDING SUBSTRATE',
        text: 'Three requirements for intelligence that accumulates: something must be written down, it must be retrieved into the next session, and it must change behaviour. Miss any one and you are back to episodic.',
        color: 'blue',
      },
      {
        label: 'SESSION 1 VS SESSION 90',
        text: 'The gap is already opening between people running episodic AI and people running compounding AI. It is not visible in week one and it is very visible by month three.',
        color: 'purple',
      },
    ],
    substackUrl: 'https://www.thewhyman.blog/p/the-cyborg-the-exponential-advantage',
  },
  {
    slug: 'xos-sovereignty',
    title: 'Building the OS for Your Cyborg',
    tagline: 'Monday morning arrives. Your employer wants to own it.',
    event: 'ClawCamp @ Human+Tech Week',
    date: 'May 11, 2026',
    dateISO: '2026-05-11',
    description:
      "You spend months building a personal AI system. Monday morning arrives and your employer wants to own it. A talk on why 'AI at work' is employer-owned by default, and what a runtime you actually own looks like instead — xHumanOS as a homeserver for your cyborg, and xTeamOS as collaboration that is not extractive.",
    pdfPath: '/presentations/clawcamp-2-2026-05-11.pdf',
    accentColor: 'purple',
    themes: [
      {
        label: 'THE MONDAY MORNING PROBLEM',
        text: "You've spent months building your cyborg. Monday morning arrives. Your employer wants to own it. We build personal AI systems at home, then walk into work where the company owns the AI, the data and the output.",
        color: 'red',
      },
      {
        label: 'THE BROKEN MODEL',
        text: "This is not a conspiracy, it is the default architecture. Your conversations train their models. When you leave, your AI context stays behind. The individual gets convenience; the employer gets leverage.",
        color: 'teal',
      },
      {
        label: 'YOUR CYBORG NEEDS A HOME',
        text: "xHumanOS is a runtime you own and operate, not a subscription a company can revoke. The homeserver analogy is exact: like running your own mail server or Mastodon node — federated, portable, yours.",
        color: 'blue',
      },
      {
        label: 'xTEAMOS — COLLABORATIVE, NOT EXTRACTIVE',
        text: "Every human has their own cyborg; each contributes capabilities to the team; the team has shared infrastructure no one person owns. Your context stays private. Your capabilities are what you bring.",
        color: 'purple',
      },
      {
        label: 'THE WHY NATION',
        text: "Not a platform — a protocol. Not a company that owns your data — a network where everyone owns their node, and the connections between nodes create collective intelligence nobody owns.",
        color: 'emerald',
      },
    ],
    substackUrl: 'https://www.thewhyman.blog/',
  },
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
