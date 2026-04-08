import type {
  HabitFormValues,
  HabitFrequency,
  HabitStatus,
  HabitLogFormValues
} from "@/features/habits/types";
import { getTodayDateInput } from "@/lib/dates";

export const habitFrequencyLabels: Record<HabitFrequency, string> = {
  daily: "Hang ngay",
  weekly: "Hang tuan",
  monthly: "Hang thang"
};

export const habitStatusLabels: Record<HabitStatus, string> = {
  active: "Dang theo doi",
  paused: "Tam dung",
  completed: "Hoan thanh",
  archived: "Luu tru"
};

export const habitStatusClassNames: Record<HabitStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-sky-100 text-sky-700",
  archived: "bg-stone-100 text-stone-700"
};

export const habitFrequencyToPrisma = {
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY"
} as const;

export const habitFrequencyFromPrisma = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly"
} as const;

export const habitStatusToPrisma = {
  active: "ACTIVE",
  paused: "PAUSED",
  completed: "COMPLETED",
  archived: "ARCHIVED"
} as const;

export const habitStatusFromPrisma = {
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived"
} as const;

export function buildDefaultHabitFormValues(): HabitFormValues {
  return {
    title: "",
    description: "",
    goalId: "",
    frequency: "daily",
    targetCount: "1",
    unit: "lan",
    reminderTime: "",
    status: "active",
    startDate: getTodayDateInput(),
    endDate: ""
  };
}

export function buildDefaultHabitLogFormValues(): HabitLogFormValues {
  return {
    logDate: getTodayDateInput(),
    completedCount: "1",
    note: ""
  };
}
