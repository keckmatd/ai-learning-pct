---
title: "Start fresh (new session, just instructions)"
part: 3
order: 7
layout: "code"
sourceFile: "cheatsheet-walkthrough"
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