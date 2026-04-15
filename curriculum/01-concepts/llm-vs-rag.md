# LLMs vs RAG

**Time**: 5 minutes

---

## Connect to Experience

> "Sometimes AI seems to 'know' things. Other times it 'looks things up.' These are fundamentally different."

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

---

## When Each Applies

| Situation | Mode | Why |
|-----------|------|-----|
| General knowledge | LLM | Already in training |
| Your company docs | RAG | Not in training data |
| Creative writing | LLM | Synthesis, not lookup |
| Specific facts from files | RAG | Need exact information |
| Recent news | RAG | After training cutoff |

---

## Why This Matters for Building

> "When you see 'AI features' in products, ask: is this LLM or RAG?"

**ChatGPT plugins, Copilot, etc.** - often RAG under the hood
- They search docs/code
- Inject relevant snippets into context
- AI responds with that context

**The quality depends on:**
- How good is the search/retrieval?
- Is the right information making it into context?

---

## The "Hallucination" Problem

**LLM without RAG**: AI might make things up
**LLM with good RAG**: AI answers from actual sources

> "RAG is how we ground AI in reality - give it sources to cite."

---

## Check for Understanding

> "If you ask ChatGPT about a document you uploaded, is that LLM or RAG?"

Answer: RAG - it retrieves from the document and adds to context.

> "If you ask it to explain a concept it learned during training?"

Answer: LLM - pure generation from learned patterns.

---

## Transition

> "So AI can know things from training and look things up via RAG. But what about remembering things YOU told it across sessions?"
