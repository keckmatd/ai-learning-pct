import { describe, it, expect } from "vitest";
import { filterByScope, resolveExpiry } from "./operations.js";
import { TapeEntry, TapeEntryType, TapeSource } from "./types.js";
import { DEFAULT_CONFIG } from "./config.js";

describe("filterByScope", () => {
  const makeEntry = (id: string, scope: string[]): TapeEntry => ({
    id,
    timestamp: new Date(),
    type: TapeEntryType.DISCOVERY,
    scope,
    content: "test",
    source: TapeSource.AGENT,
    expires: null,
  });

  it("returns all entries when no scopes provided", () => {
    const entries = [
      makeEntry("1", ["issue/42"]),
      makeEntry("2", ["task/foo"]),
    ];
    expect(filterByScope(entries, [])).toHaveLength(2);
  });

  it("always includes global entries", () => {
    const entries = [
      makeEntry("1", ["global"]),
      makeEntry("2", ["issue/42"]),
    ];
    const filtered = filterByScope(entries, ["issue/99"]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("matches exact scope", () => {
    const entries = [
      makeEntry("1", ["issue/42"]),
      makeEntry("2", ["issue/43"]),
    ];
    const filtered = filterByScope(entries, ["issue/42"]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("matches child scopes", () => {
    const entries = [
      makeEntry("1", ["task/wizard/step-1"]),
      makeEntry("2", ["task/other"]),
    ];
    const filtered = filterByScope(entries, ["task/wizard"]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });
});

describe("resolveExpiry", () => {
  it("returns null for 'never'", () => {
    const result = resolveExpiry(TapeEntryType.DISCOVERY, "never", DEFAULT_CONFIG);
    expect(result).toBeNull();
  });

  it("uses default TTL for null input", () => {
    const result = resolveExpiry(TapeEntryType.DISCOVERY, null, DEFAULT_CONFIG);
    expect(result).not.toBeNull();
    const expected = new Date();
    expected.setDate(expected.getDate() + 14); // DISCOVERY default is 14 days
    expect(Math.abs(result!.getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it("handles relative days (+7d)", () => {
    const result = resolveExpiry(TapeEntryType.DISCOVERY, "+7d", DEFAULT_CONFIG);
    expect(result).not.toBeNull();
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);
    // Allow 1 second tolerance
    expect(Math.abs(result!.getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it("handles relative weeks (+2w)", () => {
    const result = resolveExpiry(TapeEntryType.DISCOVERY, "+2w", DEFAULT_CONFIG);
    expect(result).not.toBeNull();
    const expected = new Date();
    expected.setDate(expected.getDate() + 14);
    expect(Math.abs(result!.getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it("parses ISO date strings", () => {
    const result = resolveExpiry(TapeEntryType.DISCOVERY, "2026-12-31T00:00:00Z", DEFAULT_CONFIG);
    expect(result).not.toBeNull();
    expect(result!.getUTCFullYear()).toBe(2026);
    expect(result!.getUTCMonth()).toBe(11); // December
    expect(result!.getUTCDate()).toBe(31);
  });

  it("uses config default when no explicit expiry", () => {
    // Pass empty string to trigger default lookup
    const result = resolveExpiry(TapeEntryType.DECISION, "", DEFAULT_CONFIG);
    expect(result).not.toBeNull();
    const expected = new Date();
    expected.setDate(expected.getDate() + 30); // DECISION default is 30 days
    expect(Math.abs(result!.getTime() - expected.getTime())).toBeLessThan(1000);
  });
});
