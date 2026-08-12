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

**Source-of-truth rule (revised at Gate A.7 — RED finding):** every field is read at build
time from **in-repo sources only**: `data/canonical.json` and `data/linkedin_public.json`.

The first draft named `~/anand-career-os/brain/identity/experience-history.md` as a third
source. That is **undeployable** — Cloudflare Pages builds from a clean checkout of this
repo and has no access to any path outside it, so the generator would fail (or silently
emit less) in CI while passing on Anand's laptop. Dropped.

Consequences, all enforced:
- **No biographical value is hand-typed into a schema literal.** Every emitted value must
  be traceable to a key in one of the two in-repo JSON files.
- **Source precedence:** `canonical.json` wins over `linkedin_public.json` on any key
  present in both.
- **Missing source = hard failure.** If either JSON file is absent or unparseable the
  generator exits non-zero and fails the build. It must never emit a partial schema.
- **Field with no canonical source is omitted**, never invented. `alumniOf` and `worksFor`
  ship only if a structured source for them exists in-repo; `linkedin_public.json`
  `experience[]` (`role`, `company`, `period`, `description`) is the employer source.
- **Clean-build test:** the generator runs against a `git archive` copy of the repo in a
  temp dir with `HOME` unset, proving zero out-of-repo dependencies.

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
- Redesign of any existing page section.

## DECIDED at Gate A (2026-08-12) — AI crawler policy: allow everything

**Anand's decision: allow every AI crawler, including training crawlers, on both sites.**
thewhyman.com is a hiring surface; being in a model's training data means it knows who he
is months later, which is the point. Ship:

```
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
```

with every named agent explicitly allowed so the policy is consistent rather than implicit.
An implicit default-allow is what caps checkpoint 1.2 at 13/20 today.

**Load-bearing consequence:** Cloudflare's managed-robots.txt feature appends its block to
the origin file. Today thewhyman.com has no origin file, so only Cloudflare's comment
preamble is served. After shipping `public/robots.txt`, verify by `curl`ing the live file
that our directives are present and that no `Disallow:` was injected for any AI agent; if
one is, the zone-level managed setting must be turned off so the repo file is authoritative.

## Change manifest

```
+ added     public/robots.txt                    — GENERATED; allow-all AI policy + Content-Signal + Sitemap:
+ added     public/sitemap.xml                   — GENERATED from the App Router route list
+ added     public/llms.txt, public/llms-full.txt — GENERATED from data/canonical.json
+ added     public/AGENTS.md                     — GENERATED
+ added     public/pricing.md                    — GENERATED from the /meet engagement rates (required contract)
+ added     public/openapi.json                  — real spec for the existing /api/chat concierge endpoint
+ added     public/_headers                      — HSTS, CSP, frame protection, Link rel headers
+ added     scripts/build-agent-surface.js       — the single generator, chained into `prebuild`
+ added     src/components/JsonLd.tsx            — server component emitting the schema graph
+ added     src/components/FaqSection.tsx        — visible FAQ rendered from canonical.json interviewQA
+ added     src/app/meet/MeetPageContent.tsx     — the existing client UI, moved
+ added     functions/_middleware.js             — Accept: text/markdown content negotiation
+ added     scripts/__tests__/agent-surface.test.js — value-level assertions under the three-class contract:
                                                     Class 1 biographical/FAQ leaf values asserted string-equal
                                                     to their source key (incl. all 13 Q&As); Class 2 structural
                                                     constants asserted against an explicit allowlist; Class 3
                                                     derived values asserted via their derivation rule; any
                                                     emitted string outside Classes 1–3 fails the build.
                                                     Plus clean-build run with HOME unset (no out-of-repo reads).
~ modified  package.json                         — prebuild chain + test script
~ modified  src/app/layout.tsx                   — inject Person/WebSite/ProfilePage JSON-LD; metadataBase
~ modified  src/components/Navbar.tsx            — aria-label on the icon-only mobile menu button (line ~168)
~ modified  src/components/WhyManConcierge.tsx   — aria-label on the icon-only chat close button (line ~583)
~ modified  src/app/page.tsx and detail pages    — question-format H2s; semantic elements 3/5 → 5/5
− removed   (none)                               — no existing surface is superseded; every change is additive
⚙ migrated  src/app/meet/page.tsx: 'use client' route → server wrapper (metadata + FAQPage JSON-LD)
              + MeetPageContent.tsx (client UI)  — the single-file client route is retired; this follows the
                                                   server+client split talks/[slug] already uses
```

`− removed: (none)` is a stated claim, not an omission: the spec introduces no
"replaces/supersedes" language about an existing surface. The one structural replacement —
the `/meet` route's client-only form — is accounted for in `⚙ migrated`.

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
- [ ] `Person`, `WebSite`, and `FAQPage` JSON-LD are present in the **shipped `out/` HTML**, not only in source

**Structured-data validation (rewritten at Gate A.7 — RED finding).** "Parses as JSON and
has the right `@type`" is too weak to prove correctness. The test must be value-level:

