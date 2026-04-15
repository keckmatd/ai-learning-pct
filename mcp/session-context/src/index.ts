#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fg from "fast-glob";
import matter from "gray-matter";
import { readFileSync, existsSync, unlinkSync, statSync } from "fs";
import { resolve, basename, dirname, join } from "path";
import { homedir } from "os";
import { TapeEntry, TapeEntryType, TapeSource } from "./tape/types.js";
import { loadTapeConfig } from "./tape/config.js";
import { writeEntry, generateEntryId, resolveExpiry, loadActiveEntries, loadArchivedEntries, loadGlacierEntries, filterByScope, pruneExpired, budgetForContext } from "./tape/operations.js";

// Types
interface PlanSummary {
  path: string;
  title: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  nextActions: string[];
  lastModified: Date;
}

interface LastSession {
  number: number;
  date: string;
  state: string;
  commit: string | null;
  accomplishments: string[];
  issues: string | null;
}

interface SpiritSummary {
  title: string;
  phase: string;
  summary: string;
  path: string;
}

interface SpecSummary {
  path: string;
  title: string;
  description: string;
  date: string;
  topic: string;
}

interface DecisionRecord {
  decision: string;
  reason: string;
  date: string;
  context: string;
}

interface WikiPage {
  path: string;
  title: string;
  type: string;
  tags: string[];
  updated: string;
  matchReason: "project" | "machine";
}

interface ActiveContext {
  project: string;
  projectPath: string;
  spirit: SpiritSummary | null;
  activePlan: PlanSummary | null;
  lastSession: LastSession | null;
  recentSpecs: SpecSummary[];
  recentDecisions: DecisionRecord[];
  wikiPages: WikiPage[];
  tapeEntries: TapeEntry[];
  totalActiveEntries: number;
  tapeArchivedCount: number;
  sessionPrimer: string;
}

// Helpers
function findProjectRoot(startPath: string): string | null {
  let current = resolve(startPath);
  while (current !== dirname(current)) {
    if (existsSync(join(current, ".git")) || existsSync(join(current, "CLAUDE.md"))) {
      return current;
    }
    current = dirname(current);
  }
  return null;
}

export function extractTaskStats(content: string): { total: number; completed: number; inProgress: number; nextActions: string[] } {
  const lines = content.split("\n");
  let total = 0;
  let completed = 0;
  let inProgress = 0;
  const nextActions: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Checkbox patterns: - [ ], - [x], - [~], * [ ], etc.
    if (/^[-*]\s*\[[x✓]\]/i.test(trimmed)) {
      total++;
      completed++;
    } else if (/^[-*]\s*\[~\]/.test(trimmed)) {
      total++;
      inProgress++;
      // Extract in-progress task as next action
      const taskText = trimmed.replace(/^[-*]\s*\[~\]\s*/, "").trim();
      if (taskText && nextActions.length < 3) {
        nextActions.push(taskText);
      }
    } else if (/^[-*]\s*\[\s*\]/.test(trimmed)) {
      total++;
      // First incomplete task after in-progress ones
      if (nextActions.length < 3) {
        const taskText = trimmed.replace(/^[-*]\s*\[\s*\]\s*/, "").trim();
        if (taskText) nextActions.push(taskText);
      }
    }
  }

  return { total, completed, inProgress, nextActions };
}

export function extractTitle(content: string, filePath: string): string {
  // Try frontmatter first
  try {
    const { data } = matter(content);
    if (data.title) return data.title;
  } catch {
    // ignore
  }
  // Try first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  // Fallback to filename
  return basename(filePath, ".md").replace(/-/g, " ");
}

export function extractDecisions(content: string, fileDate?: string): DecisionRecord[] {
  const decisions: DecisionRecord[] = [];
  const lines = content.split("\n");

  // Look for decision patterns like "**Decision:**" or "## Decision" or "Decided:"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const decisionMatch = line.match(/(?:\*\*Decision[:\s]*\*\*|^##?\s*Decision[:\s]*|Decided:)\s*(.+)/i);
    if (decisionMatch) {
      const decision = decisionMatch[1].trim();
      // Look for reason in next few lines
      let reason = "";
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const reasonMatch = lines[j].match(/(?:\*\*(?:Reason|Why)[:\s]*\*\*|Reason:|Why:)\s*(.+)/i);
        if (reasonMatch) {
          reason = reasonMatch[1].trim();
          break;
        }
      }
      decisions.push({
        decision,
        reason,
        date: fileDate || new Date().toISOString().split("T")[0],
        context: basename(dirname(lines[0] || ""))
      });
    }
  }
  return decisions;
}

