# Cheatsheet Walkthrough

**Time**: 5 minutes

> This walkthrough matches the CLI Quick Reference card at `site/src/content/docs/cheatsheets/cli-quick-reference.md`. Both should be updated together.

---

## Quick Reference Card

This is your "keep on desk" reference. We'll walk through the key sections.

---

## Basic Commands

| Command | What It Does |
|---------|--------------|
| `ghcp "your prompt"` | Basic query |
| `ghcp -f file.md "prompt"` | Include file context |
| `ghcp explain "command"` | Explain a command |
| `ghcp suggest "what I want to do"` | Get command suggestions |

---

## Context Management

### Include specific files
```bash
ghcp -f src/main.go "Explain this"
```

### Include multiple files
```bash
ghcp -f file1.md -f file2.md "Compare these"
```

### Include by pattern
```bash
ghcp -f docs/*.md "Summarize docs"
```

---

## Working with Projects

### Project with instructions.md loads context automatically
```bash
cd ~/projects/my-project
ghcp "What is this project?"
```

### Manually include project context
```bash
ghcp -f CLAUDE.md -f harness/plan.md "Continue the work"
```

---

## Common Workflows

| Task | Command |
|------|---------|
| Fix specific bug | `ghcp "Fix null pointer in handler.go line 47"` |
| Explain code | `ghcp -f file.go "Explain the auth flow"` |
| Review changes | `ghcp -f changed-file.go "Review for issues"` |
| From template | `ghcp -f templates/X.md "Create Y about Z"` |
| Research | `ghcp "Research [topic], summarize in bullets"` |
| Commit | `ghcp "Commit with message following conventions"` |

---

## Best Practices

| Do | Don't |
|----|-------|
| Be specific about scope | "Make it better" |
| Include relevant files | Paste huge files |
| Review before accepting | Blindly trust |
| Start fresh when confused | Keep broken context |
| Use skills for repeated tasks | Explain workflow every time |

---

## Troubleshooting

| Problem | Try |
|---------|-----|
| AI seems confused | Start new session, load context fresh |
| Wrong file changes | Be more specific about which file |
| Generic output | Add more context, be more specific |
| Too verbose | Ask for "concise" or "bullet points" |
| Forgot something | Check if instructions.md needs update |

---

## Quick Tips

1. **Context is everything** - AI only knows what you tell it
2. **Iterate, don't expect perfection** - First draft, then refine
3. **Verify important facts** - AI can be confident but wrong
4. **Templates save time** - Reuse what works
5. **Skills encode wisdom** - Don't reinvent workflows

---

## Your Printed Cheatsheet

This will be provided as a one-page PDF. Keep it handy.

---

## Next: Build Something

→ [exercise-powerpoint.md](./exercise-powerpoint.md)
