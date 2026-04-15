# Worktree: {{WORKTREE_NAME}}

> This is an **isolated worktree** spawned for parallel development.
> Focus only on the task defined below. Do not modify files outside scope.

## Spawned From

- **Main worktree**: {{MAIN_PATH}}
- **Base branch**: {{BASE_BRANCH}}
- **Created**: {{TIMESTAMP}}
- **Plan reference**: {{PLAN_ID}} (if applicable)

## Your Task

{{TASK_DESCRIPTION}}

## Scope

### Files to Create/Modify
{{#each SCOPE_FILES}}
- `{{this.path}}` - {{this.description}}
{{/each}}

### Files to NOT Touch
{{#each EXCLUDED_FILES}}
- `{{this.path}}` - {{this.reason}}
{{/each}}

## Dependencies

### Completed (from earlier waves)
{{#each COMPLETED_DEPS}}
- {{this.id}}: {{this.description}}
{{/each}}

### Running in Parallel (no coordination needed)
{{#each PARALLEL_UNITS}}
- {{this.id}}: {{this.description}} (different files)
{{/each}}

## Success Criteria

{{#each SUCCESS_CRITERIA}}
- [ ] {{this}}
{{/each}}
- [ ] All tests pass
- [ ] No lint errors
- [ ] Changes committed

## When Done

1. Run the project's preflight checks (formatter + analyzer + tests) and fix any failures
2. Commit your changes with a descriptive message:
   ```
   feat({{FEATURE_AREA}}): {{BRIEF_DESCRIPTION}}

   Part of: {{PLAN_ID}}
   Unit: {{UNIT_ID}}
   ```
3. Report a summary of what you changed, files modified, and any issues encountered

---

*This worktree will be cleaned up after merge. All state should be in commits.*
