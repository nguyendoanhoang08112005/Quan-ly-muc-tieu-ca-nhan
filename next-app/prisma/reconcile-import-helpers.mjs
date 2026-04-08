function toProgressNumber(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const normalized = Number(value);

    return Number.isFinite(normalized) ? normalized : 0;
  }

  if (typeof value === "object" && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  return 0;
}

export function roundProgress(value) {
  return Math.round(value * 100) / 100;
}

export function hasProgressChanged(previousValue, nextValue) {
  return Math.abs(previousValue - nextValue) >= 0.01;
}

export function calculateAverageProgress(values) {
  if (values.length === 0) {
    return 0;
  }

  let total = 0;

  for (const value of values) {
    total += toProgressNumber(value);
  }

  return roundProgress(total / values.length);
}

export function calculateCompletionProgressFromStatuses(statuses) {
  if (statuses.length === 0) {
    return 0;
  }

  const completedCount = statuses.filter((status) => {
    return status === "COMPLETED";
  }).length;

  return roundProgress((completedCount / statuses.length) * 100);
}

export function calculateGoalProgressForImport(params) {
  const milestoneProgressValues = params.milestoneProgressValues ?? [];

  if (milestoneProgressValues.length > 0) {
    return calculateAverageProgress(milestoneProgressValues);
  }

  return calculateCompletionProgressFromStatuses(params.taskStatuses ?? []);
}

export function latestDefinedDate(values) {
  let latestDate = null;

  for (const value of values) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      continue;
    }

    if (!latestDate || value.getTime() > latestDate.getTime()) {
      latestDate = value;
    }
  }

  return latestDate;
}

export function normalizeCompletedAt(params) {
  const { status, completedAt } = params;

  if (status !== "COMPLETED") {
    return null;
  }

  if (completedAt instanceof Date && !Number.isNaN(completedAt.getTime())) {
    return completedAt;
  }

  return latestDefinedDate(params.fallbackDates ?? []);
}

export function areDatesEqual(left, right) {
  if (left === null && right === null) {
    return true;
  }

  if (!(left instanceof Date) || !(right instanceof Date)) {
    return false;
  }

  return left.getTime() === right.getTime();
}

function startOfWeekUtc(date, weekStartsOn) {
  const normalized = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayOfWeek = normalized.getUTCDay();
  const offset = (dayOfWeek - weekStartsOn + 7) % 7;

  normalized.setUTCDate(normalized.getUTCDate() - offset);

  return normalized;
}

function startOfMonthUtc(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function normalizeHabitPeriod(date, frequency, weekStartsOn) {
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

function addHabitPeriod(date, frequency, amount) {
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

function periodKey(date) {
  return date.toISOString().slice(0, 10);
}

export function calculateHabitMetricsForImport(params) {
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
    .map((value) => new Date(`${value}T00:00:00.000Z`))
    .filter((value) => !Number.isNaN(value.getTime()))
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
    bestStreak,
    currentStreak,
    lastLoggedAt: latestLogDate
  };
}
