# Slide Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the presentation site with better diagram layouts, navigation drawer, and professional visual refinements.

**Architecture:** Three sequential features: (1) new CSS layout variant for diagram slides, (2) SlideDrawer component for within-part navigation, (3) global CSS polish pass. Each feature is independently shippable.

**Tech Stack:** Astro components, CSS custom properties, vanilla JavaScript for interactivity.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `site/src/styles/global.css` | Modify | Design tokens, `.slide-diagram` class, all polish styles |
| `site/src/components/Slide.astro` | Modify | Add "diagram" to variant type union |
| `site/src/components/SlideDrawer.astro` | Create | Drawer UI, collapse logic, keyboard handling |
| `site/src/layouts/SlideLayout.astro` | Modify | Import SlideDrawer, add hamburger button |
| `site/src/content/slides/**/*.md` | Modify (15 files) | Change frontmatter to `layout: "diagram"` |

---

## Feature 1: Diagram Layout Variant

### Task 1.1: Add diagram layout CSS

**Files:**
- Modify: `site/src/styles/global.css` (after line 235, the `.slide-code` section)

- [ ] **Step 1: Add `.slide-diagram` CSS class**

Add after the `.slide-code` section (around line 235):

```css
/* Diagram Slide - Side-by-side layout for Mermaid diagrams */
.slide-diagram {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  align-items: center;
  justify-content: center;
}

.slide-diagram h2 {
  font-size: var(--text-3xl);
  font-weight: 600;
  margin-bottom: 1rem;
}

.slide-diagram ul,
.slide-diagram ol {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slide-diagram li::marker {
  color: var(--color-accent);
}

.slide-diagram .mermaid-diagram,
.slide-diagram pre[data-language="mermaid"] {
  width: 100%;
  max-height: 70vh;
}

.slide-diagram .mermaid-diagram svg {
  max-height: 70vh;
  width: auto;
}

@media (max-width: 768px) {
  .slide-diagram {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

- [ ] **Step 2: Verify CSS syntax**

Run: `cd site && npm run build`
Expected: Build succeeds with no CSS errors

- [ ] **Step 3: Commit**

```bash
git add site/src/styles/global.css
git commit -m "feat: add .slide-diagram CSS layout variant

Side-by-side grid: 40% content, 60% diagram
Mobile fallback stacks vertically"
```

---

### Task 1.2: Register diagram variant in Slide component

**Files:**
- Modify: `site/src/components/Slide.astro:1-11`

- [ ] **Step 1: Update variant type to include "diagram"**

Replace the interface section:

```astro
---
interface Props {
  id: string;
  variant?: 'title' | 'content' | 'split' | 'code' | 'diagram';
}

const { id, variant = 'content' } = Astro.props;

// Map variants to CSS classes defined in global.css
const variantClass = `slide-${variant}`;
---
```

- [ ] **Step 2: Verify component compiles**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add site/src/components/Slide.astro
git commit -m "feat: register diagram variant in Slide component"
```

---

### Task 1.3: Update slides index to handle diagram layout

**Files:**
- Modify: `site/src/pages/slides/index.astro:26-30`

- [ ] **Step 1: Add diagram to variant mapping**

Find the `renderedSlides` mapping (around line 26) and update:

```typescript
const renderedSlides = await Promise.all(
  sortedSlides.map(async (slide, index) => {
    const { Content } = await render(slide);
    return {
      slide,
      Content,
      slideNumber: index + 1,
      variant: slide.data.layout === 'quote' ? 'content' : 
               slide.data.layout === 'diagram' ? 'diagram' : 
               slide.data.layout,
    };
  })
);
```

