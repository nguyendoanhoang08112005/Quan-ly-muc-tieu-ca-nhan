import test from "node:test";
import assert from "node:assert/strict";
import {
  addDaysToDateInput,
  diffDateInputs,
  formatDateInput,
  parseDateInput,
  parseDateTimeLocalInput,
  parseTimeInput
} from "../../src/lib/dates";

test("parseDateInput and formatDateInput round-trip UTC dates", () => {
  const parsed = parseDateInput("2026-04-08");

  assert.ok(parsed instanceof Date);
  assert.equal(formatDateInput(parsed), "2026-04-08");
});

test("addDaysToDateInput adds days in UTC-safe way", () => {
  assert.equal(addDaysToDateInput("2026-04-08", 7), "2026-04-15");
  assert.equal(diffDateInputs("2026-04-08", "2026-04-15"), 7);
});

test("parseDateTimeLocalInput parses browser datetime-local values", () => {
  const parsed = parseDateTimeLocalInput("2026-04-08T21:45");

  assert.ok(parsed instanceof Date);
  assert.equal(parsed?.getFullYear(), 2026);
  assert.equal(parsed?.getMonth(), 3);
  assert.equal(parsed?.getDate(), 8);
  assert.equal(parsed?.getHours(), 21);
  assert.equal(parsed?.getMinutes(), 45);
});

test("parseTimeInput validates hour and minute bounds", () => {
  assert.ok(parseTimeInput("09:15") instanceof Date);
  assert.equal(parseTimeInput("24:00"), null);
  assert.equal(parseTimeInput("09:60"), null);
});
