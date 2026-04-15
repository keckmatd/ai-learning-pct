# MCP & Tool Use

**Time**: 5 minutes

---

## Connect to Experience

> "Have you noticed ChatGPT can now browse the web? Create images? Run code? That's tool use."

---

## The Shift: From Talking to Doing

**Old AI:** Input text → Output text

**Modern AI:** Input text → DECIDE to use tools → Output text + actions

```
You: "What's the weather in Columbus?"

WITHOUT tools:
  AI: "I don't have access to current weather data..."

WITH tools:
  AI: [Calls weather API] → "It's 72°F and sunny in Columbus"
```

---

## How Tool Use Works

```
┌─────────────────────────────────────────┐
│              AI Model                   │
│                                         │
│   "I need current weather data..."      │
│   "I should call the weather tool"      │
│                                         │
│   → Outputs: tool_call(weather, loc)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Tool Execution                │
│                                         │
│   weather_api.get("Columbus, OH")       │
│   → Returns: {temp: 72, condition: sun} │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              AI Model                   │
│                                         │
│   [Sees tool result in context]         │
│   → Generates human-friendly response   │
└─────────────────────────────────────────┘
```

**The AI doesn't execute tools** - it asks to use them, something else executes, result comes back.

---

## MCP: Model Context Protocol

**MCP standardizes how AI connects to tools.**

Think of it like USB for AI:
- Before USB: every device had different connectors
- After USB: standard plug, everything works

**Before MCP:** Every AI platform had custom tool integrations
**With MCP:** Standard protocol, tools work across platforms

---

## Why MCP Matters to You

### For Browser Users
- ChatGPT plugins, Gemini extensions = early tool ecosystems
- Limited to what the platform offers

### For CLI Users (where we're going)
- YOU decide what tools are available
- Connect to your systems: files, databases, APIs
- The harness manages tool access

```
CLI AI + MCP:
├── File system tools (read/write your actual files)
├── Git tools (commit, branch, PR)
├── Browser tools (research, scrape)
├── Custom tools YOU build
└── Whatever you need
```

---

## The Power Unlock

> "AI that can only talk is a chatbot. AI that can DO things is an assistant."

**Examples of tool-enabled AI:**
- Read your codebase, make changes, run tests
- Search internal docs, synthesize answers
- Create presentations from templates
- Execute shell commands

**This is why CLI > browser** - full tool access to YOUR machine.

---

## Check for Understanding

> "When ChatGPT creates an image, is that the AI drawing?"

Answer: No - AI calls DALL-E tool, which creates the image, result comes back.

> "Why might a company want custom MCP tools?"

Answer: Connect AI to internal systems - CRM, docs, databases - things public AI can't access.

---

## Part 1 Recap

You now understand:
1. **Tokens** - AI sees word-pieces
2. **Turns** - No real memory, re-reads everything
3. **Context Windows** - Limited "desk space"
4. **LLM vs RAG** - Knows vs looks up
5. **Memory** - Really just files being re-read
6. **Tools/MCP** - AI can DO things, not just talk

---

## The Big Transition

> "Now you understand the machinery. Browser AI manages all this for you - mostly hidden, somewhat limited."

> "CLI AI puts YOU in control. You manage context. You choose tools. You build systems."

> "Let's talk about what that looks like..."
