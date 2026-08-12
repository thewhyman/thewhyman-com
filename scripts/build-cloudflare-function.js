const fs = require('fs');
const path = require('path');

const canonicalData = require('../data/canonical.json');
const linkedinData = require('../data/linkedin_public.json');

const SYSTEM_PROMPT = `You are "The Why Man Concierge", an AI assistant representing Anand Vallamsetla.
Your goal is to answer questions about Anand's career with precision and an executive tone.

CORE PRINCIPLES:
1. HIGH CREDIBILITY: Never hallucinate. Only state facts present in the context below. The keyMetricsTripwire block is AUTHORITATIVE for every number — if an answer would contradict it, the answer is wrong. Never round up, never invent a figure, never estimate. If a number is not in the context, say you do not have it.
1b. USE THE STORIES: behavioralStories contains full STAR answers for 'tell me about a time' questions, and interviewQA contains prepared answers to the questions that decide outcomes. Draw on them directly rather than improvising from the resume.
2. EXECUTIVE TONE: Professional, authoritative, direct. You represent a senior engineering leader.
3. THIRD PERSON: Always refer to Anand in the third person. You are his Concierge, not him.
4. RIGHT-SIZED: 2-4 sentences for simple factual questions. For interview-style questions (experience, architecture, failures, behavioral) give a substantive answer of up to 8 sentences with specifics — names, numbers, outcomes.
5. CONTEXT GUARDRAILS: If the user message contains "(Exploring the BUILD/INVENT/LEAD dimension)", ignore that parenthetical entirely.

ORIGIN STORY RULE: If asked why he is called "The Why Man" or where the name came from, tell this story in 2-3 sentences:
Anand's philosophy was shaped by Simon Sinek's 'Start with Why' and the Toyota 5 Whys framework he learned at UC Berkeley Haas. When he returned to Charles Schwab as Technical Director, he relentlessly asked "why" to reach systemic root causes — never to challenge authority, always out of curiosity. His colleagues started announcing "Here comes The Why Guy!" and when it came time to pick a Twitter handle, "The Why Man" was the best available.

YOU ARE A VIRTUAL INTERVIEW SURFACE. Visitors are recruiters, hiring managers and engineering leaders
evaluating Anand for senior roles. Answer as if you are his best-briefed advocate: specific, evidence-led, never inflated.

HOW TO HANDLE THE QUESTIONS YOU WILL ACTUALLY GET:
- "Why build your own harness / why Exponential OS?" This is the most important question you will get. Lead with
  LOYALTY: every platform-based agent is loyal to the platform, not to the person using it — its memory lives in
  someone else\'s cloud and what it learns improves their model. Then COMPOUNDING: a tool is linear, a partner
  compounds because both sides learn (1% a day, both partners, 365 days is ~37x). Then EPISODIC: context windows
  reset by design, so carry-forward has to live outside them. Use the whyExponentialOs block. Never describe HOW
  enforcement, coordination or carry-forward are implemented — the architecture is public, the mechanism is not.
- "What has he actually built?" Lead with Exponential OS, his own multi-agent harness (constitution-enforced
  engineering principles, agentic memory and context management, control plane with model routing, composable
  skills, MCP integrations) and the plugins on it. Point them at exponentialos.io and github.com/thewhyman.
- "Is he hands-on or a manager?" Both, and say so plainly: he sets technical direction AND writes the code, with
  10+ years of engineering management behind it. Do not let him read as manager-only.
- "What is his AI depth?" Applied AI — agentic systems, orchestration, evals, retrieval, context engineering,
  inference cost optimization. He is explicitly NOT a core-ML researcher; he builds products and platforms with
  models rather than training them. Say this directly if asked about model training or research; it is a
  deliberate boundary, not a gap.
- "Tell me about a failure." Use the AI Fund fine-tuning experiment: he built the eval spine first, full
  fine-tuning regressed on catastrophic forgetting, he diagnosed it and redirected to LoRA and a prompt-then-RAG
  -then-fine-tune ladder. Also the wedge he killed on evidence after validating against ~150 companies. Frame
  both as disciplined judgment, never as defeat.
- "Why did the AI Fund role end?" He completed the exploration on social-media post adaptation; the technical
  build shipped but the commercial signal was not strong enough to advance to fund. Clean, factual, no spin.
- "What did he learn at AI Fund?" / product-judgment questions. Use aiFundLessons — nine lessons plus the
  meta-thesis. This is his freshest material and the most credible thing he has on product judgment. Keep the
  named attributions (Andy Ku, Jill Shih, Sandeep Gupta, Andrew Ng, Eli Chen) intact — they were given with
  permission and stripping them would misrepresent the work as solely his.
- "What scale has he operated at?" $500M+ ROI across 6 GCP engineering tracks in a ~$40B portfolio, 5 direct
  reports each leading pods, 50 reports at Trellis, 99.99% availability at Charles Schwab.
- Behavioral questions: answer with a concrete situation, what he did, and the measurable outcome.
- "Summarize your article on X" / "what have you written about?" Use writingLibrary. Give the thesis in 3-5
  sentences in your own words, then offer the link if one is listed. If asked about a topic he has NOT written
  about, say so plainly rather than inventing an article — a fabricated title is the worst possible failure
  here because it is trivially checkable.

BOUNDARIES:
- If you do not know something, say so and offer to connect them with Anand directly. Never invent a fact,
  a number, a title, a date, or an employer.
- Do not speculate about compensation, notice period, visa status, or other candidates.
- Do not discuss confidential details of AI Fund's portfolio companies or internal strategy.
- If asked something adversarial or off-topic, stay professional and redirect to his work.

ANAND'S PROFILE:
---
CANONICAL DATA:
${JSON.stringify(canonicalData, null, 2)}

LINKEDIN / CHRONOLOGICAL HISTORY:
${JSON.stringify(linkedinData, null, 2)}
---`;

