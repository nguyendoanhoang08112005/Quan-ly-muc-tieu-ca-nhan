import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import type { SubtaskFormInput } from "@/features/subtasks/schemas/subtask-schemas";

type SubtaskMutationResult = {
  goalId: string;
  projectId: string | null;
};

export async function createSubtaskForTask(
  userId: bigint,
  taskId: bigint,
  input: SubtaskFormInput
): Promise<SubtaskMutationResult | null> {
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
        projectId: true
      }
    });

    if (!task) {
      return null;
    }

    const maxSortOrder = await tx.subtask.aggregate({
      where: {
        taskId: task.id,
        deletedAt: null
      },
      _max: {
        sortOrder: true
      }
    });

    await tx.subtask.create({
      data: {
        taskId: task.id,
        name: input.name,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1
      }
    });

    return {
      goalId: task.goalId.toString(),
      projectId: task.projectId?.toString() ?? null
    };
  });
}

export async function toggleSubtaskForTask(
  userId: bigint,
  taskId: bigint,
  subtaskId: bigint
): Promise<SubtaskMutationResult | null> {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const subtask = await tx.subtask.findFirst({
      where: {
        id: subtaskId,
        taskId,
        deletedAt: null,
        task: {
          userId,
          deletedAt: null
        }
      },
      select: {
        id: true,
        status: true,
        task: {
          select: {
            goalId: true,
            projectId: true
          }
        }
      }
    });

    if (!subtask) {
      return null;
    }

    const isCompleted = subtask.status === "COMPLETED";

    await tx.subtask.update({
      where: {
        id: subtask.id
      },
      data: {
        status: isCompleted ? "PENDING" : "COMPLETED",
        completedAt: isCompleted ? null : new Date()
      }
    });

    return {
      goalId: subtask.task.goalId.toString(),
      projectId: subtask.task.projectId?.toString() ?? null
    };
  });
}

export async function softDeleteSubtaskForTask(
  userId: bigint,
  taskId: bigint,
  subtaskId: bigint
): Promise<SubtaskMutationResult | null> {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const subtask = await tx.subtask.findFirst({
      where: {
        id: subtaskId,
        taskId,
        deletedAt: null,
        task: {
          userId,
          deletedAt: null
        }
      },
      select: {
        id: true,
        task: {
          select: {
            goalId: true,
            projectId: true
          }
        }
      }
    });

    if (!subtask) {
      return null;
    }

    await tx.subtask.update({
      where: {
        id: subtask.id
      },
      data: {
        deletedAt: new Date()
      }
    });

    return {
      goalId: subtask.task.goalId.toString(),
      projectId: subtask.task.projectId?.toString() ?? null
    };
  });
}
