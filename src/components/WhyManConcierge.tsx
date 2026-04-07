'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Cpu, Rocket, Users, ChevronRight, HelpCircle } from 'lucide-react';

interface Message {
  id: number;
  role: 'bot' | 'user';
  content: string;
  dimension?: 'BUILD' | 'INVENT' | 'LEAD';
}

export default function WhyManConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'bot', 
      content: "Welcome. I am the Why Man Concierge. I can speak to Anand's 26-year engineering history across three specific dimensions. Which would you like to explore?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
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

  const suggestions = [
    { label: "AI Architecture (Build)", dimension: 'BUILD', icon: <Cpu className="w-3 h-3" /> },
    { label: "Moonshot Wins (Invent)", dimension: 'INVENT', icon: <Rocket className="w-3 h-3" /> },
    { label: "Org Scale (Lead)", dimension: 'LEAD', icon: <Users className="w-3 h-3" /> },
    { label: "Why the name?", dimension: undefined, icon: <HelpCircle className="w-3 h-3" /> }
  ];

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
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'bot', 
          content: data.content 
        }]);
        setIsLive(true);
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
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
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
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s.label, s.dimension as any)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-bold text-zinc-400 hover:border-teal-500/30 hover:text-teal-400 transition-all uppercase tracking-wider"
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  placeholder={isLoading ? "Architect is thinking..." : "Ask a technical or leadership question..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  disabled={isLoading}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-12 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white placeholder:text-zinc-600 disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend(inputValue)}
                  className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
