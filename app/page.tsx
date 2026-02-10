'use client';
import { useState, useEffect } from 'react';
import { 
  Video, Play, Pause, RotateCcw, CheckCircle2, Trash2, ChevronRight, 
  Sparkles, X, Brain, Code, Rocket, PenTool, Bot, LayoutDashboard, 
  Settings, Zap, Clock, Search, Film, Download, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function VilorAI() {
  const [activeTab, setActiveTab] = useState('video'); // Iniciando na aba de vídeo
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setLoading(true);
    setVideoUrl('');
    setStatus('Iniciando renderização...');

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        body: JSON.stringify({ prompt: videoPrompt })
      });
      const { requestId } = await res.json();

      const poll = setInterval(async () => {
        const check = await fetch(`/api/video?id=${requestId}`);
        const data = await check.json();
        
        setStatus(`Status: ${data.status}...`);

        if (data.status === 'success') {
          setVideoUrl(data.url);
          setLoading(false);
          clearInterval(poll);
        } else if (data.status === 'failed' || data.status === 'error') {
          setStatus('Erro na geração.');
          setLoading(false);
          clearInterval(poll);
        }
      }, 5000);
    } catch (e) {
      setLoading(false);
      setStatus('Erro de conexão.');
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden">
      
      {/* NAVEGAÇÃO LATERAL */}
      <aside className="w-20 border-r border-white/10 flex flex-col items-center py-6 bg-black">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 to-cyan-500 rounded-lg flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
          <Zap size={20} fill="white" />
        </div>
        <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-blue-600 shadow-lg shadow-blue-500/40' : 'text-gray-500 hover:text-white'}`}><Brain size={24} /></button>
        <button onClick={() => setActiveTab('video')} className={`p-4 rounded-2xl mt-4 transition-all ${activeTab === 'video' ? 'bg-blue-600 shadow-lg shadow-blue-500/40' : 'text-gray-500 hover:text-white'}`}><Film size={24} /></button>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-black text-xl italic">V</span>
            <span className="text-[10px] tracking-[4px] font-light opacity-50 uppercase">Quantum Engine</span>
          </div>
          <div className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-blue-400 font-mono">
            MODEL: LTX-2-19B-DISTILLED
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_#0a0a0a_0%,_#020202_100%)]">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'video' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* CONFIGURAÇÃO */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Criar Cinema Digital</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Ajustado para <span className="text-white">480x480</span> com <span className="text-white">32 quadros</span>. 
                    Ideal para movimentos fluidos e áudio sincronizado.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Prompt de Direção</label>
                    <textarea 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Descreva o movimento da câmera, iluminação e ação..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 ring-blue-500 outline-none min-h-[150px] transition-all"
                    />
                  </div>

                  <button 
                    onClick={handleGenerateVideo}
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {loading ? 'PROCESSANDO FRAME BY FRAME...' : 'INICIAR RENDERIZAÇÃO'}
                  </button>
                  {status && <p className="text-center text-xs text-blue-400 font-mono animate-pulse">{status}</p>}
                </div>

                {/* PREVIEW */}
                <div className="aspect-square bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
                  {videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-4 opacity-20">
                      <Film size={60} className="mx-auto" />
                      <p className="text-sm font-light">Aguardando sinal da Matrix...</p>
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <span className="text-[10px] tracking-widest uppercase">Gerando LTX-2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
