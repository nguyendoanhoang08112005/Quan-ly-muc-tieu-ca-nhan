import type { RelatedEntityType } from "@/features/notifications/types";

export const relatedEntityTypeLabels: Record<RelatedEntityType, string> = {
  goal: "Mục tiêu",
  milestone: "Cột mốc",
  task: "Công việc",
  habit: "Thói quen",
  project: "Dự án",
  journal_entry: "Nhật ký",
  reminder: "Nhắc nhở",
  note: "Ghi chú",
  pomodoro_session: "Phiên pomodoro"
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
  const labels: Record<string, string> = {
    "goal.progress": "Tiến độ mục tiêu",
    "task.deadline": "Hạn công việc",
    "social.following": "Thông tin theo dõi",
    "pomodoro.completed": "Hoàn thành pomodoro"
  };

  if (labels[type]) {
    return labels[type];
  }

  return type
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
