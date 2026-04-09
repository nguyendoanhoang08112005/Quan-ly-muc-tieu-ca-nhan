import "server-only";

import type { Prisma, PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateTimeLocalInput } from "@/lib/dates";
import {
  goalPriorityToPrisma,
  workStatusToPrisma
} from "@/features/goals/goal-helpers";
import type { TaskFormInput } from "@/features/tasks/schemas/task-schemas";
import { syncGoalProgress, syncMilestoneProgress } from "@/server/modules/goals/progress";
import { syncProjectProgress } from "@/server/modules/projects/progress";

async function resolveTaskProjectId(
  prisma: PrismaClient | Prisma.TransactionClient,
  userId: bigint,
  goalId: bigint,
  projectId: string | undefined
) {
  if (!projectId) {
    return null;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: BigInt(projectId),
      userId,
      deletedAt: null,
      OR: [{ goalId: null }, { goalId }]
    },
    select: {
      id: true
    }
  });

  return project?.id ?? undefined;
}

async function getNextTaskSortOrder(
  prisma: PrismaClient | Prisma.TransactionClient,
  userId: bigint,
  status: "NOT_STARTED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED"
) {
  const taskOrder = await prisma.task.aggregate({
    where: {
      userId,
      status,
      deletedAt: null
    },
    _max: {
      sortOrder: true
    }
  });

  return (taskOrder._max.sortOrder ?? 0) + 1000;
}

export async function createTaskForMilestone(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint,
  input: TaskFormInput
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const projectId = await resolveTaskProjectId(
      tx,
      userId,
      goalId,
      input.projectId
    );
    const milestone = await tx.milestone.findFirst({
      where: {
        id: milestoneId,
        goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        goalId: true
      }
    });

    if (!milestone) {
      return null;
    }

    if (input.projectId && projectId === undefined) {
      return null;
    }

    const isCompleted = input.status === "completed";
    const isInProgress = input.status === "in_progress";
    const nextStatus = workStatusToPrisma[input.status];
    const nextSortOrder = await getNextTaskSortOrder(tx, userId, nextStatus);

    const task = await tx.task.create({
      data: {
        userId,
        goalId: milestone.goalId,
        milestoneId: milestone.id,
        projectId: projectId ?? null,
        title: input.title,
        description: input.description || null,
        status: nextStatus,
        priority: goalPriorityToPrisma[input.priority],
        progressPercentage: isCompleted ? 100 : 0,
        dueAt: input.dueAt ? parseDateTimeLocalInput(input.dueAt) : null,
        startedAt: isInProgress ? new Date() : null,
        completedAt: isCompleted ? new Date() : null,
        estimatedMinutes: input.estimatedMinutes ?? null,
        isFocus: input.isFocus,
        sortOrder: nextSortOrder
      },
      select: {
        id: true,
        title: true
      }
    });

    await syncMilestoneProgress(tx, milestone.id, {
      taskId: task.id,
      taskTitle: task.title
    });

    if (projectId) {
      await syncProjectProgress(tx, projectId);
    }

    return task.id.toString();
  });
}

export async function updateTaskForGoal(
  userId: bigint,
  goalId: bigint,
  taskId: bigint,
  input: TaskFormInput
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const nextProjectId = await resolveTaskProjectId(
      tx,
      userId,
      goalId,
      input.projectId
    );
    const existingTask = await tx.task.findFirst({
      where: {
        id: taskId,
        goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        milestoneId: true,
        projectId: true,
        status: true,
        progressPercentage: true,
        startedAt: true,
        completedAt: true,
        title: true
      }
    });

    if (!existingTask) {
      return null;
    }

    if (input.projectId && nextProjectId === undefined) {
      return null;
    }

    const nextStatus = workStatusToPrisma[input.status];
    const nextProgress =
      input.status === "completed"
        ? 100
        : Number(existingTask.progressPercentage) === 100
          ? 0
          : undefined;
    const nextSortOrder =
      existingTask.status !== nextStatus
        ? await getNextTaskSortOrder(tx, userId, nextStatus)
        : undefined;

    await tx.task.update({
      where: {
        id: existingTask.id
      },
      data: {
        title: input.title,
        description: input.description || null,
        projectId: nextProjectId ?? null,
        status: nextStatus,
        priority: goalPriorityToPrisma[input.priority],
        dueAt: input.dueAt ? parseDateTimeLocalInput(input.dueAt) : null,
        estimatedMinutes: input.estimatedMinutes ?? null,
        isFocus: input.isFocus,
        startedAt:
          input.status === "in_progress"
            ? existingTask.startedAt ?? new Date()
            : existingTask.startedAt,
        completedAt:
          input.status === "completed"
            ? existingTask.completedAt ?? new Date()
            : null,
        progressPercentage: nextProgress,
        sortOrder: nextSortOrder
      }
    });

    if (existingTask.milestoneId) {
      await syncMilestoneProgress(tx, existingTask.milestoneId, {
        taskId: existingTask.id,
        taskTitle: input.title
      });
    } else {
      await syncGoalProgress(tx, goalId, {
        taskId: existingTask.id,
        taskTitle: input.title
      });
    }

    if (
      existingTask.projectId &&
      (!nextProjectId || existingTask.projectId !== nextProjectId)
    ) {
      await syncProjectProgress(tx, existingTask.projectId);
    }

    if (nextProjectId) {
      await syncProjectProgress(tx, nextProjectId);
    }

    return existingTask.id.toString();
  });
}

