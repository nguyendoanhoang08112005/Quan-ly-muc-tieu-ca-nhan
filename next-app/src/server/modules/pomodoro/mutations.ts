import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import type { PomodoroStartFormInput } from "@/features/pomodoro/schemas/pomodoro-schemas";
import { createNotificationForUser } from "@/server/modules/notifications/mutations";

function calculateActualDurationMinutes(startedAt: Date, endedAt: Date) {
  return Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / (60 * 1000)));
}

type StartPomodoroResult =
  | { ok: true; sessionId: string }
  | { ok: false; reason: "active_session" | "invalid_task" };

export async function startPomodoroSessionForUser(
  userId: bigint,
  input: PomodoroStartFormInput
): Promise<StartPomodoroResult> {
  const prisma = getPrismaClient();
  const [activeSession, task] = await Promise.all([
    prisma.pomodoroSession.findFirst({
      where: {
        userId,
        endedAt: null
      },
      select: {
        id: true
      }
    }),
    prisma.task.findFirst({
      where: {
        id: BigInt(input.taskId),
        userId,
        deletedAt: null
      },
      select: {
        id: true
      }
    })
  ]);

  if (activeSession) {
    return {
      ok: false,
      reason: "active_session"
    };
  }

  if (!task) {
    return {
      ok: false,
      reason: "invalid_task"
    };
  }

  const session = await prisma.pomodoroSession.create({
    data: {
      userId,
      taskId: task.id,
      startedAt: new Date(),
      durationMinutes: input.durationMinutes,
      completed: false
    },
    select: {
      id: true
    }
  });

  return {
    ok: true,
    sessionId: session.id.toString()
  };
}

export async function completePomodoroSessionForUser(
  userId: bigint,
  sessionId: bigint,
  notes: string
) {
  const prisma = getPrismaClient();
  const session = await prisma.pomodoroSession.findFirst({
    where: {
      id: sessionId,
      userId,
      endedAt: null
    },
    select: {
      id: true,
      startedAt: true,
      taskId: true,
      task: {
        select: {
          title: true
        }
      }
    }
  });

  if (!session) {
    return false;
  }

  const endedAt = new Date();
  const actualDurationMinutes = calculateActualDurationMinutes(
    session.startedAt,
    endedAt
  );

  await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: session.taskId,
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        actualMinutes: true
      }
    });

    await tx.pomodoroSession.update({
      where: {
        id: session.id
      },
      data: {
        endedAt,
        completed: true,
        notes: notes.trim() || null
      }
    });

    if (task) {
      await tx.task.update({
        where: {
          id: task.id
        },
        data: {
          actualMinutes: (task.actualMinutes ?? 0) + actualDurationMinutes
        }
      });
    }
  });

  await createNotificationForUser({
    userId,
    type: "pomodoro.completed",
    title: `Hoan thanh pomodoro cho task "${session.task.title}"`,
    body: `Ban vua hoan thanh mot pomodoro ${actualDurationMinutes} phut.`,
    relatedType: "pomodoro_session",
    relatedId: session.id,
    data: {
      href: "/pomodoro"
    }
  });

  return true;
}

export async function interruptPomodoroSessionForUser(
  userId: bigint,
  sessionId: bigint
) {
  const prisma = getPrismaClient();
  const session = await prisma.pomodoroSession.findFirst({
    where: {
      id: sessionId,
      userId,
      endedAt: null
    },
    select: {
      id: true
    }
  });

  if (!session) {
    return false;
  }

  await prisma.pomodoroSession.update({
    where: {
      id: session.id
    },
    data: {
      endedAt: new Date(),
      completed: false
    }
  });

  return true;
}
