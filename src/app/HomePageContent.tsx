'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Cpu, Rocket, Users, ChevronRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import WhyManConcierge from '../components/WhyManConcierge';
import linkedinData from '../../data/linkedin_public.json';
import substackPosts from '../../data/substack_posts.json';

type FeaturedPost = (typeof linkedinData.featured_posts)[number];

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'W';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function PostCard({ post, i }: { post: FeaturedPost; i: number }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = (post as { image?: string }).image;
  const showFallback = !imageUrl || imageError;

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.2 }}
      className="glass-card p-10 group hover:border-purple-500/30 transition-all border-white/5 relative flex flex-col justify-start overflow-hidden"
    >
      <article className="flex flex-1 flex-col">
      {showFallback ? (
        <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden border border-white/5 relative bg-gradient-to-br from-zinc-900 to-zinc-800 shrink-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-purple-400" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-purple-300/80 uppercase">
              {getInitials(post.title)}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden border border-white/5 relative bg-black shrink-0 flex items-center justify-center">
          {/* Blurred background */}
          <div className="absolute inset-0 w-full h-full transform scale-110">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" aria-hidden="true" className="w-full h-full object-cover blur-2xl opacity-40 mix-blend-screen" />
          </div>
          {/* Foreground image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={post.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-105 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 z-20 pointer-events-none" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-black text-purple-400 tracking-widest uppercase">{post.date}</div>
            <Zap className="text-purple-500/30 w-5 h-5 group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">{post.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">{post.description}</p>
        </div>
      </div>
      </article>
    </motion.a>
  );
}

export default function HeroPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.3 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <header className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase"
          >
            THE WHY MAN • FOUNDER, EXPONENTIALOS • EX-GOOGLE • BERKELEY HAAS EMBA 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-7 leading-[0.9]"
          >
            I DON&apos;T JUST BUILD AI PRODUCTS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.3)]">I BUILD THE SYSTEMS THAT BUILD THEM.</span>
          </motion.h1>

          {/* The name carries a connotation problem — "Why" reads as challenging authority.
              This resolves it in the same beat the visitor reads the name in the badge above,
              rather than two screens down in the methodology section. */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-3xl text-xl md:text-2xl text-teal-300/90 mb-8 leading-snug font-medium"
          >
            The &ldquo;why&rdquo; is curiosity &mdash; never challenge. It&apos;s how I get to root cause.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-xl text-zinc-400 mb-12 leading-relaxed"
          >
            Founder, Exponential OS — a multi-agent harness with a constitution, agentic memory, model routing and composable skills.
            25+ years in engineering. 6 years at Google across a ~$40B portfolio, $500M+ ROI. Most recently Engineer in Residence at AI Fund, Andrew Ng&apos;s venture studio.
          </motion.p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto mt-4 px-6 md:px-0">
            <a href="https://exponentialos.io" target="_blank" rel="noopener noreferrer" className="h-14 px-10 rounded-xl bg-teal-500 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all w-full md:w-auto">
              See ExponentialOS <ChevronRight className="w-4 h-4" />
            </a>
            <Link href="/meet" className="h-14 px-10 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-white/10 transition-all w-full md:w-auto">
              Work With Me <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
             <a href="https://linkedin.com/in/thewhyman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#0A66C2] transition-colors uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
             </a>
             <div className="w-1 h-1 rounded-full bg-zinc-700" />
             <a href="https://x.com/thewhyman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @thewhyman
             </a>
             <div className="w-1 h-1 rounded-full bg-zinc-700" />
             <a href="https://thewhyman.blog" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-orange-400 transition-colors uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Substack
             </a>
             <div className="w-1 h-1 rounded-full bg-zinc-700" />
             <a href="https://github.com/thewhyman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
             </a>
          </motion.div>
        </div>
      </header>

      {/* Methodology Section */}
      <section id="methodology" className="relative z-10 py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-4">THE CURIOUS WHY METHOD</div>
              <h2 className="text-4xl font-bold mb-8 leading-tight text-white">Why is reliability a byproduct of profound curiosity?</h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                  As an Engineering Leader, I have found that the most complex technical challenges—from managing $40B portfolios at Google to compressing supply chain recall from months to seconds—are solved by identifying the core &ldquo;Why.&rdquo;
                  <br /><br />
                  <span className="text-teal-400/80 italic">To be clear: this is a strictly curious &ldquo;Why&rdquo;. It is never about challenging authority or arrogance. It is a relentless drive to drill down to the fundamental root cause and fix the broken system.</span>
                </p>
                <p>
                  The method is to build the harness before the product: governance that enforces engineering invariants as gates, memory that carries context across sessions, and evals fixed before any code is written. A change ships only if it beats baseline. That is how I ship outcomes rather than features.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-teal-400 rotate-12" />
              </div>
              <div className="space-y-8">
                   <div className="flex gap-4 items-start">
                     <span className="text-teal-400 font-black text-xl">01</span>
                     <p className="font-bold text-white uppercase tracking-tight">Question the baseline before you scale.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                     <span className="text-teal-400 font-black text-xl">02</span>
                     <p className="font-bold text-white uppercase tracking-tight">Design for reliability at every failure mode.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                     <span className="text-teal-400 font-black text-xl">03</span>
                     <p className="font-bold text-white uppercase tracking-tight">Outcome-driven engineering, not just feature delivery.</p>
                   </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dimension Categories */}
      <section id="dimensions" className="relative z-10 py-32 px-8">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div id="build" custom={0} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-12 group hover:border-teal-500/30 transition-all border-teal-500/10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-8 border border-teal-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="text-teal-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-teal-400">BUILD</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-10">Architecting reliability-first AI systems and evaluation-driven agent platforms. ex-Google engineering leader.</p>
              <Link href="/build-details" className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group/link">
                View Case Studies <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div id="invent" custom={1} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-12 group hover:border-emerald-500/30 transition-all scale-[1.05] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                <Rocket className="text-emerald-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-emerald-400">INVENT</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-10">Founder, ExponentialOS. Patent filed (exponential OS architecture). 10x Hackathon Champion. Compressing 6-month cycles to 6 seconds.</p>
              <Link href="/invent-details" className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group/link">
                View Case Studies <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div id="lead" custom={2} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-12 group hover:border-indigo-500/30 transition-all border-indigo-500/10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Users className="text-indigo-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-indigo-400">LEAD</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-10">Berkeley Haas EMBA 2026. UC Berkeley Faculty — 1,500+ Fortune 500 executives taught AI systems. Leading 50+ engineers at scale. $40B Google portfolio.</p>
              <Link href="/lead-details" className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group/link">
                View Case Studies <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
        </div>

        {/* Thought Leadership Section */}
        <div id="thought-leadership" className="max-w-screen-xl mx-auto mt-32">
          <div className="flex flex-col items-center text-center px-6">
            <div className="text-[10px] font-black text-purple-400 tracking-[0.3em] uppercase mb-4">PUBLICATIONS & ESSAYS</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">Thought Leadership</h2>

            {/* Social Platform Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <a href="https://linkedin.com/in/thewhyman" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-zinc-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" className="w-3.5 h-3.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
              <a href="https://x.com/thewhyman" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-zinc-400 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X / Twitter
              </a>
              <a href="https://thewhyman.blog" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-zinc-400 hover:text-orange-400 hover:border-orange-400/30 transition-all uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Substack
              </a>
              <a href="https://instagram.com/anandvallam" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-zinc-400 hover:text-pink-400 hover:border-pink-400/30 transition-all uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" className="w-3.5 h-3.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
            </div>

            {/* Big Subscribe Button */}
            <a
              href="https://thewhyman.blog/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-16 inline-flex items-center gap-3 h-16 px-12 rounded-xl bg-teal-500 text-black font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)]"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>
              Subscribe — Get the thinking weekly
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {substackPosts.map((post, i) => (
              <PostCard key={i} post={post} i={i} />
            ))}
          </div>

          {/* Read all on Substack */}
          <div className="flex justify-center mt-12">
            <a
              href="https://thewhyman.blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-widest group"
            >
              Read all essays on Substack
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Unified CTA */}
        <div className="mt-32 flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-concierge'))}
            className="px-10 py-5 rounded-full bg-white text-black font-black flex items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-teal-400 transition-all text-sm uppercase tracking-widest"
          >
            <MessageSquare className="w-5 h-5" />
            Engage The Why Man Concierge
          </motion.button>
          
          <div className="mt-8 flex items-center gap-6 text-zinc-400 group cursor-default">
             <div className="flex -space-x-3 transition-transform group-hover:scale-105">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-[10px] text-indigo-400 font-black uppercase shadow-[0_0_10px_rgba(99,102,241,0.2)]">I</div>
                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-[10px] text-teal-400 font-black uppercase shadow-[0_0_10px_rgba(20,184,166,0.2)]">O</div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-[10px] text-purple-400 font-black uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)]">G</div>
             </div>
             <p className="text-xs font-bold tracking-widest uppercase text-zinc-300">Architectural Integrity • Global Operations • AI Governance</p>
          </div>
        </div>
      </section>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Concierge Bot */}
      <WhyManConcierge />
    </main>
  );
}
