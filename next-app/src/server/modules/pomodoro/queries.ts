import "server-only";

import type { PomodoroOverview, PomodoroSessionItem, PomodoroTaskOption } from "@/features/pomodoro/types";
import { getTodayDateInput, parseDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function buildTodayRange() {
  const start = parseDateInput(getTodayDateInput()) ?? new Date();
  const end = new Date(start);

  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

function calculateActualDurationMinutes(startedAt: Date, endedAt: Date | null) {
  const end = endedAt ?? new Date();
  const diff = end.getTime() - startedAt.getTime();

  return Math.max(1, Math.round(diff / (60 * 1000)));
}

function mapSession(session: {
  id: bigint;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number | null;
  completed: boolean;
  notes: string | null;
  task: {
    id: bigint;
    title: string;
    goal: {
      id: bigint;
      title: string;
    };
  };
}): PomodoroSessionItem {
  const durationMinutes = session.durationMinutes ?? 25;

  return {
    id: session.id.toString(),
    taskId: session.task.id.toString(),
    taskTitle: session.task.title,
    goalId: session.task.goal.id.toString(),
    goalTitle: session.task.goal.title,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    durationMinutes,
    actualDurationMinutes: calculateActualDurationMinutes(
      session.startedAt,
      session.endedAt
    ),
    completed: session.completed,
    notes: session.notes ?? null,
    isActive: session.endedAt === null
  };
}

export async function getPomodoroOverviewForUser(
  userId: bigint
): Promise<PomodoroOverview> {
  const prisma = getPrismaClient();
  const { start, end } = buildTodayRange();
  const [activeSession, recentSessions, taskOptions, totalSessions, completedSessions, todaySessions] =
    await Promise.all([
      prisma.pomodoroSession.findFirst({
        where: {
          userId,
          endedAt: null
        },
        orderBy: {
          startedAt: "desc"
        },
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          durationMinutes: true,
          completed: true,
          notes: true,
          task: {
            select: {
              id: true,
              title: true,
              goal: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      }),
      prisma.pomodoroSession.findMany({
        where: {
          userId
        },
        orderBy: {
          startedAt: "desc"
        },
        take: 10,
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          durationMinutes: true,
          completed: true,
          notes: true,
          task: {
            select: {
              id: true,
              title: true,
              goal: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      }),
      prisma.task.findMany({
        where: {
          userId,
          deletedAt: null,
          status: {
            not: "COMPLETED"
          }
        },
        orderBy: [{ isFocus: "desc" }, { dueAt: "asc" }, { title: "asc" }],
        select: {
          id: true,
          title: true,
          goal: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.pomodoroSession.count({
        where: {
          userId
        }
      }),
      prisma.pomodoroSession.count({
        where: {
          userId,
          completed: true
        }
      }),
      prisma.pomodoroSession.count({
        where: {
          userId,
          startedAt: {
            gte: start,
            lt: end
          }
        }
      })
    ]);

  return {
    summary: {
      totalSessions,
      completedSessions,
      activeSessions: activeSession ? 1 : 0,
      todaySessions
    },
    activeSession: activeSession ? mapSession(activeSession) : null,
    recentSessions: recentSessions.map(mapSession),
    taskOptions: taskOptions.map<PomodoroTaskOption>((task) => ({
      id: task.id.toString(),
      title: task.title,
      goalId: task.goal.id.toString(),
      goalTitle: task.goal.title
    }))
  };
}
