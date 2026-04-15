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
| Skills | `skills/` | Bundled workflow skills |
| Templates | `templates/` | Output templates + PCT additions |
| Facilitator | `facilitator/` | Workshop running notes |

## Current Phase

**Phase 1B: Content Migration** (ready to plan)

Completed:
- Session 1: Curriculum structure, copilot-dotfiles bundled, spec, 22 issues, plan
- Session 2: Phase 1A infrastructure complete (Astro + Tailwind, layouts, slide nav, design system, GH Pages workflow)

Next:
- Add content rendering infrastructure (MDX, syntax highlighting, Mermaid)
- Write curriculum migration script
- Migrate Parts 1-4 slides
- Create docs section with cheatsheets

Blocked:
- GitHub repo creation (token permissions on work-aws) — create manually
- Deployment verification (needs repo pushed first)
