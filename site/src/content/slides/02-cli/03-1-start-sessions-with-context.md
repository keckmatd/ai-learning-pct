---
title: "1. Start Sessions with Context"
part: 2
order: 3
layout: "code"
sourceFile: "best-practices"
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