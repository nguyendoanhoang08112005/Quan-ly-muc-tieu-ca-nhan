export function toProgressNumber(
  value: number | { toNumber(): number } | null | undefined
) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

export function roundProgress(value: number) {
  return Math.round(value * 100) / 100;
}

export function hasProgressChanged(oldValue: number, newValue: number) {
  return Math.abs(oldValue - newValue) >= 0.01;
}

export function calculateGoalProgressFromMilestones(
  milestoneProgressValues: Array<number | { toNumber(): number } | null | undefined>
) {
  if (milestoneProgressValues.length === 0) {
    return 0;
  }

  let total = 0;

  for (const value of milestoneProgressValues) {
    total += toProgressNumber(value);
  }

  return roundProgress(total / milestoneProgressValues.length);
}

export function calculateMilestoneProgressFromTasks(
  tasks: Array<{ status: string }>
) {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter((task) => {
    return task.status === "COMPLETED";
  }).length;

  return roundProgress((completedTasks / tasks.length) * 100);
}
