---
title: "The Reveal: Working Memory"
part: 1
order: 3
layout: "diagram"
sourceFile: "context-windows"
---

## The Reveal: Working Memory

**The context window is the AI's "desk" - everything must fit on it.**

```mermaid
flowchart TB
    subgraph CW["🖥️ CONTEXT WINDOW (the desk)"]
        direction LR
        S["📋 System Prompt<br/><i>rules, persona</i>"]
        H["💬 Conversation<br/>History<br/><i>User: ...<br/>AI: ...<br/>User: ...</i>"]
    end
    CW --> N["⚠️ EVERYTHING MUST FIT HERE"]
```

**Window sizes** (current, 2026):
- GPT-4o: ~128K tokens (~300 pages of text)
- Claude Opus 4.6: ~1M tokens (~2,000 pages)
- Gemini: up to 2M tokens (but quality degrades)