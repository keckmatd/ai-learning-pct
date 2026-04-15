# Browser vs CLI

**Time**: 5 minutes

---

## The Surface Difference

| Browser (ChatGPT, Gemini) | CLI (Copilot, Claude Code) |
|---------------------------|----------------------------|
| Web interface | Terminal |
| Click and type | Commands |
| Pretty UI | Text-based |
| Anywhere with internet | Your machine |

But that's not why it matters...

---

## The Real Difference

### Browser: Conversation in a Sandbox

```
┌─────────────────────────────────────────┐
│              Browser AI                 │
│                                         │
│   You ←→ AI ←→ Limited tools            │
│                                         │
│   - Can't touch your files              │
│   - Can't run your code                 │
│   - Can't access your systems           │
│   - Lives in their cloud                │
│                                         │
└─────────────────────────────────────────┘
```

**You upload TO it.** It can't reach out to your world.

---

### CLI: AI in Your Workspace

```
┌─────────────────────────────────────────┐
│              CLI AI                     │
│                                         │
│   You ←→ AI ←→ YOUR MACHINE             │
│              ↓                          │
│   - Reads your actual files             │
│   - Writes code directly                │
│   - Runs commands                       │
│   - Integrates with your tools          │
│   - Lives where you work                │
│                                         │
└─────────────────────────────────────────┘
```

**It works WITH you.** In your actual workspace.

---

## Concrete Examples

### Browser Way
```
1. Copy code from VS Code
2. Paste into ChatGPT
3. Ask for changes
4. Copy response
5. Paste back into VS Code
6. Hope it works
7. If not, repeat
```

### CLI Way
```
1. "Fix the bug in src/api/handler.go"
2. AI reads file, makes changes, runs tests
3. Done (or iterate in place)
```

---

### Another Example: Research

**Browser:**
- Chat asks you to provide information
- You alt-tab, search, copy-paste
- Context gets lost, you repeat yourself

**CLI with tools:**
- AI searches web, reads docs, synthesizes
- Pulls information into context automatically
- You stay focused on the question, not the fetching

---

## The Unlock

> "Browser AI is a conversation partner. CLI AI is a collaborator with hands."

| Capability | Browser | CLI |
|------------|---------|-----|
| Chat about ideas | Yes | Yes |
| Read your files | No (must upload) | Yes |
| Edit your files | No | Yes |
| Run commands | No | Yes |
| Access internal tools | No | Yes (MCP) |
| Persistent project context | Limited | Full control |

---

## When Browser Makes Sense

- Quick questions, no context needed
- Mobile / no terminal access
- Casual use, exploration
- Sharing conversations with others

**Browser isn't bad** - it's just not for building.

---

## When CLI Wins

- Working on actual projects
- Needing file/code access
- Complex, multi-step tasks
- Building systems over time
- Integrating with your workflow

---

## Check for Understanding

> "Why can't browser AI just edit your local files?"

Answer: Security/architecture - web apps can't access your file system directly. CLI runs locally with permissions.

---

## Transition

> "So CLI AI works in your world. But a single conversation still forgets everything when you close it. How do we work across time?"
