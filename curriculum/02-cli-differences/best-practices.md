# Best Practices

**Time**: 5 minutes

---

## Patterns That Work

From real usage - what actually makes CLI AI effective.

---

## 1. Start Sessions with Context

**Don't:**
```
You: "Help me with the thing we were working on"
AI:  "I don't have context about previous conversations..."
```

**Do:**
```
You: "Read CLAUDE.md and the plan in harness/plan.md, 
      then continue with the batch processing task"
```

Or use a skill: `/work-start` (loads context automatically)

---

## 2. Be Specific About Scope

**Don't:**
```
You: "Make the code better"
AI:  [refactors everything, adds features you didn't want]
```

**Do:**
```
You: "Fix the null pointer in handleRequest() at line 47.
      Don't change anything else."
```

AI will do exactly what you ask - so ask precisely.

---

## 3. Verify Before Trusting

**Don't:**
```
You: "Commit these changes"
[Commits without reviewing]
```

**Do:**
```
You: "Show me the diff before committing"
[Review, then approve]
```

Trust but verify. AI makes mistakes. Review matters.

---

## 4. Keep Context Current

**Don't:**
- Leave stale instructions from months ago
- Let session notes pile up forever
- Forget to update after decisions change

**Do:**
- Update instructions when architecture changes
- Archive old session notes
- Treat instructions like documentation - maintain it

---

## 5. Use Skills for Repeated Workflows

**Don't:**
```
Every time: "Okay, so when you commit, use imperative mood,
             include the ticket number, run tests first..."
```

**Do:**
```
/commit
[Skill handles all the conventions]
```

If you explain something twice, make it a skill.

---

## 6. Manage Context Window Intentionally

**Don't:**
- Paste entire files when you need one function
- Keep old conversation going forever
- Include irrelevant context "just in case"

**Do:**
- Reference specific lines/functions
- Start fresh sessions for new topics
- Curate what goes in instructions (concise > comprehensive)

---

## 7. Embrace the Conversation

**Don't:**
```
You: "Build me a complete authentication system"
[Wait for massive response, hope it's right]
```

**Do:**
```
You: "Let's design auth. First, what approach for tokens?"
AI:  [Discusses options]
You: "JWT sounds right. Now let's outline the endpoints..."
```

Iterate. Collaborate. Don't expect perfect first drafts.

---

## Anti-Patterns to Avoid

### The "Do Everything" Request
Asking for too much at once leads to generic output.

### The "Repeat Myself" Loop  
If you're explaining context again, your instructions need updating.

### The "Blind Trust" Trap
AI outputs should be reviewed, especially for code changes.

### The "Fresh Start Fallacy"
Don't abandon sessions too quickly - sometimes working through confusion is faster.

---

## The Meta-Practice

> "Notice what works and doesn't. Encode what works into your harness."

If a prompt pattern works well → make it a skill
If context keeps being needed → add it to instructions
If mistakes keep happening → add guardrails

**Your harness is a record of lessons learned.**

---

## Quick Reference

| Situation | Practice |
|-----------|----------|
| Starting work | Load context first (`/ws` or explicit) |
| Making changes | Review diffs before committing |
| Repeated workflow | Create/use a skill |
| Long conversation | Consider fresh start with context |
| AI confusion | Check if instructions are stale |
| Good pattern | Save it somewhere (skill, instructions) |

---

## Part 2 Recap

You now understand:
1. **Browser vs CLI** - sandbox vs workspace
2. **Session management** - instruction files, continuity
3. **Harness** - the system that holds it together
4. **Best practices** - what actually works

---

## The Big Transition

> "Theory complete. You understand the machinery and the approach."

> "Now let's get your hands dirty. Time to install a harness and build something."

→ Part 3: Hands-On
