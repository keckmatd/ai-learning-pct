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

- [ ] Replace `/home/keckmatd/projects/copilot-dotfiles/mcp/session-context/dist/index.js` with `./mcp/session-context/dist/index.js` in `mcp-config.json:7`
- [ ] Update `install-harness.sh` Phase 5 to rewrite the path at install time using `sed` to replace `./mcp` with the actual `$DOTFILES_DIR/mcp` absolute path
- [ ] Verify: `cat mcp-config.json | grep -v keckmatd` succeeds (no hardcoded path)
- [ ] Commit: "fix: use relative path in mcp-config.json"

---

### Task 2: Fix broken /docs/exercises/ link + create exercise pages (#9 + #31)
**Files:** `site/src/content/docs/index.md`, new `site/src/content/docs/exercises/index.md`, new `site/src/content/docs/exercises/powerpoint.md`, new `site/src/content/docs/exercises/research-brief.md`
**Depends on:** none

- [ ] Create `site/src/content/docs/exercises/index.md` with frontmatter `category: exercises, order: 1` — overview listing both exercises
- [ ] Create `site/src/content/docs/exercises/powerpoint.md` (order: 2) — migrate from `curriculum/03-hands-on/exercise-powerpoint.md`, adapted for self-paced reference
- [ ] Create `site/src/content/docs/exercises/research-brief.md` (order: 3) — migrate from `curriculum/03-hands-on/exercise-research.md`
- [ ] Update `site/src/content/docs/index.md:15` link to point to `/ai-learning-pct/docs/exercises/`
- [ ] Verify: `cd site && npm run build` succeeds
- [ ] Commit: "fix: create exercise pages and resolve broken /docs/exercises/ link"

---

### Task 3: Fix skills cheatsheet wrong paths (#10)
**Files:** `cheatsheets/pct-skills-quick-reference.md`, `cheatsheets/pct-skills-quick-reference.html`
**Depends on:** none

- [ ] Update `cheatsheets/pct-skills-quick-reference.md:118` — change `Skill source: .claude/commands/pct-*.md` to match actual paths. Verify with `ls .claude/commands/pct-*.md`
- [ ] Verify the skill invocation syntax documented matches GHCP slash command format (`/pct-deck` etc.)
- [ ] Regenerate HTML if applicable, or note that HTML is stale and should be regenerated
- [ ] Commit: "fix: correct skill paths in PCT quick reference"

---

### Task 4: Fix model naming (#19)
**Files:** `site/src/content/slides/01-concepts/03-the-reveal-working-memory.md` and any other slides with model names
**Depends on:** none

- [ ] In `site/src/content/slides/01-concepts/03-the-reveal-working-memory.md:25`, change `Claude 4.6` to `Claude Opus 4.6`
- [ ] Grep all slides for model name references: `grep -r "Claude [0-9]" site/src/content/slides/` and fix any that say "Claude 4.6" without the model tier
- [ ] Verify context window sizes match current specs (GPT-4o: 128K, Claude Opus 4.6: 1M, Gemini 2.5: 1M)
- [ ] Commit: "fix: correct model naming to Claude Opus 4.6"

---

## Wave 2: Content Blocking

### Task 5: Add security/governance content (#2)
**Files:** New slides in `site/src/content/slides/02-cli/`
**Depends on:** none

**Important:** Astro glob loader sorts by filename string, not by `order` frontmatter. To insert new slides between existing ones, we must renumber the affected files OR rely purely on the `order` field for sorting in `slides/index.astro`. Check how `slides/index.astro` sorts — if it sorts by `order` field (not filename), then use fractional orders. If it sorts by filename, renumber files.

- [ ] First check: read `site/src/pages/slides/index.astro` to confirm sort is by `slide.data.part` then `slide.data.order` (it should be — this is the Astro content collection pattern)
- [ ] Create `site/src/content/slides/02-cli/17a-security-governance.md`:
```yaml
---
title: "One Responsibility"
part: 2
order: 18
layout: "content"
sourceFile: "browser-vs-cli"
---
```
Content: "With CLI AI in your workspace, you control what it accesses" — cover permissions model, audit trails, data residency, what NOT to share. Frame as empowerment for govt audience.

