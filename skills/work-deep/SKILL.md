---
name: work-deep
description: Full-ceremony design and implementation for complex features. Runs the complete chain: brainstorm → spec → reviewed plan → execution.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
  - task
  - ask_user
---
# Work Deep

Full-ceremony design and implementation for complex features. Runs the complete chain: brainstorm → spec → reviewed plan → execution.

## Usage

```
/work-deep <task description or issue number>
/wD <task description or issue number>
```

## When to Use This

- Ambiguous requirements that need real design exploration
- Multi-session features or multi-developer handoff
- Large refactors touching 10+ files with complex migration
- When the plan IS the deliverable (architecture decisions need documenting)

For most work, use `/wp` + `/we` instead. This is the heavy-weight path.

## What This Does

Orchestrates the full superpowers chain in order:

1. **Brainstorm** — `superpowers:brainstorming` skill
2. **Write spec** — saved to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
3. **Spec review loop** — reviewer agent, fix issues, re-review until approved (max 3 iterations)
4. **User reviews spec** — gate before planning
5. **Write plan** — `superpowers:writing-plans` skill, saved to `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
6. **Plan review loop** — reviewer agent, fix issues, re-review until approved (max 3 iterations)
7. **Execution handoff** — user chooses subagent-driven or inline

## Instructions

When the user runs `/work-deep`, do the following:

### Step 1: Understand the Task

**If given an issue number:**
- Read `harness/config.yaml` for issue backend (github/local/none)
- github: `gh issue view <N> --json title,body,labels`
- local: Read `harness/issues.yaml`

**If given a description:**
- Note it as the starting point for brainstorming

### Step 2: Invoke Brainstorming

Invoke the `superpowers:brainstorming` skill. Follow it exactly:
- Explore project context
- Offer visual companion (if visual questions ahead)
- Ask clarifying questions one at a time
- Propose 2-3 approaches with recommendation
- Present design in sections, get approval per section
- Write spec doc to `docs/superpowers/specs/`
- Run spec review loop (reviewer subagent, max 3 iterations)
- User reviews the written spec

### Step 3: Invoke Plan Writing

After spec is approved, invoke the `superpowers:writing-plans` skill. Follow it exactly:
- Write detailed implementation plan with TDD steps
- Save to `docs/superpowers/plans/`
- Run plan review loop (reviewer subagent, max 3 iterations)

### Step 3.5: Stage Plan for Execution

After the plan is saved to `docs/superpowers/plans/`, **always** copy it to `harness/plan.md`:

```bash
cp docs/superpowers/plans/<plan-file>.md harness/plan.md
```

This stages the plan for `/we` execution. The archival copy stays in `docs/superpowers/plans/`;
`harness/plan.md` is the active execution slot. Do this automatically — don't ask the user.

### Step 4: Execution Handoff

After plan is approved and staged, offer execution choice:

> **Plan complete and staged to `harness/plan.md`. Three execution options:**
>
> **1. Subagent-Driven (recommended for parallel tasks)** — Fresh subagent per task, review between tasks
> Use: `superpowers:subagent-driven-development`
>
> **2. Inline Execution** — Execute tasks in this session with checkpoints
> Use: `superpowers:executing-plans`
>
> **3. Save for later** — Plan is staged in `harness/plan.md`, run `/we` in a future session
>
> **Which approach?**

### Artifacts Produced

| Artifact | Location |
|----------|----------|
| Design spec | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` |
| Implementation plan | `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` |
| Commits | Spec commit, plan commit, then implementation commits |

## Compared to /wp

| Aspect | `/wp` (planned) | `/wD` (deep) |
|--------|-----------------|--------------|
| Questions | 1-3, only if ambiguous | Full brainstorming loop |
| Spec doc | None | Full reviewed spec |
| Plan location | `harness/plan.md` | `docs/superpowers/plans/` + auto-copied to `harness/plan.md` |
| Review loops | 1 pass | Up to 3 iterations each |
| Execution | Always inline (`/we`) | Choice of subagent or inline |
| Time | ~10 min planning | ~30+ min planning |
