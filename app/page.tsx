'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Trash2, Zap, Image as ImageIcon, ChevronRight, Download, LayoutPanelLeft, Sparkles } from 'lucide-react';
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
    const saved = localStorage.getItem('vilor_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_v4', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeId);

  const handleSend = async () => {
    if (!input.trim() || loading || !activeId) return;
    const msg = input;
    const isImg = msg.toLowerCase().startsWith('/img');
    setInput('');
    setLoading(true);

    const newMsgs = [...(activeChat?.messages || []), { role: 'user', content: msg }];
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: newMsgs, title: c.messages.length === 0 ? msg.slice(0, 20) : c.title } : c));

    try {
      if (isImg) {
        const res = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt: msg.replace('/img', '') }) });
        const data = await res.json();
        addBotMsg(`Aqui está sua imagem:\n\n![gen](${data.url})`);
      } else {
        const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: newMsgs }) });
        const data = await res.json();
        addBotMsg(data.content);
      }
    } catch { addBotMsg("Erro crítico no sistema."); } finally { setLoading(false); }
  };

  const addBotMsg = (txt: string) => {
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: txt }] } : c));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff' }}>
      {/* SIDEBAR */}
      <motion.div animate={{ width: sidebar ? 260 : 0 }} style={{ background: '#080808', borderRight: '1px solid #151515', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => { const id = Date.now().toString(); setChats([{id, title: 'Novo Chat', messages: []}, ...chats]); setActiveId(id); }} style={{ width: '100%', padding: '10px', background: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Novo Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '8px', background: activeId === c.id ? '#151515' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{c.title}</span>
              <Trash2 size={12} onClick={(e) => { e.stopPropagation(); setChats(chats.filter(x => x.id !== c.id)); }} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '50px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '15px' }}>
          <LayoutPanelLeft size={18} onClick={() => setSidebar(!sidebar)} cursor="pointer" />
          <span style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px' }}>VILORAI <span style={{ color: '#3b82f6' }}>QUANTUM</span></span>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {activeChat?.messages.map((m: any, i: number) => (
              <div key={i} style={{ marginBottom: '25px', display: 'flex', gap: '15px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: m.role === 'user' ? '#3b82f6' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div style={{ background: m.role === 'user' ? '#111' : '#0a0a0a', padding: '12px 18px', borderRadius: '12px', border: '1px solid #181818', maxWidth: '80%', lineHeight: '1.6' }}>
                  <ReactMarkdown components={{ img: ({src}) => <div style={{ position: 'relative' }}><img src={src} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} /><a href={src} download style={{ position: 'absolute', top: 15, right: 10, background: '#000', padding: '5px', borderRadius: '50%' }}><Download size={14} /></a></div> }}>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div style={{ padding: '10px', opacity: 0.5 }}>VilorAI está processando...</div>}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* INPUT */}
        <div style={{ padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0d0d0d', border: '1px solid #222', borderRadius: '15px', display: 'flex', alignItems: 'center', padding: '5px 15px' }}>
            {input.startsWith('/img') ? <ImageIcon size={18} color="#3b82f6" /> : <Sparkles size={18} color="#facc15" />}
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Pergunte ou use /img..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '15px', outline: 'none', resize: 'none' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '10px', width: '35px', height: '35px', cursor: 'pointer' }}><ChevronRight color="#fff" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
