'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, ArrowUpRight } from 'lucide-react';
import substackPosts from '../../../data/substack_posts.json';

type Post = (typeof substackPosts)[number];

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'W';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function ArticleCard({ post, i }: { post: Post; i: number }) {
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
      transition={{ delay: i * 0.1 }}
      className="glass-card p-6 group hover:border-purple-500/30 transition-all border-white/5 flex gap-5 items-start"
    >
      <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center">
        {showFallback ? (
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-purple-400/60" />
            <span className="text-[10px] font-black text-purple-300/50 uppercase">{getInitials(post.title)}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={post.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black text-purple-400 tracking-widest uppercase mb-1.5">{post.date}</div>
        <h3 className="text-sm font-bold text-white leading-snug mb-1.5 group-hover:text-purple-300 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{post.description}</p>
      </div>
      <ArrowUpRight className="shrink-0 w-4 h-4 text-zinc-700 group-hover:text-purple-400 transition-colors mt-0.5" />
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
          Articles, frameworks, and decks for building with AI.
        </motion.p>

        {/* Latest Articles */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[10px] font-black text-purple-400 tracking-[0.3em] uppercase">Latest Articles</div>
            <a
              href="https://thewhyman.blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-black text-zinc-500 hover:text-purple-400 transition-colors uppercase tracking-widest"
            >
              All essays <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {substackPosts.map((post, i) => (
              <ArticleCard key={i} post={post} i={i} />
            ))}
          </div>
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
      </section>
    </main>
  );
}
