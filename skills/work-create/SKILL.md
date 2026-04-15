---
name: work-create
description: Create a new issue with smart label inference.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - ask_user
---
# Work Create

Create a new issue with smart label inference.

## What This Does

- Parses user's description to infer work type
- Creates issue with appropriate labels (GitHub, local, or none)
- Offers planning or immediate work
- Seeds context for the task

## Instructions

When the user runs `/work-create [description]` or `/wc [description]`:

### Step 1: Parse Intent

Infer work type from description keywords:

| Type | Keywords |
|------|----------|
| `feat` | add, create, implement, new, build |
| `fix` | fix, bug, broken, crash, error |
| `refactor` | refactor, restructure, extract, clean up |
| `chore` | chore, deps, ci, build, tooling |
| `docs` | docs, document, readme |

**Scope inference:**
- Check if description mentions specific areas/packages
- Look for patterns in the project's existing labels via `gh label list`
- If unclear, create with just the type label

### Step 2: Check for Urgent Flag

If `/wc --urgent [description]`:
- Add `next` label
- Note the priority in the issue body

### Step 3: Create Issue

**github backend:**

```bash
gh issue create \
  --title "[derived title]" \
  --label "[type]" \
  --body "## Description

[User's description]

## Acceptance Criteria

- [ ] [Inferred from description]

## Notes

Created via /work-create"
```

**local backend:**

Read `harness/issues.yaml`, append new issue, increment `next_id`:

```yaml
- id: [next_id]
  title: "[derived title]"
  state: open
  labels: [[type], ...]
  body: "[description]"
```

Display: `Created #N: [title] (local)`

**none backend:**

```
Issue tracking disabled. Describe the work directly.
```

Skip issue creation, proceed to Step 4 options without issue reference.

**Title derivation (all backends):**
- Extract action and subject from description
- Format: "Add [feature]", "Fix [bug]", "Refactor [component]"
- Keep under 50 chars if possible

### Step 4: Offer Next Steps

```
Created #N: [title]
Labels: [list]

Options:
- Plan: Explore codebase and design approach
- Start: Begin implementation now
- Context: Show related code first
```

**If user wants planning:**
1. Read relevant code (similar patterns, extension points)
2. Draft implementation approach
3. Ask clarifying questions if gaps
4. Optionally add plan to issue as comment

### Step 5: Seed Context

If project has a CLAUDE.md:
- Check for relevant sections based on issue scope
- Load any mentioned context files

```
Ready to work on #N.

[Relevant context from CLAUDE.md if any]
```

## Urgent Mode

`/wc --urgent [description]`:
- Same as above but adds `next` label
- Suggest `/work-done` if there's uncommitted work from another issue

## Examples

### Feature Request

```
User: /wc Add dark mode toggle to settings

Claude:
Inferred type: feat (keywords: "add")

Creating issue...

Created #42: Add dark mode toggle to settings
Labels: feat

Options:
- Plan: I'll explore the settings UI and theme system
- Start: Begin implementation now
- Context: Show current settings code
```

### Bug Fix

```
User: /wc Fix crash when user submits empty form

Claude:
Inferred type: fix (keywords: "fix", "crash")

Creating issue...

Created #43: Fix crash on empty form submission
Labels: fix

Want me to investigate the crash first?
```

### Urgent Work

```
User: /wc --urgent Production API returning 500 errors

Claude:
Inferred type: fix (keywords: "errors")
Priority: urgent (--urgent flag)

Creating issue...

Created #44: Fix production API 500 errors
Labels: fix, next

This is marked urgent. Starting investigation now.
```

## Design Principles

- **Quick creation** - Don't over-engineer the issue body
- **Smart defaults** - Infer what we can, ask only when unclear
- **Action-oriented** - Create issue then move to work
- **Flexible** - Works with any project's label scheme
