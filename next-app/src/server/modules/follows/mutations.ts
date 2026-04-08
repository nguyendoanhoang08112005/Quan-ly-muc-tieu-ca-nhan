import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";

export async function followGoalForUser(userId: bigint, goalId: bigint) {
  const prisma = getPrismaClient();
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      deletedAt: null,
      isPublic: true,
      userId: {
        not: userId
      }
    },
    select: {
      id: true
    }
  });

  if (!goal) {
    return false;
  }

  await prisma.follow.upsert({
    where: {
      followerId_followableType_followableId: {
        followerId: userId,
        followableType: "GOAL",
        followableId: goal.id
      }
    },
    update: {},
    create: {
      followerId: userId,
      followableType: "GOAL",
      followableId: goal.id
    }
  });

  return true;
}

export async function unfollowGoalForUser(userId: bigint, goalId: bigint) {
  const prisma = getPrismaClient();
  const result = await prisma.follow.deleteMany({
    where: {
      followerId: userId,
      followableType: "GOAL",
      followableId: goalId
    }
  });

  return result.count > 0;
}
