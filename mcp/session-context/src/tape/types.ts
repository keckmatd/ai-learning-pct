/**
 * Tape Entry Types and Schema
 *
 * The "tape" is an append-only log of learnings, decisions, and corrections
 * that persist across sessions. Each entry has a scope and expiration policy.
 */

/**
 * Type of tape entry, determines default TTL and semantic meaning
 */
export enum TapeEntryType {
  /** Something learned about the codebase, tools, or environment (14 days) */
  DISCOVERY = 'discovery',

  /** A decision made that affects future work (30 days) */
  DECISION = 'decision',

  /** A correction to a previous mistake or misunderstanding (14 days) */
  CORRECTION = 'correction',

  /** A constraint or rule that must be followed (30 days) */
  CONSTRAINT = 'constraint',

  /** Progress checkpoint for tracking work state (14 days) */
  CHECKPOINT = 'checkpoint',

  /** Significant milestone achieved (30 days) */
  MILESTONE = 'milestone',
}

/**
 * Source of the tape entry
 */
export enum TapeSource {
  /** Created by Claude agent */
  AGENT = 'agent',

  /** Created by human user */
  HUMAN = 'human',

  /** Created by system automation */
  SYSTEM = 'system',
}

/**
 * Default time-to-live in days for each entry type
 */
export const DEFAULT_TTLS: Record<TapeEntryType, number> = {
  [TapeEntryType.DISCOVERY]: 14,
  [TapeEntryType.DECISION]: 30,
  [TapeEntryType.CORRECTION]: 14,
  [TapeEntryType.CONSTRAINT]: 30,
  [TapeEntryType.CHECKPOINT]: 14,
  [TapeEntryType.MILESTONE]: 30,
};

/**
 * A tape entry - immutable record of learning or decision
 */
export interface TapeEntry {
  /** Unique identifier (format: tape-YYYYMMDD-NNN) */
  id: string;

  /** When this entry was created */
  timestamp: Date;

  /** Type of entry (affects TTL and semantics) */
  type: TapeEntryType;

  /** Scope paths this entry applies to (e.g., ["global"], ["issue/42", "task/wizard-flow"]) */
  scope: string[];

  /** The actual content/learning/decision */
  content: string;

  /** Who/what created this entry */
  source: TapeSource;

  /** When this entry expires (null = never) */
  expires: Date | null;
}

/**
 * Helper type for scope matching
 */
export type ScopePattern = string | RegExp;

/**
 * Options for creating a tape entry
 */
export interface CreateTapeEntryOptions {
  type: TapeEntryType;
  scope: string[];
  content: string;
  source: TapeSource;
  /** Override default TTL (in days). null = never expires */
  ttlDays?: number | null;
}

/**
 * Options for querying tape entries
 */
export interface QueryTapeOptions {
  /** Filter by scope patterns */
  scope?: ScopePattern[];

  /** Filter by entry types */
  types?: TapeEntryType[];

  /** Filter by source */
  sources?: TapeSource[];

  /** Include expired entries */
  includeExpired?: boolean;

  /** Maximum number of entries to return */
  limit?: number;

  /** Start date for range query */
  since?: Date;

  /** End date for range query */
  until?: Date;
}

/**
 * Check if a scope matches a pattern
 */
export function scopeMatches(scope: string, pattern: ScopePattern): boolean {
  if (typeof pattern === 'string') {
    // Exact match or prefix match
    return scope === pattern || scope.startsWith(pattern + '/');
  }
  return pattern.test(scope);
}

/**
 * Check if any scope in an entry matches any pattern
 */
export function entryMatchesScope(entry: TapeEntry, patterns: ScopePattern[]): boolean {
  if (!patterns || patterns.length === 0) {
    return true;
  }
  return entry.scope.some(s => patterns.some(p => scopeMatches(s, p)));
}

/**
 * Generate a tape entry ID for a given date and sequence number
 */
export function generateTapeId(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `tape-${year}${month}${day}-${seq}`;
}

/**
 * Parse a tape entry ID into its components
 */
export function parseTapeId(id: string): { date: Date; sequence: number } | null {
  const match = id.match(/^tape-(\d{4})(\d{2})(\d{2})-(\d{3})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day, seq] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const sequence = parseInt(seq);

  return { date, sequence };
}

/**
 * Calculate expiration date based on entry type and optional TTL override
 */
export function calculateExpiration(
  type: TapeEntryType,
  ttlDays?: number | null
): Date | null {
  if (ttlDays === null) {
    return null;
  }

  const days = ttlDays ?? DEFAULT_TTLS[type];
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}

/**
 * Check if a tape entry has expired
 */
export function isExpired(entry: TapeEntry): boolean {
  if (entry.expires === null) {
    return false;
  }
  return new Date() > entry.expires;
}