export function extractLastSession(content: string): LastSession | null {
  const lines = content.split("\n");

  // Find all session headers and get the last one
  // Supports both ### Session N and ## Session N formats
  let lastSessionStart = -1;
  let lastSessionNum = 0;
  let lastSessionDate = "";
  let headerLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,3})\s*Session\s+(\d+)\s*[-–—]\s*(\d{4}-\d{2}-\d{2})/i);
    if (match) {
      lastSessionStart = i;
      headerLevel = match[1].length;
      lastSessionNum = parseInt(match[2], 10);
      lastSessionDate = match[3];
    }
  }

  if (lastSessionStart === -1) return null;

  // Find the end of this session (next header at same level or higher, or end of file)
  let lastSessionEnd = lines.length;
  const headerPattern = new RegExp(`^#{1,${headerLevel}}\\s`);
  for (let i = lastSessionStart + 1; i < lines.length; i++) {
    if (headerPattern.test(lines[i]) && /Session\s+\d+/i.test(lines[i])) {
      lastSessionEnd = i;
      break;
    }
  }

  const sessionLines = lines.slice(lastSessionStart, lastSessionEnd);

  // Extract fields
  let state = "";
  let commit: string | null = null;
  let issues: string | null = null;
  const accomplishments: string[] = [];

  for (const line of sessionLines) {
    const trimmed = line.trim();

    // State line (various formats) - strip any remaining bold markers from value
    const stateMatch = trimmed.match(/^[-*]?\s*\**State\**[:\s]+(.+)/i);
    if (stateMatch) {
      state = stateMatch[1].replace(/^\*+\s*/, "").replace(/\s*\*+$/, "").trim();
      continue;
    }

    // Commit line
    const commitMatch = trimmed.match(/^[-*]?\s*\**Commit\**[:\s]+([a-f0-9]+)/i);
    if (commitMatch) {
      commit = commitMatch[1];
      continue;
    }

    // Issues line - strip any remaining bold markers from value
    const issuesMatch = trimmed.match(/^[-*]?\s*\**Issues\**[:\s]+(.+)/i);
    if (issuesMatch) {
      issues = issuesMatch[1].replace(/^\*+\s*/, "").replace(/\s*\*+$/, "").trim();
      continue;
    }

    // Accomplishments (bullet points that aren't special fields)
    if (/^[-*]\s+(?!\**(State|Commit|Issues|Files)\**)/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s+/, "").trim();
      if (text && !text.startsWith("[") && accomplishments.length < 5) {
        accomplishments.push(text);
      }
    }
  }

  return {
    number: lastSessionNum,
    date: lastSessionDate,
    state,
    commit,
    accomplishments,
    issues
  };
}

/**
 * Synthesize a LastSession object from tape entries.
 * Uses checkpoint entries for state/commit, milestone entries for accomplishments,
 * and decision entries for key decisions.
 * Returns the session and the IDs of entries consumed (for dedup in tape section).
 */
export function synthesizeLastSession(entries: TapeEntry[]): { session: LastSession | null; consumedIds: Set<string> } {
  const consumedIds = new Set<string>();
  if (entries.length === 0) {
    return { session: null, consumedIds };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter to recent entries (within 7 days)
  const recentEntries = entries.filter(e => e.timestamp >= sevenDaysAgo);

  // Find most recent checkpoint for state/commit
  const checkpoints = recentEntries
    .filter(e => e.type === TapeEntryType.CHECKPOINT)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const lastCheckpoint = checkpoints[0];
  if (lastCheckpoint) consumedIds.add(lastCheckpoint.id);

  // Find milestones for accomplishments
  const milestones = recentEntries
    .filter(e => e.type === TapeEntryType.MILESTONE)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);
  milestones.forEach(m => consumedIds.add(m.id));

  // Find decisions
  const decisions = recentEntries
    .filter(e => e.type === TapeEntryType.DECISION)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3);
  decisions.forEach(d => consumedIds.add(d.id));

  // If no checkpoint, use most recent entry's date
  const referenceEntry = lastCheckpoint || entries[0];
  const date = referenceEntry.timestamp.toISOString().split("T")[0];

  // Parse state and commit from checkpoint content
  // Expected format: "State message. Commit: abc123" or just "State message"
  let state = "";
  let commit: string | null = null;

  if (lastCheckpoint) {
    const content = lastCheckpoint.content;
    const commitMatch = content.match(/\bCommit:\s*([a-f0-9]{7,40})\b/i);
    if (commitMatch) {
      commit = commitMatch[1];
      state = content.replace(/\s*Commit:\s*[a-f0-9]{7,40}/i, "").trim();
    } else {
      state = content;
    }
  }

  // Build accomplishments from milestones
  const accomplishments = milestones.map(m => m.content);

  // Build issues summary from decisions (if any mention issues)
  const issueDecisions = decisions.filter(d =>
    d.content.toLowerCase().includes("issue") ||
    d.content.toLowerCase().includes("#")
  );
  const issues = issueDecisions.length > 0
    ? issueDecisions.map(d => d.content).join("; ")
    : null;

  // Use entry count as session "number" (not ideal but gives some continuity)
  const sessionNumber = checkpoints.length || 1;

  return {
    session: {
      number: sessionNumber,
      date,
      state,
      commit,
      accomplishments,
      issues
    },
    consumedIds
  };
}

