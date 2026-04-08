import test from "node:test";
import assert from "node:assert/strict";
import {
  createSignedApiSessionToken,
  verifySignedApiSessionToken
} from "@/lib/api/v1/token";

test("verifySignedApiSessionToken xac thuc token hop le", () => {
  process.env["NEXTAUTH_SECRET"] = "phase-16-test-secret";

  const token = createSignedApiSessionToken({
    exp: Math.floor(Date.now() / 1000) + 60,
    iat: Math.floor(Date.now() / 1000),
    sid: "session-id-1234567890",
    sub: "42",
    typ: "api_session_v1"
  });
  const payload = verifySignedApiSessionToken(token);

  assert.deepEqual(payload, {
    exp: payload?.exp,
    iat: payload?.iat,
    sid: "session-id-1234567890",
    sub: "42",
    typ: "api_session_v1"
  });
});

test("verifySignedApiSessionToken tu choi token bi sua", () => {
  process.env["NEXTAUTH_SECRET"] = "phase-16-test-secret";

  const token = createSignedApiSessionToken({
    exp: Math.floor(Date.now() / 1000) + 60,
    iat: Math.floor(Date.now() / 1000),
    sid: "session-id-abcdefghijk",
    sub: "7",
    typ: "api_session_v1"
  });
  const tamperedToken = `${token}tampered`;

  assert.equal(verifySignedApiSessionToken(tamperedToken), null);
});