- [ ] **Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add site/src/pages/slides/index.astro
git commit -m "feat: handle diagram layout in slides page"
```

---

### Task 1.4: Migrate diagram slides (batch 1 - concepts)

**Files:**
- Modify: `site/src/content/slides/01-concepts/03-the-reveal-working-memory.md`
- Modify: `site/src/content/slides/01-concepts/12-rag-let-me-look-that-up.md`
- Modify: `site/src/content/slides/01-concepts/20-the-shift-from-talking-to-doing.md`
- Modify: `site/src/content/slides/01-concepts/21-how-tool-use-works.md`

- [ ] **Step 1: Update frontmatter for 03-the-reveal-working-memory.md**

Change `layout: "content"` or `layout: "code"` to `layout: "diagram"` in frontmatter.

- [ ] **Step 2: Update frontmatter for 12-rag-let-me-look-that-up.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 3: Update frontmatter for 20-the-shift-from-talking-to-doing.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 4: Update frontmatter for 21-how-tool-use-works.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 5: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add site/src/content/slides/01-concepts/
git commit -m "feat: migrate concepts slides 03,12,20,21 to diagram layout"
```

---

### Task 1.5: Migrate diagram slides (batch 2 - concepts continued)

**Files:**
- Modify: `site/src/content/slides/01-concepts/23-why-mcp-matters-to-you.md`
- Modify: `site/src/content/slides/01-concepts/31-how-memory-actually-works.md`
- Modify: `site/src/content/slides/01-concepts/33-projects-custom-instructions.md`

- [ ] **Step 1: Update frontmatter for 23-why-mcp-matters-to-you.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 2: Update frontmatter for 31-how-memory-actually-works.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 3: Update frontmatter for 33-projects-custom-instructions.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 4: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add site/src/content/slides/01-concepts/
git commit -m "feat: migrate concepts slides 23,31,33 to diagram layout"
```

---

### Task 1.6: Migrate diagram slides (batch 3 - CLI)

**Files:**
- Modify: `site/src/content/slides/02-cli/17-the-real-difference.md`
- Modify: `site/src/content/slides/02-cli/18-cli-ai-in-your-workspace.md`
- Modify: `site/src/content/slides/02-cli/28-what-is-a-harness.md`
- Modify: `site/src/content/slides/02-cli/30-2-project-instructions.md`
- Modify: `site/src/content/slides/02-cli/34-the-copilot-dotfiles-harness.md`
- Modify: `site/src/content/slides/02-cli/42-the-better-approach-automatic-context-lo.md`

- [ ] **Step 1: Update frontmatter for all 6 CLI slides**

Change layout to `layout: "diagram"` in frontmatter for each file.

- [ ] **Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add site/src/content/slides/02-cli/
git commit -m "feat: migrate CLI slides 17,18,28,30,34,42 to diagram layout"
```

---

### Task 1.7: Migrate diagram slides (batch 4 - hands-on and inspiration)

**Files:**
- Modify: `site/src/content/slides/03-hands-on/45-what-got-installed.md`
- Modify: `site/src/content/slides/04-inspiration/03-demo-script.md`

- [ ] **Step 1: Update frontmatter for 45-what-got-installed.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 2: Update frontmatter for 03-demo-script.md**

Change layout to `layout: "diagram"` in frontmatter.

- [ ] **Step 3: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add site/src/content/slides/03-hands-on/ site/src/content/slides/04-inspiration/
git commit -m "feat: migrate hands-on/inspiration slides to diagram layout"
```

---

### Task 1.8: Visual verification of diagram layouts

- [ ] **Step 1: Start dev server**

Run: `cd site && npm run dev`

- [ ] **Step 2: Check diagram slides render correctly**

Open browser to `http://localhost:4322/ai-learning-pct/slides/`
Navigate to slides 3, 12, 20, 21, 23 (Part 1 concepts with diagrams)
Verify: Content on left, Mermaid diagram on right, diagram uses available space

- [ ] **Step 3: Check mobile fallback**

Resize browser to <768px width
Verify: Layout stacks vertically (content above, diagram below)

- [ ] **Step 4: Stop dev server**

Press Ctrl+C to stop the server

---

## Feature 2: Slide Drawer Navigation