function extractSpirit(projectPath: string): SpiritSummary | null {
  const spiritPath = join(projectPath, "harness", "spirit.md");
  if (!existsSync(spiritPath)) return null;

  const content = readFileSync(spiritPath, "utf-8");
  const lines = content.split("\n");

  // Extract title (first H1)
  let title = "";
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) title = h1Match[1].trim();

  // Extract current phase
  let phase = "";
  let inPhaseSection = false;
  for (const line of lines) {
    if (/^##\s*Current\s*Phase/i.test(line)) {
      inPhaseSection = true;
      continue;
    }
    if (inPhaseSection) {
      if (/^##\s/.test(line)) break; // Next section
      const phaseMatch = line.match(/^\*\*(.+?)\*\*/);
      if (phaseMatch) {
        phase = phaseMatch[1].trim();
        break;
      }
      // Also try non-bold format
      const plainMatch = line.trim();
      if (plainMatch && !plainMatch.startsWith("#") && !plainMatch.startsWith(">")) {
        phase = plainMatch;
        break;
      }
    }
  }

  // Extract summary (blockquote after title, if any)
  let summary = "";
  const blockquoteMatch = content.match(/^>\s*(.+)$/m);
  if (blockquoteMatch) {
    summary = blockquoteMatch[1].trim();
  }

  return {
    title,
    phase,
    summary,
    path: spiritPath
  };
}

async function findPlanFile(projectPath: string): Promise<string | null> {
  const candidates = [
    "harness/plan.md",
    "harness/progress.md",
    ".claude/plan.md",
    "docs/plan.md",
    "PLAN.md"
  ];

  for (const candidate of candidates) {
    const fullPath = join(projectPath, candidate);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  // Glob for any plan.md
  const found = await fg(["**/plan.md", "**/progress.md"], {
    cwd: projectPath,
    ignore: ["node_modules/**", ".git/**", "dist/**"],
    absolute: true,
    onlyFiles: true
  });

  return found[0] || null;
}

async function findSpecs(projectPath: string, limit = 5): Promise<SpecSummary[]> {
  const patterns = [
    "docs/superpowers/specs/*.md",
    "docs/specs/*.md",
    "specs/*.md",
    ".claude/specs/*.md"
  ];

  const files = await fg(patterns, {
    cwd: projectPath,
    ignore: ["node_modules/**"],
    absolute: true,
    onlyFiles: true,
    stats: true
  });

  // Sort by mtime descending
  const sorted = files
    .filter(f => typeof f !== "string")
    .sort((a, b) => (b.stats?.mtimeMs || 0) - (a.stats?.mtimeMs || 0))
    .slice(0, limit);

  return sorted.map(f => {
    const content = readFileSync(f.path, "utf-8");
    const { data } = matter(content);
    const filename = basename(f.path, ".md");
    // Extract date and topic from filename like "2026-03-25-scaffold-debug-design.md"
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)/);

    return {
      path: f.path,
      title: data.title || extractTitle(content, f.path),
      description: data.description || content.slice(0, 200).split("\n").slice(0, 3).join(" ").trim() + "...",
      date: dateMatch?.[1] || f.stats?.mtime?.toISOString().split("T")[0] || "unknown",
      topic: dateMatch?.[2]?.replace(/-design$/, "").replace(/-/g, " ") || filename
    };
  });
}

