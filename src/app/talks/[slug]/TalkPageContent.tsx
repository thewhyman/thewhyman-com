'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, ArrowRight, ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Talk, ThemeColor, AccentColor, LinkedInPost } from '@/data/talks';

const themeColorMap: Record<ThemeColor, string> = {
  teal: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
  blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  red: 'text-red-400 border-red-500/20 bg-red-500/5',
  purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
  emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
};

const accentBadgeMap: Record<AccentColor, string> = {
  teal: 'text-teal-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
};

const accentGradientMap: Record<AccentColor, string> = {
  teal: 'from-teal-400 to-emerald-400 drop-shadow-[0_0_40px_rgba(45,212,191,0.3)]',
  blue: 'from-blue-400 to-teal-400 drop-shadow-[0_0_40px_rgba(96,165,250,0.3)]',
  purple: 'from-purple-400 to-blue-400 drop-shadow-[0_0_40px_rgba(192,132,252,0.3)]',
  emerald: 'from-emerald-400 to-teal-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.3)]',
};

const accentBreadcrumbMap: Record<AccentColor, string> = {
  teal: 'text-teal-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
};

export default function TalkPageContent({ talk }: { talk: Talk }) {
  const accentBadge = accentBadgeMap[talk.accentColor];
  const accentGradient = accentGradientMap[talk.accentColor];
  const accentBreadcrumb = accentBreadcrumbMap[talk.accentColor];

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
          <Link href="/" className="hover:text-teal-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/talks" className="hover:text-blue-400 transition-colors">
            Talks
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className={accentBreadcrumb}>{talk.title}</span>
        </motion.div>

        {/* Event badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black ${accentBadge} tracking-[0.3em] uppercase w-fit`}
        >
          {talk.event} · {talk.date}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]"
        >
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>
            {talk.title}
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-zinc-300 mb-6 leading-snug"
        >
          {talk.tagline}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-zinc-400 mb-10 leading-relaxed"
        >
          {talk.description}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mb-20"
        >
          <a
            href={talk.pdfPath}
            download
            className="flex items-center gap-2 h-12 px-8 rounded-xl bg-teal-500 text-black font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Slides
          </a>
          <a
            href={talk.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full Screen
          </a>
        </motion.div>

        {/* PDF embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-24 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_rgba(96,165,250,0.08)]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className={`text-[10px] font-black ${accentBadge} tracking-[0.3em] uppercase`}>
              {talk.event} · Anand Vallamsetla
            </div>
            <a
              href={talk.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-black text-zinc-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
            >
              Full screen <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-full" style={{ height: '75vh', minHeight: '500px' }}>
            <iframe
              src={talk.pdfPath}
              className="w-full h-full"
              title={`${talk.title} — ${talk.event}`}
            />
          </div>
        </motion.div>

        {/* Key Themes */}
        {talk.themes.length > 0 && (
          <div className="mb-24">
            <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-8">
              Key Themes
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {talk.themes.map((theme, i) => {
                const classes = themeColorMap[theme.color];
                const labelColor = classes.split(' ')[0];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border p-8 ${classes}`}
                  >
                    <div
                      className={`text-[10px] font-black tracking-[0.25em] uppercase mb-3 ${labelColor}`}
                    >
                      {theme.label}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">{theme.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Social proof */}
        {talk.linkedinPosts && talk.linkedinPosts.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-2 mb-8">
              <MessageSquare className="w-3 h-3 text-blue-400" />
              <div className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">From the Discussion</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {talk.linkedinPosts.map((post: LinkedInPost, i: number) => (
                <motion.a
                  key={i}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group glass-card p-8 border-white/5 hover:border-blue-500/20 transition-all flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`text-[10px] font-black tracking-[0.25em] uppercase ${post.type === 'praise' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {post.type === 'praise' ? 'Community Reaction' : 'The Original Post'}
                    </div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-zinc-600 group-hover:text-[#0A66C2] transition-colors" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed flex-1">&ldquo;{post.quote}&rdquo;</p>
                  <div>
                    <div className="text-xs font-black text-white">{post.author}</div>
                    {post.authorTitle && (
                      <div className="text-[11px] text-zinc-500">{post.authorTitle}</div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* CTA bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-3">
              Full Piece
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              Read the deep-dive on Substack
            </h3>
            <p className="text-zinc-400 text-sm">
              The full essay behind this talk — the why and the how, in long form.
            </p>
          </div>
          <a
            href={talk.substackUrl}
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
