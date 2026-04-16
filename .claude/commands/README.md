# PCT Workshop Skills (GHCP Commands)

Standalone skills for the AI workshop hands-on exercises. These work with GitHub Copilot CLI (ghcp) and Claude Code.

**Location**: `.claude/commands/` (GHCP convention)

## Available Skills

### `/pct-deck` - PowerPoint Generator
Generate Nationwide-branded slide decks from a topic or outline.

```bash
/pct-deck "Q2 Performance Review"
/pct-deck "API Migration Plan" --tier=technical
/pct-deck "Budget Request" --slides=4
```

Uses template: `templates/pct/nationwide_default.pptx`

### `/pct-memo` - Memo Generator
Generate formatted business memos and one-pagers.

```bash
/pct-memo "Request for new monitoring tools"
/pct-memo "Project status update" --tone=casual
/pct-memo "Executive summary of Q1 results" --length=brief
```

Uses template: `templates/pct/2024_Memo.dotx`

### `/pct-research` - Research Brief Generator
Generate research briefs to inform decisions.

```bash
/pct-research "Claims AI vendors"
/pct-research "Cloud migration options" --focus=comparison
/pct-research "GenAI landscape" --depth=deep
```

### `/pct-cheatsheet` - Cheatsheet Generator
Generate one-page quick reference cards.

```bash
/pct-cheatsheet "Git Commands"
/pct-cheatsheet "New Tool" --sections=commands,workflows
```

Output: Markdown cheatsheet in proven PCT format

## How Skills Work

Skills are markdown files that provide Claude with:
1. **Context**: What the skill does
2. **Arguments**: How to parse user input
3. **Process**: Step-by-step instructions
4. **Output format**: What to generate
5. **Follow-ups**: What to offer next

When you run `/pct-deck "Topic"`, Claude:
1. Reads the skill file
2. Replaces `$ARGUMENTS` with your input
3. Follows the instructions
4. Generates the output

## GHCP Argument Handling

GHCP (and Claude Code) expose inline arguments to a skill file through
shell-style placeholders. Use them inside the skill body wherever you want
the user's input to land:

| Placeholder    | Captures                                                 |
|----------------|----------------------------------------------------------|
| `$ARGUMENTS`   | The entire argument string after the slash command       |
| `$1`, `$2`, ...| Positional tokens (split on whitespace)                  |

Rules of thumb:

- Prefer `$ARGUMENTS` when the skill should interpret a natural-language
  request (the common case for `/pct-*` skills). The skill's "Parse the
  request" step then pulls out topic, tone, length, etc.
- Use `$1` / `$2` only when the skill truly wants positional args (for
  example, a strict `command <src> <dst>` shape). Quoting matters: `"two
  words"` is one positional token.
- Pass tier/depth options as trailing flags on the argument string so they
  survive the `$ARGUMENTS` capture and the skill can parse them out:

  ```bash
  /pct-deck "Q2 Review" --tier=executive
  /pct-research "Claims AI vendors" --depth=deep --focus=comparison
  /pct-memo "Budget request" --tone=direct --length=brief
  ```

  The skill file reads `$ARGUMENTS` as a single string (`Q2 Review
  --tier=executive`) and extracts flags during Step 1. Do not rely on `$1`
  for flags — GHCP will split them in ways that break quoted topics.

## Choosing a Tier / Depth

Several skills expose a knob for how much effort to spend. Pick it on
purpose rather than defaulting to the middle.

| Skill             | Flag                | Quick pick                                  |
|-------------------|---------------------|---------------------------------------------|
| `/pct-deck`       | `--tier=executive`  | Leadership audience, decision-oriented deck |
| `/pct-deck`       | `--tier=technical`  | Architects / implementers, needs detail     |
| `/pct-research`   | `--depth=quick`     | 5-min skim, confirm a direction             |
| `/pct-research`   | `--depth=standard`  | Default; supports a real decision           |
| `/pct-research`   | `--depth=deep`      | High-stakes choice, external stakeholders   |
| `/pct-memo`       | `--length=brief`    | Ask + bottom line only, 3-4 sentences       |
| `/pct-memo`       | `--length=standard` | Half-page, standard approvals               |
| `/pct-memo`       | `--length=detailed` | Full page with context + supporting data    |
| `/pct-memo`       | `--tone=direct`     | Action-focused, bullet-heavy                |
| `/pct-cheatsheet` | `--format=markdown` | Default; good for copy/paste + version ctrl |
| `/pct-cheatsheet` | `--format=html`     | Shareable standalone page                   |

Heuristic: choose the lightest option that still answers "so what?" for
the audience. Upgrade only when the first pass falls short — it is cheaper
to deepen a brief than to trim a bloated one.

## Testing Skills

Run `scripts/test-skills.sh` to verify every `pct-*.md` file has the
metadata (name + description) that GHCP needs to surface the command.
The script exits non-zero if anything is missing:

```bash
bash scripts/test-skills.sh
```

## Creating Your Own Skills

Copy one of these as a template and modify:

```markdown
# /my-skill -- Short Description

Brief explanation of what it does.

## Usage
/my-skill "input"
/my-skill "input" --option=value

## Instructions

### Step 1: Parse the request
The user said: $ARGUMENTS
[How to interpret the input]

### Step 2: Do the work
[The main logic]

### Step 3: Present output
[How to show results]

### Step 4: Offer follow-ups
[What to suggest next]
```

## Workshop Exercises

These skills map to the hands-on exercises:

| Exercise | Skill | Template |
|----------|-------|----------|
| Build a PowerPoint | `/pct-deck` | nationwide_default.pptx |
| Research Brief | `/pct-research` | (text output) |
| Memo Draft | `/pct-memo` | 2024_Memo.dotx |

## Document Generation

Skills can generate actual PPTX and DOCX files using Python scripts:

```bash
# Install dependencies (one time)
pip install -r requirements.txt

# Generate PowerPoint
python scripts/generate-pptx.py content.json output.pptx

# Generate Word document
python scripts/generate-docx.py content.json output.docx

# Pipe JSON directly
echo '{"title": "...", "slides": [...]}' | python scripts/generate-pptx.py - output.pptx
```

The installer (`./install-harness.sh`) handles Python dependency setup.

## Tips

- Skills are additive - start simple, add complexity as needed
- Use `$ARGUMENTS` to capture user input
- Always preview before generating final output
- Offer refinement options after first draft
- Check `cheatsheets/pct-skills-quick-reference.md` for quick reference
