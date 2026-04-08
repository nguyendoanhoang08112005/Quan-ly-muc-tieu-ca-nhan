import "server-only";

import type { Prisma } from "@prisma/client";
import {
  relatedEntityTypeFromPrisma
} from "@/features/notifications/notification-helpers";
import type {
  NotificationListItem,
  NotificationSummary,
  RelatedEntityType
} from "@/features/notifications/types";
import { getPrismaClient } from "@/lib/db/prisma";

function asStringHref(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const href = (value as Record<string, Prisma.JsonValue>).href;

  return typeof href === "string" ? href : null;
}

function makeFallbackHref(
  relatedType: RelatedEntityType | null,
  relatedId: string | null,
  taskGoalMap: Map<string, string>,
  milestoneGoalMap: Map<string, string>
) {
  if (!relatedType || !relatedId) {
    return null;
  }

  switch (relatedType) {
    case "goal":
      return `/goals/${relatedId}`;
    case "habit":
      return `/habits/${relatedId}`;
    case "note":
      return "/notes";
    case "pomodoro_session":
      return "/pomodoro";
    case "project":
      return null;
    case "task": {
      const goalId = taskGoalMap.get(relatedId);

      return goalId ? `/goals/${goalId}` : "/tasks";
    }
    case "milestone": {
      const goalId = milestoneGoalMap.get(relatedId);

      return goalId ? `/goals/${goalId}` : "/goals";
    }
    default:
      return null;
  }
}

export async function listNotificationsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      data: true,
      relatedType: true,
      relatedId: true,
      readAt: true,
      createdAt: true
    }
  });

  const relatedTaskIds = notifications
    .filter((notification) => notification.relatedType === "TASK" && notification.relatedId)
    .map((notification) => notification.relatedId as bigint);
  const relatedMilestoneIds = notifications
    .filter(
      (notification) =>
        notification.relatedType === "MILESTONE" && notification.relatedId
    )
    .map((notification) => notification.relatedId as bigint);

  const [tasks, milestones] = await Promise.all([
    relatedTaskIds.length > 0
      ? prisma.task.findMany({
          where: {
            id: {
              in: relatedTaskIds
            },
            userId,
            deletedAt: null
          },
          select: {
            id: true,
            goalId: true
          }
        })
      : Promise.resolve([]),
    relatedMilestoneIds.length > 0
      ? prisma.milestone.findMany({
          where: {
            id: {
              in: relatedMilestoneIds
            },
            userId,
            deletedAt: null
          },
          select: {
            id: true,
            goalId: true
          }
        })
      : Promise.resolve([])
  ]);

  const taskGoalMap = new Map(
    tasks.map((task) => [task.id.toString(), task.goalId.toString()])
  );
  const milestoneGoalMap = new Map(
    milestones.map((milestone) => [
      milestone.id.toString(),
      milestone.goalId.toString()
    ])
  );

  return notifications.map<NotificationListItem>((notification) => {
    const relatedType = notification.relatedType
      ? relatedEntityTypeFromPrisma[notification.relatedType]
      : null;
    const relatedId = notification.relatedId?.toString() ?? null;
    const href =
      asStringHref(notification.data) ??
      makeFallbackHref(relatedType, relatedId, taskGoalMap, milestoneGoalMap);

    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body ?? null,
      relatedType,
      relatedId,
      href,
      isRead: notification.readAt !== null,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString()
    };
  });
}

export async function getNotificationSummaryForUser(
  userId: bigint
): Promise<NotificationSummary> {
  const prisma = getPrismaClient();
  const [total, unread] = await Promise.all([
    prisma.notification.count({
      where: {
        userId
      }
    }),
    prisma.notification.count({
      where: {
        userId,
        readAt: null
      }
    })
  ]);

  return {
    total,
    unread,
    read: total - unread
  };
}
