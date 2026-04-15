---
title: "The Two Modes"
part: 1
order: 11
layout: "code"
sourceFile: "llm-vs-rag"
---

## The Two Modes

### LLM: "I learned this during training"

```
You: "What's the capital of France?"
AI:  "Paris" ← Knows this from training data

You: "Write me a poem about spring"  
AI:  [generates from patterns learned] ← Creative synthesis
```

**LLM = the brain.** Trained on internet-scale text, holds compressed knowledge.

**Limitations:**
- Knowledge cutoff date (doesn't know recent events)
- Can hallucinate (confidently wrong)
- No access to YOUR data