function resolveWikiVaultPath(): string | null {
  const configPaths = [
    join(homedir(), ".claude", "wiki.yaml"),
  ];
  for (const p of configPaths) {
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      const match = content.match(/vault_path:\s*(.+)/);
      if (match) {
        return resolve(match[1].trim().replace(/^~/, homedir()));
      }
    }
  }
  // Default
  const defaultPath = join(homedir(), "brain");
  return existsSync(defaultPath) ? defaultPath : null;
}

function readMachineId(): string | null {
  const idPath = join(homedir(), ".machine-id");
  if (existsSync(idPath)) {
    return readFileSync(idPath, "utf-8").trim();
  }
  return null;
}

function resolveProjectKey(projectPath: string, machineId: string | null): string | null {
  if (!machineId) return null;

  // Try common registry locations
  const registryPaths = [
    join(homedir(), "projects", "claude-dotfiles", "registry", "machines.yaml"),
    join(homedir(), "code", "claude-dotfiles", "registry", "machines.yaml"),
  ];

  for (const regPath of registryPaths) {
    if (!existsSync(regPath)) continue;
    const content = readFileSync(regPath, "utf-8");

    // Simple YAML parsing: find the machine section, then match project paths
    // Look for path entries that match our projectPath
    const escapedPath = projectPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pathMatch = content.match(new RegExp(`(\\S+):[^]*?path:\\s*${escapedPath}`, "m"));
    if (pathMatch) return pathMatch[1];

    // Also try matching just the basename
    const projectName = basename(projectPath);
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^\s+path:/) && line.includes(projectPath)) {
        // Walk backwards to find the project key
        for (let j = i - 1; j >= 0; j--) {
          const keyMatch = lines[j].match(/^\s{4}(\S+):/);
          if (keyMatch) return keyMatch[1];
        }
      }
    }
  }
  return null;
}

async function findWikiPages(projectKey: string | null, machineId: string | null): Promise<WikiPage[]> {
  const vaultPath = resolveWikiVaultPath();
  if (!vaultPath) return [];

  const wikiDir = join(vaultPath, "wiki");
  if (!existsSync(wikiDir)) return [];

  const pages: WikiPage[] = [];
  const seen = new Set<string>();

  const mdFiles = await fg("**/*.md", { cwd: wikiDir, absolute: true, ignore: ["index.md", "log.md"] });

  for (const filePath of mdFiles) {
    const content = readFileSync(filePath, "utf-8");
    let matchReason: "project" | "machine" | null = null;

    try {
      const { data } = matter(content);

      // Check project match
      if (projectKey && Array.isArray(data.projects) && data.projects.includes(projectKey)) {
        matchReason = "project";
      }

      // Check machine match
      if (!matchReason && machineId && data.machine === machineId) {
        matchReason = "machine";
      }

      if (!matchReason || seen.has(filePath)) continue;
      seen.add(filePath);

      pages.push({
        path: filePath,
        title: data.title || basename(filePath, ".md"),
        type: data.type || "unknown",
        tags: Array.isArray(data.tags) ? data.tags : [],
        updated: data.updated instanceof Date ? data.updated.toISOString().split("T")[0] : (data.updated || "unknown"),
        matchReason,
      });
    } catch {
      // Skip files with invalid frontmatter
    }
  }

  // Sort: project matches first, then by updated date (newest first)
  pages.sort((a, b) => {
    if (a.matchReason !== b.matchReason) {
      return a.matchReason === "project" ? -1 : 1;
    }
    return b.updated.localeCompare(a.updated);
  });

  return pages;
}

