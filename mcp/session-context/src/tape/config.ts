import { readFileSync, existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { TapeEntryType, DEFAULT_TTLS } from "./types.js";

/**
 * Context budget controls for session primer output.
 * Limits how many tape entries are included in get_active_context.
 */
export interface ContextBudget {
  /** Max total entries in session primer. Default: 15 */
  maxEntries: number;

  /** Max entries per type. Default: 4 */
  maxPerType: number;

  /** Number of recent sessions to keep tactical entries from (checkpoints, discoveries, corrections). Default: 3 */
  tacticalSessionDepth: number;

  /** Minutes of inactivity that defines a session boundary. Default: 120 (2 hours) */
  sessionGapMinutes: number;
}

/**
 * Configuration for tape storage system.
 * Controls TTL defaults, archival behavior, and context budgeting.
 */
export interface TapeConfig {
  /**
   * Default TTL (time-to-live) in days for each entry type.
   * Can override the built-in DEFAULT_TTLS from types.ts.
   */
  ttlDefaults: Record<string, number>;

  /**
   * Number of days to retain archived entries before moving to glacier.
   * Default: 90 days
   */
  archiveRetentionDays: number;

  /**
   * Number of days after archive before moving to glacier storage.
   * Default: 90 days
   */
  glacierThresholdDays: number;

  /**
   * Controls how many entries appear in the session primer.
   */
  contextBudget: ContextBudget;
}

/**
 * Default configuration with sensible defaults for all projects.
 * TTL defaults mirror DEFAULT_TTLS from types.ts but can be overridden per-project.
 */
export const DEFAULT_CONTEXT_BUDGET: ContextBudget = {
  maxEntries: 15,
  maxPerType: 4,
  tacticalSessionDepth: 3,
  sessionGapMinutes: 120,
};

export const DEFAULT_CONFIG: TapeConfig = {
  ttlDefaults: {
    [TapeEntryType.DISCOVERY]: DEFAULT_TTLS[TapeEntryType.DISCOVERY],
    [TapeEntryType.DECISION]: DEFAULT_TTLS[TapeEntryType.DECISION],
    [TapeEntryType.CORRECTION]: DEFAULT_TTLS[TapeEntryType.CORRECTION],
    [TapeEntryType.CONSTRAINT]: DEFAULT_TTLS[TapeEntryType.CONSTRAINT],
    [TapeEntryType.CHECKPOINT]: DEFAULT_TTLS[TapeEntryType.CHECKPOINT],
    [TapeEntryType.MILESTONE]: DEFAULT_TTLS[TapeEntryType.MILESTONE],
  },
  archiveRetentionDays: 90,
  glacierThresholdDays: 90,
  contextBudget: DEFAULT_CONTEXT_BUDGET,
};

/**
 * Load tape configuration from project's .claude/tape/config.yaml.
 * Falls back to DEFAULT_CONFIG if file doesn't exist.
 * Merges user config with defaults (user config takes precedence).
 *
 * @param projectPath - Root path of the project
 * @returns TapeConfig with defaults merged with any user overrides
 */
export function loadTapeConfig(projectPath: string): TapeConfig {
  const configPath = join(projectPath, ".claude", "tape", "config.yaml");

  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const configContent = readFileSync(configPath, "utf-8");
    const userConfig = yaml.load(configContent) as Partial<TapeConfig>;

    // Merge user config with defaults
    const userBudget = (userConfig as any).contextBudget || {};
    return {
      ttlDefaults: {
        ...DEFAULT_CONFIG.ttlDefaults,
        ...(userConfig.ttlDefaults || {}),
      },
      archiveRetentionDays:
        userConfig.archiveRetentionDays ?? DEFAULT_CONFIG.archiveRetentionDays,
      glacierThresholdDays:
        userConfig.glacierThresholdDays ?? DEFAULT_CONFIG.glacierThresholdDays,
      contextBudget: {
        ...DEFAULT_CONTEXT_BUDGET,
        ...userBudget,
      },
    };
  } catch (error) {
    console.warn(
      `Failed to load tape config from ${configPath}, using defaults:`,
      error
    );
    return DEFAULT_CONFIG;
  }
}
