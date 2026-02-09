'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Code, Book, PenTool, Brain, Briefcase, Languages, Scale, 
  HeartPulse, Terminal, Music, Camera, Coffee, Shield, Zap, LayoutPanelLeft,
  ChevronRight, Trash2, Plus, MessageSquare, Bot, User, Sparkles, Mic, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const TOOLS = [
  { id: 1, name: 'Dev Sênior', icon: <Code />, prompt: 'Engenheiro de Software Sênior. Clean Code e SOLID.' },
  { id: 2, name: 'Especialista SQL', icon: <Terminal />, prompt: 'Especialista em bancos de dados e otimização de queries.' },
  { id: 3, name: 'Cyber Security', icon: <Shield />, prompt: 'Especialista em segurança ofensiva e análise de vulnerabilidades.' },
  { id: 4, name: 'Data Scientist', icon: <Brain />, prompt: 'Cientista de dados. Analise estatísticas e modelos ML.' },
  { id: 5, name: 'DevOps Cloud', icon: <Zap />, prompt: 'Especialista em AWS, Docker e CI/CD.' },
  { id: 6, name: 'Growth Hacker', icon: <Zap />, prompt: 'Estrategista de crescimento e métricas de aquisição.' },
  { id: 7, name: 'Copywriter Ads', icon: <PenTool />, prompt: 'Expert em marketing direto e estrutura AIDA.' },
  { id: 8, name: 'Estrategista SEO', icon: <Search />, prompt: 'Analista de SEO técnico e autoridade de domínio.' },
  { id: 9, name: 'Gestor Financeiro', icon: <Briefcase />, prompt: 'Consultor financeiro e fluxo de caixa.' },
  { id: 10, name: 'Business Coach', icon: <Briefcase />, prompt: 'Mentor de negócios e liderança.' },
  { id: 11, name: 'Mestre em Cálculo', icon: <Brain />, prompt: 'Professor de exatas. Didática passo a passo.' },
  { id: 12, name: 'Tradutor Técnico', icon: <Languages />, prompt: 'Tradutor de documentos complexos e precisos.' },
  { id: 13, name: 'Pesquisador Histórico', icon: <Book />, prompt: 'Historiador acadêmico. Contextualize eventos.' },
  { id: 14, name: 'Filósofo Moderno', icon: <Brain />, prompt: 'Analise dilemas sob a ótica de grandes pensadores.' },
  { id: 15, name: 'Tutor de Inglês', icon: <Languages />, prompt: 'Professor de idiomas. Corrija e sugira termos naturais.' },
  { id: 16, name: 'Psicólogo TCC', icon: <HeartPulse />, prompt: 'Terapeuta Cognitivo-Comportamental.' },
  { id: 17, name: 'Nutricionista', icon: <Coffee />, prompt: 'Especialista em dietética e macros.' },
  { id: 18, name: 'Personal Trainer', icon: <Zap />, prompt: 'Treinador físico. Periodização de treino.' },
  { id: 19, name: 'Consultor de Sono', icon: <HeartPulse />, prompt: 'Especialista em higiene do sono.' },
  { id: 20, name: 'Biohacker', icon: <Sparkles />, prompt: 'Performance humana e suplementação.' },
  { id: 21, name: 'Advogado Civil', icon: <Scale />, prompt: 'Consultor jurídico especializado em Código Civil.' },
  { id: 22, name: 'Redator Acadêmico', icon: <PenTool />, prompt: 'Especialista em normas ABNT e escrita científica.' },
  { id: 23, name: 'Roteirista', icon: <Camera />, prompt: 'Escritor criativo. Jornada do Herói.' },
  { id: 24, name: 'Editor de Texto', icon: <PenTool />, prompt: 'Revisor profissional. Coesão e coerência.' },
  { id: 25, name: 'Especialista em Editais', icon: <Scale />, prompt: 'Analise concursos e editais públicos.' },
  { id: 26, name: 'UX Designer', icon: <LayoutPanelLeft />, prompt: 'Estrategista de experiência do usuário.' },
  { id: 27, name: 'Diretor de Arte', icon: <Camera />, prompt: 'Teoria das cores e composição visual.' },
  { id: 28, name: 'Prompt Engineer', icon: <Sparkles />, prompt: 'Crie prompts perfeitos para IAs generativas.' },
  { id: 29, name: 'Arquiteto', icon: <LayoutPanelLeft />, prompt: 'Consultor de design e estruturas funcionais.' },
  { id: 30, name: 'Produtor Musical', icon: <Music />, prompt: 'Teoria musical, mixagem e masterização.' },
  { id: 31, name: 'Expert LinkedIn', icon: <Briefcase />, prompt: 'Marca pessoal e otimização de perfil.' },
  { id: 32, name: 'Mestre em GTD', icon: <Zap />, prompt: 'Estrategista de produtividade e foco.' },
  { id: 33, name: 'Entrevistador', icon: <User />, prompt: 'Simule entrevistas e dê feedback.' },
  { id: 34, name: 'Analista de Soft Skills', icon: <HeartPulse />, prompt: 'Inteligência emocional e conflitos.' },
  { id: 35, name: 'Mentor Startups', icon: <Briefcase />, prompt: 'Foque em MVP e pitch para investidores.' },
  { id: 36, name: 'Chef Michelin', icon: <Coffee />, prompt: 'Alta gastronomia e técnicas avançadas.' },
  { id: 37, name: 'Sommelier', icon: <Coffee />, prompt: 'Harmonização e regiões vinícolas.' },
  { id: 38, name: 'Travel Planner', icon: <Search />, prompt: 'Roteiros de viagem otimizados.' },
  { id: 39, name: 'Mestre de RPG', icon: <Sparkles />, prompt: 'Narrador de mundos imersivos.' },
  { id: 40, name: 'Fotógrafo', icon: <Camera />, prompt: 'Técnicas de captura e iluminação.' },
  { id: 41, name: 'Debatedor Socrático', icon: <Brain />, prompt: 'Questione para chegar à conclusão.' },
  { id: 42, name: 'Resumidor de PDF', icon: <Book />, prompt: 'Extraia pontos chave de forma estruturada.' },
  { id: 43, name: 'Analista de Notícias', icon: <Search />, prompt: 'Analise fatos atuais e contextos.' },
  { id: 44, name: 'Xadrez Master', icon: <Brain />, prompt: 'Analise táticas e aberturas.' },
  { id: 45, name: 'Guia Espiritual', icon: <HeartPulse />, prompt: 'Mindfulness e meditação.' },
  { id: 46, name: 'Hardware Expert', icon: <Terminal />, prompt: 'Montagem de PCs e diagnósticos.' },
  { id: 47, name: 'E-commerce Analyst', icon: <Briefcase />, prompt: 'Conversão e logística online.' },
  { id: 48, name: 'Bot de SAC', icon: <MessageSquare />, prompt: 'Atendimento educado e resolutivo.' },
  { id: 49, name: 'E-mail Writer', icon: <PenTool />, prompt: 'Crie e-mails profissionais delicados.' },
  { id: 50, name: 'VilorAI God Mode', icon: <Zap />, prompt: 'Respostas ultra-diretas e profundas.' },
];

