'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 md:px-12 h-24 flex items-center justify-between border-b border-white/10 transition-all duration-300 ${isOpen ? 'bg-black' : 'bg-black/60 backdrop-blur-xl'}`}>
      {/* Logo & Name Signature */}
      <Link href="/" className="flex items-center gap-3 md:gap-4 group z-[110] relative">
        <div className="text-2xl md:text-3xl font-black tracking-tighter transition-all group-hover:opacity-80">
          <span className="text-teal-400">THE</span>WHYMAN
        </div>
        <div className="h-5 w-px bg-white/20" />
        <div className="text-[12px] md:text-[15px] font-black uppercase tracking-[0.3em] text-white group-hover:text-teal-400 transition-colors">
          Anand Vallamsetla
        </div>
      </Link>

      <div className="hidden md:flex gap-10 items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        <Link href="/#methodology" className="hover:text-teal-400 transition-colors">Methodology</Link>
        <Link href="/#dimensions" className="hover:text-teal-400 transition-colors">Case Studies</Link>
        <Link href="/#publications" className="hover:text-purple-400 transition-colors">Publications</Link>
        <a 
          href="https://app.reclaim.ai/m/anand-career/intro" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white border border-white/10 px-8 py-3 rounded-xl hover:bg-white/5 hover:border-teal-500/50 transition-all font-black"
        >
          Intro Meeting
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center h-full z-[110]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 relative text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#050505] z-[90] pt-32 px-12 flex flex-col gap-8"
          >
            <div className="text-[11px] font-black text-teal-400 tracking-[0.4em] uppercase mb-4 border-b border-white/5 pb-4">
              Directory
            </div>
            <Link 
              href="/#methodology" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-teal-400 transition-all"
            >
              <span>Methodology</span>
              <div className="w-8 h-px bg-teal-400/0 group-hover:w-12 group-hover:bg-teal-400 transition-all" />
            </Link>
            <Link 
              href="/#dimensions" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-teal-400 transition-all"
            >
              <span>Case Studies</span>
              <div className="w-8 h-px bg-teal-400/0 group-hover:w-12 group-hover:bg-teal-400 transition-all" />
            </Link>
            <Link 
              href="/#publications" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-purple-400 transition-all"
            >
              <span>Publications</span>
              <div className="w-8 h-px bg-purple-400/0 group-hover:w-12 group-hover:bg-purple-400 transition-all" />
            </Link>
            <a 
              href="https://app.reclaim.ai/m/anand-career/intro" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-teal-400 transition-all"
            >
              <span>Intro Meeting</span>
              <div className="w-8 h-px bg-teal-400/0 group-hover:w-12 group-hover:bg-teal-400 transition-all" />
            </a>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="text-[11px] font-black text-teal-400/50 tracking-[0.4em] uppercase mb-6">
                Systems Support
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new CustomEvent('open-concierge'));
                }}
                className="group flex items-center gap-4 text-xl font-black uppercase tracking-[0.2em] text-teal-400 hover:text-white transition-all text-left"
              >
                <span>Engage Concierge</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </button>
            </div>
            
            <div className="mt-auto mb-12 flex flex-col gap-2">
              <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">The Architect</span>
              <span className="text-xl font-bold tracking-tight text-zinc-400">Anand Vallamsetla</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
