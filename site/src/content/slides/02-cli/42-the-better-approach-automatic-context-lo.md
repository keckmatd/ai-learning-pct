---
title: "The Better Approach: Automatic Context Loading"
part: 2
order: 42
layout: "split"
sourceFile: "session-management"
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