import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateInput } from "@/lib/dates";
import {
  goalPriorityToPrisma,
  goalStatusToPrisma,
  goalTypeToPrisma
} from "@/features/goals/goal-helpers";
import type { GoalFormInput } from "@/features/goals/schemas/goal-schemas";

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

export async function createGoalForUser(userId: bigint, input: GoalFormInput) {
  const prisma = getPrismaClient();
  const slug = await buildUniqueGoalSlug(userId, input.title);
  const isCompleted = input.status === "completed";

  const goal = await prisma.goal.create({
    data: {
      userId,
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
      note: input.note || null
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
) {
  const prisma = getPrismaClient();
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
      completedAt: true
    }
  });

  if (!existingGoal) {
    return null;
  }

  const titleChanged = existingGoal.title !== input.title;
  const nextProgress =
    input.status === "completed"
      ? 100
      : Number(existingGoal.progressPercentage) === 100
        ? 0
        : undefined;

  await prisma.goal.update({
    where: {
      id: existingGoal.id
    },
    data: {
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
      note: input.note || null
    }
  });

  return existingGoal.id.toString();
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

  return true;
}
