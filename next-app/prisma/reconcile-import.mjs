import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { chunkArray } from "./legacy-import-helpers.mjs";
import {
  areDatesEqual,
  calculateCompletionProgressFromStatuses,
  calculateGoalProgressForImport,
  calculateHabitMetricsForImport,
  hasProgressChanged,
  normalizeCompletedAt
} from "./reconcile-import-helpers.mjs";

const WRITE_MODE = process.argv.includes("--write");
const SCOPES_ARG = process.argv.find((argument) => {
  return argument.startsWith("--scopes=");
});
const REQUESTED_SCOPES = SCOPES_ARG
  ? new Set(
      SCOPES_ARG
        .slice("--scopes=".length)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  : null;

function formatCount(value) {
  return `${value}`.padStart(6, " ");
}

function createScopeResult(key, totalRows) {
  return {
    changes: [],
    counters: {},
    key,
    totalRows
  };
}

function incrementCounter(result, key) {
  result.counters[key] = (result.counters[key] ?? 0) + 1;
}

function createUpdateCollector(result, id) {
  const data = {};

  return {
    data,
    finish() {
      if (Object.keys(data).length > 0) {
        result.changes.push({
          data,
          id
        });
      }
    }
  };
}

async function analyzeTasks(prisma) {
  const tasks = await prisma.task.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      completedAt: true,
      id: true,
      status: true,
      updatedAt: true
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("tasks", tasks.length);

  for (const task of tasks) {
    const update = createUpdateCollector(result, task.id);
    const nextCompletedAt = normalizeCompletedAt({
      completedAt: task.completedAt,
      fallbackDates: [task.updatedAt],
      status: task.status
    });

    if (!areDatesEqual(task.completedAt, nextCompletedAt)) {
      update.data.completedAt = nextCompletedAt;
      incrementCounter(result, "completedAtAdjusted");
    }

    update.finish();
  }

  return result;
}

async function analyzeSubtasks(prisma) {
  const subtasks = await prisma.subtask.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      completedAt: true,
      id: true,
      status: true,
      updatedAt: true
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("subtasks", subtasks.length);

  for (const subtask of subtasks) {
    const update = createUpdateCollector(result, subtask.id);
    const nextCompletedAt = normalizeCompletedAt({
      completedAt: subtask.completedAt,
      fallbackDates: [subtask.updatedAt],
      status: subtask.status
    });

    if (!areDatesEqual(subtask.completedAt, nextCompletedAt)) {
      update.data.completedAt = nextCompletedAt;
      incrementCounter(result, "completedAtAdjusted");
    }

    update.finish();
  }

  return result;
}

async function analyzeMilestones(prisma) {
  const milestones = await prisma.milestone.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      completedAt: true,
      id: true,
      progressPercentage: true,
      status: true,
      tasks: {
        select: {
          completedAt: true,
          status: true,
          updatedAt: true
        },
        where: {
          deletedAt: null
        }
      },
      updatedAt: true
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("milestones", milestones.length);

  for (const milestone of milestones) {
    const update = createUpdateCollector(result, milestone.id);
    const nextProgress = calculateCompletionProgressFromStatuses(
      milestone.tasks.map((task) => task.status)
    );
    const nextCompletedAt = normalizeCompletedAt({
      completedAt: milestone.completedAt,
      fallbackDates: [
        ...milestone.tasks.map((task) => task.completedAt),
        ...milestone.tasks.map((task) => task.updatedAt),
        milestone.updatedAt
      ],
      status: milestone.status
    });

    if (
      hasProgressChanged(Number(milestone.progressPercentage ?? 0), nextProgress)
    ) {
      update.data.progressPercentage = nextProgress;
      incrementCounter(result, "progressAdjusted");
    }

    if (!areDatesEqual(milestone.completedAt, nextCompletedAt)) {
      update.data.completedAt = nextCompletedAt;
      incrementCounter(result, "completedAtAdjusted");
    }

    update.finish();
  }

  return result;
}

async function analyzeGoals(prisma) {
  const goals = await prisma.goal.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      completedAt: true,
      id: true,
      milestones: {
        select: {
          completedAt: true,
          progressPercentage: true,
          updatedAt: true
        },
        where: {
          deletedAt: null
        }
      },
      progressPercentage: true,
      status: true,
      tasks: {
        select: {
          completedAt: true,
          status: true,
          updatedAt: true
        },
        where: {
          deletedAt: null
        }
      },
      updatedAt: true
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("goals", goals.length);

  for (const goal of goals) {
    const update = createUpdateCollector(result, goal.id);
    const nextProgress = calculateGoalProgressForImport({
      milestoneProgressValues: goal.milestones.map(
        (milestone) => milestone.progressPercentage
      ),
      taskStatuses: goal.tasks.map((task) => task.status)
    });
    const nextCompletedAt = normalizeCompletedAt({
      completedAt: goal.completedAt,
      fallbackDates: [
        ...goal.milestones.map((milestone) => milestone.completedAt),
        ...goal.milestones.map((milestone) => milestone.updatedAt),
        ...goal.tasks.map((task) => task.completedAt),
        ...goal.tasks.map((task) => task.updatedAt),
        goal.updatedAt
      ],
      status: goal.status
    });

    if (hasProgressChanged(Number(goal.progressPercentage ?? 0), nextProgress)) {
      update.data.progressPercentage = nextProgress;
      incrementCounter(result, "progressAdjusted");
    }

    if (!areDatesEqual(goal.completedAt, nextCompletedAt)) {
      update.data.completedAt = nextCompletedAt;
      incrementCounter(result, "completedAtAdjusted");
    }

    update.finish();
  }

  return result;
}

async function analyzeProjects(prisma) {
  const projects = await prisma.project.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      id: true,
      progressPercentage: true,
      tasks: {
        select: {
          status: true
        },
        where: {
          deletedAt: null
        }
      }
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("projects", projects.length);

  for (const project of projects) {
    const update = createUpdateCollector(result, project.id);
    const nextProgress = calculateCompletionProgressFromStatuses(
      project.tasks.map((task) => task.status)
    );

    if (
      hasProgressChanged(Number(project.progressPercentage ?? 0), nextProgress)
    ) {
      update.data.progressPercentage = nextProgress;
      incrementCounter(result, "progressAdjusted");
    }

    update.finish();
  }

  return result;
}

async function analyzeHabits(prisma) {
  const habits = await prisma.habit.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      bestStreak: true,
      currentStreak: true,
      frequency: true,
      id: true,
      lastLoggedAt: true,
      logs: {
        orderBy: {
          logDate: "desc"
        },
        select: {
          isCompleted: true,
          logDate: true
        }
      },
      user: {
        select: {
          weekStartsOn: true
        }
      }
    },
    where: {
      deletedAt: null
    }
  });
  const result = createScopeResult("habits", habits.length);

  for (const habit of habits) {
    const update = createUpdateCollector(result, habit.id);
    const metrics = calculateHabitMetricsForImport({
      frequency: habit.frequency,
      logs: habit.logs,
      weekStartsOn: habit.user.weekStartsOn
    });

    if (habit.currentStreak !== metrics.currentStreak) {
      update.data.currentStreak = metrics.currentStreak;
      incrementCounter(result, "currentStreakAdjusted");
    }

    if (habit.bestStreak !== metrics.bestStreak) {
      update.data.bestStreak = metrics.bestStreak;
      incrementCounter(result, "bestStreakAdjusted");
    }

    if (!areDatesEqual(habit.lastLoggedAt, metrics.lastLoggedAt)) {
      update.data.lastLoggedAt = metrics.lastLoggedAt;
      incrementCounter(result, "lastLoggedAtAdjusted");
    }

    update.finish();
  }

  return result;
}

