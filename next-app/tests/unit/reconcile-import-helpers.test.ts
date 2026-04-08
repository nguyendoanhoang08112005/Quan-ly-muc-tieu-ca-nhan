import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCompletionProgressFromStatuses,
  calculateGoalProgressForImport,
  calculateHabitMetricsForImport,
  normalizeCompletedAt
} from "../../prisma/reconcile-import-helpers.mjs";

test("calculateGoalProgressForImport fallback sang direct tasks khi goal chua co milestone", () => {
  const progress = calculateGoalProgressForImport({
    milestoneProgressValues: [],
    taskStatuses: ["COMPLETED", "IN_PROGRESS", "COMPLETED"]
  });

  assert.equal(progress, 66.67);
});

test("calculateCompletionProgressFromStatuses tinh 0 khi khong co item", () => {
  assert.equal(calculateCompletionProgressFromStatuses([]), 0);
});

test("normalizeCompletedAt giu ngay moi nhat khi trang thai da completed", () => {
  const completedAt = normalizeCompletedAt({
    completedAt: null,
    fallbackDates: [
      new Date("2026-04-06T00:00:00.000Z"),
      new Date("2026-04-08T00:00:00.000Z")
    ],
    status: "COMPLETED"
  });

  assert.equal(completedAt?.toISOString(), "2026-04-08T00:00:00.000Z");
});

test("normalizeCompletedAt xoa timestamp khi item khong con completed", () => {
  const completedAt = normalizeCompletedAt({
    completedAt: new Date("2026-04-08T00:00:00.000Z"),
    fallbackDates: [],
    status: "IN_PROGRESS"
  });

  assert.equal(completedAt, null);
});

test("calculateHabitMetricsForImport tinh lai streak cho habit hang tuan", () => {
  const metrics = calculateHabitMetricsForImport({
    frequency: "WEEKLY",
    logs: [
      {
        isCompleted: true,
        logDate: new Date("2026-03-23T00:00:00.000Z")
      },
      {
        isCompleted: true,
        logDate: new Date("2026-03-30T00:00:00.000Z")
      },
      {
        isCompleted: true,
        logDate: new Date("2026-04-06T00:00:00.000Z")
      }
    ],
    now: new Date("2026-04-08T12:00:00.000Z"),
    weekStartsOn: 1
  });

  assert.equal(metrics.currentStreak, 3);
  assert.equal(metrics.bestStreak, 3);
  assert.equal(metrics.lastLoggedAt?.toISOString(), "2026-04-06T00:00:00.000Z");
});
