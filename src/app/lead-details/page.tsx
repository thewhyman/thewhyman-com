'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Globe, TrendingUp, ChevronLeft, ArrowUpRight, BookOpen, ShieldCheck, BarChart } from 'lucide-react';
import Link from 'next/link';
import RouteCTA from '../../components/RouteCTA';import canonicalData from '../../../data/canonical.json';

export default function LeadDetails() {
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
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-indigo-400 uppercase tracking-widest hover:bg-white/10 transition-all mb-12"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dimensions
        </Link>

        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Users className="text-indigo-400 w-5 h-5" />
             </div>
             <span className="text-xs font-black tracking-[0.4em] text-indigo-400 uppercase">Dimension: LEAD</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter max-w-4xl leading-tight text-white">
            Organizational Scale & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Global Strategy.</span>
          </h1>
          <p className="max-w-2xl text-xl text-zinc-400 leading-relaxed">
            Directing cross-functional organizations to solve multi-billion dollar problems. My leadership is defined by technical rigor, operational efficiency, and a commitment to educating the next generation of AI leaders.
          </p>
        </div>

        {/* Leadership Matrix */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
        >
          {canonicalData.tracks.lead.projects.map((r, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-card p-12 group hover:border-indigo-400/30 transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/5 px-2 py-1 rounded">
                     {r.period}
                  </div>
                  <TrendingUp className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tighter text-white">{r.title}</h3>
                <p className="text-zinc-500 text-sm italic mb-6">{r.role}</p>
                <ul className="text-zinc-400 text-sm leading-relaxed mb-10 list-disc list-inside space-y-2">
                  {r.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Strategy Pillars */}
        <div className="border-t border-white/5 pt-24 mb-32">
          <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-4">Strategic Framework</div>
          <h2 className="text-3xl font-bold mb-12 text-white">The Executive Toolkit.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-zinc-400">
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Globe className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-white uppercase tracking-tight">Global Operations</h4>
               <p className="text-sm border-l border-indigo-500/20 pl-4">Managing distributed resources across geographic boundaries with unified architectural standards.</p>
            </div>
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <BarChart className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-white uppercase tracking-tight">Financial Rigor</h4>
               <p className="text-sm border-l border-purple-500/20 pl-4">Connecting engineering health directly to P&L outcomes. Validated $500M+ ROI delivery.</p>
            </div>
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-white uppercase tracking-tight">AI Governance</h4>
               <p className="text-sm border-l border-emerald-500/20 pl-4">Bridging the gap between frontier AI capability and corporate risk management.</p>
            </div>
          </div>
        </div>

        {/* Impact Links */}
        <div className="border-t border-white/5 pt-24">
          <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-4">Education & Influence</div>
          <h2 className="text-3xl font-bold mb-12 text-white">Teaching the Next Wave.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
            <a 
              href="https://em-executive.berkeley.edu/artificial-intelligence-business-strategies" 
              target="_blank" rel="noopener noreferrer"
              className="group glass-card p-10 flex border-white/5 hover:border-indigo-500/20 transition-all gap-8 items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">UC Berkeley Executive Education: AI Strategy.</h4>
                <p className="text-zinc-500 text-sm">Instructor for AI, ML, and Emerging Technologies. Taught over 1,500 senior leaders across the globe.</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center text-zinc-600">
           <div className="text-[10px] font-black tracking-widest uppercase">© {new Date().getFullYear()} The Why Man Hub</div>
           <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase">
              <Link href="/build-details" className="hover:text-indigo-400 transition-colors">Next Dimension: Build</Link>
              <Link href="/invent-details" className="hover:text-indigo-400 transition-colors">Next Dimension: Invent</Link>
           </div>
        </div>

        <RouteCTA />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </main>
  );
}