const SCOPE_ANALYZERS = [
  {
    analyze: analyzeTasks,
    key: "tasks",
    modelName: "task"
  },
  {
    analyze: analyzeSubtasks,
    key: "subtasks",
    modelName: "subtask"
  },
  {
    analyze: analyzeMilestones,
    key: "milestones",
    modelName: "milestone"
  },
  {
    analyze: analyzeGoals,
    key: "goals",
    modelName: "goal"
  },
  {
    analyze: analyzeProjects,
    key: "projects",
    modelName: "project"
  },
  {
    analyze: analyzeHabits,
    key: "habits",
    modelName: "habit"
  }
];

function getActiveScopes() {
  return SCOPE_ANALYZERS.filter((scope) => {
    return !REQUESTED_SCOPES || REQUESTED_SCOPES.has(scope.key);
  });
}

function printSummary(results) {
  console.log("");
  console.log("Legacy import reconciliation plan");
  console.log("================================");
  console.log(`Mode   : ${WRITE_MODE ? "WRITE" : "DRY RUN"}`);
  console.log(`Scopes : ${results.length}`);
  console.log("");
  console.log("Counts");
  console.log("------");

  for (const result of results) {
    console.log(
      `${result.key.padEnd(12, " ")} rows=${formatCount(result.totalRows)} changed=${formatCount(result.changes.length)}`
    );

    for (const [counterKey, counterValue] of Object.entries(result.counters)) {
      console.log(`  - ${counterKey}: ${counterValue}`);
    }
  }

  console.log("");
}

async function applyResultChanges(prisma, scope, result) {
  for (const chunk of chunkArray(result.changes, 100)) {
    await prisma.$transaction(
      chunk.map((change) => {
        return prisma[scope.modelName].update({
          data: change.data,
          where: {
            id: change.id
          }
        });
      })
    );
  }
}

async function main() {
  const databaseUrl = process.env["DATABASE_URL"]?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Point it to the Prisma target database.");
  }

  const prisma = new PrismaClient();

  try {
    const activeScopes = getActiveScopes();
    const results = [];

    for (const scope of activeScopes) {
      results.push(await scope.analyze(prisma));
    }

    printSummary(results);

    if (!WRITE_MODE) {
      console.log(
        "Dry run complete. Re-run with --write to persist reconciled progress and timestamps."
      );
      return;
    }

    console.log("Applying reconciliation updates...");

    for (const scope of activeScopes) {
      const result = results.find((item) => item.key === scope.key);

      if (!result || result.changes.length === 0) {
        console.log(`- ${scope.key}: no changes`);
        continue;
      }

      await applyResultChanges(prisma, scope, result);
      console.log(`- ${scope.key}: updated ${result.changes.length} row(s)`);
    }

    console.log("");
    console.log("Legacy import reconciliation completed successfully.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Legacy import reconciliation failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
