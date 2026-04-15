---
title: "Plan"
part: 3
order: 6
layout: "code"
sourceFile: "cheatsheet-walkthrough"
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