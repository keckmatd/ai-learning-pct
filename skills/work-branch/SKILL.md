---
name: work-branch
description: Create an isolated git worktree for parallel work.
allowed-tools:
  - bash
  - view
  - edit
  - create
---
# Work Branch

Create an isolated git worktree for parallel work.

## Usage

```
/work-branch <name> [--from-plan <task-id>] [--issue <number>]
```

## What This Does

1. Creates a git worktree with dedicated branch
2. Generates scoped CLAUDE.md with task context
3. Provides command to launch Claude Code in worktree

## Arguments

- `name` (required): Name for the worktree/branch
- `--from-plan`: Pull context from work-plan task
- `--issue`: Associate with GitHub issue

## Instructions

When the user runs `/work-branch`, do the following:

### Step 1: Validate Environment

```bash
# Check we're in a git repo
git rev-parse --git-dir

# Check for uncommitted changes
git status --porcelain
```

If dirty, warn and ask if they want to stash or commit first.

### Step 2: Determine Worktree Location

```bash
REPO_NAME=$(basename $(git rev-parse --show-toplevel))
WORKTREE_ROOT="${CLAUDE_WORKTREE_ROOT:-$HOME/worktrees}"
WORKTREE_PATH="$WORKTREE_ROOT/$REPO_NAME/$NAME"
```

### Step 3: Create Worktree

```bash
# Get main branch
MAIN_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
MAIN_BRANCH=${MAIN_BRANCH:-main}

# Create branch and worktree
git worktree add "$WORKTREE_PATH" -b "work/$NAME"
```

### Step 4: Gather Context

**If --from-plan specified:**
Read `harness/plan.md` and find the task:
```json
{
  "id": "task-auth",
  "description": "...",
  "files": ["src/auth/*.ts"],
  "dependencies": []
}
```

**If --issue specified:**

**github backend:**
```bash
gh issue view <number> --json title,body,labels
```

**local backend:**
Read `harness/issues.yaml` and find the issue with matching id.

**none backend:**
Issue numbers not available. Treat as if no --issue flag.

**Otherwise:**
Ask: "What's the scope of work for this branch?"

### Step 5: Generate Worktree CLAUDE.md

Write `$WORKTREE_PATH/CLAUDE.md`:

```markdown
# Work Branch: [name]

## Mission
[Task description from plan/issue/user input]

## Scope
Files to modify:
- [file patterns]

Do NOT modify:
- Files outside scope
- [any exclusions]

## Context
[Relevant architecture notes]

## When Done
1. Commit changes with descriptive message
2. Run: /work-merge [name]

## Links
- Parent branch: [main branch]
- Issue: #[number] (if associated)
- Plan task: [task-id] (if from plan)
```

### Step 6: Update Issue (if associated)

**github backend:**
```bash
gh issue comment <number> --body "Working in branch: work/$NAME"
```

**local backend:**
No comments in local issues. Skip this step (branch info tracked in progress.md).

**none backend:**
Skip.

### Step 7: Report

```
Branch created.

Location: ~/worktrees/[repo]/[name]
Branch: work/[name]
Issue: #[number] (if any)

To start working:
  cd ~/worktrees/[repo]/[name] && claude

Or open new terminal and run:
  claude ~/worktrees/[repo]/[name]

When done: /work-merge [name]
```

## Example Workflows

**From a plan:**
```
/work-plan "#42"
# Shows: task-auth, task-api, task-integration

/work-branch task-auth --from-plan task-auth --issue 43
# Creates worktree with full context from plan + issue
```

**Ad-hoc parallel work:**
```
/work-branch experiment-new-api
# Prompts for scope, creates isolated workspace
```

**Multiple parallel branches:**
```
/work-branch feature-a
/work-branch feature-b
/work-branches  # Shows both
```

## Environment Variables

- `CLAUDE_WORKTREE_ROOT`: Override default ~/worktrees location
