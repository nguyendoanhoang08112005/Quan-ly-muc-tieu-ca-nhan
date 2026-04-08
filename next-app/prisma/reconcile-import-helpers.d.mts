export function roundProgress(value: number): number;
export function hasProgressChanged(previousValue: number, nextValue: number): boolean;
export function calculateAverageProgress(values: Array<number | string | bigint | { toNumber(): number } | null | undefined>): number;
export function calculateCompletionProgressFromStatuses(statuses: string[]): number;
export function calculateGoalProgressForImport(params: {
  milestoneProgressValues?: Array<number | string | bigint | { toNumber(): number } | null | undefined>;
  taskStatuses?: string[];
}): number;
export function latestDefinedDate(values: Array<Date | null | undefined>): Date | null;
export function normalizeCompletedAt(params: {
  status: string;
  completedAt?: Date | null;
  fallbackDates?: Array<Date | null | undefined>;
}): Date | null;
export function areDatesEqual(left: Date | null, right: Date | null): boolean;
export function calculateHabitMetricsForImport(params: {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  logs: Array<{
    logDate: Date;
    isCompleted: boolean;
  }>;
  weekStartsOn: number;
  now?: Date;
}): {
  bestStreak: number;
  currentStreak: number;
  lastLoggedAt: Date | null;
};
