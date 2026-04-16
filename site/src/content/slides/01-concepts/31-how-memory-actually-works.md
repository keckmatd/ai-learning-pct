---
title: "How \"Memory\" Actually Works"
part: 1
order: 31
layout: "diagram"
sourceFile: "memory-persistence"
---

## How "Memory" Actually Works

### Browser AI Memory (ChatGPT, Gemini)

```mermaid
flowchart TD
    subgraph SI["📋 System Instructions"]
        B["Base persona +<br/>YOUR SAVED PREFERENCES"]
        P1["<i>'User prefers bullet points'</i>"]
        P2["<i>'User works in insurance'</i>"]
        P3["<i>'User's name is Matt'</i>"]
    end
    SI -->|"Injected every session"| S["💬 New Session"]
```

**It's just text** prepended to every conversation.

```
Memory ≠ Remembering
Memory = Reading your preferences from storage every time
```

**Implications:**
- Memory competes with context window space — the more "memory," the less room for conversation
- You can (and should) edit/curate what's stored
- **Projects / Gems / Custom Instructions** are the same mechanism, just scoped to one workspace instead of everywhere
