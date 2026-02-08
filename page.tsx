'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MoonshotChat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages }),
    });
    
    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <nav style={{ padding: '1.5rem', borderBottom: '1px solid #1f1f1f', textAlign: 'center', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', sticky: 'top', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#3b82f6" /> VilorAI
        </h1>
      </nav>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20vh', opacity: 0.5 }}>
            <Bot size={48} style={{ margin: '0 auto 1rem' }} />
            <p>Como posso ajudar você hoje?</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
            >
              <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: msg.role === 'user' ? '#3b82f6' : '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div style={{ background: msg.role === 'user' ? '#1d4ed8' : '#171717', padding: '1rem', borderRadius: '12px', maxWidth: '80%', lineHeight: '1.6', fontSize: '0.95rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.6 }}>
            <Loader2 className="animate-spin" size={20} />
            <span style={{ fontSize: '0.8rem' }}>VilorAI está processando...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '2rem', background: 'linear-gradient(transparent, #0a0a0a)', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <input 
            style={{ width: '100%', padding: '1.2rem 3.5rem 1.2rem 1.5rem', borderRadius: '16px', border: '1px solid #262626', background: '#171717', color: '#fff', outline: 'none', transition: 'border 0.2s' }}
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte qualquer coisa ao VilorAI..."
          />
          <button 
            onClick={handleSend}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#3b82f6', border: 'none', borderRadius: '10px', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={18} color="white" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 10px; }
      `}</style>
    </div>
  );
}
