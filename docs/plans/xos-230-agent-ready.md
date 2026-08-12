# thewhyman.com — agent readiness (XOS-230)

status: design
slug: xos-230-agent-ready
ticket: XOS-230
repo: /Users/anandvallam/aiprojects/thewhyman-com
worktree: /tmp/xos230-whyman (branch `feat/xos-230-agent-ready`)

## What

Take thewhyman.com from **34/100 (D)** to **Grade B or better** on the
isagentready.com scan by shipping the machine-readable layer the site is missing:
JSON-LD structured data, a real sitemap, `llms.txt`, `AGENTS.md`, security headers,
and a visible FAQ generated from `data/canonical.json`.

## Why

thewhyman.com is a **hiring surface**. An AI recruiting tool that reads the page today
sees unstructured prose — it cannot resolve "Anand Vallamsetla" to a known human entity
with a job title, an employer history, an alma mater, or verified profile links. Every
one of those is a `Person` schema field. Without it the page is invisible to exactly the
class of tool that increasingly does first-pass sourcing.

Second-order: the same `canonical.json` that feeds the concierge would feed the structured
data, so the answer a human gets from the chat widget and the answer an agent extracts
from the markup come from one source and cannot drift.

## Measured baseline (2026-08-12, isagentready.com MCP)

| Category | Weight | Score | Max |
|---|---|---|---|
| AI Content Discovery | 30% | 58 | 160 |
| AI Search Signals | 20% | **0** | 75 |
| Content & Semantics | 20% | 116 | 140 |
| Agent Protocols | 15% | **0** | 120 |
| Security & Trust | 15% | 32 | 75 |
| **Overall** | | **34/100 (D)** | |

Weighted score = Σ(weight × category/max). Verified: 10.88 + 0 + 16.57 + 0 + 6.40 = 33.85 ≈ 34.

### Projected score after this change

| Category | After | Weighted |
|---|---|---|
| AI Content Discovery | 160/160 | 30.0 |
| AI Search Signals | 75/75 | 20.0 |
| Content & Semantics | 140/140 | 20.0 |
| Agent Protocols | 0/120 (out of scope — see below) | 0.0 |
| Security & Trust | 72/75 | 14.4 |
| **Overall** | | **84.4 → Grade B** |

**Grade B does not require Agent Protocols.** Deliberately out of scope for this PR: the
Agent Protocols checkpoints (WebMCP, A2A Agent Card, MCP Discovery, API Catalog, Agent
Skills index) reward *declaring* agent endpoints. Declaring one that isn't backed by a
real, working endpoint is presence-not-substance — the exact false-green this pipeline
bans. The one honestly available today is an **OpenAPI spec for the real `/api/chat`
concierge endpoint** (20 pts, +2.5 overall); it is included as a stretch item, and the
remaining 100 points are deferred to a follow-up ticket that ships an actual MCP server.

## Corrections to the ticket's stated findings

Verified live before planning; two of the ticket's premises are wrong and change the work:

1. **`robots.txt` is not in this repo and cannot be edited here.** `https://thewhyman.com/robots.txt`
   returns 200 with 1,248 bytes that are **100% comments** — Cloudflare's Content-Signal
   explanatory preamble and nothing else. There is no `User-agent:` line, no `Allow:`, no
   `Content-Signal:` directive. It is injected by Cloudflare's managed-robots.txt zone
   feature onto a site that has no origin `robots.txt` to attach signals to. That is
   exactly why checkpoint 1.10 scores 0/10 and 1.2 scores 13/20.
   **The fix is to ship a real `public/robots.txt`** so Cloudflare's managed block attaches
   to a file that carries our directives, instead of standing alone as comments.
2. **thewhyman.com has no SPA catch-all.** `/sitemap.xml` correctly returns **404**. The
   ticket's "200 for everything" finding applies to exponentialos.io only. Content-based
   verification is still used here, but this site's status codes are honest.

## Scope

### In

**A. AI Search Signals (0 → 75) — the biggest hole**

- `Person` JSON-LD in the root layout: `name`, `jobTitle`, `description`, `url`, `image`,
  `knowsAbout`, `alumniOf`, `worksFor`, `sameAs`.
- `WebSite` + `ProfilePage` JSON-LD (satisfies 2.2 Organization/WebSite and 2.3 high-value type).
- `FAQPage` JSON-LD generated from `canonical.json` → `interviewQA` (13 × `{q, a}`).
- Author attribution (`author` on the page-level schema + a visible byline where appropriate).

**Source-of-truth rule:** every field is read from `data/canonical.json`,
`data/linkedin_public.json`, or `~/anand-career-os/brain/identity/experience-history.md`
at build time. **No biographical value is hand-typed into a schema literal.** If a field
has no canonical source it is omitted, never invented.

**B. Visible FAQ on `/meet` (enables FAQPage honestly + fixes question-format headings)**

