
import React, { useState, useRef, useEffect } from 'react';
import { askPetExpert } from '../services/geminiService';
import { Message } from '../types';

const AIPetAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '¡Hola! Soy tu asistente PetWelfare. Puedo ayudarte con dudas sobre salud, comportamiento o razas de tus mascotas. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await askPetExpert(input, history);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Lo siento, ocurrió un error. Por favor intenta de nuevo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white dark:bg-white/5 rounded-3xl border border-accent-teal/10 overflow-hidden shadow-2xl">
      <div className="p-6 bg-primary text-background-dark flex items-center gap-4">
        <div className="size-12 rounded-full bg-white flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary animate-pulse">smart_toy</span>
        </div>
        <div>
          <h2 className="text-xl font-black">Asistente Care+</h2>
          <p className="text-xs font-bold opacity-70">Impulsado por Gemini AI</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50 dark:bg-transparent"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-background-dark font-medium rounded-tr-none' 
                : 'bg-white dark:bg-white/10 rounded-tl-none border border-accent-teal/5'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-white/10 p-5 rounded-3xl rounded-tl-none border border-accent-teal/5 flex gap-1">
              <span className="size-2 bg-primary rounded-full animate-bounce"></span>
              <span className="size-2 bg-primary rounded-full animate-bounce delay-75"></span>
              <span className="size-2 bg-primary rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-accent-teal/10 bg-white dark:bg-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pregúntame algo sobre tu mascota..."
            className="w-full pl-6 pr-16 py-4 bg-slate-100 dark:bg-white/10 border-none rounded-2xl focus:ring-2 focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-background-dark rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-accent-teal font-medium uppercase tracking-widest opacity-60">
          Usa este asistente solo como guía informativa. En emergencias, contacta a tu veterinario.
        </p>
      </div>
    </div>
  );
};

export default AIPetAssistant;
