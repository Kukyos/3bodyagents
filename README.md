<div align="center">

# 🌌 3 Body Agents

### *"The universe is a dark forest."*

**A multi-agent AI research swarm powered by Groq & Llama 3 70B**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-f55036?style=flat-square)](https://groq.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## What is this?

3 Body Agents is a collaborative multi-agent research system. Give it a topic and watch four specialized AI agents work together in sequence — planning, researching, analyzing, and writing — to produce a comprehensive research report.

The agents use **compressed context sharing** to optimize token usage: raw research data gets synthesized into high-density summaries before being passed to the writer, so you get maximum output from minimal context window usage.

## The Swarm

| Agent | Role | What it does |
|-------|------|-------------|
| 🧠 **Trisolaran Lead** | Manager | Breaks down your topic into 3 key research questions |
| 🔍 **Data Scout** | Researcher | Investigates each question with detailed, fact-heavy answers |
| 🔬 **Context Synthesizer** | Analyst | Compresses raw findings into high-density summaries |
| ✍️ **Scribe** | Writer | Compiles everything into a polished markdown report |

## How it works

```
[Your Topic] → Manager (plan) → Researcher (gather) → Analyst (compress) → Writer (report)
```

Each agent calls Groq's lightning-fast LPU inference running **Llama 3 70B**, and you can watch the entire pipeline in real-time through the operation logs.

## Quick Start

**Prerequisites:** [Node.js](https://nodejs.org) (v18+)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/3-body-agents.git
cd 3-body-agents

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your Groq API key in the top bar.

### API Key

You have two options:

1. **In-app (easiest):** Paste your key into the input bar at the top of the page
2. **Environment variable:** Copy `.env.example` to `.env` and add your key:

```bash
cp .env.example .env
# Then edit .env with your key
```

Get a free Groq API key at **[console.groq.com](https://console.groq.com)**

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS (CDN)
- **AI:** Groq API with Llama 3 70B (`llama3-70b-8192`)
- **Icons:** Lucide React

## Project Structure

```
├── App.tsx              # Main app — agent pipeline orchestration
├── constants.tsx         # Agent definitions
├── types.ts             # TypeScript types
├── index.html           # Entry point with Tailwind config
├── components/
│   ├── AgentCard.tsx    # Individual agent status card
│   └── ResearchLog.tsx  # Real-time operation log viewer
└── services/
    └── groqService.ts   # Groq API client
```

## License

MIT

---

<div align="center">
<sub>Inspired by <i>The Three-Body Problem</i> by Liu Cixin</sub>
</div>
