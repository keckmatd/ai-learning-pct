---
name: project-init
description: Initialize a new project or adopt an existing one into the harness. Drops justfile, CLAUDE.md, and .gitignore templates, then registers the project in machines.yaml.
allowed-tools:
  - bash
  - view
  - edit
  - create
  - ask_user
---
# Project Init

Initialize a new project or adopt an existing one into the harness. Drops justfile, CLAUDE.md, and .gitignore templates, then registers the project in machines.yaml.

## What This Does

- Detects whether this is a new project or existing (adopt mode)
- For new projects: creates repo, drops templates, registers in machines.yaml
- For existing projects: audits what's missing and fills gaps with confirmation
- Uses stack definitions from machines.yaml to select the right justfile template

## Instructions

When the user runs `/project-init` or `/pi`, do the following:

### Step 1: Detect mode

Check if the current working directory is a git repository:
- Run `git rev-parse --is-inside-work-tree 2>/dev/null`
- If yes → **Adopt Mode** (go to Step 10)
- If the user explicitly says "new project" → **New Project Mode** regardless
- Otherwise → ask: "Is this a new project or adopting an existing one?"

### Step 2: Gather project info (New Project Mode)

Ask the user for:
1. **Project name** (kebab-case, e.g. `my-cool-app`)
2. **Stack** — present the available stacks from machines.yaml:
   - flutter, dotnet, go, java, angular, python, typescript, expo, shell
3. **Brief description** (one line)
4. **Create GitHub repo?** (yes/no, default: yes)
   - If yes: public or private? (default: public)

### Step 3: Create project

**If GitHub repo:**
```bash
gh repo create {name} --{visibility} --clone
cd {name}
```

**If no GitHub:**
```bash
mkdir -p {project-dir}/{name}
cd {project-dir}/{name}
git init
```

Path convention:
- Read `~/.machine-id`
- `wsl-personal` → `~/projects/`
- All others → `~/code/`

### Step 4: Drop justfile

- Read the machine's stack definitions from the claude-dotfiles registry:
  - `wsl-personal` → `~/projects/claude-dotfiles/registry/machines.yaml`
  - Others → `~/code/claude-dotfiles/registry/machines.yaml`
- Look up `stacks.{stack}.template`
- If template is not null:
  - Read the template from `{claude-dotfiles-path}/templates/{template}`
  - Replace `{{PROJECT_NAME}}` with the project name (Title Case)
  - Replace `{{PROJECT_DESCRIPTION}}` with the description
  - Write to `justfile` in the project directory
- If template is null (e.g. `shell`):
  - Tell the user: "No justfile template for {stack}. Skipping."

### Step 5: Drop CLAUDE.md

- Read `{claude-dotfiles-path}/templates/project-claude.md`
- Replace `[Project Name]` with the project name
- Replace `[Brief description of what this project does]` with the description
- Write to `CLAUDE.md` in the project directory

### Step 6: Drop .gitignore

**If `gh` is available:**
Map stack to GitHub gitignore template:
- flutter → Dart
- dotnet → VisualStudio
- go → Go
- java → Java
- angular → Node
- python → Python
- typescript → Node
- expo → Node
- shell → (skip)

```bash
gh api gitignore/templates/{language} --jq '.source' > .gitignore
```

**If `gh` is not available or stack is `shell`:**
Create a minimal .gitignore:
```
.env
.env.*
!.env.example
*.log
.DS_Store
```

### Step 7: Register in machines.yaml

- Read `~/.machine-id` to get current machine
- Read machines.yaml from the claude-dotfiles registry
- Add a new entry under `machines.{machine-id}.projects`:

```yaml
{project-key}:
  name: {Human Readable Name}
  path: {~/projects/{name} or ~/code/{name}}
  stack: {stack}
  description: {description}
  features: []
  justfile: {true if template was dropped, false otherwise}
  repo: {github.com/keckmatd/{name} or null}
```

- Write the updated machines.yaml

### Step 8: Initial commit

```bash
git add -A
git commit -m "Initial project scaffold"
```

If GitHub repo was created:
```bash
git push -u origin main
```

### Step 9: Offer follow-ups

Present options:
- "Run `/backbone-onboard` to connect infrastructure?"
- "Done — project is ready"

Then stop.

### Step 10: Adopt existing project

Triggered when cwd is a git repo or user specifies an existing path.

**10a: Detect project identity**
- Read `~/.machine-id`
- Check if cwd matches any project in machines.yaml (compare paths)
- If found: use that entry's name, stack, description
- If not found: ask for project name, stack, and description

**10b: Audit what's missing**

Check each of these and build a report:

| Check | How |
|-------|-----|
| justfile | `test -f justfile` |
| CLAUDE.md | `test -f CLAUDE.md` |
| machines.yaml entry | grep registry for matching path |

Display the audit:
```
Adopt: {project name} ({stack})

  justfile:     {present / missing — template available / missing — no template}
  CLAUDE.md:    {present / missing}
  Registered:   {yes / no}

Create missing items?
```

**10c: Fill gaps**

For each missing item, confirm with user before creating:
- Justfile: same as Step 4
- CLAUDE.md: same as Step 5
- machines.yaml: same as Step 7

Never overwrite existing files.

**10d: Commit changes**

If any files were created:
```bash
git add justfile CLAUDE.md  # only files that were actually created
git commit -m "Add harness files via /project-init"
```

## Notes

- This skill does NOT run framework scaffolding (flutter create, npx create-expo-app, etc.). The user does that first, then runs /project-init to layer harness files.
- Templates are starting points. Once dropped, the project owns the justfile.
- The skill never overwrites existing files in adopt mode.
- For backbone onboarding, the user runs `/backbone-onboard` separately.
