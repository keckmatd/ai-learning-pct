# Exercise: Build a PowerPoint

**Time**: 10 minutes  
**Type**: Guided (facilitator leads, everyone follows)

---

## Goal

Generate a PowerPoint outline/content using Nationwide templates, demonstrating how AI + templates = fast, consistent output.

---

## Setup

Ensure you have:
- copilot-dotfiles installed
- Access to the templates directory
- Terminal open in copilot-dotfiles directory

---

## The Scenario

> "You need to create a presentation for a team meeting about a new process improvement. Rather than starting from scratch, you'll use AI + templates."

---

## Step 1: Examine the Template

```bash
# Look at available templates
ls templates/

# Read the PowerPoint template
cat templates/powerpoint-template.md
```

**Notice:** The template has structure, Nationwide branding guidelines, slide types.

---

## Step 2: Define Your Content

Think of a simple topic. Examples:
- "New expense report process"
- "Team goals for Q2"
- "Onboarding checklist update"

**Your topic:** ______________________

---

## Step 3: Generate the Deck

```bash
ghcp -f templates/powerpoint-template.md "Create a 5-slide PowerPoint about [YOUR TOPIC]. 
Follow the template format and Nationwide guidelines."
```

**Watch:** AI follows the template structure, applies guidelines.

---

## Step 4: Review Output

The AI should generate:
- Title slide
- Agenda/overview
- 2-3 content slides
- Summary/next steps

**Check:**
- Does it follow template structure?
- Does it apply the guidelines?
- Is the content relevant?

---

## Step 5: Refine (If Time)

```bash
ghcp "Make slide 3 more concise - bullet points only, 
      max 4 bullets, each under 10 words"
```

Or:
```bash
ghcp "Add a slide about implementation timeline"
```

---

## Discussion Points

- **What did the template buy you?** (Structure, consistency, compliance)
- **What would you change?** (More detail, different structure)
- **How would you make this your own?** (Customize template for your common deck types)

---

## Key Takeaway

> "Templates + AI = consistent, fast output. The template encodes your standards, AI applies them to new content."

This pattern works for:
- Presentations
- Documents
- Emails
- Reports
- Any repeatable format

---

## Homework Extension

1. Create your own template for something you do often
2. Add it to your personal templates directory
3. Use it in your next real task

---

## Next: Research Brief

→ [exercise-research.md](./exercise-research.md)
