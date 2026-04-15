---
name: housekeeping
description: Audit and clean project documentation for accuracy, context efficiency, and progressive disclosure.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
---
# Housekeeping

Audit and clean project documentation for accuracy, context efficiency, and progressive disclosure.

## Usage

```
/housekeeping
/hk
```

## What This Does

- Audits docs loaded every Claude session (CLAUDE.md, spirit.md, etc.)
- Finds duplication, staleness, and inaccuracies
- Applies progressive disclosure (lean core + reference pointers)
- Validates skills/workflows won't break
- Cleans up completed work artifacts (specs, issues, scaffolding)

## When to Use This

- After completing a major epic or milestone
- When sessions feel slow or context-heavy
- When you notice CLAUDE.md or spirit.md are stale
- Periodic maintenance (monthly or after 5+ sessions)

## Philosophy: Progressive Disclosure

**Core principle:** Claude should know what exists and pull context on-demand, not load everything every session.

**The pattern:**
1. **Always loaded** (CLAUDE.md) — Lean operational reference: current phase, daily commands, conventions, key principles
2. **Pointer section** — "Reference Documents" listing deeper docs by domain
3. **On-demand docs** — Full details (constitution.md, research findings, specs) pulled when working in that domain

**What belongs in CLAUDE.md:**
- Current phase and status
- Daily workflow commands (prefer `just` recipes)
- Conventions (brief patterns, not full stack tables)
- Key principles (1-liners)
- Content generation rules (if applicable)
- Reference Documents section with pointers

**What belongs elsewhere:**
- Full tech stack tables → constitution.md or research findings
- Completed epic lists → GitHub Issues or archived gameplan
- Detailed workflows → dedicated docs with pointers from CLAUDE.md
- Historical decisions → archive files

## Instructions

When the user runs `/housekeeping` or `/hk`, follow this process:

### Step 1: Audit Context-Loaded Files

Identify what gets loaded every session:

```bash
# Always loaded
wc -l CLAUDE.md

# Check for harness files (loaded via /ws MCP)
wc -l harness/spirit.md harness/progress.md 2>/dev/null

# Check for other auto-loaded files
ls -la .copilot/ 2>/dev/null
```

Report total lines and identify the biggest context consumers.

### Step 2: Check for Duplication

Look for content that appears in multiple places:

- Tech stack tables in both CLAUDE.md and constitution.md?
- Principles listed in both spirit.md and CLAUDE.md?
- Epic/gameplan status in multiple files?

Duplication means extra context cost AND drift risk.

### Step 3: Check for Staleness

Look for outdated information:

- "Current phase" or "Next" items that are actually complete
- Epic tables with wrong statuses
- "Coming soon" content that now exists
- Session numbers or dates that are old

```bash
# Check for "next" or "in progress" markers
grep -i "next\|in progress\|coming soon" CLAUDE.md harness/spirit.md
```

### Step 4: Check for Accuracy

Look for inconsistencies:

- Author name variations (Matt vs Matthew)
- File paths that no longer exist
- Commands that have changed
- Spec statuses (Draft vs Complete)

```bash
# Check spec statuses
grep -r "Status:" docs/superpowers/specs/ 2>/dev/null
```

### Step 5: Review Tape for Graduation Candidates

Query tape for recurring decision/discovery patterns not yet captured in CLAUDE.md:

```
mcp__session-context__tape_search(query: "decision")
mcp__session-context__tape_search(query: "discovery")
```

Look for patterns appearing 3+ times across different sessions. Cross-reference with existing CLAUDE.md rules — if a pattern is already captured, skip it. If not, propose it as a CLAUDE.md addition.

**If MCP unavailable,** skip this step.

### Step 5.5: Wiki Deep Scan

If a wiki vault exists (`~/.copilot/wiki.yaml` → `vault_path:`, or `~/brain/`):

1. **Run lint checks** (same as `/wiki-lint`):
   - Count total pages by type
   - Find orphaned pages (no inbound links)
   - Find stale pages (90+ days without update)
   - Check for broken wikilinks
   - Verify index completeness