export default function VilorAI() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const [search, setSearch] = useState('');
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vilor_quantum_v50');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_quantum_v50', JSON.stringify(chats));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, loading]);

  const activeChat = chats.find(c => c.id === activeId);

  const startToolChat = (tool: any) => {
    const id = Date.now().toString();
    const newChat = { id, title: tool.name, messages: [], systemPrompt: tool.prompt };
    setChats([newChat, ...chats]);
    setActiveId(id);
    setShowTools(false);
    setSearch('');
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeId) return;
    const msg = input;
    setInput('');
    setLoading(true);

    const updatedMsgs = [...(activeChat?.messages || []), { role: 'user', content: msg }];
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: updatedMsgs } : c));

    try {
      const res = await fetch('/api/chat', { 
        method: 'POST', 
        body: JSON.stringify({ messages: updatedMsgs, systemPrompt: activeChat?.systemPrompt }) 
      });
      const data = await res.json();
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: data.content }] } : c));
    } catch { 
      // Erro silenciado
    } finally { setLoading(false); }
  };

  const filteredTools = TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <motion.div animate={{ width: sidebar ? 260 : 0 }} style={{ background: '#080808', borderRight: '1px solid #151515', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setShowTools(true)} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} /> Ver 50 Funções
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '12px', borderRadius: '8px', background: activeId === c.id ? '#151515' : 'transparent', cursor: 'pointer', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden' }}>{c.title}</span>
              <Trash2 size={12} onClick={() => setChats(chats.filter(x => x.id !== c.id))} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* MAIN CHAT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* MODAL DE FUNÇÕES */}
        <AnimatePresence>
          {showTools && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '40px' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, marginRight: '20px' }}>
                    <Search style={{ position: 'absolute', left: 15, top: 12, opacity: 0.4 }} size={18} />
                    <input autoFocus placeholder="Buscar função..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 45px', background: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                  </div>
                  <X size={30} onClick={() => setShowTools(false)} cursor="pointer" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', height: '70vh', overflowY: 'auto' }}>
                  {filteredTools.map(t => (
                    <div key={t.id} onClick={() => startToolChat(t)} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a', textAlign: 'center', cursor: 'pointer' }}>
                      <div style={{ color: '#3b82f6', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>{t.icon}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header style={{ height: '60px', borderBottom: '1px solid #151515', display: 'flex', alignItems: 'center', padding: '0 25px', gap: '20px' }}>
          <LayoutPanelLeft size={20} cursor="pointer" onClick={() => setSidebar(!sidebar)} />
          <h1 style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>VILORAI <span style={{ color: '#3b82f6' }}>QUANTUM</span></h1>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {activeChat?.messages.map((m: any, i: number) => (
              <div key={i} style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: m.role === 'user' ? '#3b82f6' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #151515', maxWidth: '85%', lineHeight: '1.6' }}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div style={{ opacity: 0.5 }}>Processando inteligência...</div>}
            <div ref={scrollRef} />
          </div>
        </div>

        <div style={{ padding: '20px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0d0d0d', border: '1px solid #222', borderRadius: '15px', display: 'flex', alignItems: 'center', padding: '5px 15px' }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={`Fale com ${activeChat?.title || 'VilorAI'}...`} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '15px', outline: 'none', resize: 'none' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '10px', width: '38px', height: '38px', cursor: 'pointer' }}><ChevronRight /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
