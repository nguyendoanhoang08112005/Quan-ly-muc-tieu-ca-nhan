import "server-only";

import type { TagFormValues, TagListItem } from "@/features/tags/types";
import { getPrismaClient } from "@/lib/db/prisma";

export async function listTagsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const tags = await prisma.tag.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          goalLinks: true
        }
      }
    }
  });

  return tags.map<TagListItem>((tag) => ({
    id: tag.id.toString(),
    name: tag.name,
    color: tag.color ?? null,
    goalsCount: tag._count.goalLinks
  }));
}

export async function getTagFormValuesForUser(userId: bigint, tagId: bigint) {
  const prisma = getPrismaClient();
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      color: true
    }
  });

  if (!tag) {
    return null;
  }

  const values: TagFormValues = {
    name: tag.name,
    color: tag.color ?? ""
  };

  return values;
}
