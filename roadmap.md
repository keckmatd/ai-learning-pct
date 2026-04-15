# AI Learning PCT - Master Roadmap

This document tracks all work needed to build out the full curriculum and supporting materials.

---

## Current State

**Phase**: Foundation complete, Phase 1A ready to execute  
**Next**: Build Astro site infrastructure (see `harness/plan.md`)

---

## Phase 1: Pre-Workshop Essentials

Must complete before the 90-minute workshop.

### 1.1 copilot-dotfiles Ready
- [ ] Ensure copilot-dotfiles repo has clean setup.sh
- [ ] Verify instructions.md works with ghcp CLI
- [ ] Test installation on clean Windows/WSL machine
- [ ] Create troubleshooting guide for common issues
- [ ] Verify Nationwide network compatibility

### 1.2 Templates
- [ ] Create `templates/powerpoint-template.md` with Nationwide guidelines
- [ ] Create `templates/research-brief.md` structure
- [ ] Test both templates with ghcp

### 1.3 Cheatsheets
- [ ] One-page command reference (printable PDF)
- [ ] Quick start guide (first 15 minutes)
- [ ] Troubleshooting quick reference

### 1.4 Facilitation Materials
- [ ] Pre-workshop email (what to prepare)
- [ ] Feedback form
- [ ] Post-workshop follow-up email template

**Estimated sessions**: 3-5

---

## Phase 2: Workshop Polish

After first run, before wider rollout.

### 2.1 Curriculum Refinement
- [ ] Review timing from first workshop (what ran long/short?)
- [ ] Update based on participant confusion points
- [ ] Add more/fewer examples as needed
- [ ] Strengthen transitions between sections

### 2.2 Backup Materials
- [ ] Pre-recorded demos for install failures
- [ ] Offline-capable materials (no network needed)
- [ ] Screenshots for every critical step

### 2.3 Scaling Prep
- [ ] Train facilitators guide (if others will run it)
- [ ] Self-paced version of curriculum
- [ ] FAQ document from real questions

**Estimated sessions**: 2-3

---

## Phase 3: Advanced Workshops

Follow-on sessions for people who completed the intro.

### 3.1 Workshop: Building Your First Skill
**Duration**: 60 minutes
- Anatomy of a skill
- Identifying candidates (repeated workflows)
- Writing the skill
- Testing and iterating
- Adding to personal harness

### 3.2 Workshop: Project-Specific Harnesses
**Duration**: 60 minutes
- When to create project instructions
- What goes in project vs global
- Session continuity patterns
- Multi-week project workflows

### 3.3 Workshop: RAG & Knowledge Systems
**Duration**: 90 minutes
- Setting up local RAG
- Connecting to Obsidian or notes
- Building searchable knowledge
- Maintaining and pruning

### 3.4 Workshop: Advanced CLI Patterns
**Duration**: 60 minutes
- Multi-file context management
- Planning and execution modes
- Agent spawning (if available)
- Debugging AI behavior

**Estimated sessions**: 15-20 (to build all four)

---

## Phase 4: Ecosystem Building

Long-term vision: integrated AI workflow for PCT.

### 4.1 Shared Templates Library
- [ ] Insurance-specific templates
- [ ] Nationwide brand compliance built-in
- [ ] PR/Code review templates
- [ ] Meeting prep templates
- [ ] Documentation templates

### 4.2 Skills Library
- [ ] /claims-research - Insurance claims investigation
- [ ] /policy-check - Policy compliance verification
- [ ] /meeting-prep - Prep for specific meeting types
- [ ] /weekly-summary - Status report generation
- [ ] /onboarding - New project/team onboarding

### 4.3 Integration Points
- [ ] SharePoint/Teams integration possibilities
- [ ] Nationwide template repositories
- [ ] Internal documentation systems
- [ ] Code repository conventions

### 4.4 Documentation
- [ ] Complete reference guide
- [ ] Video walkthroughs
- [ ] Example gallery (before/after)
- [ ] Case studies from PCT members

**Estimated sessions**: 20-30

---

## Phase 5: Self-Sustaining Community

Make it run without you.

### 5.1 Community Building
- [ ] Slack channel active and moderated
- [ ] Regular share-outs (monthly?)
- [ ] Pair programming / office hours rotation
- [ ] Recognition for contributions

### 5.2 Knowledge Transfer
- [ ] Multiple trained facilitators
- [ ] Self-serve learning path
- [ ] Contribution guidelines for templates/skills
- [ ] Versioning and maintenance practices

### 5.3 Metrics & Improvement
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
| 2 | TBD | Phase 1A: Astro infrastructure | |
| 3 | TBD | Phase 1A: Layouts + navigation | |
| 4 | TBD | Phase 1B: Content migration | |
| 5 | TBD | Phase 1B: Templates from keck_companion | |
| 6 | TBD | Phase 1C: Polish + dry run | |
| 7 | TBD | First live workshop | |
| ... | ... | ... | ... |

---

## Rough Timeline

**Assuming ~2 sessions/week:**

| Phase | Duration | Completion |
|-------|----------|------------|
| Phase 1 | 2 weeks | Pre-workshop ready |
| Phase 2 | 1 week | Post-first-workshop polish |
| Phase 3 | 2 months | Advanced workshops available |
| Phase 4 | 3-6 months | Full ecosystem |
| Phase 5 | Ongoing | Self-sustaining |

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
- ~1 month to workshop - comfortable timeline

---

## Open Questions

- [ ] What network restrictions exist on Nationwide machines?
- [ ] Can we get pre-authorized installs for participants?
- [ ] Is there existing Nationwide PowerPoint template we should use?
- [ ] Who else might want to facilitate after we prove the concept?
