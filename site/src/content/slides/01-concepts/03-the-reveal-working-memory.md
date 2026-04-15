---
title: "The Reveal: Working Memory"
part: 1
order: 3
layout: "code"
sourceFile: "context-windows"
---

## The Reveal: Working Memory

**The context window is the AI's "desk" - everything must fit on it.**

```
┌─────────────────────────────────────────────┐
│           CONTEXT WINDOW (the desk)         │
│                                             │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │   System    │  │   Conversation       │  │
│  │   Prompt    │  │   History            │  │
│  │             │  │                      │  │
│  │  (rules,    │  │  User: ...           │  │
│  │   persona)  │  │  AI: ...             │  │
│  │             │  │  User: ...           │  │
│  └─────────────┘  └──────────────────────┘  │
│                                             │
│         EVERYTHING MUST FIT HERE            │
└─────────────────────────────────────────────┘
```

**Window sizes** (as of 2024-2025):
- GPT-4: ~128K tokens (~300 pages of text)
- Claude: ~200K tokens (~500 pages)
- Gemini: up to 1M tokens (but quality degrades)