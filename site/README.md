# AI Learning PCT -- Presentation Site

Astro-based presentation site with slide navigation, dark mode, and docs pages.

## Local Development

```bash
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to ./dist/
npm run preview   # Preview production build locally
```

## Content Collections

### Slides

Markdown files in `src/content/slides/`, organized by part:

```
src/content/slides/
  01-concepts/      Part 1: The Machinery
  02-cli/           Part 2: Why CLI Changes Everything
  03-hands-on/      Part 3: Hands-On
  04-inspiration/   Part 4: The Promise
```

Slides are sorted by `part` then `order` from frontmatter. Each file uses
this frontmatter schema:

```yaml
---
title: "Slide Title"
part: 1
order: 3
layout: "content"       # title | content | diagram
notes: "Speaker notes"
sourceFile: "topic-name"
---
```

### Docs

Markdown files in `src/content/docs/` for reference material:

- `cheatsheets/` -- command reference cards
- `exercises/` -- hands-on exercise instructions
- `index.md` -- docs landing page

## Key Components

| Component | Purpose |
|-----------|---------|
| `SlideLayout` | Full-screen slide presentation layout |
| `SlideNav` | Previous/next navigation between slides |
| `SlideDrawer` | Slide list panel for quick navigation |
| `SlideControls` | Keyboard and touch controls |
| `OverviewGrid` | Grid view of all slides by part |
| `ThemeToggle` | Dark/light mode switch |
| `Mermaid` | Renders Mermaid diagrams in slides |

## Layouts

- **SlideLayout** -- presentation mode (dark, full-screen)
- **DocsLayout** -- documentation pages (sidebar navigation)
- **BaseLayout** -- shared HTML shell, theme, fonts

## Adding Content

**New slide**: Create a `.md` file in the appropriate part folder under
`src/content/slides/`. Set `part` and `order` in frontmatter to control
sort position.

**New docs page**: Create a `.md` file under `src/content/docs/`. It will
be picked up automatically and rendered with DocsLayout.
