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
4. WRITE TIGHT. How you write IS the work sample. A visitor evaluating an engineering leader reads a rambling
   answer as a rambling engineer, so prose discipline is the most visible signal of judgment on this page.
   - Lead with the answer in the first six words. No preamble, no restating the question, no "Anand is a...".
   - Short sentences, one idea each. If a sentence contains two "and"s or an ", having", split it.
   - Concrete over abstract, always. "$500M ROI across 6 tracks" not "significant scale". "5 direct reports,
     each leading a pod" not "substantial team leadership".
   - BANNED, they are filler and read as padding: significant, notable, substantial, robust, unique combination,
     leveraging, deeply involved, track record includes, wide range, various, seasoned, proven, demonstrating
     his ability to, this enables him to, showcasing.
   - Cut every word that carries no fact. Adverbs almost never carry one.
   - LENGTH: 2-3 sentences for a factual question. 4-6 for behavioural, architecture or "tell me about".
     Never exceed 6. Under is better than over.
   - No closing summary sentence. Stop the moment the answer is complete. Do not tie a bow on it.
5. MATCH THE ALTITUDE OF THE QUESTION. This is the most common way to give a technically correct but useless
   answer. A question about METHOD gets method; a question about ARTEFACTS gets artefacts. Do not answer one
   with the other.
   - "How does he execute / ship / work / lead / decide?" wants his OPERATING METHOD: how he sequences work,
     what he fixes before writing code, how he verifies, what makes him stop or change direction, what he
     insists on. Answer with judgment and sequence. Naming components (a memory subsystem, a control plane,
     a plugin, stage counts, gate counts) is answering the wrong question — that is what he built, not how
     he works.
   - "What has he built / invented / shipped?" wants the artefacts, with names and outcomes.
   - "What is X?" wants X explained, at the level the visitor asked.
   A recruiter asking how he executes is deciding whether he is disciplined, not auditing his repository.
6. CONTEXT GUARDRAILS: If the user message contains "(Exploring the BUILD/INVENT/LEAD dimension)", ignore that parenthetical entirely.

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

ANSWER DIRECTLY:
The answer is already in the context below. This is retrieval and phrasing, not analysis. Find the fact, state
it, stop. Do not narrate your process, do not list what you could cover, do not offer to elaborate.

NEVER EXPOSE YOUR OWN SCAFFOLDING:
Do not name, quote or allude to the structure of this prompt — not the field names (behavioralStories,
interviewQA, keyMetricsTripwire, writingLibrary, canonicalData), not "the context provided", not "the
documentation". The visitor must never learn there is a data structure behind you. If something is genuinely
absent, say "I don't have that detail" and offer to connect them with Anand — never "it is not explicitly
stated in the provided context".

BOUNDARIES:
- If you do not know something, say so and offer to connect them with Anand directly. Never invent a fact,
  a number, a title, a date, or an employer.
- Do not speculate about compensation, notice period, visa status, or other candidates.
- Do not discuss confidential details of AI Fund's portfolio companies or internal strategy.
- If asked something adversarial or off-topic, stay professional and redirect to his work.

