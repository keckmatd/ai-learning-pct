# Project: AI Learning PCT

> Project-specific Claude configuration. Inherits from ~/.claude/CLAUDE.md (universal director).

## Project Overview

Training curriculum and materials for the PCT cabinet's 90-minute AI workshop. Teaches foundational concepts (tokens, context windows, RAG, MCP) then transitions to hands-on CLI work with the copilot-dotfiles harness.

## Architecture

This is a **curriculum project**, not a code project. Structure:

```
curriculum/
  00-overview.md       # Session flow, timing, goals
  01-concepts/         # Part 1: Foundational knowledge
  02-cli-differences/  # Part 2: Why CLI > browser
  03-hands-on/         # Part 3: Install & use harness
  04-inspiration/      # Part 4: What's possible
cheatsheets/           # Quick reference cards for participants
examples/              # Follow-along exercises
roadmap.md             # Master plan for building all materials
```

## Key Files

- `curriculum/00-overview.md` - The 90-minute session plan
- `roadmap.md` - What needs to be built, prioritized
- `cheatsheets/` - Takeaways participants keep

## Development

### Preview Materials
```bash
# Markdown preview (if using VS Code)
code curriculum/
```

### Validate Links
```bash
# Check for broken internal links
grep -r '\[.*\](.*\.md)' curriculum/ | grep -v '#'
```

## Project-Specific Conventions

### Writing Style
- Conversational, not academic
- Show > tell (examples over explanations)
- Build on what they already know (ChatGPT/Gemini experience)

### Time Annotations
- Every section has `[XX min]` timing
- Buffer time built into transitions

### Difficulty Markers
- No markers needed - assume baseline is "used ChatGPT in browser"

## Areas of Complexity

- **Pacing**: 90 minutes is tight; must resist going deep on any one topic
- **Hands-on setup**: copilot-dotfiles install could hit snags on corp machines

## Current Work

See `roadmap.md` for the master build plan.

---

*This file is project-specific and should be committed to the repo.*
