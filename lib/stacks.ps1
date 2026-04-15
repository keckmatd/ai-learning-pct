#
# Shared stack selection helper (PowerShell)
# Dot-source this file — do not execute directly.
#
# Usage:
#   . lib/stacks.ps1
#   $stacks = Get-EnabledStacks
#   if (Test-StackEnabled "go") { Install-Go }
#

$script:ValidStacks = @("flutter", "dotnet", "go", "java", "angular", "python", "typescript", "expo", "shell")
$script:EnabledStacks = @()

function Get-EnabledStacks {
    $script:EnabledStacks = @()

    # 1. Try dotfiles.env
    $scriptDir = Split-Path -Parent $PSScriptRoot
    $candidates = @(
        (Join-Path $scriptDir "dotfiles.env"),
        (Join-Path ($env:CLAUDE_DOTFILES_DIR ?? "$HOME\.claude-dotfiles") "dotfiles.env"),
        (Join-Path (Get-Location) "dotfiles.env")
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            $line = Get-Content $candidate | Where-Object { $_ -match '^\s*STACKS=' } | Select-Object -Last 1
            if ($line) {
                $raw = ($line -replace '^\s*STACKS=', '').Trim().Trim('"').Trim("'")
                if ($raw) {
                    $script:EnabledStacks = $raw -split '\s+' | Where-Object { $_ }
                    return $script:EnabledStacks
                }
            }
        }
    }

    # 2. Empty = all stacks enabled
    $script:EnabledStacks = @()
    return $script:EnabledStacks
}

function Test-StackEnabled {
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )

    # Empty list = all enabled
    if ($script:EnabledStacks.Count -eq 0) {
        return $true
    }

    return $Name -in $script:EnabledStacks
}

function Get-StacksSummary {
    if ($script:EnabledStacks.Count -eq 0) {
        return "all (no STACKS filter set)"
    }
    return ($script:EnabledStacks -join " ")
}
