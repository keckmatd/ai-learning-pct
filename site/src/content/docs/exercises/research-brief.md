---
title: "Exercise: Research Brief"
category: "exercises"
order: 3
description: "Generate a structured research brief on any topic using AI-powered synthesis."
---

# Exercise: Research Brief

**Estimated time**: 10-15 minutes

Generate a research brief on a topic of your choice, using AI's ability to synthesize information into a consistent format.

---

## The Scenario

Your manager asks: "Give me a quick brief on [topic] before our meeting." Instead of 30 minutes of searching and writing, you use the CLI harness to generate a structured draft in minutes.

---

## Step 1: Choose a Topic

Pick something relevant to your work. Examples:

- "Insurance claims automation trends"
- "Remote work policy best practices"
- "AI governance frameworks"
- "Customer self-service portals"

---

## Step 2: Run the Research Prompt

```bash
ghcp "Research: [YOUR TOPIC]

Generate a brief that includes:
1. Executive Summary (2-3 sentences)
2. Key Points (3-5 bullets)
3. Considerations/Risks (2-3 bullets)
4. Recommended Next Steps (2-3 bullets)

Keep it concise - this should fit on one page."
```

---

## Step 3: Review the Output

Check for quality:

- **Executive Summary** -- Does it actually summarize, or just restate the topic?
- **Key Points** -- Are they relevant and non-obvious?
- **Risks** -- Are they realistic, not just generic filler?
- **Next Steps** -- Are they actionable, not vague?

---

## Step 4: Refine

If something's off, iterate:

```bash
ghcp "The key points are too generic. 
      Make them more specific to our context as an insurance company."
```

Or expand the scope:

```bash
ghcp "Add a section on 'What competitors are doing' with 2-3 examples"
```

---

## Step 5: Format for Delivery

Adapt the output for how you'll actually deliver it:

```bash
ghcp "Format this as a clean markdown document I could paste into an email"
```

Or for a different channel:

```bash
ghcp "Format this for a Teams message - shorter, more casual tone"
```

---

## Advanced: Save as a Reusable Skill

If you produce research briefs regularly, capture the workflow as a skill:

```markdown
# Research Brief Skill

When asked to research a topic, follow this format:

1. Executive Summary (2-3 sentences)
2. Key Points (3-5 bullets)
3. Considerations/Risks (2-3 bullets)
4. Recommended Next Steps (2-3 bullets)

Keep concise. Adapt to requester's context (role, org).
```

Add this to your skills directory and invoke it next time -- no need to re-explain the format.

---

## What to Take Away

**AI gets you to 80% fast. Your expertise takes it to 100%.** The harness makes that 80% consistent every time.

The workflow: **Generate draft -> Review -> Refine -> Deliver**

This works because:

- AI handles the structure and first-pass synthesis
- You bring the judgment on accuracy, relevance, and tone
- Iteration is fast -- refining a draft beats starting from scratch

## Going Further

Try combining patterns from both exercises:

- Use a **template** to define the brief format
- Use **research prompts** to fill in the content
- **Refine** until it meets your standards
- **Save as a skill** for next time