- [ ] Validator is named and pinned: **`structured-data-testing-tool`** (npm, runs offline against the emitted HTML) for schema.org conformance, plus a repo-local assertion suite for value equality. If the validator cannot be run offline in CI, the fallback is an explicit required-property table asserted in the repo-local suite — never "it parsed"
- [ ] Every required property for each emitted `@type` is asserted present and non-empty (`Person`: `name`, `jobTitle`, `url`; `WebSite`: `name`, `url`; `FAQPage`: `mainEntity[]` each with `name` + `acceptedAnswer.text`)
- [ ] **Every emitted biographical value is asserted equal to its source key** in `canonical.json` / `linkedin_public.json` — a diff, not a presence check
- [ ] **All 13 FAQ question/answer strings are asserted equal** to `canonical.json` `interviewQA[].q` / `.a`, both in the JSON-LD and in the rendered DOM text
**Anti-fabrication gate — scoped correctly (Gate A.7 cycle 2).** The cycle-1 wording said
"no string literal absent from the source JSON," which is unsatisfiable: `https://schema.org`,
`Person`, `WebSite`, `FAQPage`, property names, derived URLs and a commit-derived
`dateModified` are structural, not biographical. The gate is therefore scoped to **leaf
values only**, with every structural or derived value allowlisted alongside the rule that
produces it:

- [ ] **Class 1 — biographical & FAQ leaf values** (`Person.name`, `jobTitle`, `description`, `knowsAbout[]`, `alumniOf`, `worksFor`, `sameAs[]`, and all 13 `FAQPage` question/answer strings): each asserted **string-equal to its source key** in `canonical.json` / `linkedin_public.json`. Any leaf value with no matching source key **fails the build**. This is the anti-fabrication gate.
- [ ] **Class 2 — structural constants** (`@context`, `@type`, schema.org property names): asserted against an explicit allowlist of permitted values. Not compared to source JSON.
- [ ] **Class 3 — derived values**, each with its derivation rule asserted rather than its literal: `url`/`sameAs` entries derive from a declared base URL + route table; `dateModified` derives from the source commit date; `image` derives from the repo asset path. A derived value whose rule does not reproduce it fails the build.
- [ ] No fourth class exists — any emitted string that falls outside Classes 1–3 fails the build, which is what keeps the allowlist from becoming a fabrication loophole
- [ ] The generator runs clean against a `git archive` temp copy with `HOME` unset (no out-of-repo reads)

**Per-behavior acceptance (added at Gate A.7 — YELLOW finding).** The aggregate ≥80 score
can pass while individual promised surfaces are broken, so each is asserted independently:

- [ ] `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `AGENTS.md`, `pricing.md` verified **by content**, not status — and `robots.txt` specifically asserted to contain the allow-all policy, the named agents, and a `Content-Signal:` line
- [ ] `sitemap.xml` lists every route that exists in `out/` and no route that doesn't
- [ ] `dateModified` present in JSON-LD and equal to the build's source-commit date
- [ ] Live `Last-Modified` header asserted present on the root document
- [ ] `curl -H 'Accept: text/markdown'` returns `content-type: text/markdown` **and a body that is markdown, not HTML**
- [ ] `Link` response header asserted present with at least one agent-useful `rel`
- [ ] `openapi.json` validated as a well-formed OpenAPI document **and** its declared `/api/chat` request/response shape asserted against the real handler in `functions/api/chat.js`
- [ ] Security headers on a live response: `curl -sI` shows HSTS, CSP, frame protection
- [ ] Both icon-only buttons have accessible names (a11y assertion, not diff-reading)
- [ ] `npm run build` clean; existing tests (`npm test`) still green

## Test plan

- [ ] `npm run build` — clean static export
- [ ] `npm test` — the 3 existing concierge test suites stay green
- [ ] New: a build-output assertion that every generated file exists in `out/` and its first line matches the expected format
- [ ] New: JSON-LD extraction test — parse `out/index.html` and `out/meet.html`, assert the schema blocks parse as valid JSON and carry the required `@type` values
- [ ] Playwright at 1440 and 375: `/meet` FAQ section renders, is expandable if collapsible, no layout overflow
- [ ] a11y assertion on the two buttons
- [ ] Post-deploy: live `curl` content checks + a fresh isagentready scan

## CSP rollout — staged, not big-bang (added at Gate A.7 — YELLOW finding)

A Content-Security-Policy is the one change here that can white-screen the site. This repo
runs Next.js hydration, Framer Motion, Google Analytics via `@next/third-parties`, and the
concierge calling `/api/chat` — each is a distinct CSP failure mode. So:

1. Ship CSP in **`Content-Security-Policy-Report-Only`** first, deploy, and confirm zero
   violation reports across all 8 routes at both viewports.
2. Only then promote to enforcing `Content-Security-Policy`.
3. Enforcing mode is verified by a Playwright run that asserts **network requests actually
   succeed** — hydration completes, the GA script loads, a concierge round-trip returns —
   not merely that the page looks rendered. A CSP-blocked script can leave a page that
   *looks* fine and is functionally dead.

## Rollback

**In-repo:** every change is additive — new files under `public/`, one `prebuild` script, a
JSON-LD component, a FAQ section, header/aria attributes, and the `/meet` server+client
split. Revert the PR. No data migration, no schema change.

**Out-of-repo (does NOT revert with the PR — added at Gate A.7):**

- `public/_headers` alters live response behavior; removing the file restores current
  behavior on the next deploy. Reverting the PR does do this.
- **If the Cloudflare zone-level managed-robots.txt setting is changed** during rollout
  (only if the live `curl` check shows Cloudflare injecting `Disallow:` for an AI agent
  against our allow-all policy), that is **external zone state that the PR revert does not
  restore**. Capture the prior value before changing it, record it verbatim in the PR body,
  and restore it explicitly on rollback.


## Design-review verdict (Gate-A.7)

- verdict: UNREACHABLE
- cycle: 1
- reviewer: anthropic/claude-fable-5
- cross_family: not_required
- manifest_sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
- timestamp: 2026-08-12T15:02:33.399Z
- findings: none
