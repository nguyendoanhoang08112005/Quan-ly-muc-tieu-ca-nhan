import type { RelatedEntityType } from "@/features/notifications/types";

export const relatedEntityTypeLabels: Record<RelatedEntityType, string> = {
  goal: "Goal",
  milestone: "Milestone",
  task: "Task",
  habit: "Habit",
  project: "Project",
  journal_entry: "Journal entry",
  reminder: "Reminder",
  note: "Note",
  pomodoro_session: "Pomodoro"
};

export const relatedEntityTypeFromPrisma = {
  GOAL: "goal",
  MILESTONE: "milestone",
  TASK: "task",
  HABIT: "habit",
  PROJECT: "project",
  JOURNAL_ENTRY: "journal_entry",
  REMINDER: "reminder",
  NOTE: "note",
  POMODORO_SESSION: "pomodoro_session"
} as const;

export const relatedEntityTypeToPrisma = {
  goal: "GOAL",
  milestone: "MILESTONE",
  task: "TASK",
  habit: "HABIT",
  project: "PROJECT",
  journal_entry: "JOURNAL_ENTRY",
  reminder: "REMINDER",
  note: "NOTE",
  pomodoro_session: "POMODORO_SESSION"
} as const;

export function getNotificationTypeLabel(type: string) {
  return type
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
