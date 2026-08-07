'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Rocket, Sparkles, Zap, ChevronLeft, ArrowUpRight, Trophy, Code } from 'lucide-react';
import Link from 'next/link';
import RouteCTA from '../../components/RouteCTA';
import canonicalData from '../../../data/canonical.json';

export default function InventDetails() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 bg-[#050505] text-zinc-100 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-teal-400 uppercase tracking-widest hover:bg-white/10 transition-all mb-12"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dimensions
        </Link>

        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                <Rocket className="text-teal-400 w-5 h-5" />
             </div>
             <span className="text-xs font-black tracking-[0.4em] text-teal-400 uppercase">Dimension: INVENT • 10x Hackathon Champion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter max-w-4xl leading-tight">
            Winning at the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Speed of AI.</span>
          </h1>
          <p className="max-w-2xl text-xl text-zinc-400 leading-relaxed">
            I specialize in the 0-to-1 phase. My focus is on synthesizing complex technologies—AI, Blockchain, Distributed Systems—into high-velocity market solutions.
          </p>
        </div>

        {/* Primary Innovation Stories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {canonicalData.tracks.invent.wins.map((win, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-card p-12 group hover:border-teal-400/30 transition-all border-emerald-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-400/5 px-2 py-1 rounded">
                     {win.period}
                  </div>
                  <Zap className="w-5 h-5 text-emerald-400/40 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tighter text-white">{win.title}</h3>
                <ul className="text-zinc-400 text-sm leading-relaxed list-disc list-inside space-y-2">
                  {win.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Innovation Ledger (The Extra Wins) */}
        <div className="border-t border-white/5 pt-24 pb-32">
          <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-4">The Winner&apos;s Circle</div>
          <h2 className="text-3xl font-bold mb-12 text-zinc-200">Continuous Innovation Ledger</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {canonicalData.tracks.invent.awards.map((win, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-start group hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-4 mb-2">
                   <Trophy className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                   <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-100 transition-colors">{win.title}</span>
                </div>
                <span className="text-xs font-medium text-zinc-500">{win.context}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-12 p-16 rounded-[40px] bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-white/5 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-48 h-48 text-teal-400" />
           </div>
           <h2 className="text-3xl font-bold mb-6">Have a moonshot in mind?</h2>
           <p className="text-zinc-400 mb-10 max-w-lg mx-auto">I architect at the boundary of what exists and what is next — and I test it before I scale it. Two product bets built from zero at Andrew Ng&apos;s studio, validated against ~150 companies, one killed on evidence. Let&apos;s build the future why.</p>
           <a href="https://app.reclaim.ai/m/anand-career/intro" target="_blank" rel="noopener noreferrer" className="inline-flex h-14 px-10 rounded-xl bg-white text-black font-black text-sm uppercase tracking-widest items-center hover:bg-teal-400 transition-all">
              Initialize a Dialogue
           </a>
        </div>

        {/* Footer Navigation */}
        <div className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center text-zinc-600">
           <div className="text-[10px] font-black tracking-widest uppercase">© {new Date().getFullYear()} The Why Man Hub</div>
           <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase">
              <Link href="/build-details" className="hover:text-teal-400 transition-colors">Prev Dimension: Build</Link>
              <Link href="/lead-details" className="hover:text-teal-400 transition-colors">Next Dimension: Lead</Link>
           </div>
        </div>

        <RouteCTA />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </main>
  );
}
