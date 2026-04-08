import "server-only";

import {
  habitFrequencyFromPrisma,
  habitStatusFromPrisma
} from "@/features/habits/habit-helpers";
import type {
  HabitDetail,
  HabitFormValues,
  HabitGoalOption,
  HabitListItem,
  HabitLogSummary
} from "@/features/habits/types";
import {
  formatDateInput,
  formatTimeInput,
  getTodayDateInput,
  parseDateInput
} from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function buildTodayRange() {
  const start = parseDateInput(getTodayDateInput()) ?? new Date();
  const end = new Date(start);

  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

function mapHabitLog(log: {
  id: bigint;
  logDate: Date;
  completedCount: number;
  targetCountSnapshot: number;
  isCompleted: boolean;
  note: string | null;
}): HabitLogSummary {
  return {
    id: log.id.toString(),
    logDate: formatDateInput(log.logDate),
    completedCount: log.completedCount,
    targetCountSnapshot: log.targetCountSnapshot,
    isCompleted: log.isCompleted,
    note: log.note ?? null
  };
}

function findTodayLog(
  logs: Array<{
    id: bigint;
    logDate: Date;
    completedCount: number;
    targetCountSnapshot: number;
    isCompleted: boolean;
    note: string | null;
  }>
) {
  const today = getTodayDateInput();

  return logs.find((log) => formatDateInput(log.logDate) === today) ?? null;
}

function mapHabit(habit: {
  id: bigint;
  title: string;
  description: string | null;
  frequency: keyof typeof habitFrequencyFromPrisma;
  targetCount: number;
  unit: string;
  reminderTime: Date | null;
  status: keyof typeof habitStatusFromPrisma;
  startDate: Date | null;
  endDate: Date | null;
  currentStreak: number;
  bestStreak: number;
  lastLoggedAt: Date | null;
  goal: { id: bigint; title: string } | null;
  logs: Array<{
    id: bigint;
    logDate: Date;
    completedCount: number;
    targetCountSnapshot: number;
    isCompleted: boolean;
    note: string | null;
  }>;
}): HabitListItem {
  return {
    id: habit.id.toString(),
    title: habit.title,
    description: habit.description ?? "",
    frequency: habitFrequencyFromPrisma[habit.frequency],
    targetCount: habit.targetCount,
    unit: habit.unit,
    reminderTime: formatTimeInput(habit.reminderTime),
    status: habitStatusFromPrisma[habit.status],
    startDate: formatDateInput(habit.startDate),
    endDate: formatDateInput(habit.endDate),
    currentStreak: habit.currentStreak,
    bestStreak: habit.bestStreak,
    lastLoggedAt: habit.lastLoggedAt?.toISOString() ?? null,
    goal: habit.goal
      ? {
          id: habit.goal.id.toString(),
          title: habit.goal.title
        }
      : null,
    todayLog: findTodayLog(habit.logs) ? mapHabitLog(findTodayLog(habit.logs)!) : null
  };
}

export async function listHabitGoalOptionsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ targetDate: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true
    }
  });

  return goals.map<HabitGoalOption>((goal) => ({
    id: goal.id.toString(),
    title: goal.title
  }));
}

export async function listHabitsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const { start, end } = buildTodayRange();
  const habits = await prisma.habit.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      frequency: true,
      targetCount: true,
      unit: true,
      reminderTime: true,
      status: true,
      startDate: true,
      endDate: true,
      currentStreak: true,
      bestStreak: true,
      lastLoggedAt: true,
      goal: {
        select: {
          id: true,
          title: true
        }
      },
      logs: {
        where: {
          logDate: {
            gte: start,
            lt: end
          }
        },
        orderBy: {
          logDate: "desc"
        },
        take: 1,
        select: {
          id: true,
          logDate: true,
          completedCount: true,
          targetCountSnapshot: true,
          isCompleted: true,
          note: true
        }
      }
    }
  });

  return habits.map(mapHabit);
}

export async function getHabitDetailForUser(userId: bigint, habitId: bigint) {
  const prisma = getPrismaClient();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      description: true,
      frequency: true,
      targetCount: true,
      unit: true,
      reminderTime: true,
      status: true,
      startDate: true,
      endDate: true,
      currentStreak: true,
      bestStreak: true,
      lastLoggedAt: true,
      goal: {
        select: {
          id: true,
          title: true
        }
      },
      logs: {
        orderBy: {
          logDate: "desc"
        },
        take: 14,
        select: {
          id: true,
          logDate: true,
          completedCount: true,
          targetCountSnapshot: true,
          isCompleted: true,
          note: true
        }
      }
    }
  });

  if (!habit) {
    return null;
  }

  const baseHabit = mapHabit(habit);

  const detail: HabitDetail = {
    ...baseHabit,
    recentLogs: habit.logs.map(mapHabitLog)
  };

  return detail;
}

export async function getHabitFormValuesForUser(userId: bigint, habitId: bigint) {
  const prisma = getPrismaClient();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
      deletedAt: null
    },
    select: {
      title: true,
      description: true,
      goalId: true,
      frequency: true,
      targetCount: true,
      unit: true,
      reminderTime: true,
      status: true,
      startDate: true,
      endDate: true
    }
  });

  if (!habit) {
    return null;
  }

  const values: HabitFormValues = {
    title: habit.title,
    description: habit.description ?? "",
    goalId: habit.goalId?.toString() ?? "",
    frequency: habitFrequencyFromPrisma[habit.frequency],
    targetCount: String(habit.targetCount),
    unit: habit.unit,
    reminderTime: formatTimeInput(habit.reminderTime),
    status: habitStatusFromPrisma[habit.status],
    startDate: formatDateInput(habit.startDate),
    endDate: formatDateInput(habit.endDate)
  };

  return values;
}
