'use client';
import { useState, useEffect } from 'react';
import { 
  Zap, Video, MessageSquare, Plus, Trash2, Send, Cpu, 
  ChevronRight, LayoutGrid, Clock, CheckCircle2,
  Sparkles, Loader2, Download, Shield, Code, Brain, Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function VilorChatQuantum() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs); setInput(''); setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ type: 'chat', messages: newMsgs, systemPrompt: "Você é o VilorPrime, uma IA de elite." })
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: 'assistant', content: data.content }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* CSS INJETADO PARA SCROLLBAR E EFEITOS */}
      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #27272a; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .neon-border { box-shadow: 0 0 15px rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); }
      `}</style>

      {/* SIDEBAR DOCK */}
      <nav className="w-20 bg-black border-r border-white/5 flex flex-col items-center py-8 gap-6 z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] transform hover:scale-105 transition-transform cursor-pointer">
          <Zap size={22} className="text-white" fill="currentColor" />
        </div>
        
        <div className="flex-1 flex flex-col gap-4 mt-10">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === 'chat' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-600 hover:bg-white/5'}`}
          >
            <MessageSquare size={22} />
          </button>
          <button 
            onClick={() => setActiveTab('video')} 
            className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === 'video' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-600 hover:bg-white/5'}`}
          >
            <Film size={22} />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#0a0a0a_0%,_#020202_100%)]">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-10">
          <div className="flex flex-col">
            <h1 className="text-xs font-black tracking-[0.5em] text-white uppercase flex items-center gap-2">
              Vilor<span className="text-blue-500">Quantum</span>
              <span className="bg-blue-500/10 text-blue-500 text-[8px] px-2 py-0.5 rounded-full border border-blue-500/20">V4</span>
            </h1>
            <span className="text-[9px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">Neural Link: Active</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Latência</span>
              <span className="text-xs font-mono text-green-500">24ms</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-bold text-zinc-300 tracking-widest uppercase">LTX-2 Online</span>
            </div>
          </div>
        </header>

        {/* CHAT/VIDEO AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-10 relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-8 pb-32"
                >
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                      <Brain size={48} className="mb-4" />
                      <p className="text-sm tracking-widest uppercase">Aguardando entrada de dados...</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${m.role === 'user' ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-900 border-white/10 text-blue-500'}`}>
                        {m.role === 'user' ? <Plus size={18}/> : <Cpu size={18}/>}
                      </div>
                      <div className={`p-6 rounded-3xl text-sm leading-relaxed glass ${m.role === 'user' ? 'border-blue-500/10' : 'border-white/10'}`}>
                        <ReactMarkdown className="prose prose-invert max-w-none">{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-blue-500" />
                      </div>
                      <div className="p-6 rounded-3xl glass border-white/10 italic text-zinc-500 text-xs">
                        Processando resposta neural...
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <div className="w-full max-w-xl aspect-square glass rounded-[40px] flex items-center justify-center relative overflow-hidden group border-white/10 shadow-2xl">
                    {videoUrl ? (
                      <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <Film size={32} className="text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-light">LTX-2 Video Renderer</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#020202] via-[#020202]/90 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative glass rounded-[24px] p-2 flex items-center focus-within:neon-border transition-all duration-500 group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={activeTab === 'chat' ? "Fale com a Matrix..." : "Descreva a cena para o LTX-2 (480x480)..."}
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white text-sm placeholder:text-zinc-600 font-light"
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[8px] text-center text-zinc-600 mt-4 uppercase tracking-[0.3em]">
              Powered by LTX-2 Distilled & Kimi-K2-Instruct
            </p>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR - TACTICAL DATA */}
      <aside className="w-72 bg-black border-l border-white/5 p-8 hidden lg:flex flex-col gap-10">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-6 flex items-center gap-2">
            <LayoutGrid size={12} /> Objetivos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <CheckCircle2 size={14} className="text-blue-500" />
              <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors">Build Finalizado</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <Clock size={14} className="text-zinc-700" />
              <span className="text-[11px] text-zinc-500 group-hover:text-zinc-200 transition-colors">Otimização CSS</span>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 rounded-[24px] bg-gradient-to-br from-zinc-900 to-black border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Shield size={16} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Bio-Metric</span>
          </div>
          <div className="space-y-2">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-blue-500" />
            </div>
            <p className="text-[9px] text-zinc-600 uppercase font-mono">Neural Load: 65%</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
