---
title: "The Better Approach: Automatic Context Loading"
part: 2
order: 44
layout: "diagram"
sourceFile: "session-management"
---

### The Better Approach: Automatic Context Loading

```mermaid
flowchart TB
    P["📁 project/"]
    I["📋 instructions.md<br/><i>AI reads this automatically</i>"]
    S["📂 src/"]
    D["📂 docs/"]
    E["..."]

    P --> I
    P --> S
    P --> D
    P --> E
```

CLI tools like Copilot and Claude Code look for instruction files:
- `instructions.md` (Copilot)
- `CLAUDE.md` (Claude Code)
- `.github/copilot-instructions.md`

**Every session in this folder automatically gets the context.**