### Task 2.1: Create SlideDrawer component

**Files:**
- Create: `site/src/components/SlideDrawer.astro`

- [ ] **Step 1: Create the SlideDrawer component**

```astro
---
interface SlideInfo {
  id: string;
  title: string;
  part: number;
  slideNumber: number;
}

interface Props {
  slides: SlideInfo[];
}

const { slides } = Astro.props;

const partNames: Record<number, string> = {
  1: 'Core Concepts',
  2: 'CLI Differences',
  3: 'Hands-On',
  4: 'Inspiration',
};

// Group slides by part
const slidesByPart = slides.reduce(
  (acc, slide) => {
    if (!acc[slide.part]) {
      acc[slide.part] = [];
    }
    acc[slide.part].push(slide);
    return acc;
  },
  {} as Record<number, SlideInfo[]>
);

const parts = Object.keys(slidesByPart)
  .map(Number)
  .sort((a, b) => a - b);
---

<!-- Hamburger Button -->
<button
  id="drawer-toggle"
  class="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="slide-drawer"
>
  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<!-- Drawer Backdrop -->
<div
  id="drawer-backdrop"
  class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm hidden"
  aria-hidden="true"
></div>

<!-- Drawer Panel -->
<nav
  id="slide-drawer"
  class="fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform -translate-x-full transition-transform duration-200 ease-out overflow-y-auto"
  aria-label="Slide navigation"
>
  <div class="p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-white">Navigation</h2>
      <button
        id="drawer-close"
        class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        aria-label="Close navigation"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Parts -->
    <div class="space-y-3">
      {parts.map((partNum) => (
        <div class="part-section" data-part={partNum}>
          <button
            class="part-header w-full flex items-center gap-2 px-2 py-1.5 text-left rounded hover:bg-slate-700/50 transition-colors"
            aria-expanded="false"
          >
            <svg class="part-chevron w-4 h-4 text-slate-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Part {partNum}
            </span>
            <span class="text-xs text-slate-400 truncate">
              {partNames[partNum]}
            </span>
          </button>
          <div class="part-slides hidden mt-1 ml-6 space-y-0.5">
            {slidesByPart[partNum].map((slide) => (
              <a
                href={`#${slide.id}`}
                class="slide-link block px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded truncate transition-colors"
                data-slide-id={slide.id}
              >
                <span class="text-slate-500 font-mono mr-1">{slide.slideNumber}</span>
                {slide.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>

  <!-- Keyboard hint -->
  <div class="absolute bottom-4 left-4 right-4 text-center text-slate-500 text-xs">
    Press <kbd class="px-1.5 py-0.5 bg-slate-700 rounded text-xs font-mono">M</kbd> to toggle
  </div>
</nav>

<style>
  .part-section.expanded .part-chevron {
    transform: rotate(90deg);
  }

  .part-section.expanded .part-slides {
    display: block;
  }

  .slide-link.active {
    background-color: rgb(15 23 42 / 0.8);
    color: white;
    border-left: 2px solid #38bdf8;
    margin-left: -2px;
    padding-left: calc(0.5rem + 2px);
  }

  #slide-drawer.open {
    transform: translateX(0);
  }
</style>

