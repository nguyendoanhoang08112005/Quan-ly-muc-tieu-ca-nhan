import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateGoalProgressFromMilestones,
  calculateMilestoneProgressFromTasks,
  hasProgressChanged,
  roundProgress
} from "../../src/server/modules/goals/progress-utils";

test("calculateMilestoneProgressFromTasks computes completion percentage", () => {
  const progress = calculateMilestoneProgressFromTasks([
    { status: "COMPLETED" },
    { status: "IN_PROGRESS" },
    { status: "COMPLETED" },
    { status: "NOT_STARTED" }
  ]);

  assert.equal(progress, 50);
});

test("calculateGoalProgressFromMilestones averages milestone progress", () => {
  const progress = calculateGoalProgressFromMilestones([100, 50, 25]);

  assert.equal(progress, 58.33);
});

test("hasProgressChanged ignores tiny floating point noise", () => {
  assert.equal(hasProgressChanged(50, 50.005), false);
  assert.equal(hasProgressChanged(50, 50.02), true);
  assert.equal(roundProgress(58.3333), 58.33);
});
