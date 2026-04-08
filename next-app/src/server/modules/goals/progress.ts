import "server-only";

import type { Prisma, PrismaClient } from "@prisma/client";

type ProgressContext = {
  milestoneId?: bigint | null;
  milestoneTitle?: string | null;
  taskId?: bigint | null;
  taskTitle?: string | null;
};

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function roundProgress(value: number) {
  return Math.round(value * 100) / 100;
}

function hasProgressChanged(oldValue: number, newValue: number) {
  return Math.abs(oldValue - newValue) >= 0.01;
}

async function createProgressLog(
  prisma: PrismaClient | Prisma.TransactionClient,
  params: {
    userId: bigint;
    goalId: bigint;
    goalTitle: string;
    scope: "goal" | "milestone";
    oldProgress: number;
    newProgress: number;
    milestoneId?: bigint | null;
    milestoneTitle?: string | null;
    taskId?: bigint | null;
    taskTitle?: string | null;
  }
) {
  const {
    userId,
    goalId,
    goalTitle,
    scope,
    oldProgress,
    newProgress,
    milestoneId,
    milestoneTitle,
    taskId,
    taskTitle
  } = params;

  if (!hasProgressChanged(oldProgress, newProgress)) {
    return;
  }

  const taskContext = taskTitle ? ` sau khi task "${taskTitle}" thay doi` : "";
  let title = "Cap nhat tien do goal";
  let content = `Tien do goal "${goalTitle}" thay doi tu ${oldProgress.toFixed(2)}% len ${newProgress.toFixed(2)}%.`;

  if (scope === "milestone" && milestoneTitle) {
    title = "Cap nhat tien do milestone";
    content = `Tien do milestone "${milestoneTitle}" trong goal "${goalTitle}" thay doi tu ${oldProgress.toFixed(2)}% len ${newProgress.toFixed(2)}%${taskContext}.`;
  } else if (milestoneTitle) {
    const taskPhrase = taskTitle ? ` boi task "${taskTitle}"` : "";

    content = `Tien do goal "${goalTitle}" thay doi tu ${oldProgress.toFixed(2)}% len ${newProgress.toFixed(2)}% sau khi milestone "${milestoneTitle}" duoc cap nhat${taskPhrase}.`;
  }

  await prisma.goalLog.create({
    data: {
      userId,
      goalId,
      milestoneId: milestoneId ?? null,
      taskId: taskId ?? null,
      logType: "PROGRESS_UPDATE",
      title,
      content,
      oldValue: {
        scope,
        progress_percentage: oldProgress
      },
      newValue: {
        scope,
        progress_percentage: newProgress
      },
      progressSnapshot: newProgress,
      loggedAt: new Date()
    }
  });
}

export async function syncGoalProgress(
  prisma: PrismaClient | Prisma.TransactionClient,
  goalId: bigint,
  context: ProgressContext = {}
) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      deletedAt: null
    },
    select: {
      id: true,
      userId: true,
      title: true,
      progressPercentage: true,
      milestones: {
        where: {
          deletedAt: null
        },
        select: {
          progressPercentage: true
        }
      }
    }
  });

  if (!goal) {
    return 0;
  }

  const oldProgress = roundProgress(toNumber(goal.progressPercentage));
  const newProgress = roundProgress(
    goal.milestones.length > 0
      ? goal.milestones.reduce((sum, milestone) => {
          return sum + toNumber(milestone.progressPercentage);
        }, 0) / goal.milestones.length
      : 0
  );

  if (!hasProgressChanged(oldProgress, newProgress)) {
    return newProgress;
  }

  await prisma.goal.update({
    where: {
      id: goal.id
    },
    data: {
      progressPercentage: newProgress
    }
  });

  await createProgressLog(prisma, {
    userId: goal.userId,
    goalId: goal.id,
    goalTitle: goal.title,
    scope: "goal",
    oldProgress,
    newProgress,
    ...context
  });

  return newProgress;
}

export async function syncMilestoneProgress(
  prisma: PrismaClient | Prisma.TransactionClient,
  milestoneId: bigint,
  context: ProgressContext = {}
) {
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      deletedAt: null
    },
    select: {
      id: true,
      userId: true,
      goalId: true,
      title: true,
      progressPercentage: true,
      goal: {
        select: {
          title: true
        }
      },
      tasks: {
        where: {
          deletedAt: null
        },
        select: {
          status: true
        }
      }
    }
  });

  if (!milestone) {
    return null;
  }

  const oldProgress = roundProgress(toNumber(milestone.progressPercentage));
  const completedTasks = milestone.tasks.filter((task) => {
    return task.status === "COMPLETED";
  }).length;
  const newProgress = roundProgress(
    milestone.tasks.length > 0 ? (completedTasks / milestone.tasks.length) * 100 : 0
  );

  if (hasProgressChanged(oldProgress, newProgress)) {
    await prisma.milestone.update({
      where: {
        id: milestone.id
      },
      data: {
        progressPercentage: newProgress
      }
    });

    await createProgressLog(prisma, {
      userId: milestone.userId,
      goalId: milestone.goalId,
      goalTitle: milestone.goal.title,
      scope: "milestone",
      oldProgress,
      newProgress,
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      ...context
    });
  }

  await syncGoalProgress(prisma, milestone.goalId, {
    milestoneId: milestone.id,
    milestoneTitle: milestone.title,
    ...context
  });

  return newProgress;
}
