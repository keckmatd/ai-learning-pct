# Install Guide

**Time**: 10 minutes (hard stop)

---

## Pre-Flight Checklist

Before starting, confirm:

- [ ] Terminal access (Windows Terminal, iTerm, etc.)
- [ ] Git installed (`git --version`)
- [ ] GitHub Copilot CLI access (`gh copilot --version` or `ghcp --version`)
- [ ] Can clone from GitHub

**If missing any:** Pair with someone who has it, or watch the demo.

---

## Step 1: Get the Workshop Repo

The harness is **already included** in this workshop repo — no separate download needed.

```bash
# Navigate to where you keep projects
cd ~/projects  # or wherever you work

# Clone the workshop repo (skip if you already have it)
git clone https://github.com/keckmatd/ai-learning-pct.git

# Enter the directory
cd ai-learning-pct
```

**Checkpoint:** You should see `install-harness.sh` when you run `ls`

---

## Step 2: Run Setup

```bash
# Make the install script executable
chmod +x install-harness.sh

# Run the installer
./install-harness.sh
```

**What this does:**
- Creates `~/.copilot/` directory
- Symlinks global instructions, skills, and agents
- Copies config files
- Checks for required tools

**Checkpoint:** Script completes without errors

---

## Step 3: Verify Installation

```bash
# Test that global instructions load
ghcp "What do your instructions say about commit messages?"
```

**Expected:** AI references your global instructions content

---

## Troubleshooting

### "Permission denied"
```bash
chmod +x install-harness.sh
```

### "Command not found: ghcp"
You might need the full command:
```bash
gh copilot suggest "test command"
```

### "Can't clone - authentication failed"
```bash
gh auth login
```

### "Something else went wrong"
- Raise hand
- Pair with neighbor
- Follow along with demo

---

## If Stuck After 5 Minutes

Don't debug in the workshop. Options:
1. Pair with someone who succeeded
2. Watch the demo, troubleshoot later
3. Use the async setup guide (will be provided)

**Goal:** Everyone sees it working, even if not on their machine.

---

## What Got Installed

```
~/.copilot/
├── copilot-instructions.md → ai-learning-pct/copilot-instructions.md
├── skills/                 → ai-learning-pct/skills/
├── agents/                 → ai-learning-pct/agents/
└── config.json               (copied)

ai-learning-pct/              ← Workshop repo (already on your machine)
├── copilot-instructions.md   ← Global instructions
├── skills/                   ← Workflow skills
├── agents/                   ← Agent definitions
├── templates/                ← Output templates
└── install-harness.sh        ← The script you just ran
```

---

## Next: Learn the Commands

→ [cheatsheet-walkthrough.md](./cheatsheet-walkthrough.md)
