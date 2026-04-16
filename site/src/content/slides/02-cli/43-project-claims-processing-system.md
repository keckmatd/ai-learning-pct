---
title: "Project: Claims Processing System"
part: 2
order: 20
layout: "code"
sourceFile: "session-management"
---

## What Goes in Instructions?

```markdown
# Project: Claims Processing System

## What This Is
Internal tool for processing insurance claims.
Built with Angular frontend, Go backend.

## Current State
Working on the batch processing feature.
See docs/batch-spec.md for requirements.

## Key Decisions
- Using PostgreSQL, not MongoDB
- JWT auth, tokens expire in 1 hour
- All dates in UTC

## Don't Touch
- legacy/ folder - migration in progress
- auth/ - security team owns this
```