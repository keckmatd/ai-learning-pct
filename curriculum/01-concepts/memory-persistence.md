# Memory & Persistence

**Time**: 5 minutes

---

## Connect to Experience

> "ChatGPT has a 'Memory' feature now. Gemini has 'Saved Info.' What's actually happening?"

---

## The Uncomfortable Truth

**AI has no real memory. Every conversation starts from zero.**

```
Monday:   You: "I prefer bullet points over paragraphs"
          AI: "Got it, I'll use bullet points!"
          [Session ends - AI forgets EVERYTHING]

Tuesday:  AI: [Has no idea you prefer bullet points]
```

---

## How "Memory" Actually Works

### Browser AI Memory (ChatGPT, Gemini)

```
┌─────────────────────────────────────────┐
│           System Instructions           │
│                                         │
│  Base persona + YOUR SAVED PREFERENCES  │
│                                         │
│  "User prefers bullet points"           │
│  "User works in insurance"              │
│  "User's name is Matt"                  │
│                                         │
└─────────────────────────────────────────┘
                    ↓
          Injected every session
```

**It's just text** prepended to every conversation.

**Managed by:**
- The platform (ChatGPT Memory settings)
- You explicitly ("Remember that I...")
- AI inferring and saving

---

### What This Means

**"Memory" is really: things written to a file and re-read each session**

```
Memory ≠ Remembering
Memory = Reading your preferences from storage every time
```

**Implications:**
- Memory competes with context window space
- You can (and should) edit/curate your memory
- The more "memory," the less room for conversation

---

## Projects & Custom Instructions

**ChatGPT Projects / Gemini Gems / Claude Projects:**

Same concept, scoped differently:
- **Personal memory**: applies everywhere
- **Project context**: applies to specific work

```
Project: "Q4 Planning"
├── Custom instructions for this project
├── Uploaded reference files
└── Conversation history within project
```

---

## The Key Insight

> "Persistence isn't magic - it's files. Text that gets loaded into context."

**Browser AI:** Platform manages this for you (opaquely)
**CLI AI:** YOU manage this (transparently)

This is why CLI is powerful - you control what persists and how.

---

## Preview: What We'll Build

In Part 3, you'll see:
- `instructions.md` / `CLAUDE.md` - your persistent context
- Project-specific instructions that load automatically
- Harness systems that manage memory explicitly

> "Instead of hoping the AI remembers, you TELL it what to remember."

---

## Check for Understanding

> "If ChatGPT 'remembers' your name, where is that stored?"

Answer: In a text file/database on their servers, injected into system prompt each session.

> "What happens to that memory if you hit context limits?"

Answer: It competes with conversation - something has to give.

---

## Transition

> "So memory is really 'files that get re-read.' But there's one more superpower - AI can DO things, not just talk..."