<script>
  const drawer = document.getElementById('slide-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const toggleBtn = document.getElementById('drawer-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const partHeaders = document.querySelectorAll('.part-header');
  const slideLinks = document.querySelectorAll('.slide-link');

  let isOpen = false;

  function openDrawer() {
    isOpen = true;
    drawer?.classList.add('open');
    backdrop?.classList.remove('hidden');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Expand current part and highlight current slide
    const hash = window.location.hash.slice(1);
    if (hash) {
      const activeLink = document.querySelector(`.slide-link[data-slide-id="${hash}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        const partSection = activeLink.closest('.part-section');
        if (partSection) {
          partSection.classList.add('expanded');
          const header = partSection.querySelector('.part-header');
          header?.setAttribute('aria-expanded', 'true');
        }
        // Scroll into view
        setTimeout(() => activeLink.scrollIntoView({ block: 'center' }), 100);
      }
    }
  }

  function closeDrawer() {
    isOpen = false;
    drawer?.classList.remove('open');
    backdrop?.classList.add('hidden');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Clear active state
    slideLinks.forEach(link => link.classList.remove('active'));
  }

  function toggleDrawer() {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  // Toggle button click
  toggleBtn?.addEventListener('click', toggleDrawer);

  // Close button click
  closeBtn?.addEventListener('click', closeDrawer);

  // Backdrop click
  backdrop?.addEventListener('click', closeDrawer);

  // Part header click (expand/collapse)
  partHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.part-section');
      const isExpanded = section?.classList.contains('expanded');
      section?.classList.toggle('expanded');
      header.setAttribute('aria-expanded', String(!isExpanded));
    });
  });

  // Slide link click (navigate + close)
  slideLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeDrawer, 100);
    });
  });

  // Keyboard handling
  document.addEventListener('keydown', (e) => {
    // M key toggles drawer (when not in input)
    if (e.key === 'm' || e.key === 'M') {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleDrawer();
      }
    }

    // Escape closes drawer
    if (e.key === 'Escape' && isOpen) {
      closeDrawer();
    }
  });

  // Expose for external use
  (window as any).slideDrawer = {
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
    isOpen: () => isOpen,
  };
</script>
```

- [ ] **Step 2: Verify file created**

Run: `ls -la site/src/components/SlideDrawer.astro`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add site/src/components/SlideDrawer.astro
git commit -m "feat: create SlideDrawer navigation component

- Hamburger button (top-left)
- Collapsible part sections
- Current slide highlighting
- M key toggle, Esc to close
- Click outside to close"
```

---

### Task 2.2: Integrate SlideDrawer into SlideLayout

**Files:**
- Modify: `site/src/layouts/SlideLayout.astro`

- [ ] **Step 1: Import SlideDrawer component**

Add import at top of frontmatter (after existing imports):

```astro
---
import BaseLayout from "./BaseLayout.astro";
import SlideDrawer from "../components/SlideDrawer.astro";

interface Props {
  title: string;
  slides?: Array<{ id: string; title: string; part: number; slideNumber: number }>;
}

const { title, slides = [] } = Astro.props;
---
```

- [ ] **Step 2: Add SlideDrawer to template**

Add after the `<slot />` and before the Mermaid script:

```astro
<BaseLayout title={title}>
  <main class="bg-bg-primary text-text-primary">
    <slot />
  </main>

  {slides.length > 0 && <SlideDrawer slides={slides} />}

  <!-- Mermaid diagram rendering -->
  <script>
```

- [ ] **Step 3: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add site/src/layouts/SlideLayout.astro
git commit -m "feat: integrate SlideDrawer into SlideLayout"
```

---

### Task 2.3: Pass slides data to SlideLayout

**Files:**
- Modify: `site/src/pages/slides/index.astro`

- [ ] **Step 1: Pass slides prop to SlideLayout**

Update the SlideLayout usage (around line 42):

```astro
<SlideLayout title="AI-Powered Development Workshop" slides={slidesForOverview}>
  {renderedSlides.map(({ slide, Content, slideNumber, variant }) => (
    <Slide id={`slide-${slideNumber}`} variant={variant}>
      <Content />
    </Slide>
  ))}

  <SlideNav currentSlide={1} totalSlides={totalSlides} />
  <SlideControls />
  <OverviewGrid slides={slidesForOverview} />
</SlideLayout>
```

- [ ] **Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add site/src/pages/slides/index.astro
git commit -m "feat: pass slides data to SlideLayout for drawer"
```

---

### Task 2.4: Visual verification of slide drawer

- [ ] **Step 1: Start dev server**

Run: `cd site && npm run dev`

- [ ] **Step 2: Test drawer functionality**

Open browser to `http://localhost:4322/ai-learning-pct/slides/`
Test:
- Hamburger button visible top-left
- Click hamburger → drawer slides in from left
- Parts are collapsible (click header to expand/collapse)
- Current slide is highlighted when drawer opens
- Click slide → navigates and closes drawer
- Press M → toggles drawer
- Press Escape → closes drawer
- Click backdrop → closes drawer

- [ ] **Step 3: Verify coexistence with O-grid**

Press O → overview grid appears (existing feature)
Press Escape → closes grid
Press M → drawer appears (new feature)
Both work independently

- [ ] **Step 4: Stop dev server**

Press Ctrl+C to stop the server

---

## Feature 3: Visual Polish

### Task 3.1: Update color tokens

**Files:**
- Modify: `site/src/styles/global.css:28-56`

- [ ] **Step 1: Update background and text colors**

Replace the color tokens section:

```css
:root {
  /* Colors - Background (Dark mode default - warmer grays) */
  --color-bg-primary: #111827;   /* gray-900 (was slate-900) */
  --color-bg-secondary: #1f2937; /* gray-800 (was slate-800) */
  --color-bg-tertiary: #374151;  /* gray-700 (was slate-700) */

  /* Colors - Text (Dark mode default - softer contrast) */
  --color-text-primary: #f9fafb;  /* gray-50 (was slate-50) */
  --color-text-secondary: #d1d5db; /* gray-300 (was slate-200) */
  --color-text-muted: #9ca3af;    /* gray-400 (was slate-400) */

  /* Colors - Accent (unchanged) */
  --color-accent: #38bdf8;        /* sky-400 */
  --color-accent-hover: #7dd3fc;  /* sky-300 */
  --color-accent-muted: #0ea5e9;  /* sky-500 */
```

- [ ] **Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add site/src/styles/global.css
git commit -m "style: update color tokens for warmer professional look

- Background: slate → gray (warmer)
- Text: softer contrast for readability"
```

---

### Task 3.2: Update typography and spacing

**Files:**
- Modify: `site/src/styles/global.css:155-180`

- [ ] **Step 1: Update slide-content typography**

Update the `.slide-content` section:

```css
/* Content Slide - Standard layout for bullet points and text */
.slide-content {
  justify-content: center;
  gap: 2.5rem;
}

.slide-content h2 {
  font-size: var(--text-4xl);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.slide-content ul,
.slide-content ol {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  line-height: 1.8;
}

.slide-content li::marker {
  color: var(--color-accent);
}
```

- [ ] **Step 2: Update slide padding**

Update the base `.slide` class (around line 126):

```css
/* Base slide container */
.slide {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-slide-y) var(--space-slide-x);
}
```

And update the spacing token (around line 69):

```css
/* Spacing */
--space-slide-x: clamp(3rem, 6vw, 8rem);
--space-slide-y: clamp(2rem, 5vh, 4rem);
```

- [ ] **Step 3: Commit**

```bash
git add site/src/styles/global.css
git commit -m "style: improve typography and spacing

- Title weight 700, tighter letter-spacing
- Increased line-height (1.8) for body
- More horizontal padding on slides
- Larger gaps between elements"
```

---

### Task 3.3: Polish code blocks

**Files:**
- Modify: `site/src/styles/global.css:205-236`

- [ ] **Step 1: Update code block styles**

Update the `.slide-code` section:

```css
/* Code Slide - Monospace-focused layout for code examples */
.slide-code {
  justify-content: center;
  gap: 1.5rem;
}

.slide-code h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
}

.slide-code pre,
.slide pre[data-language] {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: 0.75rem;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: var(--text-base);
  line-height: 1.7;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.slide-code code {
  color: var(--color-text-secondary);
}

/* Syntax highlighting accents */
.slide-code .keyword { color: #c792ea; }
.slide-code .string { color: #c3e88d; }
.slide-code .comment { color: var(--color-text-muted); }
.slide-code .function { color: #82aaff; }
.slide-code .number { color: #f78c6c; }
```

- [ ] **Step 2: Commit**

```bash
git add site/src/styles/global.css
git commit -m "style: polish code blocks

- Larger border radius (0.75rem)
- Subtle shadow
- Slightly larger font"
```

---

### Task 3.4: Polish tables

**Files:**
- Modify: `site/src/styles/global.css:237-284`

- [ ] **Step 1: Update table styles**

Update the table styles section:

```css
/* ==========================================================================
   Table Styles (for slides and docs)
   ========================================================================== */

.slide table,
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: var(--text-base);
}

.slide th,
.prose th {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-weight: 600;
  text-align: left;
  padding: 0.875rem 1.25rem;
  border-bottom: 2px solid var(--color-accent);
}

.slide td,
.prose td {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.slide tr:nth-child(even) td,
.prose tr:nth-child(even) td {
  background-color: rgba(31, 41, 55, 0.5);
}

.slide tr:hover td,
.prose tr:hover td {
  background-color: var(--color-bg-secondary);
}

/* Responsive tables */
@media (max-width: 640px) {
  .slide table,
  .prose table {
    font-size: var(--text-sm);
  }

  .slide th,
  .slide td,
  .prose th,
  .prose td {
    padding: 0.5rem 0.75rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add site/src/styles/global.css
git commit -m "style: polish tables

- Alternating row backgrounds
- Larger padding
- Cleaner borders"
```

---

### Task 3.5: Add slide transitions

**Files:**
- Modify: `site/src/layouts/SlideLayout.astro`

- [ ] **Step 1: Add transition CSS**

Add to the `<style is:global>` section at the bottom:

```astro
<style is:global>
  html {
    scroll-snap-type: y mandatory;
  }
  .slide {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    opacity: 0;
    transition: opacity 200ms ease-out;
  }
  .slide.visible {
    opacity: 1;
  }
</style>
```

- [ ] **Step 2: Add Intersection Observer script**

Add after the Mermaid script block:

```astro
<script>
  // Slide visibility transitions
  const slides = document.querySelectorAll('.slide');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  slides.forEach((slide) => {
    observer.observe(slide);
  });

  // Make first slide visible immediately
  slides[0]?.classList.add('visible');
</script>
```

- [ ] **Step 3: Verify build**

Run: `cd site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add site/src/layouts/SlideLayout.astro
git commit -m "style: add subtle slide transitions

- Fade in on scroll (200ms ease-out)
- Uses Intersection Observer"
```

---

### Task 3.6: Final visual verification

- [ ] **Step 1: Start dev server**

Run: `cd site && npm run dev`

- [ ] **Step 2: Full presentation walkthrough**

Open browser to `http://localhost:4322/ai-learning-pct/slides/`
Navigate through slides checking:
- Warmer color palette (less blue, more gray)
- Improved typography (bolder titles, better spacing)
- Polished code blocks (shadow, larger radius)
- Polished tables (alternating rows)
- Subtle fade transitions when scrolling
- Diagram layouts (side-by-side)
- Drawer navigation (M key)

- [ ] **Step 3: Check mobile responsiveness**

Resize to mobile width (<768px):
- Diagram slides stack vertically
- Tables remain readable
- Drawer still accessible

- [ ] **Step 4: Stop dev server and final commit**

Press Ctrl+C to stop server

```bash
git add -A
git commit -m "feat: complete slide polish implementation

Phase 1C polish complete:
- Diagram layout variant (15 slides)
- Slide drawer navigation (M key)
- Visual polish (colors, typography, spacing, code, tables, transitions)"
```

---

## Summary

| Feature | Tasks | Commits |
|---------|-------|---------|
| Diagram Layouts | 1.1-1.8 | 7 |
| Slide Drawer | 2.1-2.4 | 4 |
| Visual Polish | 3.1-3.6 | 6 |
| **Total** | **18 tasks** | **17 commits** |