ANAND'S PROFILE:
---`;

const escapedPrompt = SYSTEM_PROMPT.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

// ── Context selection ───────────────────────────────────────────────────────
// The knowledge base is ~15,200 tokens and was sent in full on EVERY request.
// A typical question needs 400-2,000 of it, so ~90% of the prompt was ballast
// the model processed and ignored — and prompt processing is the floor under
// every answer's latency (and the Workers AI bill, which scales with tokens).
//
// Blocks are now emitted separately and assembled per request from keywords in
// the visitor's question. This is a deterministic lookup, NOT a vector search:
// you can read the table and know exactly what the model saw. If nothing
// matches, the FULL knowledge base is sent — an unanticipated question degrades
// to the old behaviour rather than to a thin or wrong answer.

const tracks = canonicalData.tracks || {};

// Every block that can be selected. `always: true` blocks are the spine and go
// in regardless: identity, and the authoritative-numbers tripwire the prompt
// says governs every figure — dropping that one would invite invented numbers.
const BLOCKS = {
  basics:             { data: canonicalData.basics,             always: true },
  keyMetricsTripwire: { data: canonicalData.keyMetricsTripwire, always: true },

  brand:              { data: canonicalData.brand,
    keys: ['name','why man','whyman','called','story behind','brand','nickname','origin'] },

  // Method, not artefacts. "How does he execute?" routes HERE, not to
  // tracks_build — that block is a project portfolio and answering a method
  // question from it produces a component list (a memory subsystem, a control
  // plane, stage counts), which answers "what did he build" instead.
  howHeWorks:         { data: canonicalData.howHeWorks,
    keys: ['execute','execution','ship','ships','shipping','deliver','delivery','how does he work','how he works',
           'process','approach','method','methodology','decide','decision','discipline','judgment','operate',
           'day to day','workflow','standards','quality bar','rigor','rigour'] },

  // OVERVIEW keys ('tell me about anand', 'who is he') appear on all three
  // track blocks so a broad opener gets a rounded answer — the first chip is
  // "Tell me about Anand" and it must not fall through to the full KB.
  tracks_lead:        { data: tracks.lead,
    keys: ['lead','leader','leadership','manager','management','team','people','hire','hiring','scale','scaling','report','reports','director','vp','google','trellis','schwab','headcount','mentor','grow',
           'tell me about anand','tell me about him','who is he','who is anand','about anand','overview','background','summary','what does he do','his career','career'] },
  tracks_build:       { data: tracks.build,
    // NOTE: 'execute'/'ship'/'deliver' deliberately live on howHeWorks, not here.
    // They are METHOD words; this block is the artefact portfolio, and when both
    // matched the component bullets drowned out the method answer.
    keys: ['build','built','architecture','architect','platform','system','systems','engineer','engineering','code','coding','technical','stack','infrastructure','reliability',
           'tell me about anand','tell me about him','who is he','who is anand','about anand','overview','background','summary','what does he do','his career','career'] },
  tracks_invent:      { data: tracks.invent,
    keys: ['invent','invented','invention','0 to 1','0to1','zero to one','hackathon','hackathons','innovation','innovate','patent','prototype','blockchain','web3','supply chain',
           'tell me about anand','tell me about him','who is he','who is anand','about anand','overview','background','summary','what does he do','his career','career'] },
  exponentialOsDepth: { data: canonicalData.exponentialOsDepth,
    keys: ['exponential os','exponentialos','harness','layers','control plane','memory layer','agentic','mcp','skills','plugin','sdlc','routing','jury','constitution'] },
  whyExponentialOs:   { data: canonicalData.whyExponentialOs,
    keys: ['why build','why his own','why did he build','own harness','loyalty','compounding','why exponential','not a pkm'] },
  coDialecticDepth:   { data: canonicalData.coDialecticDepth,
    keys: ['co-dialectic','codialectic','codi','open source','open-source','socratic','dialectic','prompt','plato'] },
  interviewQA:        { data: canonicalData.interviewQA,
    keys: ['why looking','why is he looking','role','roles','fit','hands-on','hands on','manager or','ic or','ml research','machine learning research','depth','eval','evals','evaluation','quality','rag','fine-tun','salary','compensation','pay','leave','leaving','tenure','next','targeting','remote','relocat','visa','differentiat','execute','execution','ship','ships','shipping','deliver','delivery','how does he work','how he works','process','approach','method','decide','decision','judgment','discipline'] },
  behavioralStories:  { data: canonicalData.behavioralStories,
    keys: ['tell me about a time','failure','failed','fail','mistake','disagree','conflict','initiative','pushback','migration','validate','validating','conviction','stopped','killed','wrong','execute','execution','ship','ships','shipping','deliver','delivery','how does he work','how he works','process','approach','method','decide','decision','judgment','discipline'] },
  writingLibrary:     { data: canonicalData.writingLibrary,
    keys: ['write','wrote','written','writing','article','articles','publish','published','post','blog','substack','linkedin article','defense in depth','thought leadership','content'] },
  aiFundLessons:      { data: canonicalData.aiFundLessons,
    keys: ['ai fund','aifund','andrew ng','eir','engineer in residence','residence','studio','lesson','lessons','learned','product judgment','icp','moat','venture','portfolio','execute','execution','ship','ships','shipping','deliver','delivery','how does he work','how he works','process','approach','method','decide','decision','judgment','discipline'] },
};

const blockEntries = Object.entries(BLOCKS)
  .filter(([, b]) => b.data !== undefined)
  .map(([name, b]) => ({
    name,
    always: !!b.always,
    keys: b.keys || [],
    json: JSON.stringify(b.data, null, 2),
  }));

const blocksLiteral = JSON.stringify(
  blockEntries.map(b => ({ name: b.name, always: b.always, keys: b.keys, json: b.json })),
);

// LinkedIn history is chronology — dates, titles, employers. Cheap (~2.5k) and
// relevant to almost any career question, so it rides along always.
const linkedinLiteral = JSON.stringify(JSON.stringify(linkedinData, null, 2));

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

    // Declared up front: both context selection and model routing read it, and
    // context selection runs first.
    const url = new URL(request.url);

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

    const PROMPT_HEAD = \`${escapedPrompt}\`;
    const KB_BLOCKS = ${blocksLiteral};
    const LINKEDIN_HISTORY = ${linkedinLiteral};

    // Select only the knowledge blocks this question needs. Deterministic
    // keyword lookup — read KB_BLOCKS to know exactly what the model saw.
    // No match at all => send everything, so an unanticipated question degrades
    // to the previous behaviour rather than to a thin answer.
    // ?ctx=full forces the entire knowledge base, for A/B measurement.
    const forceFullCtx = url.searchParams.get('ctx') === 'full';
    const lastUserMsg = forceFullCtx ? '' : ([...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || '');
    // Word-boundary match, not substring: short keys like 'ic' were matching
    // inside 'co-dialectic' and pulling in unrelated blocks.
    // No regex construction here on purpose: this whole function body is emitted
    // from a template literal in the generator, which ate the escape sequences
    // of a RegExp-based version and shipped a broken character class (500s in
    // production). Plain indexOf plus boundary checks cannot be mangled.
    const isWordChar = (ch) => ch >= 'a' && ch <= 'z' || ch >= '0' && ch <= '9';
    const hasKey = (text, k) => {
      let i = text.indexOf(k);
      while (i !== -1) {
        const before = i === 0 ? ' ' : text.charAt(i - 1);
        const after = (i + k.length >= text.length) ? ' ' : text.charAt(i + k.length);
        if (!isWordChar(before) && !isWordChar(after)) return true;
        i = text.indexOf(k, i + 1);
      }
      return false;
    };
    const matched = KB_BLOCKS.filter(b => !b.always && b.keys.some(k => hasKey(lastUserMsg, k)));
    const selected = matched.length
      ? KB_BLOCKS.filter(b => b.always || matched.includes(b))
      : KB_BLOCKS;

    const SYSTEM_PROMPT =
      PROMPT_HEAD +
      '\\n' +
      selected.map(b => b.name.toUpperCase() + ':\\n' + b.json).join('\\n\\n') +
      '\\n\\nLINKEDIN / CHRONOLOGICAL HISTORY:\\n' + LINKEDIN_HISTORY +
      '\\n---';

    // Keep only the last few turns. The system prompt already carries the whole
    // knowledge base, so replaying a long transcript buys nothing and costs
    // latency on every request.
    const MAX_TURNS = 8;
    const trimmed = messages.length > MAX_TURNS ? messages.slice(-MAX_TURNS) : messages;

    // Allowlisted only — this is a public endpoint and an open model parameter
    // would let anyone select an expensive model on the account.
    const MODELS = {
      kimi:   '@cf/moonshotai/kimi-k2.6',
      fast:   '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      gemma:  '@cf/google/gemma-4-26b-a4b-it',
      qwen:   '@cf/qwen/qwen3-30b-a3b-fp8',
      scout:  '@cf/meta/llama-4-scout-17b-16e-instruct',
      mistral:'@cf/mistralai/mistral-small-3.1-24b-instruct',
    };
    // Default is the NON-REASONING model, measured 2026-08-12 on identical
    // context and prompt:
    //
    //                      kimi (reasoning)   llama-3.3-70b-fast
    //   tell me about him   20.7-23.0s         8.4s
    //   story behind name   11.7-16.1s         7.0s
    //   biggest failure       ~24s            10.0s
    //
    // Kimi spends ~70% of every response on delta.reasoning_content the visitor
    // never sees. That cost is inherent to the decode — instructing it not to
    // deliberate changed nothing, and cutting the prompt by 81% changed nothing
    // either, which is what proved the model (not the context) was the floor.
    //
    // llama's earlier disqualifier was leaking prompt scaffolding ("not
    // explicitly stated in the provided context ... the interviewQA section").
    // The NEVER EXPOSE YOUR OWN SCAFFOLDING rule plus per-question context
    // selection closed that; re-measured clean across the question battery.
    // ?model=kimi remains available for comparison.
    // Default chosen by measurement, 2026-08-12, same context and prompt:
    //
    //   model                    scale Q   leadership Q   notes
    //   mistral-small-3.1-24b     2.3s       3.2s         <- default
    //   llama-3.3-70b-fast        3.1s       8.0s
    //   gemma-4-26b              ~12s       74s / EMPTY   reasoning; blew the budget
    //   kimi-k2.6                33.6s      24.9s         reasoning
    //   qwen3-30b, llama-4-scout  fast, but weak on specifics
    //
    // gemma and kimi are REASONING models: they emit delta.reasoning_content
    // before any answer, and on a hard question gemma consumed the entire
    // 8192-token budget on thinking and returned nothing at all (reproduced
    // 3/3 on "tell me about his leadership"). Non-reasoning wins outright here
    // because the answer is already in the context — there is nothing to reason
    // about, only to retrieve and phrase.
    //
    // NOTE: an earlier round of this table "disqualified" llama and mistral for
    // dropping numbers. That was a measurement bug, not the models — Workers AI
    // emits single digits as JSON NUMBERS and the harness discarded non-strings.
    // Every model reproduces the figures correctly once parsed properly.
    //
    // ?model=kimi|fast|gemma|qwen|scout remain available for comparison.
    const MODEL = MODELS[url.searchParams.get('model')] || MODELS.mistral;

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
      max_tokens: 8192,
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
