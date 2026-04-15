# PCT Cabinet AI Workshop

## Session Overview

**Duration**: 90 minutes  
**Audience**: PCT cabinet members - familiar with ChatGPT/Gemini in browser, but haven't built with AI  
**Goal**: Understand how AI works under the hood, then get hands-on with a CLI harness

---

## Learning Arc

```
Browser AI User → Understands the machinery → CLI Builder
     |                    |                      |
  "I chat"         "I understand why"      "I build things"
```

---

## Session Flow

### Part 1: The Machinery [25 min]
*"What's actually happening when you chat with AI?"*

| Topic | Time | Key Takeaway |
|-------|------|--------------|
| Tokens & Turns | 5 min | AI sees word-pieces, not words; conversations are stateless |
| Context Windows | 5 min | AI has a "working memory" limit - everything must fit |
| LLMs vs RAG | 5 min | Generation vs retrieval - when AI "knows" vs "looks up" |
| Memory & Persistence | 5 min | How AI "remembers" across sessions (it doesn't, unless...) |
| MCP & Tool Use | 5 min | AI can call tools - that's what makes it powerful |

**Transition**: "So if AI forgets everything... how do we build anything real?"

### Part 2: Why CLI Changes Everything [20 min]
*"From chatting to building"*

| Topic | Time | Key Takeaway |
|-------|------|--------------|
| Browser vs CLI | 5 min | Web = conversation; CLI = workspace with file access |
| Session Management | 5 min | How to maintain context across work sessions |
| The Harness Concept | 5 min | Instructions files, project context, persistent memory |
| Best Practices | 5 min | What works, what doesn't - patterns from real use |

**Transition**: "Let's stop talking and start doing"

### Part 3: Hands-On with copilot-dotfiles [35 min]
*"Install it, use it, build something"*

| Activity | Time | Outcome |
|----------|------|---------|
| Install copilot-dotfiles | 10 min | Working harness on their machine |
| Cheatsheet walkthrough | 5 min | Know the commands and modes |
| Scripted exercise #1 | 10 min | Build a PowerPoint from template |
| Scripted exercise #2 | 10 min | Generate a research brief |

**Transition**: "That was scripted - here's what's possible when you build your own"

### Part 4: The Promise [10 min]
*"What you can build"*

| Demo | Time | Shows |
|------|------|-------|
| keck_companion ecosystem | 5 min | RAG, Obsidian integration, reply patterns |
| What's next for you | 5 min | Resources, how to get help, next steps |

---

## Materials Needed

- [ ] Slide deck (optional - can run from terminal)
- [ ] Cheatsheets (printed or digital)
- [ ] Pre-flight checklist for participants
- [ ] copilot-dotfiles repo access
- [ ] Example Nationwide templates
- [ ] Backup plan if installs fail

---

## Participant Pre-Work

Send 24 hours before:
1. Ensure GitHub Copilot CLI access
2. Have terminal ready (Windows Terminal, iTerm, etc.)
3. Clone copilot-dotfiles repo (or have git ready)

---

## Success Metrics

By end of session, participants can:
- [ ] Explain tokens, context windows, and RAG in plain English
- [ ] Describe why CLI AI differs from browser AI
- [ ] Run at least one harness command successfully
- [ ] Know where to go for help and next steps

---

## Facilitator Notes

**Pacing**: This is tight. If Part 1 concepts resonate quickly, bank time for Part 3 hands-on.

**Troubleshooting buffer**: Corporate machines may have install issues. Have backup demo ready.

**Energy management**: Part 1 is lecture-heavy. Keep it interactive with quick polls/questions.
