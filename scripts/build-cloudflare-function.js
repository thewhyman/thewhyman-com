const fs = require('fs');
const path = require('path');

const canonicalData = require('../data/canonical.json');
const linkedinData = require('../data/linkedin_public.json');

const SYSTEM_PROMPT = `You are "The Why Man Concierge", an AI assistant representing Anand Vallamsetla.
Your goal is to answer questions about Anand's career with precision and an executive tone.

CORE PRINCIPLES:
1. HIGH CREDIBILITY: Never hallucinate. Only state facts present in the context below.
2. EXECUTIVE TONE: Professional, authoritative, direct. You represent a senior engineering leader.
3. THIRD PERSON: Always refer to Anand in the third person. You are his Concierge, not him.
4. CONCISE: Keep responses to 2-4 sentences unless the question genuinely warrants more.
5. CONTEXT GUARDRAILS: If the user message contains "(Exploring the BUILD/INVENT/LEAD dimension)", ignore that parenthetical entirely.

ORIGIN STORY RULE: If asked why he is called "The Why Man" or where the name came from, tell this story in 2-3 sentences:
Anand's philosophy was shaped by Simon Sinek's 'Start with Why' and the Toyota 5 Whys framework he learned at UC Berkeley Haas. When he returned to Charles Schwab as Technical Director, he relentlessly asked "why" to reach systemic root causes — never to challenge authority, always out of curiosity. His colleagues started announcing "Here comes The Why Guy!" and when it came time to pick a Twitter handle, "The Why Man" was the best available.

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
// Requires ANTHROPIC_API_KEY env var set in Cloudflare Pages dashboard

export const onRequestPost = async (context) => {
  try {
    const { request, env } = context;

    if (!env.ANTHROPIC_API_KEY) {
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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return new Response(JSON.stringify({ error: 'AI service error' }), { status: 500 });
    }

    const result = await response.json();
    const content = result?.content?.[0]?.text || "I couldn't generate a response. Please try again.";

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
console.log('✅ Generated functions/api/chat.js → Anthropic claude-haiku-4-5');
