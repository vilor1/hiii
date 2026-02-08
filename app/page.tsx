'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Trash2, Zap, Image as ImageIcon, ChevronRight, Download, LayoutPanelLeft, Sparkles, Mic } from 'lucide-react';
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
    const saved = localStorage.getItem('vilor_quantum_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_quantum_v4', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeId);

  const handleSend = async () => {
    if (!input.trim() || loading || !activeId) return;
    const msg = input;
    const isImg = msg.toLowerCase().startsWith('/img');
    setInput('');
    setLoading(true);

    const updatedMsgs = [...(activeChat?.messages || []), { role: 'user', content: msg }];
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: updatedMsgs, title: c.messages.length === 0 ? msg.slice(0, 20) : c.title } : c));

    try {
      if (isImg) {
        const res = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt: msg.replace('/img', '').trim() }) });
        const data = await res.json();
        if (data.url) addBotMsg(`Arte gerada com sucesso:\n\n![gen](${data.url})`);
        else addBotMsg(`⚠️ Erro na geração: ${data.error}`);
      } else {
        const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: updatedMsgs }) });
        const data = await res.json();
        addBotMsg(data.content);
      }
    } catch { addBotMsg("Erro crítico na conexão."); } finally { setLoading(false); }
  };

  const addBotMsg = (txt: string) => {
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: txt }] } : c));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', overflow: 'hidden' }}>
      {/* SIDEBAR */}
      <motion.div animate={{ width: sidebar ? 280 : 0 }} style={{ background: '#080808', borderRight: '1px solid #151515', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '25px' }}>
          <button onClick={() => { const id = Date.now().toString(); setChats([{id, title: 'Nova Conversa', messages: []}, ...chats]); setActiveId(id); }} style={{ width: '100%', padding: '12px', background: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /> Novo Chat</button>
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

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <header style={{ height: '65px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 25px', gap: '20px', background: 'rgba(2,2,2,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
          <LayoutPanelLeft size={20} onClick={() => setSidebar(!sidebar)} cursor="pointer" color="#555" />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="#3b82f6" fill="#3b82f6" />
            <span style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '2px' }}>VILORAI <span style={{ color: '#3b82f6' }}>QUANTUM</span></span>
          </div>
          <Sparkles size={18} color="#facc15" />
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '30px 20px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {activeChat?.messages.map((m: any, i: number) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} style={{ marginBottom: '35px', display: 'flex', gap: '20px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.role === 'user' ? '#3b82f6' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: m.role === 'user' ? '0 0 15px rgba(59,130,246,0.4)' : 'none' }}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div style={{ background: m.role === 'user' ? '#111' : '#0a0a0a', padding: '15px 22px', borderRadius: '18px', border: '1px solid #1a1a1a', maxWidth: '80%', lineHeight: '1.7', fontSize: '1rem', color: '#efefef' }}>
                  <ReactMarkdown components={{ img: ({src}) => <div style={{ position: 'relative', marginTop: '15px' }}><img src={src} style={{ width: '100%', borderRadius: '12px', border: '1px solid #333' }} /><a href={src} download="vilor-art.png" style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '50%', color: '#fff', display: 'flex' }}><Download size={18} /></a></div> }}>{m.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {loading && <div style={{ padding: '20px', display: 'flex', gap: '8px' }}>
              <div className="dot" /> <div className="dot" /> <div className="dot" />
            </div>}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* INPUT ZONE */}
        <div style={{ padding: '30px', background: 'linear-gradient(transparent, #020202 50%)' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', background: '#0d0d0d', border: '1px solid #222', borderRadius: '22px', display: 'flex', alignItems: 'center', padding: '8px 20px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ marginRight: '15px', opacity: 0.5 }}>
              {input.startsWith('/img') ? <ImageIcon size={20} color="#3b82f6" /> : <Mic size={20} />}
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Pergunte ao VilorAI ou use /img para arte..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '12px 0', outline: 'none', resize: 'none', fontSize: '1rem', fontFamily: 'inherit' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '12px', width: '42px', height: '42px', cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <ChevronRight color="#fff" size={24} />
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
}
