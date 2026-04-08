export const relatedEntityTypeValues = [
  "goal",
  "milestone",
  "task",
  "habit",
  "project",
  "journal_entry",
  "reminder",
  "note",
  "pomodoro_session"
] as const;

export type RelatedEntityType = (typeof relatedEntityTypeValues)[number];

export type NotificationListItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  relatedType: RelatedEntityType | null;
  relatedId: string | null;
  href: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationSummary = {
  total: number;
  unread: number;
  read: number;
};
