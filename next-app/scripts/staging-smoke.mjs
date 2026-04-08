import "dotenv/config";

const BASE_URL =
  process.env["STAGING_SMOKE_BASE_URL"]?.trim() ||
  process.env["NEXTAUTH_URL"]?.trim();
const EMAIL = process.env["STAGING_SMOKE_EMAIL"]?.trim() || "";
const PASSWORD = process.env["STAGING_SMOKE_PASSWORD"]?.trim() || "";
const WRITE_MODE =
  process.argv.includes("--write") || process.env["STAGING_SMOKE_WRITE"] === "1";

function createJsonHeaders(token) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json"
  };
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {})
    }
  });
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return {
    body,
    response
  };
}

function assertStatus(label, response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(
      `${label} failed with status ${response.status} (expected ${expectedStatus}).`
    );
  }
}

async function main() {
  if (!BASE_URL) {
    throw new Error(
      "STAGING_SMOKE_BASE_URL or NEXTAUTH_URL is required to run staging smoke."
    );
  }

  console.log("Staging smoke");
  console.log("=============");
  console.log(`Base URL: ${BASE_URL}`);

  const health = await requestJson("/api/ops/health");

  assertStatus("GET /api/ops/health", health.response, 200);
  console.log("[ok] health endpoint");

  const ready = await requestJson("/api/ops/ready");

  assertStatus("GET /api/ops/ready", ready.response, 200);
  console.log("[ok] readiness endpoint");

  if (!EMAIL || !PASSWORD) {
    console.log(
      "[warn] STAGING_SMOKE_EMAIL/STAGING_SMOKE_PASSWORD are missing. Authenticated smoke steps were skipped."
    );
    return;
  }

  const login = await requestJson("/api/v1/auth/login", {
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    }),
    headers: createJsonHeaders(),
    method: "POST"
  });

  assertStatus("POST /api/v1/auth/login", login.response, 200);
  console.log("[ok] api login");

  const token = login.body.token;

  if (typeof token !== "string" || !token) {
    throw new Error("API login did not return a bearer token.");
  }

  const me = await requestJson("/api/v1/auth/me", {
    headers: createJsonHeaders(token)
  });

  assertStatus("GET /api/v1/auth/me", me.response, 200);
  console.log("[ok] auth me");

  const dashboard = await requestJson("/api/v1/dashboard/summary", {
    headers: createJsonHeaders(token)
  });

  assertStatus("GET /api/v1/dashboard/summary", dashboard.response, 200);
  console.log("[ok] dashboard summary");

  const goals = await requestJson("/api/v1/goals", {
    headers: createJsonHeaders(token)
  });

  assertStatus("GET /api/v1/goals", goals.response, 200);
  console.log("[ok] goals list");

  const notifications = await requestJson("/api/v1/notifications", {
    headers: createJsonHeaders(token)
  });

  assertStatus("GET /api/v1/notifications", notifications.response, 200);
  console.log("[ok] notifications list");

  let createdGoalId = null;

  try {
    if (WRITE_MODE) {
      const createGoal = await requestJson("/api/v1/goals", {
        body: JSON.stringify({
          description: "Temporary goal created by staging smoke script.",
          goal_type: "short_term",
          priority: "medium",
          start_date: "2026-04-08",
          status: "in_progress",
          target_date: "2026-04-30",
          title: `Staging smoke ${Date.now()}`
        }),
        headers: createJsonHeaders(token),
        method: "POST"
      });

      assertStatus("POST /api/v1/goals", createGoal.response, 201);
      createdGoalId = `${createGoal.body.data.id}`;
      console.log("[ok] write smoke create goal");

      const getGoal = await requestJson(`/api/v1/goals/${createdGoalId}`, {
        headers: createJsonHeaders(token)
      });

      assertStatus("GET /api/v1/goals/[goalId]", getGoal.response, 200);
      console.log("[ok] write smoke read goal");
    }

    const logout = await requestJson("/api/v1/auth/logout", {
      headers: createJsonHeaders(token),
      method: "POST"
    });

    assertStatus("POST /api/v1/auth/logout", logout.response, 200);
    console.log("[ok] api logout");
  } finally {
    if (createdGoalId) {
      try {
        await requestJson(`/api/v1/goals/${createdGoalId}`, {
          headers: createJsonHeaders(token),
          method: "DELETE"
        });
        console.log("[ok] write smoke cleanup goal");
      } catch {
        console.log("[warn] write smoke cleanup goal failed");
      }
    }
  }
}

main().catch((error) => {
  console.error("");
  console.error("Staging smoke failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