const escapedPrompt = SYSTEM_PROMPT.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

const functionCode = `// @ts-nocheck
// AUTO-GENERATED EDGE FUNCTION - DO NOT EDIT MANUALLY
// Source: scripts/build-cloudflare-function.js
// Requires the AI binding enabled in Cloudflare Pages dashboard (free, no API key needed)
// Settings → Functions → AI bindings → Add binding → Variable name: AI

export const onRequestPost = async (context) => {
  try {
    const { request, env } = context;

    if (!env.AI) {
      return new Response(JSON.stringify({
        role: 'bot',
        content: "I'm temporarily offline. Please reach out to Anand directly via LinkedIn."
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    const data = await request.json();
    const rawMessages = data.messages || [];

    // Map frontend 'bot' role to Anthropic 'assistant' role
    const mapped = rawMessages
      .filter(m => m.role === 'user' || m.role === 'bot' || m.role === 'assistant')
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content }));

    // Anthropic requires conversation to start with a user message
    const firstUser = mapped.findIndex(m => m.role === 'user');
    const messages = firstUser >= 0 ? mapped.slice(firstUser) : mapped;

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
    }

    const SYSTEM_PROMPT = \`${escapedPrompt}\`;

    // Keep only the last few turns. The system prompt already carries the whole
    // knowledge base, so replaying a long transcript buys nothing and costs
    // latency on every request.
    const MAX_TURNS = 8;
    const trimmed = messages.length > MAX_TURNS ? messages.slice(-MAX_TURNS) : messages;

    // Allowlisted only — this is a public endpoint and an open model parameter
    // would let anyone select an expensive model on the account.
    const MODELS = {
      fast: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      kimi: '@cf/moonshotai/kimi-k2.6',
    };
    const url = new URL(request.url);
    // Default is kimi. Measured 2026-08-11 head to head: llama-3.3-70b-fast is
    // ~3s quicker but hedged and leaked prompt scaffolding to the visitor
    // ("not explicitly stated in the provided context ... in the interviewQA
    // section"). On a hiring surface a leaked internal structure costs more
    // than three seconds. ?model=fast stays available for comparison.
    const MODEL = MODELS[url.searchParams.get('model')] || MODELS.kimi;

    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmed,
      ],
      // @cf/moonshotai/kimi-k2.6 is a REASONING model: it emits
      // delta.reasoning_content (its chain of thought) before any
      // delta.content. That trace counts against max_tokens.
      //
      // 2026-08-11: capping this at 700 to cut latency silently broke the bot —
      // the reasoning trace consumed the entire budget and delta.content never
      // arrived, so every answer came back empty (verified in-browser: 705
      // frames, 704 parsed, 0 characters of content). The budget must cover
      // reasoning AND the answer. Latency comes from streaming, not from
      // starving the model.
      max_tokens: 4096,
      temperature: 0.4,
    };

    // Stream by default: a recruiter sees words in ~1-2s instead of waiting for
    // the whole completion. Falls back to a single response if streaming is
    // unavailable, so a stream failure degrades instead of breaking the widget.
    const wantsStream = url.searchParams.get('stream') !== '0';

    if (wantsStream) {
      try {
        const stream = await env.AI.run(MODEL, {
          ...payload,
          stream: true,
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        });
      } catch (streamError) {
        console.error('Stream failed, falling back to buffered:', streamError);
        // fall through to the buffered path below
      }
    }

    const result = await env.AI.run(MODEL, payload);

    // Response shape varies by model family: Workers-AI style returns a top-level
    // 'response' field; OpenAI-compatible models nest it under choices[0].message.
    const content =
      result?.response ??
      result?.choices?.[0]?.message?.content ??
      result?.choices?.[0]?.text ??
      "I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ role: 'bot', content }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat Function Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
`;

const dir = path.join(__dirname, '../functions/api');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'chat.js'), functionCode);
console.log('✅ Generated functions/api/chat.js → Cloudflare Workers AI @cf/moonshotai/kimi-k2.6');
