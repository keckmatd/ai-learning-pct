# AI Learning PCT

Complete AI workshop package for PCT cabinet -- interactive presentation site,
copilot-dotfiles harness, Nationwide templates, and hands-on exercises.

## Directory Structure

```
site/           Astro presentation site (slides + docs)
curriculum/     Source markdown for workshop content
cheatsheets/    Quick reference cards for participants
templates/      Output templates (PowerPoint, research briefs)
skills/         Workflow skills for the copilot-dotfiles harness
agents/         Agent definitions
mcp/            MCP server (session-context)
```

## Quick Start

```bash
cd site
npm install
npm run dev
# Opens at http://localhost:4321
```

## Workshop Overview

**Duration**: 90 minutes
**Audience**: PCT cabinet members familiar with browser AI, new to CLI

| Part | Topic | Time |
|------|-------|------|
| 1 | The Machinery -- tokens, context windows, RAG, MCP | 25 min |
| 2 | Why CLI Changes Everything -- browser vs CLI, session management | 15 min |
| 3 | Hands-On with copilot-dotfiles -- install, exercises | 40 min |
| 4 | The Promise -- demos and next steps | 10 min |

**Learning arc**: Browser AI User -> Understands the machinery -> CLI Builder

## Deployment

GitHub Pages via GitHub Actions. Push to `main` triggers a build and deploy
of the `site/` directory.

## Curriculum

See [curriculum/00-overview.md](curriculum/00-overview.md) for the full
session flow, facilitator notes, and success metrics.
