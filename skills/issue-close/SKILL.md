---
name: issue-close
description: Close an issue with optional review gate.
allowed-tools:
  - bash
  - view
  - edit
  - ask_user
---
# Issue Close

Close an issue with optional review gate.

**Usage:** `/issue-close N` where N is the issue number

## What This Does

- Verifies issue exists and is open
- Checks if code changes were made (suggests review if so)
- Closes issue with summary comment
- Logs closure in progress.md

## Instructions

When the user runs `/issue-close N`, follow these steps:

### Step 1: Verify Issue

**github backend:**
```bash
gh issue view N --json number,title,state,labels,body
```

**local backend:**
Read `harness/issues.yaml` and find issue with id N.

**none backend:**
Warn: "Issue tracking is disabled. Nothing to close." Stop.

If issue is already closed, inform user and stop.

### Step 2: Check for Associated PR (github backend only)

**github backend:**

Look for PRs that reference this issue:

```bash
# Check for PRs mentioning this issue
gh pr list --state all --search "closes #N OR fixes #N OR resolves #N" --json number,title,state,url --limit 5
```

Also check the current branch for an open PR:
```bash
gh pr list --head "$(git branch --show-current)" --state open --json number,title,url --limit 1
```

**local backend:** Skip PR check entirely (no PR integration).

### Step 3: Review Gate (github backend only)

**github backend:**

**If a PR exists for this issue:**

Check if `/code-review` was run on it (look for Claude review comments):
```bash
gh pr view <PR_NUMBER> --comments --json comments
```

**Decision tree:**

| Situation | Action |
|-----------|--------|
| PR exists, review comment found | Proceed to close |
| PR exists, no review, PR is open | Suggest: "Run `/code-review <PR>` first?" |
| PR exists, no review, PR is merged | Ask for opt-out reason |
| No PR, trivial issue (docs, chore) | Proceed to close |
| No PR, code changes made | Suggest review, but don't block |

**If user opts out of review:**
1. Ask for brief reason (e.g., "trivial fix", "already reviewed manually")
2. Record in closure comment

**local backend:** Skip review gate. Proceed directly to close.

### Step 4: Close Issue

**github backend:**
```bash
gh issue close N -c "Closed in session [N]. Summary: [what was done]"
```

**For issues with review opt-out:**
```bash
gh issue close N -c "Closed. Review skipped: [reason]"
```

**local backend:**
Read `harness/issues.yaml`, set the issue's `state: closed`, write back.

### Step 5: Update Progress

If `harness/progress.md` exists and has a current session entry, append:
```
- Issues: #N (closed[, review skipped: reason])
```

### Step 6: Confirm

```
Closed #N: [title]
[If skipped: Review skipped - reason: "[reason]"]
```

## Design Principles

- **Gate, not block** - Review is encouraged, not required
- **Accountability** - Opt-outs are logged with reasons
- **Traceability** - Closure comments link back to workflow
- **Lightweight** - For trivial issues, no friction

## Edge Cases

- **Issue has no code changes** (planning, research): Skip review gate, just close
- **Issue spans multiple PRs**: Check if any PR was reviewed
- **User closed issue manually**: That's fine too, this is just the recommended flow
