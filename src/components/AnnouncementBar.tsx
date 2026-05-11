'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'exponentialos-beta-bar-dismissed';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative z-[200] bg-gradient-to-r from-teal-950/80 via-zinc-900 to-teal-950/80 border-b border-teal-500/20 text-sm px-4 py-2 flex items-center justify-center gap-3">
      <span className="text-zinc-400">
        <span className="text-teal-400 font-semibold">ExponentialOS</span> is now in Preview —
      </span>
      <a
        href="https://exponentialos.io"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-medium underline underline-offset-2 decoration-teal-500/50 hover:decoration-teal-400 transition-colors"
      >
        Sign up for beta →
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
