import test from "node:test";
import assert from "node:assert/strict";
import {
  readPartialHabitApiPayload,
  readPartialHabitLogApiPayload,
  readPartialNoteApiPayload,
  readPartialGoalApiPayload,
  readPartialProfileApiPayload,
  readPartialTaskApiPayload
} from "@/lib/api/v1/payloads";

test("readPartialGoalApiPayload map snake_case payload sang form values", () => {
  const payload = readPartialGoalApiPayload({
    description: "Mo ta chi tiet cho muc tieu.",
    goal_type: "long_term",
    is_public: 1,
    start_date: "2026-04-01",
    tag_ids: [1, "2"],
    target_date: "2026-12-31",
    title: "Hoc Next.js"
  });

  assert.deepEqual(payload, {
    description: "Mo ta chi tiet cho muc tieu.",
    goalType: "long_term",
    isPublic: true,
    startDate: "2026-04-01",
    tagIds: ["1", "2"],
    targetDate: "2026-12-31",
    title: "Hoc Next.js"
  });
});

test("readPartialTaskApiPayload ho tro null va numeric field", () => {
  const payload = readPartialTaskApiPayload({
    due_at: null,
    estimated_minutes: 45,
    is_focus: "true",
    priority: "high",
    status: "in_progress",
    title: "Viet route handler"
  });

  assert.deepEqual(payload, {
    dueAt: "",
    estimatedMinutes: "45",
    isFocus: true,
    priority: "high",
    status: "in_progress",
    title: "Viet route handler"
  });
});

test("readPartialProfileApiPayload ho tro avatar_path", () => {
  const payload = readPartialProfileApiPayload({
    avatar_path: null,
    locale: "en",
    timezone: "UTC"
  });

  assert.deepEqual(payload, {
    avatarPath: "",
    locale: "en",
    timezone: "UTC"
  });
});

test("readPartialNoteApiPayload map snake_case cho notes", () => {
  const payload = readPartialNoteApiPayload({
    noteable_type: "goal",
    noteable_id: 42,
    content: "Ghi chu test"
  });

  assert.deepEqual(payload, {
    noteableType: "goal",
    noteableId: "42",
    content: "Ghi chu test"
  });
});

test("readPartialHabitApiPayload map snake_case cho habits", () => {
  const payload = readPartialHabitApiPayload({
    title: "Doc sach",
    goal_id: 9,
    frequency: "daily",
    target_count: 2,
    unit: "pages",
    reminder_time: "07:30",
    status: "active",
    start_date: "2026-04-08",
    end_date: "2026-04-30"
  });

  assert.deepEqual(payload, {
    title: "Doc sach",
    goalId: "9",
    frequency: "daily",
    targetCount: "2",
    unit: "pages",
    reminderTime: "07:30",
    status: "active",
    startDate: "2026-04-08",
    endDate: "2026-04-30"
  });
});

test("readPartialHabitLogApiPayload map completed_count va log_date", () => {
  const payload = readPartialHabitLogApiPayload({
    log_date: "2026-04-08",
    completed_count: 3,
    note: "Hoan thanh"
  });

  assert.deepEqual(payload, {
    logDate: "2026-04-08",
    completedCount: "3",
    note: "Hoan thanh"
  });
});
