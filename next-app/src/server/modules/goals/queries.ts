import "server-only";

import type { Prisma } from "@prisma/client";
import {
  clampProgress,
  goalPriorityFromPrisma,
  goalStatusFromPrisma,
  goalTypeFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import type {
  GoalDetail,
  GoalLogSummary,
  GoalFormValues,
  GoalListItem,
  GoalMilestoneSummary,
  GoalTaskSummary,
  GoalMetadataOption
} from "@/features/goals/types";
import { formatDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

const goalListSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  goalType: true,
  priority: true,
  status: true,
  progressPercentage: true,
  startDate: true,
  targetDate: true,
  note: true,
  category: {
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
      deletedAt: true
    }
  },
  tagLinks: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          color: true,
          deletedAt: true
        }
      }
    }
  },
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      tasks: {
        where: {
          deletedAt: null
        }
      },
      milestones: {
        where: {
          deletedAt: null
        }
      }
    }
  }
} satisfies Prisma.GoalSelect;

const goalDetailSelect = {
  ...goalListSelect,
  completedAt: true,
  logs: {
    orderBy: {
      loggedAt: "desc"
    },
    take: 12,
    select: {
      id: true,
      logType: true,
      title: true,
      content: true,
      progressSnapshot: true,
      loggedAt: true,
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
  },
  milestones: {
    where: {
      deletedAt: null
    },
    orderBy: {
      sequenceNo: "asc"
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      progressPercentage: true,
      startDate: true,
      targetDate: true,
      completedAt: true,
      sequenceNo: true,
      note: true,
      _count: {
        select: {
          tasks: {
            where: {
              deletedAt: null
            }
          }
        }
      },
      tasks: {
        where: {
          deletedAt: null
        },
        orderBy: [{ isFocus: "desc" }, { sortOrder: "asc" }, { dueAt: "asc" }],
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          progressPercentage: true,
          dueAt: true,
          estimatedMinutes: true,
          actualMinutes: true,
          isFocus: true,
          startedAt: true,
          completedAt: true,
          sortOrder: true
        }
      }
    }
  }
} satisfies Prisma.GoalSelect;

const goalEditSelect = {
  id: true,
  title: true,
  description: true,
  goalType: true,
  priority: true,
  status: true,
  startDate: true,
  targetDate: true,
  note: true,
  categoryId: true,
  tagLinks: {
    select: {
      tagId: true
    }
  }
} satisfies Prisma.GoalSelect;

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function mapTask(task: Prisma.TaskGetPayload<{ select: (typeof goalDetailSelect)["milestones"]["select"]["tasks"]["select"] }>): GoalTaskSummary {
  return {
    id: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: workStatusFromPrisma[task.status],
    priority: goalPriorityFromPrisma[task.priority],
    progress: clampProgress(toNumber(task.progressPercentage)),
    dueAt: task.dueAt?.toISOString() ?? null,
    isFocus: task.isFocus,
    estimatedMinutes: task.estimatedMinutes ?? null,
    actualMinutes: task.actualMinutes ?? null,
    startedAt: task.startedAt?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    sortOrder: task.sortOrder
  };
}

function mapMilestone(
  milestone: Prisma.MilestoneGetPayload<{
    select: (typeof goalDetailSelect)["milestones"]["select"];
  }>
): GoalMilestoneSummary {
  return {
    id: milestone.id.toString(),
    title: milestone.title,
    description: milestone.description ?? "",
    status: workStatusFromPrisma[milestone.status],
    progress: clampProgress(toNumber(milestone.progressPercentage)),
    startDate: formatDateInput(milestone.startDate),
    targetDate: formatDateInput(milestone.targetDate),
    completedAt: milestone.completedAt?.toISOString() ?? null,
    sequenceNo: milestone.sequenceNo,
    note: milestone.note ?? null,
    tasksCount: milestone._count.tasks,
    tasks: milestone.tasks.map(mapTask)
  };
}

