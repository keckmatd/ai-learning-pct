# /pct-deck -- PowerPoint Generator

Generate a Nationwide-branded PowerPoint deck from a topic or outline.

## Usage

```
/pct-deck "Topic or title"
/pct-deck "Topic" --slides=5
/pct-deck "Topic" --tier=executive|technical
```

## Instructions

You are generating a PowerPoint presentation using the Nationwide template.

### Step 1: Parse the request

The user said: $ARGUMENTS

Determine:
- **Topic**: What the deck is about
- **Slide count**: How many slides (default: 5-6)
- **Tier**: executive (high-level, business focus) or technical (detailed, implementation focus)
- **Additional instructions**: Any specific points to cover

If the topic is unclear, ask clarifying questions:
- "What's the main message you want to convey?"
- "Who's the audience?"
- "What decision or action should result from this?"

### Step 2: Generate slide content

Create a JSON structure for the deck:

```json
{
  "title": "Deck Title",
  "subtitle": "Context or date",
  "slides": [
    {
      "type": "title",
      "title": "Main Title",
      "subtitle": "Subtitle or tagline"
    },
    {
      "type": "content",
      "title": "Slide Heading",
      "bullets": [
        "Key point 1",
        "Key point 2",
        "Key point 3"
      ],
      "notes": "Speaker notes for this slide"
    },
    {
      "type": "two_column",
      "title": "Comparison",
      "left_title": "Option A",
      "left_bullets": ["Pro 1", "Pro 2"],
      "right_title": "Option B", 
      "right_bullets": ["Pro 1", "Pro 2"]
    },
    {
      "type": "closing",
      "title": "Next Steps",
      "bullets": ["Action item 1", "Action item 2"]
    }
  ]
}
```

**Slide types:**
- `title` - Opening slide with title and subtitle
- `content` - Standard bullet point slide
- `two_column` - Side-by-side comparison
- `closing` - Final slide with next steps or call to action

**Tier guidelines:**
- **Executive**: 4-6 slides. Focus on business impact, decisions, outcomes. Skip technical details.
- **Technical**: 6-10 slides. Include implementation details, architecture, data flows.

**Content rules:**
- Each slide should answer "so what?"
- Limit bullets to 4-5 per slide
- Use active voice
- Be specific, not generic

### Step 3: Preview and confirm

Show the user a slide-by-slide preview:

```
Deck: [Title] ([N] slides, [tier] tier)

1. [TITLE] Main Title
   Subtitle or tagline

2. [CONTENT] Slide Heading
   - Key point 1
   - Key point 2
   - Key point 3
   Notes: Speaker notes here

3. [TWO_COLUMN] Comparison
   Left: Option A          Right: Option B
   - Pro 1                  - Pro 1
   - Pro 2                  - Pro 2

4. [CLOSING] Next Steps
   - Action item 1
   - Action item 2
```

Ask: "Generate this deck, or would you like changes?"

The user can:
- Approve as-is
- Request changes ("add a slide about costs", "make slide 2 more specific")
- Ask for a different tier

### Step 4: Generate the PowerPoint

Once approved, explain how to generate the actual PPTX:

```
To create this PowerPoint:

Option 1: Use python-pptx
  pip install python-pptx
  # Then run the generation script (see below)

Option 2: Manual creation
  1. Open templates/pct/nationwide_default.pptx
  2. Duplicate slides as needed
  3. Replace placeholder text with the content above

Option 3: Copy to clipboard
  I'll format the content for easy paste into PowerPoint.
```

If python-pptx is available, offer to generate the file directly:

```python
from pptx import Presentation
from pptx.util import Inches, Pt

# Load template
prs = Presentation('templates/pct/nationwide_default.pptx')

# Add slides based on the JSON structure
# ... generation code ...

prs.save('output.pptx')
```

### Step 5: Offer follow-ups

- "Want me to adjust any slides?"
- "Should I generate speaker notes?"
- "Want a different tier (executive/technical)?"

## Template Location

The Nationwide template is at: `templates/pct/nationwide_default.pptx`

## Example

User: `/pct-deck "Q2 Claims Processing Improvements"`

Output:
```
Deck: Q2 Claims Processing Improvements (5 slides, executive tier)

1. [TITLE] Q2 Claims Processing Improvements
   Enterprise Architecture Update - April 2026

2. [CONTENT] Current State
   - Average processing time: 4.2 days
   - Manual review rate: 35%
   - Customer satisfaction: 3.2/5

3. [CONTENT] Proposed Changes
   - Implement AI triage for low-complexity claims
   - Automate document extraction
   - Add real-time status updates

4. [TWO_COLUMN] Impact Analysis
   Before:                  After:
   - 4.2 day avg            - 1.8 day avg
   - 35% manual             - 12% manual
   - 3.2/5 satisfaction     - 4.1/5 satisfaction

5. [CLOSING] Next Steps
   - Approve pilot scope (April 20)
   - Begin implementation (May 1)
   - First metrics review (June 15)

Generate this deck, or would you like changes?
```
