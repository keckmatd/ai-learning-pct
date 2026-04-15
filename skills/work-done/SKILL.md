---
name: work-done
description: Save session state to the tape system for clean handoff.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - ask_user
---
# Work Done

Save session state to the tape system for clean handoff.

## What This Does

- Analyzes what happened this session
- Updates issues worked on (GitHub, local, or none)
- Updates spirit.md if phase/decisions changed
- Writes tape entries (checkpoint, milestones, decisions)
- No manual archiving needed — tape auto-decays

## Tape Entry Types

| Type | Purpose | Default TTL |
|------|---------|-------------|
| checkpoint | Session state/commit (the handoff) | 7 days |
| milestone | Accomplishments (what got done) | 30 days |
| decision | Key decisions made | 14 days |

## Instructions

When the user runs `/work-done` or `/wd`, do the following:

### Step 1: Analyze Session

Review what happened this session:
- Files created or modified
- Git commits made (get latest hash)
- Key decisions or pivots
- Current state of work
- Issues worked on

### Step 2: Update Issues

**github backend:**

For each issue worked on:
- If **completed**: Close with comment summarizing what was done
- If **in progress**: Add comment with progress update
- If **blocked**: Add `blocked` label, comment explaining blocker

```bash
# Close completed issue
gh issue close <number> --comment "Completed in session"

# Add progress comment
gh issue comment <number> --body "Progress: [what was done]"

# Update labels if needed
gh issue edit <number> --add-label "blocked"
gh issue edit <number> --remove-label "next"
```

**local backend:**

Read `harness/issues.yaml` and update each issue worked on:
- If **completed**: Set `state: closed`
- If **in progress**: Leave `state: open`
- If **blocked**: Add `blocked` to labels, remove `next` from labels

Write updated yaml back.

**none backend:**

Skip issue updates.

### Step 3: Check Spirit Updates

Read `harness/spirit.md` and determine if updates needed:
- Did the phase change?
- Were key decisions made?

If updates needed, edit spirit.md directly.

### Step 4: Write Tape Entries

**Try MCP first.** Call `mcp__session-context__tape_append` for each entry.

**Resolve project key first:** Read `~/.machine-id` and look up the current project in `registry/machines.yaml` to get the project key (e.g., `claude-dotfiles`). If lookup fails, fall back to the basename of the project root directory. The MCP's `tape_append` will also auto-inject the project scope, but include it explicitly for clarity.

1. **Checkpoint entry** (required):
```
type: checkpoint
scope: ["global", "project/<project-key>"]
content: "[State/handoff message]. Commit: [hash]"
expires: "+7d"
```

2. **Milestone entries** (for each accomplishment):
```
type: milestone
scope: ["global", "project/<project-key>", "issue/N"]  # include issue if applicable
content: "[What was accomplished]"
expires: "+30d"
```

3. **Decision entries** (if any key decisions):
```
type: decision
scope: ["global", "project/<project-key>"]
content: "[What was decided]"
expires: "+14d"
```

**If MCP unavailable,** fall back to appending to `harness/progress.md`:
```markdown
### Session [N] - [YYYY-MM-DD]
- [Accomplishment 1]
- [Accomplishment 2]
- **Issues:** #X (closed), #Y (progress)
- **Commit:** [hash]
- **State:** [handoff]
```

### Step 5: Pattern Graduation Check

After writing tape entries, check if any recurring patterns should graduate to permanent CLAUDE.md rules.

1. Call `mcp__session-context__tape_search` with `query: "decision"` and `query: "discovery"` (two calls)
2. Scan results for patterns that appear 3+ times across different sessions
3. If recurring patterns found, propose them:
   ```
   Recurring pattern detected: "[pattern summary]"
   This has appeared in 3+ sessions. Add to CLAUDE.md? (y/n)
   ```
4. If user says yes, append the rule to the appropriate CLAUDE.md section
5. If no recurring patterns found, skip silently

**If MCP unavailable,** skip this step silently.

### Step 6: Wiki Graduation Check

If a wiki vault exists (`~/.copilot/wiki.yaml` → `vault_path:`, or `~/brain/`):

1. Check if any wiki pages were created or updated this session:
   - `git -C ~/brain diff --name-only HEAD -- 'wiki/*.md' | grep -v -e 'index.md' -e 'log.md'`

2. For each modified page, read its `type:` from frontmatter

3. Apply graduation rules:
   - `type: pattern` → **Always flag**: "This pattern may be generalizable. Graduate to CLAUDE.md or a skill?"
   - `type: tool` → Check if the tool is used on other machines (grep `registry/machines.yaml` for the tool/stack). If multi-machine, flag.
   - `type: domain` → Skip (rarely generalizable)
   - `type: project` → Skip (never generalizable)
   - `type: source-summary` → Skip

4. For each graduation candidate, present:
   ```
   Wiki graduation candidate:
   [[Page Title]] (pattern)
   Summary: [first paragraph from page]

   Graduate to: (a) CLAUDE.md rule  (b) New skill  (c) Skip
   ```

5. If user chooses (a): Distill the page into a concise rule and append to the appropriate CLAUDE.md section
6. If user chooses (b): Note it as future work (create an issue or tape entry)
7. If user chooses (c): Skip silently

**If no vault or no modified pages,** skip silently.

### Step 7: Confirm

```
Saved to tape.

Checkpoint: [state summary]
Milestones: N entries
Decisions: N entries
Commit: [hash]
Issues: #X closed, #Y updated

Next: /ws
```

## Scope Convention

- `global` — always include, cross-cutting context
- `project/<key>` — tie to specific project (e.g., `project/claude-dotfiles`)
- `issue/N` — tie to specific GitHub issue
- `task/slug` — tie to logical task group

## Design Principles

- **Silent by default** - Claude infers everything from session context
- **Issues as truth** - Issues reflect current state (github/local/none)
- **Handoff-focused** - The checkpoint is what `/ws` will surface
- **Spirit stays current** - If something changed, update it now
- **Low friction** - User says `/wd`, session is saved, done
- **Auto-decay** - No manual archiving, tape prunes itself
