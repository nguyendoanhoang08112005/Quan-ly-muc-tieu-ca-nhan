import "server-only";

import {
  clampProgress,
  goalPriorityFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import type {
  SubtaskSummary,
  TaskFormValues,
  TaskListItem
} from "@/features/tasks/types";
import { formatDateTimeLocalInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function mapSubtask(subtask: {
  id: bigint;
  name: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  completedAt: Date | null;
  sortOrder: number;
}): SubtaskSummary {
  return {
    id: subtask.id.toString(),
    name: subtask.name,
    status: subtask.status.toLowerCase() as SubtaskSummary["status"],
    completedAt: subtask.completedAt?.toISOString() ?? null,
    sortOrder: subtask.sortOrder
  };
}

function mapTaskListItem(task: {
  id: bigint;
  title: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  sortOrder: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progressPercentage: number | { toNumber(): number } | null;
  dueAt: Date | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  isFocus: boolean;
  goal: {
    id: bigint;
    title: string;
  };
  milestone: {
    id: bigint;
    title: string;
    sequenceNo: number;
  } | null;
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
}): TaskListItem {
  const subtasks = task.subtasks.map(mapSubtask);
  const completedSubtasksCount = subtasks.filter((subtask) => {
    return subtask.status === "completed";
  }).length;

  return {
    id: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: workStatusFromPrisma[task.status],
    sortOrder: task.sortOrder,
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
    milestoneSequenceNo: task.milestone?.sequenceNo ?? null,
    project: task.project
      ? {
          id: task.project.id.toString(),
          name: task.project.name,
          color: task.project.color ?? null
        }
      : null,
    subtasks,
    subtasksCount: subtasks.length,
    completedSubtasksCount
  };
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
      sortOrder: true,
      priority: true,
      dueAt: true,
      estimatedMinutes: true,
      projectId: true,
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
    projectId: task.projectId?.toString() ?? "",
    isFocus: task.isFocus
  };

  return values;
}

export async function findTaskGoalIdForUser(userId: bigint, taskId: bigint) {
  const prisma = getPrismaClient();
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null
    },
    select: {
      goalId: true
    }
  });

  return task?.goalId ?? null;
}

export async function getTaskDetailForUser(userId: bigint, taskId: bigint) {
  const prisma = getPrismaClient();
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      sortOrder: true,
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
      },
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
  });

  if (!task) {
    return null;
  }

  return mapTaskListItem(task);
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
      sortOrder: true,
      priority: true,
      progressPercentage: true,
      dueAt: true,
      estimatedMinutes: true,
      actualMinutes: true,
      isFocus: true,
      project: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
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
  });

  return tasks.map(mapTaskListItem);
}
