---
name: wiki-update
description: Update wiki pages from current session context or manually.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - grep
  - glob
---
# Wiki Update

Update wiki pages from current session context or manually.

## Usage

```
/wiki-update                    # Suggest updates based on current session
/wiki-update <page-name>       # Update a specific page
```

## Instructions

When the user runs `/wiki-update` (with or without arguments), follow the process below.

## Step 1: Resolve Wiki Path

Determine where the wiki vault lives:

1. Check `harness/config.yaml` for a `wiki_path:` override
2. Check `~/.copilot/wiki.yaml` for a `vault_path:` setting
3. Fallback to `~/brain/` if neither exists

Once you have the path, read `schema.md` from the vault root to understand the page structure and metadata conventions.

If the vault doesn't exist yet, inform the user: "Wiki vault not found at [path]. Create it first with `/wiki-ingest` or similar."

## Step 2: Identify What to Update

### If page name provided:

1. Search wiki/ directory for the page by filename or frontmatter title
   ```bash
   grep -r "^title:" <wiki_path>/wiki/ | grep -i "<page-name>"
   ```
2. If found, read the page and its existing structure
3. Ask user: "What changed or what should I add to [[Page Name]]?"
4. Update the page preserving its existing structure and sections
5. Go to Step 3: Apply Updates

### If no argument provided (session-aware mode):

1. **Read recent tape entries** using session context MCP:
   - Call `mcp__session-context__tape_search` with broad queries to find:
     - Recent discoveries ("discovery" type entries)
     - Recent decisions ("decision" type entries)
     - Recent milestones ("milestone" type entries)
   - These represent learnings and decisions from this session

2. **Check files modified this session** as a heuristic:
   ```bash
   # Get recent modified files
   git diff --name-only HEAD~5..HEAD 2>/dev/null | head -10
   ```

3. **Resolve current project** from registry:
   - Read `~/.machine-id` to get machine identifier
   - Look up projects for this machine in `registry/machines.yaml`
   - Use the current project context (from harness/config.yaml or git remote)

4. **Search wiki for project-tagged pages**:
   ```bash
   # Find pages tagged with this project
   grep -r "project:" <wiki_path>/wiki/ | grep "<project-name>"
   ```

5. **Propose updates** to the user:

   ```
   Based on this session, I suggest updating:

   - [[Page Name]] — [reason: what to add or what changed]
   - [[Another Page]] — [reason]
   - New page: [topic] — [why it should exist]

   Update these? (y/n/pick specific ones)
   ```

   If user says "y": proceed with all suggestions
   If user says "n": stop
   If user picks specific ones: proceed with selected pages only

## Step 3: Apply Updates

For each approved update:

1. **Read existing page** (if it exists):
   ```bash
   cat <wiki_path>/wiki/<page-file>.md
   ```

2. **Merge new information** into appropriate section:
   - Preserve all existing content
   - Add new info to the most relevant section (Learnings, Decisions, References, etc.)
   - Don't duplicate existing information
   - Update cross-references if relevant (link to related pages)

3. **Update frontmatter**:
   - Update `updated:` date to today's date (YYYY-MM-DD format)
   - Keep existing `created:`, `title:`, `tags:`, `project:` fields
   - Add new tags if the content now covers additional topics

4. **Add cross-references** if relevant:
   - Link to related pages using `[[Page Name]]` syntax
   - Update the "See Also" or "Related" section if it exists

5. **For new pages**, create with this template:
   ```yaml
   ---
   title: Page Title
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   project: [project-name]
   tags: [tag1, tag2, tag3]
   ---

   ## Summary

   Brief overview of the page content.

   ## Learnings

   [What we've learned]

   ## Decisions

   [What we've decided]

   ## References

   - [[Related Page 1]]
   - [[Related Page 2]]
   ```

## Step 4: Update Log

Append to `<wiki_path>/log.md`:

```markdown
- [update] Updated [[Page Name]] with [brief description of what changed]
- [new] Created [[New Page Name]] — [brief description]
```

Include the date in ISO format (YYYY-MM-DD).

## Step 5: Report

Show the user what was updated:

```
Updated:
- [[Page Name]]
  - Added: [what was added]
  - Section: [which section]

Created:
- [[New Page Name]]

Wiki log updated.
```

## Design Principles

- **Preserve structure**: Don't reorganize existing sections, just add to them
- **Session context**: Tape entries provide the signal for what's important
- **Cross-linking**: Strong wiki is interconnected, weak wiki is isolated
- **Audit trail**: Log tracks all updates with rationale
- **Project tagging**: Pages should be tagged with the project that owns them

## Edge Cases

- **Page doesn't exist yet**: Create it using the template
- **Vault doesn't exist**: Inform user and stop
- **No tape entries this session**: Ask user what changed manually
- **Multiple projects tagged**: Ask which project owns the content
- **User declines all updates**: That's fine, just confirm: "No updates applied."
