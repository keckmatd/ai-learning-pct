---
title: "How \"Memory\" Actually Works"
part: 1
order: 31
layout: "code"
sourceFile: "memory-persistence"
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