- [ ] Create `site/src/content/slides/02-cli/17b-security-practices.md` with `order: 19` — practical guidance: review before accepting, don't paste credentials, use .gitignore
- [ ] Increment `order` by 2 in all subsequent Part 2 slides (those with order >= 18) to make room. This is the safe approach — bulk-update frontmatter `order` values
- [ ] Verify: `cd site && npm run build` succeeds and new slides appear in correct position after "The Real Difference"
- [ ] Commit: "feat: add security/governance slides for govt audience"

---

### Task 6: Fix exercise timing (#3)
**Files:** `curriculum/00-overview.md`, `site/src/content/slides/03-hands-on/*.md`
**Depends on:** none

- [ ] Update `curriculum/00-overview.md` Part 3 timing from 35 min to 40 min, compress Part 2 from 20 min to 15 min (the reorder in Task 7 will make Part 2 tighter)
- [ ] In Part 3 slides, add a facilitator note to slide 12 (`exercise-build-a-powerpoint.md`): "If short on time, skip to the research exercise — it's more impactful for this audience"
- [ ] Add timing annotation to Part 3 opening slide: "Pace check: should have 40 min remaining"
- [ ] Mark the PowerPoint exercise as "Option A" and Research as "Option B — do this if time is tight" by adding facilitator notes in frontmatter
- [ ] Commit: "fix: adjust Part 3 timing to 40 min, add skip option"

---

### Task 7: Reorder Part 2 slides (#8)
**Files:** `site/src/content/slides/02-cli/*.md` (renumber `order` in frontmatter)
**Depends on:** none

- [ ] Current Part 2 order: 01-12 (best practices) → 13 (recap) → 14 (transition) → 15-24 (browser vs CLI) → 25 (transition) → 26-36 (harness) → 37 (transition) → 38-48 (session mgmt). New order should be: Browser vs CLI concepts first → Session Management → Best Practices → Harness → Recap
- [ ] Update `order` frontmatter in each file to reflect new sequence. Target ordering:
  - 14-24 (Browser vs CLI, currently order 14-24) → renumber to order 1-11
  - 38-48 (Session Management, currently order 38-48) → renumber to order 12-22
  - 01-12 (Best Practices, currently order 1-12) → renumber to order 23-34
  - 26-36 (Harness, currently order 26-36) → renumber to order 35-45
  - 13 (Recap, currently order 13) → renumber to order 46
  - Transitions placed between sections
- [ ] Verify: `cd site && npm run build` — slides render in new order
- [ ] Commit: "fix: reorder Part 2 — concepts before practices"

---

## Wave 3: Skills/Installer Blocking

### Task 8: Create participant copilot-instructions.md (#5)
**Files:** `copilot-instructions.md` (rename existing), new `copilot-instructions-participant.md`, `install-harness.sh`
**Depends on:** none

- [ ] Rename current `copilot-instructions.md` to `copilot-instructions-developer.md` (this is the personal dev config)
- [ ] Create new `copilot-instructions.md` targeted at workshop participants:
  - Who the user is (PCT cabinet member, familiar with browser AI, new to CLI)
  - Available skills (/pct-deck, /pct-memo, /pct-research, /pct-cheatsheet)
  - How to start a session, iterate on output, end a session
  - Best practices for beginners (be specific, include context files, review output)
  - Keep it under 50 lines — concise and actionable
- [ ] Update `install-harness.sh:90` symlink to point to the new participant version
- [ ] Commit: "feat: create participant-focused copilot-instructions.md"

---

### Task 9: Fix installer MCP config merge (#11)
**Files:** `install-harness.sh`
**Depends on:** none