function generateSessionPrimer(ctx: ActiveContext): string {
  const lines: string[] = [];

  lines.push(`## Session Context for ${ctx.project}`);
  lines.push("");

  // Spirit - the "why" and current focus
  if (ctx.spirit) {
    lines.push(`### Spirit: ${ctx.spirit.title}`);
    if (ctx.spirit.summary) {
      lines.push(`> ${ctx.spirit.summary}`);
    }
    if (ctx.spirit.phase) {
      lines.push(`**Phase:** ${ctx.spirit.phase}`);
    }
    lines.push("");
  }

  // Last session handoff - critical for continuity
  if (ctx.lastSession) {
    const ls = ctx.lastSession;
    lines.push(`### Last Session (#${ls.number}, ${ls.date})`);
    if (ls.state) {
      lines.push(`**State:** ${ls.state}`);
    }
    if (ls.accomplishments.length > 0) {
      lines.push("**Did:**");
      ls.accomplishments.slice(0, 3).forEach(a => lines.push(`- ${a}`));
    }
    if (ls.commit) {
      lines.push(`**Commit:** ${ls.commit}`);
    }
    if (ls.issues) {
      lines.push(`**Issues:** ${ls.issues}`);
    }
    lines.push("");
  }

  // Active plan progress
  if (ctx.activePlan) {
    const plan = ctx.activePlan;
    const pct = plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : 0;
    lines.push(`### Active Plan: ${plan.title}`);
    lines.push(`Progress: ${plan.completedTasks}/${plan.totalTasks} tasks (${pct}%)`);
    if (plan.inProgressTasks > 0) {
      lines.push(`In Progress: ${plan.inProgressTasks} task(s)`);
    }
    if (plan.nextActions.length > 0) {
      lines.push("");
      lines.push("**Next Actions:**");
      plan.nextActions.forEach(a => lines.push(`- ${a}`));
    }
    lines.push("");
    lines.push(`_Plan file: ${plan.path}_`);
    lines.push("");
  }

  // Recent specs (condensed)
  if (ctx.recentSpecs.length > 0) {
    lines.push("### Recent Specs");
    ctx.recentSpecs.slice(0, 3).forEach(spec => {
      lines.push(`- **${spec.topic}** (${spec.date})`);
    });
    lines.push("");
  }

  // Recent decisions
  if (ctx.recentDecisions.length > 0) {
    lines.push("### Recent Decisions");
    ctx.recentDecisions.slice(0, 3).forEach(d => {
      lines.push(`- ${d.decision}${d.reason ? ` — _${d.reason}_` : ""}`);
    });
    lines.push("");
  }

  // Session tape (budgeted context from tape entries)
  if (ctx.tapeEntries.length > 0) {
    const totalActive = ctx.totalActiveEntries ?? ctx.tapeEntries.length;
    const shown = ctx.tapeEntries.length;
    const scopes = [...new Set(ctx.tapeEntries.flatMap(e => e.scope))];

    const headerParts = [`${shown} entries`];
    if (totalActive > shown) {
      headerParts.push(`${totalActive - shown} windowed out`);
    }
    headerParts.push(`scoped to: ${scopes.join(", ")}`);

    lines.push(`### Session Tape (${headerParts.join(", ")})`);
    if (ctx.tapeArchivedCount > 0) {
      lines.push(`_Archived ${ctx.tapeArchivedCount} expired entries on load._`);
    }
    lines.push("");

    for (const entry of ctx.tapeEntries) {
      const expiryStr = entry.expires
        ? ` (expires: ${entry.expires.toISOString().split("T")[0]})`
        : "";
      lines.push(`- [${entry.type}] ${entry.content}${expiryStr}`);
    }
    lines.push("");
  }

  // Wiki context (project-scoped + machine-scoped pages)
  if (ctx.wikiPages.length > 0) {
    const projectPages = ctx.wikiPages.filter(p => p.matchReason === "project");
    const machinePages = ctx.wikiPages.filter(p => p.matchReason === "machine");

    lines.push(`### Wiki (${ctx.wikiPages.length} pages)`);

    if (projectPages.length > 0) {
      projectPages.slice(0, 5).forEach(p => {
        lines.push(`- [[${p.title}]] (${p.type}, updated ${p.updated})`);
      });
    }

    if (machinePages.length > 0) {
      if (projectPages.length > 0) lines.push("");
      lines.push("**Infrastructure:**");
      machinePages.slice(0, 5).forEach(p => {
        lines.push(`- [[${p.title}]] (${p.type}, updated ${p.updated})`);
      });
    }

    lines.push("");
    lines.push("_Use /wiki-search to query._");
    lines.push("");
  }

  return lines.join("\n");
}

// MCP Server
const server = new McpServer({
  name: "session-context",
  version: "1.0.0"
});

