'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Cpu, ShieldCheck, Globe, ChevronLeft, ArrowUpRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import canonicalData from '../../../data/canonical.json';

export default function BuildDetails() {
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
                <Cpu className="text-teal-400 w-5 h-5" />
             </div>
             <span className="text-xs font-black tracking-[0.4em] text-teal-400 uppercase">Dimension: BUILD</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter max-w-4xl leading-tight">
            Reliability-First <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">AI Architectures.</span>
          </h1>
          <p className="max-w-2xl text-xl text-zinc-400 leading-relaxed">
            I don&apos;t build models; I build the systems that prove models work. My focus is engineering the infrastructure that makes AI dependable at scale.
          </p>
        </div>

        {/* Impact Matrix */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {canonicalData.tracks.build.projects.map((p, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-card p-12 group hover:border-teal-400/30 transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-400/5 px-2 py-1 rounded">
                     {p.period}
                  </div>
                  <Target className="w-5 h-5 text-zinc-600 group-hover:text-teal-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tighter text-white">{p.title}</h3>
                <p className="text-zinc-500 text-sm italic mb-6">{p.role}</p>
                <ul className="text-zinc-400 text-sm leading-relaxed mb-10 list-disc list-inside space-y-2">
                  {p.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Articles Section */}
        <div className="border-t border-white/5 pt-24">
          <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-4">Published Thought Leadership</div>
          <h2 className="text-3xl font-bold mb-12 text-white">The Applied AI Philosophy.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {canonicalData.tracks.build.publications.map((pub, idx) => (
              <a 
                key={idx}
                href={pub.link} 
                target="_blank" rel="noopener noreferrer"
                className="group glass-card p-10 flex border-white/5 hover:border-teal-500/20 transition-all gap-8 items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-teal-400 transition-colors">{pub.title}</h4>
                  <p className="text-zinc-500 text-sm">Published: {pub.date}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-teal-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center text-zinc-600">
           <div className="text-[10px] font-black tracking-widest uppercase">© {new Date().getFullYear()} The Why Man Hub</div>
           <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase">
              <Link href="/invent-details" className="hover:text-teal-400 transition-colors">Next Dimension: Invent</Link>
              <Link href="/lead-details" className="hover:text-teal-400 transition-colors">Next Dimension: Lead</Link>
           </div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </main>
  );
}
