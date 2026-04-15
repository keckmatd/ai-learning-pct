# Universal Director

> This is my global configuration. It applies to ALL projects and sessions.
> Project-specific CLAUDE.md files inherit from this and can override where needed.

## Who I Am

I'm a developer who works across multiple stacks: Angular/TypeScript, Go, Java, and Android.
I value clean architecture, testable code, and pragmatic solutions over theoretical perfection.

## How I Work

### Development Philosophy

- **Ship incrementally**: Small, focused commits that each do one thing
- **Test what matters**: Critical paths and edge cases, not coverage theater
- **Document decisions**: The "why" matters more than the "what"
- **Refactor continuously**: Leave code cleaner than you found it

### Communication Style

- Be direct and concise - skip the preamble
- Show me code, not paragraphs about code
- Flag risks early, don't bury them
- If you're uncertain, say so and explain options
- Be aware of what phase we're in — brainstorming (text discussion), planning (spec/plan writing), or executing (code changes). Match tool usage to the phase.

### When You're Stuck

1. Tell me what you tried
2. Show me the error or unexpected behavior
3. Propose 2-3 approaches with tradeoffs
4. Don't apologize - just solve

## Universal Preferences

### Code Style

- Prefer explicit over clever
- Favor composition over inheritance
- Use meaningful names (longer is fine)
- Extract when it aids comprehension, not just reuse

### Git Practices

- Commit messages: imperative mood, 50 char subject
- Branch naming: `type/description` (e.g., `feat/user-auth`, `fix/null-pointer`)
- Squash-merge feature branches
- Never force-push shared branches

### Testing

- Unit tests for business logic
- Integration tests for APIs and data flows
- E2E tests for critical user journeys
- Mock external dependencies, not internal ones

## Stack-Specific Notes

### Angular/TypeScript
- Standalone components preferred
- Signals for reactive state (Angular 17+)
- Strict TypeScript: no `any` without justification
- RxJS: avoid nested subscribes, use higher-order operators

### Go
- Accept interfaces, return structs
- Errors are values - handle them explicitly
- Table-driven tests
- Keep packages focused and minimal

### Java
- Modern Java features when possible (records, pattern matching)
- Dependency injection via constructor
- Avoid checked exceptions in business logic
- Gradle with Kotlin DSL

### Android
- Jetpack Compose for new UI
- ViewModel + StateFlow for state
- Coroutines for async
- Room for persistence

## Project Registry

The brain knows all the bodies. Project registry lives in `registry/machines.yaml`.

- **Machine identification**: Each machine has `~/.machine-id` with a simple identifier
- **Lookup**: Find projects by reading the machine's section in the registry
- **Adding machines**: Copy the template in machines.yaml, set up ~/.machine-id on new machine

```bash
# Check current machine
cat ~/.machine-id

# List projects for this machine (example)
yq '.machines[env(MACHINE_ID)].projects | keys' registry/machines.yaml
```

## Harness & Orchestration

I use a harness system for multi-session work, powered by the `session-context` MCP server.

### Session Lifecycle

- `/work-init` - Initialize harness (spirit.md, config, tape)
- `/work-start` (`/ws`) - Resume session via MCP (spirit + plan + tape in one call)
- `/work-done` (`/wd`) - Save state to tape, update issues, clean handoff
- `/work-create` (`/wc`) - Create issues (GitHub or local backend)

### Planning & Execution

- `/work-plan` (`/wp`) - Decompose task into parallel units → `harness/plan.md`
- `/work-exec` (`/we`) - Execute plan with wave-parallelized subagents
- `/work-deep` (`/wdp`) - Full ceremony: brainstorm → spec → plan → execute

### Parallel Development

- `/work-branch` - Create isolated worktree for parallel work
- `/work-merge` - Merge worktree back and cleanup

### Maintenance

- `/housekeeping` (`/hk`) - Audit and trim docs for context efficiency
- `/issue-close` - Close issue with optional review gate
- `/tape-migrate` - Migrate legacy progress.md to tape entries

### Issue Backend

**Issue backend:** Read `harness/config.yaml` for `issue_backend` (github|local|none). Default: `github`. GitHub uses `gh issue`, local uses `harness/issues.yaml`, none skips issue ops.

### Tape System

Session continuity uses a tape (append-only log with auto-decay) instead of progress.md.
The `session-context` MCP handles tape reads/writes, plan lookup, and context assembly.
Skills call MCP tools (`tape_append`, `tape_search`, `get_active_context`) — not file I/O directly.
Recurring tape patterns graduate to CLAUDE.md via `/work-done`. Tape decays; rules persist.

### Process Skills

Superpowers skills (brainstorming, TDD, systematic-debugging, verification-before-completion) enforce process discipline. Follow them when they apply.

## Session Workflow

- Plans live at `harness/plan.md`. When resuming a session, check there first before asking or searching elsewhere.
- Before starting implementation, state your planned approach in 2-3 sentences and wait for confirmation. Do not begin code exploration or agent spawning until the approach is approved.
- After completing work on a plan task, update the plan checkboxes in `harness/plan.md` before moving to the next task.
- Verify before claiming done. Use the project's preflight command (`just preflight`, or formatter + analyzer + tests). Never close an issue or mark a task complete with failing checks.
- When spawning subagents, include: task description, relevant file contents, key type signatures, and a verification command. Subagents should verify their own work before reporting done.

## Context Efficiency

- Read files before suggesting changes
- Use glob patterns to find files, not guessing paths
- Batch related operations
- Don't repeat yourself - reference earlier context

## What I Don't Want

- Excessive comments explaining obvious code
- Defensive coding: skip it when the compiler/types prevent the state; add it when correctness depends on runtime coordination between systems
- Over-abstraction for single-use cases
- Boilerplate that adds no value
- Emoji in code or commit messages (unless I ask)

---

*This file is generated by copilot-sync from claude-dotfiles. Do not edit directly.*
