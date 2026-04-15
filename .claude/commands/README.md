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
