---
title: "The Reveal: Turns"
part: 1
order: 41
layout: "code"
sourceFile: "tokens-and-turns"
---

## The Reveal: Turns

**AI has no memory between messages. Every turn is a fresh start.**

```
Turn 1: You say "My name is Sarah"
        AI processes, responds, forgets

Turn 2: You say "What's my name?"
        AI has NO IDEA... unless...
```

**The trick**: The entire conversation history is re-sent every turn.

```
What AI actually receives on Turn 2:

[System instructions...]
User: My name is Sarah
Assistant: Nice to meet you, Sarah!
User: What's my name?
```

**Why this matters:**
- Long conversations = more tokens = more cost
- Context can be "lost" when history is truncated
- This is why AI sometimes "forgets" in long chats