'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const resources = [
  {
    title: 'AI Resources — Deck 1',
    embedUrl: 'https://docs.google.com/presentation/d/15IxsbAc0x_dOALrvXwgNxY7Kc67U4sunudrVTYAD5gs/embed?start=false&loop=false',
    viewUrl: 'https://docs.google.com/presentation/d/15IxsbAc0x_dOALrvXwgNxY7Kc67U4sunudrVTYAD5gs/edit',
  },
  {
    title: 'AI Resources — Deck 2',
    embedUrl: 'https://docs.google.com/presentation/d/1t7uV8uUH1p3pMirrqQgG-87_YN1NCH7dulpjKD4K5u0/embed?start=false&loop=false',
    viewUrl: 'https://docs.google.com/presentation/d/1t7uV8uUH1p3pMirrqQgG-87_YN1NCH7dulpjKD4K5u0/edit',
  },
];

export default function AIResourcesPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <section className="relative z-10 pt-20 pb-16 px-8 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase w-fit"
        >
          THE WHY MAN • AI RESOURCES
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]"
        >
          AI RESOURCES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-zinc-400 mb-20 leading-relaxed"
        >
          Frameworks, decks, and thinking tools for building with AI.
        </motion.p>

        <div className="space-y-16">
          {resources.map((resource, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 border-white/5"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-teal-400">{resource.title}</h2>
                <a
                  href={resource.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] font-black text-zinc-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
                >
                  Open full screen <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-black aspect-video">
                <iframe
                  src={resource.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={resource.title}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
