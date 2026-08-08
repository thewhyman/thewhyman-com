'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, ArrowUpRight, Pin, PenLine, Code2 } from 'lucide-react';
import linkedinData from '../../../data/linkedin_public.json';
import substackPosts from '../../../data/substack_posts.json';
import RouteCTA from '../../components/RouteCTA';

// The Substack feed is refetched on every build. It also carries Substack's own
// referral/housekeeping posts, which are not articles — drop them so the section
// only ever shows real writing.
const NON_ARTICLE = /^invite your friends|^coming soon|^thanks for reading/i;
const articles = (substackPosts as { title: string; date: string; description: string; url: string; image?: string }[])
  .filter((p) => !NON_ARTICLE.test(p.title));

type FeaturedPost = (typeof linkedinData.featured_posts)[number];

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'W';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function PinnedCard({ post, i }: { post: FeaturedPost; i: number }) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !post.image || imageError;

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.12 }}
      className="glass-card p-0 group hover:border-teal-500/30 transition-all border-white/5 flex flex-col overflow-hidden"
    >
      <div className="w-full aspect-video bg-zinc-900 border-b border-white/5 relative flex items-center justify-center overflow-hidden shrink-0">
        {showFallback ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-teal-400/60" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-teal-300/40 uppercase">{getInitials(post.title)}</span>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 scale-110">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" aria-hidden="true" className="w-full h-full object-cover blur-xl opacity-30" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-105 duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-50 z-20 pointer-events-none" />
          </>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-teal-400 tracking-widest uppercase">{post.date}</div>
            <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-teal-400 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-teal-300 transition-colors">{post.title}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{post.description}</p>
        </div>
      </div>
    </motion.a>
  );
}


const decks = [
  {
    title: 'AI Resources',
    embedUrl: 'https://docs.google.com/presentation/d/15IxsbAc0x_dOALrvXwgNxY7Kc67U4sunudrVTYAD5gs/embed?start=false&loop=false',
    viewUrl: 'https://docs.google.com/presentation/d/15IxsbAc0x_dOALrvXwgNxY7Kc67U4sunudrVTYAD5gs/edit',
  },
  {
    title: 'Blockchain Resources',
    embedUrl: 'https://docs.google.com/presentation/d/1t7uV8uUH1p3pMirrqQgG-87_YN1NCH7dulpjKD4K5u0/embed?start=false&loop=false',
    viewUrl: 'https://docs.google.com/presentation/d/1t7uV8uUH1p3pMirrqQgG-87_YN1NCH7dulpjKD4K5u0/edit',
  },
];

export default function ResourcesPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden bg-[#050505] text-zinc-100">
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <section className="relative z-10 pt-20 pb-16 px-8 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase w-fit"
        >
          THE WHY MAN • RESOURCES
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]"
        >
          RESOURCES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-zinc-400 mb-20 leading-relaxed"
        >
          Writing, open source, and decks — on agentic harnesses, evaluation architecture,
          applied AI, and blockchain.
        </motion.p>

        {/* Pinned */}
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Pin className="w-3 h-3 text-teal-400" />
            <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase">Pinned</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {linkedinData.featured_posts.map((post, i) => (
              <PinnedCard key={i} post={post} i={i} />
            ))}
          </div>
        </div>

        {/* Latest Writing — pulled live from the Substack feed at build time */}
        {articles.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <PenLine className="w-3 h-3 text-teal-400" />
                <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase">Latest Writing</div>
              </div>
              <a
                href="https://www.thewhyman.blog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-black text-zinc-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
              >
                All posts <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((post, i) => (
                <motion.a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 group hover:border-teal-500/30 transition-all border-white/5 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-black text-teal-400 tracking-widest uppercase">{post.date}</div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-teal-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-4">{post.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Open source */}
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Code2 className="w-3 h-3 text-teal-400" />
            <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase">Open Source</div>
          </div>
          <motion.a
            href="https://github.com/Exponential-OS/prompt-engineering-in-action"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-white/5 hover:border-teal-500/30 transition-all flex flex-col md:flex-row md:items-center gap-6 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-black text-white group-hover:text-teal-300 transition-colors">Co-Dialectic</h3>
                <span className="text-[10px] font-black text-teal-400/70 tracking-widest uppercase border border-teal-500/20 rounded px-2 py-0.5">
                  AGPL-3.0
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-3">
                A free, open-source prompt and context optimizer. It sharpens your prompt before the model
                answers, saves tokens, and recovers from chat crashes. Works with Claude, ChatGPT and Gemini.
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Socratic prompting asks questions in one direction, teacher to student. Plato&apos;s dialectic
                had both sides refine each other. Co-Dialectic applies that to AI: your prompts get sharper,
                its answers get sharper, both improve in the same loop.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black text-teal-400 uppercase tracking-widest shrink-0">
              View on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </motion.a>
        </div>

        {/* Decks */}
        <div className="space-y-16">
          {decks.map((deck, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 border-white/5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase">{deck.title}</div>
                <a
                  href={deck.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] font-black text-zinc-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
                >
                  Open full screen <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-black aspect-video">
                <iframe
                  src={deck.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={deck.title}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <RouteCTA />
      </section>
    </main>
  );
}
