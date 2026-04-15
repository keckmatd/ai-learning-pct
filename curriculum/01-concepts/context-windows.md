# Context Windows

**Time**: 5 minutes

---

## Connect to Experience

> "You've probably noticed that in really long ChatGPT conversations, the AI starts forgetting things from earlier. That's not a bug - it's a fundamental limit."

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

---

## What Happens When It's Full?

**Old messages get dropped** (truncated from the beginning)

```
Turn 1:  [Instructions][Msg 1]
Turn 5:  [Instructions][Msg 1][Msg 2][Msg 3][Msg 4][Msg 5]
Turn 20: [Instructions][Msg 12][Msg 13]...[Msg 20]
                       ↑
                  Msgs 1-11 are GONE
```

**This is why:**
- AI "forgets" things from early in long conversations
- Starting fresh can help when things get confused
- Important context should be repeated or put in system instructions

---

## Practical Implication

> "The context window is precious real estate. Everything competes for space."

**What takes up space:**
- System instructions (always there)
- Conversation history (grows each turn)
- Any files or documents you paste
- The AI's own responses

**Strategy**: Be intentional about what goes in. Concise > verbose.

---

## Quick Mental Model

Think of it like a whiteboard in a meeting room:
- You can write a lot on it
- But when it's full, you erase the oldest stuff
- The stuff at the top (system instructions) never gets erased
- Recent discussion stays, early discussion fades

---

## Check for Understanding

> "If you paste a 100-page document into ChatGPT and then have a 50-message conversation, what happens to the document?"

Answer: Parts of it get pushed out as conversation grows. The AI gradually "forgets" the document.

---

## Transition

> "So there's limited space, and the AI has to work with what fits. But what if the AI needs information that's NOT in the window?"
