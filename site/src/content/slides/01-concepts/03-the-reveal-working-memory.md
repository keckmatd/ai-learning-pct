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

**Window sizes** (current, 2026):
- GPT-4o: ~128K tokens (~300 pages of text)
- Claude 4.6: ~1M tokens (~2,000 pages)
- Gemini: up to 2M tokens (but quality degrades)