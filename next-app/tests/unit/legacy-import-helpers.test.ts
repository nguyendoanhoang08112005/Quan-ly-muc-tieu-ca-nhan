import test from "node:test";
import assert from "node:assert/strict";
import {
  mapLegacyGoalLogType,
  mapLegacyGoalStatus,
  mapLegacyGoalType,
  mapLegacyPriority,
  parseLegacyJson,
  toBoolean
} from "../../prisma/legacy-import-helpers.mjs";

test("legacy import helpers map enum values ve schema Prisma moi", () => {
  assert.equal(mapLegacyGoalType("mid_term"), "MID_TERM");
  assert.equal(mapLegacyPriority("critical"), "CRITICAL");
  assert.equal(mapLegacyGoalStatus("in_progress"), "IN_PROGRESS");
  assert.equal(mapLegacyGoalLogType("status_change"), "STATUS_CHANGE");
});

test("legacy import helpers parse JSON va bo qua chuoi loi", () => {
  assert.deepEqual(parseLegacyJson("{\"ok\":true}"), { ok: true });
  assert.equal(parseLegacyJson("{bad json"), null);
});

test("legacy import helpers coerce boolean tu du lieu MySQL cu", () => {
  assert.equal(toBoolean(1), true);
  assert.equal(toBoolean("true"), true);
  assert.equal(toBoolean(0), false);
});
