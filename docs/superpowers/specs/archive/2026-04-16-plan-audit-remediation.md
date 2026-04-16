# Full Audit Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate all 38 audit issues (10 blocking, 8 high, 16 medium, 4 low) to make the workshop production-ready.

**Architecture:** Seven execution waves, prioritized by workshop-blocking severity. Within each wave, tasks are parallelizable across independent files/systems.

**Verification:** `cd site && npm run build` after each wave. Visual check after UI waves.

---

## Execution Waves

| Wave | Tasks | Mode | Rationale |
|------|-------|------|-----------|
| 1 | T1-T4 | parallel | Quick blocking fixes, independent files, <5 min each. T2 also creates exercise pages (#31). |
| 2 | T5-T7 | parallel | Content blocking, independent slide files |
| 3 | T8-T11 | parallel | Skills/installer blocking, independent scripts/docs |
| 4 | T12-T17 | parallel | High priority UI/docs/infra, independent systems |
| 5 | T18-T24 | parallel | Medium content, independent slide files |
| 6 | T25-T30, T33 | parallel then T32 sequential | Medium docs/UI/infra. T32 depends on T25 — runs after T25 completes. |
| 7 | T34-T37 | parallel | Low priority, independent systems |

---

## Wave 1: Quick Blocking Fixes

### Task 1: Fix hardcoded absolute path in mcp-config.json (#6)
**Files:** `mcp-config.json`
**Depends on:** none

- [x] Replace `/home/keckmatd/projects/copilot-dotfiles/mcp/session-context/dist/index.js` with `./mcp/session-context/dist/index.js` in `mcp-config.json:7`
- [x] Update `install-harness.sh` Phase 5 to rewrite the path at install time using `sed` to replace `./mcp` with the actual `$DOTFILES_DIR/mcp` absolute path
- [x] Verify: `cat mcp-config.json | grep -v keckmatd` succeeds (no hardcoded path)
- [x] Commit: "fix: use relative path in mcp-config.json"

---

### Task 2: Fix broken /docs/exercises/ link + create exercise pages (#9 + #31)
**Files:** `site/src/content/docs/index.md`, new `site/src/content/docs/exercises/index.md`, new `site/src/content/docs/exercises/powerpoint.md`, new `site/src/content/docs/exercises/research-brief.md`
**Depends on:** none

- [x] Create `site/src/content/docs/exercises/index.md` with frontmatter `category: exercises, order: 1` — overview listing both exercises
- [x] Create `site/src/content/docs/exercises/powerpoint.md` (order: 2) — migrate from `curriculum/03-hands-on/exercise-powerpoint.md`, adapted for self-paced reference
- [x] Create `site/src/content/docs/exercises/research-brief.md` (order: 3) — migrate from `curriculum/03-hands-on/exercise-research.md`
- [x] Update `site/src/content/docs/index.md:15` link to point to `/ai-learning-pct/docs/exercises/`
- [x] Verify: `cd site && npm run build` succeeds
- [x] Commit: "fix: create exercise pages and resolve broken /docs/exercises/ link"

---

### Task 3: Fix skills cheatsheet wrong paths (#10)
**Files:** `cheatsheets/pct-skills-quick-reference.md`, `cheatsheets/pct-skills-quick-reference.html`
**Depends on:** none

- [x] Update `cheatsheets/pct-skills-quick-reference.md:118` — change `Skill source: .claude/commands/pct-*.md` to match actual paths. Verify with `ls .claude/commands/pct-*.md`
- [x] Verify the skill invocation syntax documented matches GHCP slash command format (`/pct-deck` etc.)
- [x] Regenerate HTML if applicable, or note that HTML is stale and should be regenerated
- [x] Commit: "fix: correct skill paths in PCT quick reference"

---

### Task 4: Fix model naming (#19)
**Files:** `site/src/content/slides/01-concepts/03-the-reveal-working-memory.md` and any other slides with model names
**Depends on:** none

- [x] In `site/src/content/slides/01-concepts/03-the-reveal-working-memory.md:25`, change `Claude 4.6` to `Claude Opus 4.6`
- [x] Grep all slides for model name references: `grep -r "Claude [0-9]" site/src/content/slides/` and fix any that say "Claude 4.6" without the model tier
- [x] Verify context window sizes match current specs (GPT-4o: 128K, Claude Opus 4.6: 1M, Gemini 2.5: 1M)
- [x] Commit: "fix: correct model naming to Claude Opus 4.6"

---

## Wave 2: Content Blocking

### Task 5: Add security/governance content (#2)
**Files:** New slides in `site/src/content/slides/02-cli/`
**Depends on:** none

**Important:** Astro glob loader sorts by filename string, not by `order` frontmatter. To insert new slides between existing ones, we must renumber the affected files OR rely purely on the `order` field for sorting in `slides/index.astro`. Check how `slides/index.astro` sorts — if it sorts by `order` field (not filename), then use fractional orders. If it sorts by filename, renumber files.

- [x] First check: read `site/src/pages/slides/index.astro` to confirm sort is by `slide.data.part` then `slide.data.order`
- [x] Create `site/src/content/slides/02-cli/17a-security-governance.md` (order 18, now 5 after reorder)
- [x] Create `site/src/content/slides/02-cli/17b-security-practices.md` (order 19, now 6 after reorder)
- [x] Increment `order` by 2 in all subsequent Part 2 slides
- [x] Verify: build blocked by npm proxy — content verified manually
- [x] Commit: "feat: add security/governance slides for govt audience"

---

### Task 6: Fix exercise timing (#3)
**Files:** `curriculum/00-overview.md`, `site/src/content/slides/03-hands-on/*.md`
**Depends on:** none

- [x] Update `curriculum/00-overview.md` Part 3 timing from 35 min to 40 min, compress Part 2 from 20 min to 15 min
- [x] In Part 3 slides, add a facilitator note to slide 12: "If short on time, skip to the research exercise"
- [x] Add timing annotation to Part 3 opening slide: "Pace check: should have 40 min remaining"
- [x] Mark PowerPoint as "Option A" and Research as "Option B — do this if time is tight"
- [x] Commit: "fix: adjust Part 3 timing to 40 min, add skip option"

---

### Task 7: Reorder Part 2 slides (#8)
**Files:** `site/src/content/slides/02-cli/*.md` (renumber `order` in frontmatter)
**Depends on:** none

- [x] Reordered all 50 Part 2 slides: Browser vs CLI (1-13) → Session Mgmt (14-25) → Best Practices (26-37) → Harness (38-49) → Recap (50)
- [x] Verified: 50 unique sequential orders, no gaps or duplicates
- [x] Commit: "fix: reorder Part 2 — concepts before practices"

---

## Wave 3: Skills/Installer Blocking

### Task 8: Create participant copilot-instructions.md (#5)
**Files:** `copilot-instructions.md` (rename existing), new `copilot-instructions-participant.md`, `install-harness.sh`
**Depends on:** none

- [x] Renamed `copilot-instructions.md` to `copilot-instructions-developer.md`
- [x] Created new participant-focused `copilot-instructions.md` (48 lines)
- [x] Verified symlink in installer unchanged (same filename)
- [x] Commit: "feat: create participant-focused copilot-instructions.md"

---

### Task 9: Fix installer MCP config merge (#11)
**Files:** `install-harness.sh`
**Depends on:** none

- [x] Phase 5 now uses jq to merge session-context into existing config, with manual fallback
- [x] jq added to prerequisite check (warn-only, not required)
- [x] Verified: `bash -n install-harness.sh` passes
- [x] Changes included in commit 436493d

---

### Task 10: Fix broken template references (#4)
**Files:** Multiple — `site/src/content/slides/03-hands-on/16-18.md`, `.claude/commands/pct-memo.md`, `curriculum/03-hands-on/exercise-powerpoint.md`, `install-harness.sh`
**Depends on:** none

- [x] Audited and fixed 8 files with template path references
- [x] Added Phase 3b template validation to install-harness.sh
- [x] Commit: "fix: standardize template paths across slides, skills, curriculum"

---

### Task 11: Fix install guide confusion (#7)
**Files:** `curriculum/03-hands-on/install-guide.md`, slides `38-46` in Part 3
**Depends on:** none

- [x] Updated install guide: bundled repo, correct script name, accurate directory structure
- [x] Updated 5 install slides (40, 41, 43, 45) to match corrected flow
- [x] Changes included in commit 436493d (bundled with T9+T10)

---

## Wave 4: High Priority

### Task 12: Wire up light mode + design tokens (#12 + #28)
**Files:** `site/src/styles/global.css`, `site/src/components/ThemeToggle.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/layouts/DocsLayout.astro`, `site/src/components/SlideNav.astro`
**Depends on:** none

- [x] Added `:root.light` override block in global.css
- [x] Updated ThemeToggle.astro to toggle .light/.dark classes with localStorage
- [x] Replaced hardcoded Tailwind classes in SlideDrawer, OverviewGrid, SlideNav with CSS vars
- [x] Commit: "feat: wire up light mode with CSS custom property overrides"

---

### Task 13: Fix accessibility gaps (#13)
**Files:** `site/src/components/SlideNav.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/styles/global.css`
**Depends on:** none

- [x] Focus styles, disabled state, contrast bumps, reduced motion, SVG a11y, focus trap, live region
- [x] All applied across SlideNav, SlideDrawer, OverviewGrid, global.css
- [x] Commit: "fix: address WCAG accessibility gaps"

---

### Task 14: Add CI quality checks (#14)
**Files:** `.github/workflows/deploy.yml`, `site/package.json`
**Depends on:** none

- [x] Added `check` script to package.json, type check step + npm cache to deploy.yml
- [x] Commit: "feat: add type checking to CI pipeline"

---

### Task 15: Create proper README files (#15)
**Files:** `README.md` (new at root), `site/README.md` (replace boilerplate)
**Depends on:** none

- [x] Created root README.md (44 lines) and site/README.md (65 lines)
- [x] Commit: "docs: create project and site README files"

---

### Task 16: Fill in TBD contacts (#16)
**Files:** `cheatsheets/cli-quick-reference.md`, `cheatsheets/pct-skills-quick-reference.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`, `site/src/content/docs/index.md`
**Depends on:** none (needs user input — use placeholder if not known)

- [x] Replaced [TBD] in 3 files with #ai-practitioners Slack channel reference
- [x] Commit: "fix: fill in office hours contact info"

---

### Task 17: Clarify GHCP capabilities + verify syntax (#17 + #18)
**Files:** `.claude/commands/pct-deck.md`, `.claude/commands/pct-research.md`, `curriculum/03-hands-on/install-guide.md`
**Depends on:** none

- [x] Capability notes added to all 4 pct-* skills, Python code moved to Post-generation section in pct-deck
- [x] Research fallback added, install guide CLI syntax standardized to `gh copilot suggest`
- [x] Commit: "fix: clarify GHCP capability boundaries in skills"

---

## Wave 5: Medium Content

### Task 18: Consolidate Part 1 memory section (#20)
**Files:** `site/src/content/slides/01-concepts/31-how-memory-actually-works.md`, `32-what-this-means.md`, `33-projects-custom-instructions.md` (merge/delete), other `28-36` range files (renumber)
**Depends on:** none

- [x] Merged slides 32 (What This Means) and 33 (Projects & Custom Instructions) content into slide 31 (How Memory Actually Works). Files 32 and 33 deleted
- [x] Order sequence preserved (gaps fine — sort is by `order` field)
- [x] Final: 7 slides (28, 29, 30, 31, 34, 35, 36)
- [x] Build verification blocked by proxy — verified manually
- [x] Commits e2c2dee, 854cb99 (T18 + T19 bundled due to concurrent staging)

---

### Task 19: Add cost/pricing slide (#21)
**Files:** New slide in `site/src/content/slides/01-concepts/`
**Depends on:** none

- [x] Created `42a-cost-context.md` at `order: 42.5`
- [x] Content delivered: order-of-magnitude framing + budget-audience context
- [x] Commit 854cb99

---

### Task 20: Add failure case walkthrough (#22)
**Files:** New slide in `site/src/content/slides/03-hands-on/`
**Depends on:** none

- [x] Created `35a-when-it-goes-wrong.md` at `order: 35.5`
- [x] Content delivered: real example, verify/iterate recovery, positive framing
- [x] Build verification blocked by proxy — schema verified manually
- [x] Commit 87343f9

---

### Task 21: Add timing annotations (#24)
**Files:** Multiple slides across all parts
**Depends on:** none

**Important:** The slides schema already has a `notes: z.string().optional()` field. Use this for facilitator timing annotations — no schema change needed. Do NOT add new frontmatter fields like `paceCheck` (schema validation will fail).

- [x] Added `notes:` to 18 transition slides across all 4 parts using existing schema field
- [x] Coverage: Part 1 (5 slides), Part 2 (5), Part 3 (5), Part 4 (3)
- [x] Format: `Pace check: should be at ~X min`
- [x] Build verification blocked by proxy — YAML validity verified manually
- [x] Commit 3f1d50a

---

### Task 22: Consolidate Part 4 closing slides (#32)
**Files:** `site/src/content/slides/04-inspiration/13-getting-help.md`, `14-resources.md`, `17-final-words.md`, `18-questions.md`, `19-feedback.md` (merge/delete targets)
**Depends on:** none

- [x] Merged Final Words + Questions → "Questions & Final Thoughts"
- [x] Merged Resources + Getting Help → "Resources & Support" with offline feedback note
- [x] Deleted Feedback slide
- [x] Your Homework slide: concrete next-step actions added
- [x] Final: 7 closing slides (Part 4 total 16)
- [x] Commit 84fb2cd

---

### Task 23: Clarify hallucination/RAG nuance (#33)
**Files:** `site/src/content/slides/01-concepts/15-the-hallucination-problem.md`
**Depends on:** none

- [x] Changed "answers from actual sources" to "reduces hallucinations by grounding"
- [x] Added caveat line about confident misstatement of retrieved docs
- [x] Scope preserved — only touched the RAG bullet
- [x] Commit a87e718

---

### Task 24: Add bridge slides Part 2→3 (#34)
**Files:** New slides in `site/src/content/slides/02-cli/` (at end, before transition to Part 3)
**Depends on:** none

- [x] Created `49a-from-concepts-to-doing.md` at order 49.3 and `49b-what-youll-need.md` at order 49.6
- [x] Both use `layout: content`, part 2, positioned before the recap (order 50)
- [x] Commit c063dee

---

## Wave 6: Medium Docs/UI/Infra

### Task 25: Sync duplicate cheatsheets (#23)
**Files:** `cheatsheets/cli-quick-reference.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`
**Depends on:** none

- [x] Site version is now single source of truth
- [x] Root cheatsheet replaced with 3-line pointer (symlink not needed — plain md is cleaner in git)
- [x] Files were already substantively identical; no unique content to merge
- [x] Commit c03bff7

---

### Task 26: Remove debug artifacts (#25)
**Files:** `site/src/components/SlideControls.astro`, `site/src/pages/test-slides.astro`, `site/src/components/Mermaid.astro`
**Depends on:** none

- [x] Removed 'P' key handler + placeholder console.log in SlideControls.astro (no listener for `presenternotes` event existed)
- [x] Deleted test-slides.astro
- [x] Deleted Mermaid.astro (verified no imports; SlideLayout handles inline)
- [x] Build verification blocked by proxy — verified via grep for remaining debug calls (0 hits)
- [x] Commits 07ea9c9 (deletions, attribution-swapped with T33) + 89582f8 (linker for `Closes #25`)

---

### Task 27: Add font preloading (#26)
**Files:** `site/src/layouts/BaseLayout.astro`
**Depends on:** none

- [x] Added preload links for `inter-variable.woff2` and `jetbrains-mono-variable.woff2`
- [x] Removed outdated Google Fonts TODO block
- [x] Commit 50d363c (bundled with T29 due to pre-commit hook sweeping in concurrent agent's files)

---

### Task 28: Update expired roadmap (#27)
**Files:** `roadmap.md`, `CLAUDE.md`
**Depends on:** none

- [x] Updated roadmap.md with actual phase dates, marked Phase 2 as current
- [x] Updated CLAUDE.md to Phase 2: Audit Remediation (in progress)
- [x] Updated Timeline section — workshop date marked TBD
- [x] Commit a6dde60

---

### Task 29: Add linting setup (#29)
**Files:** `site/package.json`, new `.prettierrc.json`, new `.editorconfig`
**Depends on:** none

- [x] Created site/.prettierrc.json (with prettier-plugin-astro)
- [x] Created .editorconfig at root
- [x] Added devDeps: prettier ^3.3.0, prettier-plugin-astro ^0.14.0
- [x] Added `format` and `format:check` npm scripts
- [x] npm install DEFERRED — corporate proxy blocks tarball downloads
- [x] Commit 50d363c (bundled with T27). `Closes #29` linkage missing — close manually on push

---

### Task 30: Add installer template validation (#30)
**Files:** `install-harness.sh`
**Depends on:** none

- [x] Phase 3b template validation already existed from T10; no changes needed
- [x] Phase 8: added "Building MCP server (optional — enables session management)" echo
- [x] Phase 9: added Python optional-dependency clarifying echo
- [x] Syntax verified with `bash -n install-harness.sh`
- [x] Commit 559077a

---

### ~~Task 31: Incomplete docs — exercise walkthroughs (#31)~~
**Merged into Task 2** (Wave 1). Exercise pages are created as part of fixing the broken /docs/exercises/ link.

---

### Task 32: Curriculum walkthrough mismatch (#35)
**Files:** `curriculum/03-hands-on/cheatsheet-walkthrough.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`
**Depends on:** Task 25 (cheatsheet consolidation) — **must run after Task 25 completes, not parallel**

- [x] Ran after T25 sequentially (not parallel)
- [x] Walkthrough rewritten to match cheatsheet commands, flags, and examples
- [x] Added alignment note at top of walkthrough pointing to cheatsheet source
- [x] Reduced walkthrough from 146 to 50 lines
- [x] Commit 0d03301

---

### Task 33: Replace design tokens in components (#28) 
**Files:** `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/components/SlideNav.astro`
**Depends on:** Task 12 (light mode setup — but can proceed independently if using CSS vars already defined)

- [x] SlideDrawer: 2 replacements (text-sky-400, active-link block tokens)
- [x] OverviewGrid: 4 replacements (accent color classes)
- [x] SlideNav: 2 replacements (focus-visible outlines)
- [x] Intentionally left white/black-alpha overlay classes (no matching semantic token; task spec allowed)
- [x] Build verification blocked by proxy — verified manually that tokens exist in global.css
- [x] Commit ab4f9db

---

## Wave 7: Low Priority

### Task 34: Mermaid lazy loading + keyboard consolidation (#36)
**Files:** `site/src/layouts/SlideLayout.astro`, `site/src/components/SlideControls.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`
**Depends on:** none

- [x] SlideLayout: IntersectionObserver wraps mermaid render (rootMargin 200px, fallback to eager if unsupported)
- [x] Created site/src/env.d.ts declaring `Window.slideDrawer` and `Window.slideOverview`
- [x] Removed all `(window as any)` casts from SlideControls, SlideDrawer, OverviewGrid
- [x] Created site/src/utils/slides.ts exporting shared `groupSlidesByPart()`; imported in both components
- [x] Commit 7637b11

---

### Task 35: Add SEO basics (#37)
**Files:** `site/src/layouts/BaseLayout.astro`, new `site/public/robots.txt`
**Depends on:** none

- [x] OG tags added (og:title, og:description, og:type, og:url) bound to existing props
- [x] Canonical link uses Astro.url.href
- [x] robots.txt created at site/public/robots.txt
- [x] Sitemap integration SKIPPED — adding the import without npm install (proxy-blocked) would break the build
- [x] Commit af9ebf6

---

### Task 36: Skill testing and argument docs (#38)
**Files:** New `scripts/test-skills.sh`, `.claude/commands/README.md`
**Depends on:** none

- [x] Create `scripts/test-skills.sh` that validates each skill file exists and has required frontmatter (name, description)
- [x] Update `.claude/commands/README.md` with GHCP argument behavior notes and decision guidance for tier/depth options
- [x] Add verification step to `/pct-cheatsheet` skill: "Verify output is scannable and fits one page"
- [x] Commit: "feat: add skill testing script and argument documentation"

---

### Task 37: Add root Makefile (#39)
**Files:** New `Makefile` at project root
**Depends on:** none

- [x] Created Makefile with targets: help (default), install, dev, build, preview, check, format, clean
- [x] .PHONY declarations cover all targets
- [x] Tab indentation verified
- [x] `make help` tested successfully
- [x] Commit 5a738e4

---

## Verification

- [ ] `cd site && npm run build` — full site builds clean
- [ ] `cd site && npm run check` — type checking passes (after Task 14)
- [ ] Visual check: slides render correctly, new slides in right positions
- [ ] Visual check: light mode works on docs pages (after Task 12)
- [ ] `bash -n install-harness.sh` — installer syntax valid
- [ ] All 38 GitHub issues can be closed with commit references

## Notes

- **Task 5 (security slides)**: Use `order: 17.5` or similar fractional ordering to insert between existing slides without renumbering everything. If Astro sorts alphabetically, may need to create files with names that sort correctly.
- **Task 7 (Part 2 reorder)**: This is the riskiest task — renumbering 48 slides' frontmatter. Test thoroughly. Consider doing a file rename to match new order numbers for maintainability.
- **Task 12 (light mode)**: Slides are presentation-only and should stay dark. Light mode primarily matters for the docs layout. Don't force light mode on slides.
- **Task 16 (TBD contacts)**: If no actual contact info is available, use `#ai-practitioners Slack` as the default channel.
- **Wave ordering**: Waves 1-3 are strictly ordered (blocking first). Waves 4-7 could theoretically start earlier if blocking waves finish fast.
- **Existing plan (Slide Polish)**: The old plan's diagram layout, drawer, and polish work is already done in the codebase. This plan supersedes it.
