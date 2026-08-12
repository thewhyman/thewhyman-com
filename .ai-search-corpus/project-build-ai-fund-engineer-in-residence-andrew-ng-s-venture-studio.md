# AI Fund — Engineer in Residence (Andrew Ng's Venture Studio)

tags: build, project, what he built, AI Fund — Engineer in Residence (Andrew Ng's Venture Studio)

Period: May 2026 - Jul 2026
Role: Engineer in Residence
Link: https://aifund.ai
- Owned the full loop across two major pivots: customer discovery, ICP selection, contextual inquiry and Mom Test interviews, with demand validated before scaling the build.
- Validated demand against ~150 companies and 36 grounded outreaches; 19 of 22 confirmed the technical gap but not commercial urgency, so he killed the wedge on evidence with minimal sunk cost.
- Built brand-voice personas on embeddings, style-RAG and prompt tuning; designed a four-stage LLM workflow with layered auditors — deterministic checks for what is mechanically verifiable, semantic LLM judges for what is not — plus eval suites gating each stage, targeting AI slop reduction and humanized output.
- Model evaluation and selection: stood up the measurement spine first (two-judge ensemble scoring three axes — voice fidelity, coherence, audience fit), then ran controlled fine-tuning experiments on Oumi against Qwen base models. Full fine-tuning on a small, structurally-uniform corpus regressed coherence and fluency (catastrophic forgetting); he diagnosed the cause, moved to parameter-efficient LoRA, and set the decision ladder: prompt, then RAG, then fine-tune last.
- PostHog KPI instrumentation to verify shipped features moved behavior.
- The EIR concluded July 2026 having completed the exploration on social-media post adaptation; the technical build shipped but the commercial signal was not strong enough to advance to fund.
