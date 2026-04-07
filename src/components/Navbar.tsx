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
        <Link href="/#thought-leadership" className="hover:text-purple-400 transition-colors">Thought Leadership</Link>
        <div className="flex items-center gap-4">
          <a href="https://github.com/thewhyman" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a href="https://linkedin.com/in/thewhyman" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
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
              href="/#thought-leadership" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-purple-400 transition-all"
            >
              <span>Thought Leadership</span>
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
            
            <div className="mt-auto mb-12 flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <a href="https://github.com/thewhyman" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href="https://linkedin.com/in/thewhyman" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#0A66C2] transition-colors">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">The Architect</span>
                <span className="text-xl font-bold tracking-tight text-zinc-400">Anand Vallamsetla</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
