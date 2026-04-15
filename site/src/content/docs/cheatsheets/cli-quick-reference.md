---
title: "CLI Quick Reference"
category: "cheatsheets"
order: 1
description: "One-page quick reference for GitHub Copilot CLI commands"
---

# GitHub Copilot CLI - Quick Reference

*Keep this handy. One page, laminate it.*

## Basic Commands

```bash
ghcp "your prompt"                    # Basic query
ghcp -f file.md "prompt"              # Include file context
ghcp explain "command"                # Explain a command
ghcp suggest "what I want to do"      # Get command suggestions
```

## Context Management

```bash
# Include specific files
ghcp -f src/main.go "Explain this"

# Include multiple files
ghcp -f file1.md -f file2.md "Compare these"

# Include by pattern
ghcp -f docs/*.md "Summarize docs"
```

## Working with Projects

```bash
# Project with instructions.md loads context automatically
cd ~/projects/my-project
ghcp "What is this project?"

# Manually include project context
ghcp -f CLAUDE.md -f harness/plan.md "Continue the work"
```

## Common Workflows

| Task | Command |
|------|---------|
| Fix specific bug | `ghcp "Fix null pointer in handler.go line 47"` |
| Explain code | `ghcp -f file.go "Explain the auth flow"` |
| Review changes | `ghcp -f changed-file.go "Review for issues"` |
| From template | `ghcp -f templates/X.md "Create Y about Z"` |
| Research | `ghcp "Research [topic], summarize in bullets"` |
| Commit | `ghcp "Commit with message following conventions"` |

## Best Practices

| Do | Don't |
|----|-------|
| Be specific about scope | "Make it better" |
| Include relevant files | Paste huge files |
| Review before accepting | Blindly trust |
| Start fresh when confused | Keep broken context |
| Use skills for repeated tasks | Explain workflow every time |

## Troubleshooting

| Problem | Try |
|---------|-----|
| AI seems confused | Start new session, load context fresh |
| Wrong file changes | Be more specific about which file |
| Generic output | Add more context, be more specific |
| Too verbose | Ask for "concise" or "bullet points" |
| Forgot something | Check if instructions.md needs update |

## Quick Tips

1. **Context is everything** - AI only knows what you tell it
2. **Iterate, don't expect perfection** - First draft, then refine
3. **Verify important facts** - AI can be confident but wrong
4. **Templates save time** - Reuse what works
5. **Skills encode wisdom** - Don't reinvent workflows

## Getting Help

- Slack: `#ai-practitioners`
- Docs: `github.com/keckmatd/copilot-dotfiles`
- Office Hours: [TBD]
