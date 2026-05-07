'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  { label: 'xHumanOS', sub: 'Career intelligence for individuals', href: 'https://exponentialos.io', external: true },
  { label: 'xTeamOS', sub: 'Team performance & culture', href: 'https://exponentialos.io', external: true },
  { label: 'xFamilyOS', sub: 'Family health, culture & memory', href: null, external: false },
  { label: 'Co-Dialectic', sub: 'AI coaching protocol', href: 'https://github.com/thewhyman/prompt-engineering-in-action', external: true },
  { label: 'xos.name', sub: 'Namespace & brand hub', href: 'https://xos.name', external: true },
];

const THOUGHT_LINKS = [
  { label: 'Thought Leadership', href: '/#thought-leadership', external: false },
  { label: 'Resources', href: '/resources', external: false },
  { label: 'Talks', href: '/talks', external: false },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'products' | 'thought' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<'products' | 'thought' | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDrop(which: 'products' | 'thought') {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(which);
  }
  function closeDrop() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }
  function keepOpen() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 md:px-12 h-24 flex items-center justify-between border-b border-white/10 transition-all duration-300 ${isOpen ? 'bg-black' : 'bg-black/60 backdrop-blur-xl'}`}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 md:gap-4 group z-[110] relative">
        <div className="text-2xl md:text-3xl font-black tracking-tighter transition-all group-hover:opacity-80">
          <span className="text-teal-400">THE</span>WHYMAN
        </div>
        <div className="h-5 w-px bg-white/20" />
        <div className="text-[12px] md:text-[15px] font-black uppercase tracking-[0.3em] text-white group-hover:text-teal-400 transition-colors">
          Anand Vallamsetla
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-10 items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        <Link href="/#methodology" className="hover:text-teal-400 transition-colors">Methodology</Link>
        <Link href="/#dimensions" className="hover:text-teal-400 transition-colors">Case Studies</Link>

        {/* Products dropdown */}
        <div
          className="relative"
          onMouseEnter={() => openDrop('products')}
          onMouseLeave={closeDrop}
        >
          <button className="flex items-center gap-1 hover:text-amber-400 transition-colors">
            Products
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openDropdown === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={keepOpen}
                onMouseLeave={closeDrop}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl"
              >
                {PRODUCTS.map((p) =>
                  p.href ? (
                    <a
                      key={p.label}
                      href={p.href}
                      target={p.external ? '_blank' : undefined}
                      rel={p.external ? 'noopener noreferrer' : undefined}
                      className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-amber-400/10 transition-colors group"
                    >
                      <span className="text-[11px] font-black tracking-[0.15em] text-white group-hover:text-amber-400 transition-colors">{p.label}</span>
                      <span className="text-[10px] font-medium text-zinc-500 normal-case tracking-normal">{p.sub}</span>
                    </a>
                  ) : (
                    <div key={p.label} className="flex flex-col gap-0.5 px-4 py-3 rounded-xl opacity-40 cursor-not-allowed">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black tracking-[0.15em] text-zinc-400">{p.label}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500 normal-case tracking-normal">soon</span>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-600 normal-case tracking-normal">{p.sub}</span>
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thought Leadership dropdown */}
        <div
          className="relative"
          onMouseEnter={() => openDrop('thought')}
          onMouseLeave={closeDrop}
        >
          <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            Thought Leadership
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'thought' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openDropdown === 'thought' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={keepOpen}
                onMouseLeave={closeDrop}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl"
              >
                {THOUGHT_LINKS.map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="block px-4 py-3 rounded-xl hover:bg-purple-400/10 text-[11px] font-black tracking-[0.15em] text-zinc-400 hover:text-purple-400 transition-colors"
                  >
                    {t.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a
          href="https://thewhyman.bio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-teal-400 transition-colors"
        >
          Contact Info
        </a>

        <div className="flex items-center gap-4">
          <a href="https://github.com/thewhyman" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a href="https://linkedin.com/in/thewhyman" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>

        <Link
          href="/meet"
          className="text-white border border-white/10 px-8 py-3 rounded-xl hover:bg-white/5 hover:border-teal-500/50 transition-all font-black"
        >
          Meet
        </Link>
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden flex items-center h-full z-[110]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 relative text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#050505] z-[90] pt-32 px-12 flex flex-col gap-8 overflow-y-auto"
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

            {/* Products accordion */}
            <div className="flex flex-col gap-0">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === 'products' ? null : 'products')}
                className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-400 transition-all"
              >
                <span>Products</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileExpanded === 'products' ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileExpanded === 'products' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pl-4 flex flex-col gap-4 border-l border-amber-400/20 ml-2 mt-3">
                      {PRODUCTS.map((p) =>
                        p.href ? (
                          <a
                            key={p.label}
                            href={p.href}
                            target={p.external ? '_blank' : undefined}
                            rel={p.external ? 'noopener noreferrer' : undefined}
                            onClick={() => setIsOpen(false)}
                            className="flex flex-col"
                          >
                            <span className="text-base font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-amber-400 transition-colors">{p.label}</span>
                            <span className="text-xs text-zinc-600 normal-case">{p.sub}</span>
                          </a>
                        ) : (
                          <div key={p.label} className="flex flex-col opacity-40">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black uppercase tracking-[0.15em] text-zinc-500">{p.label}</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500">soon</span>
                            </div>
                            <span className="text-xs text-zinc-600 normal-case">{p.sub}</span>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Thought Leadership accordion */}
            <div className="flex flex-col gap-0">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === 'thought' ? null : 'thought')}
                className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-purple-400 transition-all"
              >
                <span>Thought Leadership</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileExpanded === 'thought' ? 'rotate-180 text-purple-400' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileExpanded === 'thought' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pl-4 flex flex-col gap-4 border-l border-purple-400/20 ml-2 mt-3">
                      {THOUGHT_LINKS.map((t) => (
                        <Link
                          key={t.label}
                          href={t.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-purple-400 transition-colors"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="https://thewhyman.bio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-teal-400 transition-all"
            >
              <span>Contact Info</span>
              <div className="w-8 h-px bg-teal-400/0 group-hover:w-12 group-hover:bg-teal-400 transition-all" />
            </a>

            <Link
              href="/meet"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-teal-400 transition-all"
            >
              <span>Meet</span>
              <div className="w-8 h-px bg-teal-400/0 group-hover:w-12 group-hover:bg-teal-400 transition-all" />
            </Link>

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
