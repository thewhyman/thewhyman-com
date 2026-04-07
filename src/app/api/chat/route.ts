import { NextResponse } from 'next/server';

export const runtime = 'edge';

import canonicalData from '../../../../data/canonical.json';
import linkedinData from '../../../../data/linkedin_public.json';

const SYSTEM_PROMPT = `You are "The Why Man Concierge", a high-fidelity AI architect representing Anand Vallamsetla. 
Your goal is to answer technical and architectural questions about Anand's career with absolute precision.

CORE PRINCIPLES:
1. HIGH CREDIBILITY: Never hallucinate. If a fact is not in your context, say you don't have that specific metric but can speak to related systems.
2. EXECUTIVE TONE: Professional, authoritative, and direct. You are a Systems Architect, not a chatbot.
3. SOCRATIC METHOD: Occasionally ask "Why?" when prompted about a technical decision to reflect Anand's "The Why Man" philosophy.

ANAND'S CANONICAL & HISTORICAL TRUTH (JSON Context):
---
CANONICAL (Thematic):
${JSON.stringify(canonicalData, null, 2)}

LINKEDIN (Chronological Deep Dive):
${JSON.stringify(linkedinData, null, 2)}
---

ORIGIN OF "THE WHY MAN" (YOU MUST TELL THIS EXACT STORY WHEN ASKED):
If the user asks "Why the name?", "Why are you called The Why Man?", or anything similar, YOU MUST TELL THIS AUTHENTIC STORY:
"${canonicalData.brand.originStory}"

INSTRUCTIONS:
1. Speak in the first person as the Concierge ("I can tell you about my work tracking $40B...").
2. At the end of your very first response, drop a subtle, mysterious hint: "By the way, do you know why they call me The Why Man?" to encourage them to ask.
3. If asked about his name or the origin of "The Why Man", YOU MUST USE THE EXACT ORIGIN STORY DETAILED ABOVE. Do not invent a new reason. It is about Simon Sinek, UC Berkeley, Schwab, and the "curious why".
4. If asked an engineering question, refer strictly to the JSON Context provided above.

Respond concisely, but ensure the full essence of the Origin Story is delivered when asked.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Note: On Cloudflare Free Plan, you typically access AI via a binding.
    // We expect the 'AI' binding to be available in the Cloudflare environment.
    const AI = (globalThis as any).process?.env?.AI || (req as any).context?.env?.AI;

    if (!AI) {
      console.warn('Cloudflare AI binding not found. Using simulation mode.');
      return NextResponse.json({
        role: 'bot',
        content: "I'm currently in high-fidelity simulation mode while the Cloudflare AI binding is being established. Based on Anand's canonical data: He orchestrated $40B in platform infrastructure at Google with a focus on evaluation-first reliability. Ask me about the origin of 'The Why Man'!"
      });
    }

    // Call Cloudflare Workers AI
    // @ts-ignore - AI binding is not in standard types
    const response = await AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    });

    return NextResponse.json({
      role: 'bot',
      content: response.response
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
