# /pct-memo -- Memo Generator

Generate a Nationwide-formatted memo or one-pager from a topic.

> **Capability note:** This skill generates text content. File generation (.pptx, .docx)
> requires running Python scripts separately — see the Post-generation section in each
> relevant skill (e.g., `/pct-deck`).

## Usage

```
/pct-memo "Topic or purpose"
/pct-memo "Topic" --tone=formal|casual|direct
/pct-memo "Topic" --length=brief|standard|detailed
```

## Instructions

You are generating a business memo using the Nationwide template.

### Step 1: Parse the request

The user said: $ARGUMENTS

Determine:
- **Purpose**: What is this memo about?
- **Audience**: Who will read it? (executives, peers, team, external)
- **Tone**: formal, casual, or direct (default: formal)
- **Length**: brief (1 paragraph), standard (3-4 paragraphs), detailed (full page)
- **Action required**: What should the reader do after reading?

If the purpose is unclear, ask:
- "What's the key message?"
- "Who's the audience?"
- "What action do you need from them?"

### Step 2: Generate memo structure

Create a structured memo:

```
TO:      [Recipients]
FROM:    [Sender]
DATE:    [Date]
RE:      [Subject line - clear and specific]

---

[EXECUTIVE SUMMARY - 2-3 sentences max]
The key point upfront. What do they need to know?

[BACKGROUND - if needed]
Brief context. Only include what's necessary to understand the ask.

[DETAILS - the main content]
The substance of the memo. Use bullets for clarity.
- Key point 1
- Key point 2
- Key point 3

[RECOMMENDATION/ASK]
What you're proposing or requesting. Be specific.

[NEXT STEPS]
- Action item 1 (owner, deadline)
- Action item 2 (owner, deadline)

---

[Optional: Attachments list]
```

**Tone guidelines:**
- **Formal**: Full sentences, professional language, complete structure
- **Casual**: Shorter sentences, contractions OK, get to the point faster
- **Direct**: Minimal context, bullet-heavy, action-focused

**Length guidelines:**
- **Brief**: Executive summary + ask only (3-4 sentences total)
- **Standard**: All sections, 1/2 page
- **Detailed**: Full context, supporting details, 1 full page

### Step 3: Preview and confirm

Show the user the draft:

```
Memo Preview (formal, standard length)
======================================

TO:      Leadership Team
FROM:    [Your name]
DATE:    April 15, 2026
RE:      Approval Needed: Q2 AI Pilot Expansion

---

We are requesting approval to expand the claims AI pilot from 
3 states to 12 states, based on strong Q1 results showing 40% 
reduction in processing time.

BACKGROUND
The Q1 pilot in OH, IN, and KY processed 12,000 claims with:
- 40% faster average processing (4.2 days → 2.5 days)
- 15% reduction in manual review rate
- 4.2/5 customer satisfaction (up from 3.1)

RECOMMENDATION
Approve Phase 2 expansion to include: PA, MI, WI, IL, MO, 
TN, GA, NC, VA, MD.

NEXT STEPS
- Approval decision needed by April 22
- If approved, rollout begins May 1
- Weekly metrics review continues

======================================

Generate this memo, or would you like changes?
```

### Step 4: Generate the document

Once approved, provide options:

```
To create this document:

Option 1: Copy to Word
  I'll format this for easy paste into the template.
  Open: templates/pct/2024_Memo.dotx
  Paste the formatted content.

Option 2: Plain text
  Copy the text above into any document.

Option 3: Markdown
  Save as .md for version control or sharing.
```

### Step 5: Offer follow-ups

- "Want me to adjust the tone?"
- "Should I add more detail to any section?"
- "Want me to draft a follow-up email to accompany this?"

## Template Location

The Nationwide memo template is at: `templates/pct/2024_Memo.dotx`

## Example

User: `/pct-memo "Request budget for new monitoring tools" --tone=direct`

Output:
```
Memo Preview (direct, standard length)
======================================

TO:      Finance Committee
FROM:    [Your name]
DATE:    April 15, 2026
RE:      Budget Request: Production Monitoring Tools ($45K)

---

Requesting $45K for production monitoring tools to reduce 
incident response time.

THE ASK
- $30K: Datadog license (12 months)
- $15K: Implementation and training

WHY NOW
- 3 production incidents in Q1 took >4 hours to diagnose
- Estimated cost of downtime: $120K
- Monitoring would reduce diagnosis time by 70%

ROI
- Payback period: <3 months
- Annual savings: ~$150K in reduced downtime

NEXT STEPS
- Budget committee review: April 20
- If approved: Procurement starts April 25
- Go-live target: May 15

======================================

Generate this memo, or would you like changes?
```
