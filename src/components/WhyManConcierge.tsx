'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HarnessDiagram from './HarnessDiagram';
import { MessageSquare, X, Send, Sparkles, Cpu, Rocket, Users, ChevronRight, HelpCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: number;
  role: 'bot' | 'user';
  content: string;
  dimension?: 'BUILD' | 'INVENT' | 'LEAD';
  visual?: 'harness' | 'codi';
}

export default function WhyManConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'bot', 
      content: "Welcome — I'm The Why Man Concierge. This is a virtual interview: ask me anything about Anand right here, no scheduling, no waiting. What he's built, how he leads, where he's failed and what he did about it. Start with one of these, or ask your own."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-concierge', handleOpen);
    return () => window.removeEventListener('open-concierge', handleOpen);
  }, []);

  // Question bank. `chip` is the short label shown in the UI; `ask` is the full
  // question sent to the model. `tags` drive contextual surfacing.
  type Q = { chip: string; ask: string; dim?: 'BUILD' | 'INVENT' | 'LEAD'; tags: string[]; opener?: boolean };
  const QUESTIONS: Q[] = [
    // — the differentiator
    { chip: "Why his own harness?", ask: "Why did Anand build his own multi-agent harness instead of using an existing framework?", dim: 'BUILD', tags: ['harness','agent','ai','build','architecture'], opener: true },
    { chip: "What is Exponential OS?", ask: "What is Exponential OS and what are its layers?", dim: 'BUILD', tags: ['harness','exponential','os','platform','architecture'], opener: true },
    { chip: "Memory layer", ask: "What does the agentic memory layer do that a normal chatbot does not?", dim: 'BUILD', tags: ['harness','memory','context','architecture'] },
    { chip: "Constitution?", ask: "How does the constitution in his harness actually enforce anything?", dim: 'BUILD', tags: ['harness','constitution','governance','architecture'] },
    { chip: "Model routing", ask: "How does he think about model selection and cost in AI systems?", dim: 'BUILD', tags: ['harness','cost','routing','model','architecture'] },
    { chip: "MCP + skills", ask: "What MCP integrations and composable skills does his harness use?", dim: 'BUILD', tags: ['harness','mcp','skills','tools'] },
    { chip: "Cross-LLM jury", ask: "Why does his review process require a different model family?", dim: 'BUILD', tags: ['harness','review','quality','jury','eval'] },

    // — applied AI depth
    { chip: "Evals approach", ask: "How does Anand approach AI quality and evaluation?", dim: 'BUILD', tags: ['eval','quality','ai','reliability'], opener: true },
    { chip: "RAG vs fine-tuning", ask: "When does he choose retrieval over fine-tuning, and what evidence does he have?", dim: 'BUILD', tags: ['rag','lora','fine-tune','model','ai'] },
    { chip: "Does he do ML research?", ask: "Does Anand do machine learning research or applied AI?", dim: 'BUILD', tags: ['ml','research','ai','depth'] },
    { chip: "AI slop", ask: "What did he build to reduce AI slop and improve voice fidelity?", dim: 'BUILD', tags: ['ai','slop','quality','aifund'] },
    { chip: "Agentic SDLC", ask: "What is the exponential-developer plugin and how does its SDLC workflow work?", dim: 'BUILD', tags: ['sdlc','plugin','workflow','quality','build'] },

    // — leadership & scale
    { chip: "Hands-on or manager?", ask: "Is Anand hands-on or a manager?", dim: 'LEAD', tags: ['leadership','manager','ic','role'], opener: true },
    { chip: "Scale operated at", ask: "What scale has Anand operated at?", dim: 'LEAD', tags: ['leadership','scale','google','roi','team'] },
    { chip: "Team building", ask: "How does he hire, level and grow engineers?", dim: 'LEAD', tags: ['leadership','hiring','team','people','culture'] },
    { chip: "Google impact", ask: "What did Anand deliver at Google?", dim: 'LEAD', tags: ['google','roi','platform','scale'] },
    { chip: "Regulated systems", ask: "What is his experience with regulated and high-availability systems?", dim: 'LEAD', tags: ['schwab','reliability','compliance','hipaa','finance'] },

    // — behavioral (the ones that decide outcomes)
    { chip: "Tell me about a failure", ask: "Tell me about a time something Anand built failed, and what he did about it.", tags: ['behavioral','failure','judgment'], opener: true },
    { chip: "Disagreed with leadership", ask: "Tell me about a time Anand disagreed with leadership.", tags: ['behavioral','conflict','conviction','judgment'] },
    { chip: "Took initiative", ask: "Tell me about a time Anand took initiative without a mandate.", tags: ['behavioral','initiative','ownership'] },
    { chip: "Killed his own project", ask: "Tell me about a time he stopped a project on evidence.", tags: ['behavioral','judgment','product','aifund'] },
    { chip: "Validated an idea", ask: "How does Anand validate a product idea before building it?", dim: 'INVENT', tags: ['product','discovery','customer','validation','icp'] },

    // — 0→1 / invention
    { chip: "Biggest 0→1 win", ask: "What is Anand's biggest 0 to 1 win?", dim: 'INVENT', tags: ['0to1','invent','hackathon','product'], opener: true },
    { chip: "Supply chain AI", ask: "Tell me about the supply chain risk AI work at Google.", dim: 'INVENT', tags: ['0to1','supplychain','google','ai','blockchain'] },
    { chip: "Hackathon record", ask: "What is his hackathon track record?", dim: 'INVENT', tags: ['hackathon','invent','wins'] },
    { chip: "Blockchain work", ask: "What blockchain and Web3 work has Anand done?", dim: 'INVENT', tags: ['blockchain','web3','nft','crypto'] },

    // — AI Fund
    { chip: "AI Fund role", ask: "What did Anand do at AI Fund and why did the role end?", tags: ['aifund','andrewng','eir','role'] },
    { chip: "Andrew Ng studio", ask: "What was the Engineer in Residence experience at Andrew Ng's venture studio?", tags: ['aifund','andrewng','eir'] },

    // — open source / Co-Dialectic
    { chip: "What is Co-Dialectic?", ask: "What is Co-Dialectic and what does it do?", dim: 'BUILD', tags: ['codi','co-dialectic','open source','prompt','tool'], opener: true },
    { chip: "Socratic → dialectic", ask: "What is the theory behind Co-Dialectic — the move from Socratic prompting to dialectic?", dim: 'BUILD', tags: ['codi','co-dialectic','socratic','dialectic','plato','theory'] },
    { chip: "Is it really open source?", ask: "Is Co-Dialectic really open source, and how do I install it?", dim: 'BUILD', tags: ['codi','co-dialectic','open source','license','install','agpl'] },
    { chip: "Does it actually work?", ask: "Does Co-Dialectic measurably improve prompt quality?", dim: 'BUILD', tags: ['codi','co-dialectic','results','quality','proof'] },

    // — fit / logistics
    { chip: "What roles is he after?", ask: "What kind of roles is Anand targeting?", tags: ['fit','role','targeting','hiring'] },
    { chip: "Teaching + speaking", ask: "What is his teaching and public speaking experience?", tags: ['teaching','berkeley','speaking','executives'] },
    { chip: "Story behind the name", ask: "What's the story behind the name 'The Why Man'?", tags: ['name','brand','story','why'], opener: true },
  ];

  const iconFor = (q: Q) =>
    q.dim === 'BUILD' ? <Cpu className="w-3 h-3" />
    : q.dim === 'INVENT' ? <Rocket className="w-3 h-3" />
    : q.dim === 'LEAD' ? <Users className="w-3 h-3" />
    : <HelpCircle className="w-3 h-3" />;

  const [asked, setAsked] = useState<string[]>([]);

  // ── Voice ────────────────────────────────────────────────────────────────
  // Deliberately a NEUTRAL synthetic voice, never a clone of Anand. This is his
  // concierge speaking ABOUT him in third person; sounding like him would be
  // misleading. Browser-native APIs: no key, no cost, no vendor.
  const [voiceOut, setVoiceOut] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState({ in: false, out: false });
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported({ in: !!SR, out: 'speechSynthesis' in window });
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInputValue(t);
      setListening(false);
      handleSend(t);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    return () => { try { r.abort(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickVoice = () => {
    const vs = window.speechSynthesis.getVoices();
    // Prefer a clear neutral en-US voice; explicitly not a personal clone.
    const preferred = ['Google US English', 'Samantha', 'Microsoft Aria Online (Natural) - English (United States)'];
    for (const name of preferred) {
      const v = vs.find(x => x.name === name);
      if (v) return v;
    }
    return vs.find(v => v.lang?.startsWith('en')) ?? null;
  };

  const speak = (text: string) => {
    if (!voiceOut || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.03;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  const toggleListen = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) { try { r.stop(); } catch {} setListening(false); return; }
    try { window.speechSynthesis?.cancel(); r.start(); setListening(true); } catch { setListening(false); }
  };

  useEffect(() => {
    if (!voiceOut && typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, [voiceOut]);

  // Surface follow-ups related to what they just asked; fall back to openers.
  const suggestions = React.useMemo(() => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() ?? '';
    const pool = QUESTIONS.filter(q => !asked.includes(q.chip));
    if (!lastUser) return pool.filter(q => q.opener).slice(0, 5);
    const scored = pool
      .map(q => ({ q, score: q.tags.reduce((n, t) => n + (lastUser.includes(t) ? 1 : 0), 0) }))
      .sort((a, b) => b.score - a.score);
    const related = scored.filter(s => s.score > 0).slice(0, 4).map(s => s.q);
    const filler = pool.filter(q => q.opener && !related.includes(q)).slice(0, 5 - related.length);
    return [...related, ...filler].slice(0, 5);
  }, [messages, asked]);

  // Invite bubble: appears once after 4s, auto-hides after 8s, never nags again.
  useEffect(() => {
    if (inviteDismissed) return;
    if (typeof window !== 'undefined' && sessionStorage.getItem('wm-invite-seen')) return;
    const show = setTimeout(() => setShowInvite(true), 4000);
    const hide = setTimeout(() => {
      setShowInvite(false);
      try { sessionStorage.setItem('wm-invite-seen', '1'); } catch {}
    }, 12000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [inviteDismissed]);

  useEffect(() => {
    if (isOpen) {
      setShowInvite(false);
      setInviteDismissed(true);
      try { sessionStorage.setItem('wm-invite-seen', '1'); } catch {}
    }
  }, [isOpen]);

  const handleSend = async (text: string, dimension?: 'BUILD' | 'INVENT' | 'LEAD') => {
    if (!text.trim() || isLoading) return;
    
    const userContent = dimension ? `${text} (Exploring the ${dimension} dimension)` : text;
    const newUserMsg: Message = { id: Date.now(), role: 'user', content: userContent };
    
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();
      
      if (data.content) {
        const q = (userContent + ' ' + data.content).toLowerCase();
        const wantsHarness = ['harness','exponential os','architecture','layers','memory layer','control plane','constitution']
          .some(k => q.includes(k));
        const wantsCodi = !wantsHarness && ['co-dialectic','codi','open source','socratic','dialectic','plato','prompt improve']
          .some(k => q.includes(k));
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'bot', 
          content: data.content,
          visual: wantsHarness ? 'harness' : wantsCodi ? 'codi' : undefined
        }]);
        setIsLive(true);
        speak(data.content);
      }
    } catch (error) {
      console.error('Concierge Error:', error);
      // Fallback message if API fails
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        content: "I'm having trouble reaching the architecture core. However, I can confirm Anand's work tracking $40B in platform capex. Please try again or explore a specific dimension." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Invite bubble — nudges toward the bot, then gets out of the way */}
      <AnimatePresence>
        {!isOpen && showInvite && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 md:bottom-32 z-50 max-w-[264px]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="relative block text-left bg-[#0a0a0a] border border-teal-500/40 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_0_30px_rgba(20,184,166,0.18)] hover:border-teal-400/70 transition-all"
            >
              <span className="block text-[11px] uppercase tracking-widest text-teal-400 mb-1">
                Virtual interview
              </span>
              <span className="block text-sm text-white/90 leading-snug">
                Want to interview The Why Man? Ask my AI anything — right here, no scheduling.
              </span>
              <span className="block text-xs text-teal-400/80 mt-1.5">Click the bot →</span>
            </button>
            <button
              onClick={() => { setShowInvite(false); setInviteDismissed(true); }}
              aria-label="Dismiss"
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/20 text-white/50 hover:text-white flex items-center justify-center text-xs"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          aria-label="Virtually interview The Why Man"
          className="fixed bottom-6 right-6 w-14 h-14 md:w-20 md:h-20 rounded-full bg-teal-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:bg-teal-400 transition-all z-50 group border-4 border-[#050505]"
        >
          <div className="absolute inset-0 rounded-full bg-teal-500 animate-ping opacity-20 group-hover:opacity-0" />
          <MessageSquare className="w-6 h-6 md:w-8 md:h-8 fill-current" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[calc(100vw-48px)] md:w-[420px] h-[550px] md:h-[600px] bg-[#0a0a0a] border border-white/10 flex flex-col z-50 shadow-2xl shadow-black overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">The Why Man Concierge</h3>
                  <div className="flex items-center gap-1.5 font-bold text-[10px] text-teal-400/80 uppercase tracking-widest">
                    <div className={`w-1.5 h-1.5 rounded-full bg-teal-400 ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
                    {isLive ? 'Systems Architect: LIVE' : 'Systems Architect: SIMULATED'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'bot' 
                      ? 'bg-zinc-900 border border-white/5 text-zinc-100' 
                      : 'bg-teal-900/40 border border-teal-500/30 text-teal-50'
                  }`}>
                    {msg.content}
                    {msg.visual === 'codi' && (
                      <a
                        href="https://github.com/Exponential-OS/prompt-engineering-in-action"
                        target="_blank" rel="noopener noreferrer"
                        className="mt-3 pt-3 border-t border-white/5 block group"
                      >
                        <img
                          src="/codi/co-dialectic-preview.png"
                          alt="Co-Dialectic — prompt quality from 45% to 91% in 10 days"
                          className="w-full rounded-lg border border-white/10 group-hover:border-teal-500/40 transition-colors"
                          loading="lazy"
                        />
                        <span className="block mt-1.5 text-[10px] text-teal-400/80">
                          Open source · AGPL-3.0 · 61-second demo on the repo →
                        </span>
                      </a>
                    )}
                    {msg.visual === 'harness' && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <HarnessDiagram compact />
                      </div>
                    )}
                    {msg.dimension && (
                      <div className="mt-2 text-[10px] font-black tracking-widest text-teal-400/50 uppercase">
                        Dimension: {msg.dimension}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02] space-y-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
                {suggestions.map((q) => (
                  <button
                    key={q.chip}
                    title={q.ask}
                    onClick={() => { setAsked(a => [...a, q.chip]); handleSend(q.ask, q.dim as any); }}
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-medium text-zinc-300 hover:border-teal-500/40 hover:text-teal-300 hover:bg-teal-500/5 transition-all whitespace-nowrap"
                  >
                    {iconFor(q)}
                    {q.chip}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={listening ? "Listening…" : isLoading ? "Thinking…" : "Ask anything — or tap the mic"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  disabled={isLoading}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-[5.5rem] text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white placeholder:text-zinc-600 disabled:opacity-50"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  {voiceSupported.in && (
                    <button
                      onClick={toggleListen}
                      aria-label={listening ? "Stop listening" : "Ask by voice"}
                      title={listening ? "Stop listening" : "Ask by voice"}
                      className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        listening ? 'bg-teal-500 text-black' : 'bg-white/5 text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10'
                      }`}
                    >
                      {listening && <span className="absolute inset-0 rounded-lg bg-teal-400 animate-ping opacity-40" />}
                      {listening ? <MicOff className="w-4 h-4 relative" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => handleSend(inputValue)}
                    aria-label="Send"
                    className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(voiceSupported.in || voiceSupported.out) && (
                <div className="flex items-center justify-between text-[10px] text-zinc-600">
                  <span>{listening ? "Listening — speak now" : "Voice optional"}</span>
                  {voiceSupported.out && (
                    <button
                      onClick={() => setVoiceOut(v => !v)}
                      title={voiceOut ? "Mute spoken replies" : "Hear replies read aloud"}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                        voiceOut ? 'text-teal-400 bg-teal-500/10' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {voiceOut ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      {voiceOut ? "Speaking replies" : "Read replies aloud"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
