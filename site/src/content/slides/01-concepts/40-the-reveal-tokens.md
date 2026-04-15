---
title: "The Reveal: Tokens"
part: 1
order: 40
layout: "split"
sourceFile: "tokens-and-turns"
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