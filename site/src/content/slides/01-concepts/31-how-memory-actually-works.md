---
title: "How \"Memory\" Actually Works"
part: 1
order: 31
layout: "code"
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

**Managed by:**
- The platform (ChatGPT Memory settings)
- You explicitly ("Remember that I...")
- AI inferring and saving