function mapGoal(
  goal: Prisma.GoalGetPayload<{ select: typeof goalListSelect }>
): GoalListItem {
  const category =
    goal.category && !goal.category.deletedAt
      ? {
          id: goal.category.id.toString(),
          name: goal.category.name,
          color: goal.category.color ?? null,
          icon: goal.category.icon ?? null
        }
      : null;
  const tags = goal.tagLinks
    .filter((tagLink) => !tagLink.tag.deletedAt)
    .map((tagLink) => ({
      id: tagLink.tag.id.toString(),
      name: tagLink.tag.name,
      color: tagLink.tag.color ?? null
    }));

  return {
    id: goal.id.toString(),
    title: goal.title,
    slug: goal.slug,
    description: goal.description ?? "",
    goalType: goalTypeFromPrisma[goal.goalType],
    priority: goalPriorityFromPrisma[goal.priority],
    status: goalStatusFromPrisma[goal.status],
    progress: clampProgress(toNumber(goal.progressPercentage)),
    startDate: formatDateInput(goal.startDate),
    targetDate: formatDateInput(goal.targetDate),
    note: goal.note ?? null,
    category,
    tags,
    tasksCount: goal._count.tasks,
    milestonesCount: goal._count.milestones,
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString()
  };
}

function mapGoalLog(
  log: Prisma.GoalLogGetPayload<{
    select: (typeof goalDetailSelect)["logs"]["select"];
  }>
): GoalLogSummary {
  return {
    id: log.id.toString(),
    logType: log.logType.toLowerCase(),
    title: log.title ?? null,
    content: log.content ?? null,
    progressSnapshot:
      log.progressSnapshot === null ? null : toNumber(log.progressSnapshot),
    loggedAt: log.loggedAt.toISOString(),
    milestoneTitle: log.milestone?.title ?? null,
    taskTitle: log.task?.title ?? null
  };
}

export async function listGoalsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [
      {
        sortOrder: "asc"
      },
      {
        targetDate: "asc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: goalListSelect
  });

  return goals.map(mapGoal);
}

export async function getGoalDetailForUser(userId: bigint, goalId: bigint) {
  const prisma = getPrismaClient();
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
      deletedAt: null
    },
    select: goalDetailSelect
  });

  if (!goal) {
    return null;
  }

  const baseGoal = mapGoal(goal);

  const detail: GoalDetail = {
    ...baseGoal,
    completedAt: goal.completedAt?.toISOString() ?? null,
    milestones: goal.milestones.map(mapMilestone),
    logs: goal.logs.map(mapGoalLog)
  };

  return detail;
}

export async function getGoalFormValuesForUser(userId: bigint, goalId: bigint) {
  const prisma = getPrismaClient();
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
      deletedAt: null
    },
    select: goalEditSelect
  });

  if (!goal) {
    return null;
  }

  const values: GoalFormValues = {
    title: goal.title,
    description: goal.description ?? "",
    goalType: goalTypeFromPrisma[goal.goalType],
    priority: goalPriorityFromPrisma[goal.priority],
    status: goalStatusFromPrisma[goal.status],
    startDate: formatDateInput(goal.startDate),
    targetDate: formatDateInput(goal.targetDate),
    note: goal.note ?? "",
    categoryId: goal.categoryId?.toString() ?? "",
    tagIds: goal.tagLinks.map((tagLink) => tagLink.tagId.toString())
  };

  return values;
}

export async function listGoalMetadataOptions(userId: bigint) {
  const prisma = getPrismaClient();
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      where: {
        deletedAt: null,
        OR: [{ userId }, { userId: null }],
        type: {
          in: ["GOAL", "ALL"]
        }
      },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        color: true,
        icon: true
      }
    }),
    prisma.tag.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        color: true
      }
    })
  ]);

  return {
    categories: categories.map<GoalMetadataOption>((category) => ({
      id: category.id.toString(),
      name: category.name,
      color: category.color ?? null,
      icon: category.icon ?? null
    })),
    tags: tags.map<GoalMetadataOption>((tag) => ({
      id: tag.id.toString(),
      name: tag.name,
      color: tag.color ?? null
    }))
  };
}
