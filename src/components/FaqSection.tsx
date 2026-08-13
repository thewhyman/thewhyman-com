import React from 'react';
import { FAQ_ITEMS, type FaqItem } from '@/data/faq';

/**
 * Visible FAQ, rendered from data/canonical.json `interviewQA` — the same array
 * that feeds the FAQPage JSON-LD and the concierge's knowledge base. One source,
 * three consumers: a human reading the page, an agent parsing the schema, and
 * the concierge answering in chat. They cannot drift.
 *
 * Parameterized so the homepage and /meet share ONE implementation rather than
 * two that diverge on the next copy edit. The homepage shows a curated subset
 * and links onward; /meet shows all thirteen.
 *
 * Server component by design. Native <details>/<summary> rather than a JS
 * accordion, for three reasons that all matter here:
 *   1. The answer text is in the static HTML whether or not the item is open,
 *      so a crawler that does not execute JS still reads every answer — which
 *      is the entire point of shipping FAQPage schema. A JS accordion would put
 *      the schema in the head and the content behind a click: invisible schema.
 *   2. <summary> is a button with correct expanded/collapsed semantics for free.
 *      No aria-expanded to keep in sync, no focus management to get wrong.
 *   3. Zero client JS on pages whose other content is already interactive.
 */

export type FaqSectionProps = {
  items?: ReadonlyArray<FaqItem>;
  id?: string;
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
  intro?: string;
  footer?: React.ReactNode;
  className?: string;
};

export default function FaqSection({
  items = FAQ_ITEMS,
  id = 'faq-heading',
  eyebrow = 'Before you book',
  headingLead = 'What do recruiters',
  headingAccent = 'usually ask?',
  intro = 'The thirteen questions that come up most. Answered straight, including the awkward ones — so the call can start somewhere more useful.',
  footer = 'Still unanswered? The concierge takes follow-ups',
  className = 'relative z-10 px-2 md:px-8 mt-28 md:mt-36',
}: FaqSectionProps) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase">
            {eyebrow}
          </div>
          <h2 id={id} className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
            {headingLead}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {headingAccent}
            </span>
          </h2>
          <p className="max-w-xl mx-auto mt-6 text-zinc-400 leading-relaxed">{intro}</p>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group bg-white/5 border border-white/10 rounded-2xl transition-colors open:border-teal-500/30 hover:border-white/20 open:bg-white/[0.07]"
            >
              <summary className="flex items-start gap-4 cursor-pointer list-none p-6 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-base md:text-lg font-semibold text-zinc-100 leading-snug group-open:text-teal-400 transition-colors">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-45 group-open:text-teal-400"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M9 3.5v11M3.5 9h11" />
                  </svg>
                </span>
              </summary>
              <p className="px-6 pb-6 -mt-1 text-sm md:text-[15px] text-zinc-400 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {footer ? (
          <div className="text-center mt-14 text-xs font-bold text-zinc-500 tracking-[0.3em] uppercase">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  );
}
