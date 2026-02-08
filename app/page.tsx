'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VilorAI() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "Desculpe, ocorreu um erro na rede." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: '#f0f0f0', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0a0a0a' }}>
      {/* Header Premium */}
      <nav style={{ padding: '1.2rem', borderBottom: '1px solid #1f1f1f', textAlign: 'center', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: 0, letterSpacing: '1px' }}>
          <Cpu size={22} color="#3b82f6" /> VILOR<span style={{ color: '#3b82f6' }}>AI</span>
        </h1>
      </nav>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '25vh' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
               <Sparkles size={50} color="#3b82f6" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} />
               <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bem-vindo ao VilorAI</h2>
               <p style={{ opacity: 0.5 }}>O futuro do texto começa aqui.</p>
            </motion.div>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={i} style={{ display: 'flex', gap: '1.2rem', marginBottom: '2rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: msg.role === 'user' ? '#3b82f6' : '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ 
                background: msg.role === 'user' ? '#1d4ed8' : '#171717', 
                padding: '1rem 1.4rem', 
                borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', 
                maxWidth: '75%', 
                fontSize: '1rem', 
                lineHeight: '1.5',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                border: msg.role === 'user' ? 'none' : '1px solid #262626'
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
            <div className="dot-pulse"></div>
            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 500 }}>VilorAI está processando...</span>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input de Elite */}
      <div style={{ padding: '2rem', background: 'linear-gradient(transparent, #0a0a0a 40%)', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative' }}>
          <input 
            style={{ 
              width: '100%', 
              padding: '1.2rem 4rem 1.2rem 1.5rem', 
              borderRadius: '20px', 
              border: '1px solid #333', 
              background: '#121212', 
              color: '#fff', 
              outline: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mande uma mensagem para o VilorAI..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', 
              background: '#3b82f6', border: 'none', borderRadius: '12px', width: '45px', height: '45px', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(0.9)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .dot-pulse { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: pulse 1.5s infinite; }
        body { background-color: #0a0a0a; margin: 0; scrollbar-color: #333 #0a0a0a; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 10px; }
      `}</style>
    </div>
  );
}
