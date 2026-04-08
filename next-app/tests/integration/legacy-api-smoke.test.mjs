import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { PrismaClient } from "@prisma/client";

const ENABLE_INTEGRATION_TESTS = process.env["ENABLE_INTEGRATION_TESTS"] === "1";
const SHOULD_SPAWN_SERVER = process.env["INTEGRATION_SPAWN_SERVER"] !== "0";
const PORT = Number(process.env["INTEGRATION_PORT"] ?? 3105);
const BASE_URL =
  process.env["INTEGRATION_BASE_URL"] ?? `http://127.0.0.1:${PORT}`;
const SERVER_READY_TIMEOUT_MS = Number(
  process.env["INTEGRATION_SERVER_READY_TIMEOUT_MS"] ?? 60_000
);
const REQUIRED_RUNTIME_ENV_VARS = ["DATABASE_URL", "NEXTAUTH_SECRET"];
const missingRuntimeEnvVars = REQUIRED_RUNTIME_ENV_VARS.filter(
  (name) => !process.env[name]
);
const INTEGRATION_SKIP_REASON = !ENABLE_INTEGRATION_TESTS
  ? "Integration smoke test chi chay khi ENABLE_INTEGRATION_TESTS=1."
  : missingRuntimeEnvVars.length > 0
    ? `Thieu bien moi truong runtime can thiet: ${missingRuntimeEnvVars.join(", ")}.`
    : undefined;
const prisma = INTEGRATION_SKIP_REASON ? null : new PrismaClient();

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

async function waitForServerReady() {
  const startTime = Date.now();

  while (Date.now() - startTime < SERVER_READY_TIMEOUT_MS) {
    try {
      const { response } = await requestJson("/api/v1/auth/me");

      if ([200, 401].includes(response.status)) {
        return;
      }
    } catch {}

    await delay(1_000);
  }

  throw new Error(
    `Next test server did not become ready within ${SERVER_READY_TIMEOUT_MS}ms.`
  );
}

async function stopServer(serverProcess) {
  if (!serverProcess || serverProcess.killed) {
    return;
  }

  serverProcess.kill("SIGTERM");

  await Promise.race([
    new Promise((resolve) => {
      serverProcess.once("exit", resolve);
    }),
    delay(10_000).then(() => {
      serverProcess.kill("SIGKILL");
    })
  ]);
}

