# Slide Polish Design Spec

**Date:** 2026-04-15  
**Status:** Approved  
**Scope:** Diagram layouts, navigation drawer, visual polish

## Overview

Polish pass for the AI Learning PCT presentation site. Three features delivered as shippable slices:

1. **Diagram Layouts** — Side-by-side layout variant for Mermaid slides
2. **Slide Drawer** — Hidden navigation sidebar for quick jumping
3. **Visual Polish** — Professional/corporate refinements (typography, spacing, colors, code, tables, transitions)

## Context

- 157 slides across 4 parts
- 15 slides with Mermaid diagrams currently cramped at bottom
- Existing navigation: keyboard arrows, O-key overview grid
- Target audience: PCT cabinet (non-technical, need professional look)
- Timeline: ~1 week to workshop

## Feature 1: Diagram Layout Variant

### Design

New `layout: "diagram"` frontmatter option creates a side-by-side layout:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Title                    ┌─────────────────────────┐  │
│                            │                         │  │
│   • Bullet point           │    Mermaid Diagram      │  │
│   • Bullet point           │    (auto-scales)        │  │
│   • Bullet point           │                         │  │
│                            └─────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
     40% content                    60% diagram
```

### CSS Implementation

```css
.slide-diagram {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 768px) {
  .slide-diagram {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

### Slides to Migrate (15)

| Part | Slide Numbers |
|------|---------------|
| 01-concepts | 03, 12, 20, 21, 23, 31, 33 |
| 02-cli | 17, 18, 28, 30, 34, 42 |
| 03-hands-on | 45 |
| 04-inspiration | 03 |

### Migration

Change frontmatter from `layout: "content"` or `layout: "code"` to `layout: "diagram"`. Content restructuring may be needed to ensure title + bullets appear before the Mermaid code block.

## Feature 2: Slide Drawer Navigation

### Design

Hidden sidebar that slides in from the left, showing all slides grouped by part.

```
┌──────────────────┬────────────────────────────────────┐
│  Navigation      │                                    │
│  ────────── ✕    │                                    │
│                  │                                    │
│  PART 1: CONCEPTS│        (dimmed slide content)      │
│    Context Win...│                                    │
│    LLMs vs RAG   │                                    │
│  ▶ Tool Use Work │ ← current                          │
│    Why MCP Mat...│                                    │
│                  │                                    │
│  ▶ PART 2: CLI   │                                    │
│  ▶ PART 3: HANDS │                                    │
│  ▶ PART 4: INSP  │                                    │
└──────────────────┴────────────────────────────────────┘
      260px                     remaining width
```

### Behavior

| Action | Trigger |
|--------|---------|
| Open | Press `M` or click hamburger (top-left) |
| Close | Press `M`, `Esc`, or click outside drawer |
| Navigate | Click any slide title → navigates + closes |

### Features

- **Collapsible parts:** Click part header to expand/collapse
- **Auto-expand:** Current part expanded by default
- **Current highlight:** Active slide has accent left-border
- **Auto-scroll:** Current slide scrolls into view when drawer opens

### Coexistence with O-Grid

- `M` = drawer (detailed within-part navigation)
- `O` = grid (visual overview of all slides)

Both remain available. Different tools for different needs.

### Component Structure

```
SlideDrawer.astro
├── Drawer backdrop (click to close)
├── Drawer panel (260px, slides from left)
│   ├── Header (title + close button)
│   └── Parts list
│       └── Collapsible part sections
│           └── Slide links
└── Hamburger button (fixed top-left)
```

## Feature 3: Visual Polish

### A. Typography & Hierarchy

| Element | Before | After |
|---------|--------|-------|
| Title size | `--text-4xl` | `--text-4xl` (unchanged) |
| Title weight | 600 | 700 |
| Title tracking | -0.01em | -0.025em |
| Body text color | #e2e8f0 | #cbd5e1 |
| Body line-height | 1.6 | 1.8 |
| List item gap | 0.75rem | 1rem |

### B. Spacing & Padding

| Element | Before | After |
|---------|--------|-------|
| Slide horizontal padding | clamp(2rem, 5vw, 6rem) | clamp(3rem, 6vw, 8rem) |
| Title-to-content gap | 2rem | 2.5rem |
| List item spacing | 0.75rem | 1rem |

### C. Color Refinement

| Token | Before | After | Rationale |
|-------|--------|-------|-----------|
| `--color-bg-primary` | #0f172a (slate-900) | #111827 (gray-900) | Warmer, less blue |
| `--color-text-secondary` | #e2e8f0 (slate-200) | #cbd5e1 (slate-300) | Softer contrast |
| `--color-accent` | #38bdf8 (sky-400) | #38bdf8 | Unchanged |

### D. Code Block Styling

```css
.slide-code pre,
.slide pre[data-language] {
  background-color: var(--color-bg-secondary);
  border: 1px solid #374151;
  border-radius: 0.75rem;        /* was 0.5rem */
  padding: 1.25rem;              /* was 1.5rem */
  font-size: var(--text-base);   /* was --text-sm */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}
```

### E. Table Polish

- Alternating row backgrounds (transparent / rgba(30,41,59,0.5))
- Accent color (#38bdf8) on key data columns where appropriate
- Cleaner borders (1px solid #1e293b)
- Header: 2px bottom border in accent color

### F. Slide Transitions

```css
.slide {
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.slide:target,
.slide.visible {
  opacity: 1;
}
```

Uses Intersection Observer to add `.visible` class when slide enters viewport.

## Implementation Order

Per Slice-by-Feature approach:

1. **Feature 1: Diagram Layouts**
   - Add `.slide-diagram` CSS
   - Update Slide.astro to support "diagram" variant
   - Migrate 15 slides (frontmatter + content structure)
   - Test on desktop and mobile

2. **Feature 2: Slide Drawer**
   - Create SlideDrawer.astro component
   - Add hamburger button to SlideLayout
   - Implement keyboard handling (M key)
   - Wire up navigation + close behaviors
   - Test alongside O-grid

3. **Feature 3: Visual Polish**
   - Update CSS custom properties (colors, spacing)
   - Refine typography scale
   - Polish code blocks
   - Polish tables
   - Add slide transitions
   - Full visual review pass

## Files to Create/Modify

| File | Action |
|------|--------|
| `site/src/styles/global.css` | Update tokens, add `.slide-diagram`, polish styles |
| `site/src/components/Slide.astro` | Add "diagram" variant |
| `site/src/components/SlideDrawer.astro` | New component |
| `site/src/layouts/SlideLayout.astro` | Add SlideDrawer, hamburger button |
| `site/src/content/slides/**/*.md` | Migrate 15 slides to `layout: "diagram"` |

## Out of Scope

- Audience-specific content tweaks (separate session)
- New slide content
- Docs section changes (focus is presentation slides)

## Success Criteria

- [ ] Mermaid diagrams use full available space in side-by-side layout
- [ ] Drawer provides quick within-part navigation
- [ ] Visual feel is professional/corporate, not "hacker dark mode"
- [ ] All 157 slides render correctly on desktop
- [ ] Mobile fallbacks work (stacked diagram layout, drawer still accessible)
