import "server-only";

import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  relatedEntityTypeToPrisma
} from "@/features/notifications/notification-helpers";
import type { RelatedEntityType } from "@/features/notifications/types";

type CreateNotificationInput = {
  userId: bigint;
  type: string;
  title: string;
  body?: string | null;
  relatedType?: RelatedEntityType | null;
  relatedId?: bigint | null;
  data?: Prisma.InputJsonValue | null;
};

export async function createNotificationForUser(input: CreateNotificationInput) {
  const prisma = getPrismaClient();
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      relatedType: input.relatedType
        ? relatedEntityTypeToPrisma[input.relatedType]
        : null,
      relatedId: input.relatedId ?? null,
      data: input.data ?? undefined
    },
    select: {
      id: true
    }
  });

  return notification.id;
}

export async function markNotificationAsReadForUser(
  userId: bigint,
  notificationId: string
) {
  const prisma = getPrismaClient();
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    },
    select: {
      id: true,
      readAt: true
    }
  });

  if (!notification || notification.readAt) {
    return false;
  }

  await prisma.notification.update({
    where: {
      id: notification.id
    },
    data: {
      readAt: new Date()
    }
  });

  return true;
}

export async function markAllNotificationsAsReadForUser(userId: bigint) {
  const prisma = getPrismaClient();
  await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  });
}
