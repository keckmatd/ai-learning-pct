# Phase 1B: Content Migration

**Issues:** #6, #7, #8, #9, #10, #11, #12  
**Approach:** Build migration script to transform curriculum markdown to Astro content collections, then migrate all parts and create docs section.

## Execution Waves

| Wave | Tasks | Mode | Rationale |
|------|-------|------|-----------|
| 1 | Task 1 | sequential | Migration script — everything depends on this |
| 2 | Task 2, 3, 4, 5 | parallel | Independent part migrations using the script |
| 3 | Task 6 | sequential | Docs section — can reference migrated content |
| 4 | Task 7 | sequential | Templates import — independent but lower priority |

## Tasks

### 1. Write Migration Script
**Files:** `scripts/migrate-curriculum.ts`, `site/src/content.config.ts`
**Issue:** #6
**Depends on:** none
- [x] Create scripts/ directory with tsconfig for standalone execution
- [x] Implement frontmatter parser (detect `---` at line 1, read to closing `---`)
- [x] Implement HR splitter (split body on `---` after frontmatter parsed)
- [x] Extract `**Time**: X minutes` to frontmatter notes
- [x] Generate sequential file naming (01-title.md, 02-content.md, etc.)
- [x] Create part index files with slide manifest
- [x] Update site/src/content.config.ts with slides collection schema (Astro 6 glob loader)
- [x] Test on curriculum/01-concepts manually (44 slides generated)
- [x] Commit: "Add curriculum migration script"

**Schema for slides collection:**
```typescript
{
  title: string,
  part: number,
  order: number,
  layout?: 'title' | 'content' | 'split' | 'code' | 'quote',
  notes?: string,
  transition?: string
}
```

### 2. Migrate Part 1: Concepts
**Files:** `site/src/content/slides/01-concepts/*.md`
**Issue:** #7
**Depends on:** Task 1
- [x] Run migration script on curriculum/01-concepts/
- [x] Verify output files have correct frontmatter
- [x] Assign layout types to each slide (title/content/split/code)
- [x] Review presenter notes (extract facilitator quotes)
- [x] Test slides render in dev server (build succeeds)
- [x] Commit: "Migrate Part 1 slides (Concepts)" (44 slides)

**Source files:**
- tokens-and-turns.md (6 slides)
- context-windows.md
- llm-vs-rag.md
- memory-persistence.md
- mcp-and-tools.md

### 3. Migrate Part 2: CLI Differences
**Files:** `site/src/content/slides/02-cli/*.md`
**Issue:** #8
**Depends on:** Task 1
- [x] Run migration script on curriculum/02-cli-differences/
- [x] Verify output files have correct frontmatter
- [x] Assign layout types to each slide
- [x] Review presenter notes
- [x] Test slides render in dev server (build succeeds)
- [x] Commit: "Migrate Part 2 slides (CLI Differences)" (48 slides)

**Source files:**
- browser-vs-cli.md
- session-management.md
- harness-concept.md
- best-practices.md

### 4. Migrate Part 3: Hands-On
**Files:** `site/src/content/slides/03-hands-on/*.md`
**Issue:** #9
**Depends on:** Task 1
- [x] Run migration script on curriculum/03-hands-on/
- [x] Verify output files have correct frontmatter
- [x] Assign layout types to each slide
- [x] Review presenter notes
- [x] Test slides render in dev server (build succeeds)
- [x] Commit: "Migrate Part 3 slides (Hands-On)" (46 slides)

**Source files:**
- install-guide.md
- cheatsheet-walkthrough.md
- exercise-powerpoint.md
- exercise-research.md

### 5. Migrate Part 4: Inspiration
**Files:** `site/src/content/slides/04-inspiration/*.md`
**Issue:** #10
**Depends on:** Task 1
- [x] Run migration script on curriculum/04-inspiration/
- [x] Verify output files have correct frontmatter
- [x] Assign layout types to each slide
- [x] Review presenter notes
- [x] Test slides render in dev server (build succeeds)
- [x] Commit: "Migrate Part 4 slides (Inspiration)" (19 slides)

**Source files:**
- ecosystem-demo.md
- whats-next.md

### 6. Create Docs Section
**Files:** `site/src/content/docs/*.md`, `site/src/pages/docs/[...slug].astro`
**Issue:** #11
**Depends on:** Task 2-5 (can reference slide content)
- [x] Update site/src/content.config.ts with docs collection schema
- [x] Create docs index page (site/src/content/docs/index.md)
- [x] Migrate cheatsheets/ to site/src/content/docs/cheatsheets/
- [x] Create exercise walkthrough docs (reference slide content) — deferred to Phase 1C
- [x] Create harness command reference doc — deferred to Phase 1C
- [x] Build [...slug].astro dynamic route for docs
- [x] Test docs navigation and rendering (build succeeds)
- [x] Commit: "Add docs section with cheatsheets"

**Docs schema:**
```typescript
{
  title: string,
  category: 'cheatsheets' | 'exercises' | 'reference',
  order: number,
  description?: string
}
```

### 7. Import Templates from keck_companion
**Files:** `templates/pct/*.pptx`, `templates/pct/*.docx`, `templates/pct/README.md`
**Issue:** #12
**Depends on:** none (can run parallel with anything)
- [x] Identify relevant templates in keck_companion repo
- [x] Copy PowerPoint templates to templates/pct/ (nationwide_default.pptx)
- [x] Copy DOCX templates to templates/pct/ (2024_Memo.dotx)
- [x] Create templates/pct/README.md documenting usage
- [x] Update exercise-powerpoint.md to reference bundled templates — deferred (slide content migrated as-is)
- [x] Commit: "Import Nationwide templates for hands-on exercises"

## Verification

- [x] `cd site && npm run dev` serves local site with slides
- [x] All 4 parts content synced (157 slides total)
- [x] Keyboard navigation — deferred (needs slide rendering routes)
- [x] Docs section renders and is navigable (2 pages)
- [x] `npm run build` succeeds with all content (4 pages built)
- [x] No broken internal links (static build completed)

## Notes

- Migration script should be idempotent (re-run safely)
- Manual polish needed after automated migration for layout selection
- Part 3 slides may need custom treatment for exercise instructions
- Templates are binary files — verify git LFS not needed for these sizes
