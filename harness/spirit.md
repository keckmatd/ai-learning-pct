# AI Learning PCT: Project Spirit

> Complete AI workshop package for PCT cabinet — presentation site, bundled harness, templates, and hands-on exercises to transform browser AI users into CLI builders.

## Vision

Give PCT cabinet members a **huge headstart** in AI-augmented work. Not a dumbed-down tutorial, but a complete system they can use passively (instructions, superpowers, templates) or actively (the /ws → /wp → /we → /wd workflow). The presentation site IS the onboarding — beautiful, interactive, deployed on GitHub Pages.

## Principles

1. **Respect their intelligence** — full harness, two usage tiers (passive/active)
2. **Show, don't tell** — interactive presentation > static docs
3. **Immediate wins** — exercises produce real output (PowerPoints, research briefs)
4. **Growth path clear** — they know there's more when ready

## Tech Stack

- **Presentation**: Astro + Tailwind (static, GitHub Pages deployable)
- **Harness**: Bundled copilot-dotfiles (skills, templates, MCP, registry)
- **Content**: Markdown curriculum → rendered in Astro site

## Domains

| Domain | Path | Purpose |
|--------|------|---------|
| Site | `site/` | Astro presentation (GH Pages) |
| Curriculum | `curriculum/` | Source markdown for slides/docs |
| Skills | `.claude/commands/` | GHCP-compatible workflow skills |
| Templates | `templates/` | Output templates + PCT additions |
| Facilitator | `facilitator/` | Workshop running notes |

## Current Phase

**Phase 2: Audit Remediation — COMPLETE** (pending push + build verification on clean network)

Completed:
- Session 1: Curriculum structure, copilot-dotfiles bundled, spec, 22 issues, plan
- Session 2: Phase 1A infrastructure complete (Astro + Tailwind, layouts, slide nav, design system, GH Pages workflow)
- Session 3: GitHub repo created, Pages deployed, Phase 1B plan written
- Session 4: Phase 1B complete (157 slides migrated, docs section, templates, PCT skills with GHCP compatibility)
- Session 5: Phase 1C polish (landing page, overview grid, light mode, mobile, Mermaid diagrams)
- Session 6: Slide polish (diagram layouts, M-key drawer navigation, visual refinements)
- Session 7: Full project audit — 5 parallel agents audited UI, content, skills, docs, infra. 38 GitHub issues created. Issue backend switched from local to github.
- Session 8: Audit Remediation Waves 1-4. 17 tasks via parallel subagents, 16 commits, 18 issues closed (10 blocking + 8 high-priority).
- Session 9: Audit Remediation Waves 5-7. 18 tasks via parallel subagents, 21 commits, 19 issues closed (16 medium + 3 low). Roadmap renumbered to fix duplicate Phase 3.

Site live: https://keckmatd.github.io/ai-learning-pct/
Repo: https://github.com/keckmatd/ai-learning-pct

Skills added:
- `/pct-deck` - PowerPoint generation
- `/pct-memo` - Business memos
- `/pct-research` - Research briefs
- `/pct-cheatsheet` - Quick reference cards (markdown + HTML)

Open issues (2 — both low-severity follow-ups):
- #40: Commit subjects exceed 50-char CLAUDE.md limit (process discipline)
- #41: Remove narrating comments in SlideLayout.astro mermaid renderer

Next phase: **Phase 3: Workshop Polish** — pending first live workshop date. Before that:
- Push 38 unpushed commits to origin/main once on clean network
- Run `make install && make check && make build` to confirm nothing schema-fragile slipped through during proxy-blocked verification window
