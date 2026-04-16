# AI Learning PCT - Master Roadmap

This document tracks all work needed to build out the full curriculum and supporting materials.

---

## Current State

**Phase**: Phase 2: Audit Remediation (in progress, as of 2026-04-15)  
**Done**: Phase 1A (Infrastructure), Phase 1B (Content migration), Phase 1C (Polish)  
**Now**: Remediating audit findings — Waves 1-4 complete (36 tasks, 10 blocking + 8 high-priority issues closed); Waves 5-7 in progress  
**Next**: Finish remediation waves, then return to workshop readiness (see `harness/plan.md`)

---

## Phase 1: Pre-Workshop Essentials (Complete)

Sub-phases 1A (infrastructure), 1B (content migration), 1C (polish) all shipped. Template and cheatsheet workstreams rolled in alongside the site build.

- [x] Phase 1A: Astro site infrastructure, layouts, navigation, GitHub Pages deployment
- [x] Phase 1B: Curriculum content migration + Nationwide templates (`nationwide_default.pptx`, `2024_Memo.dotx`) + `research-brief.md`
- [x] Phase 1C: Polish, cheatsheets, facilitation materials, dry run

---

## Phase 2: Audit Remediation (In Progress — 2026-04-15)

Post-polish audit surfaced a batch of correctness, consistency, and cleanup items. Being worked wave-by-wave.

### 2.1 Status
- [x] Waves 1-4: 36 tasks shipped, 10 blocking + 8 high-priority issues closed (prior session)
- [ ] Waves 5-7: in progress this session (cleanup, lower-priority findings, docs hygiene)
- [ ] Final sign-off once all waves close

### 2.2 Next after remediation
- Return to workshop readiness and schedule the first live run
- Revisit Phase 3 (Workshop Polish) below

---

## Phase 3: Workshop Polish

After first live run, before wider rollout.

### 3.1 Curriculum Refinement
- [ ] Review timing from first workshop (what ran long/short?)
- [ ] Update based on participant confusion points
- [ ] Add more/fewer examples as needed
- [ ] Strengthen transitions between sections

### 3.2 Backup Materials
- [ ] Pre-recorded demos for install failures
- [ ] Offline-capable materials (no network needed)
- [ ] Screenshots for every critical step

### 3.3 Scaling Prep
- [ ] Train facilitators guide (if others will run it)
- [ ] Self-paced version of curriculum
- [ ] FAQ document from real questions

---

## Phase 4: Advanced Workshops

Follow-on sessions for people who completed the intro.

### 4.1 Workshop: Building Your First Skill
**Duration**: 60 minutes
- Anatomy of a skill
- Identifying candidates (repeated workflows)
- Writing the skill
- Testing and iterating
- Adding to personal harness

### 4.2 Workshop: Project-Specific Harnesses
**Duration**: 60 minutes
- When to create project instructions
- What goes in project vs global
- Session continuity patterns
- Multi-week project workflows

### 4.3 Workshop: RAG & Knowledge Systems
**Duration**: 90 minutes
- Setting up local RAG
- Connecting to Obsidian or notes
- Building searchable knowledge
- Maintaining and pruning

### 4.4 Workshop: Advanced CLI Patterns
**Duration**: 60 minutes
- Multi-file context management
- Planning and execution modes
- Agent spawning (if available)
- Debugging AI behavior

**Estimated sessions**: 15-20 (to build all four)

---

## Phase 5: Ecosystem Building

Long-term vision: integrated AI workflow for PCT.

### 5.1 Shared Templates Library
- [ ] Insurance-specific templates
- [ ] Nationwide brand compliance built-in
- [ ] PR/Code review templates
- [ ] Meeting prep templates
- [ ] Documentation templates

### 5.2 Skills Library
- [ ] /claims-research - Insurance claims investigation
- [ ] /policy-check - Policy compliance verification
- [ ] /meeting-prep - Prep for specific meeting types
- [ ] /weekly-summary - Status report generation
- [ ] /onboarding - New project/team onboarding

