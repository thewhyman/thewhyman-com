'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Cpu, Rocket, Users, ChevronRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import WhyManConcierge from '../components/WhyManConcierge';
import linkedinData from '../../data/linkedin_public.json';

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
      <section className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase"
          >
            THE WHY MAN • APPLIED AI ENGINEERING LEADER
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-12 leading-[0.9]"
          >
            I DON&apos;T JUST BUILD AI. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.3)]">I ASK A CURIOUS WHY.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-xl text-zinc-400 mb-12 leading-relaxed"
          >
            Engineering leader with 26 years of experience across three specialized dimensions: 
            Scaling distributed systems at Google, moonshot innovation, and reliability-first AI platforms.
          </motion.p>

          <div className="flex gap-6">
            <a href="https://app.reclaim.ai/m/anand-career/intro" target="_blank" rel="noopener noreferrer" className="h-14 px-10 rounded-xl bg-teal-500 text-black font-black text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-emerald-400 transition-all">
              Intro Meeting <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#methodology" className="h-14 px-10 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-wider flex items-center hover:bg-white/10 transition-all">
              The Methodology
            </a>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="relative z-10 py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase mb-4">THE CURIOUS WHY METHOD</div>
              <h2 className="text-4xl font-bold mb-8 leading-tight text-white">Reliability is a byproduct of profound curiosity.</h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                  As an Engineering Leader, I have found that the most complex technical challenges—from managing $40B portfolios at Google to compressing supply chain recall from months to seconds—are solved by identifying the core "Why." 
                  <br /><br />
                  <span className="text-teal-400/80 italic">To be clear: this is a strictly curious "Why". It is never about challenging authority or arrogance. It is a relentless drive to drill down to the fundamental root cause and fix the broken system.</span>
                </p>
                <p>
                  My methodology focuses on **Evaluation-First Architecture**: building the infrastructure that proves a system works before building the system itself. This ensures I don&apos;t just ship features, I ship outcomes.
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
              <p className="text-zinc-400 text-sm leading-relaxed mb-10">The &apos;Why Guy&apos; origin. 10x Hackathon Champion. Compressing 6-month cycles to 6 seconds.</p>
              <Link href="/invent-details" className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group/link">
                View Case Studies <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div id="lead" custom={2} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-12 group hover:border-indigo-500/30 transition-all border-indigo-500/10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Users className="text-indigo-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-indigo-400">LEAD</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-10">Leading 50+ engineers at scale. Managing $40B Google portfolios. Teaching AI to 1,500+ executives.</p>
              <Link href="/lead-details" className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group/link">
                View Case Studies <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
        </div>

        {/* Featured Publications Section */}
        <div className="max-w-screen-xl mx-auto mt-32">
          <div className="flex flex-col items-center text-center">
            <div className="text-[10px] font-black text-purple-400 tracking-[0.3em] uppercase mb-4">THOUGHT LEADERSHIP</div>
            <h2 className="text-4xl font-bold mb-16 text-white tracking-tight">Featured Publications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {linkedinData.featured_posts.map((post, i) => (
              <motion.a 
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.2 }} 
                className="glass-card p-10 group hover:border-purple-500/30 transition-all border-white/5 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-black text-purple-400 tracking-widest uppercase">{post.date}</div>
                    <Zap className="text-purple-500/30 w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">{post.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{post.description}</p>
                </div>
              </motion.a>
            ))}
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
            Engage the Why Man Concierge
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