2. **Scan for graduation candidates** across ALL wiki pages (not just this session):
   - Read all `type: pattern` pages — any not yet reflected in CLAUDE.md or skills?
   - Read `type: tool` pages for multi-machine tools — any generalizable insights?
   - Cross-reference with existing CLAUDE.md rules to avoid duplicates

3. **Check for merge/split candidates:**
   - Pages with heavy overlap (share 5+ tags and similar content) → suggest merge
   - Pages over 500 lines → suggest split into sub-topics

4. **Include in findings table (Step 8):**

   ```
   | Wiki | N total pages, M orphans, K stale | Run /wiki-lint for details |
   | Wiki graduation | P pattern pages not in CLAUDE.md | Review for promotion |
   ```

**If no vault exists,** skip silently with a note: "No wiki vault found. Run install.sh to set up ~/brain/"

### Step 6: Identify Scaffolding to Delete

Look for files that served their purpose:

- Research prompt files (if findings files exist)
- Old plan files (if work is complete and committed)
- Archived progress files (if tape system is active)

### Step 7: Validate Skills Won't Break

Before proposing changes, check what skills depend on these files:

**Common dependencies:**
- `/ws` (work-start) — Reads spirit.md via MCP for title, summary, phase
- `/wd` (work-done) — Updates spirit.md if phase changed
- `/wp`, `/we` — May read harness/plan.md

**The rule:** If a skill reads a file, that file must continue to exist with the expected structure. Content can be trimmed, but structure must remain.

### Step 8: Present Findings

Summarize findings in a table:

```
## Housekeeping Audit

| Area | Finding | Recommendation |
|------|---------|----------------|
| CLAUDE.md | 289 lines, duplicates stack tables | Trim to ~150, add Reference Docs section |
| spirit.md | Gameplan section stale | Archive to gameplan-history.md |
| ... | ... | ... |

**Context savings estimate:** ~X lines (~Y%)
```

### Step 9: Propose Approach (Use Brainstorming Pattern)

Present 2-3 approaches with tradeoffs:

| Approach | Savings | Effort | Risk |
|----------|---------|--------|------|
| A: Surgical fixes | Low | 15 min | Low |
| B: Consolidate | Medium | 30 min | Medium |
| C: Full progressive disclosure | High | 45 min | Medium |

Recommend one and explain why.

### Step 10: Validate with User

Get approval before making changes. The user may:
- Accept the recommendation
- Choose a different approach
- Identify things you missed
- Add constraints (e.g., "keep the video workflow section")

### Step 10: Execute Changes

For each approved change:

1. **Archive before delete** — Move content to archive files rather than deleting outright
2. **Add reference pointers** — When trimming, add pointers to where the full content lives
3. **Update cross-references** — If file A pointed to file B and B moved, update A
4. **Verify skills** — Quick smoke test that `/ws` still works after spirit.md changes

### Step 11: Clean Up Issues

Check GitHub Issues for staleness:

```bash
gh issue list --state open --json number,title,labels --limit 20
```

For each open issue:
- Is the work actually done? → Close with summary
- Is progress made? → Add comment
- Is it blocked? → Verify blocker is still valid
- Is it stale? → Consider closing or updating

### Step 12: Commit and Report

Commit all changes with a clear message:

```
chore: housekeeping - trim docs, add progressive disclosure

- CLAUDE.md: X→Y lines, add reference docs section
- spirit.md: X→Y lines, archive history
- Delete scaffolding files
- Mark specs complete
- Update issue statuses

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

Report final savings:

```
## Housekeeping Complete

| File | Before | After | Savings |
|------|--------|-------|---------|
| CLAUDE.md | 289 | 141 | 148 lines (51%) |
| spirit.md | 246 | 51 | 195 lines (79%) |
| **Total** | 535 | 192 | **343 lines (64%)** |

