'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
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
    label: 'THE PROTOCOL DOESN\'T EXIST YET',
    text: 'LangChain + CrewAI add abstraction on top of walled gardens. Not bridges between them. The identity + sovereignty layer is missing.',
    color: 'red',
  },
  {
    label: 'xHUMANOS ↔ xTEAMOS',
    text: 'Private context stays private. Shared context flows through. The separation IS the enterprise compliance story.',
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
  blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  red: 'text-red-400 border-red-500/20 bg-red-500/5',
  purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
};

export default function CyborgTalkPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      {/* Background effects */}
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
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/resources" className="hover:text-teal-400 transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-teal-400">Cyborg</span>
        </motion.div>

        {/* Event badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase w-fit"
        >
          CLAWCAMP · AI INFRA SUMMIT 5 · MAY 1, 2026
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]"
        >
          YOUR CYBORG<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-[0_0_40px_rgba(96,165,250,0.3)]">GOES TO WORK.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-zinc-400 mb-10 leading-relaxed"
        >
          Not your employer&apos;s model of you. A talk on AI sovereignty, the walled garden problem,
          and why the identity + sovereignty layer is the missing primitive.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mb-20"
        >
          <a
            href="/presentations/clawcamp-2026-05-01.pdf"
            download
            className="flex items-center gap-2 h-12 px-8 rounded-xl bg-teal-500 text-black font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Slides
          </a>
          <a
            href="/presentations/clawcamp-2026-05-01.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full Screen
          </a>
        </motion.div>

        {/* PDF Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-24 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_rgba(96,165,250,0.08)]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">
              ClawCamp · AI Infra Summit 5 · Anand Vallamsetla
            </div>
            <a
              href="/presentations/clawcamp-2026-05-01.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-black text-zinc-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
            >
              Full screen <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-full" style={{ height: '75vh', minHeight: '500px' }}>
            <iframe
              src="/presentations/clawcamp-2026-05-01.pdf"
              className="w-full h-full"
              title="Your Cyborg Goes to Work — ClawCamp AI Infra Summit 5"
            />
          </div>
        </motion.div>

        {/* Key Themes */}
        <div className="mb-24">
          <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-8">Key Themes</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slides.map((slide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-8 ${colorMap[slide.color]}`}
              >
                <div className={`text-[10px] font-black tracking-[0.25em] uppercase mb-3 ${colorMap[slide.color].split(' ')[0]}`}>
                  {slide.label}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{slide.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-3">Full Piece</div>
            <h3 className="text-2xl font-black text-white mb-2">Read the deep-dive on Substack</h3>
            <p className="text-zinc-400 text-sm">The full essay behind this talk — why the identity + sovereignty layer is the missing primitive.</p>
          </div>
          <a
            href="https://thewhyman.blog"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 h-12 px-8 rounded-xl bg-teal-500 text-black font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            Read on Substack <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </main>
  );
}
