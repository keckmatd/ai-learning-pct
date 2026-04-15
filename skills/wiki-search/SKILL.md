---
name: wiki-search
description: Query the wiki from any project session.
allowed-tools:
  - bash
  - view
  - grep
  - glob
---
# Wiki Search

Query the wiki from any project session.

## Usage

```
/wiki-search <query>
/wiki-search              # (no args — ask what to search for)
```

## Instructions

When the user runs `/wiki-search [query]`:

### Step 1: Resolve Wiki Path

Determine the wiki location in this order:

1. Check `harness/config.yaml` for `wiki_path:` key
   ```bash
   grep -E "^\s*wiki_path:" harness/config.yaml
   ```

2. Check `~/.copilot/wiki.yaml` for `vault_path:` key
   ```bash
   grep -E "^\s*vault_path:" ~/.copilot/wiki.yaml
   ```

3. Fallback to `~/brain/`

Store the resolved path in a variable: `$WIKI_PATH`

### Step 2: Get Query

**If argument provided:**
Use the argument as the search query directly.

**If no argument:**
Ask the user:
```
What would you like to search for in the wiki?
```

Wait for their response and use it as the query.

### Step 3: Search Wiki

Extract key search terms from the query (break on spaces, filter stop words, keep 3-5 terms).

For each term, use the Grep tool to search the wiki directory:

**Search content:**
```
Grep pattern: <term>
Path: <WIKI_PATH>/
Output mode: files_with_matches (to get a first pass)
```

**Search metadata:**
```
Grep pattern: <term>
Path: <WIKI_PATH>/
Patterns to search: Match in frontmatter tags, title fields, and page names
Output mode: files_with_matches
```

Compile a list of matching files. De-duplicate.

**Index context:**
Read `<WIKI_PATH>/index.md` if it exists to understand the wiki structure and get additional context clues.

### Step 4: Rank Results

For each matched file:
1. Count total match occurrences (match count in filename, title, tags, body)
2. Check for a `updated:` or `date:` frontmatter field (recency)
3. Rank by: match count (primary), then recency (secondary)

Select the top 3-5 matching pages.

### Step 5: Read and Synthesize

For each top-ranked page:
1. Read the file content
2. Extract the key information that answers the query
3. Note citations (wikilinks: `[[Page Name]]`)

Synthesize the answer across all pages:
- Answer the user's query directly using wiki information
- Cite sources with wikilinks: `[[Page Name]]`
- Cross-reference related pages if needed
- Note what's known and what gaps remain in the wiki

### Step 6: Identify Gaps

After answering:

If the query reveals missing or insufficient wiki content:
```
The wiki doesn't have comprehensive coverage of [topic].
Would you like me to create a page on [topic]?
```

**If user says yes:**
1. Read `<WIKI_PATH>/schema.md` (if exists) for conventions
2. Create a new page following the schema:
   - Frontmatter with `title:`, `tags:`, `created:`, `updated:`
   - Sections using `##` headers
   - Related links in a "See Also" section
3. Add entry to `<WIKI_PATH>/index.md` under appropriate category
4. Optionally append to `<WIKI_PATH>/log.md`:
   ```
   - [wiki-search] Created "[Page Title]" in response to query: "[query]"
   ```

**If user says no:**
Just acknowledge: "Got it. Let me know if you want to add it later."

### Step 7: Log Search (Optional)

Only if search returned meaningful results, append to `<WIKI_PATH>/log.md`:
```markdown
- [wiki-search] "[query text]" → cited [N] pages
```

Keep log entries brief and scannable.

## Examples

### Simple Search

```
User: /wiki-search TypeScript type safety

Claude:
Searching wiki for: TypeScript, type, safety

Found 3 matching pages:
- TypeScript Best Practices (5 matches, updated 2 weeks ago)
- Type Safety Patterns (4 matches, updated 1 month ago)
- Angular Type System (2 matches, updated 3 months ago)

[Answer synthesized from pages]

Citing: [[TypeScript Best Practices]], [[Type Safety Patterns]]
```

### Query with No Arguments

```
User: /wiki-search

Claude:
What would you like to search for in the wiki?
```

User responds → proceeds with search.

### Query Revealing Gap

```
User: /wiki-search Go error handling

Claude:
Searching wiki for: Go, error, handling

Found 1 matching page:
- Go Best Practices (2 matches)

[Answer from page]

The wiki doesn't have a dedicated page on Go error handling patterns.
Would you like me to create one?
```

If yes → creates page following schema.

## Design Principles

- **Contextual**: Find the right information from the wiki, not from training knowledge
- **Cited**: Always show where information comes from (wikilinks)
- **Honest**: Flag gaps; offer to fill them
- **Efficient**: Top 3-5 pages is usually enough; synthesize across them
- **Logged**: Keep a search log for future analysis

## Log Format

The log at `<WIKI_PATH>/log.md` tracks useful searches:

```markdown
# Wiki Search Log

- [wiki-search] "[query]" → cited [N] pages
- [wiki-search] "[query]" → no results found
- [wiki-search] Created "[Page Title]" in response to query: "[query]"
```

Log is optional but helpful for seeing what knowledge gets requested vs. what exists.
