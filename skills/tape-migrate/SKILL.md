---
name: tape-migrate
description: Migrate progress.md sessions to tape entries.
allowed-tools:
  - bash
  - view
  - edit
  - create
---
# Tape Migrate

Migrate progress.md sessions to tape entries.

## Usage

```
/tape-migrate
```

## What This Does

1. Parses all sessions from `harness/progress.md`
2. Creates tape entries for each session (checkpoint + milestones)
3. Archives progress.md to `harness/progress.md.archived`

## Instructions

When the user runs `/tape-migrate`:

### Step 1: Check Prerequisites

- Verify `harness/progress.md` exists
- Verify tape MCP is available (try calling `mcp__session-context__tape_append` with a test)
- If progress.md doesn't exist, tell user "Nothing to migrate"
- If MCP unavailable, tell user to restart Claude Code

### Step 2: Parse Progress File

Read `harness/progress.md` and extract each session:

```
### Session N - YYYY-MM-DD
- [accomplishment]
- [accomplishment]
- **Issues:** ...
- **Commit:** [hash]
- **State:** [handoff message]
```

For each session, extract:
- Session number and date
- Accomplishments (bullet points that aren't State/Commit/Issues)
- Commit hash (if present)
- State line (the handoff)
- Issues mentioned

### Step 3: Create Tape Entries

For each session, call `mcp__session-context__tape_append`:

1. **Checkpoint entry:**
```
type: checkpoint
scope: ["global"]
content: "Session N: [State line]. Commit: [hash]" (or just State if no commit)
expires: "+30d"
```

2. **Milestone entries** (one per accomplishment):
```
type: milestone
scope: ["global"] (add "issue/N" if accomplishment mentions an issue)
content: "[accomplishment text]"
expires: "+30d"
```

Use `+30d` expiry for historical entries — long enough to be useful, short enough to eventually decay.

### Step 4: Archive Progress File

```bash
mv harness/progress.md harness/progress.md.archived
```

### Step 5: Confirm

```
Migrated N sessions to tape.

Sessions: 1-N
Entries created: X checkpoints, Y milestones
Archived: harness/progress.md → harness/progress.md.archived

Run /ws to verify tape-based session loading.
```

## Notes

- This is a one-time migration per project
- If migration fails partway, tape entries are still valid — just re-run
- The archived file is kept for reference, can be deleted later
- New /wd calls will write to tape, not progress.md