// Tool: get_active_context
server.tool(
  "get_active_context",
  "Get the active context for the current project including plan progress, recent specs, decisions, and session tape entries. Prunes expired tape entries on load. Returns a session primer optimized for context injection.",
  {
    projectPath: z.string().optional().describe("Project path (defaults to cwd)")
  },
  async ({ projectPath }) => {
    const cwd = projectPath || process.cwd();
    const root = findProjectRoot(cwd) || cwd;
    const projectName = basename(root);

    // Extract spirit (the "why")
    const spirit = extractSpirit(root);

    // Find and parse plan
    let activePlan: PlanSummary | null = null;
    const planPath = await findPlanFile(root);
    if (planPath) {
      const content = readFileSync(planPath, "utf-8");
      const stats = extractTaskStats(content);
      activePlan = {
        path: planPath,
        title: extractTitle(content, planPath),
        totalTasks: stats.total,
        completedTasks: stats.completed,
        inProgressTasks: stats.inProgress,
        nextActions: stats.nextActions,
        lastModified: statSync(planPath).mtime
      };
    }

    // Load tape entries and prune expired
    const config = loadTapeConfig(root);
    const allEntries = await loadActiveEntries(root);
    const { active: activeEntries, archived: archivedCount } = await pruneExpired(root, allEntries, config);
    const totalActiveEntries = activeEntries.length;

    // Synthesize last session from tape entries, fall back to progress.md
    const { session: lastSessionFromTape, consumedIds } = synthesizeLastSession(activeEntries);
    let lastSession: LastSession | null = lastSessionFromTape;

    // Fallback to progress.md if no tape entries (migration path)
    if (!lastSession) {
      const progressPath = join(root, "harness", "progress.md");
      if (existsSync(progressPath)) {
        const progressContent = readFileSync(progressPath, "utf-8");
        lastSession = extractLastSession(progressContent);
      }
    }

    // Budget tape entries: session-depth windowing + per-type caps + dedup
    const tapeEntries = budgetForContext(activeEntries, config.contextBudget, consumedIds);

    // Find recent specs
    const recentSpecs = await findSpecs(root);

    // Extract decisions from spirit and plan
    const recentDecisions: DecisionRecord[] = [];
    if (spirit) {
      const spiritContent = readFileSync(spirit.path, "utf-8");
      const spiritStats = statSync(spirit.path);
      const spiritDate = spiritStats.mtime.toISOString().split("T")[0];
      recentDecisions.push(...extractDecisions(spiritContent, spiritDate));
    }
    if (planPath) {
      const content = readFileSync(planPath, "utf-8");
      const planStats = statSync(planPath);
      const planDate = planStats.mtime.toISOString().split("T")[0];
      recentDecisions.push(...extractDecisions(content, planDate));
    }

    // Discover wiki pages (project-scoped + machine-scoped)
    const machineId = readMachineId();
    const projectKey = resolveProjectKey(root, machineId);
    const wikiPages = await findWikiPages(projectKey, machineId);

    const ctx: ActiveContext = {
      project: projectName,
      projectPath: root,
      spirit,
      activePlan,
      lastSession,
      recentSpecs,
      recentDecisions,
      wikiPages,
      tapeEntries,
      totalActiveEntries,
      tapeArchivedCount: archivedCount,
      sessionPrimer: ""
    };

    ctx.sessionPrimer = generateSessionPrimer(ctx);

    return {
      content: [
        {
          type: "text" as const,
          text: ctx.sessionPrimer
        }
      ]
    };
  }
);

// Tool: get_plan_details
server.tool(
  "get_plan_details",
  "Get full details of the active plan including all tasks and their status",
  {
    projectPath: z.string().optional().describe("Project path (defaults to cwd)")
  },
  async ({ projectPath }) => {
    const cwd = projectPath || process.cwd();
    const root = findProjectRoot(cwd) || cwd;

    const planPath = await findPlanFile(root);
    if (!planPath) {
      return {
        content: [{ type: "text" as const, text: "No plan file found in project." }]
      };
    }

    const content = readFileSync(planPath, "utf-8");
    const stats = extractTaskStats(content);

    return {
      content: [
        {
          type: "text" as const,
          text: `# Plan: ${extractTitle(content, planPath)}\n\n` +
            `**File:** ${planPath}\n` +
            `**Progress:** ${stats.completed}/${stats.total} (${stats.inProgress} in progress)\n\n` +
            `---\n\n${content}`
        }
      ]
    };
  }
);

