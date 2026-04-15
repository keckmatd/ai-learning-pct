---
name: work-init
description: Initialize a fresh harness with spirit.md. Use for new projects or after archive.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - ask_user
---
# Work Init

Initialize a fresh harness with spirit.md. Use for new projects or after archive.

## What This Does

- Creates harness/ directory structure
- Prompts for project spirit (the "why")
- Sets up empty progress.md
- Preserves existing research/ files
- Optionally links to existing GitHub Issues

## Issue Backend

Read `harness/config.yaml` to determine the issue backend. If no config exists, default to `github`.

- **github**: Use `gh issue` commands (default behavior)
- **local**: Read/write `harness/issues.yaml` directly
- **none**: Skip all issue operations

## Instructions

When the user runs `/work-init`, do the following:

### Step 1: Check Existing State

Check for `harness/spirit.md` specifically (not just the directory).

**If spirit.md exists:**
```
Existing harness found.
- Spirit: [first line of spirit.md]
- Progress: [N] sessions (from progress.md)
- Research: [N] files (if any)

Options:
1. Archive and start fresh (runs /work-archive first)
2. Update spirit.md only (keep progress)
3. Cancel

Choice?
```

If option 1: run `/work-archive` flow first, then continue.
If option 2: skip to Step 3 (Gather Spirit), preserve progress.md.
If option 3: abort.

**If spirit.md missing** (fresh state): proceed directly.

### Step 2: Create Structure

```bash
mkdir -p harness/archive
mkdir -p harness/research
```

This is idempotent - won't affect existing files in these dirs.

### Step 3: Gather Spirit

Ask a series of quick questions:

```
Setting up project spirit.

1. What are we building? (1-2 sentences)
```

Wait for response.

```
2. Current phase? (e.g., "MVP", "Launch prep", "v2 features")
```

Wait for response.

```
3. Key decisions already made? (architecture, tech choices, constraints)
   (enter to skip if starting fresh)
```

Wait for response.

```
4. Non-negotiables? (things that must not change)
   (enter to skip)
```

Wait for response.

### Step 4: Create Spirit File

Write `harness/spirit.md`:

```markdown
# [Project Name]

[What we're building - from answer 1]

## Current Phase
[From answer 2]

## Next Up
[Empty - set by /work-done or /work-pivot when needed]

## Key Decisions
[From answer 3, as bullet points]
- [Decision 1]
- [Decision 2]

## Non-Negotiables
[From answer 4, as bullet points]
- [Item 1]
- [Item 2]

## Pivots
[Empty - filled by /work-pivot]
```

### Step 5: Create/Reset Progress File

**If progress.md doesn't exist** (or option 1 was chosen):
Write fresh `harness/progress.md`:

```markdown
# Progress Log

Initialized: [date]

---

```

**If updating spirit only** (option 2): leave progress.md unchanged.

### Step 6: Configure Issue Backend

If `harness/config.yaml` doesn't exist:

1. Check git remote: `git remote get-url origin 2>/dev/null`
2. If remote host is NOT `github.com` (e.g., enterprise GitHub like `github.nwie.net`), or if user specifies:

```
Issue tracking:
1. GitHub Issues (default for github.com repos)
2. Local file (harness/issues.yaml)
3. None (skip issue tracking)

Choice?
```

3. If remote IS `github.com` and user doesn't override: default to `github`.
4. Create `harness/config.yaml`:

```yaml
issue_backend: local  # github | local | none
```

5. If **local** selected, create `harness/issues.yaml`:

```yaml
next_id: 1
issues: []
```

### Step 7: Check for Existing Issues

**github backend:**

Run `gh issue list --state open --limit 10`

If issues exist:
```
Found [N] open GitHub Issues:
- #1: [title] [labels]
- #2: [title] [labels]

These will be shown in /work-start. No action needed.
```

If no issues:
```
No open GitHub Issues.

Create issues to track work. Use labels to categorize:
- Scope labels for different areas of the project
- `next` label for priority items
- `blocked` label for dependencies
```

**local backend:**
```
Local issue tracking initialized. 0 open issues.

Use /work-create to add issues. Labels work the same:
- `next` for priority items
- `blocked` for dependencies
```

**none backend:**
```
Issue tracking disabled.
```

### Step 8: Confirm

```
Harness initialized.

Created:
- harness/spirit.md
- harness/progress.md [or "preserved"]
- harness/config.yaml (issue backend: [github|local|none])
- harness/archive/
- harness/research/ ([N] existing files preserved)

Issues: [N] open ([github|local|none] backend)

Commands:
- /work-start  Resume with issues summary
- /work-done   Save progress, update issues
- /work-pivot  Insert priority task
```

## Spirit Template

| Section | Purpose | Updated by |
|---------|---------|------------|
| Header | What we're building | /work-init |
| Current Phase | Where we are | /work-init, /work-pivot |
| Next Up | Priority task for next session | /work-done, /work-pivot |
| Key Decisions | Architectural choices | /work-init, /work-pivot |
| Non-Negotiables | Hard constraints | /work-init |
| Pivots | History of direction changes | /work-pivot |

## Idempotency

- Running twice with existing spirit.md prompts for action
- research/ files are never deleted
- archive/ files are never deleted
- mkdir -p is safe to run repeatedly

## When to Use

- New project (no spirit.md)
- After `/work-archive`
- Joining existing project that lacks harness
- Major pivot that needs fresh start

## Spirit is Small

Keep spirit.md under 30 lines. It's read on every `/work-start`.
If you need more detail, put it in `harness/research/`.
