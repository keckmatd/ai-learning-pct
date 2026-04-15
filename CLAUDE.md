# Project: AI Learning PCT

> Project-specific Claude configuration. Inherits from ~/.claude/CLAUDE.md (universal director).

## Project Overview

Complete AI workshop package for PCT cabinet — interactive presentation site, bundled copilot-dotfiles harness, Nationwide templates, and hands-on exercises. Transforms browser AI users into CLI builders.

**Two usage tiers:**
1. **Passive**: Just having harness installed improves AI interactions (instructions, superpowers, templates)
2. **Active**: `/ws` → `/wp` → `/we` → `/wd` workflow for session continuity and parallel execution

## Architecture

```
site/                       # Astro presentation (planned)
curriculum/                 # Source markdown for slides/docs
facilitator/                # Workshop running notes
cheatsheets/                # Quick reference cards

# Bundled copilot-dotfiles harness
copilot-instructions.md     # Global instructions
skills/                     # Workflow skills (work-*, housekeeping, etc.)
templates/                  # Output templates + PCT additions
mcp/                        # MCP server (session-context)
agents/                     # Agent definitions

harness/                    # THIS PROJECT's state
├── config.yaml             # issue_backend: local
├── spirit.md               # Project vision/phase
├── plan.md                 # Active execution plan
└── issues.yaml             # Local issue tracker
```

## Key Files

- `harness/plan.md` - Current execution plan (Phase 1A: Astro infrastructure)
- `harness/issues.yaml` - 22 issues covering Phases 1-4
- `docs/superpowers/specs/2025-04-15-presentation-site-design.md` - Site architecture spec
- `curriculum/00-overview.md` - 90-minute session flow

## Development

### Session Start
```bash
/ws   # Loads spirit + plan + issues
```

### Execute Plan
```bash
/we   # Execute current plan with subagents
```

### Preview Site (after Phase 1A)
```bash
cd site && npm run dev
```

## Project-Specific Conventions

### Content Style
- Conversational, not academic
- Show > tell (examples over explanations)
- Dark mode presentation, light mode docs option

### Issue Workflow
- `issue_backend: local` — uses `harness/issues.yaml`
- Labels: `phase-1a`, `phase-1b`, `next`, etc.
- `next` label = priority for current work

## Current Phase

**Phase 1A: Infrastructure** (in progress)
- Initialize Astro project with Tailwind
- Create layouts (Slide, Docs, Base)
- Implement slide navigation
- Design system (dark mode, fonts)
- GitHub Pages deployment

See `harness/plan.md` for detailed tasks.

## Timeline

~1 month to workshop:
- Week 1: Astro infrastructure (Phase 1A)
- Week 2: Content migration + templates (Phase 1B)
- Week 3: Polish + dry run (Phase 1C)
- Week 4: Buffer

---

*This file is project-specific and should be committed to the repo.*
