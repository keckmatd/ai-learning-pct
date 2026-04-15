import { describe, it, expect } from "vitest";
import { extractTaskStats, extractTitle, extractDecisions, extractLastSession, synthesizeLastSession } from "./index.js";
import { TapeEntry, TapeEntryType, TapeSource } from "./tape/types.js";

describe("extractTaskStats", () => {
  it("counts completed tasks", () => {
    const content = "- [x] Done\n- [x] Also done\n- [ ] Not done";
    const stats = extractTaskStats(content);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(2);
  });

  it("counts in-progress tasks", () => {
    const content = "- [~] In progress\n- [ ] Pending";
    const stats = extractTaskStats(content);
    expect(stats.inProgress).toBe(1);
    expect(stats.nextActions).toContain("In progress");
  });

  it("handles empty content", () => {
    const stats = extractTaskStats("");
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.nextActions).toHaveLength(0);
  });

  it("limits nextActions to 3", () => {
    const content = "- [ ] A\n- [ ] B\n- [ ] C\n- [ ] D\n- [ ] E";
    const stats = extractTaskStats(content);
    expect(stats.nextActions).toHaveLength(3);
  });
});

describe("extractTitle", () => {
  it("extracts H1 title", () => {
    const content = "# My Plan\n\nSome content";
    expect(extractTitle(content, "plan.md")).toBe("My Plan");
  });

  it("falls back to filename", () => {
    const content = "No heading here";
    expect(extractTitle(content, "my-plan.md")).toBe("my plan");
  });

  it("extracts frontmatter title", () => {
    const content = "---\ntitle: Front Matter Title\n---\n# H1 Title";
    expect(extractTitle(content, "plan.md")).toBe("Front Matter Title");
  });
});

describe("extractDecisions", () => {
  it("extracts bold decision pattern", () => {
    const content = "**Decision:** Use TypeScript for everything\n**Reason:** Type safety";
    const decisions = extractDecisions(content);
    expect(decisions).toHaveLength(1);
    expect(decisions[0].decision).toBe("Use TypeScript for everything");
    expect(decisions[0].reason).toBe("Type safety");
  });

  it("uses fileDate when provided", () => {
    const content = "**Decision:** Something important";
    const decisions = extractDecisions(content, "2026-01-15");
    expect(decisions[0].date).toBe("2026-01-15");
  });

  it("returns empty for no decisions", () => {
    const content = "Just some regular content\nNo decisions here";
    expect(extractDecisions(content)).toHaveLength(0);
  });
});

describe("extractLastSession", () => {
  it("extracts session with all fields", () => {
    const content = `# Progress Log

### Session 3 - 2026-04-01
- Implemented feature X
- Fixed bug Y
- **State:** Working on Z
- Commit: abc1234
- Issues: #5 closed, #6 updated`;

    const session = extractLastSession(content);
    expect(session).not.toBeNull();
    expect(session!.number).toBe(3);
    expect(session!.date).toBe("2026-04-01");
    expect(session!.state).toBe("Working on Z");
    expect(session!.commit).toBe("abc1234");
    expect(session!.accomplishments).toContain("Implemented feature X");
  });

  it("returns null for no sessions", () => {
    expect(extractLastSession("No sessions here")).toBeNull();
  });

  it("gets the last session when multiple exist", () => {
    const content = `### Session 1 - 2026-03-01
- Did stuff
### Session 2 - 2026-03-15
- Did more stuff
- **State:** All good`;

    const session = extractLastSession(content);
    expect(session!.number).toBe(2);
    expect(session!.date).toBe("2026-03-15");
  });
});

describe("synthesizeLastSession", () => {
  const makeEntry = (overrides: Partial<TapeEntry> & { type: TapeEntryType; content: string }): TapeEntry => ({
    id: "tape-20260401-001",
    timestamp: new Date("2026-04-01"),
    scope: ["global"],
    source: TapeSource.AGENT,
    expires: new Date("2026-04-08"),
    ...overrides,
  });

  it("returns null for empty entries", () => {
    const { session } = synthesizeLastSession([]);
    expect(session).toBeNull();
  });

  it("extracts state and commit from checkpoint", () => {
    const entries = [
      makeEntry({
        id: "tape-20260401-001",
        type: TapeEntryType.CHECKPOINT,
        content: "Finished auth module. Commit: abc1234",
      }),
    ];
    const { session } = synthesizeLastSession(entries);
    expect(session).not.toBeNull();
    expect(session!.state).toBe("Finished auth module.");
    expect(session!.commit).toBe("abc1234");
  });

  it("builds accomplishments from milestones", () => {
    const entries = [
      makeEntry({
        id: "tape-20260401-001",
        type: TapeEntryType.CHECKPOINT,
        content: "Done for today",
      }),
      makeEntry({
        id: "tape-20260401-002",
        type: TapeEntryType.MILESTONE,
        content: "Shipped the login page",
      }),
    ];
    const { session, consumedIds } = synthesizeLastSession(entries);
    expect(session!.accomplishments).toContain("Shipped the login page");
    expect(consumedIds.has("tape-20260401-001")).toBe(true);
    expect(consumedIds.has("tape-20260401-002")).toBe(true);
  });

  it("ignores entries older than 7 days", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    const entries = [
      makeEntry({
        id: "tape-20260322-001",
        type: TapeEntryType.CHECKPOINT,
        content: "Old checkpoint",
        timestamp: oldDate,
      }),
    ];
    const { session } = synthesizeLastSession(entries);
    // Should still return a session (uses entries[0] as fallback reference)
    // but state will be empty since checkpoint is too old
    expect(session).not.toBeNull();
    expect(session!.state).toBe("");
  });
});
