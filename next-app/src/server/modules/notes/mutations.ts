import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { noteableTypeToPrisma } from "@/features/notes/note-helpers";
import type { NoteFormInput } from "@/features/notes/schemas/note-schemas";

async function resolveNoteTargetForUser(
  userId: bigint,
  noteableType: NoteFormInput["noteableType"],
  noteableId: string
) {
  const prisma = getPrismaClient();
  const targetId = BigInt(noteableId);

  switch (noteableType) {
    case "goal": {
      const record = await prisma.goal.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    case "milestone": {
      const record = await prisma.milestone.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    case "task": {
      const record = await prisma.task.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    case "habit": {
      const record = await prisma.habit.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    case "project": {
      const record = await prisma.project.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    case "journal_entry": {
      const record = await prisma.journalEntry.findFirst({
        where: {
          id: targetId,
          userId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      return record?.id ?? null;
    }
    default:
      return null;
  }
}

export async function createNoteForUser(userId: bigint, input: NoteFormInput) {
  const prisma = getPrismaClient();
  const noteableId = await resolveNoteTargetForUser(
    userId,
    input.noteableType,
    input.noteableId
  );

  if (!noteableId) {
    return null;
  }

  const note = await prisma.note.create({
    data: {
      userId,
      noteableType: noteableTypeToPrisma[input.noteableType],
      noteableId,
      content: input.content
    },
    select: {
      id: true
    }
  });

  return note.id.toString();
}

export async function updateNoteForUser(
  userId: bigint,
  noteId: bigint,
  input: NoteFormInput
) {
  const prisma = getPrismaClient();
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!note) {
    return null;
  }

  const noteableId = await resolveNoteTargetForUser(
    userId,
    input.noteableType,
    input.noteableId
  );

  if (!noteableId) {
    return null;
  }

  await prisma.note.update({
    where: {
      id: note.id
    },
    data: {
      noteableType: noteableTypeToPrisma[input.noteableType],
      noteableId,
      content: input.content
    }
  });

  return note.id.toString();
}

export async function softDeleteNoteForUser(userId: bigint, noteId: bigint) {
  const prisma = getPrismaClient();
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!note) {
    return false;
  }

  await prisma.note.update({
    where: {
      id: note.id
    },
    data: {
      deletedAt: new Date()
    }
  });

  return true;
}
