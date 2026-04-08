import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import type { TagFormInput } from "@/features/tags/schemas/tag-schemas";

export async function createTagForUser(userId: bigint, input: TagFormInput) {
  const prisma = getPrismaClient();
  const tag = await prisma.tag.create({
    data: {
      userId,
      name: input.name,
      color: input.color || null
    },
    select: {
      id: true
    }
  });

  return tag.id.toString();
}

export async function updateTagForUser(
  userId: bigint,
  tagId: bigint,
  input: TagFormInput
) {
  const prisma = getPrismaClient();
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!tag) {
    return null;
  }

  await prisma.tag.update({
    where: {
      id: tag.id
    },
    data: {
      name: input.name,
      color: input.color || null
    }
  });

  return tag.id.toString();
}

export async function softDeleteTagForUser(userId: bigint, tagId: bigint) {
  const prisma = getPrismaClient();
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!tag) {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    await tx.goalTag.deleteMany({
      where: {
        tagId: tag.id
      }
    });

    await tx.tag.update({
      where: {
        id: tag.id
      },
      data: {
        deletedAt: new Date()
      }
    });
  });

  return true;
}
