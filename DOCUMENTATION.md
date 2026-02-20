# 3 Body Agents – Full Documentation

## Overview

3 Body Agents is a multi‑agent research workflow built with React, TypeScript, and Vite. You give it a research topic and it orchestrates four AI "agents" (Manager, Researcher, Analyst, Writer) to:

1. Break the topic into key questions
2. Gather detailed, fact‑heavy findings
3. Compress and analyze the findings using ScaleDown
4. Generate a polished markdown report you can download as a `.docx` file

The system uses:
- **Groq API** with the model `meta-llama/llama-4-maverick-17b-128e-instruct`
- **ScaleDown API** for prompt compression
- **Client-side Word export** for `.docx` reports

---

## Project Structure

```text
├── App.tsx                     # Main UI + multi-agent orchestration
├── constants.tsx               # Agent metadata (names, colors, descriptions)
├── index.html                  # HTML shell + Tailwind CDN config
├── index.tsx                   # React root entry
├── types.ts                    # Shared TypeScript types (agents, logs, Groq)
├── vite.config.ts              # Vite config + env injection for GROQ_API_KEY
├── services/
│   ├── groqService.ts          # Wrapper for Groq chat completions API
│   ├── scaledownService.ts     # Wrapper for ScaleDown compression API
│   └── wordExport.ts           # Utility to export markdown as .docx
└── components/
    ├── AgentCard.tsx           # Visual status card for each agent
    └── ResearchLog.tsx         # Streaming log of agent actions
```

---

## Installation & Local Development

### Prerequisites

- Node.js 18+ (recommended)
- npm (comes with Node)

### Steps

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

By default Vite will run at `http://localhost:3000` (see `vite.config.ts`).

Open that URL in your browser.

---

## Environment Variables

The app can use a Groq API key in two ways:

### 1. In-app key (recommended for local dev)

In `App.tsx`, the header contains a "Groq API Key" input. If you paste a key there, it is passed down into `groqService.ts` for all requests.

- Field placeholder: `gsk_...`
- State: `groqApiKey` in `App.tsx`

You do **not** need a `.env` file for local testing if you use this input.

### 2. `GROQ_API_KEY` env var

If you don't enter a key in the UI, the app falls back to `process.env.GROQ_API_KEY`.

- The Vite config (`vite.config.ts`) loads env variables and defines:
  - `process.env.GROQ_API_KEY` at build time
- `groqService.ts` resolves the key as:
  - `const key = apiKey || process.env.GROQ_API_KEY;`

You can define a `.env` file at the project root:

```dotenv
GROQ_API_KEY=your_groq_api_key_here
```

> Important: `.env` is **not** deployed automatically to Vercel. For production, set environment variables in the Vercel dashboard (see below).

### ScaleDown API Key

The ScaleDown key is currently hardcoded in `services/scaledownService.ts` as `SCALEDOWN_API_KEY`. There is no `.env` variable used for this in the current implementation.

If you want to change this behavior in the future, you can refactor `scaledownService.ts` to read from an environment variable similar to `GROQ_API_KEY`.

---

## Running in Production (Vercel)

When you import this repo into Vercel, use these settings:

- **Framework Preset:** Vite
- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Required Environment Variables on Vercel

In your Vercel project settings under **Environment Variables** add:

- `GROQ_API_KEY` – your Groq API key

This will be injected at build time via `vite.config.ts` so that `process.env.GROQ_API_KEY` is defined in the client bundle. Users can still paste their own key in the UI if you leave that feature enabled.

> Note: If you do **not** set `GROQ_API_KEY` on Vercel, the app will require users to provide their own key via the input bar. If neither is set, the app logs an error and stops before making API calls.

---

## Multi-Agent Pipeline

The main orchestration happens in `App.tsx` inside the `runResearch` function.

### 1. Input & Validation

- User enters a research topic in the "Research Objective" textarea.
- On **Start Research**:
  - If the query is empty, nothing happens.
  - If no Groq key is available (neither input state nor `process.env.GROQ_API_KEY`), an error log is added and execution stops.

### 2. Manager – Planning Phase

