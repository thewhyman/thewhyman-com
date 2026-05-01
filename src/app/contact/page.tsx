'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

type EngagementCard = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  price: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  external: boolean;
  highlight: boolean;
  accent: string;
};

const ENGAGEMENT_CARDS: EngagementCard[] = [
  {
    icon: MessageSquare,
    title: 'Intro',
    price: 'Free · 30 min',
    description: "No pitch, no fluff. Thirty minutes to figure out if there's a real fit — for both of us. Come with a specific problem or question.",
    ctaLabel: 'Book Intro',
    ctaHref: 'https://thewhyman.bio',
    external: true,
    highlight: false,
    accent: 'teal',
  },
  {
    icon: Zap,
    title: 'Consulting',
    price: '$500 / hr',
    description: 'One focused hour on your hardest AI architecture, strategy, or product problem. Come prepared. Leave with a real answer, not a framework.',
    ctaLabel: 'Book Consulting',
    ctaHref: 'https://thewhyman.bio',
    external: true,
    highlight: true,
    accent: 'emerald',
  },
  {
    icon: ShieldCheck,
    title: 'VIP',
    price: 'Custom',
    description: 'Embedded advisory or build-together partnership. For founders and leaders who want depth, not surface advice — and are ready to move fast.',
    ctaLabel: 'Start VIP',
    ctaHref: 'https://thewhyman.bio',
    external: true,
    highlight: false,
    accent: 'indigo',
  },
];

const ACCENT_STYLES: Record<string, { iconBg: string; iconBorder: string; iconText: string; titleText: string }> = {
  teal: {
    iconBg: 'bg-teal-500/10',
    iconBorder: 'border-teal-500/20',
    iconText: 'text-teal-400',
    titleText: 'text-teal-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconText: 'text-emerald-400',
    titleText: 'text-emerald-400',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10',
    iconBorder: 'border-indigo-500/20',
    iconText: 'text-indigo-400',
    titleText: 'text-indigo-400',
  },
};

export default function ContactPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <section className="relative z-10 pt-24 pb-12 px-2 md:px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase"
          >
            WORK WITH ME • ANAND VALLAMSETLA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.9]"
          >
            Three Ways <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.3)]">
              to Engage
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-16 leading-relaxed"
          >
            I guard my calendar the way I guard production systems — no waste, no noise. The pricing is intentional: it signals that your time matters too. Show up prepared and we&apos;ll move fast.
          </motion.p>
        </div>
      </section>

      {/* Engagement Cards */}
      <section className="relative z-10 px-2 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {ENGAGEMENT_CARDS.map((card) => {
            const Icon = card.icon;
            const accent = ACCENT_STYLES[card.accent];
            const cardClasses = [
              'bg-white/5 border rounded-2xl p-8 flex flex-col group transition-all',
              card.highlight
                ? 'border-teal-500/30 shadow-[0_0_40px_rgba(20,184,166,0.1)] md:scale-[1.04] hover:border-teal-400/50'
                : 'border-white/10 hover:border-white/20',
            ].join(' ');

            return (
              <motion.div key={card.title} variants={itemVariants} className={cardClasses}>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${accent.iconBg} ${accent.iconBorder} group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 ${accent.iconText}`} />
                </div>

                <h3 className={`text-2xl font-bold mb-3 uppercase tracking-tighter ${accent.titleText}`}>
                  {card.title}
                </h3>

                <div className="inline-flex self-start items-center px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-zinc-300 tracking-[0.2em] uppercase">
                  {card.price}
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-10 flex-1">{card.description}</p>

                {card.external ? (
                  <a
                    href={card.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-6 rounded-xl bg-teal-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all"
                  >
                    {card.ctaLabel}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={card.ctaHref}
                    className={`h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                      card.highlight
                        ? 'bg-teal-500 text-black hover:bg-emerald-400'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {card.ctaLabel}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs font-bold text-zinc-500 tracking-[0.3em] uppercase mt-16"
        >
          All sessions remote • Book at thewhyman.bio • Time is the only non-renewable resource
        </motion.p>
      </section>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </main>
  );
}
