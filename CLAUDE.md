# TheWhyMan.com — Project Rules

## What This Is

The hub site — Anand's personal brand and portfolio. Links to all ..OS product sites. Deployed to Cloudflare Pages via Wrangler. Next.js 15 + Tailwind + TypeScript.

## Workspace Mapping

- **Specs & design reqs:** `$CAREER_OS_HOME/WIP/thewhyman-com-product/`
- **Handoff:** `$CAREER_OS_HOME/WIP/thewhyman-com-product/NEXT_SESSION_HANDOFF.md`
- **Cross-agent relay:** `$CAREER_OS_HOME/NEXT_SESSION_HANDOFF.md`
- **Brand identity:** `$CAREER_OS_HOME/.career-os/memory/brand-identity.md`
- **Routing manifest:** `$CAREER_OS_HOME/workspace.manifest.yaml`

## Engineering Principles

Read `~/.claude/CLAUDE.md` for P0-P17. They govern all decisions here.

## Tech Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Deploy:** Cloudflare Pages via GitHub auto-deploy (push to main → Cloudflare builds + deploys automatically)
- **AI:** Cloudflare Workers AI binding (`wrangler.toml` declares the `[ai]` binding)

## Before You Code

1. Read brand identity for tone, handles, and positioning.
2. Read design reqs in `WIP/thewhyman-com-product/Site Requirements/`.

## Dev Commands

```bash
npm run dev          # local dev server
npm run build        # production build (must pass before pushing)
git push             # triggers Cloudflare Pages auto-deploy via GitHub integration
```

**Do NOT use `wrangler pages deploy out` directly.** Deploys flow through GitHub → Cloudflare Pages. Direct-upload projects cannot have GitHub attached after the fact (GitHub-first invariant — see workspace CLAUDE.md).

## After Every Change

Build must pass. Check the live site before reporting done (Zero-QA-Tax).

## Git Strategy

- **Direct-to-main.** No PRs, no feature branches.
- **Atomic commits.** Each commit is one logical change with all artifacts in its blast radius (P9).

## Boundaries

- **This is a public repo.** No PII, no private career data, no API keys.
- **This is the HUB, not the products.** Product sites live in their own repos. This site links to them.