- Active agent: `manager`
- Prompt (`planPrompt`):
  - Asks Groq to produce **exactly 3 key questions** about the topic as a numbered list.
- Response handling:
  - Splits on newlines and takes the first 3 lines as the plan.
  - Updates `state.plan` and logs the plan.

### 3. Researcher – Data Gathering

- Active agent: `researcher`
- For each question in the plan:
  - Constructs a `researchPrompt` that instructs the model to answer with detailed, fact‑heavy content.
  - Calls `callGroqAgent` with temperature `0.7`.
  - Appends `QUESTION: ...` and `FINDING: ...` to a `findings` array.
  - Adds success logs per question.
- After all questions:
  - Updates `state.findings` and moves to status `analyzing`.

### 4. Analyst – Compression & Synthesis

- Active agent: `analyst`
- Concatenates all findings into `rawFindings`.
- Calls `compressPrompt` from `scaledownService.ts`:
  - Endpoint: `https://api.scaledown.xyz/compress/raw/`
  - Payload includes `context`, `prompt`, `model` (default `gemini-2.5-flash`), and a `scaledown` config.
- Receives:
  - `compressed`: compressed string
  - `savedTokens`: estimated token savings
- Logs token savings (if reported) and then calls Groq again with `analysisPrompt` to synthesize a compressed high‑density context.
- Updates `state.compressedContext` and moves to status `writing`.

### 5. Writer – Final Report

- Active agent: `writer`
- Constructs `writePrompt` with:
  - Topic
  - Compressed context
  - Instructions to output a well‑structured **Markdown** report using headings and bullet points.
- Calls `callGroqAgent` with temperature `0.5` for a more deterministic style.
- Sets `state.finalReport` and status `completed`.

### 6. Word Export

- When a final report exists, the UI shows a **"Download .docx"** button.
- Clicking it calls `handleDownloadWord`, which:
  - Sanitizes the topic into a safe filename.
  - Calls `downloadAsWord` from `wordExport.ts` with the report markdown and filename.

---

## Logging & UI Behavior

- Logs are stored in `logs` state as `LogEntry` objects.
- `addLog` is a memoized callback that pushes entries with:
  - `agentId` (one of `manager`, `researcher`, `analyst`, `writer`)
  - `message`
  - `timestamp`
  - `type` (`info`, `success`, `error`, `thought`)
- `ResearchLog` renders these entries with styling based on type.
- `AgentCard` uses `AGENTS` from `constants.tsx` to show:
  - Agent name, description, and icon
  - Active/working state highlighted when `activeAgent` matches.

---

## Error Handling

- Missing Groq key:
  - `runResearch` logs an error via `addLog` and returns early.
- Groq API errors:
  - `groqService.ts` checks `response.ok` and, if false, reads the error JSON and throws a new `Error` with `Groq API Error: ...`.
  - Caught in `runResearch` and logged as `CRITICAL FAILURE` by the manager.
- Any other thrown error in the pipeline also sets `state.status` to `error`.

---

## Customization Tips

- **Change model:**
  - Update `MODEL_ID` in `services/groqService.ts`.
- **Adjust creativity:**
  - Tweak the `temperature` values passed into `callGroqAgent` in `App.tsx`.
- **Change number of questions:**
  - Edit the planning prompt and parsing logic in the Manager phase.
- **Refactor ScaleDown key to env:**
  - Replace the constant `SCALEDOWN_API_KEY` in `scaledownService.ts` with `process.env.SCALEDOWN_API_KEY` and wire it through `vite.config.ts` similar to `GROQ_API_KEY`.

---

## Deployment Checklist

- [ ] Repo pushed to Git provider (e.g., GitHub)
- [ ] Vercel project created and linked to repo
- [ ] Build command set to `vite build`
- [ ] Output directory set to `dist`
- [ ] Environment variable `GROQ_API_KEY` set in Vercel
- [ ] (Optional) Domain configured in Vercel

Once deployed, you can:
- Use the global `GROQ_API_KEY` you configured, **or**
- Let users paste their own key in the UI for isolation.
