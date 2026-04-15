---
name: work-status
description: Quick "where am I?" check without the full /work-start ceremony.
allowed-tools:
  - bash
  - view
  - grep
  - glob
---
# Work Status

Quick "where am I?" check without the full /work-start ceremony.

## What This Does

- Shows current branch and dirty state
- Shows plan progress (if a plan exists)
- Shows last tape checkpoint
- Shows priority issues (`next` label)

No wiki check, no full primer, no issue listing beyond `next`.

## Instructions

When the user runs `/work-status` or `/wst`, do the following:

### Step 1: Git State

Run in parallel:
```bash
git branch --show-current
git status --short
```

### Step 2: Plan Progress

Call `mcp__session-context__get_plan_details` (uses cwd). If MCP unavailable, call `mcp__session-context__find_plan_file` and read it directly. If no plan exists, report "No active plan."

### Step 3: Last Checkpoint

Call `mcp__session-context__tape_search` with `type: "checkpoint"`, `limit: 1`. Show the most recent checkpoint content and timestamp. If no checkpoint, report "No recent checkpoint."

### Step 4: Priority Issues

```bash
gh issue list --state open --label "next" --json number,title --limit 5
```

If no issues or gh unavailable, skip silently.

### Step 5: Present

```
[branch-name] [dirty: N files / clean]

Plan: [title] ([X/Y tasks done]) | No active plan
  Next: [next unchecked task]

Last checkpoint: [content] ([relative time])

Priority:
- #N: [title]
```

Keep it compact. No follow-up prompt — this is informational only.
