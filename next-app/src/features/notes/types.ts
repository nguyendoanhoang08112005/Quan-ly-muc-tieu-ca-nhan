export const noteableTypeValues = [
  "goal",
  "milestone",
  "task",
  "habit",
  "project",
  "journal_entry"
] as const;

export type NoteableType = (typeof noteableTypeValues)[number];

export type NoteFormValues = {
  noteableType: NoteableType;
  noteableId: string;
  content: string;
};

export type NoteTargetOption = {
  type: NoteableType;
  id: string;
  label: string;
  description?: string | null;
};

export type NoteListItem = {
  id: string;
  noteableType: NoteableType;
  noteableId: string;
  targetLabel: string;
  targetDescription: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};
