import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from "fs";
import { join, basename } from "path";
import yaml from "js-yaml";
import fg from "fast-glob";
import { TapeEntry, TapeEntryType, TapeSource, isExpired, entryMatchesScope, generateTapeId as generateTapeIdUtil } from "./types.js";
import { TapeConfig, ContextBudget } from "./config.js";

/**
 * Parse a YAML file into a TapeEntry, converting date strings to Date objects
 */
function parseTapeEntry(filePath: string): TapeEntry {
  const content = readFileSync(filePath, "utf-8");
  const raw = yaml.load(content) as any;

  return {
    ...raw,
    timestamp: new Date(raw.timestamp),
    expires: raw.expires ? new Date(raw.expires) : null,
  };
}

/**
 * Serialize a TapeEntry to YAML format
 */
function serializeTapeEntry(entry: TapeEntry): string {
  const serializable = {
    ...entry,
    timestamp: entry.timestamp.toISOString(),
    expires: entry.expires ? entry.expires.toISOString() : null,
  };

  return yaml.dump(serializable, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
}

/**
 * Load active tape entries from .claude/tape/*.yaml (excludes archive/ and glacier/)
 * Returns entries sorted by timestamp descending (newest first)
 */
export async function loadActiveEntries(projectPath: string): Promise<TapeEntry[]> {
  const tapeDir = join(projectPath, ".claude", "tape");

  if (!existsSync(tapeDir)) {
    return [];
  }

  // Glob for YAML files, excluding archive and glacier subdirectories
  const files = await fg("*.yaml", {
    cwd: tapeDir,
    absolute: true,
    onlyFiles: true,
  });

  const entries = files.map(file => parseTapeEntry(file));

  // Sort by timestamp descending (newest first)
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Load archived tape entries from .claude/tape/archive/*.yaml
 * Returns entries sorted by timestamp descending (newest first)
 */
export async function loadArchivedEntries(projectPath: string): Promise<TapeEntry[]> {
  const archiveDir = join(projectPath, ".claude", "tape", "archive");

  if (!existsSync(archiveDir)) {
    return [];
  }

  const files = await fg("*.yaml", {
    cwd: archiveDir,
    absolute: true,
    onlyFiles: true,
  });

  const entries = files.map(file => parseTapeEntry(file));

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Load glacier tape entries from .claude/tape/glacier/*.yaml
 * Returns entries sorted by timestamp descending (newest first)
 */
export async function loadGlacierEntries(projectPath: string): Promise<TapeEntry[]> {
  const glacierDir = join(projectPath, ".claude", "tape", "glacier");

  if (!existsSync(glacierDir)) {
    return [];
  }

  const files = await fg("*.yaml", {
    cwd: glacierDir,
    absolute: true,
    onlyFiles: true,
  });

  const entries = files.map(file => parseTapeEntry(file));

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Prune expired entries by moving them to archive
 * Returns remaining active entries and count of archived entries
 */
export async function pruneExpired(
  projectPath: string,
  entries: TapeEntry[],
  config: TapeConfig
): Promise<{ active: TapeEntry[]; archived: number }> {
  const active: TapeEntry[] = [];
  let archived = 0;

  for (const entry of entries) {
    if (isExpired(entry)) {
      await moveToArchive(entry, projectPath);
      archived++;
    } else {
      active.push(entry);
    }
  }

  return { active, archived };
}

/**
 * Move a tape entry to the archive directory
 */
export async function moveToArchive(entry: TapeEntry, projectPath: string): Promise<void> {
  const tapeDir = join(projectPath, ".claude", "tape");
  const archiveDir = join(tapeDir, "archive");

  // Create archive directory if it doesn't exist
  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true });
  }

  const sourcePath = join(tapeDir, `${entry.id}.yaml`);
  const targetPath = join(archiveDir, `${entry.id}.yaml`);

  // Write to archive
  writeFileSync(targetPath, serializeTapeEntry(entry), "utf-8");

  // Delete from active tape
  if (existsSync(sourcePath)) {
    unlinkSync(sourcePath);
  }
}

/**
 * Move old archived entries to glacier storage
 * Returns count of entries moved to glacier
 */
export async function moveToGlacier(projectPath: string, config: TapeConfig): Promise<number> {
  const archiveDir = join(projectPath, ".claude", "tape", "archive");
  const glacierDir = join(projectPath, ".claude", "tape", "glacier");

  if (!existsSync(archiveDir)) {
    return 0;
  }

  // Create glacier directory if it doesn't exist
  if (!existsSync(glacierDir)) {
    mkdirSync(glacierDir, { recursive: true });
  }

  const archivedEntries = await loadArchivedEntries(projectPath);
  const now = new Date();
  const thresholdMs = config.glacierThresholdDays * 24 * 60 * 60 * 1000;
  let movedCount = 0;

  for (const entry of archivedEntries) {
    const ageMs = now.getTime() - entry.timestamp.getTime();

    if (ageMs >= thresholdMs) {
      const sourcePath = join(archiveDir, `${entry.id}.yaml`);
      const targetPath = join(glacierDir, `${entry.id}.yaml`);

      // Write to glacier
      writeFileSync(targetPath, serializeTapeEntry(entry), "utf-8");

      // Delete from archive
      if (existsSync(sourcePath)) {
        unlinkSync(sourcePath);
      }

      movedCount++;
    }
  }

  return movedCount;
}

/**
 * Filter entries by scope patterns
 * Always includes entries with "global" scope
 */
export function filterByScope(entries: TapeEntry[], scopes: string[]): TapeEntry[] {
  if (!scopes || scopes.length === 0) {
    return entries;
  }

  return entries.filter(entry => {
    // Always include global entries
    if (entry.scope.includes("global")) {
      return true;
    }

    // Check if entry matches any requested scope
    return entryMatchesScope(entry, scopes);
  });
}

/**
 * Write a tape entry to disk
 */
export async function writeEntry(entry: TapeEntry, projectPath: string): Promise<void> {
  const tapeDir = join(projectPath, ".claude", "tape");

  // Create tape directory if it doesn't exist
  if (!existsSync(tapeDir)) {
    mkdirSync(tapeDir, { recursive: true });
  }

  const filePath = join(tapeDir, `${entry.id}.yaml`);
  writeFileSync(filePath, serializeTapeEntry(entry), "utf-8");
}

/**
 * Generate a unique entry ID for today
 * Scans existing entries to determine next sequence number
 */
export async function generateEntryId(projectPath: string): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const datePrefix = `tape-${year}${month}${day}`;

  const tapeDir = join(projectPath, ".claude", "tape");

  if (!existsSync(tapeDir)) {
    return generateTapeIdUtil(today, 1);
  }

  // Find all entries for today across active, archive, and glacier
  const allFiles: string[] = [];

  // Check active tape
  if (existsSync(tapeDir)) {
    const activeFiles = readdirSync(tapeDir).filter(f => f.endsWith(".yaml") && f.startsWith(datePrefix));
    allFiles.push(...activeFiles);
  }

  // Check archive
  const archiveDir = join(tapeDir, "archive");
  if (existsSync(archiveDir)) {
    const archiveFiles = readdirSync(archiveDir).filter(f => f.endsWith(".yaml") && f.startsWith(datePrefix));
    allFiles.push(...archiveFiles);
  }

  // Check glacier
  const glacierDir = join(tapeDir, "glacier");
  if (existsSync(glacierDir)) {
    const glacierFiles = readdirSync(glacierDir).filter(f => f.endsWith(".yaml") && f.startsWith(datePrefix));
    allFiles.push(...glacierFiles);
  }

  // Extract sequence numbers and find max
  let maxSeq = 0;
  for (const file of allFiles) {
    const match = file.match(/-(\d{3})\.yaml$/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  return generateTapeIdUtil(today, maxSeq + 1);
}

/**
 * Resolve expiration date from explicit expiry value or config defaults
 */
export function resolveExpiry(
  type: TapeEntryType,
  explicitExpiry: string | null,
  config: TapeConfig
): Date | null {
  // Handle explicit "never"
  if (explicitExpiry === "never") {
    return null;
  }

  // If no explicit expiry, use config default for this type
  if (explicitExpiry === null || explicitExpiry === undefined) {
    const ttlDays = config.ttlDefaults[type];
    if (ttlDays === undefined) {
      return null;
    }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + ttlDays);
    return expiration;
  }

  // Handle relative time format (+7d, +2w, +3m, etc.)
  const relativeMatch = explicitExpiry.match(/^\+(\d+)([dwmy])$/);
  if (relativeMatch) {
    const value = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2];

    const expiration = new Date();
    switch (unit) {
      case 'd': // days
        expiration.setDate(expiration.getDate() + value);
        break;
      case 'w': // weeks
        expiration.setDate(expiration.getDate() + (value * 7));
        break;
      case 'm': // months
        expiration.setMonth(expiration.getMonth() + value);
        break;
      case 'y': // years
        expiration.setFullYear(expiration.getFullYear() + value);
        break;
    }
    return expiration;
  }

  // Handle ISO date string
  try {
    const parsed = new Date(explicitExpiry);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch {
    // Fall through to default
  }

  // Use config default for this type
  const ttlDays = config.ttlDefaults[type];
  if (ttlDays === undefined) {
    return null;
  }

  const expiration = new Date();
  expiration.setDate(expiration.getDate() + ttlDays);
  return expiration;
}

/**
 * Tactical entry types that should be windowed by session depth.
 * These are high-volume, low-longevity entries that lose value quickly.
 */
const TACTICAL_TYPES = new Set([
  TapeEntryType.CHECKPOINT,
  TapeEntryType.DISCOVERY,
  TapeEntryType.CORRECTION,
]);

/**
 * Strategic entry types that keep their TTL-based expiry.
 * These are lower-volume, higher-value entries.
 */
const STRATEGIC_TYPES = new Set([
  TapeEntryType.DECISION,
  TapeEntryType.CONSTRAINT,
  TapeEntryType.MILESTONE,
]);

/**
 * Detect session boundaries from entry timestamps.
 * A session boundary is a gap of >= sessionGapMinutes between consecutive entries.
 * Returns entries grouped into sessions, newest session first.
 */
export function detectSessions(entries: TapeEntry[], sessionGapMinutes: number): TapeEntry[][] {
  if (entries.length === 0) return [];

  // Sort newest first
  const sorted = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const gapMs = sessionGapMinutes * 60 * 1000;

  const sessions: TapeEntry[][] = [];
  let currentSession: TapeEntry[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const gap = currentSession[currentSession.length - 1].timestamp.getTime() - sorted[i].timestamp.getTime();
    if (gap >= gapMs) {
      sessions.push(currentSession);
      currentSession = [sorted[i]];
    } else {
      currentSession.push(sorted[i]);
    }
  }
  sessions.push(currentSession);

  return sessions;
}

/**
 * Apply session-depth windowing and budget caps to entries for context output.
 *
 * Strategy:
 * - Tactical entries (checkpoint, discovery, correction): keep only from last N sessions
 * - Strategic entries (decision, constraint, milestone): keep all (TTL handles expiry)
 * - Then apply per-type and total budget caps
 * - Excludes entry IDs in the skipIds set (for dedup against lastSession)
 */
export function budgetForContext(
  entries: TapeEntry[],
  budget: ContextBudget,
  skipIds?: Set<string>
): TapeEntry[] {
  // Split into tactical and strategic
  const tactical = entries.filter(e => TACTICAL_TYPES.has(e.type));
  const strategic = entries.filter(e => STRATEGIC_TYPES.has(e.type));

  // Window tactical entries by session depth
  const sessions = detectSessions(tactical, budget.sessionGapMinutes);
  const recentSessions = sessions.slice(0, budget.tacticalSessionDepth);
  const windowedTactical = recentSessions.flat();

  // Recombine and sort newest first
  const candidates = [...windowedTactical, ...strategic]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Remove entries already shown in lastSession
  const deduped = skipIds && skipIds.size > 0
    ? candidates.filter(e => !skipIds.has(e.id))
    : candidates;

  // Apply per-type cap, respecting priority order
  const typeOrder: TapeEntryType[] = [
    TapeEntryType.CONSTRAINT,
    TapeEntryType.DECISION,
    TapeEntryType.DISCOVERY,
    TapeEntryType.CORRECTION,
    TapeEntryType.MILESTONE,
    TapeEntryType.CHECKPOINT,
  ];

  const typeCounts = new Map<TapeEntryType, number>();
  const budgeted: TapeEntry[] = [];

  for (const type of typeOrder) {
    const ofType = deduped.filter(e => e.type === type);
    const capped = ofType.slice(0, budget.maxPerType);
    typeCounts.set(type, capped.length);
    budgeted.push(...capped);
  }

  // Apply total budget cap (already in priority order from typeOrder iteration)
  return budgeted.slice(0, budget.maxEntries);
}
