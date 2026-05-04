'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Presentation, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { talks } from '@/data/talks';

export default function TalksIndexPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-blue-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-teal-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <section className="relative z-10 pt-20 pb-16 px-8 max-w-screen-xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-10 text-[11px] font-black text-zinc-600 uppercase tracking-widest"
        >
          <Link href="/" className="hover:text-teal-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-400">Talks</span>
        </motion.div>

        {/* Header badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase w-fit"
        >
          <Presentation className="w-3 h-3" />
          THE WHY MAN · TALKS
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]"
        >
          TALKS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-zinc-400 mb-20 leading-relaxed"
        >
          Presentations and keynotes on AI, sovereignty, and the future of work.
        </motion.p>

        {/* Talks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {talks.map((talk, i) => (
            <motion.div
              key={talk.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card p-8 border-white/5 hover:border-blue-500/30 transition-all flex flex-col"
            >
              <div className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mb-4">
                {talk.event}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                {talk.title}
              </h3>
              <div className="text-[11px] font-black text-zinc-500 tracking-widest uppercase mb-4">
                {talk.date}
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-2 flex-1">
                {talk.description}
              </p>
              <Link
                href={`/talks/${talk.slug}`}
                className="self-start flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-400 hover:bg-blue-500/20 transition-all uppercase tracking-widest"
              >
                View Talk <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
