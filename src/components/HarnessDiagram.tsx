'use client';

/**
 * Exponential OS — public architecture view.
 *
 * PUBLISH-SAFE BY CONSTRUCTION. This renders the LAYER ARCHITECTURE only.
 * Internal file names, private workspace names, internal skill codenames and
 * unpublished framework vocabulary are deliberately excluded. Only names that
 * are already public may appear here: Exponential OS, Co-Dialectic (open
 * source), exponential-developer, jury, MCP.
 *
 * Do not add internal identifiers to this file.
 */

const LAYERS = [
  {
    n: '01',
    name: 'Governance Kernel',
    tag: 'policy & invariants',
    items: ['Generative-principle constitution', 'Structural + semantic gates', 'Enforced before any output ships'],
  },
  {
    n: '02',
    name: 'Control Plane',
    tag: 'routing & stakes',
    items: ['Task routing by capability', 'Model right-sizing per task class', 'Verification intensity scales with stakes'],
  },
  {
    n: '03',
    name: 'Agentic Memory',
    tag: 'context management',
    items: ['Lifecycle hooks across the turn', 'Just-in-time context hydration', 'Long-term cross-session index'],
  },
  {
    n: '04',
    name: 'Verification Panels',
    tag: 'quality gates',
    items: ['Cross-family jury review', 'Grounding + hallucination checks', 'Cascading escalation on conflict'],
  },
  {
    n: '05',
    name: 'Lifecycle',
    tag: 'continuity & delivery',
    items: ['Session context reincarnation', 'Staged SDLC pipeline with hard gates', 'Handoff packets between sessions'],
  },
  {
    n: '06',
    name: 'Execution Runtime',
    tag: 'tools & isolation',
    items: ['Sandboxed shell + git', 'MCP server integrations', 'Isolated parallel worktrees'],
  },
];

export default function HarnessDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-teal-400">
          Exponential OS — multi-agent harness
        </span>
        {!compact && <span className="text-[10px] text-zinc-600">exponentialos.io</span>}
      </div>

      {/* human layer */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 mb-1.5">
        <div className="text-[11px] text-zinc-300">Human partner</div>
        <div className="text-[10px] text-zinc-500">judgment · creative vision · tacit knowledge</div>
      </div>
      <div className="text-center text-teal-500/40 text-xs leading-none mb-1.5">↓</div>

      <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
        {LAYERS.map((l) => (
          <div
            key={l.n}
            className="rounded-lg border border-teal-500/20 bg-teal-500/[0.04] px-3 py-2 hover:border-teal-500/40 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-mono text-teal-500/60">{l.n}</span>
              <span className="text-[11px] font-semibold text-teal-300">{l.name}</span>
              <span className="text-[10px] text-zinc-500">{l.tag}</span>
            </div>
            {!compact && (
              <ul className="mt-1 ml-6 space-y-0.5">
                {l.items.map((it) => (
                  <li key={it} className="text-[10px] text-zinc-400 leading-snug">· {it}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-teal-500/40 text-xs leading-none my-1.5">↓</div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="text-[11px] text-zinc-300">the-why-cyborg</div>
        <div className="text-[10px] text-zinc-500">target substrate — workspaces and repositories the harness operates on</div>
      </div>
    </div>
  );
}
