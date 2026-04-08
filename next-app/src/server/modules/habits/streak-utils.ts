import { formatDateInput, parseDateInput } from "@/lib/dates";

export type HabitFrequencyLike = "DAILY" | "WEEKLY" | "MONTHLY";

export function startOfWeekUtc(date: Date, weekStartsOn: number) {
  const normalized = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayOfWeek = normalized.getUTCDay();
  const offset = (dayOfWeek - weekStartsOn + 7) % 7;

  normalized.setUTCDate(normalized.getUTCDate() - offset);

  return normalized;
}

export function startOfMonthUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function normalizeHabitPeriod(
  date: Date,
  frequency: HabitFrequencyLike,
  weekStartsOn: number
) {
  if (frequency === "WEEKLY") {
    return startOfWeekUtc(date, weekStartsOn);
  }

  if (frequency === "MONTHLY") {
    return startOfMonthUtc(date);
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function addHabitPeriod(
  date: Date,
  frequency: HabitFrequencyLike,
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

export function periodKey(date: Date) {
  return formatDateInput(date);
}

export function calculateHabitMetrics(params: {
  frequency: HabitFrequencyLike;
  logs: Array<{
    logDate: Date;
    isCompleted: boolean;
  }>;
  weekStartsOn: number;
  now?: Date;
}) {
  const { frequency, logs, weekStartsOn } = params;
  const now = params.now ?? new Date();
  const completedPeriods = new Set(
    logs
      .filter((log) => log.isCompleted)
      .map((log) =>
        periodKey(normalizeHabitPeriod(log.logDate, frequency, weekStartsOn))
      )
  );
  const orderedLogs = [...logs].sort((left, right) => {
    return right.logDate.getTime() - left.logDate.getTime();
  });
  const latestLogDate = orderedLogs[0]?.logDate ?? null;
  const todayPeriod = normalizeHabitPeriod(now, frequency, weekStartsOn);

  let currentStreak = 0;
  let cursor = todayPeriod;

  while (completedPeriods.has(periodKey(cursor))) {
    currentStreak += 1;
    cursor = addHabitPeriod(cursor, frequency, -1);
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

    const expected = addHabitPeriod(previous, frequency, 1);

    if (periodKey(expected) === periodKey(current)) {
      activeRun += 1;
    } else {
      activeRun = 1;
    }

    bestStreak = Math.max(bestStreak, activeRun);
  }

  return {
    currentStreak,
    bestStreak,
    lastLoggedAt: latestLogDate
  };
}
