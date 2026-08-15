# thewhyman.com — agent guide

Read this before changing anything. It exists because three separate agents have
now rediscovered the same architecture from scratch, and one of them (2026-08-15)
spent an hour carefully repairing a generator whose output nothing reads.

---

## The one rule: `data/canonical.json` is the only source of truth

Every public surface and the chatbot are GENERATED from it. Never hand-edit a
generated file — the next build silently overwrites you.

```
data/canonical.json                 ← edit HERE, always
  ├─ scripts/build-cloudflare-function.js  → functions/api/chat.js   (the concierge)
  └─ scripts/build-agent-surface.js        → public/llms.txt, llms-full.txt,
                                              AGENTS.md, robots.txt, sitemap.xml,
                                              _headers, 404.html, .well-known/agents.json
```

Both run automatically in `prebuild`, so a deploy regenerates them. That means a
stale generated file in git does **not** imply a stale live site — check the live
surface before concluding anything.

**A claim can live in FOUR places.** When changing a fact (a number, a title, a
date), grep the whole repo, not just canonical.json. On 2026-08-14 the leadership
span was fixed in canonical.json and verified live on AGENTS.md — and the chatbot
kept saying the old number for another day, because the claim was ALSO hardcoded
in prose inside `build-cloudflare-function.js`'s `SYSTEM_PROMPT`. Verify the
surface the user actually touches, not the one that is easy to curl.

---

## What is public is already decided: `_publicationBoundaries`

`canonical.json._publicationBoundaries` is an explicit publication-approval list.
`build-agent-surface.js` projects canonical through it before rendering, so a
section that is not declared there cannot reach a public surface.

**Deliberately NOT public** (do not "fix" these):

| Section | Why it stays private |
|---|---|
| `growthAreas` | Anand's weaknesses. The concierge answers them when asked; broadcasting them to every crawler reading llms-full.txt is a different act. |
| `keyMetricsTripwire` | The authoritative-numbers guard. It is pinned into the system prompt so retrieval can never decide what is TRUE, only what is relevant. |
| `seniorSignals`, `exponentialOsDepth` | Not declared. Treat as intentional unless Anand says otherwise. |
| `education` | Not declared public, but IS registered in the concierge's block list (added after the Berkeley EMBA dinner defect, 2026-08-13). So the bot can state his degrees and the public surface cannot. That asymmetry may be intentional or an oversight — **ask Anand, do not resolve it silently.** |

Two tests enforce both directions. Declared-but-unrendered is a silent loss of
intended content; undeclared-but-rendered is a leak. The second is the one that
hurts, so it is asserted separately.

---

## The concierge (`functions/api/chat.js`)

Generated. Runs on Cloudflare Workers AI. Its knowledge is assembled from
`BLOCKS` in `build-cloudflare-function.js`: `always: true` blocks (`basics`,
`keyMetricsTripwire`) are the spine and always included; the rest are selected by
KEYWORD MATCH against the user's message. If the bot "does not know" something
that is in canonical.json, the usual cause is a missing keyword in that block's
`keys`, not missing data.

**Formatting is part of the answer.** The panel renders paragraphs, `- ` bullets
and `**bold**` via the `RichText` component in `src/components/WhyManConcierge.tsx`.
Before 2026-08-15 it rendered `msg.content` as a raw text node, so HTML collapsed
every newline and answers arrived as one unreadable wall — worst on the most
structured answers, since `growthAreas` specifies five ordered parts per area.
`SYSTEM_PROMPT` rule 4e tells the model to emit that structure. If you change one,
change the other.

---

## Things that were tried and removed — do not resurrect

**`.ai-search-corpus/` and `scripts/build-ai-search-corpus.js` (deleted 2026-08-15).**
One-doc-per-idea corpus for AI search. 58 files, 248KB, committed. It had drifted
badly behind canonical.json and was repaired in good faith — before anyone checked
that **nothing read it**: not `prebuild`, not `deploy.yml`, not the site (verified
404). If you find yourself reviving it, first name the consumer.

The lesson generalises, and it is the reason this file exists: before fixing a
generator, establish that its output has a reader.

---

## Before you claim it works

- `npm run build` then `npm test`. Both must exit 0. Four suites, all `ALL PASS`.
- Many assertions read `out/`, so **without a build you will see ~50-77 spurious
  failures** and conclude you broke something. Build first.
- After deploying, verify the SURFACE THE USER TOUCHES. `curl`ing AGENTS.md is not
  evidence about the chatbot.

## Deploy

Cloudflare Pages, auto-deploys on push to `main` (`.github/workflows/deploy.yml`
→ `wrangler pages deploy out`). A push-time IP gate scans public files and may
`WARN` with zero findings when its judge returns non-JSON; that is a tooling
hiccup, not a finding.

## Repo conventions

- Direct commits to `main` are blocked by a hook. Use a feature branch, then
  `merge --ff-only`.
- Never commit secrets; `LINEAR_API_KEY` and friends live in `~/cyborg/.env`.
- Related workspace context lives in `~/anand-career-os`, which is a separate repo.
