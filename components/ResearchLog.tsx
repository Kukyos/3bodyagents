import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { AGENTS } from '../constants';

interface ResearchLogProps {
  logs: LogEntry[];
}

export const ResearchLog: React.FC<ResearchLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-surface/30 rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-border/50 bg-surface/50 flex items-center justify-between">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Operation Logs</h3>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scroll-smooth">
        {logs.length === 0 && (
          <div className="text-gray-600 text-center py-10 italic">
            Waiting for initialization...
          </div>
        )}
        
        {logs.map((log) => {
          const agent = AGENTS[log.agentId];
          return (
            <div key={log.id} className="animate-fade-in group flex gap-3 items-start">
              <div className="min-w-[70px] pt-0.5">
                 <span className={`text-[10px] px-1.5 py-0.5 rounded border border-white/5 bg-white/5 ${agent.color}`}>
                   {agent.id.toUpperCase().slice(0, 3)}
                 </span>
              </div>
              <div className="flex-1 break-words">
                <span className="text-gray-500 text-[10px] mr-2">
                  {new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
                <p className={`${log.type === 'thought' ? 'text-gray-400 italic' : 'text-gray-200'}`}>
                  {log.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
