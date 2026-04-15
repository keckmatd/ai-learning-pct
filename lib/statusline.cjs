#!/usr/bin/env node
/**
 * Claude Code Statusline
 *
 * Displays: user │ branch +S~M?U ↑N │ model │ ⏱ duration │ ● ctx% │ $cost
 *
 * Claude Code pipes session JSON via stdin with model, context, cost data.
 * Git info gathered via a single shell call.
 *
 * Install: add to settings.json (global or project):
 *   "statusLine": {
 *     "type": "command",
 *     "command": "node ~/.claude-dotfiles/lib/statusline.cjs"
 *   }
 */

const fs = require('fs');
const { execSync } = require('child_process');

// ANSI colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[0;32m',
  yellow: '\x1b[0;33m',
  blue: '\x1b[0;34m',
  purple: '\x1b[0;35m',
  cyan: '\x1b[0;36m',
  red: '\x1b[1;31m',
  brightGreen: '\x1b[1;32m',
  brightYellow: '\x1b[1;33m',
  brightBlue: '\x1b[1;34m',
  brightCyan: '\x1b[1;36m',
};

// ─── Format detection & normalization ────────────────────────────
//
// Internal shape (Claude Code native):
//   data.model.display_name          string
//   data.cost.total_duration_ms      number (ms)
//   data.cost.total_cost_usd         number
//   data.context_window.used_percentage  number (0-100)
//
// Add new source formats below by detecting a unique field and mapping
// to the internal shape. Return the original object unchanged when it
// already matches the internal shape so Claude Code behavior is preserved.

function normalizeSession(data) {
  if (!data || typeof data !== 'object') return data;

  // Claude Code format: has data.model.display_name or data.cost.total_duration_ms
  if ((data.model && data.model.display_name) || (data.cost && data.cost.total_duration_ms !== undefined)) {
    return data;  // already in internal shape, pass through unchanged
  }

  // ── Copilot CLI format ───────────────────────────────────────────
  // NOTE: field names below are best-effort guesses from public Copilot CLI
  // output patterns. Refine once real data is observed.
  //
  // Expected Copilot CLI top-level fields (any subset may be present):
  //   modelId          string   e.g. "gpt-4o"
  //   elapsed          number   duration in milliseconds (or seconds — check)
  //   elapsedMs        number   duration in milliseconds (alternate key)
  //   tokenUsage       object   { promptTokens, completionTokens, totalTokens }
  //   totalCost        number   cost in USD
  //   contextPercent   number   0-100 (alternate: contextUsed / contextLimit)
  //   contextUsed      number   tokens used
  //   contextLimit     number   token limit
  if (data.modelId !== undefined || data.tokenUsage !== undefined || data.elapsed !== undefined || data.elapsedMs !== undefined) {
    const normalized = {};

    // Model
    const modelName = data.modelId || data.model_id || data.model;
    if (modelName && typeof modelName === 'string') {
      normalized.model = { display_name: modelName };
    }

    // Duration — Copilot CLI may use elapsed (ms or s) or elapsedMs
    const rawElapsed = data.elapsedMs ?? data.elapsed;
    if (rawElapsed !== undefined) {
      // Heuristic: if the value is suspiciously small (< 1000), treat as seconds
      const durationMs = rawElapsed < 1000 ? rawElapsed * 1000 : rawElapsed;
      normalized.cost = normalized.cost || {};
      normalized.cost.total_duration_ms = durationMs;
    }

    // Cost
    const rawCost = data.totalCost ?? data.total_cost ?? data.cost_usd;
    if (rawCost !== undefined) {
      normalized.cost = normalized.cost || {};
      normalized.cost.total_cost_usd = rawCost;
    }

    // Context window percentage
    let pct = data.contextPercent ?? data.context_percent;
    if (pct === undefined && data.contextUsed !== undefined && data.contextLimit) {
      pct = (data.contextUsed / data.contextLimit) * 100;
    }
    if (pct !== undefined) {
      normalized.context_window = { used_percentage: pct };
    }

    return normalized;
  }

  // Unrecognized format — warn and return as-is (best-effort)
  process.stderr.write('[statusline] Warning: unrecognized session JSON format; displaying with best-effort mapping\n');
  return data;
}

