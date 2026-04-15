# Exercise: Research Brief

**Time**: 10 minutes  
**Type**: Semi-independent (guidelines provided, work at own pace)

---

## Goal

Generate a research brief on a topic using AI's ability to synthesize information, following a consistent format.

---

## The Scenario

> "Your manager asks: 'Give me a quick brief on [topic] before our meeting.' Instead of 30 minutes of searching and writing, you use the harness."

---

## Step 1: Choose a Topic

Pick something relevant to your work. Examples:
- "Insurance claims automation trends"
- "Remote work policy best practices"
- "AI governance frameworks"
- "Customer self-service portals"

**Your topic:** ______________________

---

## Step 2: Run the Research Skill

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

**Check for:**
- Is the summary actually summarizing?
- Are the key points relevant and non-obvious?
- Are risks realistic?
- Are next steps actionable?

---

## Step 4: Refine

If something's off:

```bash
ghcp "The key points are too generic. 
      Make them more specific to Nationwide's context as an insurance company."
```

Or:

```bash
ghcp "Add a section on 'What competitors are doing' with 2-3 examples"
```

---

## Step 5: Format for Delivery

```bash
ghcp "Format this as a clean markdown document I could paste into an email"
```

Or:

```bash
ghcp "Format this for a Teams message - shorter, more casual tone"
```

---

## Advanced: Save as a Skill

If you do research briefs often, capture this workflow:

```markdown
# Research Brief Skill

When asked to research a topic, follow this format:

1. Executive Summary (2-3 sentences)
2. Key Points (3-5 bullets)
3. Considerations/Risks (2-3 bullets)  
4. Recommended Next Steps (2-3 bullets)

Keep concise. Adapt to requester's context (role, org).
```

Add this to your skills directory, invoke next time.

---

## Discussion Points

- **How accurate is the information?** (AI can be confident but wrong - verify important facts)
- **What's the workflow?** (Generate draft → review → refine → deliver)
- **Where does this save time?** (First draft, structure, formatting)
- **Where is human judgment still needed?** (Accuracy, relevance, tone)

---

## Key Takeaway

> "AI gets you to 80% fast. Your expertise takes it to 100%. The harness makes the 80% consistent."

---

## Part 3 Complete

You've now:
- Installed the harness
- Learned the commands
- Built a PowerPoint from template
- Generated a research brief

**These patterns apply to most knowledge work:**
- Template + AI = consistent output
- Research + AI = fast synthesis
- Your judgment + AI speed = productivity

---

## Transition to Part 4

> "That was scripted. You followed my templates and prompts. Now let me show you what's possible when you build your own systems..."
