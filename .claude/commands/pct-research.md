# /pct-research -- Research Brief Generator

Generate a research brief on a topic for decision-making or awareness.

> **Capability note:** This skill generates text content. File generation (.pptx, .docx)
> requires running Python scripts separately — see the Post-generation section in each
> relevant skill (e.g., `/pct-deck`).

## Usage

```
/pct-research "Topic"
/pct-research "Topic" --depth=quick|standard|deep
/pct-research "Topic" --focus=comparison|landscape|recommendation
```

## Instructions

You are generating a research brief to inform business decisions.

### Step 1: Parse the request

The user said: $ARGUMENTS

Determine:
- **Topic**: What to research
- **Depth**: quick (5 min read), standard (10 min), deep (20+ min)
- **Focus type**:
  - `comparison` - Compare 2-3 specific options
  - `landscape` - Survey the market/space
  - `recommendation` - Research leading to a specific recommendation
- **Audience**: Technical, business, or mixed
- **Deadline context**: Is this urgent?

If unclear, ask:
- "What decision will this inform?"
- "Are there specific options you're comparing?"
- "How deep do you need to go?"

### Step 2: Gather information

Use available tools to research:

1. **Web search** for current information:
   ```
   Search for: "[topic] 2026 overview"
   Search for: "[topic] vs alternatives comparison"
   Search for: "[topic] enterprise case studies"
   ```

2. **Fetch key sources** for detailed information

3. **Synthesize** - don't just summarize, analyze and connect

> **Fallback:** If web search is unavailable, use training knowledge and clearly note
> "Source: AI training data, verify independently" on any claims. Flag the limitation
> to the user so they can supplement with their own research.

### Step 3: Generate the brief

Structure based on focus type:

**COMPARISON focus:**
```
# [Topic]: Options Analysis

## Executive Summary
[2-3 sentences: the bottom line recommendation]

## Options Compared
| Criteria      | Option A | Option B | Option C |
|---------------|----------|----------|----------|
| Cost          | ...      | ...      | ...      |
| Capability    | ...      | ...      | ...      |
| Risk          | ...      | ...      | ...      |
| Timeline      | ...      | ...      | ...      |

## Option A: [Name]
**What it is**: [1 sentence]
**Strengths**: [bullets]
**Weaknesses**: [bullets]
**Best for**: [when to choose this]

## Option B: [Name]
[Same structure]

## Recommendation
[Which option and why, given your context]

## Next Steps
[Specific actions to move forward]
```

**LANDSCAPE focus:**
```
# [Topic]: Market Landscape

## Executive Summary
[Current state of the space in 2-3 sentences]

## Key Players
| Vendor    | Segment      | Strength        | Watch For    |
|-----------|--------------|-----------------|--------------|
| ...       | ...          | ...             | ...          |

## Trends to Watch
1. **[Trend 1]**: [Why it matters]
2. **[Trend 2]**: [Why it matters]
3. **[Trend 3]**: [Why it matters]

## Implications for [Organization]
- [How this affects your decisions]
- [Opportunities]
- [Risks]

## Recommended Actions
[What to do with this information]
```

**RECOMMENDATION focus:**
```
# [Topic]: Recommendation

## Bottom Line Up Front
[The recommendation in 1-2 sentences]

## Context
[Why this matters now - brief]

## Analysis
[Key findings that support the recommendation]

## Risks & Mitigations
| Risk              | Likelihood | Impact | Mitigation        |
|-------------------|------------|--------|-------------------|
| ...               | ...        | ...    | ...               |

## Alternatives Considered
[What else was evaluated and why it was rejected]

## Recommendation
[Detailed recommendation with specifics]

## Implementation Path
1. [Step 1] - [Timeline]
2. [Step 2] - [Timeline]
3. [Step 3] - [Timeline]
```

### Step 4: Quality checks

Before presenting, verify:
- [ ] Executive summary answers "so what?"
- [ ] Claims are supported by sources
- [ ] Recommendation is actionable
- [ ] Next steps are specific
- [ ] Length matches requested depth

### Step 5: Present and refine

Show the brief with a sources section:

```
[Full brief content]

---
Sources:
1. [Source title] - [URL or reference]
2. [Source title] - [URL or reference]

---
Generated: [Date]
Depth: [quick/standard/deep]
Focus: [comparison/landscape/recommendation]

Want me to expand any section or adjust the focus?
```

### Step 6: Offer follow-ups

- "Want me to go deeper on any section?"
- "Should I create a presentation from this?"
- "Want me to draft an email sharing this brief?"

## Example

User: `/pct-research "Claims AI vendors" --focus=comparison --depth=standard`

Output:
```
# Claims AI Vendors: Options Analysis

## Executive Summary
For claims automation, Tractable leads on auto/property claims 
with proven ROI, while Shift Technology excels at fraud detection. 
Recommend Tractable for initial pilot based on Nationwide's 
auto-heavy portfolio.

## Options Compared
| Criteria      | Tractable    | Shift Tech   | Hi Marley    |
|---------------|--------------|--------------|--------------|
| Focus         | Auto/Property| Fraud detect | Communication|
| Pricing       | Per-claim    | Platform fee | Per-user     |
| Integration   | 8-12 weeks   | 12-16 weeks  | 4-6 weeks    |
| References    | Progressive  | Liberty Mut  | USAA         |

## Tractable
**What it is**: AI-powered claims assessment for auto and property
**Strengths**:
- 70% faster photo assessment
- Strong carrier references (Progressive, Tokio Marine)
- Pre-built Guidewire integration
**Weaknesses**:
- Limited to auto/property (no workers comp)
- Per-claim pricing can scale expensively
**Best for**: High-volume auto claims operations

## Shift Technology
**What it is**: AI platform for fraud detection and claims automation
**Strengths**:
- Industry-leading fraud detection (40% improvement typical)
- Broader platform (underwriting, claims, fraud)
- Strong in complex claims
**Weaknesses**:
- Longer implementation timeline
- Higher upfront investment
**Best for**: Organizations prioritizing fraud reduction

## Recommendation
Start with Tractable for auto claims pilot (Q2), evaluate Shift 
for fraud module in Q4. Hi Marley could complement either for 
customer communication.

## Next Steps
1. Schedule Tractable demo (this week)
2. Request Shift Technology pricing (next week)
3. Define pilot scope and success metrics (April 25)

---
Sources:
1. Gartner Claims Technology Report 2026
2. Tractable case study: Progressive Insurance
3. Shift Technology product documentation

---
Generated: April 15, 2026
Depth: standard
Focus: comparison

Want me to expand any section or adjust the focus?
```
