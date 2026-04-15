# Presentation Site Design Spec

**Status**: Reviewed  
**Date**: 2025-04-15  
**Author**: Claude + Matt  

## Summary

Build an Astro-based interactive presentation site for the PCT cabinet AI workshop. The site serves dual purposes: facilitator slides for the 90-minute workshop, and participant reference docs for after. Deploys statically to GitHub Pages.

## Goals

1. **Facilitator experience**: Full-screen slides with keyboard navigation, presenter notes
2. **Participant experience**: Navigable docs, searchable, works as post-workshop reference
3. **Distinctive design**: Professional but memorable — not generic AI output
4. **Zero friction deployment**: Push to main → live on GitHub Pages
5. **Content from source**: Curriculum markdown → rendered automatically

## Non-Goals

- Real-time collaboration features
- User accounts or progress tracking
- Mobile-first (desktop primary, mobile acceptable)
- CMS or admin interface

## Architecture

### Site Structure

```
site/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content collection definitions
│   │   ├── slides/             # Slide decks by part
│   │   │   ├── 01-concepts/
│   │   │   ├── 02-cli/
│   │   │   ├── 03-hands-on/
│   │   │   └── 04-inspiration/
│   │   └── docs/               # Reference documentation
│   │       ├── cheatsheets/
│   │       ├── exercises/
│   │       └── reference/
│   ├── layouts/
│   │   ├── SlideLayout.astro   # Full-screen presentation
│   │   ├── DocsLayout.astro    # Navigable documentation
│   │   └── BaseLayout.astro    # Shared HTML shell
│   ├── components/
│   │   ├── Slide.astro         # Single slide renderer
│   │   ├── SlideNav.astro      # Keyboard navigation + progress
│   │   ├── CodeBlock.astro     # Syntax highlighted code
│   │   ├── Diagram.astro       # ASCII/simple diagrams
│   │   └── CalloutBox.astro    # Tips, warnings, notes
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── slides/
│   │   │   └── [...slug].astro # Dynamic slide routes
│   │   └── docs/
│   │       └── [...slug].astro # Dynamic doc routes
│   └── styles/
│       ├── global.css          # Base styles, CSS variables
│       ├── slides.css          # Presentation-specific
│       └── docs.css            # Documentation-specific
├── public/
│   └── fonts/                  # Self-hosted fonts
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### URL Structure

**Base path**: Configurable via `astro.config.mjs`. Default assumes repo deployment at `https://<user>.github.io/ai-learning-pct/`. Set `base: '/ai-learning-pct'` in config.

| Route | Purpose |
|-------|---------|
| `/` | Landing page with workshop overview |
| `/slides/01-concepts/` | Part 1 slide deck index |
| `/slides/01-concepts/tokens-and-turns` | Individual slide (slug-based) |
| `/slides/02-cli/` | Part 2 slide deck index |
| `/slides/03-hands-on/` | Part 3 slide deck index |
| `/slides/04-inspiration/` | Part 4 slide deck index |
| `/docs/` | Documentation index |
| `/docs/cheatsheets/cli` | CLI quick reference |
| `/docs/exercises/powerpoint` | Exercise walkthroughs |

**Slide navigation**: Each slide has a slug-based URL derived from filename. Navigation arrows move through slides by `order` frontmatter within a part. URLs are shareable and refresh-persistent.

### Content Collections

**Slides Collection** (`src/content/slides/`)

Each slide is a markdown file:

```markdown
---
title: "Tokens & Turns"
part: 1
order: 3
notes: "Emphasize that AI re-reads everything each turn"
transition: "fade"
---

# Tokens & Turns

AI sees word-pieces, not words.

```
"Hello, how are you?" 
→ ["Hello", ",", " how", " are", " you", "?"]
→ 7 tokens
```
```

**Docs Collection** (`src/content/docs/`)

Standard markdown with frontmatter:

```markdown
---
title: "CLI Quick Reference"
category: "cheatsheets"
order: 1
---

# CLI Quick Reference
...
```

### Slide Navigation

**Keyboard controls**:
- `→` / `Space` / `Enter`: Next slide
- `←` / `Backspace`: Previous slide
- `Escape`: Exit to overview
- `P`: Toggle presenter notes
- `F`: Toggle fullscreen
- `O`: Slide overview grid

**URL-driven state**: Each slide has a unique URL (`/slides/01-concepts/3`) for direct linking and refresh persistence.

**Progress indicator**: Subtle progress bar at bottom showing position in current part.

## Design System

### Typography

```css
--font-display: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Slides */
--slide-title: 3.5rem / 1.1;
--slide-body: 1.75rem / 1.5;
--slide-code: 1.25rem / 1.6;

/* Docs */
--docs-title: 2rem / 1.2;
--docs-body: 1.125rem / 1.7;
```

### Color Palette

**Base**: Dark mode default (easier on projectors, feels modern)

```css
--bg-primary: #0f172a;      /* Slate 900 */
--bg-secondary: #1e293b;    /* Slate 800 */
--text-primary: #f8fafc;    /* Slate 50 */
--text-secondary: #94a3b8;  /* Slate 400 */

/* Accents - distinctive but professional */
--accent-primary: #38bdf8;   /* Sky 400 - links, highlights */
--accent-secondary: #a78bfa; /* Violet 400 - code, callouts */
--accent-success: #4ade80;   /* Green 400 - checkmarks */
--accent-warning: #fbbf24;   /* Amber 400 - warnings */
```

Light mode toggle available for docs (participant preference).

### Slide Layouts

