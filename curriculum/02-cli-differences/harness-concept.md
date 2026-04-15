# The Harness Concept

**Time**: 5 minutes

---

## From Files to System

So far:
- Instruction files for project context
- Session notes for continuity
- You managing all of it manually

**A harness is the system that manages this for you.**

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

---

## Harness Components

### 1. Global Instructions
**Who you are, how you work - applies everywhere**

```
~/.claude/CLAUDE.md (Claude Code)
~/.config/github-copilot/instructions.md (Copilot)
```

Contains:
- Your role and preferences
- Coding style
- Communication preferences
- Global rules

---

### 2. Project Instructions
**Context for specific work**

```
project/
├── CLAUDE.md or instructions.md
├── src/
└── ...
```

Contains:
- What this project is
- Architecture decisions
- Current state
- Things to avoid

---

### 3. Skills / Commands
**Reusable workflows triggered by shortcuts**

```
/commit   → Proper commit with message conventions
/plan     → Create implementation plan
/review   → Code review workflow
/research → Deep research pattern
```

Instead of explaining the process each time, invoke a skill.

---

### 4. Session Management
**Continuity across time**

- Tape/log of what happened
- Plans that persist across sessions
- Handoff notes

---

## Why Harness > Raw CLI

| Raw CLI | With Harness |
|---------|--------------|
| Explain context every time | Context loads automatically |
| Remember your conventions | Conventions encoded in skills |
| Manually track progress | System tracks for you |
| Start fresh each session | Pick up where you left off |
| Reinvent workflows | Reuse proven patterns |

---

## The copilot-dotfiles Harness

What you'll install in Part 3:

```
copilot-dotfiles/
├── instructions.md      ← Your global context
├── skills/              ← Reusable workflows
│   ├── commit.md
│   ├── plan.md
│   └── ...
├── templates/           ← Project starters
└── config/              ← Tool settings
```

**It's a starting point** - you customize and extend for your needs.

---

## The Living System Concept

> "A harness isn't static. It evolves with you."

**Week 1:** Use default skills, basic instructions
**Month 1:** Customize instructions for your role
**Month 3:** Build custom skills for your workflows
**Month 6:** Integrated system across all your projects

The harness grows as you learn what works.

---

## Check for Understanding

> "What's the difference between a harness and just using CLAUDE.md?"

Answer: CLAUDE.md is one component. A harness is the full system - instructions, skills, session management, templates, all working together.

---

## Transition

> "Now you understand the architecture. Let's talk about what actually works in practice..."
