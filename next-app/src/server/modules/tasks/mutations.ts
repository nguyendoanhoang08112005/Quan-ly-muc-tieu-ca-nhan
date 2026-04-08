import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateTimeLocalInput } from "@/lib/dates";
import {
  goalPriorityToPrisma,
  workStatusToPrisma
} from "@/features/goals/goal-helpers";
import type { TaskFormInput } from "@/features/tasks/schemas/task-schemas";
import { syncGoalProgress, syncMilestoneProgress } from "@/server/modules/goals/progress";

export async function createTaskForMilestone(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint,
  input: TaskFormInput
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
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

    const taskCount = await tx.task.aggregate({
      where: {
        milestoneId,
        deletedAt: null
      },
      _max: {
        sortOrder: true
      }
    });
    const isCompleted = input.status === "completed";
    const isInProgress = input.status === "in_progress";

    const task = await tx.task.create({
      data: {
        userId,
        goalId: milestone.goalId,
        milestoneId: milestone.id,
        title: input.title,
        description: input.description || null,
        status: workStatusToPrisma[input.status],
        priority: goalPriorityToPrisma[input.priority],
        progressPercentage: isCompleted ? 100 : 0,
        dueAt: input.dueAt ? parseDateTimeLocalInput(input.dueAt) : null,
        startedAt: isInProgress ? new Date() : null,
        completedAt: isCompleted ? new Date() : null,
        estimatedMinutes: input.estimatedMinutes ?? null,
        isFocus: input.isFocus,
        sortOrder: (taskCount._max.sortOrder ?? 0) + 1
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
        progressPercentage: true,
        startedAt: true,
        completedAt: true,
        title: true
      }
    });

    if (!existingTask) {
      return null;
    }

    const nextProgress =
      input.status === "completed"
        ? 100
        : Number(existingTask.progressPercentage) === 100
          ? 0
          : undefined;

    await tx.task.update({
      where: {
        id: existingTask.id
      },
      data: {
        title: input.title,
        description: input.description || null,
        status: workStatusToPrisma[input.status],
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
        progressPercentage: nextProgress
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

    return existingTask.id.toString();
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

    return true;
  });
}