`FAQPage` schema on a page that does not visibly show the Q&A is schema spam. So the 13
`interviewQA` pairs get rendered as a real, visible FAQ section on `/meet` — the page a
recruiter actually lands on to book — with each question as a heading. This satisfies
three acceptance criteria at once: FAQPage schema, question-format headings, and
one-source-of-truth.

**C. AI Content Discovery (58 → 160)**

- `sitemap.xml` — generated at build time from the App Router route list.
- `llms.txt` + `llms-full.txt` — generated from `canonical.json`.
- `AGENTS.md` — served at `/AGENTS.md`.
- `robots.txt` — real file with `User-agent` groups, `Content-Signal`, and `Sitemap:`.
- `pricing.md` — the scanner requires this specific agent content contract; the `/meet`
  engagement rates ($500/hr consulting, free recruiter/intro) are already public, so this
  is a restatement in the machine-readable location, not a new disclosure.
- Content freshness: `dateModified` in JSON-LD + `Last-Modified` handling.
- `Link` response headers with agent-useful `rel` values, via `public/_headers`.
- Content negotiation: serve markdown when `Accept: text/markdown`, via a Cloudflare
  Pages Function (this repo already ships `functions/`).

**D. Content & Semantics (116 → 140)**

- Question-format H2s on the main pages.
- Accessible names for the two icon-only buttons: `Navbar.tsx:168` (mobile menu toggle)
  and `WhyManConcierge.tsx:583` (chat close).
- Raise semantic-element coverage from 3/5 (add `<header>`/`<article>` where they are
  structurally correct — not decoratively).

**E. Security & Trust (32 → 72)** — all via `public/_headers`

- `Strict-Transport-Security` (20 pts)
- `Content-Security-Policy` (15 pts) — must not break the concierge, GA, or Framer Motion
- `X-Frame-Options` / `frame-ancestors` (5 pts)

### Out

- Agent Protocols beyond the `/api/chat` OpenAPI spec — follow-up ticket.
- Any change to the concierge's answers, model, or latency.
- Redesign of any page. The FAQ section is additive and must match existing visual language.
- Cloudflare zone-level managed-robots.txt settings — tracked as a shared decision with the
  exponentialos.io side of XOS-230.

## Implementation approach

Follow the repo's established build-time generator pattern — `prebuild` already chains
`fetch-substack.mjs` and `build-cloudflare-function.js`. Add one generator that reads
`data/*.json` and writes `public/{robots.txt,sitemap.xml,llms.txt,llms-full.txt,AGENTS.md,pricing.md,_headers}`
before `next build` copies `public/` into `out/`.

**Constraint discovered in recon:** every route file except `talks/[slug]/page.tsx` begins
with `'use client'`, so App Router `metadata` exports are unavailable on those routes.
JSON-LD therefore ships as an inline `<script type="application/ld+json">` from the root
layout (`src/app/layout.tsx`, a server component) for the site-wide graph, plus a server
wrapper for `/meet` following the existing `talks/[slug]` server+client split pattern.

## Acceptance criteria

- [ ] `https://thewhyman.com` re-scanned via `POST https://isagentready.com/mcp` scores **≥ 80 (B)**; before/after pasted into XOS-230
- [ ] AI Search Signals category scores **75/75**
- [ ] `Person`, `WebSite`, and `FAQPage` JSON-LD validate against schema.org and are present in the **shipped `out/` HTML**, not only in source
- [ ] FAQPage content is generated from `canonical.json` `interviewQA` — grep proves no hand-copied second copy of the Q&A text exists
- [ ] The 13 Q&A pairs are **visibly rendered** on `/meet`
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `AGENTS.md`, `pricing.md` are each verified **by content** (`curl | head` shows the expected first line), not by HTTP status
- [ ] `sitemap.xml` lists every route that exists in `out/` and no route that doesn't
- [ ] Security headers present on a live response: `curl -sI` shows HSTS, CSP, frame protection
- [ ] Both icon-only buttons have accessible names (verified by an a11y assertion, not by reading the diff)
- [ ] No biographical claim in any shipped schema that is absent from `canonical.json` / `linkedin_public.json` / `experience-history.md`
- [ ] `npm run build` clean; existing tests (`npm test`) still green

## Test plan

- [ ] `npm run build` — clean static export
- [ ] `npm test` — the 3 existing concierge test suites stay green
- [ ] New: a build-output assertion that every generated file exists in `out/` and its first line matches the expected format
- [ ] New: JSON-LD extraction test — parse `out/index.html` and `out/meet.html`, assert the schema blocks parse as valid JSON and carry the required `@type` values
- [ ] Playwright at 1440 and 375: `/meet` FAQ section renders, is expandable if collapsible, no layout overflow
- [ ] a11y assertion on the two buttons
- [ ] Post-deploy: live `curl` content checks + a fresh isagentready scan

## Rollback

Every change is additive: new files under `public/`, one new `prebuild` script, one
JSON-LD component, one FAQ section, header/aria attributes. Revert the PR — no data
migration, no schema change, no external state. The Cloudflare `_headers` file is the only
change that alters live response behavior; removing the file restores current behavior on
the next deploy.
