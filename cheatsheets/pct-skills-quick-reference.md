<!-- NOTE: cheatsheets/pct-skills-quick-reference.html needs regeneration after this edit -->
# PCT Skills - Quick Reference

*Your AI workflow commands. Keep this handy.*

---

## Available Skills

```bash
/pct-deck "Topic"              # Generate PowerPoint deck
/pct-memo "Topic"              # Generate business memo  
/pct-research "Topic"          # Generate research brief
/pct-cheatsheet "Topic"        # Generate a cheatsheet
```

---

## /pct-deck - PowerPoint Generator

```bash
/pct-deck "Q2 Results"                    # Basic deck (5-6 slides)
/pct-deck "API Migration" --tier=technical  # Technical detail (8-10 slides)
/pct-deck "Budget Ask" --slides=4           # Specific slide count
```

| Option | Values | Default |
|--------|--------|---------|
| `--tier` | `executive`, `technical` | executive |
| `--slides` | Number | 5-6 |

**Output**: Preview → Approve → Generate PPTX

---

## /pct-memo - Memo Generator

```bash
/pct-memo "Request new tools"              # Standard memo
/pct-memo "Status update" --tone=casual    # Casual tone
/pct-memo "Executive summary" --length=brief  # Short version
```

| Option | Values | Default |
|--------|--------|---------|
| `--tone` | `formal`, `casual`, `direct` | formal |
| `--length` | `brief`, `standard`, `detailed` | standard |

**Output**: Preview → Approve → Generate DOCX or copy

---

## /pct-research - Research Brief

```bash
/pct-research "Claims AI vendors"              # General landscape
/pct-research "Options" --focus=comparison     # Compare specific options
/pct-research "GenAI" --depth=deep             # Detailed analysis
```

| Option | Values | Default |
|--------|--------|---------|
| `--focus` | `comparison`, `landscape`, `recommendation` | landscape |
| `--depth` | `quick`, `standard`, `deep` | standard |

**Output**: Markdown brief with sources

---

## Workflow Patterns

| Goal | Workflow |
|------|----------|
| Quick decision deck | `/pct-research "Topic" --focus=comparison` → `/pct-deck "Topic Decision"` |
| Formal request | `/pct-memo "Request" --tone=formal` → Review → Send |
| Team update | `/pct-deck "Status" --slides=4 --tier=executive` |
| Vendor eval | `/pct-research "Vendors" --focus=comparison --depth=standard` |

---

## Best Practices

| Do | Don't |
|----|-------|
| Be specific about topic | "Make a deck" |
| Specify audience | Assume AI knows context |
| Review before accepting | Blindly trust output |
| Iterate with feedback | Restart from scratch |
| Use appropriate depth | Always use defaults |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Output too generic | Add more context to prompt |
| Wrong tone | Specify `--tone=` explicitly |
| Too long/short | Use `--slides=` or `--length=` |
| Missing context | Include relevant files with `-f` |

---

## File Generation

```bash
# Install dependencies (one time)
pip install -r requirements.txt

# Generate files
python scripts/generate-pptx.py content.json output.pptx
python scripts/generate-docx.py content.json output.docx
```

---

## Getting Help

- Skill source: `.claude/commands/pct-*.md` (project commands, not `skills/` directory)
- Invocation: `/pct-deck`, `/pct-memo`, `/pct-research`, `/pct-cheatsheet` (Claude Code slash commands)
- Templates: `templates/pct/`
- Python scripts: `scripts/generate-*.py`
