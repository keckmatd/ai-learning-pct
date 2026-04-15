---
title: "RAG: \"Let me look that up\""
part: 1
order: 12
layout: "code"
sourceFile: "llm-vs-rag"
---

### RAG: "Let me look that up"

**RAG = Retrieval-Augmented Generation**

```
You: "What did our Q3 report say about revenue?"

Step 1: RETRIEVE - Search your documents for relevant chunks
Step 2: AUGMENT  - Add those chunks to the context window  
Step 3: GENERATE - AI answers using that context
```

```
┌─────────────────────────────────────────┐
│            Context Window               │
│                                         │
│  [System] + [Retrieved Q3 data] + [Q]   │
│                                         │
│  AI can now answer about YOUR revenue   │
└─────────────────────────────────────────┘
```

**RAG = external memory.** Brings in information at query time.