async function startServer() {
  if (!SHOULD_SPAWN_SERVER) {
    await waitForServerReady();
    return null;
  }

  const serverProcess = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", `${PORT}`],
    {
      cwd: process.cwd(),
      env: {
        ...process.env
      },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  let stderrLog = "";

  serverProcess.stderr.on("data", (chunk) => {
    stderrLog += chunk.toString();
  });

  serverProcess.stdout.on("data", () => {});

  serverProcess.once("exit", (code) => {
    if (code !== 0) {
      console.error(stderrLog);
    }
  });

  try {
    await waitForServerReady();
    return serverProcess;
  } catch (error) {
    await stopServer(serverProcess);
    throw error;
  }
}

test(
  "legacy API compatibility smoke flow",
  {
    skip: INTEGRATION_SKIP_REASON,
    timeout: 180_000
  },
  async () => {
    let serverProcess = null;
    let activeToken = null;
    let createdGoalId = null;
    let createdHabitId = null;
    let createdNoteId = null;
    let createdNotificationId = null;

    const email = `smoke-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    const password = "Password123!";

    try {
      serverProcess = await startServer();

      const registerResult = await requestJson("/api/v1/auth/register", {
        body: JSON.stringify({
          email,
          name: "Smoke Test User",
          password,
          passwordConfirmation: password
        }),
        headers: createJsonHeaders(),
        method: "POST"
      });

      assert.equal(registerResult.response.status, 201);
      assert.equal(registerResult.body.user.email, email);
      assert.equal(typeof registerResult.body.token, "string");
      activeToken = registerResult.body.token;

      const meAfterRegister = await requestJson("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      assert.equal(meAfterRegister.response.status, 200);
      assert.equal(meAfterRegister.body.data.email, email);

      const profileUpdate = await requestJson("/api/v1/profile", {
        body: JSON.stringify({
          avatar_path: "https://example.com/smoke-avatar.png",
          locale: "en",
          name: "Smoke Test User Updated",
          timezone: "UTC"
        }),
        headers: createJsonHeaders(activeToken),
        method: "PATCH"
      });

      assert.equal(profileUpdate.response.status, 200);
      assert.equal(profileUpdate.body.user.name, "Smoke Test User Updated");
      assert.equal(profileUpdate.body.user.locale, "en");

      const aliasLogout = await requestJson("/api/logout", {
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(aliasLogout.response.status, 200);

      const meAfterLogout = await requestJson("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      assert.equal(meAfterLogout.response.status, 401);

      const aliasLogin = await requestJson("/api/login", {
        body: JSON.stringify({
          email,
          password
        }),
        headers: createJsonHeaders(),
        method: "POST"
      });

      assert.equal(aliasLogin.response.status, 200);
      assert.equal(aliasLogin.body.user.email, email);
      assert.equal(typeof aliasLogin.body.token, "string");
      activeToken = aliasLogin.body.token;

      const dashboardBeforeGoal = await requestJson("/api/v1/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      assert.equal(dashboardBeforeGoal.response.status, 200);
      assert.equal(
        typeof dashboardBeforeGoal.body.summary.active_goals,
        "number"
      );

      const goalCreate = await requestJson("/api/v1/goals", {
        body: JSON.stringify({
          description: "Tao du lieu smoke test cho legacy API contract.",
          goal_type: "short_term",
          priority: "high",
          start_date: "2026-04-08",
          status: "in_progress",
          target_date: "2026-04-30",
          title: "Smoke legacy goal"
        }),
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(goalCreate.response.status, 201);
      createdGoalId = `${goalCreate.body.data.id}`;

      const noteCreate = await requestJson("/api/v1/notes", {
        body: JSON.stringify({
          content: "Ghi chu smoke test cho goal",
          noteable_id: createdGoalId,
          noteable_type: "goal"
        }),
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(noteCreate.response.status, 201);
      assert.equal(noteCreate.body.data.noteable_type, "goal");
      createdNoteId = `${noteCreate.body.data.id}`;

      const noteUpdate = await requestJson(`/api/v1/notes/${createdNoteId}`, {
        body: JSON.stringify({
          content: "Ghi chu smoke test da cap nhat"
        }),
        headers: createJsonHeaders(activeToken),
        method: "PATCH"
      });

      assert.equal(noteUpdate.response.status, 200);
      assert.equal(
        noteUpdate.body.data.content,
        "Ghi chu smoke test da cap nhat"
      );

      const habitCreate = await requestJson("/api/v1/habits", {
        body: JSON.stringify({
          goal_id: createdGoalId,
          frequency: "daily",
          start_date: "2026-04-08",
          status: "active",
          target_count: 1,
          title: "Habit smoke test",
          unit: "times"
        }),
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(habitCreate.response.status, 201);
      assert.equal(habitCreate.body.data.goal.id, Number(createdGoalId));
      createdHabitId = `${habitCreate.body.data.id}`;

      const habitLog = await requestJson(`/api/v1/habits/${createdHabitId}/logs`, {
        body: JSON.stringify({
          completed_count: 1,
          log_date: "2026-04-08",
          note: "Hoan thanh habit smoke test"
        }),
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(habitLog.response.status, 200);
      assert.equal(habitLog.body.data.current_streak, 1);

      const milestoneCreate = await requestJson(
        `/api/v1/goals/${createdGoalId}/milestones`,
        {
          body: JSON.stringify({
            sequence_no: 1,
            status: "in_progress",
            title: "Smoke milestone"
          }),
          headers: createJsonHeaders(activeToken),
          method: "POST"
        }
      );

      assert.equal(milestoneCreate.response.status, 201);
      const milestoneId = `${milestoneCreate.body.data.id}`;

      const taskCreate = await requestJson(
        `/api/v1/milestones/${milestoneId}/tasks`,
        {
          body: JSON.stringify({
            due_at: "2026-04-20T10:00",
            is_focus: true,
            priority: "high",
            status: "in_progress",
            title: "Smoke task"
          }),
          headers: createJsonHeaders(activeToken),
          method: "POST"
        }
      );

      assert.equal(taskCreate.response.status, 201);
      const taskId = `${taskCreate.body.data.id}`;

      const taskComplete = await requestJson(`/api/v1/tasks/${taskId}/complete`, {
        headers: createJsonHeaders(activeToken),
        method: "PATCH"
      });

      assert.equal(taskComplete.response.status, 200);
      assert.equal(taskComplete.body.data.status, "completed");

      const goalDetail = await requestJson(`/api/v1/goals/${createdGoalId}`, {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      assert.equal(goalDetail.response.status, 200);
      assert.equal(goalDetail.body.data.id, Number(createdGoalId));
      assert.ok(Array.isArray(goalDetail.body.data.milestones));

      if (prisma) {
        const notification = await prisma.notification.create({
          data: {
            body: "Canh bao smoke test",
            title: "Smoke notification",
            type: "smoke.test",
            userId: BigInt(meAfterRegister.body.data.id)
          },
          select: {
            id: true
          }
        });

        createdNotificationId = notification.id;
      }

      const notificationsBeforeRead = await requestJson("/api/v1/notifications", {
        headers: createJsonHeaders(activeToken)
      });

      assert.equal(notificationsBeforeRead.response.status, 200);
      assert.equal(typeof notificationsBeforeRead.body.summary.unread, "number");

      if (createdNotificationId) {
        const notificationRead = await requestJson(
          `/api/v1/notifications/${createdNotificationId}/read`,
          {
            headers: createJsonHeaders(activeToken),
            method: "POST"
          }
        );

        assert.equal(notificationRead.response.status, 200);
        assert.equal(notificationRead.body.data.is_read, true);
      }

      const noteDelete = await requestJson(`/api/v1/notes/${createdNoteId}`, {
        headers: createJsonHeaders(activeToken),
        method: "DELETE"
      });

      assert.equal(noteDelete.response.status, 204);
      createdNoteId = null;

      const habitDelete = await requestJson(`/api/v1/habits/${createdHabitId}`, {
        headers: createJsonHeaders(activeToken),
        method: "DELETE"
      });

      assert.equal(habitDelete.response.status, 204);
      createdHabitId = null;

      const goalDelete = await requestJson(`/api/v1/goals/${createdGoalId}`, {
        headers: createJsonHeaders(activeToken),
        method: "DELETE"
      });

      assert.equal(goalDelete.response.status, 204);
      createdGoalId = null;

      const goalAfterDelete = await requestJson(`/api/v1/goals/${goalDetail.body.data.id}`, {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      assert.equal(goalAfterDelete.response.status, 404);

      const apiV1Logout = await requestJson("/api/v1/auth/logout", {
        headers: createJsonHeaders(activeToken),
        method: "POST"
      });

      assert.equal(apiV1Logout.response.status, 200);
      activeToken = null;
    } finally {
      if (prisma && createdNotificationId) {
        try {
          await prisma.notification.deleteMany({
            where: {
              id: createdNotificationId
            }
          });
        } catch {}
      }

      if (activeToken && createdNoteId) {
        try {
          await requestJson(`/api/v1/notes/${createdNoteId}`, {
            headers: createJsonHeaders(activeToken),
            method: "DELETE"
          });
        } catch {}
      }

      if (activeToken && createdHabitId) {
        try {
          await requestJson(`/api/v1/habits/${createdHabitId}`, {
            headers: createJsonHeaders(activeToken),
            method: "DELETE"
          });
        } catch {}
      }

      if (activeToken && createdGoalId) {
        try {
          await requestJson(`/api/v1/goals/${createdGoalId}`, {
            headers: createJsonHeaders(activeToken),
            method: "DELETE"
          });
        } catch {}
      }

      if (prisma) {
        await prisma.$disconnect();
      }

      await stopServer(serverProcess);
    }
  }
);
