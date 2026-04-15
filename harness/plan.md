# Phase 1C: Polish

**Issues:** #13, #14, #15, #16, #17
**Approach:** Maximum parallel execution for independent features, mobile pass after features land, dry run as validation gate.

## Execution Waves

| Wave | Tasks | Mode | Rationale |
|------|-------|------|-----------|
| 0 | Task 0 | sequential | Prerequisite: slides route needed for overview grid |
| 1 | Task 1, Task 2, Task 3 | parallel | Independent files: index.astro, SlideNav+OverviewGrid, DocsLayout+ThemeToggle |
| 2 | Task 4 | sequential | Mobile audit needs features in place |
| 3 | Task 5 | sequential | Validation gate, manual testing |

## Tasks

### 0. Create Slides Route (prerequisite)
**Files:** `site/src/pages/slides/[...slug].astro`
**Depends on:** none

Create dynamic route to render slides from content collection:
- Query slides collection, sort by part + order
- Render all slides on single page with scroll-snap
- Wire up SlideNav and SlideControls

- [x] Create `site/src/pages/slides/index.astro` (or `[...slug].astro`)
- [x] Query `getCollection('slides')`, sort by part then order
- [x] Render each slide using Slide component with appropriate variant
- [x] Include SlideNav and SlideControls
- [x] Verify keyboard navigation works
- [x] Commit: "Add slides route from content collection"

### 1. Landing Page (#13)
**Files:** `site/src/pages/index.astro`
**Depends on:** none

Build compelling landing page with:
- Hero section (title, tagline, visual interest)
- "What you'll learn" cards (3 cards: concepts, tools, hands-on)
- Session agenda timeline (90 min breakdown)
- Quick start links (slides, docs, cheatsheet)

- [x] Design hero section with gradient text and visual flair
- [x] Add "What You'll Learn" card grid (3 cards with icons)
- [x] Add session timeline/agenda section
- [x] Add quick start links section with buttons
- [x] Test responsive behavior at common breakpoints
- [x] Commit: "Add landing page with hero, cards, agenda"

### 2. Slide Overview Grid (#14)
**Files:** `site/src/components/OverviewGrid.astro`, `site/src/components/SlideNav.astro`, `site/src/pages/slides/index.astro`
**Depends on:** Task 0 (slides route must exist)

Add overview mode triggered by O key:
- Grid showing all slides with titles
- Click to jump to any slide
- Escape to close

- [x] Create OverviewGrid.astro component (grid layout, slide cards)
- [x] Pass slides collection data to SlideLayout
- [x] Add O key handler in SlideNav to toggle overview
- [x] Add Escape key to close overview
- [x] Style grid for readability (slide number, title, part grouping)
- [x] Test keyboard navigation flow
- [x] Commit: "Add slide overview grid (O key)"

### 3. Light Mode Toggle (#15)
**Files:** `site/src/components/ThemeToggle.astro`, `site/src/layouts/DocsLayout.astro`, `site/src/layouts/BaseLayout.astro`, `site/src/styles/global.css`
**Depends on:** none

Add theme switching for docs:
- Toggle button in docs header
- localStorage persistence
- Respect system preference as default
- Smooth transition between themes

- [x] Add light mode CSS variables to global.css (--color-light-* tokens)
- [x] Create ThemeToggle.astro component (sun/moon icon button)
- [x] Add theme initialization script to BaseLayout (check localStorage, then system pref)
- [x] Add toggle button to DocsLayout header
- [x] Add transition styles for smooth theme switch
- [x] Test persistence across page reloads
- [x] Commit: "Add light mode toggle for docs"

### 4. Mobile Responsiveness (#16)
**Files:** `site/src/layouts/*.astro`, `site/src/components/*.astro`, `site/src/styles/global.css`
**Depends on:** Tasks 1, 2, 3

Audit and fix mobile experience:
- Docs readable on phone (sidebar behavior)
- Landing page responsive
- Slides viewable (not primary use case)
- Touch navigation works

- [x] Audit landing page on mobile viewports (320px, 375px, 414px)
- [x] Fix any layout issues on landing page
- [x] Audit DocsLayout sidebar (collapse on mobile, hamburger menu)
- [x] Test touch navigation on slides (swipe or tap targets)
- [x] Verify text remains readable at all sizes
- [x] Test overview grid on tablet/mobile
- [x] Commit: "Mobile responsiveness pass"

### 5. Dry Run (#17)
**Files:** none (validation only)
**Depends on:** Tasks 1, 2, 3, 4

Full rehearsal of workshop flow:
- Run through presentation
- Test all keyboard navigation
- Verify timing annotations
- Identify friction points

- [ ] Start dev server, open presentation from landing page
- [ ] Navigate through all 157 slides using keyboard
- [ ] Test O key overview, verify all slides accessible
- [ ] Test light mode toggle in docs section
- [ ] Check mobile view on actual device or devtools
- [ ] Note any friction points or bugs
- [ ] Create follow-up issues for any problems found
- [ ] Mark #17 closed if acceptable

## Verification

- [x] `cd site && npm run build` — site builds without errors (5 pages)
- [ ] `cd site && npm run preview` — preview works
- [ ] Visual check: landing page, slides, docs, mobile
- [ ] Keyboard nav: arrows, space, O, Escape, P all work

## Notes

- Landing page should use existing design tokens from global.css (gradient-text, color-accent, etc.)
- DocsLayout already has `dark:` Tailwind classes — light mode needs root class toggle strategy
- Content collection configured in `content.config.ts` — use `getCollection('slides')` to query
- Theme script must be in `<head>` or inline before body to prevent flash of wrong theme
- Task 0 fills gap from Phase 1B (slides migrated but not routed)
