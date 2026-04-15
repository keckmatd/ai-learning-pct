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

## Step 1: Clone the Repository

```bash
# Navigate to where you keep projects
cd ~/projects  # or wherever you work

# Clone copilot-dotfiles
git clone https://github.com/keckmatd/copilot-dotfiles.git

# Enter the directory
cd copilot-dotfiles
```

**Checkpoint:** You should see the repo contents (`ls`)

---

## Step 2: Run Setup

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

**What this does:**
- Creates symlinks for global instructions
- Sets up skill directory
- Configures any needed environment

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
chmod +x setup.sh
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
~/.config/github-copilot/
└── instructions.md → copilot-dotfiles/instructions.md

copilot-dotfiles/
├── instructions.md     ← Global context
├── skills/             ← Reusable workflows
├── templates/          ← Project starters
├── cheatsheets/        ← Quick reference
└── examples/           ← Sample usage
```

---

## Next: Learn the Commands

→ [cheatsheet-walkthrough.md](./cheatsheet-walkthrough.md)
