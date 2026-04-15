---
name: work-archive
description: Archive current harness state before re-initialization. Moves plans, progress, and expired artifacts to `harness/archive/`.
allowed-tools:
  - bash
  - view
  - edit
  - create
---
# Work Archive

Archive current harness state before re-initialization. Moves plans, progress, and expired artifacts to `harness/archive/`.

## Usage

```
/work-archive
/wa
```

## What This Does

- Moves active plan to archive (timestamped)
- Moves progress.md to archive (if exists)
- Archives completed specs
- Leaves spirit.md in place (for reference during re-init)
- Leaves tape entries alone (auto-decay handles them)

## Instructions

When the user runs `/work-archive` or `/wa`:

### Step 1: Inventory Current State

Check what exists:
- `harness/plan.md` — active plan
- `harness/progress.md` — legacy progress file
- `docs/specs/` or `docs/superpowers/specs/` — completed specs

Report what will be archived.

### Step 2: Confirm

```
Will archive:
- harness/plan.md → harness/archive/plan-[date].md
- harness/progress.md → harness/archive/progress-[date].md
- [N] completed specs → harness/archive/

Spirit.md will stay in place.
Tape entries are unaffected (auto-decay).

Proceed?
```

### Step 3: Archive

For each file to archive:

```bash
# Timestamp format: YYYY-MM-DD
mv harness/plan.md "harness/archive/plan-$(date +%Y-%m-%d).md"
mv harness/progress.md "harness/archive/progress-$(date +%Y-%m-%d).md"
```

For completed specs, move only those with `Status: Complete` in frontmatter.

### Step 4: Confirm

```
Archived:
- [list of moved files]

Harness is clean. Run /work-init to start fresh.
```

## When to Use

- Before `/work-init` when re-initializing an existing harness
- After completing a major milestone
- When plan.md is stale and no longer relevant

## When NOT to Use

- Mid-work (use `/work-done` instead)
- If there's nothing to archive
