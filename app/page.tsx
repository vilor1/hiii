'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Code, Book, Brain, MessageSquare, Bot, User, Sparkles, 
  CheckCircle2, Clock, X, GraduationCap, Target, Play, Pause, RotateCcw,
  Cpu, Database, Shield, Zap, LayoutPanelLeft, ChevronRight, Trash2, 
  PlusCircle, PenTool, Lightbulb, Monitor, FlaskConical, RefreshCw, Wallet, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const DEFAULT_AGENTS = [
  // 10 DE ESTUDO CIENTÍFICO
  { id: 'feynman', cat: 'Estudo', name: 'Mestre Feynman', icon: <GraduationCap />, prompt: 'Explique conceitos complexos como se eu tivesse 5 anos.' },
  { id: 'cornell', cat: 'Estudo', name: 'Cornell Master', icon: <PenTool />, prompt: 'Organize o conteúdo no formato de Notas de Cornell.' },
  { id: 'socratic', cat: 'Estudo', name: 'Tutor Socrático', icon: <MessageSquare />, prompt: 'Responda apenas com perguntas que me façam raciocinar.' },
  { id: 'recall', cat: 'Estudo', name: 'Recall Ativo', icon: <Target />, prompt: 'Gere perguntas de teste após cada explicação.' },
  { id: 'mindmap', cat: 'Estudo', name: 'Mapeador Mental', icon: <Brain />, prompt: 'Estruture tópicos em hierarquia para mapas mentais.' },
  { id: 'spaced', cat: 'Estudo', name: 'Spaced Repetition', icon: <Clock />, prompt: 'Crie um cronograma de revisão Anki.' },
  { id: 'elaborate', cat: 'Estudo', name: 'Conector de Ideias', icon: <Lightbulb />, prompt: 'Crie analogias reais para conceitos abstratos.' },
  { id: 'auditor', cat: 'Estudo', name: 'Auditor de Lacunas', icon: <Search />, prompt: 'Identifique onde minha explicação está incompleta.' },
  { id: 'blurting', cat: 'Estudo', name: 'Blurting Bot', icon: <Zap />, prompt: 'Compare o que eu lembro com a teoria completa.' },
  { id: 'exam', cat: 'Estudo', name: 'Estrategista de Provas', icon: <Rocket />, prompt: 'Simule questões de alta dificuldade de concursos/ENEM.' },

  // 10 DE TECH / BUSINESS
  { id: 'arch', cat: 'Dev', name: 'Senior Architect', icon: <Code />, prompt: 'Foco em SOLID, Design Patterns e Clean Code.' },
  { id: 'db', cat: 'Dev', name: 'Database Wizard', icon: <Database />, prompt: 'Otimização de SQL e modelagem de dados.' },
  { id: 'sec', cat: 'Dev', name: 'Cyber Hunter', icon: <Shield />, prompt: 'Foco em PenTesting e segurança OWASP.' },
  { id: 'front', cat: 'Dev', name: 'Frontend Master', icon: <Monitor />, prompt: 'Especialista em React, Next.js e UX.' },
  { id: 'python', cat: 'Dev', name: 'Data Scientist', icon: <FlaskConical />, prompt: 'Análise de dados com Pandas e Machine Learning.' },
  { id: 'devops', cat: 'Dev', name: 'DevOps Guru', icon: <RefreshCw />, prompt: 'Pipelines CI/CD, Docker e Kubernetes.' },
  { id: 'seo', cat: 'Business', name: 'SEO Strategist', icon: <Search />, prompt: 'Otimização de ranking e autoridade de domínio.' },
  { id: 'copy', cat: 'Business', name: 'Copywriter VSL', icon: <PenTool />, prompt: 'Scripts de vendas com gatilhos mentais.' },
  { id: 'finance', cat: 'Business', name: 'Financial Analyst', icon: <Wallet />, prompt: 'Análise de ROI, EBITDA e fluxo de caixa.' },
  { id: 'growth', cat: 'Business', name: 'Growth Hacker', icon: <Rocket />, prompt: 'Estratégias de escala e retenção de usuários.' }
];