Issues: #X closed, #Y updated
Commit: <hash>
```

## Reference Documents Section Template

When adding progressive disclosure to CLAUDE.md, use this pattern:

```markdown
## Reference Documents

Pull these when working in their domain:

- `docs/constitution.md` — Full tech stack details, principles, boundaries
- `docs/content-framework.md` — Author voice, content specs, generation guidelines
- `harness/research/R0-*.md` — Backend library rationale
- `harness/research/R1-*.md` — Frontend library rationale
- `harness/spirit.md` — Project vision and current phase
- `harness/archive/gameplan-history.md` — Completed implementation waves
```

## Common Patterns

### Spirit.md: The Universal Project File

`spirit.md` is a global convention across all projects. It's read by `/ws` (via MCP) and updated by `/wd`. The structure must remain stable for skills to work.

**Required structure (MCP and skills depend on this):**

```markdown
# {Project Name}: Project Spirit

> {One-line summary — MCP extracts this for session primer}

## Vision
{2-3 paragraphs max — why this project exists, what it's trying to achieve}

## Principles
{Numbered 1-liners — the non-negotiable rules for this project}

## Tech Stack
{Summary table or brief paragraph — point to constitution.md or research docs for details}

## {Domain Section}
{Project-specific: Tracks, Components, Domains, Services — whatever structure fits}

## Current Phase
{CRITICAL: This is what /ws surfaces and /wd updates. Keep accurate, 5-10 lines.}
{Format: Status line, then "Next:" items, then "Blocked:" if applicable}
```

**The Current Phase section is the living part.** Everything else changes rarely.

**What belongs in spirit.md:**
- Project identity (name, summary, vision)
- Principles (stable, rarely change)
- Tech stack summary (stable after research phase)
- Domain structure (tracks, components, etc.)
- Current Phase (actively maintained)

**What does NOT belong in spirit.md:**
- Detailed implementation waves/gameplan → archive
- Full tech stack tables → constitution.md
- Historical decisions → archive or ADRs
- Phase descriptions (Beta/MVP/Production) → constitution.md
- Session history → tape system

**Target size:** 50-80 lines. If spirit.md exceeds 100 lines, it's accumulating history that should be archived.

### Trimming spirit.md

Keep:
- Header with title and one-line summary (MCP reads this)
- Vision section (brief)
- Principles (1-liners, not paragraphs)
- Tech stack summary (table, not detailed tables)
- Domain overview (table or brief list)
- Current Phase (accurate, 5-10 lines)

Move to archive:
- Completed waves/gameplan
- Historical decisions
- Detailed stack tables (already in constitution.md)
- Phase descriptions (Beta/MVP/Production)

### Trimming CLAUDE.md

Keep:
- Current phase (2-3 lines)
- Daily workflow commands
- Quality commands
- Content generation rules (critical for skills)
- Conventions (brief patterns)
- Key principles (1-liners)
- Reference Documents section

Remove or move:
- Full command tables (point to `just --list`)
- Full stack tables (point to constitution.md)
- Epic status tables (point to GitHub Issues)
- Detailed research summaries (point to research docs)

### Archive Directory: harness/archive/

The archive is for historical content that doesn't need to be loaded every session but is valuable for:
- Other developers joining the project
- AI systems needing full context
- Future reference when questions arise

**Track it in git** (remove from .gitignore if present). Archive is history, not ephemeral state.

**What goes in archive:**
- `gameplan-history.md` — Completed implementation waves, historical decisions
- `sessions-*.md` — Session logs before tape system, or tape exports
- Research summaries if the full findings docs are too large

**What stays out of archive:**
- Tape files (ephemeral, auto-decay)
- In-progress plans (still active)
- Anything that will be referenced frequently (keep in main docs)

## Notes

- This skill uses the brainstorming pattern but focused on docs, not features
- Always validate skills before and after changes
- Archive rather than delete — you may need the history
- The goal is context efficiency, not minimalism for its own sake
- If something is referenced frequently, it belongs in CLAUDE.md
