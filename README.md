<div align="center">

# 🌌 3 Body Agents

### *"The universe is a dark forest."*

**A multi-agent AI research swarm powered by Groq, ScaleDown & Llama 4 Maverick**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-f55036?style=flat-square)](https://groq.com)
[![ScaleDown](https://img.shields.io/badge/ScaleDown-Compression-8b5cf6?style=flat-square)](https://scaledown.ai)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## What is this?

3 Body Agents is a collaborative multi-agent research system. Give it a topic and watch four specialized AI agents work together — planning, researching, analyzing, and writing — to produce a comprehensive research report you can **download as a Word document**.

The analyst phase uses the **ScaleDown API** to compress raw research data before LLM synthesis, optimizing token usage and reducing costs. The generation is powered by **Groq's LPU inference** running Llama 4 Maverick.

## The Swarm

| Agent | Role | What it does |
|-------|------|-------------|
| 🧠 **Trisolaran Lead** | Manager | Breaks down your topic into 3 key research questions |
| 🔍 **Data Scout** | Researcher | Investigates each question with detailed, fact-heavy answers |
| 🔬 **Context Synthesizer** | Analyst | Compresses data via ScaleDown API, then synthesizes key insights |
| ✍️ **Scribe** | Writer | Compiles everything into a polished markdown report |

## How it works

```
[Your Topic] → Manager (plan) → Researcher (gather) → Analyst (ScaleDown compress + synthesize) → Writer (report) → Download .docx
```

## Features

- **Multi-agent pipeline** — 4 specialized AI agents working in sequence
- **ScaleDown compression** — raw research data is compressed before analysis to save tokens
- **Real-time logs** — watch each agent's thought process as it works
- **Word export** — download the final report as a `.docx` file with one click
- **In-app API key** — paste your Groq key directly in the UI, no `.env` needed

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

1. **In-app (easiest):** Paste your Groq key into the input bar at the top of the page
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
- **AI Inference:** Groq API with Llama 4 Maverick (`meta-llama/llama-4-maverick-17b-128e-instruct`)
- **Prompt Compression:** ScaleDown API
- **Word Export:** Pure JS `.docx` generator (zero dependencies)
- **Icons:** Lucide React

## Project Structure

```
├── App.tsx                     # Main app — agent pipeline orchestration
├── constants.tsx               # Agent definitions
├── types.ts                    # TypeScript types
├── index.html                  # Entry point with Tailwind config
├── components/
│   ├── AgentCard.tsx           # Individual agent status card
│   └── ResearchLog.tsx         # Real-time operation log viewer
└── services/
    ├── groqService.ts          # Groq LLM API client
    ├── scaledownService.ts     # ScaleDown prompt compression client
    └── wordExport.ts           # .docx file generator
```

## License

MIT

---

<div align="center">
<sub>Inspired by <i>The Three-Body Problem</i> by Liu Cixin</sub>
</div>