- [ ] Replace `install-harness.sh:141-145` (Phase 5 MCP Registration) with a merge strategy:
  - If `$MCP_CONFIG` exists: use `jq` to read existing config, merge in session-context entry without overwriting other servers
  - If `$MCP_CONFIG` doesn't exist: copy fresh
  - Add `jq` to prerequisites check (Phase 1) or fall back to manual merge instruction if jq unavailable
- [ ] Also fix the path in the source `mcp-config.json` to use `$DOTFILES_DIR` (coordinate with Task 1's relative path fix — the installer should rewrite at install time)
- [ ] Verify: `bash -n install-harness.sh` (syntax check)
- [ ] Commit: "fix: merge MCP config instead of overwriting"

---

### Task 10: Fix broken template references (#4)
**Files:** Multiple — `site/src/content/slides/03-hands-on/16-18.md`, `.claude/commands/pct-memo.md`, `curriculum/03-hands-on/exercise-powerpoint.md`, `install-harness.sh`
**Depends on:** none

- [ ] Audit ALL template path references: `grep -rn "templates/" site/src/content/slides/ .claude/commands/ curriculum/`
- [ ] Verify actual template files exist: `ls templates/pct/` — confirm `nationwide_default.pptx` and `2024_Memo.dotx` exist
- [ ] Fix slide 16 (`16-look-at-available-templates.md`): update the `ls templates/` and `cat templates/powerpoint-template.md` commands to match actual paths (`ls templates/pct/`, `cat templates/pct/README.md`)
- [ ] Fix `.claude/commands/pct-memo.md:145`: verify `templates/pct/2024_Memo.dotx` path is correct
- [ ] Fix `curriculum/03-hands-on/exercise-powerpoint.md:32-37`: update template paths
- [ ] Add template validation to `install-harness.sh` after Phase 3: `test -f "$DOTFILES_DIR/templates/pct/nationwide_default.pptx" || log_warn "Template files missing"`
- [ ] Commit: "fix: standardize template paths across slides, skills, curriculum"

---

### Task 11: Fix install guide confusion (#7)
**Files:** `curriculum/03-hands-on/install-guide.md`, slides `38-46` in Part 3
**Depends on:** none

- [ ] Update `curriculum/03-hands-on/install-guide.md:20-30` — clarify that copilot-dotfiles is **bundled in this repo**, not an external clone. Change clone URL to point to ai-learning-pct repo or provide direct download instructions
- [ ] Update the script name from `setup.sh` to `install-harness.sh` (line 44-45) to match actual filename
- [ ] Update the "What Got Installed" section (lines 105-115) to match actual directory structure (`~/.copilot/` with symlinks to skills, agents, copilot-instructions.md)
- [ ] Update corresponding slides (`site/src/content/slides/03-hands-on/38-install-guide.md` through `46-next-learn-the-commands.md`) to match the corrected install flow
- [ ] Commit: "fix: clarify bundled install flow in guide and slides"

---

## Wave 4: High Priority

### Task 12: Wire up light mode + design tokens (#12 + #28)
**Files:** `site/src/styles/global.css`, `site/src/components/ThemeToggle.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/layouts/DocsLayout.astro`, `site/src/components/SlideNav.astro`
**Depends on:** none

- [ ] In `global.css`, move light mode vars from standalone `--color-light-*` into a proper class-based override:
```css
.light, :root:not(.dark) .docs-layout {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #334155;
  --color-text-muted: #64748b;
}
```
- [ ] Update `ThemeToggle.astro` script to toggle CSS custom properties by adding/removing a class on `:root` that activates light mode vars
- [ ] Replace hardcoded Tailwind classes in `SlideDrawer.astro`: `bg-slate-800` → use CSS var, `text-slate-400` → use CSS var, `border-slate-700` → use CSS var
- [ ] Replace hardcoded classes in `OverviewGrid.astro`: `bg-slate-900/95`, `text-white/40`, `text-white/80` → CSS var equivalents
- [ ] Replace hardcoded classes in `DocsLayout.astro`: already uses `dark:` variants which is fine for docs
- [ ] Fix `SlideNav.astro:53`: replace `bg-blue-500` with `bg-[var(--color-accent)]` for progress bar
- [ ] Verify: build succeeds, light mode toggles work on docs layout
- [ ] Commit: "feat: wire up light mode with CSS custom property overrides"

---

### Task 13: Fix accessibility gaps (#13)
**Files:** `site/src/components/SlideNav.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/styles/global.css`
**Depends on:** none

- [ ] **Focus styles**: Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400` to nav buttons in `SlideNav.astro:13-48`
- [ ] **Hidden nav buttons**: In `SlideNav.astro:23,42`, replace `invisible` class with `disabled` attribute + `opacity-0 pointer-events-none` so they're removed from tab order at boundaries
- [ ] **Contrast**: Replace `text-white/30` with `text-white/60` minimum in `SlideNav.astro:20,39`, `OverviewGrid.astro:77,92`, `SlideDrawer.astro:117`
- [ ] **Reduced motion**: Add to `global.css`:
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```
- [ ] **SVG a11y**: Add `aria-hidden="true"` to all decorative SVGs in SlideNav, SlideDrawer, OverviewGrid
- [ ] **Focus trap**: Add basic focus trap to drawer overlay in `SlideDrawer.astro` script — trap Tab key within drawer when open
- [ ] **Live region**: Add `aria-live="polite"` to slide counter in `SlideNav.astro:59`
- [ ] Verify: build succeeds, tab through the UI to confirm focus visible
- [ ] Commit: "fix: address WCAG accessibility gaps"

---

### Task 14: Add CI quality checks (#14)
**Files:** `.github/workflows/deploy.yml`, `site/package.json`
**Depends on:** none

- [ ] Add to `site/package.json` scripts: `"check": "astro check"` (Astro type-checking)
- [ ] Update `.github/workflows/deploy.yml` build job — add a step before build:
```yaml
- name: Type Check
  run: npm run check
  working-directory: site
```
- [ ] Add npm cache to CI for speed:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'npm'
    cache-dependency-path: site/package-lock.json
```
- [ ] Verify: `.github/workflows/deploy.yml` is valid YAML
- [ ] Commit: "feat: add type checking to CI pipeline"

---

### Task 15: Create proper README files (#15)
**Files:** `README.md` (new at root), `site/README.md` (replace boilerplate)
**Depends on:** none

- [ ] Create root `README.md` with: project title, one-line description, directory structure overview, quick start (`cd site && npm install && npm run dev`), deployment info (GitHub Pages via Actions), link to curriculum overview
- [ ] Replace `site/README.md` boilerplate with: local dev setup, content collections (slides, docs), component guide (Slide, SlideNav, SlideDrawer, etc.), how to add new slides
- [ ] Keep both READMEs concise — under 80 lines each
- [ ] Commit: "docs: create project and site README files"

---

### Task 16: Fill in TBD contacts (#16)
**Files:** `cheatsheets/cli-quick-reference.md`, `cheatsheets/pct-skills-quick-reference.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`, `site/src/content/docs/index.md`
**Depends on:** none (needs user input — use placeholder if not known)

- [ ] In all files, replace `[TBD]` for Office Hours with either the actual contact info or a clear placeholder: `Office Hours: Check #ai-practitioners Slack channel for scheduling`
- [ ] `cheatsheets/cli-quick-reference.md:97`: replace `[TBD]`
- [ ] `site/src/content/docs/cheatsheets/cli-quick-reference.md` (if different from above): replace `[TBD]`
- [ ] `site/src/content/docs/index.md:21`: replace `[TBD]`
- [ ] Commit: "fix: fill in office hours contact info"

---

### Task 17: Clarify GHCP capabilities + verify syntax (#17 + #18)
**Files:** `.claude/commands/pct-deck.md`, `.claude/commands/pct-research.md`, `curriculum/03-hands-on/install-guide.md`
**Depends on:** none

- [ ] In `.claude/commands/pct-deck.md:122-155`, move Python code from the skill body into a "Post-generation" section that clearly says: "To create actual .pptx files, run the Python script separately: `python scripts/generate-pptx.py content.json output.pptx`". The skill itself should output structured JSON/markdown, not Python code inline.
- [ ] In `.claude/commands/pct-research.md:38-49`, add explicit fallback: "If web search is unavailable, use training knowledge and clearly note 'Source: AI training data, verify independently'"
- [ ] Add a note at the top of each /pct-* skill: "Note: GHCP generates content (text/JSON). File generation (.pptx, .docx) requires running Python scripts separately."
- [ ] Verify `curriculum/03-hands-on/install-guide.md` GHCP commands match current syntax (`gh copilot suggest` vs `ghcp`)
- [ ] Commit: "fix: clarify GHCP capability boundaries in skills"

---

## Wave 5: Medium Content

### Task 18: Consolidate Part 1 memory section (#20)
**Files:** `site/src/content/slides/01-concepts/31-how-memory-actually-works.md`, `32-what-this-means.md`, `33-projects-custom-instructions.md` (merge/delete), other `28-36` range files (renumber)
**Depends on:** none

- [ ] Merge slides 31 (How Memory Actually Works) and 32 (What This Means) into a single slide — combine key points
- [ ] Compress slide 33 (Projects & Custom Instructions) into a bullet point on the merged slide or move to a "Resources" appendix
- [ ] Update `order` frontmatter to maintain sequence with gap (renumber if needed)
- [ ] Target: reduce from 9 slides (28-36) to 6-7 slides
- [ ] Verify: `cd site && npm run build`
- [ ] Commit: "fix: consolidate Part 1 memory section from 9 to 7 slides"

---

### Task 19: Add cost/pricing slide (#21)
**Files:** New slide in `site/src/content/slides/01-concepts/`
**Depends on:** none

- [ ] Create slide after the token discussion (after slide 42): `site/src/content/slides/01-concepts/42a-cost-context.md`
- [ ] Content: order-of-magnitude costs — "1M tokens of Claude Opus ~ $15 input / $75 output. A typical research brief ~ 50-100K tokens ~ a few dollars. Budget impact is minimal for individual use."
- [ ] Frame for budget-approving audience: "Your team's monthly AI cost will likely be less than one lunch meeting"
- [ ] Commit: "feat: add cost/pricing context slide for PCT audience"

---

### Task 20: Add failure case walkthrough (#22)
**Files:** New slide in `site/src/content/slides/03-hands-on/`
**Depends on:** none

- [ ] Create slide after the research exercise discussion. Use `order` between existing 35 (key-takeaway) and 36 (part-3-complete). Since `order` accepts any number (z.number()), use `order: 35.5`. Name the file `35a-when-it-goes-wrong.md` — filename doesn't matter for sort since `slides/index.astro` sorts by `part` then `order` field.
- [ ] Content: "Real example: AI generated a research brief but cited a policy document that doesn't exist. Here's how to catch and fix it: 1) Always verify citations 2) Ask AI to check its own sources 3) Iterate — 'That source seems wrong, find the actual policy'"
- [ ] Frame positively: "Failure is part of the workflow, not a bug"
- [ ] Verify: `cd site && npm run build`
- [ ] Commit: "feat: add failure case walkthrough slide"

---

### Task 21: Add timing annotations (#24)
**Files:** Multiple slides across all parts
**Depends on:** none

**Important:** The slides schema already has a `notes: z.string().optional()` field. Use this for facilitator timing annotations — no schema change needed. Do NOT add new frontmatter fields like `paceCheck` (schema validation will fail).

- [ ] Add `notes:` to frontmatter of key transition slides with pace-check timing
- [ ] Part 1 (44 slides, 25 min): add notes at slides 1, 8 (transition), 17 (transition), 27, 37 (transition), 44 (transition)
- [ ] Part 2 (~50 slides, 15 min): add notes at slides 1, 14 (transition), 25 (transition), 37 (transition), 48 (transition)
- [ ] Part 3 (46 slides, 40 min): add notes at slides 1, 11, 24, 37 (transition), 46
- [ ] Part 4 (19 slides, 10 min): add notes at slides 1, 9 (transition), 19
- [ ] Format: `notes: "Pace check: should be at ~15 min"`
- [ ] Verify: `cd site && npm run build` — no schema errors
- [ ] Commit: "feat: add facilitator pace-check annotations"

---

### Task 22: Consolidate Part 4 closing slides (#32)
**Files:** `site/src/content/slides/04-inspiration/13-getting-help.md`, `14-resources.md`, `17-final-words.md`, `18-questions.md`, `19-feedback.md` (merge/delete targets)
**Depends on:** none

- [ ] Merge "Final Words" (17) + "Questions" (18) into a single "Questions & Final Thoughts" slide
- [ ] Merge "Resources" (14) + "Getting Help" (13) into a single "Resources & Support" slide
- [ ] Remove "Feedback" slide (19) — handle offline via email/form link on resources slide
- [ ] Add specific next-step actions to "Your Homework" slide instead of vague links
- [ ] Target: reduce from 10 to 6-7 slides
- [ ] Commit: "fix: consolidate Part 4 closing from 10 to 7 slides"

---

### Task 23: Clarify hallucination/RAG nuance (#33)
**Files:** `site/src/content/slides/01-concepts/15-the-hallucination-problem.md`
**Depends on:** none

- [ ] Update slide content: change "RAG fixes hallucinations" framing to "RAG reduces hallucinations by grounding responses in retrieved data"
- [ ] Add caveat: "AI can still confidently misstate things about retrieved documents — always verify critical facts"
- [ ] Keep concise — this is one bullet point adjustment, not a rewrite
- [ ] Commit: "fix: clarify RAG reduces but doesn't eliminate hallucinations"

---

### Task 24: Add bridge slides Part 2→3 (#34)
**Files:** New slides in `site/src/content/slides/02-cli/` (at end, before transition to Part 3)
**Depends on:** none

- [ ] Create 2 bridge slides at the end of Part 2 (before the Part 2→3 transition):
  - Slide 1: "From Concepts to Doing" — "You now understand why CLI AI is different. Next: we'll install it and build something. No CLI experience needed — we'll walk through each step."
  - Slide 2: "What You'll Need" — checklist: terminal, GitHub access, 40 minutes. "If anything fails, pair with a neighbor or watch the demo."
- [ ] Use layout `content`, part 2, order them just before the transition slide
- [ ] Commit: "feat: add bridge slides easing Part 2→3 transition"

---

## Wave 6: Medium Docs/UI/Infra

### Task 25: Sync duplicate cheatsheets (#23)
**Files:** `cheatsheets/cli-quick-reference.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`
**Depends on:** none

- [ ] Make `site/src/content/docs/cheatsheets/cli-quick-reference.md` the single source of truth
- [ ] Replace `cheatsheets/cli-quick-reference.md` content with a note pointing to the site version, or make it a symlink: `ln -sf ../site/src/content/docs/cheatsheets/cli-quick-reference.md cheatsheets/cli-quick-reference.md`
- [ ] Verify the site version has all content from both files (merge any unique content first)
- [ ] Commit: "fix: consolidate cheatsheet to single source"

---

### Task 26: Remove debug artifacts (#25)
**Files:** `site/src/components/SlideControls.astro`, `site/src/pages/test-slides.astro`, `site/src/components/Mermaid.astro`
**Depends on:** none

- [ ] Remove `console.log('[SlideControls] Presenter notes toggle (placeholder)')` from `SlideControls.astro:73` — either implement presenter notes or remove the placeholder entirely (remove the 'P' key handler if no presenter notes feature)
- [ ] Delete `site/src/pages/test-slides.astro` (debug page)
- [ ] Delete `site/src/components/Mermaid.astro` if unused (SlideLayout has inline mermaid rendering)
- [ ] Verify: `cd site && npm run build`
- [ ] Commit: "fix: remove debug artifacts from production"

---

### Task 27: Add font preloading (#26)
**Files:** `site/src/layouts/BaseLayout.astro`
**Depends on:** none

- [ ] Add font preload links in `BaseLayout.astro` head (after line 20):
```html
<link rel="preload" href="/ai-learning-pct/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/ai-learning-pct/fonts/jetbrains-mono-variable.woff2" as="font" type="font/woff2" crossorigin />
```
- [ ] Remove the outdated TODO comment on line 22-25 (the Google Fonts commented-out block)
- [ ] Commit: "perf: add font preloading for faster first paint"

---

### Task 28: Update expired roadmap (#27)
**Files:** `roadmap.md`, `CLAUDE.md`
**Depends on:** none

- [ ] Update `roadmap.md` dates to reflect actual timeline — mark completed phases with actual dates, update upcoming dates
- [ ] Update `CLAUDE.md:80` — change "Phase 1A: Infrastructure (in progress)" to "Phase 2: Audit Remediation (in progress)"
- [ ] Update the Timeline section in CLAUDE.md to reflect current reality
- [ ] Commit: "docs: update roadmap and CLAUDE.md to reflect current phase"

---

### Task 29: Add linting setup (#29)
**Files:** `site/package.json`, new `.prettierrc.json`, new `.editorconfig`
**Depends on:** none

- [ ] Create `.prettierrc.json` at site root: `{ "semi": true, "singleQuote": true, "trailingComma": "es5", "printWidth": 100 }`
- [ ] Create `.editorconfig` at project root with standard settings (2-space indent for TS/Astro, LF line endings)
- [ ] Add devDependencies to `site/package.json`: `prettier`
- [ ] Add npm scripts: `"format": "prettier --write 'src/**/*.{astro,ts,css}'", "format:check": "prettier --check 'src/**/*.{astro,ts,css}'"`
- [ ] Run `cd site && npm install`
- [ ] Commit: "feat: add prettier and editorconfig for code formatting"

---

### Task 30: Add installer template validation (#30)
**Files:** `install-harness.sh`
**Depends on:** none

- [ ] After Phase 3 (Symlinks), add a new phase for template validation:
```bash
echo "Phase 3b: Templates"
for tmpl in templates/pct/nationwide_default.pptx templates/pct/2024_Memo.dotx; do
  if [ -f "$DOTFILES_DIR/$tmpl" ]; then
    log_ok "$(basename "$tmpl") found"
  else
    log_warn "$(basename "$tmpl") missing — document generation won't work"
  fi
done
```
- [ ] Clarify Python messaging in Phase 9: add echo "Python is optional. Not required for the 90-min workshop. Needed for actual file generation afterward."
- [ ] Add explanatory echo before MCP build in Phase 8: "Building MCP server (optional — enables session management)"
- [ ] Commit: "fix: add template validation and clarify optional dependencies"

---

### ~~Task 31: Incomplete docs — exercise walkthroughs (#31)~~
**Merged into Task 2** (Wave 1). Exercise pages are created as part of fixing the broken /docs/exercises/ link.

---

### Task 32: Curriculum walkthrough mismatch (#35)
**Files:** `curriculum/03-hands-on/cheatsheet-walkthrough.md`, `site/src/content/docs/cheatsheets/cli-quick-reference.md`
**Depends on:** Task 25 (cheatsheet consolidation) — **must run after Task 25 completes, not parallel**

- [ ] Wait for Task 25 to complete (cheatsheet consolidated to single source)
- [ ] Compare `curriculum/03-hands-on/cheatsheet-walkthrough.md` examples against the consolidated cheatsheet at `site/src/content/docs/cheatsheets/cli-quick-reference.md`
- [ ] Update walkthrough to reference the same commands, flags, and patterns as the cheatsheet
- [ ] Ensure the facilitator walkthrough matches what participants see on their printed card
- [ ] Commit: "fix: align curriculum walkthrough with actual cheatsheet"

---

### Task 33: Replace design tokens in components (#28) 
**Files:** `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`, `site/src/components/SlideNav.astro`
**Depends on:** Task 12 (light mode setup — but can proceed independently if using CSS vars already defined)

- [ ] In `SlideDrawer.astro`: replace `bg-slate-800/80` with `bg-[var(--color-bg-secondary)]/80`, `border-slate-700` with `border-[var(--color-bg-tertiary)]`, `text-slate-400` with `text-[var(--color-text-muted)]`, etc.
- [ ] In `OverviewGrid.astro`: replace `bg-slate-900/95` with `bg-[var(--color-bg-primary)]/95`, and similar token replacements
- [ ] In `SlideNav.astro:53`: replace `bg-blue-500` with `bg-[var(--color-accent)]`
- [ ] Verify: build succeeds, visual appearance unchanged in dark mode
- [ ] Commit: "refactor: replace hardcoded Tailwind classes with design tokens"

---

## Wave 7: Low Priority

### Task 34: Mermaid lazy loading + keyboard consolidation (#36)
**Files:** `site/src/layouts/SlideLayout.astro`, `site/src/components/SlideControls.astro`, `site/src/components/SlideDrawer.astro`, `site/src/components/OverviewGrid.astro`
**Depends on:** none

- [ ] In `SlideLayout.astro` mermaid init script, wrap rendering in IntersectionObserver — only render mermaid blocks when they enter viewport
- [ ] Declare proper window interface extension in a `src/env.d.ts` or at top of SlideControls: `declare global { interface Window { slideOverview: {...}; slideDrawer: {...}; } }` to remove `(window as any)` casts
- [ ] Extract shared `groupSlidesByPart()` utility from SlideDrawer and OverviewGrid into a shared function (both have identical reduce logic)
- [ ] Commit: "refactor: lazy-load mermaid, type window globals, extract shared utility"

---

### Task 35: Add SEO basics (#37)
**Files:** `site/src/layouts/BaseLayout.astro`, new `site/public/robots.txt`
**Depends on:** none

- [ ] Add OG meta tags to `BaseLayout.astro` head: `og:title`, `og:description`, `og:type` (website)
- [ ] Add canonical link: `<link rel="canonical" href={Astro.url.href} />`
- [ ] Create `site/public/robots.txt`: `User-agent: *\nAllow: /`
- [ ] Consider adding `@astrojs/sitemap` integration — add to `astro.config.mjs` if straightforward
- [ ] Commit: "feat: add SEO basics — OG tags, canonical, robots.txt"

---

### Task 36: Skill testing and argument docs (#38)
**Files:** New `scripts/test-skills.sh`, `.claude/commands/README.md`
**Depends on:** none

- [ ] Create `scripts/test-skills.sh` that validates each skill file exists and has required frontmatter (name, description)
- [ ] Update `.claude/commands/README.md` with GHCP argument behavior notes and decision guidance for tier/depth options
- [ ] Add verification step to `/pct-cheatsheet` skill: "Verify output is scannable and fits one page"
- [ ] Commit: "feat: add skill testing script and argument documentation"

---

### Task 37: Add root Makefile (#39)
**Files:** New `Makefile` at project root
**Depends on:** none

- [ ] Create `Makefile` with targets: `install` (cd site && npm install), `dev` (cd site && npm run dev), `build` (cd site && npm run build), `preview` (cd site && npm run preview), `check` (cd site && npm run check), `format` (cd site && npm run format), `clean` (rm -rf site/dist site/.astro)
- [ ] Add `.PHONY` declarations for all targets
- [ ] Commit: "feat: add root Makefile for dev workflow convenience"

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
