import "server-only";

import {
  goalPriorityFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import type {
  DashboardOverview,
  DashboardRecentLog,
  DashboardUpcomingTask
} from "@/features/dashboard/types";
import { getPrismaClient } from "@/lib/db/prisma";
import { listGoalsForUser } from "@/server/modules/goals/queries";

const ACTIVE_GOAL_STATUSES = new Set(["not_started", "in_progress", "paused"]);

function getTodayRange() {
  const now = new Date();
  const startOfDay = new Date(now);
  const endOfDay = new Date(now);
  const upcomingEnd = new Date(now);

  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);
  upcomingEnd.setDate(upcomingEnd.getDate() + 7);
  upcomingEnd.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
    upcomingEnd
  };
}

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

export async function getDashboardOverviewForUser(
  userId: bigint
): Promise<DashboardOverview> {
  const prisma = getPrismaClient();
  const { startOfDay, endOfDay, upcomingEnd } = getTodayRange();

  const [
    goals,
    activeGoalsCount,
    completedGoalsCount,
    tasksTodayCount,
    overdueTasksCount,
    upcomingTasks,
    recentLogs,
    categoriesCount,
    tagsCount
  ] = await Promise.all([
    listGoalsForUser(userId),
    prisma.goal.count({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
        status: {
          in: ["NOT_STARTED", "IN_PROGRESS", "PAUSED"]
        }
      }
    }),
    prisma.goal.count({
      where: {
        userId,
        deletedAt: null,
        status: "COMPLETED"
      }
    }),
    prisma.task.count({
      where: {
        userId,
        deletedAt: null,
        dueAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: "COMPLETED"
        }
      }
    }),
    prisma.task.count({
      where: {
        userId,
        deletedAt: null,
        dueAt: {
          lt: startOfDay
        },
        status: {
          not: "COMPLETED"
        }
      }
    }),
    prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        dueAt: {
          gte: startOfDay,
          lte: upcomingEnd
        },
        status: {
          not: "COMPLETED"
        }
      },
      orderBy: [{ dueAt: "asc" }, { isFocus: "desc" }, { sortOrder: "asc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueAt: true,
        isFocus: true,
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        milestone: {
          select: {
            id: true,
            title: true,
            sequenceNo: true
          }
        }
      }
    }),
    prisma.goalLog.findMany({
      where: {
        userId
      },
      orderBy: {
        loggedAt: "desc"
      },
      take: 8,
      select: {
        id: true,
        logType: true,
        title: true,
        content: true,
        progressSnapshot: true,
        loggedAt: true,
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        milestone: {
          select: {
            title: true
          }
        },
        task: {
          select: {
            title: true
          }
        }
      }
    }),
    prisma.category.count({
      where: {
        deletedAt: null,
        OR: [{ userId }, { userId: null }],
        type: {
          in: ["GOAL", "ALL"]
        }
      }
    }),
    prisma.tag.count({
      where: {
        userId,
        deletedAt: null
      }
    })
  ]);

  const activeGoals = goals
    .filter((goal) => ACTIVE_GOAL_STATUSES.has(goal.status))
    .slice(0, 4);
  const nearestDeadlineGoal =
    [...activeGoals]
      .filter((goal): goal is typeof goal & { targetDate: string } => {
        return typeof goal.targetDate === "string" && goal.targetDate.length > 0;
      })
      .sort((left, right) => left.targetDate.localeCompare(right.targetDate))[0] ??
    null;

  return {
    summary: {
      activeGoals: activeGoalsCount,
      completedGoals: completedGoalsCount,
      tasksToday: tasksTodayCount,
      overdueTasks: overdueTasksCount
    },
    metadata: {
      categories: categoriesCount,
      tags: tagsCount,
      nearestDeadlineGoal
    },
    activeGoals,
    upcomingTasks: upcomingTasks.map<DashboardUpcomingTask>((task) => ({
      id: task.id.toString(),
      title: task.title,
      status: workStatusFromPrisma[task.status],
      priority: goalPriorityFromPrisma[task.priority],
      dueAt: task.dueAt?.toISOString() ?? null,
      isFocus: task.isFocus,
      goal: {
        id: task.goal.id.toString(),
        title: task.goal.title
      },
      milestone: task.milestone
        ? {
            id: task.milestone.id.toString(),
            title: task.milestone.title,
            sequenceNo: task.milestone.sequenceNo
          }
        : null
    })),
    recentLogs: recentLogs.map<DashboardRecentLog>((log) => ({
      id: log.id.toString(),
      logType: log.logType.toLowerCase(),
      title: log.title ?? null,
      content: log.content ?? null,
      progressSnapshot:
        log.progressSnapshot === null ? null : toNumber(log.progressSnapshot),
      loggedAt: log.loggedAt.toISOString(),
      goal: {
        id: log.goal.id.toString(),
        title: log.goal.title
      },
      milestoneTitle: log.milestone?.title ?? null,
      taskTitle: log.task?.title ?? null
    }))
  };
}
