'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, User, Plus, MessageSquare, Trash2, Zap, ChevronRight, LayoutPanelLeft, Sparkles, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function VilorAI() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vilor_quantum_final');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_quantum_final', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeId);

  const handleSend = async () => {
    if (!input.trim() || loading || !activeId) return;
    const msg = input;
    setInput('');
    setLoading(true);

    const updatedMsgs = [...(activeChat?.messages || []), { role: 'user', content: msg }];
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: updatedMsgs, title: c.messages.length === 0 ? msg.slice(0, 20) : c.title } : c));

    try {
      const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: updatedMsgs }) });
      const data = await res.json();
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: data.content }] } : c));
    } catch { 
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: "⚠️ Erro na conexão." }] } : c));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', overflow: 'hidden' }}>
      {/* SIDEBAR */}
      <motion.div animate={{ width: sidebar ? 280 : 0 }} style={{ background: '#080808', borderRight: '1px solid #151515', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '25px' }}>
          <button onClick={() => { const id = Date.now().toString(); setChats([{id, title: 'Conversa', messages: []}, ...chats]); setActiveId(id); }} style={{ width: '100%', padding: '12px', background: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /> Novo Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px' }}>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '12px', borderRadius: '10px', background: activeId === c.id ? '#151515' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', border: activeId === c.id ? '1px solid #222' : '1px solid transparent' }}>
              <MessageSquare size={14} opacity={0.5} />
              <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.title}</span>
              <Trash2 size={12} onClick={(e) => { e.stopPropagation(); setChats(chats.filter(x => x.id !== c.id)); }} style={{ opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '65px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 25px', gap: '20px' }}>
          <LayoutPanelLeft size={20} onClick={() => setSidebar(!sidebar)} cursor="pointer" color="#555" />
          <h1 style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '2px' }}>VILORAI <span style={{ color: '#3b82f6' }}>QUANTUM</span></h1>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '30px 20px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {activeChat?.messages.map((m: any, i: number) => (
              <div key={i} style={{ marginBottom: '35px', display: 'flex', gap: '20px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.role === 'user' ? '#3b82f6' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div style={{ background: m.role === 'user' ? '#111' : '#0a0a0a', padding: '15px 22px', borderRadius: '18px', border: '1px solid #1a1a1a', maxWidth: '80%', lineHeight: '1.7', fontSize: '1rem' }}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  {m.role === 'assistant' && (
                    <Copy size={12} style={{ marginTop: '10px', cursor: 'pointer', opacity: 0.3 }} onClick={() => navigator.clipboard.writeText(m.content)} />
                  )}
                </div>
              </div>
            ))}
            {loading && <div style={{ padding: '20px', opacity: 0.5 }}>VilorAI pensando...</div>}
            <div ref={scrollRef} />
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', background: '#0d0d0d', border: '1px solid #222', borderRadius: '22px', display: 'flex', alignItems: 'center', padding: '8px 20px' }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Digite sua mensagem..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '12px 0', outline: 'none', resize: 'none' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '12px', width: '42px', height: '42px', cursor: 'pointer' }}>
              <ChevronRight color="#fff" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
