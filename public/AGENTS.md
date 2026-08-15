# Agent guide for https://thewhyman.com

## Who this site is about

This is the official professional site for Anand Vallamsetla, Applied AI Engineering Leader | Evaluation-First LLM & Agent Platforms | Reliability & Guardrail Design | ex-Google.

Hands-on engineering leader and applied AI architect with 26 years of experience (2000-present) — sets technical direction and writes the code. Brings 17 years of engineering management including a $40B+ portfolio at Google delivering $500M+ ROI. Most recently Engineer in Residence at AI Fund, Andrew Ng's venture studio (May-Jul 2026).

## What agents can find

- [Home](https://thewhyman.com/): professional overview and primary navigation.
- [Meet](https://thewhyman.com/meet): public engagement options, rates, and booking links.
- [Resources](https://thewhyman.com/resources): writing and project resources.
- [Build](https://thewhyman.com/build-details), [Invent](https://thewhyman.com/invent-details), and [Lead](https://thewhyman.com/lead-details): evidence grouped by professional track.
- [Talks](https://thewhyman.com/talks): public talk abstracts and presentation materials.
- [llms.txt](https://thewhyman.com/llms.txt) and [llms-full.txt](https://thewhyman.com/llms-full.txt): concise and expanded machine-readable profiles.
- [pricing.md](https://thewhyman.com/pricing.md): machine-readable public engagement rates.

## Public machine-readable sources

- [Concise profile](https://thewhyman.com/llms.txt)
- [Expanded public profile](https://thewhyman.com/llms-full.txt)
- [Public engagement rates](https://thewhyman.com/pricing.md)

## Concierge API

- Endpoint: `POST https://thewhyman.com/api/chat`
- Contract: [OpenAPI 3.1](https://thewhyman.com/openapi.json)
- Request body: a `messages` array whose entries contain `role` (`user`, `bot`, or `assistant`) and string `content`.
- The endpoint streams `text/event-stream` by default. Add `?stream=0` for a buffered JSON response containing `role` and `content`.
