import assert from "node:assert/strict";
import test from "node:test";
import {
  getOwnershipAccessState,
  isActiveOwnedRecord
} from "@/lib/auth/permissions";

test("isActiveOwnedRecord cho phep record thuoc dung user va chua xoa mem", () => {
  assert.equal(
    isActiveOwnedRecord(1n, {
      userId: "1",
      deletedAt: null
    }),
    true
  );
});

test("isActiveOwnedRecord tu choi record cua user khac hoac da xoa", () => {
  assert.equal(
    isActiveOwnedRecord(1n, {
      userId: 2n,
      deletedAt: null
    }),
    false
  );
  assert.equal(
    isActiveOwnedRecord(1n, {
      userId: 1n,
      deletedAt: new Date("2026-04-08T00:00:00.000Z")
    }),
    false
  );
});

test("getOwnershipAccessState phan biet missing forbidden deleted allowed", () => {
  assert.equal(getOwnershipAccessState(1n, null), "missing");
  assert.equal(
    getOwnershipAccessState(1n, {
      userId: 2,
      deletedAt: null
    }),
    "forbidden"
  );
  assert.equal(
    getOwnershipAccessState(1n, {
      userId: 1,
      deletedAt: new Date("2026-04-08T00:00:00.000Z")
    }),
    "deleted"
  );
  assert.equal(
    getOwnershipAccessState(1n, {
      userId: 1,
      deletedAt: null
    }),
    "allowed"
  );
});