### 5.3 Integration Points
- [ ] SharePoint/Teams integration possibilities
- [ ] Nationwide template repositories
- [ ] Internal documentation systems
- [ ] Code repository conventions

### 5.4 Documentation
- [ ] Complete reference guide
- [ ] Video walkthroughs
- [ ] Example gallery (before/after)
- [ ] Case studies from PCT members

**Estimated sessions**: 20-30

---

## Phase 6: Self-Sustaining Community

Make it run without you.

### 6.1 Community Building
- [ ] Slack channel active and moderated
- [ ] Regular share-outs (monthly?)
- [ ] Pair programming / office hours rotation
- [ ] Recognition for contributions

### 6.2 Knowledge Transfer
- [ ] Multiple trained facilitators
- [ ] Self-serve learning path
- [ ] Contribution guidelines for templates/skills
- [ ] Versioning and maintenance practices

### 6.3 Metrics & Improvement
- [ ] Track adoption (who's using it?)
- [ ] Collect wins (time saved, quality improved)
- [ ] Identify barriers (why aren't some people using it?)
- [ ] Iterate based on real usage

**Estimated sessions**: 10-15

---

## Quick Wins (Anytime)

Low-effort, high-value items to do between major phases.

- [ ] Add a new template when you create something good
- [ ] Document a "gotcha" when you hit one
- [ ] Share a win in Slack when something works well
- [ ] Offer to pair with someone who's stuck
- [ ] Collect questions for FAQ

---

## Session Tracking

| Session | Date | Focus | Outcome |
|---------|------|-------|---------|
| 1 | 2025-04-15 | Initial curriculum scaffold + harness setup | Complete |
| 2-3 | 2025-Q2 | Phase 1A: Astro infrastructure + layouts + navigation | Complete |
| 4-5 | 2025-Q3 | Phase 1B: Content migration + templates from keck_companion | Complete |
| 6 | 2025-Q4 | Phase 1C: Polish + dry run | Complete |
| 7 | 2026-04 | Phase 2: Audit Remediation Waves 1-4 (36 tasks, 18 issues closed) | Complete |
| 8 | 2026-04-15 | Phase 2: Audit Remediation Waves 5-7 | In progress |
| 9 | TBD | First live workshop | Upcoming |
| ... | ... | ... | ... |

---

## Rough Timeline

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1A (Infrastructure) | Complete | 2025-Q2 |
| Phase 1B (Content + templates) | Complete | 2025-Q3 |
| Phase 1C (Polish + dry run) | Complete | 2025-Q4 |
| Phase 2 (Audit Remediation) | In progress | Target: 2026-Q2 |
| Phase 3 (Workshop Polish) | Upcoming | After first live workshop |
| Phase 4 (Advanced workshops) | Upcoming | TBD |
| Phase 5 (Ecosystem) | Upcoming | TBD |
| Phase 6 (Self-sustaining) | Upcoming | Ongoing |

**First live workshop**: TBD — pending completion of Phase 2 remediation.

---

## Notes & Decisions

*Add notes here as we make decisions or learn things*

### 2025-04-15
- Initial scaffold complete
- Curriculum follows: Concepts → CLI → Hands-on → Inspiration arc
- copilot-dotfiles bundled into this repo (point-in-time snapshot)
- Two-tier approach: passive benefits (instructions) + active workflow (/ws→/wp→/we→/wd)
- Spec written for Astro presentation site
- 22 issues created covering Phases 1-4
- Plan written for Phase 1A (infrastructure)

### 2026-04-15
- Phases 1A, 1B, 1C all shipped (Astro site, content migration, polish)
- Phase 2 (Audit Remediation) in progress — auditor flagged a mix of blocking, high-priority, and cleanup items
- Waves 1-4 done in the prior session: 36 tasks completed, 10 blocking + 8 high-priority issues closed
- Waves 5-7 are the focus of this session
- Workshop date is TBD; prioritizing correctness over calendar

---

## Open Questions

- [ ] What network restrictions exist on Nationwide machines?
- [ ] Can we get pre-authorized installs for participants?
- [ ] Is there existing Nationwide PowerPoint template we should use?
- [ ] Who else might want to facilitate after we prove the concept?
