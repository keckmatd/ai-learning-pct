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

**Phase 1C: Polish** (ready to plan)

Completed:
- Session 1: Curriculum structure, copilot-dotfiles bundled, spec, 22 issues, plan
- Session 2: Phase 1A infrastructure complete (Astro + Tailwind, layouts, slide nav, design system, GH Pages workflow)
- Session 3: GitHub repo created, Pages deployed, Phase 1B plan written
- Session 4: Phase 1B complete (157 slides migrated, docs section, templates, PCT skills with GHCP compatibility)

Site live: https://keckmatd.github.io/ai-learning-pct/
Repo: https://github.com/keckmatd/ai-learning-pct

Skills added:
- `/pct-deck` - PowerPoint generation
- `/pct-memo` - Business memos
- `/pct-research` - Research briefs
- `/pct-cheatsheet` - Quick reference cards (markdown + HTML)

Next (Phase 1C):
- Design and build landing page (#13)
- Implement slide overview grid (#14)
- Add light mode toggle for docs (#15)
- Mobile responsiveness pass (#16)
- Dry run workshop (#17)
