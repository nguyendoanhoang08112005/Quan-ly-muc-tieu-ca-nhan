import type { NoteFormValues, NoteableType } from "@/features/notes/types";

export const noteableTypeLabels: Record<NoteableType, string> = {
  goal: "Goal",
  milestone: "Milestone",
  task: "Task",
  habit: "Habit",
  project: "Project",
  journal_entry: "Journal entry"
};

export const noteableTypeToPrisma = {
  goal: "GOAL",
  milestone: "MILESTONE",
  task: "TASK",
  habit: "HABIT",
  project: "PROJECT",
  journal_entry: "JOURNAL_ENTRY"
} as const;

export const noteableTypeFromPrisma = {
  GOAL: "goal",
  MILESTONE: "milestone",
  TASK: "task",
  HABIT: "habit",
  PROJECT: "project",
  JOURNAL_ENTRY: "journal_entry"
} as const;

export function buildDefaultNoteFormValues(): NoteFormValues {
  return {
    noteableType: "goal",
    noteableId: "",
    content: ""
  };
}

export function buildNoteExcerpt(content: string, maxLength = 180) {
  const normalized = content.trim().replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3)}...`;
}
