import "server-only";

import {
  noteableTypeFromPrisma,
  noteableTypeLabels
} from "@/features/notes/note-helpers";
import type {
  NoteFormValues,
  NoteListItem,
  NoteTargetOption,
  NoteableType
} from "@/features/notes/types";
import { formatDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function makeTargetKey(type: NoteableType, id: string) {
  return `${type}:${id}`;
}

function mapNoteListItem(
  note: {
    id: bigint;
    noteableType: keyof typeof noteableTypeFromPrisma;
    noteableId: bigint;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  },
  targetMap: Map<string, NoteTargetOption>
): NoteListItem {
  const noteableType = noteableTypeFromPrisma[note.noteableType];
  const noteableId = note.noteableId.toString();
  const target = targetMap.get(makeTargetKey(noteableType, noteableId));

  return {
    id: note.id.toString(),
    noteableType,
    noteableId,
    targetLabel: target?.label ?? `${noteableTypeLabels[noteableType]} #${noteableId}`,
    targetDescription: target?.description ?? null,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString()
  };
}

export async function listNoteTargetOptionsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const [goals, milestones, tasks, habits, projects, journalEntries] =
    await Promise.all([
      prisma.goal.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ targetDate: "asc" }, { title: "asc" }],
        select: {
          id: true,
          title: true
        }
      }),
      prisma.milestone.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ sequenceNo: "asc" }, { title: "asc" }],
        select: {
          id: true,
          title: true,
          goal: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.task.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ dueAt: "asc" }, { title: "asc" }],
        select: {
          id: true,
          title: true,
          goal: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.habit.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ createdAt: "desc" }, { title: "asc" }],
        select: {
          id: true,
          title: true
        }
      }),
      prisma.project.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ endDate: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true
        }
      }),
      prisma.journalEntry.findMany({
        where: {
          userId,
          deletedAt: null
        },
        orderBy: [{ entryDate: "desc" }],
        select: {
          id: true,
          title: true,
          entryDate: true
        }
      })
    ]);

  const options: NoteTargetOption[] = [
    ...goals.map((goal) => ({
      type: "goal" as const,
      id: goal.id.toString(),
      label: goal.title,
      description: null
    })),
    ...milestones.map((milestone) => ({
      type: "milestone" as const,
      id: milestone.id.toString(),
      label: milestone.title,
      description: milestone.goal.title
    })),
    ...tasks.map((task) => ({
      type: "task" as const,
      id: task.id.toString(),
      label: task.title,
      description: task.goal.title
    })),
    ...habits.map((habit) => ({
      type: "habit" as const,
      id: habit.id.toString(),
      label: habit.title,
      description: null
    })),
    ...projects.map((project) => ({
      type: "project" as const,
      id: project.id.toString(),
      label: project.name,
      description: null
    })),
    ...journalEntries.map((entry) => ({
      type: "journal_entry" as const,
      id: entry.id.toString(),
      label: entry.title?.trim() || `Nhat ky ${formatDateInput(entry.entryDate)}`,
      description: formatDateInput(entry.entryDate)
    }))
  ];

  return options.sort((left, right) => {
    const leftType = noteableTypeLabels[left.type];
    const rightType = noteableTypeLabels[right.type];

    return (
      leftType.localeCompare(rightType, "vi") ||
      left.label.localeCompare(right.label, "vi")
    );
  });
}

export async function listNotesForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const [notes, targetOptions] = await Promise.all([
    prisma.note.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        noteableType: true,
        noteableId: true,
        content: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    listNoteTargetOptionsForUser(userId)
  ]);

  const targetMap = new Map(
    targetOptions.map((option) => [makeTargetKey(option.type, option.id), option])
  );

  return notes.map<NoteListItem>((note) => mapNoteListItem(note, targetMap));
}

export async function getNoteDetailForUser(userId: bigint, noteId: bigint) {
  const prisma = getPrismaClient();
  const [note, targetOptions] = await Promise.all([
    prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        noteableType: true,
        noteableId: true,
        content: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    listNoteTargetOptionsForUser(userId)
  ]);

  if (!note) {
    return null;
  }

  const targetMap = new Map(
    targetOptions.map((option) => [makeTargetKey(option.type, option.id), option])
  );

  return mapNoteListItem(note, targetMap);
}

export async function getNoteFormValuesForUser(userId: bigint, noteId: bigint) {
  const prisma = getPrismaClient();
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
      deletedAt: null
    },
    select: {
      noteableType: true,
      noteableId: true,
      content: true
    }
  });

  if (!note) {
    return null;
  }

  const values: NoteFormValues = {
    noteableType: noteableTypeFromPrisma[note.noteableType],
    noteableId: note.noteableId.toString(),
    content: note.content
  };

  return values;
}
