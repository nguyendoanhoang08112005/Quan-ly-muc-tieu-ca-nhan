export const habitFrequencyValues = ["daily", "weekly", "monthly"] as const;
export const habitStatusValues = [
  "active",
  "paused",
  "completed",
  "archived"
] as const;

export type HabitFrequency = (typeof habitFrequencyValues)[number];
export type HabitStatus = (typeof habitStatusValues)[number];

export type HabitFormValues = {
  title: string;
  description: string;
  goalId: string;
  frequency: HabitFrequency;
  targetCount: string;
  unit: string;
  reminderTime: string;
  status: HabitStatus;
  startDate: string;
  endDate: string;
};

export type HabitLogFormValues = {
  logDate: string;
  completedCount: string;
  note: string;
};

export type HabitGoalOption = {
  id: string;
  title: string;
};

export type HabitLogSummary = {
  id: string;
  logDate: string;
  completedCount: number;
  targetCountSnapshot: number;
  isCompleted: boolean;
  note: string | null;
};

export type HabitListItem = {
  id: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  targetCount: number;
  unit: string;
  reminderTime: string | null;
  status: HabitStatus;
  startDate: string | null;
  endDate: string | null;
  currentStreak: number;
  bestStreak: number;
  lastLoggedAt: string | null;
  goal: HabitGoalOption | null;
  todayLog: HabitLogSummary | null;
};

export type HabitDetail = HabitListItem & {
  recentLogs: HabitLogSummary[];
};
