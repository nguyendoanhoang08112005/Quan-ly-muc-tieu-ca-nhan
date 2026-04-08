import test from "node:test";
import assert from "node:assert/strict";
import { goalFormSchema } from "../../src/features/goals/schemas/goal-schemas";
import { milestoneFormSchema } from "../../src/features/milestones/schemas/milestone-schemas";
import { taskFormSchema } from "../../src/features/tasks/schemas/task-schemas";

test("goalFormSchema rejects targetDate before startDate", () => {
  const parsed = goalFormSchema.safeParse({
    title: "Ship migration",
    description: "Hoan thanh migration sang he moi mot cach on dinh.",
    goalType: "mid_term",
    priority: "high",
    status: "in_progress",
    startDate: "2026-04-10",
    targetDate: "2026-04-09",
    note: "",
    isPublic: true,
    categoryId: "",
    tagIds: []
  });

  assert.equal(parsed.success, false);
});

test("milestoneFormSchema rejects invalid sequence number", () => {
  const parsed = milestoneFormSchema.safeParse({
    title: "Phase foundation",
    description: "",
    status: "in_progress",
    startDate: "2026-04-01",
    targetDate: "2026-04-10",
    note: "",
    sequenceNo: "0"
  });

  assert.equal(parsed.success, false);
});

test("taskFormSchema accepts blank projectId and valid dueAt", () => {
  const parsed = taskFormSchema.safeParse({
    title: "Seed local database",
    description: "",
    status: "not_started",
    priority: "critical",
    dueAt: "2026-04-10T09:30",
    estimatedMinutes: "90",
    projectId: "",
    isFocus: true
  });

  assert.equal(parsed.success, true);

  if (parsed.success) {
    assert.equal(parsed.data.projectId, undefined);
    assert.equal(parsed.data.estimatedMinutes, 90);
  }
});

test("taskFormSchema rejects malformed dueAt values", () => {
  const parsed = taskFormSchema.safeParse({
    title: "Broken task",
    description: "",
    status: "not_started",
    priority: "medium",
    dueAt: "2026/04/10 09:30",
    estimatedMinutes: "",
    projectId: "",
    isFocus: false
  });

  assert.equal(parsed.success, false);
});
