'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Handshake, Lightbulb, ArrowRight } from 'lucide-react';

/**
 * Visitor-type CTA. Rather than one generic "get in touch", ask what kind of
 * conversation this is and route accordingly — a recruiter, a collaborator and
 * a consulting lead all want different first conversations.
 *
 * All three land on /meet, which carries the booking paths, with a `?as=`
 * parameter so the page can lead with the relevant one.
 */

const PATHS = [
  {
    as: 'recruiter',
    icon: Briefcase,
    label: 'Hiring',
    line: 'Recruiter or hiring manager',
    sub: 'Senior engineering leadership, applied AI architecture, forward-deployed roles',
  },
  {
    as: 'collaborator',
    icon: Handshake,
    label: 'Building',
    line: 'Collaborator or founder',
    sub: 'Agentic systems, harness architecture, 0→1 product work',
  },
  {
    as: 'consulting',
    icon: Lightbulb,
    label: 'Advising',
    line: 'Consulting or advisory',
    sub: 'AI strategy, eval architecture, engineering governance',
  },
];

export default function RouteCTA({
  heading = 'What brings you here?',
  sub = 'Pick the closest fit and I will point you at the right conversation.',
}: { heading?: string; sub?: string }) {
  return (
    <section className="mt-24 mb-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{heading}</h2>
        <p className="text-zinc-400 mb-8 max-w-2xl">{sub}</p>

        <div className="grid md:grid-cols-3 gap-4">
          {PATHS.map(({ as, icon: Icon, label, line, sub: s }) => (
            <Link
              key={as}
              href={`/meet?as=${as}`}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-teal-500/40 hover:bg-teal-500/[0.04] transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-teal-400 uppercase">{label}</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100 mb-1">{line}</div>
              <div className="text-xs text-zinc-500 leading-snug">{s}</div>
              <div className="mt-4 flex items-center gap-1 text-xs text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Continue <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          Prefer to ask first? Interview my AI concierge — bottom right of any page.
        </p>
      </div>
    </section>
  );
}
