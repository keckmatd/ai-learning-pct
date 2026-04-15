---
name: wiki-lint
description: Health check for the wiki — find orphans, stale pages, and missing cross-references.
allowed-tools:
  - bash
  - view
  - grep
  - glob
---
# Wiki Lint

Health check for the wiki — find orphans, stale pages, and missing cross-references.

## Usage

```
/wiki-lint
```

## Instructions

When the user runs `/wiki-lint`:

### Step 1: Resolve Wiki Path

1. Check `harness/config.yaml` for `wiki_path:` override
2. Check `~/.copilot/wiki.yaml` for `vault_path:`
3. Fallback: `~/brain/`

Use the first source where the key exists. Store the path as `WIKI_PATH`.

### Step 2: Inventory

1. List all wiki pages: `glob WIKI_PATH/**/*.md` excluding `index.md` and `log.md`
2. For each page:
   - Read frontmatter (extract `title:`, `type:`, `tags:`, `updated:`)
   - Store metadata in memory
3. Count total pages by type

Report:
```
Inventoried N pages across X types
```

### Step 3: Check for Orphans

1. Build set of all page titles from inventory
2. For each page (except index.md and source-summary pages):
   - Search all OTHER pages for `[[Page Title]]` wikilink references using grep
   - Count inbound links
3. Pages with zero inbound links = orphans
4. Exception: Pages with `type: source-summary` linked only from index.md are expected — don't flag

Report orphans:
```
Orphaned pages (not linked from anywhere): N
- [[Page A]]
- [[Page B]]
```

### Step 4: Check for Stale Pages

1. For each page with `updated:` frontmatter:
   - Parse date (format: YYYY-MM-DD)
   - Calculate days since update relative to today
   - 90+ days = "stale"
   - 180+ days = "very stale"
2. Group by staleness

Report stale pages:
```
Stale pages (90+ days): N
- [[Page C]] (last updated 2025-10-15, 176 days ago)
- [[Page D]] (last updated 2025-11-20, 140 days ago)

Very stale (180+ days): M
- [[Page E]] (last updated 2025-06-01, 312 days ago)
```

### Step 5: Check Cross-References

1. For each `[[Wikilink]]` found in pages:
   - Extract target page title from brackets
   - Check if corresponding .md file exists in WIKI_PATH
   - If missing = broken link
2. Collect all broken links with source pages
3. Find pages sharing 3+ tags that don't already link to each other — suggest cross-references

Report:
```
Broken links: N
- [[Page A]] → [[Non-Existent Page]] (in wiki/some-page.md)
- [[Page B]] → [[Bad Link]] (in wiki/another-page.md)

Missing cross-references (3+ shared tags): M
- [[Page F]] ↔ [[Page G]] (shared tags: design, pattern, guidance)
- [[Page H]] ↔ [[Page I]] (shared tags: process, automation)
```

### Step 6: Check Index Completeness

1. Read `wiki/index.md`
2. Extract all wikilinks from index
3. Compare filesystem pages vs index wikilinks
4. Pages missing from index = flag
5. Index entries pointing to deleted pages = flag

Report:
```
Missing from index: N
- [[Page J]]
- [[Page K]]

Index entries with deleted targets: M
- [[Dead Link]] (file doesn't exist)
```

### Step 7: Report Summary

Present findings in a summary table:

```
## Wiki Health Check

**Summary:** N total pages (X domains, Y projects, Z patterns, ... by type)

| Check | Status | Details |
|-------|--------|---------|
| Orphaned pages | ⚠ N found | [[Page A]], [[Page B]] |
| Stale pages (90d+) | ⚠ N found | [[Page C]] (176d), [[Page D]] (140d) |
| Very stale (180d+) | 🔴 M found | [[Page E]] (312d) |
| Broken links | ✓ none | — |
| Missing from index | ⚠ N found | [[Page J]], [[Page K]] |
| Index orphans | ✓ none | — |
| Missing cross-refs | 💡 N suggestions | [[Page F]] ↔ [[Page G]] |

### Analysis
[1-2 sentence summary of wiki health]

### Recommended Actions
1. Review orphaned pages: delete unused or add cross-references
2. Update very stale pages: refresh accuracy and dates
3. Add missing pages to index with brief summaries
4. Fix broken wikilinks: correct or delete references
5. Consider suggested cross-references to improve discoverability
```

### Step 8: Offer Fixes

Ask user:
```
Want me to fix any of these? (orphans/stale/index/broken/all)
```

If user declines, skip to Step 9.

### Step 9: Apply Fixes (if requested)

**For orphans:**
```
[[Page A]] has no inbound links.
Options:
1. Delete the page
2. Add a cross-reference from another page
3. Link from index.md
4. Keep (it may be for future reference)

What should I do?
```

Process user response:
- Delete: remove the file
- Add reference: ask which page, then add suggested wikilink to Cross-References section
- Index: add to index.md with brief description
- Keep: skip

**For stale pages:**
- Read the page
- Ask: "Still accurate? Update the date or revise content?"
- If yes: update `updated:` date to today in frontmatter
- If no: read content, ask what needs updating, update content + date

**For broken links:**
- For each broken link, ask: "Delete the reference or keep as a TODO?"
- If delete: remove the wikilink from source page
- If keep: add to a "TODO: Resolve" section or similar

**For missing index entries:**
- Read each missing page
- Generate brief 1-line summary based on `title:` and page content
- Ask: "Add to index under which section? (or provide custom section)"
- Add formatted entry to index.md

### Step 10: Update Log

Append to `wiki/log.md`:

```
- [lint] Health check: N orphans, M stale (K very stale), B broken links, T total pages
```

If fixes were applied:
```
- [lint-fix] Deleted N orphans, updated M stale pages, fixed B links, added L index entries
```

## When to Use

- Weekly or bi-weekly wiki maintenance
- Before major restructuring or archiving
- After bulk wiki changes (ingest, import, refactor)
- When onboarding new team members (verify discoverability)

## When NOT to Use

- During active drafting (run after content stabilizes)
- If wiki is very new (insufficient data for meaningful lint)

## Implementation Notes

- Use `grep -r` for wikilink search (case-insensitive when possible)
- Parse frontmatter with simple regex: `/^([a-z_]+):\s*(.+)$/m`
- Date comparison: `(today - updated_date) / 86400` = days
- Wikilink pattern: `\[\[([^\]]+)\]\]`
- For tag comparison: split `tags:` by comma, count matches
- All timestamps in output use relative format: "N days ago"

