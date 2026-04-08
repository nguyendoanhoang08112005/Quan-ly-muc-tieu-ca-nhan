import "dotenv/config";
import * as mariadb from "mariadb";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  chunkArray,
  mapLegacyCategoryType,
  mapLegacyGoalLogType,
  mapLegacyGoalStatus,
  mapLegacyGoalType,
  mapLegacyPriority,
  mapLegacyWorkStatus,
  parseLegacyJson,
  toBigIntOrNull,
  toBoolean,
  toDateOrNow,
  toDateOrNull,
  toDecimalOrNull,
  toIntOrNull
} from "./legacy-import-helpers.mjs";

const WRITE_MODE = process.argv.includes("--write");
const ALLOW_NON_EMPTY_TARGET = process.argv.includes("--allow-non-empty-target");
const TABLES_ARG = process.argv.find((argument) => {
  return argument.startsWith("--tables=");
});
const REQUESTED_TABLES = TABLES_ARG
  ? new Set(
      TABLES_ARG
        .slice("--tables=".length)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  : null;

const EXPECTED_SOURCE_TABLES = [
  "users",
  "password_reset_tokens",
  "categories",
  "tags",
  "goals",
  "milestones",
  "tasks",
  "goal_tag",
  "goal_logs"
];

const OPTIONAL_LEGACY_TABLES = [
  "habits",
  "habit_logs",
  "notes",
  "notifications",
  "pomodoro_sessions",
  "projects",
  "subtasks",
  "follows"
];

const IMPORT_STEPS = [
  {
    key: "users",
    sourceTable: "users",
    targetCount: (prisma) => prisma.user.count(),
    insert: async (prisma, rows) => {
      return prisma.user.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          name: row.name,
          email: `${row.email}`.trim().toLowerCase(),
          emailVerifiedAt: toDateOrNull(row.email_verified_at),
          password: row.password,
          avatarPath: row.avatar_path || null,
          timezone: row.timezone || "Asia/Ho_Chi_Minh",
          locale: row.locale || "vi",
          rememberToken: row.remember_token || null,
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "password_reset_tokens",
    sourceTable: "password_reset_tokens",
    targetCount: (prisma) => prisma.passwordResetToken.count(),
    insert: async (prisma, rows) => {
      return prisma.passwordResetToken.createMany({
        data: rows.map((row) => ({
          email: `${row.email}`.trim().toLowerCase(),
          token: row.token,
          createdAt: toDateOrNull(row.created_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "categories",
    sourceTable: "categories",
    targetCount: (prisma) => prisma.category.count(),
    insert: async (prisma, rows) => {
      return prisma.category.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          name: row.name,
          slug: row.slug || null,
          color: row.color || null,
          icon: row.icon || null,
          type: mapLegacyCategoryType(row.type),
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at),
          deletedAt: toDateOrNull(row.deleted_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "tags",
    sourceTable: "tags",
    targetCount: (prisma) => prisma.tag.count(),
    insert: async (prisma, rows) => {
      return prisma.tag.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          name: row.name,
          color: row.color || null,
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at),
          deletedAt: toDateOrNull(row.deleted_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "goals",
    sourceTable: "goals",
    targetCount: (prisma) => prisma.goal.count(),
    insert: async (prisma, rows) => {
      return prisma.goal.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          categoryId: toBigIntOrNull(row.category_id),
          title: row.title,
          slug: row.slug || null,
          description: row.description || null,
          goalType: mapLegacyGoalType(row.goal_type),
          priority: mapLegacyPriority(row.priority),
          status: mapLegacyGoalStatus(row.status),
          progressPercentage: toDecimalOrNull(row.progress_percentage) ?? 0,
          startDate: toDateOrNull(row.start_date),
          targetDate: toDateOrNull(row.target_date),
          completedAt: toDateOrNull(row.completed_at),
          successMetric: row.success_metric || null,
          outcomeNote: row.outcome_note || null,
          note: row.note || null,
          isArchived: toBoolean(row.is_archived),
          isPublic: false,
          isRecurring: toBoolean(row.is_recurring),
          recurrenceRule: parseLegacyJson(row.recurrence_rule),
          sortOrder: toIntOrNull(row.sort_order) ?? 0,
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at),
          deletedAt: toDateOrNull(row.deleted_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "milestones",
    sourceTable: "milestones",
    targetCount: (prisma) => prisma.milestone.count(),
    insert: async (prisma, rows) => {
      return prisma.milestone.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          goalId: toBigIntOrNull(row.goal_id),
          title: row.title,
          description: row.description || null,
          status: mapLegacyWorkStatus(row.status),
          progressPercentage: toDecimalOrNull(row.progress_percentage) ?? 0,
          startDate: toDateOrNull(row.start_date),
          targetDate: toDateOrNull(row.target_date),
          completedAt: toDateOrNull(row.completed_at),
          sequenceNo: toIntOrNull(row.sequence_no) ?? 1,
          checklistJson: null,
          note: row.note || null,
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at),
          deletedAt: toDateOrNull(row.deleted_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "tasks",
    sourceTable: "tasks",
    targetCount: (prisma) => prisma.task.count(),
    insert: async (prisma, rows) => {
      return prisma.task.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          goalId: toBigIntOrNull(row.goal_id),
          milestoneId: toBigIntOrNull(row.milestone_id),
          parentTaskId: null,
          projectId: null,
          title: row.title,
          description: row.description || null,
          status: mapLegacyWorkStatus(row.status),
          priority: mapLegacyPriority(row.priority),
          progressPercentage: toDecimalOrNull(row.progress_percentage) ?? 0,
          dueAt: toDateOrNull(row.due_at),
          startedAt: toDateOrNull(row.started_at),
          completedAt: toDateOrNull(row.completed_at),
          estimatedMinutes: toIntOrNull(row.estimated_minutes),
          actualMinutes: toIntOrNull(row.actual_minutes),
          isFocus: toBoolean(row.is_focus),
          sortOrder: toIntOrNull(row.sort_order) ?? 0,
          metadata: parseLegacyJson(row.metadata),
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at),
          deletedAt: toDateOrNull(row.deleted_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "goal_tag",
    sourceTable: "goal_tag",
    targetCount: (prisma) => prisma.goalTag.count(),
    insert: async (prisma, rows) => {
      return prisma.goalTag.createMany({
        data: rows.map((row) => ({
          goalId: toBigIntOrNull(row.goal_id),
          tagId: toBigIntOrNull(row.tag_id),
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at ?? row.created_at)
        })),
        skipDuplicates: true
      });
    }
  },
  {
    key: "goal_logs",
    sourceTable: "goal_logs",
    targetCount: (prisma) => prisma.goalLog.count(),
    insert: async (prisma, rows) => {
      return prisma.goalLog.createMany({
        data: rows.map((row) => ({
          id: toBigIntOrNull(row.id),
          userId: toBigIntOrNull(row.user_id),
          goalId: toBigIntOrNull(row.goal_id),
          milestoneId: toBigIntOrNull(row.milestone_id),
          taskId: toBigIntOrNull(row.task_id),
          logType: mapLegacyGoalLogType(row.log_type),
          title: row.title || null,
          content: row.content || null,
          oldValue: parseLegacyJson(row.old_value),
          newValue: parseLegacyJson(row.new_value),
          progressSnapshot: toDecimalOrNull(row.progress_snapshot),
          loggedAt: toDateOrNow(row.logged_at),
          createdAt: toDateOrNow(row.created_at),
          updatedAt: toDateOrNow(row.updated_at)
        })),
        skipDuplicates: true
      });
    }
  }
];

function databaseUrlToMariaDbConfig(databaseUrl) {
  const url = new URL(databaseUrl);

  if (!["mysql:", "mariadb:"].includes(url.protocol)) {
    throw new Error(
      `Unsupported LEGACY_DATABASE_URL protocol "${url.protocol}". Use mysql:// or mariadb://.`
    );
  }

  return {
    database: url.pathname.replace(/^\//, ""),
    host: url.hostname,
    password: decodeURIComponent(url.password),
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username)
  };
}

function getSourceQueryForTable(tableName) {
  switch (tableName) {
    case "goal_tag":
      return "SELECT * FROM goal_tag ORDER BY goal_id ASC, tag_id ASC";
    case "password_reset_tokens":
      return "SELECT * FROM password_reset_tokens ORDER BY email ASC";
    default:
      return `SELECT * FROM ${tableName} ORDER BY id ASC`;
  }
}

function formatCount(value) {
  return `${value}`.padStart(6, " ");
}

async function listSourceTables(connection) {
  const rows = await connection.query("SHOW TABLES");

  return new Set(
    rows
      .map((row) => Object.values(row)[0])
      .filter((value) => typeof value === "string")
  );
}

async function countSourceRows(connection, tableName) {
  const rows = await connection.query(`SELECT COUNT(*) AS count FROM ${tableName}`);

  return Number(rows[0]?.count ?? 0);
}

async function readSourceRows(connection, tableName) {
  return connection.query(getSourceQueryForTable(tableName));
}

async function getTargetCounts(prisma) {
  const counts = {};

  for (const step of IMPORT_STEPS) {
    counts[step.key] = await step.targetCount(prisma);
  }

  return counts;
}

async function insertInChunks(runInsert, prisma, rows) {
  let insertedRows = 0;

  for (const chunk of chunkArray(rows, 200)) {
    const result = await runInsert(prisma, chunk);
    insertedRows += result.count ?? chunk.length;
  }

  return insertedRows;
}

function printPlan({
  availableSourceTables,
  missingExpectedTables,
  missingOptionalTables,
  sourceCounts,
  targetCounts,
  activeSteps
}) {
  console.log("");
  console.log("Legacy data migration plan");
  console.log("==========================");
  console.log(`Mode               : ${WRITE_MODE ? "WRITE" : "DRY RUN"}`);
  console.log(`Source tables found: ${availableSourceTables.length}`);
  console.log(`Import steps       : ${activeSteps.length}`);
  console.log("");

  if (missingExpectedTables.length > 0) {
    console.log("Missing expected legacy tables:");
    for (const tableName of missingExpectedTables) {
      console.log(`- ${tableName}`);
    }
    console.log("");
  }

  if (missingOptionalTables.length > 0) {
    console.log("Legacy tables not found for extended domains:");
    for (const tableName of missingOptionalTables) {
      console.log(`- ${tableName}`);
    }
    console.log("");
  }

  console.log("Counts");
  console.log("------");
  for (const step of activeSteps) {
    console.log(
      `${step.key.padEnd(22, " ")} source=${formatCount(sourceCounts[step.key] ?? 0)} target=${formatCount(targetCounts[step.key] ?? 0)}`
    );
  }
  console.log("");
}

async function main() {
  const legacyDatabaseUrl = process.env["LEGACY_DATABASE_URL"]?.trim();
  const targetDatabaseUrl = process.env["DATABASE_URL"]?.trim();

  if (!legacyDatabaseUrl) {
    throw new Error(
      "LEGACY_DATABASE_URL is required. Point it to the old Laravel MySQL database."
    );
  }

  if (!targetDatabaseUrl) {
    throw new Error("DATABASE_URL is required. Point it to the Prisma target database.");
  }

  if (legacyDatabaseUrl === targetDatabaseUrl) {
    throw new Error(
      "LEGACY_DATABASE_URL and DATABASE_URL must not be the same. Use separate source and target databases."
    );
  }

  const legacyPool = mariadb.createPool({
    connectionLimit: 2,
    ...databaseUrlToMariaDbConfig(legacyDatabaseUrl)
  });
  const legacyConnection = await legacyPool.getConnection();
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(targetDatabaseUrl)
  });

  try {
    const sourceTableSet = await listSourceTables(legacyConnection);
    const availableSourceTables = EXPECTED_SOURCE_TABLES.filter((tableName) => {
      return sourceTableSet.has(tableName);
    });
    const missingExpectedTables = EXPECTED_SOURCE_TABLES.filter((tableName) => {
      return !sourceTableSet.has(tableName);
    });
    const missingOptionalTables = OPTIONAL_LEGACY_TABLES.filter((tableName) => {
      return !sourceTableSet.has(tableName);
    });
    const activeSteps = IMPORT_STEPS.filter((step) => {
      return (
        sourceTableSet.has(step.sourceTable) &&
        (!REQUESTED_TABLES || REQUESTED_TABLES.has(step.key))
      );
    });

    const sourceCounts = {};

    for (const step of activeSteps) {
      sourceCounts[step.key] = await countSourceRows(
        legacyConnection,
        step.sourceTable
      );
    }

    const targetCounts = await getTargetCounts(prisma);

    printPlan({
      activeSteps,
      availableSourceTables,
      missingExpectedTables,
      missingOptionalTables,
      sourceCounts,
      targetCounts
    });

    if (!WRITE_MODE) {
      console.log("Dry run complete. Re-run with --write to insert into the target database.");
      return;
    }

    if (!ALLOW_NON_EMPTY_TARGET) {
      const nonEmptyTargets = activeSteps.filter((step) => {
        return (targetCounts[step.key] ?? 0) > 0;
      });

      if (nonEmptyTargets.length > 0) {
        throw new Error(
          `Target database is not empty for: ${nonEmptyTargets
            .map((step) => step.key)
            .join(", ")}. Re-run with --allow-non-empty-target if you really want to merge.`
        );
      }
    }

    console.log("Starting legacy import...");

    for (const step of activeSteps) {
      const rows = await readSourceRows(legacyConnection, step.sourceTable);

      if (!rows.length) {
        console.log(`- ${step.key}: no rows to import`);
        continue;
      }

      const insertedCount = await insertInChunks(step.insert, prisma, rows);

      console.log(
        `- ${step.key}: imported ${insertedCount} row(s) from ${step.sourceTable}`
      );
    }

    console.log("");
    console.log("Legacy import completed successfully.");
    console.log(
      'Next step: run "npm run legacy:reconcile -- --write" to recalculate derived progress, streaks, and completion timestamps.'
    );
  } finally {
    await prisma.$disconnect();
    legacyConnection.release();
    await legacyPool.end();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Legacy import failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
