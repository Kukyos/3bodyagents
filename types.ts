export type AgentRole = 'manager' | 'researcher' | 'analyst' | 'writer';

export interface Agent {
  id: AgentRole;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface LogEntry {
  id: string;
  agentId: AgentRole;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'error' | 'thought';
}

export interface ResearchState {
  status: 'idle' | 'planning' | 'researching' | 'analyzing' | 'writing' | 'completed' | 'error';
  topic: string;
  plan: string[];
  findings: string[];
  compressedContext: string;
  finalReport: string;
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
