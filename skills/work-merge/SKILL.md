---
name: work-merge
description: Merge a parallel work branch back to main and clean up.
allowed-tools:
  - bash
  - view
  - edit
  - create
---
# Work Merge

Merge a parallel work branch back to main and clean up.

## Usage

```
/work-merge <name> [--squash] [--no-delete]
```

## Arguments

- `name` (required): Branch/worktree name to merge
- `--squash`: Squash commits into single commit
- `--no-delete`: Keep worktree after merge (for reference)

## What This Does

1. Merges branch to main (with optional squash)
2. Removes git worktree
3. Deletes the branch
4. Updates/closes associated issue (GitHub, local, or none)

## Instructions

When the user runs `/work-merge`, do the following:

### Step 1: Find the Worktree

```bash
REPO_NAME=$(basename $(git rev-parse --show-toplevel))
WORKTREE_ROOT="${CLAUDE_WORKTREE_ROOT:-$HOME/worktrees}"
WORKTREE_PATH="$WORKTREE_ROOT/$REPO_NAME/$NAME"

# Verify it exists
git worktree list | grep "$NAME"
```

If not found, show available worktrees.

### Step 2: Check Worktree Status

```bash
cd $WORKTREE_PATH

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes in worktree"
fi

# Get commits to merge
git log --oneline origin/main..HEAD
```

If uncommitted changes exist:
```
Worktree has uncommitted changes:
  M src/auth/login.ts
  ? src/auth/temp.ts

Options:
1. Commit changes first
2. Stash and proceed
3. Discard changes
4. Cancel

Choice?
```

### Step 3: Return to Main Repo

```bash
cd $(git rev-parse --show-toplevel)
git checkout main
git pull origin main
```

### Step 4: Merge

**Standard merge:**
```bash
git merge work/$NAME --no-ff -m "Merge work/$NAME: [description]"
```

**Squash merge (if --squash):**
```bash
git merge work/$NAME --squash
git commit -m "[description]

Squashed commits from work/$NAME branch."
```

### Step 5: Handle Conflicts

If merge conflicts occur:
```
Merge conflicts detected:
  src/auth/login.ts
  src/api/routes.ts

Options:
1. Resolve conflicts now (I'll help)
2. Abort merge
3. Keep worktree, resolve manually later

Choice?
```

### Step 6: Push

```bash
git push origin main
```

### Step 7: Clean Up Worktree

Unless `--no-delete` specified:
```bash
git worktree remove $WORKTREE_PATH
git branch -d work/$NAME
```

### Step 8: Update Issue

If worktree had associated issue (extract from worktree CLAUDE.md):

**github backend:**
```bash
ISSUE=$(grep -o '#[0-9]*' $WORKTREE_PATH/CLAUDE.md | head -1 | tr -d '#')

if [ -n "$ISSUE" ]; then
  gh issue comment $ISSUE --body "Merged to main in [commit hash]"

  # Ask about closing
  echo "Close issue #$ISSUE? (y/n)"
fi
```

**local backend:**

Read `harness/issues.yaml`, find the associated issue. Ask about closing:
- If yes: set `state: closed`
- If no: leave open

No comment to add (local issues don't have comments).

**none backend:**

Skip issue updates.

### Step 9: Report

```
Merged: work/[name] → main

Commits: [N] commits merged
Method: [merge/squash]
Push: ✓ pushed to origin

Cleanup:
  Worktree: removed ~/worktrees/repo/[name]
  Branch: deleted work/[name]
  Issue: #[N] commented [and closed]

Remaining branches: /work-branches
```

## Safety Features

- Always pulls main before merge
- Warns about uncommitted changes
- Preserves worktree on conflict
- Confirms before closing issues

## Example

```
/work-branches
# Shows: feature-auth (5 ahead, #42)

/work-merge feature-auth --squash
# Squashes 5 commits, merges, closes #42, cleans up
```
