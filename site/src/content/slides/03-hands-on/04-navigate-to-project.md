---
title: "Navigate to project"
part: 3
order: 4
layout: "code"
sourceFile: "cheatsheet-walkthrough"
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