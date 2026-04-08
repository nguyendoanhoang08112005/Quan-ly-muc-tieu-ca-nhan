import test from "node:test";
import assert from "node:assert/strict";
import {
  loginSchema,
  registerSchema
} from "../../src/features/auth/schemas/auth-schemas";

test("loginSchema lowercases email input", () => {
  const parsed = loginSchema.parse({
    email: "ALICE@EXAMPLE.COM",
    password: "Password123!"
  });

  assert.equal(parsed.email, "alice@example.com");
});

test("registerSchema rejects mismatched password confirmation", () => {
  const parsed = registerSchema.safeParse({
    name: "Alice Nguyen",
    email: "alice@example.com",
    password: "Password123!",
    passwordConfirmation: "Password1234!"
  });

  assert.equal(parsed.success, false);

  if (!parsed.success) {
    assert.match(
      parsed.error.flatten().fieldErrors.passwordConfirmation?.[0] ?? "",
      /khong khop/i
    );
  }
});
