# Phase 1A: Astro Infrastructure

**Issues:** #1, #2, #3, #4, #5  
**Approach:** Set up Astro project with Tailwind, create layouts and components, deploy to GitHub Pages.

## Execution Waves

| Wave | Tasks | Mode | Rationale |
|------|-------|------|-----------|
| 1 | Task 1 | sequential | Foundation - everything depends on this |
| 2 | Task 2, Task 3 | parallel | Independent layout/component work |
| 3 | Task 4 | sequential | Design system needs layouts in place |
| 4 | Task 5 | sequential | Deploy after everything works locally |

## Tasks

### 1. Initialize Astro Project
**Files:** `site/package.json`, `site/astro.config.mjs`, `site/tailwind.config.mjs`, `site/tsconfig.json`
**Depends on:** none
- [ ] Create site/ directory
- [ ] Run `npm create astro@latest` with TypeScript, Tailwind
- [ ] Configure astro.config.mjs (base: '/ai-learning-pct', shiki theme)
- [ ] Add Pagefind integration for search
- [ ] Verify `npm run dev` works
- [ ] Commit: "Initialize Astro project with Tailwind"

### 2. Create Base Layouts
**Files:** `site/src/layouts/BaseLayout.astro`, `site/src/layouts/SlideLayout.astro`, `site/src/layouts/DocsLayout.astro`
**Depends on:** Task 1
- [ ] Create BaseLayout.astro with HTML shell, font loading, global styles
- [ ] Create SlideLayout.astro extending Base, full-screen presentation mode
- [ ] Create DocsLayout.astro extending Base, sidebar navigation
- [ ] Create placeholder index.astro using BaseLayout
- [ ] Verify all layouts render
- [ ] Commit: "Add base layouts for slides and docs"

### 3. Implement Slide Navigation
**Files:** `site/src/components/SlideNav.astro`, `site/src/components/Slide.astro`
**Depends on:** Task 1
- [ ] Create Slide.astro component for rendering single slide
- [ ] Create SlideNav.astro with keyboard event listeners
- [ ] Implement arrow key navigation (left/right)
- [ ] Implement progress bar component
- [ ] Add presenter notes toggle (P key)
- [ ] Test navigation with dummy slides
- [ ] Commit: "Add slide navigation component with keyboard controls"

### 4. Design System and Global Styles
**Files:** `site/src/styles/global.css`, `site/public/fonts/*`, `site/tailwind.config.mjs`
**Depends on:** Task 2
- [ ] Download Inter and JetBrains Mono variable fonts
- [ ] Add @font-face declarations in global.css
- [ ] Define CSS custom properties (colors, typography)
- [ ] Configure Tailwind with design tokens
- [ ] Create slide layout variants (title, content, split, code)
- [ ] Verify dark mode styling
- [ ] Commit: "Add design system with fonts and color palette"

### 5. GitHub Pages Deployment
**Files:** `.github/workflows/deploy.yml`, `site/astro.config.mjs`
**Depends on:** Task 1, Task 2
- [ ] Create .github/workflows/deploy.yml
- [ ] Configure for push to main trigger
- [ ] Set up GitHub Pages in repo settings (when repo exists)
- [ ] Test deployment with placeholder content
- [ ] Verify site loads at correct base path
- [ ] Commit: "Add GitHub Pages deployment workflow"

## Verification

- [ ] `cd site && npm run dev` serves local site
- [ ] Slide navigation works with keyboard
- [ ] Fonts load correctly (no FOUT)
- [ ] Dark mode colors render as designed
- [ ] `npm run build` succeeds
- [ ] (After repo) GitHub Pages deployment succeeds

## Notes

- GitHub repo creation blocked on work machine - create manually or from personal machine
- Base path must be `/ai-learning-pct` for GitHub Pages subdirectory deployment
- Fonts are ~200KB total - acceptable for workshop (not mobile-first)
- Pagefind search only works in production build, not dev mode
