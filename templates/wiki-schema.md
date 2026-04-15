# Wiki Schema

This document defines the operating manual for the LLM Wiki. Claude reads this schema when interacting with vault content. Think of this as the wiki's CLAUDE.md.

## Roles

- **Claude**: Owns `wiki/` directory. Reads pages, follows cross-references, respects conventions, performs queries and ingestion.
- **Human**: Owns `sources/` directory. Curates external references, controls summaries, maintains immutable log.
- **Obsidian**: Provides UI for reading and navigating. Renders wikilinks, backreferences, and graph view.

## Page Types

| Type | Directory | Purpose | Audience |
|------|-----------|---------|----------|
| Domain | `wiki/domains/` | Conceptual area (e.g., authentication, observability) | Claude + Human |
| Project | `wiki/projects/` | Work tracking and outcomes | Claude + Human |
| Pattern | `wiki/patterns/` | Reusable solutions (always flagged) | Claude + Human |
| Tool | `wiki/tools/` | Software or technique (flagged if multi-machine) | Claude + Human |
| Source Summary | `wiki/sources/` | Curated external reference (immutable) | Claude reads, Human writes |
| Entity | `wiki/domains/` | Named concept within domain (appears in 3+ pages) | Claude + Human |

## Page Format

### Frontmatter

Every page must include YAML frontmatter:

```yaml
---
title: Page Title
type: domain|project|pattern|tool|source-summary|entity
tags: [tag1, tag2, tag3]
projects: [project-key-1, project-key-2]
machine: machine-id
created: 2026-01-15
updated: 2026-04-08
sources: [source-ref-1, source-ref-2]
---
```

**Field definitions:**
- `title`: Human-readable page name
- `type`: One of the six page types
- `tags`: Searchable keywords
- `projects`: References to related project pages
- `machine`: Machine identifier where this knowledge originated (or "shared")
- `created`: ISO date when page was first created
- `updated`: ISO date of last modification
- `sources`: References to external sources or documents (use lowercase with hyphens)

### Body Structure

Pages follow this section structure:

```markdown
## Summary

One-paragraph overview of the topic. Answer: what is this, why does it matter?

## Details

Detailed explanation, broken into subsections as needed. Include:
- Implementation specifics
- Configuration examples
- Common pitfalls
- Performance considerations

## Cross-References

Explicit wikilinks to related pages:
- [[pattern/name]] — Brief explanation of relevance
- [[domain/name]] — Brief explanation of relevance

## Open Questions

Unresolved items that require future work:
- Question or decision that needs clarification
- Known limitation or edge case

(Optional section; omit if no open questions)
```

## Conventions

All wiki authors follow these eight rules:

1. **One topic per page**: Each page covers one concept, pattern, or entity. Avoid multiple unrelated topics in a single page.

2. **Update over create**: When adding knowledge, update an existing page if it's closely related. Create a new page only when the topic doesn't fit anywhere else.

3. **Wikilinks for cross-references**: Use `[[wiki/type/name]]` syntax to link related pages. Do not use raw URLs for internal references.

4. **Entity threshold is 3+**: A named concept becomes an entity page only after it appears in 3+ other pages and warrants its own page.

5. **Frontmatter is required**: Every page must have complete frontmatter. Do not create pages without it.

6. **Index is curated**: The main index (`wiki/index.md`) lists all pages with one-line summaries. It is manually maintained, not auto-generated.

7. **Log is append-only**: The `sources/log.md` records all ingest, query, update, and lint actions. Entries are never deleted, only new entries appended.

8. **Sources are immutable**: Once a source summary is written (`wiki/sources/`), only the Human updates it. Claude reads but does not modify source pages.

## Graduation Rules

Pattern pages always graduate from working notes to a dedicated `wiki/patterns/` page once the pattern stabilizes (3+ applications). Mark with graduation flag when first written.

Tool pages graduate if used across multiple machines. Mark with flag if multi-machine adoption is discovered.

Domain pages rarely graduate; they typically remain as curated collections of entities and patterns.

Project pages never graduate. They are temporary working spaces.

Source summary pages never graduate; they are final curated summaries.

## Index Format

The main index (`wiki/index.md`) organizes all pages by category:

```markdown
# Wiki Index

Last updated: 2026-04-08
Total pages: 42

## Domains

- [[wiki/domains/authentication]] — User identity and access control (7 pages, updated 2026-04-05)
- [[wiki/domains/observability]] — Logging, tracing, metrics (12 pages, updated 2026-04-08)

## Projects

- [[wiki/projects/backend-refactor]] — Decompose monolith into services (in progress)
- [[wiki/projects/frontend-migration]] — Angular to React migration (completed 2026-03-15)

## Patterns

- [[wiki/patterns/circuit-breaker]] — Graceful degradation under load (3 applications)
- [[wiki/patterns/event-sourcing]] — Immutable event log architecture (2 applications)

## Tools

- [[wiki/tools/postgres]] — Relational database (shared)
- [[wiki/tools/prometheus]] — Metrics collection (shared)
- [[wiki/tools/kubectl]] — Kubernetes CLI (machine-dev-1)

## Sources

- [[wiki/sources/go-docs]] — Official Go language documentation
- [[wiki/sources/k8s-best-practices]] — Kubernetes security best practices guide
```

**Rules:**
- Organized by category
- One-line summary for each page
- Last updated date for each page
- Total page count at top
- Manually maintained (not auto-generated)

## Log Format

The `sources/log.md` records all vault interactions in chronological order (most recent first):

```markdown
# Vault Log

## 2026-04-08

- [ingest] Added pattern/retry-backoff from "Implementing Reliable APIs" doc
- [query] Claude queried domains/observability for context on distributed tracing
- [update] Human updated tool/prometheus metrics reference
- [lint] Automated check: 2 pages missing `updated` date

## 2026-04-07

- [ingest] Source summary/aws-security-best-practices created
- [update] Domain/authentication expanded with OIDC section
```

**Entry types:**
- `[ingest]` — New knowledge added to the wiki
- `[query]` — Claude performed a read/search operation
- `[update]` — Human modified an existing page
- `[lint]` — Automated checks or maintenance