// ─── Stdin (Claude Code session data) ────────────────────────────

let _stdin = undefined;
function getStdin() {
  if (_stdin !== undefined) return _stdin;
  _stdin = null;
  try {
    if (process.stdin.isTTY) return null;
    const chunks = [];
    const buf = Buffer.alloc(4096);
    let n;
    try {
      while ((n = fs.readSync(0, buf, 0, buf.length, null)) > 0) {
        chunks.push(buf.slice(0, n));
      }
    } catch { /* EOF */ }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (raw && raw.startsWith('{')) _stdin = JSON.parse(raw);
  } catch { /* ignore */ }
  return _stdin;
}

// ─── Git info ────────────────────────────────────────────────────

function gitCmd(args) {
  try {
    return execSync('git ' + args, {
      encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch { return ''; }
}

function getGitInfo() {
  const result = { name: '', branch: '', staged: 0, modified: 0, untracked: 0, ahead: 0, behind: 0 };
  try {
    result.name = gitCmd('config user.name');
    result.branch = gitCmd('branch --show-current');

    const status = gitCmd('status --porcelain');
    if (status) {
      for (const line of status.split('\n')) {
        if (!line || line.length < 2) continue;
        const x = line[0], y = line[1];
        if (x === '?' && y === '?') { result.untracked++; continue; }
        if (x !== ' ' && x !== '?') result.staged++;
        if (y !== ' ' && y !== '?') result.modified++;
      }
    }

    const revList = gitCmd('rev-list --left-right --count HEAD...@{upstream}');
    if (revList) {
      const ab = revList.split(/\s+/);
      result.ahead = parseInt(ab[0]) || 0;
      result.behind = parseInt(ab[1]) || 0;
    }
  } catch { /* ignore */ }
  return result;
}

// ─── Render ──────────────────────────────────────────────────────

function render() {
  const git = getGitInfo();
  const data = normalizeSession(getStdin());
  const parts = [];

  // User name
  if (git.name) {
    parts.push(c.brightCyan + git.name + c.reset);
  }

  // Branch + status
  if (git.branch) {
    let branch = c.brightBlue + '\u23C7 ' + git.branch + c.reset;
    const changes = git.staged + git.modified + git.untracked;
    if (changes > 0) {
      let ind = '';
      if (git.staged > 0) ind += c.brightGreen + '+' + git.staged + c.reset;
      if (git.modified > 0) ind += c.brightYellow + '~' + git.modified + c.reset;
      if (git.untracked > 0) ind += c.dim + '?' + git.untracked + c.reset;
      branch += ' ' + ind;
    }
    if (git.ahead > 0) branch += ' ' + c.brightGreen + '\u2191' + git.ahead + c.reset;
    if (git.behind > 0) branch += ' ' + c.red + '\u2193' + git.behind + c.reset;
    parts.push(branch);
  }

  // Model name
  if (data && data.model && data.model.display_name) {
    parts.push(c.purple + data.model.display_name + c.reset);
  }

  // Duration
  if (data && data.cost && data.cost.total_duration_ms) {
    const ms = data.cost.total_duration_ms;
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const dur = mins > 0 ? mins + 'm' + secs + 's' : secs + 's';
    parts.push(c.cyan + '\u23F1 ' + dur + c.reset);
  }

  // Context %
  if (data && data.context_window && data.context_window.used_percentage > 0) {
    const pct = Math.floor(data.context_window.used_percentage);
    const col = pct >= 90 ? c.red : pct >= 70 ? c.brightYellow : c.brightGreen;
    parts.push(col + '\u25CF ' + pct + '% ctx' + c.reset);
  }

  // Cost
  if (data && data.cost && data.cost.total_cost_usd > 0) {
    parts.push(c.brightYellow + '$' + data.cost.total_cost_usd.toFixed(2) + c.reset);
  }

  const sep = '  ' + c.dim + '\u2502' + c.reset + '  ';
  console.log(parts.join(sep));
}

render();
