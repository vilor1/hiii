'use client';
import { useState, useEffect } from 'react';
import { 
  Zap, Video, MessageSquare, Plus, Trash2, Send, Cpu, 
  ChevronRight, Search, LayoutGrid, Clock, CheckCircle2,
  Sparkles, Loader2, Download, Shield, Code, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AGENTS = [
  { id: 'master', name: 'Vilor Prime', prompt: 'Você é a inteligência central VilorAI. Respostas curtas, brutais e lógicas.', icon: <Cpu /> },
  { id: 'coder', name: 'Matrix Architect', prompt: 'Expert em Next.js 14 e Clean Code.', icon: <Code /> },
  { id: 'creative', name: 'Cinematic Director', prompt: 'Especialista em roteiros e prompts visuais para vídeo.', icon: <Video /> }
];

export default function VilorChatQuantum() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);

  // Lógica de Chat
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs); setInput(''); setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ type: 'chat', messages: newMsgs, systemPrompt: AGENTS[0].prompt })
    });
    const data = await res.json();
    setMessages([...newMsgs, { role: 'assistant', content: data.content }]);
    setLoading(false);
  };

  // Lógica de Vídeo
  const generateVideo = async () => {
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ type: 'video', prompt: input })
    });
    const { requestId } = await res.json();
    
    const check = setInterval(async () => {
      const status = await fetch(`/api/video/status?id=${requestId}`); // Criar rota GET simples
      const data = await status.json();
      if (data.status === 'success') {
        setVideoUrl(data.url); setLoading(false); clearInterval(check);
      }
    }, 5000);
  };

  return (
    <div className="flex h-screen bg-[#020202] text-zinc-300 overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR DOCK */}
      <div className="w-20 bg-black border-r border-white/5 flex flex-col items-center py-8 gap-6 z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Zap size={22} className="text-white" fill="currentColor" />
        </div>
        <div className="flex-1 flex flex-col gap-4 mt-10">
          <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-white/10 text-blue-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <MessageSquare size={22} />
          </button>
          <button onClick={() => setActiveTab('video')} className={`p-4 rounded-2xl transition-all ${activeTab === 'video' ? 'bg-white/10 text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Video size={22} />
          </button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/60 backdrop-blur-2xl">
          <div>
            <h1 className="text-sm font-black tracking-[0.4em] text-white">VILOR<span className="text-blue-500">CHAT</span></h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Quantum Interface v4.0</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-400">LTX-2 ONLINE</span>
             </div>
          </div>
        </header>

        {/* ÁREA DE MENSAGENS / VÍDEO */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {activeTab === 'chat' ? (
                messages.map((m, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${m.role === 'user' ? 'bg-blue-600 border-blue-400' : 'bg-zinc-900 border-white/10'}`}>
                      {m.role === 'user' ? <Plus size={18}/> : <Cpu size={18}/>}
                    </div>
                    <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-zinc-900/50 border border-white/5' : 'bg-white/5 backdrop-blur-sm border border-white/10'}`}>
                      <ReactMarkdown className="prose prose-invert">{m.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                  {videoUrl ? (
                    <motion.video initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={videoUrl} controls className="w-full max-w-xl rounded-[40px] border border-white/10 shadow-2xl shadow-blue-500/10" />
                  ) : (
                    <div className="p-20 border-2 border-dashed border-white/5 rounded-[60px]">
                      <Video size={60} className="mx-auto text-zinc-800 mb-6" />
                      <p className="text-zinc-500 font-light">Descreva sua cena no campo abaixo para renderizar.</p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* INPUT BAR FIXA */}
        <div className="p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[28px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[24px] p-2 flex items-center shadow-2xl">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'chat' ? sendMessage() : generateVideo())}
                placeholder={activeTab === 'chat' ? "Comando para o VilorPrime..." : "Prompt para o Cinema LTX-2 (480x480)..."}
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white text-sm placeholder:text-zinc-600"
              />
              <button 
                onClick={activeTab === 'chat' ? sendMessage() : generateVideo()}
                disabled={loading}
                className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all text-white disabled:bg-zinc-800"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* PAINEL DE PERFORMANCE (RIGHT SIDEBAR) */}
      <aside className="w-80 bg-black border-l border-white/5 p-8 hidden xl:flex flex-col gap-10">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-6">Status de Missão</h3>
          <div className="space-y-4">
            {todos.length === 0 && <p className="text-xs text-zinc-700 italic">Nenhum objetivo tático definido.</p>}
            {todos.map(t => (
              <div key={t.id} className="flex items-center gap-3 text-[13px]">
                <CheckCircle2 size={16} className={t.done ? 'text-blue-500' : 'text-zinc-800'} />
                <span className={t.done ? 'line-through text-zinc-600' : ''}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto bg-white/5 p-6 rounded-3xl border border-white/10">
          <h4 className="text-[10px] font-bold text-blue-500 mb-2 uppercase">Agente Ativo</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Vilor Protector</p>
              <p className="text-[9px] text-zinc-500">Security Mode Enabled</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
