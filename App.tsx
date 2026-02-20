import React, { useState, useCallback } from 'react';
import { AgentCard } from './components/AgentCard';
import { ResearchLog } from './components/ResearchLog';
import { AgentRole, LogEntry, ResearchState } from './types';
import { AGENTS } from './constants';
import { callGroqAgent } from './services/groqService';
import { Play, RotateCcw, StopCircle, FileText, BrainCircuit, KeyRound, Eye, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentRole | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  const [state, setState] = useState<ResearchState>({
    status: 'idle',
    topic: '',
    plan: [],
    findings: [],
    compressedContext: '',
    finalReport: ''
  });

  const addLog = useCallback((agentId: AgentRole, message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      agentId,
      message,
      timestamp: Date.now(),
      type
    }]);
  }, []);

  const runResearch = async () => {
    if (!query.trim()) return;
    if (!groqApiKey.trim() && !process.env.GROQ_API_KEY) {
      addLog('manager', 'No Groq API key found. Please enter your key in the top bar.', 'error');
      return;
    }
    
    setIsProcessing(true);
    setState({
      status: 'planning',
      topic: query,
      plan: [],
      findings: [],
      compressedContext: '',
      finalReport: ''
    });
    setLogs([]);
    addLog('manager', `Initializing research sequence for topic: "${query}"`, 'info');

    try {
      // 1. PLANNING PHASE (Manager)
      setActiveAgent('manager');
      addLog('manager', 'Breaking down research topic into sub-tasks...', 'thought');
      
      const planPrompt = `
        You are the Research Manager. The user wants to research: "${query}".
        Create a concise plan with exactly 3 distinct key questions that need to be answered to cover this topic comprehensively.
        Format: Just return the 3 questions as a numbered list.
      `;
      
      const planResponse = await callGroqAgent([{ role: 'user', content: planPrompt }], 0.7, groqApiKey || undefined);
      const plan = planResponse.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
      
      setState(prev => ({ ...prev, status: 'researching', plan }));
      addLog('manager', `Research Plan created:\n${plan.join('\n')}`, 'success');

      // 2. RESEARCH PHASE (Researcher)
      setActiveAgent('researcher');
      const findings: string[] = [];
      
      for (const question of plan) {
        addLog('researcher', `Investigating: ${question}`, 'thought');
        const researchPrompt = `
          You are an Expert Researcher.
          Question: "${question}"
          Context: The main topic is "${query}".
          Provide a detailed, fact-heavy answer based on your knowledge. Focus on concrete data and details.
        `;
        const finding = await callGroqAgent([{ role: 'user', content: researchPrompt }], 0.7, groqApiKey || undefined);
        findings.push(`QUESTION: ${question}\nFINDING: ${finding}`);
        addLog('researcher', `Data acquired for: ${question.substring(0, 40)}...`, 'success');
      }
      
      setState(prev => ({ ...prev, status: 'analyzing', findings }));

      // 3. ANALYSIS & COMPRESSION PHASE (Analyst)
      setActiveAgent('analyst');
      addLog('analyst', 'Synthesizing raw data and compressing context to reduce token usage...', 'thought');
      
      const analysisPrompt = `
        You are a Senior Data Analyst.
        Here is the raw research data:
        ${findings.join('\n\n')}
        
        Task: Compress this information into a high-density summary. 
        Remove fluff, keep key facts, stats, and unique insights. 
        This summary will be passed to the writer to save context window space.
      `;
      
      const compressedContext = await callGroqAgent([{ role: 'user', content: analysisPrompt }], 0.7, groqApiKey || undefined);
      
      setState(prev => ({ ...prev, status: 'writing', compressedContext }));
      addLog('analyst', 'Context compressed successfully. Handing off to Writer.', 'success');

      // 4. WRITING PHASE (Writer)
      setActiveAgent('writer');
      addLog('writer', 'Drafting final report based on compressed context...', 'thought');
      
      const writePrompt = `
        You are a Professional Technical Writer.
        Using the following compressed research notes, write a comprehensive, well-structured final report.
        
        Topic: ${query}
        
        Compressed Notes:
        ${compressedContext}
        
        Format: Markdown. Use headers, bullet points, and a professional tone.
      `;
      
      const finalReport = await callGroqAgent([{ role: 'user', content: writePrompt }], 0.5, groqApiKey || undefined);
      
      setState(prev => ({ ...prev, status: 'completed', finalReport }));
      addLog('writer', 'Final report generated.', 'success');
      
    } catch (error: any) {
      addLog('manager', `CRITICAL FAILURE: ${error.message}`, 'error');
      setState(prev => ({ ...prev, status: 'error' }));
    } finally {
      setIsProcessing(false);
      setActiveAgent(null);
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      topic: '',
      plan: [],
      findings: [],
      compressedContext: '',
      finalReport: ''
    });
    setLogs([]);
    setQuery('');
  };

  return (
    <div className="h-screen bg-background text-gray-200 flex flex-col overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Header */}
      <header className="flex-none max-w-7xl w-full mx-auto px-6 py-5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface border border-white/10 shadow-sm">
                <BrainCircuit className="text-primary opacity-90" size={18} />
             </div>
             <div>
                <h1 className="text-lg font-medium text-white tracking-tight leading-none">
                   3 Body<span className="text-gray-400 font-normal"> Agents</span>
                </h1>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Model</span>
                <span className="text-xs font-mono text-gray-400">Llama-3-70b-Versatile</span>
             </div>
             <div className="w-[1px] h-6 bg-border/40"></div>
             <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface/50 border border-white/5">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wide">Online</span>
             </div>
          </div>
        </div>
      </header>

      {/* API Key Input Bar */}
      <div className="flex-none max-w-7xl w-full mx-auto px-6 py-3 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <KeyRound size={14} />
            <label className="text-[10px] uppercase tracking-wider font-bold">Groq API Key</label>
          </div>
          <div className="relative flex-1 max-w-md">
            <input
              type={showKey ? 'text' : 'password'}
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-300 placeholder-gray-600 pr-8"
              disabled={isProcessing}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          {groqApiKey && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-emerald-400 font-medium">Key Set</span>
            </div>
          )}
          {!groqApiKey && (
            <span className="text-[10px] text-gray-600 italic">Get yours at console.groq.com</span>
          )}
        </div>
      </div>

      {/* Main Content Area - Fills remaining height */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input and Agents (4 cols) - Scrollable if content overflows */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Input Area */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg flex-none">
            <label className="block text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Research Objective</label>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Future of solid state batteries in EVs' or 'Impact of AI on software engineering jobs'"
              className="w-full bg-background/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none h-28 text-gray-200 placeholder-gray-600"
              disabled={isProcessing}
            />
            
            <div className="mt-3 flex gap-2">
              <button 
                onClick={runResearch}
                disabled={isProcessing || !query.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 
                  ${isProcessing || !query.trim()
                    ? 'bg-border text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]'}`}
              >
                {isProcessing ? <StopCircle size={16} /> : <Play size={16} />}
                {isProcessing ? 'Processing...' : 'Start Research'}
              </button>
              
              {state.status !== 'idle' && !isProcessing && (
                 <button 
                  onClick={handleReset}
                  className="p-2.5 rounded-lg border border-border hover:bg-surface text-gray-400 hover:text-white transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Agents List */}
          <div className="space-y-3 flex-1">
            <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-1">Active Swarm</h2>
            {(Object.keys(AGENTS) as AgentRole[]).map((role) => (
              <AgentCard 
                key={role}
                agent={AGENTS[role]}
                isActive={activeAgent === role}
                isWorking={activeAgent === role && isProcessing}
              />
            ))}
          </div>

        </div>

        {/* Right Column: Logs and Output (8 cols) - Fixed parent height, internal flex scaling */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          
          {/* Logs Panel - Resizes based on state */}
          <div className={`transition-all duration-500 ease-in-out min-h-[150px] ${state.finalReport ? 'h-1/3' : 'h-full'}`}>
             <ResearchLog logs={logs} />
          </div>

          {/* Final Report Panel - Appears and fills remaining space */}
          {state.finalReport && (
            <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden shadow-2xl animate-fade-in flex flex-col min-h-0">
              <div className="flex-none px-5 py-3 border-b border-border bg-gradient-to-r from-surface to-background flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <FileText size={16} className="text-primary" />
                   <h2 className="font-semibold text-sm text-white">Final Report</h2>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Markdown Generated
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 prose prose-invert prose-sm max-w-none custom-scrollbar">
                 <div className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm">
                   {state.finalReport}
                 </div>
              </div>
            </div>
          )}

          {/* Empty State Placeholder when report is not ready but space is reserved (prevents jumpiness if needed, or just hidden) */}
          {!state.finalReport && state.status === 'idle' && (
            <div className="hidden lg:flex flex-1 items-center justify-center border border-border/30 rounded-xl bg-surface/10 border-dashed">
              <div className="text-center text-gray-600 max-w-sm">
                <BrainCircuit size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Initiate a query to activate the agent swarm.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;