export default function VilorAI() {
  const [chats, setChats] = useState<any[]>([]);
  const [customAgents, setCustomAgents] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', cat: '', prompt: '' });
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [timer, setTimer] = useState(1500);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vilor_custom_v1');
    if (saved) {
      const d = JSON.parse(saved);
      setChats(d.chats || []); setCustomAgents(d.customAgents || []); setTodos(d.todos || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vilor_custom_v1', JSON.stringify({ chats, customAgents, todos }));
  }, [chats, customAgents, todos]);

  useEffect(() => {
    let int: any;
    if (isTimerActive && timer > 0) int = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(int);
  }, [isTimerActive, timer]);

  const startChat = (agent: any) => {
    const id = Date.now().toString();
    setChats([{ id, title: agent.name, messages: [], systemPrompt: agent.prompt }, ...chats]);
    setActiveId(id); setShowTools(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeId) return;
    const msg = input; setInput(''); setLoading(true);
    const activeChat = chats.find(c => c.id === activeId);
    const updatedMsgs = [...(activeChat?.messages || []), { role: 'user', content: msg }];
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: updatedMsgs } : c));

    const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: updatedMsgs, systemPrompt: activeChat?.systemPrompt }) });
    const data = await res.json();
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, { role: 'assistant', content: data.content }] } : c));
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '300px', background: '#050505', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setShowTools(true)} style={{ width: '100%', padding: '12px', background: '#3b82f6', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} /> AGENTES & CUSTOM
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          <h4 style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '2px', marginBottom: '15px' }}>TAREFAS</h4>
          {todos.map(t => (
            <div key={t.id} onClick={() => setTodos(todos.map(x => x.id === t.id ? {...x, done: !x.done} : x))} style={{ display: 'flex', gap: '10px', marginBottom: '8px', cursor: 'pointer', opacity: t.done ? 0.3 : 1, fontSize: '0.8rem' }}>
              <CheckCircle2 size={14} color={t.done ? '#10b981' : '#333'} />
              <span>{t.text}</span>
            </div>
          ))}
          <input onKeyDown={(e: any) => e.key === 'Enter' && (setTodos([{id: Date.now(), text: e.target.value, done: false}, ...todos]), e.target.value = '')} placeholder="+ Adicionar tarefa..." style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.75rem', outline: 'none', width: '100%' }} />

          <h4 style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '2px', margin: '25px 0 15px' }}>HISTÓRICO</h4>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '8px', background: activeId === c.id ? '#111' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.75rem' }}>
              <span>{c.title}</span>
              <Trash2 size={12} onClick={() => setChats(chats.filter(x => x.id !== c.id))} />
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* MODAL AGENTES */}
        <AnimatePresence>
          {showTools && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 100, padding: '40px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h2 style={{ fontWeight: 900 }}>MATRIZ DE AGENTES</h2>
                  <X size={30} onClick={() => setShowTools(false)} cursor="pointer" />
                </div>

                {/* CRIAR AGENTE */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #222', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Criar Agente Personalizado</h3>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input placeholder="Nome" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} style={{ background: '#111', border: 'none', padding: '10px', borderRadius: '8px', color: '#fff', flex: 1 }} />
                    <input placeholder="Categoria" value={newAgent.cat} onChange={e => setNewAgent({...newAgent, cat: e.target.value})} style={{ background: '#111', border: 'none', padding: '10px', borderRadius: '8px', color: '#fff', flex: 1 }} />
                  </div>
                  <textarea placeholder="Prompt de Sistema (O que ele deve ser?)" value={newAgent.prompt} onChange={e => setNewAgent({...newAgent, prompt: e.target.value})} style={{ width: '100%', background: '#111', border: 'none', padding: '10px', borderRadius: '8px', color: '#fff', minHeight: '80px', marginBottom: '10px' }} />
                  <button onClick={() => { setCustomAgents([...customAgents, { ...newAgent, id: Date.now().toString(), icon: <User /> }]); setNewAgent({name:'', cat:'', prompt:''}); }} style={{ background: '#3b82f6', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Agente</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                  {[...DEFAULT_AGENTS, ...customAgents].map(a => (
                    <div key={a.id} onClick={() => startChat(a)} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #111', cursor: 'pointer' }}>
                      <div style={{ color: '#3b82f6', marginBottom: '10px' }}>{a.icon}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{a.name}</div>
                      <div style={{ fontSize: '0.6rem', color: '#444' }}>{a.cat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header style={{ height: '60px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, letterSpacing: '2px' }}>VILORAI</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#0a0a0a', padding: '5px 15px', borderRadius: '15px' }}>
            <span style={{ fontFamily: 'monospace' }}>{Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</span>
            {isTimerActive ? <Pause size={14} onClick={() => setIsTimerActive(false)} cursor="pointer"/> : <Play size={14} onClick={() => setIsTimerActive(true)} cursor="pointer"/>}
            <RotateCcw size={14} onClick={() => setTimer(1500)} cursor="pointer" />
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {chats.find(c => c.id === activeId)?.messages.map((m: any, i: number) => (
              <div key={i} style={{ marginBottom: '25px', display: 'flex', gap: '15px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ background: '#050505', padding: '15px', borderRadius: '12px', border: '1px solid #111', maxWidth: '85%', fontSize: '0.9rem' }}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0a0a0a', borderRadius: '15px', border: '1px solid #222', display: 'flex', padding: '10px 15px' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Envie sua mensagem..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none' }} rows={1} />
            <button onClick={handleSend} style={{ background: '#3b82f6', border: 'none', borderRadius: '10px', width: '35px', height: '35px', cursor: 'pointer' }}><ChevronRight size={18} color="#fff" /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
