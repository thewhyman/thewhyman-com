# TheWhyMan.com — Project Rules

## What This Is

The hub site — Anand's personal brand and portfolio. Links to all ..OS product sites. Deployed to Cloudflare Pages via Wrangler. Next.js 15 + Tailwind + TypeScript.

## Workspace Mapping

- **Specs & design reqs:** `~/anand-career-os/WIP/thewhyman-com-product/`
- **Handoff:** `~/anand-career-os/WIP/thewhyman-com-product/NEXT_SESSION_HANDOFF.md`
- **Cross-agent relay:** `~/anand-career-os/NEXT_SESSION_HANDOFF.md`
- **Brand identity:** `~/anand-career-os/.career-os/memory/brand-identity.md`
- **Routing manifest:** `~/anand-career-os/workspace.manifest.yaml`

## Engineering Principles

Read `~/.claude/CLAUDE.md` for P0-P17. They govern all decisions here.

## Tech Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Deploy:** Cloudflare Pages (`wrangler.toml`)
- **AI:** Cloudflare Workers AI binding

## Before You Code

1. Read brand identity for tone, handles, and positioning.
2. Read design reqs in `WIP/thewhyman-com-product/Site Requirements/`.

## Dev Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npx wrangler pages deploy out  # deploy to Cloudflare
```

## After Every Change

Build must pass. Check the live site before reporting done (Zero-QA-Tax).

## Git Strategy

- **Direct-to-main.** No PRs, no feature branches.
- **Atomic commits.** Each commit is one logical change with all artifacts in its blast radius (P9).

## Boundaries

- **This is a public repo.** No PII, no private career data, no API keys.
- **This is the HUB, not the products.** Product sites live in their own repos. This site links to them.
