---
title: "Exercise: Build a PowerPoint"
category: "exercises"
order: 2
description: "Use AI and templates to generate a PowerPoint presentation quickly and consistently."
---

# Exercise: Build a PowerPoint

**Estimated time**: 10-15 minutes

Generate a PowerPoint outline using templates, demonstrating how AI + templates = fast, consistent output.

---

## Prerequisites

- copilot-dotfiles installed
- Access to the templates directory
- Terminal open in your copilot-dotfiles directory

---

## The Scenario

You need to create a presentation for a team meeting about a new process improvement. Rather than starting from scratch, you'll use AI + templates.

---

## Step 1: Examine the Template

```bash
# Look at available templates
ls templates/

# Read the PowerPoint template
cat templates/powerpoint-template.md
```

Notice the template has structure, branding guidelines, and slide types built in. This is what makes the AI output consistent -- it follows your standards, not generic defaults.

---

## Step 2: Define Your Content

Pick a simple topic you'd actually present on. Examples:

- "New expense report process"
- "Team goals for Q2"
- "Onboarding checklist update"
- "Project status update"

---

## Step 3: Generate the Deck

```bash
ghcp -f templates/powerpoint-template.md "Create a 5-slide PowerPoint about [YOUR TOPIC]. 
Follow the template format and guidelines."
```

Watch how the AI follows the template structure and applies the guidelines automatically.

---

## Step 4: Review the Output

The AI should generate:

- Title slide
- Agenda/overview
- 2-3 content slides
- Summary/next steps

**Check:**
- Does it follow the template structure?
- Does it apply the guidelines?
- Is the content relevant to your topic?

---

## Step 5: Refine

Try iterating on the output:

```bash
ghcp "Make slide 3 more concise - bullet points only, 
      max 4 bullets, each under 10 words"
```

Or add new content:

```bash
ghcp "Add a slide about implementation timeline"
```

The key pattern: generate a draft, then refine it with follow-up prompts.

---

## What to Take Away

**Templates + AI = consistent, fast output.** The template encodes your standards; AI applies them to new content.

This pattern works for:

- Presentations
- Documents
- Emails
- Reports
- Any repeatable format

## Try Next

Once you're comfortable with template-driven generation, try the [Research Brief](/ai-learning-pct/docs/exercises/research-brief) exercise to practice AI-powered synthesis.

## Going Further

1. Create your own template for something you do often
2. Add it to your personal templates directory
3. Use it in your next real task
