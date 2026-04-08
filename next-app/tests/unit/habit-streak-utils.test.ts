import test from "node:test";
import assert from "node:assert/strict";
import {
  addHabitPeriod,
  calculateHabitMetrics,
  normalizeHabitPeriod
} from "../../src/server/modules/habits/streak-utils";

test("calculateHabitMetrics computes daily current and best streak", () => {
  const metrics = calculateHabitMetrics({
    frequency: "DAILY",
    weekStartsOn: 1,
    now: new Date(Date.UTC(2026, 3, 8)),
    logs: [
      { logDate: new Date(Date.UTC(2026, 3, 8)), isCompleted: true },
      { logDate: new Date(Date.UTC(2026, 3, 7)), isCompleted: true },
      { logDate: new Date(Date.UTC(2026, 3, 6)), isCompleted: true },
      { logDate: new Date(Date.UTC(2026, 3, 4)), isCompleted: true }
    ]
  });

  assert.equal(metrics.currentStreak, 3);
  assert.equal(metrics.bestStreak, 3);
});

test("calculateHabitMetrics computes weekly streak using weekStartsOn", () => {
  const metrics = calculateHabitMetrics({
    frequency: "WEEKLY",
    weekStartsOn: 1,
    now: new Date(Date.UTC(2026, 3, 8)),
    logs: [
      { logDate: new Date(Date.UTC(2026, 3, 6)), isCompleted: true },
      { logDate: new Date(Date.UTC(2026, 2, 30)), isCompleted: true },
      { logDate: new Date(Date.UTC(2026, 2, 23)), isCompleted: true }
    ]
  });

  assert.equal(metrics.currentStreak, 3);
  assert.equal(metrics.bestStreak, 3);
});

test("normalizeHabitPeriod and addHabitPeriod handle monthly periods", () => {
  const normalized = normalizeHabitPeriod(
    new Date(Date.UTC(2026, 3, 21)),
    "MONTHLY",
    1
  );
  const next = addHabitPeriod(normalized, "MONTHLY", 1);

  assert.equal(normalized.toISOString(), "2026-04-01T00:00:00.000Z");
  assert.equal(next.toISOString(), "2026-05-01T00:00:00.000Z");
});