// Tool: list_specs
server.tool(
  "list_specs",
  "List recent design specs and their summaries",
  {
    projectPath: z.string().optional().describe("Project path (defaults to cwd)"),
    limit: z.number().optional().default(10).describe("Max specs to return")
  },
  async ({ projectPath, limit }) => {
    const cwd = projectPath || process.cwd();
    const root = findProjectRoot(cwd) || cwd;

    const specs = await findSpecs(root, limit || 10);

    if (specs.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No specs found in project." }]
      };
    }

    const lines = ["# Recent Specs\n"];
    specs.forEach(spec => {
      lines.push(`## ${spec.topic} (${spec.date})`);
      lines.push(`**Title:** ${spec.title}`);
      lines.push(`**Path:** ${spec.path}`);
      lines.push(`${spec.description}`);
      lines.push("");
    });

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }]
    };
  }
);

// Tool: find_plan_file
server.tool(
  "find_plan_file",
  "Find the path to the active plan file in a project",
  {
    projectPath: z.string().optional().describe("Project path (defaults to cwd)")
  },
  async ({ projectPath }) => {
    const cwd = projectPath || process.cwd();
    const root = findProjectRoot(cwd) || cwd;

    const planPath = await findPlanFile(root);

    return {
      content: [
        {
          type: "text" as const,
          text: planPath
            ? `Plan file: ${planPath}`
            : "No plan file found. Checked: harness/plan.md, harness/progress.md, .claude/plan.md, docs/plan.md, PLAN.md"
        }
      ]
    };
  }
);

// Tool: tape_search
server.tool(
  "tape_search",
  "Search tape entries by content substring across active, archived, and glacier tiers",
  {
    query: z.string().min(1).describe("Substring to search for in entry content (case-insensitive)"),
    scope: z.array(z.string()).optional().describe("Filter by scope patterns (e.g., ['global', 'issue/42'])"),
    includeArchived: z.boolean().optional().default(false).describe("Include archived entries in search"),
    includeGlacier: z.boolean().optional().default(false).describe("Include glacier entries in search"),
    projectPath: z.string().optional().describe("Project path (defaults to cwd)")
  },
  async ({ query, scope, includeArchived, includeGlacier, projectPath }) => {
    const cwd = projectPath || process.cwd();
    const root = findProjectRoot(cwd) || cwd;

    // Load entries from requested tiers
    let allEntries = await loadActiveEntries(root);

    if (includeArchived) {
      const archivedEntries = await loadArchivedEntries(root);
      allEntries = [...allEntries, ...archivedEntries];
    }

    if (includeGlacier) {
      const glacierEntries = await loadGlacierEntries(root);
      allEntries = [...allEntries, ...glacierEntries];
    }

    // Filter by scope if provided
    if (scope && scope.length > 0) {
      allEntries = filterByScope(allEntries, scope);
    }

    // Filter by query (case-insensitive substring match)
    const queryLower = query.toLowerCase();
    const matchedEntries = allEntries.filter(entry =>
      entry.content.toLowerCase().includes(queryLower)
    );

    // Format results
    if (matchedEntries.length === 0) {
      return {
        content: [{
          type: "text" as const,
          text: `No tape entries found matching "${query}"`
        }]
      };
    }

    const lines: string[] = [];
    lines.push(`## Tape Search Results (${matchedEntries.length} entries)\n`);

    for (const entry of matchedEntries) {
      const expiresStr = entry.expires
        ? entry.expires.toISOString().split("T")[0]
        : "never";

      lines.push(`- [${entry.type}] **${entry.id}** (expires: ${expiresStr})`);
      lines.push(`  > ${entry.content}`);
      lines.push(`  Scope: ${entry.scope.join(", ")}`);
      lines.push("");
    }

    return {
      content: [{
        type: "text" as const,
        text: lines.join("\n")
      }]
    };
  }
);

