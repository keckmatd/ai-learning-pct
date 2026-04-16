---
title: "Run the install script"
part: 3
order: 41
layout: "content"
sourceFile: "install-guide"
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