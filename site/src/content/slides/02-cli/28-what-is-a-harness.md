---
title: "What Is a Harness?"
part: 2
order: 28
layout: "code"
notes: "A harness is a structured environment that wraps your AI CLI with conventions, workflows, and automation."
sourceFile: "harness-concept"
---

## What Is a Harness?

> "A harness is a structured environment that wraps your AI CLI with conventions, workflows, and automation."

```
┌─────────────────────────────────────────────────┐
│                   HARNESS                       │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │ Instructions│  │   Skills/   │  │ Session │  │
│  │   (CLAUDE.md│  │  Commands   │  │ Mgmt    │  │
│  │  instr.md)  │  │  (/commit   │  │ (tape,  │  │
│  │             │  │   /plan)    │  │  plans) │  │
│  └─────────────┘  └─────────────┘  └─────────┘  │
│                                                 │
│         You ←→ AI ←→ Your Workspace             │
│                                                 │
└─────────────────────────────────────────────────┘
```