export async function reorderTaskForUser(
  userId: bigint,
  taskId: bigint,
  nextStatus: "not_started" | "in_progress" | "paused" | "completed",
  orderedTaskIds: bigint[]
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: taskId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        goalId: true,
        milestoneId: true,
        projectId: true,
        title: true,
        status: true,
        progressPercentage: true,
        startedAt: true,
        completedAt: true
      }
    });

    if (!task) {
      return null;
    }

    const uniqueOrderedIds = [...new Set(orderedTaskIds.map((value) => value.toString()))].map(
      (value) => BigInt(value)
    );
    const ensuredOrderedIds = uniqueOrderedIds.some((value) => value === task.id)
      ? uniqueOrderedIds
      : [task.id, ...uniqueOrderedIds];
    const tasksInDestinationStatus = await tx.task.findMany({
      where: {
        id: {
          in: ensuredOrderedIds
        },
        userId,
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (tasksInDestinationStatus.length !== ensuredOrderedIds.length) {
      return null;
    }

    const nextStatusPrisma = workStatusToPrisma[nextStatus];
    const statusChanged = task.status !== nextStatusPrisma;
    const nextProgress =
      nextStatus === "completed"
        ? 100
        : Number(task.progressPercentage) === 100
          ? 0
          : undefined;

    for (const [index, orderedId] of ensuredOrderedIds.entries()) {
      await tx.task.update({
        where: {
          id: orderedId
        },
        data:
          orderedId === task.id
            ? {
                status: nextStatusPrisma,
                progressPercentage: nextProgress,
                startedAt:
                  nextStatus === "in_progress" ? task.startedAt ?? new Date() : task.startedAt,
                completedAt: nextStatus === "completed" ? task.completedAt ?? new Date() : null,
                sortOrder: (index + 1) * 1000
              }
            : {
                sortOrder: (index + 1) * 1000
              }
      });
    }

    if (statusChanged) {
      if (task.milestoneId) {
        await syncMilestoneProgress(tx, task.milestoneId, {
          taskId: task.id,
          taskTitle: task.title
        });
      } else {
        await syncGoalProgress(tx, task.goalId, {
          taskId: task.id,
          taskTitle: task.title
        });
      }

      if (task.projectId) {
        await syncProjectProgress(tx, task.projectId);
      }
    }

    return task.id.toString();
  });
}

export async function softDeleteTaskForGoal(
  userId: bigint,
  goalId: bigint,
  taskId: bigint
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: taskId,
        goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        milestoneId: true,
        projectId: true,
        title: true
      }
    });

    if (!task) {
      return false;
    }

    await tx.task.update({
      where: {
        id: task.id
      },
      data: {
        deletedAt: new Date()
      }
    });

    await tx.subtask.updateMany({
      where: {
        taskId: task.id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });

    if (task.milestoneId) {
      await syncMilestoneProgress(tx, task.milestoneId, {
        taskId: task.id,
        taskTitle: task.title
      });
    } else {
      await syncGoalProgress(tx, goalId, {
        taskId: task.id,
        taskTitle: task.title
      });
    }

    if (task.projectId) {
      await syncProjectProgress(tx, task.projectId);
    }

    return true;
  });
}

export async function completeTaskForGoal(
  userId: bigint,
  goalId: bigint,
  taskId: bigint
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: taskId,
        goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        milestoneId: true,
        projectId: true,
        title: true,
        completedAt: true
      }
    });

    if (!task) {
      return false;
    }

    await tx.task.update({
      where: {
        id: task.id
      },
      data: {
        status: "COMPLETED",
        progressPercentage: 100,
        completedAt: task.completedAt ?? new Date()
      }
    });

    if (task.milestoneId) {
      await syncMilestoneProgress(tx, task.milestoneId, {
        taskId: task.id,
        taskTitle: task.title
      });
    } else {
      await syncGoalProgress(tx, goalId, {
        taskId: task.id,
        taskTitle: task.title
      });
    }

    if (task.projectId) {
      await syncProjectProgress(tx, task.projectId);
    }

    return true;
  });
}
