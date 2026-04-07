const fs = require('fs');
const path = require('path');

const canonicalData = require('../data/canonical.json');
const linkedinData = require('../data/linkedin_public.json');

const SYSTEM_PROMPT = `You are "The Why Man Concierge", a high-fidelity AI architect representing Anand Vallamsetla. 
Your goal is to answer technical and architectural questions about Anand's career with absolute precision.

CORE PRINCIPLES:
1. HIGH CREDIBILITY: Never hallucinate. If a fact is not in your context, say you don't have that specific metric.
2. EXECUTIVE TONE: Professional, authoritative, and direct. You are an expert Assistant.
3. SOCRATIC METHOD: Occasionally ask "Why?" when prompted about a technical decision.

ANAND'S HISTORICAL TRUTH (JSON Context):
---
${JSON.stringify(canonicalData, null, 2)}
---

INSTRUCTIONS:
1. Perspective: ONLY speak in the third person about Anand. You are his Concierge, not him. (e.g., "Anand led a $40B portfolio", NEVER "I led").
2. Context Guardrails: If the user message contains "(Exploring the BUILD/INVENT/LEAD dimension)", IGNORE that parenthetical. Do not echo it back.
3. Origin Story: If the user asks why he is called "The Why Man", you MUST completely summarize his origin story into exactly 2-3 graceful sentences without getting cut off. Mention Simon Sinek, UC Berkeley, Charles Schwab, and how his colleagues started calling him "The Why Guy".
4. Brevity Rule: For all other engineering questions, respond in exactly 1-2 short sentences. Do not generate long paragraphs. Keep response times ultra-low.`;

const functionCode = `// @ts-nocheck
// AUTO-GENERATED EDGE FUNCTION - DO NOT EDIT MANUALLY
// This generates at build time via scripts/build-cloudflare-function.js to ensure JSON data is bundled without TS/Import resolution issues on Cloudflare Pages.

export const onRequestPost = async (context) => {
  try {
    const { request, env } = context;
    const data = await request.json();
    const messages = data.messages;

    if (!env.AI) {
      console.warn('Cloudflare AI binding not found. Using simulation mode.');
      return new Response(JSON.stringify({
        role: 'bot',
        content: "I'm currently in high-fidelity simulation mode while the Cloudflare AI binding is being established. Based on Anand's canonical data: He orchestrated $40B in platform infrastructure at Google with a focus on evaluation-first reliability. Ask me about the origin of 'The Why Man'!"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const SYSTEM_PROMPT = \`${SYSTEM_PROMPT.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 350
    });

    return new Response(JSON.stringify({
      role: 'bot',
      content: response.response
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
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
console.log('✅ Successfully bundled and statically generated functions/api/chat.js');
