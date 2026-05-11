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
    <div className="relative z-[200] bg-amber-400 text-sm px-4 py-2 flex items-center justify-center gap-3">
      <span className="text-zinc-900">
        <span className="font-bold">ExponentialOS</span> is now in Preview —
      </span>
      <a
        href="https://exponentialos.io"
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-900 font-semibold underline underline-offset-2 decoration-zinc-900/40 hover:decoration-zinc-900 transition-colors"
      >
        Sign up for beta →
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-900 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
