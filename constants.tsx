import { Agent } from './types';
import { BrainCircuit, Search, Microscope, PenTool } from 'lucide-react';
import React from 'react';

export const AGENTS: Record<string, Agent> = {
  manager: {
    id: 'manager',
    name: 'Trisolaran Lead',
    description: 'Orchestrates the workflow and breaks down complex tasks.',
    color: 'text-blue-400',
    icon: 'BrainCircuit'
  },
  researcher: {
    id: 'researcher',
    name: 'Data Scout',
    description: 'Gathers raw information and detailed facts.',
    color: 'text-emerald-400',
    icon: 'Search'
  },
  analyst: {
    id: 'analyst',
    name: 'Context Synthesizer',
    description: 'Uses ScaleDown API to compress data, then synthesizes key insights.',
    color: 'text-purple-400',
    icon: 'Microscope'
  },
  writer: {
    id: 'writer',
    name: 'Scribe',
    description: 'Compiles compressed insights into the final report.',
    color: 'text-amber-400',
    icon: 'PenTool'
  }
};

export const INITIAL_LOG_MESSAGE = "System initialized. Ready for research assignment.";
