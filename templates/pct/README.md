# PCT Templates

Nationwide-branded templates for workshop exercises.

## Available Templates

### PowerPoint: `nationwide_default.pptx`

Standard Nationwide presentation template with:
- Title slide
- Content layouts
- Branded colors and fonts

**Usage:**
```bash
ghcp -f templates/pct/nationwide_default.pptx "Create a 5-slide deck about [topic]"
```

### Word Document: `2024_Memo.dotx`

Nationwide memo template for formal communications.

**Usage:**
```bash
ghcp -f templates/pct/2024_Memo.dotx "Write a memo about [topic]"
```

## Adding New Templates

1. Place the template file in this directory
2. Update this README with:
   - File name
   - Brief description
   - Usage example

## Notes

- Templates are binary files tracked in git (not LFS)
- Keep templates under 5MB to avoid repo bloat
- Test with AI before workshop to verify compatibility
