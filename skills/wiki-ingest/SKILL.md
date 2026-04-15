---
name: wiki-ingest
description: Process a source into wiki pages. The primary way to add knowledge to the wiki.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
  - web_fetch
---
# Wiki Ingest

Process a source into wiki pages. The primary way to add knowledge to the wiki.

## Usage

```
/wiki-ingest <path-or-url>
/wiki-ingest                  # (no args — ask what to ingest)
```

## Instructions

When the user runs `/wiki-ingest`, follow these steps:

### Step 1: Resolve Wiki Path

1. Check `harness/config.yaml` for `wiki_path:` override
2. Check `~/.copilot/wiki.yaml` for `vault_path:`
3. Fallback: `~/brain/`

Read `schema.md` from the vault root to load wiki conventions (frontmatter format, page types, naming).

### Step 2: Resolve Source

**If URL is provided:**
- Fetch the URL using WebFetch
- Extract a meaningful title from the page or ask the user
- Slugify the title (lowercase, replace spaces with hyphens)
- Determine source type: article, transcript, doc, etc.
- Save to appropriate `sources/` subdirectory: `sources/articles/<slug>.md`, `sources/transcripts/<slug>.md`, etc.
- Include frontmatter with original URL, fetch date, and title

**If file path is provided:**
- Verify the file exists
- If path is outside the vault, copy it to the appropriate `sources/` subdirectory based on file type
- If path is already in the vault, use it directly

**If no argument provided:**
- Ask the user: "What would you like to ingest? (URL, file path, or paste text)"
- If URL: proceed with Step 2 URL flow
- If file path: proceed with Step 2 file flow
- If text is pasted: create new file at `sources/misc/<YYYY-MM-DD>-<slug>.md` with the pasted content and frontmatter

### Step 3: Analyze Source

Read the source file and identify:
- Key entities (people, organizations, projects, concepts)
- Core concepts and takeaways (3-5 bullet points)
- Connections to existing wiki pages (grep `wiki/` for related terms, check `wiki/index.md`)
- What page types to produce (domain, project, pattern, tool, source-summary, entity per schema.md)

### Step 4: Create or Update Wiki Pages

For each identified topic:

1. **Search for existing page:**
   - `grep -r "term" wiki/` to find related pages
   - Check `wiki/index.md` for category structure
   - Look for pages with similar frontmatter tags

2. **If page exists:**
   - Merge new information without duplicating
   - Update `updated:` date in frontmatter
   - Add cross-references to source in body
   - Preserve existing structure and metadata

3. **If page doesn't exist:**
   - Create new file in appropriate `wiki/` subdirectory
   - Add full frontmatter per schema.md:
     - `title:`
     - `type:` (from schema.md page types)
     - `created:` (ISO date)
     - `updated:` (ISO date)
     - `machine:` (resolved from `~/.machine-id`)
     - `projects:` (resolved from registry if applicable)
     - `tags:` (topic tags)
     - `status:` (draft, published)
   - Write body content with clear sections
   - Add "See also" cross-references to related pages

4. **Machine and Projects resolution:**
   - Read `~/.machine-id` for current machine identifier
   - If content relates to a project in the registry, add to `projects:` field
   - Check `registry/machines.yaml` for project mappings if needed

### Step 5: Write Source Summary

Create a source-summary page at `wiki/sources/<source-slug>.md` with:

**Frontmatter:**
```yaml
title: "[Source Title]"
type: source-summary
created: [ISO date]
updated: [ISO date]
machine: [from ~/.machine-id]
projects: []
tags: []
status: published
source_url: [original URL if applicable]
source_type: [article|transcript|doc|misc]
```

**Sections:**
- **Key Takeaways** (3-5 bullet points, short)
- **Detailed Notes** (paragraphs with important details)
- **Cross-References** (list of wiki pages created/updated by this ingest, with links)

### Step 6: Update Index and Log

**Update wiki/index.md:**
- Add new pages to appropriate category section
- Write one-line summaries for new pages
- Update metadata:
  - Page count (count .md files in wiki/)
  - Last updated date
- Keep categories organized alphabetically

**Append to wiki/log.md:**
```
- [ingest] Processed <source-name> → created N new, updated M existing
```

### Step 7: Report

Display results to the user:

```
Wiki ingest complete.

Source: [source name/URL]
Source summary: wiki/sources/<slug>.md

Created:
- wiki/category/page1.md
- wiki/category/page2.md

Updated:
- wiki/category/existing-page.md

Index updated.
```

## When to Use

- User wants to add an article, documentation, or transcript to the wiki
- User provides a URL to process
- User has a file to add to the knowledge base
- Routine knowledge capture and organization

## Schema Dependencies

This command depends on `schema.md` existing in the vault root. If missing, create a minimal version:

```yaml
# Wiki Schema

## Page Types
- domain: Conceptual area (e.g., authentication, observability)
- project: Work tracking and outcomes
- pattern: Reusable solutions (always flagged)
- tool: Software or technique (flagged if multi-machine)
- source-summary: Curated external reference (immutable)
- entity: Named concept within domain (appears in 3+ pages)

## Frontmatter Template
```yaml
title:
type: [domain|project|pattern|tool|source-summary|entity]
created: YYYY-MM-DD
updated: YYYY-MM-DD
machine: [identifier]
projects: []
tags: []
status: [draft|published]
```

## Idempotency

- Running on the same source twice updates the source-summary and affected pages
- Existing page content is merged, not overwritten
- File copies are idempotent (checking before overwrite)

## Error Handling

- If vault path doesn't exist: create it and continue
- If schema.md missing: use defaults from Schema Dependencies above
- If URL fetch fails: report error and ask for alternative
- If file doesn't exist: report error, ask for correction
