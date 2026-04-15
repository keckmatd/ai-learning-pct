---
name: work-plan
description: Design and plan a feature or task. Streamlined: gather context, clarify, propose approaches, write a lightweight plan.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
  - ask_user
---
# Work Plan

Design and plan a feature or task. Streamlined: gather context, clarify, propose approaches, write a lightweight plan.

## Usage

```
/work-plan <task description or issue number>
/wp <task description or issue number>
```

## What This Does

1. Understands the task (issue or description)
2. Reads relevant code (direct reads, no subagent overhead)
3. Asks 1-3 clarifying questions (only if genuinely ambiguous)
4. Proposes 2-3 approaches with your recommendation
5. On approval: writes a checkboxed plan to `harness/plan.md`
6. One reviewer pass to catch real issues
7. Done. User runs `/we` or `/work-exec` to execute.

## Issue Backend

Read `harness/config.yaml` to determine the issue backend. If no config exists, default to `github`.

- **github**: Use `gh issue` commands
- **local**: Read/write `harness/issues.yaml`
- **none**: Skip all issue operations

## Instructions

### Step 1: Understand the Task

**If given an issue number:**
- github: `gh issue view <N> --json title,body,labels`
- local: Read `harness/issues.yaml`
- none: Treat as description

**If given a description:**
- Ask 1-3 clarifying questions if genuinely ambiguous. Skip if requirements are clear.
- Prefer multiple choice questions.

### Step 2: Read the Code

Read the actual files that will be affected. Use Glob/Grep/Read directly — do NOT spawn a subagent for this. Build understanding of:
- Which files are involved
- Current patterns and conventions
- Test files that need updating
- Import/dependency relationships

### Step 3: Propose Approaches

Present 2-3 approaches with trade-offs. Lead with your recommendation and explain why. Keep it concise — a few sentences per approach, not paragraphs.

Wait for user to pick an approach before writing the plan.

### Step 4: Write the Plan

Write to `harness/plan.md` in this format:

```markdown
# [Task Name]

**Issue:** #N (if applicable)
**Approach:** [1-sentence summary of chosen approach]

## Execution Waves

Analyze task dependencies and group into waves for `/we` execution:

| Wave | Tasks | Mode | Rationale |
|------|-------|------|-----------|
| 1 | Task 1, Task 2 | parallel | No shared files |
| 2 | Task 3 | sequential | Depends on Task 1 output |
| 3 | Task 4, Task 5 | parallel | Independent migrations |

## Tasks

### 1. [Component/Change Name]
**Files:** `path/to/file.dart`, `path/to/test.dart`
**Depends on:** (none, or list task numbers)
- [ ] Write failing test for [specific behavior]
- [ ] Implement [specific thing]
- [ ] Run tests, verify green
- [ ] Commit: "[message]"

### 2. [Next Component]
**Files:** `path/to/other.dart`
**Depends on:** Task 1
- [ ] ...

## Verification
- [ ] `just test` (or project-specific test command)
- [ ] `just preflight` (if applicable)
- [ ] Visual check (if UI changes — note which screens)

## Notes
- [Anything the executor needs to know: API changes, migration gotchas, etc.]
```

Guidelines:
- **Exact file paths** — no guessing
- **Checkboxed steps** — each step is one action (2-5 minutes)
- **TDD by default** — test before implementation for each task
- **One commit per task** — keep diffs reviewable
- **Dependency annotations** — mark `**Depends on:**` so `/we` knows the execution order
- **Execution waves table** — group tasks into parallel/sequential waves for subagent dispatch
- **Notes section** — only for non-obvious things the executor wouldn't know from reading the files

### Step 5: Quick Review

Dispatch ONE reviewer agent to check the plan for:
- Missing files or migration steps
- Dependency ordering issues
- Things that would cause compile errors during execution

Fix any real issues. Do NOT do a re-review loop — one pass is enough for a lightweight plan.

### Step 6: Done

Tell the user the plan is ready:

> Plan saved to `harness/plan.md`. Run `/we` to execute, or `/work-branch` for isolated execution.

## When to Use Deep Planning Instead

If the task has any of these characteristics, suggest the deep route:
- Multiple independent subsystems that could be built in parallel
- Ambiguous requirements that need real design exploration
- Multi-developer handoff where the plan IS the deliverable
- Large refactor touching 10+ files with complex migration

For deep planning: use `superpowers:brainstorming` → `superpowers:writing-plans` → `superpowers:subagent-driven-development`.

## Integration

**`/wp` and `/we` are a pair.** `/wp` produces the plan with dependency analysis and execution waves. `/we` consumes the plan and dispatches subagents per task, using the waves table for parallelization.

- `/we` or `/work-exec` — Execute the plan via subagent-driven development
- `/work-branch <task-id>` — Creates worktree for a specific task (manual alternative)
- `/work-start` — Shows plan tasks alongside issues
