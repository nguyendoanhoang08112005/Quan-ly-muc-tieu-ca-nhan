import "server-only";

import {
  clampProgress,
  goalPriorityFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import type { TaskFormValues, TaskListItem } from "@/features/tasks/types";
import { formatDateTimeLocalInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

export async function getTaskFormValuesForUser(
  userId: bigint,
  goalId: bigint,
  taskId: bigint
) {
  const prisma = getPrismaClient();
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      goalId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueAt: true,
      estimatedMinutes: true,
      isFocus: true
    }
  });

  if (!task) {
    return null;
  }

  const values: TaskFormValues = {
    title: task.title,
    description: task.description ?? "",
    status: workStatusFromPrisma[task.status],
    priority: goalPriorityFromPrisma[task.priority],
    dueAt: formatDateTimeLocalInput(task.dueAt),
    estimatedMinutes: task.estimatedMinutes ? String(task.estimatedMinutes) : "",
    isFocus: task.isFocus
  };

  return values;
}

export async function listTasksForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [
      {
        isFocus: "desc"
      },
      {
        dueAt: "asc"
      },
      {
        sortOrder: "asc"
      },
      {
        createdAt: "desc"
      }
    ],
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
  });

  return tasks.map((task): TaskListItem => {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description ?? "",
      status: workStatusFromPrisma[task.status],
      priority: goalPriorityFromPrisma[task.priority],
      progress: clampProgress(toNumber(task.progressPercentage)),
      dueAt: task.dueAt?.toISOString() ?? null,
      estimatedMinutes: task.estimatedMinutes ?? null,
      actualMinutes: task.actualMinutes ?? null,
      isFocus: task.isFocus,
      goalId: task.goal.id.toString(),
      goalTitle: task.goal.title,
      milestoneId: task.milestone?.id.toString() ?? null,
      milestoneTitle: task.milestone?.title ?? null,
      milestoneSequenceNo: task.milestone?.sequenceNo ?? null
    };
  });
}
