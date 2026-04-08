import test from "node:test";
import assert from "node:assert/strict";
import {
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
