# Cheatsheet Walkthrough

**Time**: 5 minutes

---

## Quick Reference Card

This is your "keep on desk" reference. We'll walk through the key sections.

---

## Basic Commands

| Command | What It Does |
|---------|--------------|
| `ghcp "prompt"` | Basic query with global instructions |
| `ghcp -f file.md "prompt"` | Include file in context |
| `ghcp explain` | Explain a command |
| `ghcp suggest` | Get command suggestions |

---

## Working with Projects

### Start a Work Session
```bash
# Navigate to project
cd ~/projects/my-project

# If project has instructions.md, they load automatically
ghcp "What does this project do?"
```

### Include Context
```bash
# Include specific files
ghcp -f src/main.go -f README.md "Explain the architecture"

# Include all markdown in directory
ghcp -f docs/*.md "Summarize the documentation"
```

---

## Using Skills

Skills are pre-built workflows. Invoke with a keyword or pattern.

```bash
# Commit workflow (follows conventions)
ghcp "Use the commit skill to commit my changes"

# Planning workflow
ghcp "Use the plan skill to plan implementing feature X"

# Research workflow  
ghcp "Use the research skill to investigate topic Y"
```

**The skill tells the AI what process to follow.**

---

## Modes of Work

### Quick Task (no planning)
```bash
ghcp "Fix the typo in line 43 of handler.go"
```

### Exploration (learning)
```bash
ghcp "Explain how the auth flow works in this codebase"
```

### Building (planning first)
```bash
# Plan
ghcp "Plan implementing the batch upload feature"

# Then execute
ghcp "Execute step 1 of the plan"
```

### Deep Work (multi-session)
```bash
# Start session with context
ghcp -f harness/plan.md "Continue with the batch upload work"

# End session with notes
ghcp "Summarize progress for handoff"
```

---

## Context Management

### What's in Context?
- Global instructions (always loaded)
- Project instructions.md (if present)
- Files you include with `-f`
- Conversation history (within session)

### Managing Context Size
```bash
# Start fresh (new session, just instructions)
# Close terminal, open new one

# Be selective about files
ghcp -f src/specific/file.go "Focus on this"
# vs
ghcp -f src/**/*.go "All Go files (might be too much)"
```

---

## Common Workflows

### Code Change
```bash
ghcp "In src/api/handler.go, add input validation for the email field"
```

### Review
```bash
ghcp -f path/to/changed/file.go "Review this code for issues"
```

### Generate from Template
```bash
ghcp -f templates/powerpoint-template.md "Create a deck about Q4 results"
```

### Research
```bash
ghcp "Research best practices for batch processing in Go. 
      Summarize with recommendations."
```

---

## Quick Tips

1. **Be specific** - "fix the bug" < "fix null pointer in handleRequest line 47"
2. **Include context** - AI works better with relevant files
3. **Verify changes** - Always review before accepting
4. **Fresh sessions** - When confused, start clean
5. **Use skills** - Don't reinvent workflows

---

## Your Printed Cheatsheet

This will be provided as a one-page PDF. Keep it handy.

---

## Next: Build Something

→ [exercise-powerpoint.md](./exercise-powerpoint.md)
