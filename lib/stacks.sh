#!/bin/bash
#
# Shared stack selection helper
# Source this file — do not execute directly.
#
# Usage:
#   source lib/stacks.sh
#   load_stacks
#   if stack_enabled go; then install_go; fi
#

# Canonical stack names (must match registry/machines.yaml)
VALID_STACKS="flutter dotnet go java angular python typescript expo shell"

# Populated by load_stacks()
_ENABLED_STACKS=""

# load_stacks — read STACKS from dotfiles.env or derive from machines.yaml
# Sets _ENABLED_STACKS. Empty means "all stacks enabled".
load_stacks() {
    _ENABLED_STACKS=""

    # 1. Try dotfiles.env (check script dir, then install dir, then cwd)
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." 2>/dev/null && pwd)"

    local env_file=""
    for candidate in \
        "${script_dir}/dotfiles.env" \
        "${CLAUDE_DOTFILES_DIR:-$HOME/.claude-dotfiles}/dotfiles.env" \
        "./dotfiles.env"; do
        if [ -f "$candidate" ]; then
            env_file="$candidate"
            break
        fi
    done

    if [ -n "$env_file" ]; then
        # Read STACKS value (handles comments, quotes)
        local raw
        raw=$(grep -E '^STACKS=' "$env_file" 2>/dev/null | tail -1 | cut -d= -f2-)
        # Strip surrounding quotes if present
        raw="${raw%\"}"
        raw="${raw#\"}"
        raw="${raw%\'}"
        raw="${raw#\'}"
        # Trim whitespace
        raw="$(echo "$raw" | xargs)"
        if [ -n "$raw" ]; then
            _ENABLED_STACKS="$raw"
            return 0
        fi
    fi

    # 2. Fallback: derive from machines.yaml + ~/.machine-id via yq
    if command -v yq &>/dev/null && [ -f "${HOME}/.machine-id" ]; then
        local machine_id
        machine_id=$(cat "${HOME}/.machine-id" 2>/dev/null | tr -d '[:space:]')
        local registry=""
        for candidate in \
            "${script_dir}/registry/machines.yaml" \
            "${CLAUDE_DOTFILES_DIR:-$HOME/.claude-dotfiles}/registry/machines.yaml"; do
            if [ -f "$candidate" ]; then
                registry="$candidate"
                break
            fi
        done
        if [ -n "$registry" ] && [ -n "$machine_id" ]; then
            local stacks
            stacks=$(MACHINE_ID="$machine_id" yq -r \
                ".machines[env(MACHINE_ID)].projects[].stack // empty" \
                "$registry" 2>/dev/null | sort -u | tr '\n' ' ' | xargs)
            if [ -n "$stacks" ]; then
                _ENABLED_STACKS="$stacks"
                return 0
            fi
        fi
    fi

    # 3. Empty = all stacks enabled (default)
    _ENABLED_STACKS=""
    return 0
}

# stack_enabled <name> — returns 0 if the stack should be installed
# If _ENABLED_STACKS is empty, all stacks are enabled.
stack_enabled() {
    local name="${1:?stack name required}"

    # Empty list = all enabled
    if [ -z "$_ENABLED_STACKS" ]; then
        return 0
    fi

    # Check if name is in the space-separated list
    local s
    for s in $_ENABLED_STACKS; do
        if [ "$s" = "$name" ]; then
            return 0
        fi
    done

    return 1
}

# stacks_summary — print which stacks are enabled (for logging)
stacks_summary() {
    if [ -z "$_ENABLED_STACKS" ]; then
        echo "all (no STACKS filter set)"
    else
        echo "$_ENABLED_STACKS"
    fi
}
