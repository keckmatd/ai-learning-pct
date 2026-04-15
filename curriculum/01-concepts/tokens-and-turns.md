# Tokens & Turns

**Time**: 5 minutes

---

## Connect to Experience

> "When you type in ChatGPT, you're having a conversation. But the AI doesn't see words the way you do."

---

## The Reveal: Tokens

**Tokens are word-pieces, not words.**

```
"Hello, how are you today?" 

Human sees: 5 words
AI sees:    ["Hello", ",", " how", " are", " you", " today", "?"]
            = 7 tokens
```

**Why this matters:**
- Costs are per-token (you pay for punctuation)
- Limits are in tokens (not words or characters)
- Some words = multiple tokens ("unbelievable" = 3 tokens)

**Quick demo** (if time): 
- OpenAI tokenizer: https://platform.openai.com/tokenizer
- Type a sentence, see how it splits

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

---

## Practical Implication

> "Every message you send includes the ENTIRE conversation. AI doesn't remember - it re-reads."

This is why:
- Starting fresh chats can help when AI gets "confused"
- Very long conversations start losing early context
- Being concise saves money and keeps context clear

---

## Check for Understanding

Quick poll:
- "If you send 50 messages back and forth, how many times has the AI read your first message?"
- Answer: 50 times (every turn re-sends history)

---

## Transition

> "So AI sees word-pieces and re-reads everything each turn. But there's a limit to how much it can re-read..."
