---
title: "Common Workflows"
part: 3
order: 8
layout: "code"
sourceFile: "cheatsheet-walkthrough"
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
ghcp -f templates/pct/nationwide_default.pptx "Create a deck about Q4 results"
```

### Research
```bash
ghcp "Research best practices for batch processing in Go. 
      Summarize with recommendations."
```