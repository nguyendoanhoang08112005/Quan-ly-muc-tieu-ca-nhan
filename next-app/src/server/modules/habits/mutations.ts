import "server-only";

import type { HabitFrequency, Prisma, PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateInput, parseTimeInput } from "@/lib/dates";
import {
  habitFrequencyToPrisma,
  habitStatusToPrisma
} from "@/features/habits/habit-helpers";
import type {
  HabitFormInput,
  HabitLogFormInput
} from "@/features/habits/schemas/habit-schemas";
import { calculateHabitMetrics } from "@/server/modules/habits/streak-utils";

async function resolveHabitGoalId(userId: bigint, goalId: string | undefined) {
  if (!goalId) {
    return null;
  }

  const prisma = getPrismaClient();
  const goal = await prisma.goal.findFirst({
    where: {
      id: BigInt(goalId),
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  return goal?.id ?? null;
}

async function recalculateHabitMetrics(
  prisma: PrismaClient | Prisma.TransactionClient,
  habitId: bigint
) {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId
    },
    select: {
      id: true,
      frequency: true,
      logs: {
        orderBy: {
          logDate: "desc"
        },
        select: {
          logDate: true,
          isCompleted: true
        }
      },
      user: {
        select: {
          weekStartsOn: true
        }
      }
    }
  });

  if (!habit) {
    return null;
  }

  const { currentStreak, bestStreak, lastLoggedAt } = calculateHabitMetrics({
    frequency: habit.frequency as HabitFrequency,
    logs: habit.logs,
    weekStartsOn: habit.user.weekStartsOn
  });

  await prisma.habit.update({
    where: {
      id: habit.id
    },
    data: {
      currentStreak,
      bestStreak,
      lastLoggedAt
    }
  });

  return {
    currentStreak,
    bestStreak,
    lastLoggedAt
  };
}

export async function createHabitForUser(userId: bigint, input: HabitFormInput) {
  const prisma = getPrismaClient();
  const goalId = await resolveHabitGoalId(userId, input.goalId);

  if (input.goalId && goalId === null) {
    return null;
  }

  const habit = await prisma.habit.create({
    data: {
      userId,
      goalId,
      title: input.title,
      description: input.description || null,
      frequency: habitFrequencyToPrisma[input.frequency],
      targetCount: input.targetCount,
      unit: input.unit,
      reminderTime: input.reminderTime ? parseTimeInput(input.reminderTime) : null,
      status: habitStatusToPrisma[input.status],
      startDate: parseDateInput(input.startDate),
      endDate: input.endDate ? parseDateInput(input.endDate) : null
    },
    select: {
      id: true
    }
  });

  return habit.id.toString();
}

export async function updateHabitForUser(
  userId: bigint,
  habitId: bigint,
  input: HabitFormInput
) {
  const prisma = getPrismaClient();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!habit) {
    return null;
  }

  const goalId = await resolveHabitGoalId(userId, input.goalId);

  if (input.goalId && goalId === null) {
    return null;
  }

  await prisma.habit.update({
    where: {
      id: habit.id
    },
    data: {
      goalId,
      title: input.title,
      description: input.description || null,
      frequency: habitFrequencyToPrisma[input.frequency],
      targetCount: input.targetCount,
      unit: input.unit,
      reminderTime: input.reminderTime ? parseTimeInput(input.reminderTime) : null,
      status: habitStatusToPrisma[input.status],
      startDate: parseDateInput(input.startDate),
      endDate: input.endDate ? parseDateInput(input.endDate) : null
    }
  });

  await recalculateHabitMetrics(prisma, habit.id);

  return habit.id.toString();
}

export async function softDeleteHabitForUser(userId: bigint, habitId: bigint) {
  const prisma = getPrismaClient();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!habit) {
    return false;
  }

  await prisma.habit.update({
    where: {
      id: habit.id
    },
    data: {
      deletedAt: new Date()
    }
  });

  return true;
}

export async function upsertHabitLogForUser(
  userId: bigint,
  habitId: bigint,
  input: HabitLogFormInput
) {
  const prisma = getPrismaClient();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      targetCount: true
    }
  });

  if (!habit) {
    return null;
  }

  const logDate = parseDateInput(input.logDate);

  if (!logDate) {
    return null;
  }

  await prisma.$transaction(async (tx) => {
    await tx.habitLog.upsert({
      where: {
        habitId_logDate: {
          habitId: habit.id,
          logDate
        }
      },
      create: {
        userId,
        habitId: habit.id,
        logDate,
        completedCount: input.completedCount,
        targetCountSnapshot: habit.targetCount,
        isCompleted: input.completedCount >= habit.targetCount,
        note: input.note || null
      },
      update: {
        completedCount: input.completedCount,
        targetCountSnapshot: habit.targetCount,
        isCompleted: input.completedCount >= habit.targetCount,
        note: input.note || null
      }
    });

    await recalculateHabitMetrics(tx, habit.id);
  });

  return habit.id.toString();
}
