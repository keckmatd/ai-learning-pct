#!/usr/bin/env bash
# test-skills.sh
#
# Validates that every PCT skill file in .claude/commands/pct-*.md has the
# minimum metadata needed for a working slash command: a name and a
# description.
#
# Two metadata conventions are accepted, so the script stays useful as the
# skill set evolves:
#
#   1. YAML frontmatter at the top of the file:
#
#        ---
#        name: pct-deck
#        description: PowerPoint generator
#        ---
#
#   2. The GHCP heading convention currently used by the PCT skills:
#
#        # /pct-deck -- PowerPoint Generator
#
#        Generate a Nationwide-branded PowerPoint deck from a topic.
#
#      Here the slash-prefixed name comes from the first H1 and the
#      description is the first non-empty line after the heading.
#
# Exits 0 if every file has both a name and a description. Exits 1 (and
# prints the offending files) if any file is missing either piece.

set -euo pipefail

# Resolve repo root so the script works no matter where it is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMMANDS_DIR="${REPO_ROOT}/.claude/commands"

shopt -s nullglob
skill_files=("${COMMANDS_DIR}"/pct-*.md)
shopt -u nullglob

if [ ${#skill_files[@]} -eq 0 ]; then
  echo "test-skills: no pct-*.md files found in ${COMMANDS_DIR}" >&2
  exit 1
fi

fail_count=0
pass_count=0

has_yaml_frontmatter() {
  # Returns 0 if the file starts with a YAML frontmatter block that contains
  # both name: and description: keys.
  local file="$1"
  awk '
    NR == 1 {
      if ($0 != "---") { exit 1 }
      next
    }
    $0 == "---" { exit (has_name && has_desc ? 0 : 1) }
    /^name:[[:space:]]*[^[:space:]]/ { has_name = 1 }
    /^description:[[:space:]]*[^[:space:]]/ { has_desc = 1 }
    END { exit 1 }
  ' "$file"
}

has_heading_metadata() {
  # Returns 0 if the file has an H1 of the form "# /<name> -- <description>"
  # OR an H1 naming the skill followed by a non-empty description paragraph.
  local file="$1"
  awk '
    /^#[[:space:]]+\/[A-Za-z0-9_-]+[[:space:]]+--[[:space:]]+.+/ {
      heading_with_desc = 1
      exit 0
    }
    /^#[[:space:]]+\/[A-Za-z0-9_-]+/ {
      saw_heading = 1
      next
    }
    saw_heading && NF > 0 {
      saw_body = 1
      exit 0
    }
    END { exit (heading_with_desc || (saw_heading && saw_body) ? 0 : 1) }
  ' "$file"
}

for file in "${skill_files[@]}"; do
  name="$(basename "$file")"
  if has_yaml_frontmatter "$file" || has_heading_metadata "$file"; then
    echo "ok   ${name}"
    pass_count=$((pass_count + 1))
  else
    echo "FAIL ${name} (missing name and/or description)" >&2
    fail_count=$((fail_count + 1))
  fi
done

echo
echo "test-skills: ${pass_count} passed, ${fail_count} failed"

if [ ${fail_count} -gt 0 ]; then
  exit 1
fi
