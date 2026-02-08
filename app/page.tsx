'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Trash2, Zap, Image as ImageIcon, ChevronRight, Download, Sparkles, LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'assistant'; content: string };
type Chat = { id: string; title: string; messages: Message[] };

export default function VilorAI() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vilor_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_v4', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSend = async () => {
    if (!input.trim() || loading || !activeChatId) return;
    const userMsg = input;
    const isImg = userMsg.toLowerCase().startsWith('/img');
    setInput('');
    setLoading(true);

    const updatedMessages = [...(activeChat?.messages || []), { role: 'user', content: userMsg } as Message];
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: updatedMessages, title: c.messages.length === 0 ? userMsg.slice(0, 20) : c.title } : c));

    try {
      if (isImg) {
        const res = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt: userMsg.replace('/img', '').trim() }) });
        const data = await res.json();
        addAssistantMsg(`![gen](${data.url})`);
      } else {
        const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: updatedMessages }) });
        const data = await res.json();
        addAssistantMsg(data.content);
      }
    } catch { addAssistantMsg("Erro no sistema VilorAI."); } finally { setLoading(false); }
  };

  const addAssistantMsg = (content: string) => {
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'assistant', content }] } : c));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', fontFamily: 'sans-serif' }}>
      <motion.nav animate={{ width: sidebarOpen ? 280 : 0 }} style={{ background: '#080808', borderRight: '1px solid #151515', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => { const id = Date.now().toString(); setChats([{ id, title: 'Nova Conversa', messages: [] }, ...chats]); setActiveChatId(id); }} style={{ width: '100%', padding: '12px', background: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Novo Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveChatId(c.id)} style={{ padding: '10px', borderRadius: '8px', background: activeChatId === c.id ? '#151515' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{c.title}</span>
              <Trash2 size={14} onClick={(e) => { e.stopPropagation(); setChats(chats.filter(chat => chat.id !== c.id)); }} />
            </div>
          ))}
        </div>
      </motion.nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '60px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px' }}>
          <LayoutPanelLeft size={20} cursor="pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1 style={{ fontSize: '1rem', fontWeight: 900 }}>VILORAI <span style={{ color: '#3b82f6' }}>QUANTUM</span></h1>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {activeChat?.messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: m.role === 'user' ? '#3b82f6' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ background: m.role === 'user' ? '#111' : '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #151515', maxWidth: '80%' }}>
                  <ReactMarkdown components={{ img: ({src}) => <div style={{ position: 'relative' }}><img src={src} style={{ width: '100%', borderRadius: '8px' }} /><a href={src} download style={{ position: 'absolute', top: 10, right: 10, background: '#000', padding: '5px', borderRadius: '50%' }}><Download size={16} /></a></div> }}>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div className="loader" />}
            <div ref={scrollRef} />
          </div>
        </div>

        <div style={{ padding: '20px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0d0d0d', borderRadius: '15px', border: '1px solid #222', display: 'flex', alignItems: 'center', padding: '5px 15px' }}>
            {input.startsWith('/img') ? <ImageIcon size={18} color="#3b82f6" /> : <Sparkles size={18} color="#facc15" />}
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Pergunte ou use /img..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '15px', outline: 'none', resize: 'none' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '10px', width: '35px', height: '35px', cursor: 'pointer' }}><ChevronRight size={20} color="#fff" /></button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .loader { width: 20px; height: 20px; border: 2px solid #333; border-top-color: #3b82f6; border-radius: 50%; animation: s 1s linear infinite; }
        @keyframes s { to { transform: rotate(360deg); } }
        body { scrollbar-width: thin; scrollbar-color: #222 #000; }
      `}</style>
    </div>
  );
}