// Tool: tape_append
server.tool(
  "tape_append",
  "Append a new entry to the tape log. The tape is an append-only log of learnings, decisions, and corrections that persist across sessions.",
  {
    type: z.enum(["discovery", "decision", "correction", "constraint", "checkpoint", "milestone"])
      .describe("Type of entry: discovery (learned something new), decision (made a choice), correction (fixed a mistake), constraint (rule to follow), checkpoint (progress marker), milestone (significant achievement)"),
    scope: z.array(z.string()).min(1)
      .describe("Scope paths this entry applies to, e.g., ['global'], ['issue/42', 'task/wizard']"),
    content: z.string().min(1)
      .describe("The actual content/learning/decision to record"),
    expires: z.string().optional()
      .describe("Expiration policy: 'never', '+7d', '+2w', '+3m', '+1y', or ISO date string. If not provided, uses default TTL for the entry type."),
    projectPath: z.string().optional()
      .describe("Project path (defaults to cwd)")
  },
  async ({ type, scope, content, expires, projectPath }) => {
    try {
      const cwd = projectPath || process.cwd();
      const root = findProjectRoot(cwd) || cwd;

      // Auto-inject project scope if not already present
      const enrichedScope = [...scope];
      const hasProjectScope = enrichedScope.some(s => s.startsWith("project/"));
      if (!hasProjectScope) {
        const machineId = readMachineId();
        const projectKey = resolveProjectKey(root, machineId) || basename(root);
        if (projectKey) {
          enrichedScope.push(`project/${projectKey}`);
        }
      }

      // Load tape config
      const config = loadTapeConfig(root);

      // Generate entry ID
      const entryId = await generateEntryId(root);

      // Parse type to TapeEntryType enum
      const tapeType = type as TapeEntryType;

      // Resolve expiry date
      const expiryDate = resolveExpiry(tapeType, expires || null, config);

      // Create tape entry
      const entry = {
        id: entryId,
        timestamp: new Date(),
        type: tapeType,
        scope: enrichedScope,
        content,
        source: TapeSource.AGENT,
        expires: expiryDate
      };

      // Write entry to disk
      await writeEntry(entry, root);

      // Format expiry for response
      const expiryInfo = expiryDate
        ? `Expires: ${expiryDate.toISOString().split('T')[0]}`
        : "Never expires";

      return {
        content: [
          {
            type: "text" as const,
            text: `Tape entry created successfully!\n\nID: ${entryId}\nType: ${type}\nScope: ${scope.join(", ")}\n${expiryInfo}\n\nContent:\n${content}`
          }
        ]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to create tape entry: ${errorMsg}`
          }
        ],
        isError: true
      };
    }
  }
);

// Tool: tape_renew
server.tool(
  "tape_renew",
  "Renew a tape entry by updating its expiration date. Can restore expired entries from the archive.",
  {
    entryId: z.string().regex(/^tape-\d{8}-\d{3}$/)
      .describe("The tape entry ID to renew (e.g., 'tape-20260325-001')"),
    ttl: z.string()
      .describe("New TTL: 'never', '+7d', '+2w', '+3m', '+1y', or ISO date string"),
    projectPath: z.string().optional()
      .describe("Project path (defaults to cwd)")
  },
  async ({ entryId, ttl, projectPath }) => {
    try {
      const cwd = projectPath || process.cwd();
      const root = findProjectRoot(cwd) || cwd;

      // Load tape config
      const config = loadTapeConfig(root);

      // Search for entry in active entries first
      let activeEntries = await loadActiveEntries(root);
      let entry = activeEntries.find(e => e.id === entryId);
      let wasArchived = false;

      // If not found in active, search archived entries
      if (!entry) {
        const archivedEntries = await loadArchivedEntries(root);
        entry = archivedEntries.find(e => e.id === entryId);
        wasArchived = true;
      }

      // If still not found, return error
      if (!entry) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Tape entry not found: ${entryId}\n\nSearched in both active and archived entries.`
            }
          ],
          isError: true
        };
      }

      // Resolve new expiry date
      const newExpiry = resolveExpiry(entry.type, ttl, config);

      // Update the entry's expiry
      entry.expires = newExpiry;

      // If entry was archived, remove from archive first
      if (wasArchived) {
        const archivePath = join(root, ".claude", "tape", "archive", `${entryId}.yaml`);
        if (existsSync(archivePath)) {
          unlinkSync(archivePath);
        }
      }

      // Write the updated entry to active tape
      await writeEntry(entry, root);

      // Format response
      const expiryInfo = newExpiry
        ? `New expiration: ${newExpiry.toISOString().split('T')[0]}`
        : "Never expires";

      const restoredMsg = wasArchived ? "\n(Entry restored from archive)" : "";

      return {
        content: [
          {
            type: "text" as const,
            text: `Tape entry renewed successfully!${restoredMsg}\n\nID: ${entryId}\nType: ${entry.type}\n${expiryInfo}\n\nContent:\n${entry.content}`
          }
        ]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to renew tape entry: ${errorMsg}`
          }
        ],
        isError: true
      };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Session Context MCP server running on stdio");
}

main().catch(console.error);
