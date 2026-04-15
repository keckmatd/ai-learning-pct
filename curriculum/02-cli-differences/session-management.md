# Session Management

**Time**: 5 minutes

---

## The Problem

```
Monday 2pm:  Start working with AI on project
Monday 5pm:  Great progress! Close terminal.
Tuesday 9am: Start new session...

AI: "Hi! How can I help you?"
You: [sigh] "Okay, so yesterday we were working on..."
```

**Every session starts from zero.**

---

## Browser "Solutions"

### Chat History
- Can scroll back through old conversations
- But AI doesn't automatically have that context
- You have to re-explain or point to specific chats

### Projects (ChatGPT/Gemini)
- Group conversations by project
- Upload reference files
- Better, but still limited

**Problem:** You're dependent on their system. Opaque. Limited control.

---

## CLI Session Management

### The Simple Approach: Explicit Context

```bash
# Start session with context file
ghcp "Read project-context.md, then help me with..."
```

You maintain a file that explains the project. AI reads it each session.

**Pros:** Simple, transparent
**Cons:** Manual, you remember to include it

---

### The Better Approach: Automatic Context Loading

```
project/
├── instructions.md      ← AI reads this automatically
├── src/
├── docs/
└── ...
```

CLI tools like Copilot and Claude Code look for instruction files:
- `instructions.md` (Copilot)
- `CLAUDE.md` (Claude Code)
- `.github/copilot-instructions.md`

**Every session in this folder automatically gets the context.**

---

## What Goes in Instructions?

```markdown
# Project: Claims Processing System

## What This Is
Internal tool for processing insurance claims.
Built with Angular frontend, Go backend.

## Current State
Working on the batch processing feature.
See docs/batch-spec.md for requirements.

## Key Decisions
- Using PostgreSQL, not MongoDB
- JWT auth, tokens expire in 1 hour
- All dates in UTC

## Don't Touch
- legacy/ folder - migration in progress
- auth/ - security team owns this
```

---

## Session Continuity Pattern

**End of session:**
```markdown
## Session Notes - 2025-04-15

Completed:
- Batch upload endpoint
- Validation logic

In progress:
- Error handling for malformed CSVs

Next:
- Add progress tracking
- Write tests
```

**Start of next session:**
- AI reads instructions.md
- Sees where you left off
- Picks up in context

---

## The Mental Model

```
Browser AI:  You remember everything, AI forgets
CLI AI:      Files remember, AI reads them

Instructions.md is your "save game"
```

---

## Practical Tips

1. **Update instructions when things change** - stale context = confused AI
2. **Keep it concise** - competes with context window
3. **Include the "why"** - decisions need reasoning, not just rules
4. **Section for "current work"** - changes frequently, keep at bottom

---

## Check for Understanding

> "If you don't update instructions.md for a month, what happens?"

Answer: AI works with stale context. Might suggest things already done, miss recent decisions.

---

## Transition

> "So instruction files give us persistence. But managing this manually gets tedious. What if there was a system that handled all this?"
