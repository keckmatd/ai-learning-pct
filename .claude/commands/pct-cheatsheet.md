# /pct-cheatsheet -- Cheatsheet Generator

Generate a one-page quick reference cheatsheet in the proven PCT format.

## Usage

```
/pct-cheatsheet "Topic"
/pct-cheatsheet "Topic" --sections=commands,workflows,tips
/pct-cheatsheet "Topic" --format=markdown|html|text
```

## Instructions

You are generating a one-page quick reference cheatsheet.

### Step 1: Parse the request

The user said: $ARGUMENTS

Determine:
- **Topic**: What the cheatsheet covers
- **Sections**: Which sections to include (default: all that apply)
- **Format**: markdown (default), html (styled, shareable), or text (plain)
- **Audience**: Beginners, intermediate, or reference

### Step 2: Gather content

Identify the key information for the topic:
- Essential commands or syntax
- Common workflows or patterns
- Best practices (do/don't)
- Troubleshooting tips
- Quick reference tables

Keep it **scannable** - this is a reference, not a tutorial.

### Step 3: Generate cheatsheet

Use this proven format:

```markdown
# [Topic] - Quick Reference

*[One-line tagline. Keep this handy.]*

---

## [Section 1: Commands/Syntax/Basics]

```[language]
[command]                    # [description]
[command] [args]             # [description]
[command] [args] [options]   # [description]
```

---

## [Section 2: Common Workflows/Patterns]

| Task | How |
|------|-----|
| [Task 1] | `[command or steps]` |
| [Task 2] | `[command or steps]` |
| [Task 3] | `[command or steps]` |

---

## [Section 3: Best Practices]

| Do | Don't |
|----|-------|
| [Good practice] | [Anti-pattern] |
| [Good practice] | [Anti-pattern] |
| [Good practice] | [Anti-pattern] |

---

## [Section 4: Troubleshooting]

| Problem | Try |
|---------|-----|
| [Issue 1] | [Solution] |
| [Issue 2] | [Solution] |
| [Issue 3] | [Solution] |

---

## Quick Tips

1. **[Tip 1 title]** - [Brief explanation]
2. **[Tip 2 title]** - [Brief explanation]
3. **[Tip 3 title]** - [Brief explanation]

---

## Getting Help

- [Resource 1]
- [Resource 2]
- [Resource 3]
```

### Design Principles

- **One page max** when printed (aim for 60-80 lines)
- **Scannable** - tables and code blocks over prose
- **Action-oriented** - focus on "how to do X"
- **Concrete examples** - show actual commands/code
- **No fluff** - every line earns its place

### Step 4: Present and refine

Show the cheatsheet and offer:

```
Cheatsheet: [Topic] (N lines, fits on one page)

[Full cheatsheet content]

---

Options:
- Save as: cheatsheets/[topic]-quick-reference.md
- Print-friendly: Add page break hints
- Add/remove sections

Want me to adjust anything?
```

### Step 5: Save if requested

If the user approves, save to the cheatsheets directory.

**Markdown format:**
```bash
cheatsheets/[topic]-quick-reference.md
```

**HTML format:**
Generate a standalone HTML file with embedded styles:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Topic] - Quick Reference</title>
  <link rel="stylesheet" href="../templates/cheatsheet.css">
</head>
<body>
  [Converted markdown content as HTML]
</body>
</html>
```

Save to: `cheatsheets/[topic]-quick-reference.html`

The stylesheet at `templates/cheatsheet.css` provides:
- Dark mode by default, light mode for printing
- Print-optimized layout (fits on one page)
- Proper code block and table styling
- Two-column option for dense content

**To convert markdown to HTML**, use the content directly or a tool like pandoc:
```bash
pandoc cheatsheets/topic.md -o cheatsheets/topic.html --standalone --css=../templates/cheatsheet.css
```

## Example

User: `/pct-cheatsheet "PCT Skills"`

Output:
```markdown
# PCT Skills - Quick Reference

*Your AI workflow commands. Keep this handy.*

---

## Available Skills

```bash
/pct-deck "Topic"              # Generate PowerPoint deck
/pct-memo "Topic"              # Generate business memo
/pct-research "Topic"          # Generate research brief
/pct-cheatsheet "Topic"        # Generate cheatsheet (this!)
```

---

## Skill Options

| Skill | Options |
|-------|---------|
| `/pct-deck` | `--slides=N`, `--tier=executive\|technical` |
| `/pct-memo` | `--tone=formal\|casual\|direct`, `--length=brief\|standard` |
| `/pct-research` | `--depth=quick\|standard\|deep`, `--focus=comparison\|landscape` |
| `/pct-cheatsheet` | `--sections=...`, `--format=markdown\|text` |

---

## Common Workflows

| Task | Command |
|------|---------|
| Quick status deck | `/pct-deck "Q2 Status" --slides=4` |
| Executive memo | `/pct-memo "Budget request" --tone=direct` |
| Vendor comparison | `/pct-research "Options" --focus=comparison` |
| Reference card | `/pct-cheatsheet "New tool"` |

---

## Best Practices

| Do | Don't |
|----|-------|
| Be specific about topic | "Make me a thing" |
| Review before generating | Accept first draft blindly |
| Iterate with feedback | Start over each time |
| Use appropriate tier/depth | Always use defaults |

---

## Quick Tips

1. **Preview first** - All skills show preview before generating
2. **Iterate** - Ask for changes, don't restart
3. **Templates matter** - Skills use Nationwide templates automatically
4. **Combine skills** - Research → Deck → Memo workflow

---

## Getting Help

- Skill docs: `cat .claude/commands/pct-*.md`
- Templates: `ls templates/pct/`
- Workshop site: [URL]
```
