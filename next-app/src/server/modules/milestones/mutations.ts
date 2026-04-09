import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateInput } from "@/lib/dates";
import { workStatusToPrisma } from "@/features/goals/goal-helpers";
import type { MilestoneFormInput } from "@/features/milestones/schemas/milestone-schemas";
import { syncGoalProgress } from "@/server/modules/goals/progress";

export type UpdateMilestoneResult =
  | {
      ok: true;
      milestoneId: string;
    }
  | {
      ok: false;
      code: "not_found" | "incomplete_dependencies";
      message: string;
    };

async function getMilestoneCompletionBlockReason(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint
) {
  const prisma = getPrismaClient();
  const remainingTasksCount = await prisma.task.count({
    where: {
      milestoneId,
      deletedAt: null,
      status: {
        not: "COMPLETED"
      },
      milestone: {
        goalId,
        userId,
        deletedAt: null
      }
    }
  });

  if (remainingTasksCount > 0) {
    return `Chưa thể hoàn thành cột mốc vì còn ${remainingTasksCount} công việc chưa hoàn thành.`;
  }

  return null;
}

export async function createMilestoneForGoal(
  userId: bigint,
  goalId: bigint,
  input: MilestoneFormInput
) {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.findFirst({
      where: {
        id: goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!goal) {
      return null;
    }

    const milestoneCount = await tx.milestone.aggregate({
      where: {
        goalId,
        deletedAt: null
      },
      _max: {
        sequenceNo: true
      }
    });
    const isCompleted = input.status === "completed";

    const milestone = await tx.milestone.create({
      data: {
        userId,
        goalId,
        title: input.title,
        description: input.description || null,
        status: workStatusToPrisma[input.status],
        progressPercentage: isCompleted ? 100 : 0,
        startDate: input.startDate ? parseDateInput(input.startDate) : null,
        targetDate: input.targetDate ? parseDateInput(input.targetDate) : null,
        completedAt: isCompleted ? new Date() : null,
        sequenceNo:
          input.sequenceNo ?? ((milestoneCount._max.sequenceNo ?? 0) + 1),
        note: input.note || null
      },
      select: {
        id: true
      }
    });

    await syncGoalProgress(tx, goalId, {
      milestoneId: milestone.id
    });

    return milestone.id.toString();
  });
}

export async function updateMilestoneForGoal(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint,
  input: MilestoneFormInput
): Promise<UpdateMilestoneResult> {
  const prisma = getPrismaClient();

  return prisma.$transaction(async (tx) => {
    const existingMilestone = await tx.milestone.findFirst({
      where: {
        id: milestoneId,
        goalId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        progressPercentage: true,
        completedAt: true
      }
    });

    if (!existingMilestone) {
      return {
        ok: false,
        code: "not_found",
        message: "Cột mốc không tồn tại hoặc đã bị xóa."
      };
    }

    if (input.status === "completed") {
      const completionBlockReason = await getMilestoneCompletionBlockReason(
        userId,
        goalId,
        milestoneId
      );

      if (completionBlockReason) {
        return {
          ok: false,
          code: "incomplete_dependencies",
          message: completionBlockReason
        };
      }
    }

    const nextProgress = input.status === "completed" ? 100 : undefined;

    await tx.milestone.update({
      where: {
        id: existingMilestone.id
      },
      data: {
        title: input.title,
        description: input.description || null,
        status: workStatusToPrisma[input.status],
        startDate: input.startDate ? parseDateInput(input.startDate) : null,
        targetDate: input.targetDate ? parseDateInput(input.targetDate) : null,
        completedAt:
          input.status === "completed"
            ? existingMilestone.completedAt ?? new Date()
            : null,
        progressPercentage: nextProgress,
        sequenceNo: input.sequenceNo,
        note: input.note || null
      }
    });

    await syncGoalProgress(tx, goalId, {
      milestoneId: existingMilestone.id,
      milestoneTitle: input.title
    });

    return {
      ok: true,
      milestoneId: existingMilestone.id.toString()
    };
  });
}

export async function softDeleteMilestoneForGoal(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint
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
        title: true
      }
    });

    if (!milestone) {
      return false;
    }

    const deletedAt = new Date();

    await tx.task.updateMany({
      where: {
        milestoneId: milestone.id,
        deletedAt: null
      },
      data: {
        deletedAt
      }
    });

    await tx.milestone.update({
      where: {
        id: milestone.id
      },
      data: {
        deletedAt
      }
    });

    await syncGoalProgress(tx, goalId, {
      milestoneId: milestone.id,
      milestoneTitle: milestone.title
    });

    return true;
  });
}
