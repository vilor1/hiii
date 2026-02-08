'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Trash2, Zap, LayoutPanelLeft, Sparkles, Copy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'assistant'; content: string };
type Chat = { id: string; title: string; messages: Message[]; date: number };

export default function VilorAIQuantum() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vilor_v3_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_v3_chats', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const startNewChat = () => {
    const newChat: Chat = { 
      id: crypto.randomUUID(), 
      title: 'Nova Ideia', 
      messages: [], 
      date: Date.now() 
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeChatId) return;

    const userMsg = input;
    setInput('');
    
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c, 
      messages: [...c.messages, { role: 'user', content: userMsg }],
      title: c.messages.length === 0 ? userMsg.slice(0, 25) : c.title
    } : c));

    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...(activeChat?.messages || []), { role: 'user', content: userMsg }] }),
      });
      const data = await res.json();
      
      setChats(prev => prev.map(c => c.id === activeChatId 
        ? { ...c, messages: [...c.messages, { role: 'assistant', content: data.content }] } 
        : c
      ));
    } catch (e) {
      console.error("Erro VilorAI:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vilor-root" style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', overflow: 'hidden' }}>
      
      {/* SIDEBAR NEON */}
      <motion.nav 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        style={{ background: '#080808', borderRight: '1px solid #151515', display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}
      >
        <div style={{ padding: '20px' }}>
          <button onClick={startNewChat} className="btn-new">
            <Plus size={16} /> Novo Projeto
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
            >
              <MessageSquare size={14} />
              <span>{chat.title}</span>
              <Trash2 size={12} className="delete-icon" onClick={(e) => { e.stopPropagation(); setChats(chats.filter(c => c.id !== chat.id)); }} />
            </div>
          ))}
        </div>
      </motion.nav>

      {/* MAIN VIEWPORT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'radial-gradient(circle at 50% -20%, #111 0%, #020202 100%)' }}>
        
        {/* HEADER GLASS */}
        <header style={{ height: '60px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 25px', justifyContent: 'space-between', backdropFilter: 'blur(20px)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <LayoutPanelLeft size={20} cursor="pointer" onClick={() => setSidebarOpen(!sidebarOpen)} color={sidebarOpen ? '#3b82f6' : '#555'} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#3b82f6" fill="#3b82f6" />
              <span style={{ fontWeight: 900, letterSpacing: '2px', fontSize: '0.9rem' }}>VILORAI <span style={{ color: '#3b82f6' }}>QNTM</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
             <Sparkles size={18} color="#facc15" />
          </div>
        </header>

        {/* MESSAGES AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <AnimatePresence>
              {activeChat?.messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} key={i} className={`msg-container ${m.role}`}>
                  <div className="avatar">
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="bubble">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                    {m.role === 'assistant' && <Copy size={12} className="copy-btn" onClick={() => navigator.clipboard.writeText(m.content)} />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="typing-indicator">
                <div className="dot" /> <div className="dot" /> <div className="dot" />
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* FLOATING INPUT */}
        <div style={{ padding: '30px', background: 'linear-gradient(0deg, #020202 40%, transparent)' }}>
          <div className="input-wrapper">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Descreva o que VilorAI Quantum deve computar..."
              rows={1}
            />
            <button onClick={handleSend} disabled={loading || !activeChatId} className="send-btn">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .btn-new { width: 100%; padding: 12px; background: #fff; color: #000; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-new:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.2); }
        
        .chat-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; color: #888; transition: 0.2s; position: relative; }
        .chat-item:hover { background: #111; color: #fff; }
        .chat-item.active { background: #151515; color: #3b82f6; }
        .delete-icon { position: absolute; right: 10px; opacity: 0; transition: 0.2s; }
        .chat-item:hover .delete-icon { opacity: 0.5; }

        .msg-container { display: flex; gap: 20px; margin-bottom: 40px; }
        .msg-container.user { flex-direction: row-reverse; }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: #111; border: 1px solid #222; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .user .avatar { background: #3b82f6; border: none; }
        
        .bubble { position: relative; padding: 15px 20px; border-radius: 18px; max-width: 80%; line-height: 1.7; font-size: 1rem; color: #ddd; background: #0f0f0f; border: 1px solid #181818; }
        .user .bubble { background: #111; border-color: #3b82f655; color: #fff; border-radius: 18px 4px 18px 18px; }
        .copy-btn { position: absolute; bottom: -20px; right: 0; cursor: pointer; opacity: 0.3; }
        .copy-btn:hover { opacity: 1; }

        .input-wrapper { max-width: 850px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 20px; display: flex; align-items: center; padding: 8px 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        textarea { flex: 1; background: transparent; border: none; color: #fff; padding: 15px; outline: none; resize: none; font-family: inherit; font-size: 1rem; }
        .send-btn { background: #3b82f6; color: #fff; border: none; border-radius: 12px; width: 45px; height: 45px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .send-btn:hover { transform: scale(1.05); background: #2563eb; }

        .typing-indicator { display: flex; gap: 5px; padding: 20px; }
        .dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
