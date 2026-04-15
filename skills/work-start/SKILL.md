---
name: work-start
description: Resume session with lean context using session-context MCP.
allowed-tools:
  - bash
  - view
  - grep
  - glob
  - ask_user
---
# Work Start

Resume session with lean context using session-context MCP.

## What This Does

- Calls MCP `get_active_context` for spirit + plan + specs + decisions + tape
- Prunes expired tape entries automatically
- Single tool call, ~80% less context consumed on setup
- Falls back to reading files directly if MCP unavailable

## Instructions

When the user runs `/work-start` or `/ws`, do the following:

### Step 1: Get Active Context (MCP)

Call `mcp__session-context__get_active_context` with no arguments (uses cwd).

This returns a pre-formatted session primer with:
- **Spirit** — project title, summary, current phase
- **Last session** — synthesized from tape (checkpoint/milestone entries), or from progress.md as fallback
- **Active plan** — title, progress (X/Y tasks), next actions
- **Recent specs** — last 3 specs by date
- **Session tape** — scoped context entries (decisions, discoveries, constraints)

**If MCP fails:** Fall back to reading `harness/spirit.md` and `harness/progress.md` directly.

### Step 2: Get Issue Backend

Resolve issue backend per CLAUDE.md convention.

### Step 3: Fetch Issues

**github backend:**
```bash
gh issue list --state open --label "next" --json number,title,labels --limit 5
gh issue list --state open --json number,title,labels --limit 20
```

**local backend:** Read `harness/issues.yaml`, filter `state: open`.

**none backend:** Skip issues.

### Step 4: Wiki Fallback (Optional)

Wiki data is included in the MCP response from Step 1 (`get_active_context` resolves machine ID, project key, and wiki pages automatically). If the MCP response contains no wiki section and a vault exists (`~/.copilot/wiki.yaml` or `~/brain/`), fall back to manual wiki discovery using `/wiki-search`.

### Step 5: Present Summary

```
[Project Name] - Work Start

[MCP session primer output here — already formatted]

>>> Wiki (N pages):
- [[Page Title]] (updated N days ago)
Use /wiki-search to query.

>>> Priority (`next` label):
- #N: [title] [labels]

>>> Open Issues:
- #N: [title] [labels]

Pick an issue number, or describe new work.
```

For `none` backend, omit issue sections. If no wiki vault or no matching pages, omit wiki section.

### Step 6: Begin

Wait for user to pick an issue or describe work.

## Notes

- Tape entries auto-decay — no manual archiving needed
- MCP prunes expired entries on load
- Hygiene checks can be a separate `/harness-check` if needed

## The Flow

```
Issues         <-  Source of truth for work items (github/local/none)
     |
/work-start   ->  MCP returns session primer with tape context
     |
User picks    ->  Work begins on issue
     |
/work-done    ->  Writes tape entries (checkpoint, milestones, decisions)
                  Optionally comments/closes issue
```

Tape tracks session knowledge; issues track work items.
