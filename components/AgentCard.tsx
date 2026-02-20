import React from 'react';
import { Agent } from '../types';
import { BrainCircuit, Search, Microscope, PenTool, Activity } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  isWorking: boolean;
}

const IconMap = {
  BrainCircuit,
  Search,
  Microscope,
  PenTool
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, isWorking }) => {
  // @ts-ignore - Lucide icons map dynamically
  const IconComponent = IconMap[agent.icon] || BrainCircuit;

  return (
    <div 
      className={`
        relative p-4 rounded-xl border transition-all duration-300 overflow-hidden
        ${isActive 
          ? `border-${agent.color.split('-')[1]}-500/50 bg-surface shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]` 
          : 'border-border/50 bg-surface/30 opacity-60'}
      `}
    >
      {isActive && isWorking && (
        <div className={`absolute inset-0 bg-${agent.color.split('-')[1]}-500/5 animate-pulse-slow`} />
      )}
      
      <div className="relative z-10 flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-background/50 border border-white/5 ${isActive ? agent.color : 'text-gray-500'}`}>
          <IconComponent size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-sm tracking-wide ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {agent.name}
            </h3>
            {isActive && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/50 border border-white/5 text-[10px] uppercase tracking-wider text-white/70">
                {isWorking && <Activity size={10} className="animate-spin" />}
                {isWorking ? 'Active' : 'Ready'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {agent.description}
          </p>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      {isActive && (
        <div className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-${agent.color.split('-')[1]}-500 to-transparent opacity-50`} />
      )}
    </div>
  );
};
