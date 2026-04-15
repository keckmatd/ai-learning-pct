---
name: work-exec
description: Execute the plan from `harness/plan.md` using the superpowers execution skill.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
  - task
---
# Work Exec

Execute the plan from `harness/plan.md` using the superpowers execution skill.

## Usage

```
/work-exec
/we
```

## What This Does

1. Loads the plan from `harness/plan.md` (requires `/wp` first)
2. Delegates execution to `superpowers:executing-plans`
3. The superpowers skill handles wave analysis, subagent dispatch, verification, and commits

## Prerequisites

A plan MUST exist at `harness/plan.md`. If it doesn't, tell the user to run `/wp` first. These two skills are designed as a pair — `/wp` produces the plan, `/we` executes it.

## Instructions

When the user runs `/work-exec` or `/we`, do the following:

### Step 1: Verify Plan Exists

Check that `harness/plan.md` exists and is non-empty. If missing, tell the user:

> No plan found. Run `/wp` to create one first.

### Step 2: Invoke Execution Skill

Invoke `superpowers:executing-plans` to execute the plan.

The superpowers skill will:
- Load and analyze the plan
- Group tasks into execution waves based on dependencies
- Dispatch subagents per task (parallel within waves)
- Run verification after each wave
- Update plan checkboxes as tasks complete

### Step 3: Done

After the superpowers skill completes, tell the user:

> Plan execution complete. Run `/wd` to save session state.

## When NOT to Use This

- **No plan exists** — run `/wp` first (required)
- **Plan is stale** — if files changed significantly since the plan was written, re-run `/wp`
- **Single trivial task** — just do it inline, no subagent overhead needed

## Integration

**`/wp` and `/we` are a pair.** `/wp` produces the plan. `/we` executes it via superpowers.

- `/we` or `/work-exec` — Execute the plan (this skill)
- `/work-branch <task-id>` — Creates worktree for a specific task (manual alternative)
- `/work-start` — Shows plan tasks alongside issues
