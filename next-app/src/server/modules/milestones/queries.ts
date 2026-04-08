import "server-only";

import {
  clampProgress,
  goalPriorityFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import type { GoalMilestoneSummary } from "@/features/goals/types";
import type { MilestoneFormValues } from "@/features/milestones/types";
import { formatDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function mapMilestoneSummary(milestone: {
  id: bigint;
  goalId: bigint;
  title: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  progressPercentage: number | { toNumber(): number } | null;
  startDate: Date | null;
  targetDate: Date | null;
  completedAt: Date | null;
  sequenceNo: number;
  note: string | null;
  _count: {
    tasks: number;
  };
  tasks: Array<{
    id: bigint;
    title: string;
    description: string | null;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    progressPercentage: number | { toNumber(): number } | null;
    dueAt: Date | null;
    estimatedMinutes: number | null;
    actualMinutes: number | null;
    isFocus: boolean;
    startedAt: Date | null;
    completedAt: Date | null;
    sortOrder: number;
    project: {
      id: bigint;
      name: string;
      color: string | null;
    } | null;
    subtasks: Array<{
      id: bigint;
      name: string;
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
      completedAt: Date | null;
      sortOrder: number;
    }>;
  }>;
}): GoalMilestoneSummary {
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
    tasks: milestone.tasks.map((task) => ({
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
      sortOrder: task.sortOrder,
      project: task.project
        ? {
            id: task.project.id.toString(),
            name: task.project.name,
            color: task.project.color ?? null
          }
        : null,
      subtasks: task.subtasks.map((subtask) => ({
        id: subtask.id.toString(),
        name: subtask.name,
        status: subtask.status.toLowerCase() as GoalMilestoneSummary["tasks"][number]["subtasks"][number]["status"],
        completedAt: subtask.completedAt?.toISOString() ?? null,
        sortOrder: subtask.sortOrder
      })),
      subtasksCount: task.subtasks.length,
      completedSubtasksCount: task.subtasks.filter((subtask) => {
        return subtask.status === "COMPLETED";
      }).length
    }))
  };
}

export async function getMilestoneFormValuesForUser(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint
) {
  const prisma = getPrismaClient();
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      goalId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      startDate: true,
      targetDate: true,
      note: true,
      sequenceNo: true
    }
  });

  if (!milestone) {
    return null;
  }

  const values: MilestoneFormValues = {
    title: milestone.title,
    description: milestone.description ?? "",
    status: workStatusFromPrisma[milestone.status],
    startDate: formatDateInput(milestone.startDate),
    targetDate: formatDateInput(milestone.targetDate),
    note: milestone.note ?? "",
    sequenceNo: milestone.sequenceNo ? String(milestone.sequenceNo) : ""
  };

  return values;
}

export async function findMilestoneGoalIdForUser(
  userId: bigint,
  milestoneId: bigint
) {
  const prisma = getPrismaClient();
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      userId,
      deletedAt: null
    },
    select: {
      goalId: true
    }
  });

  return milestone?.goalId ?? null;
}

export async function getMilestoneDetailForUser(
  userId: bigint,
  milestoneId: bigint
) {
  const prisma = getPrismaClient();
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      goalId: true,
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
          sortOrder: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          subtasks: {
            where: {
              deletedAt: null
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              name: true,
              status: true,
              completedAt: true,
              sortOrder: true
            }
          }
        }
      }
    }
  });

  if (!milestone) {
    return null;
  }

  return {
    goalId: milestone.goalId.toString(),
    milestone: mapMilestoneSummary(milestone)
  };
}
