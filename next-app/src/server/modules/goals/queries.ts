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
  GoalFormValues,
  GoalListItem,
  GoalMilestoneSummary,
  GoalTaskSummary
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
  note: true
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
    tasksCount: goal._count.tasks,
    milestonesCount: goal._count.milestones,
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString()
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
    milestones: goal.milestones.map(mapMilestone)
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
    note: goal.note ?? ""
  };

  return values;
}
