import "server-only";

import type { HabitFrequency, Prisma, PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@/lib/db/prisma";
import { formatDateInput, parseDateInput, parseTimeInput } from "@/lib/dates";
import {
  habitFrequencyToPrisma,
  habitStatusToPrisma
} from "@/features/habits/habit-helpers";
import type {
  HabitFormInput,
  HabitLogFormInput
} from "@/features/habits/schemas/habit-schemas";

function startOfWeekUtc(date: Date, weekStartsOn: number) {
  const normalized = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayOfWeek = normalized.getUTCDay();
  const offset = (dayOfWeek - weekStartsOn + 7) % 7;

  normalized.setUTCDate(normalized.getUTCDate() - offset);

  return normalized;
}

function startOfMonthUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function normalizeHabitPeriod(
  date: Date,
  frequency: HabitFrequency,
  weekStartsOn: number
) {
  if (frequency === "WEEKLY") {
    return startOfWeekUtc(date, weekStartsOn);
  }

  if (frequency === "MONTHLY") {
    return startOfMonthUtc(date);
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addHabitPeriod(
  date: Date,
  frequency: HabitFrequency,
  amount: number
) {
  const nextDate = new Date(date);

  if (frequency === "WEEKLY") {
    nextDate.setUTCDate(nextDate.getUTCDate() + amount * 7);

    return nextDate;
  }

  if (frequency === "MONTHLY") {
    nextDate.setUTCMonth(nextDate.getUTCMonth() + amount);

    return nextDate;
  }

  nextDate.setUTCDate(nextDate.getUTCDate() + amount);

  return nextDate;
}

function periodKey(date: Date) {
  return formatDateInput(date);
}

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

  const weekStartsOn = habit.user.weekStartsOn;
  const completedPeriods = new Set(
    habit.logs
      .filter((log) => log.isCompleted)
      .map((log) =>
        periodKey(normalizeHabitPeriod(log.logDate, habit.frequency, weekStartsOn))
      )
  );
  const latestLogDate = habit.logs[0]?.logDate ?? null;
  const todayPeriod = normalizeHabitPeriod(
    new Date(),
    habit.frequency,
    weekStartsOn
  );

  let currentStreak = 0;
  let cursor = todayPeriod;

  while (completedPeriods.has(periodKey(cursor))) {
    currentStreak += 1;
    cursor = addHabitPeriod(cursor, habit.frequency, -1);
  }

  const orderedPeriods = [...completedPeriods]
    .map((value) => parseDateInput(value))
    .filter((value): value is Date => value !== null)
    .sort((left, right) => left.getTime() - right.getTime());

  let bestStreak = 0;
  let activeRun = 0;

  for (let index = 0; index < orderedPeriods.length; index += 1) {
    const current = orderedPeriods[index];
    const previous = orderedPeriods[index - 1];

    if (!previous) {
      activeRun = 1;
      bestStreak = Math.max(bestStreak, activeRun);
      continue;
    }

    const expected = addHabitPeriod(previous, habit.frequency, 1);

    if (periodKey(expected) === periodKey(current)) {
      activeRun += 1;
    } else {
      activeRun = 1;
    }

    bestStreak = Math.max(bestStreak, activeRun);
  }

  await prisma.habit.update({
    where: {
      id: habit.id
    },
    data: {
      currentStreak,
      bestStreak,
      lastLoggedAt: latestLogDate
    }
  });

  return {
    currentStreak,
    bestStreak,
    lastLoggedAt: latestLogDate
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
