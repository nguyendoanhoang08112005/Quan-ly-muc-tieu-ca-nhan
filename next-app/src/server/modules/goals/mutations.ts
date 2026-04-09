import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateInput } from "@/lib/dates";
import {
  goalPriorityToPrisma,
  goalStatusToPrisma,
  goalTypeToPrisma
} from "@/features/goals/goal-helpers";
import type { GoalFormInput } from "@/features/goals/schemas/goal-schemas";

export type UpdateGoalResult =
  | {
      ok: true;
      goalId: string;
    }
  | {
      ok: false;
      code: "not_found" | "invalid_metadata" | "incomplete_dependencies";
      message: string;
    };

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

async function buildUniqueGoalSlug(
  userId: bigint,
  title: string,
  goalIdToIgnore?: bigint
) {
  const prisma = getPrismaClient();
  const baseSlug = slugify(title) || `goal-${Date.now()}`;

  for (let index = 0; index < 1000; index += 1) {
    const candidateSlug =
      index === 0 ? baseSlug : `${baseSlug}-${index + 1}`.slice(0, 220);
    const existingGoal = await prisma.goal.findFirst({
      where: {
        userId,
        slug: candidateSlug,
        ...(goalIdToIgnore
          ? {
              id: {
                not: goalIdToIgnore
              }
            }
          : {})
      },
      select: {
        id: true
      }
    });

    if (!existingGoal) {
      return candidateSlug;
    }
  }

  return `${baseSlug}-${Date.now()}`.slice(0, 220);
}

async function resolveGoalMetadata(
  userId: bigint,
  input: GoalFormInput
) {
  const prisma = getPrismaClient();
  const tagIds = [...new Set(input.tagIds)].map((tagId) => BigInt(tagId));
  const categoryId = input.categoryId ? BigInt(input.categoryId) : null;

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
        OR: [{ userId }, { userId: null }],
        type: {
          in: ["GOAL", "ALL"]
        }
      },
      select: {
        id: true
      }
    });

    if (!category) {
      return null;
    }
  }

  if (tagIds.length > 0) {
    const tags = await prisma.tag.findMany({
      where: {
        userId,
        deletedAt: null,
        id: {
          in: tagIds
        }
      },
      select: {
        id: true
      }
    });

    if (tags.length !== tagIds.length) {
      return null;
    }
  }

  return {
    categoryId,
    tagIds
  };
}

async function getGoalCompletionBlockReason(
  userId: bigint,
  goalId: bigint
) {
  const prisma = getPrismaClient();
  const [remainingTasksCount, remainingMilestonesCount] = await Promise.all([
    prisma.task.count({
      where: {
        deletedAt: null,
        status: {
          not: "COMPLETED"
        },
        milestone: {
          goalId,
          goal: {
            userId,
            deletedAt: null
          },
          deletedAt: null
        }
      }
    }),
    prisma.milestone.count({
      where: {
        goalId,
        userId,
        deletedAt: null,
        status: {
          not: "COMPLETED"
        }
      }
    })
  ]);

  if (remainingTasksCount > 0) {
    return `Chưa thể hoàn thành mục tiêu vì còn ${remainingTasksCount} công việc chưa hoàn thành.`;
  }

  if (remainingMilestonesCount > 0) {
    return `Chưa thể hoàn thành mục tiêu vì còn ${remainingMilestonesCount} cột mốc chưa hoàn thành.`;
  }

  return null;
}

export async function createGoalForUser(userId: bigint, input: GoalFormInput) {
  const prisma = getPrismaClient();
  const slug = await buildUniqueGoalSlug(userId, input.title);
  const isCompleted = input.status === "completed";
  const metadata = await resolveGoalMetadata(userId, input);

  if (!metadata) {
    return null;
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      categoryId: metadata.categoryId,
      title: input.title,
      slug,
      description: input.description,
      goalType: goalTypeToPrisma[input.goalType],
      priority: goalPriorityToPrisma[input.priority],
      status: goalStatusToPrisma[input.status],
      progressPercentage: isCompleted ? 100 : 0,
      startDate: parseDateInput(input.startDate),
      targetDate: parseDateInput(input.targetDate),
      completedAt: isCompleted ? new Date() : null,
      note: input.note || null,
      isPublic: input.isPublic,
      tagLinks:
        metadata.tagIds.length > 0
          ? {
              createMany: {
                data: metadata.tagIds.map((tagId) => ({
                  tagId
                }))
              }
            }
          : undefined
    },
    select: {
      id: true
    }
  });

  return goal.id.toString();
}

export async function updateGoalForUser(
  userId: bigint,
  goalId: bigint,
  input: GoalFormInput
): Promise<UpdateGoalResult> {
  const prisma = getPrismaClient();
  const metadata = await resolveGoalMetadata(userId, input);
  const existingGoal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      progressPercentage: true,
      completedAt: true,
      isPublic: true
    }
  });

  if (!existingGoal || !metadata) {
    return {
      ok: false,
      code: existingGoal ? "invalid_metadata" : "not_found",
      message: existingGoal
        ? "Không thể cập nhật mục tiêu với metadata hiện tại."
        : "Mục tiêu không tồn tại hoặc đã bị xóa."
    };
  }

  if (input.status === "completed") {
    const completionBlockReason = await getGoalCompletionBlockReason(userId, goalId);

    if (completionBlockReason) {
      return {
        ok: false,
        code: "incomplete_dependencies",
        message: completionBlockReason
      };
    }
  }

  const titleChanged = existingGoal.title !== input.title;
  const nextProgress = input.status === "completed" ? 100 : undefined;

  await prisma.$transaction(async (tx) => {
    await tx.goal.update({
      where: {
        id: existingGoal.id
      },
      data: {
        categoryId: metadata.categoryId,
        title: input.title,
        slug: titleChanged
          ? await buildUniqueGoalSlug(userId, input.title, existingGoal.id)
          : undefined,
        description: input.description,
        goalType: goalTypeToPrisma[input.goalType],
        priority: goalPriorityToPrisma[input.priority],
        status: goalStatusToPrisma[input.status],
        startDate: parseDateInput(input.startDate),
        targetDate: parseDateInput(input.targetDate),
        completedAt:
          input.status === "completed"
            ? existingGoal.completedAt ?? new Date()
            : null,
        progressPercentage: nextProgress,
        note: input.note || null,
        isPublic: input.isPublic
      }
    });

    if (existingGoal.isPublic && !input.isPublic) {
      await tx.follow.deleteMany({
        where: {
          followableType: "GOAL",
          followableId: existingGoal.id
        }
      });
    }

    await tx.goalTag.deleteMany({
      where: {
        goalId: existingGoal.id
      }
    });

    if (metadata.tagIds.length > 0) {
      await tx.goalTag.createMany({
        data: metadata.tagIds.map((tagId) => ({
          goalId: existingGoal.id,
          tagId
        }))
      });
    }
  });

  return {
    ok: true,
    goalId: existingGoal.id.toString()
  };
}

export async function softDeleteGoalForUser(userId: bigint, goalId: bigint) {
  const prisma = getPrismaClient();
  const existingGoal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!existingGoal) {
    return false;
  }

  await prisma.goal.update({
    where: {
      id: existingGoal.id
    },
    data: {
      deletedAt: new Date()
    }
  });

  await prisma.follow.deleteMany({
    where: {
      followableType: "GOAL",
      followableId: existingGoal.id
    }
  });

  return true;
}