**Title slide**: Centered, large title, optional subtitle
**Content slide**: Left-aligned title, body content
**Split slide**: Two columns (text + code, or text + diagram)
**Code slide**: Full-width code block with line highlighting
**Quote slide**: Large centered quote with attribution

### Animations

Subtle, purposeful:
- Slide transitions: 200ms fade or slide
- Code highlighting: 150ms background pulse
- Progress bar: Smooth width transition
- No gratuitous motion

## Technical Decisions

### Why Astro

- **Static output**: Perfect for GitHub Pages
- **Content Collections**: Type-safe markdown handling
- **Islands architecture**: Interactive bits where needed, static elsewhere
- **Fast builds**: Sub-second HMR, quick deploys

### Why Tailwind

- **Rapid styling**: Utility classes for quick iteration
- **Design tokens**: CSS variables for theming
- **Purged output**: Only ships used styles
- **Familiar**: Widely known, easy to maintain

### Why Not Slidev/Reveal.js

- **Flexibility**: We need docs mode too, not just slides
- **Integration**: Easier to share components between slides/docs
- **Customization**: Full control over design, not fighting a framework

## Migration Strategy

### From curriculum/ to site/

Current curriculum markdown needs light transformation:

1. **Split by slide**: Each `---` horizontal rule becomes a slide boundary
2. **Add frontmatter**: Title, part, order, notes
3. **Preserve content**: Teaching content stays intact
4. **Extract presenter notes**: `> "Facilitator note"` → frontmatter notes

Example transformation:

**Before** (`curriculum/01-concepts/tokens-and-turns.md`):
```markdown
# Tokens & Turns

**Time**: 5 minutes

---

## Connect to Experience

> "When you type in ChatGPT..."
```

**After** (`site/src/content/slides/01-concepts/01-title.md`):
```markdown
---
title: "Tokens & Turns"
part: 1
order: 1
notes: "5 minutes for this section"
layout: "title"
---

# Tokens & Turns

How AI sees your words
```

**After** (`site/src/content/slides/01-concepts/02-experience.md`):
```markdown
---
title: "Connect to Experience"
part: 1
order: 2
notes: "When you type in ChatGPT..."
---

## Connect to Experience

You've been chatting with AI. But it doesn't see words the way you do.
```

### Automation

A migration script (`scripts/migrate-curriculum.ts`) will:
1. Read curriculum markdown files
2. **Parse existing frontmatter first** (handle YAML delimiters before splitting)
3. Split body content on `---` horizontal rules (not frontmatter delimiters)
4. Generate slide files with sequential ordering (01-title.md, 02-experience.md, etc.)
5. Extract `**Time**:` markers to frontmatter notes
6. Create index files per part

**Frontmatter handling**: The script detects frontmatter by checking for `---` at line 1, reads until closing `---`, then processes remaining content for HR splits.

Manual polish needed after automation for:
- Slide layout selection
- Presenter note refinement
- Visual hierarchy adjustments

## Deployment

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install and Build
        working-directory: ./site
        run: |
          npm ci
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site/dist
```

### Build Output

- Static HTML for each slide/doc page
- Inlined critical CSS
- Deferred JS for interactivity
- Optimized fonts (subset, woff2)

Target: < 100KB initial load, < 50ms slide transitions.

## Phases

### Phase 1A: Infrastructure (This spec)
- [ ] Initialize Astro project with Tailwind
- [ ] Create base layouts (Slide, Docs, Base)
- [ ] Implement slide navigation component
- [ ] Design system CSS variables
- [ ] GitHub Pages deployment workflow

### Phase 1B: Content Migration
- [ ] Write migration script
- [ ] Migrate Part 1 slides
- [ ] Migrate Part 2 slides
- [ ] Migrate Part 3 slides
- [ ] Migrate Part 4 slides
- [ ] Create docs index and cheatsheets

### Phase 1C: Polish
- [ ] Landing page design
- [ ] Presenter notes toggle
- [ ] Slide overview grid
- [ ] Light mode for docs
- [ ] Mobile responsiveness pass

## Technical Details

### Syntax Highlighting

Using **Shiki** (Astro default) with **GitHub Dark Dimmed** theme. Configure in `astro.config.mjs`:

```javascript
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
```

### Search

Client-side search using **Pagefind** (Astro-native, zero-config). Generates search index at build time, loads ~10KB on demand. Configure in `astro.config.mjs`:

```javascript
import pagefind from 'astro-pagefind';
export default defineConfig({
  integrations: [pagefind()],
});
```

### Fonts

Self-host Inter and JetBrains Mono in `public/fonts/`:
- `inter-var.woff2` (variable font, ~100KB)
- `jetbrains-mono-var.woff2` (variable font, ~90KB)

Loaded via `@font-face` in `global.css` with `font-display: swap`.

## Open Questions

1. **Speaker view**: Do we need dual-monitor presenter mode (current + next + notes)?
   - Recommendation: Defer to Phase 1C polish, basic notes toggle first

2. **Offline support**: Service worker for offline capability?
   - Recommendation: Not needed for workshop (always has network)

3. **Print styles**: Should docs be printable?
   - Recommendation: Yes, basic print CSS for cheatsheets

## Success Criteria

- [ ] Facilitator can present entire 90-min workshop from `/slides`
- [ ] Participants can navigate all content from `/docs`
- [ ] Site loads in < 2s on corporate network
- [ ] Deploys automatically on push to main
- [ ] Looks distinctive — not mistaken for generic template

---

*Spec complete. Ready for review.*
