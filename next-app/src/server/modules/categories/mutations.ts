import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { categoryTypeToPrisma } from "@/features/categories/category-helpers";
import type { CategoryFormInput } from "@/features/categories/schemas/category-schemas";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function createCategoryForUser(
  userId: bigint,
  input: CategoryFormInput
) {
  const prisma = getPrismaClient();
  const category = await prisma.category.create({
    data: {
      userId,
      name: input.name,
      slug: slugify(input.name) || null,
      color: input.color || null,
      icon: input.icon || null,
      type: categoryTypeToPrisma[input.type]
    },
    select: {
      id: true
    }
  });

  return category.id.toString();
}

export async function updateCategoryForUser(
  userId: bigint,
  categoryId: bigint,
  input: CategoryFormInput
) {
  const prisma = getPrismaClient();
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!category) {
    return null;
  }

  await prisma.category.update({
    where: {
      id: category.id
    },
    data: {
      name: input.name,
      slug: slugify(input.name) || null,
      color: input.color || null,
      icon: input.icon || null,
      type: categoryTypeToPrisma[input.type]
    }
  });

  return category.id.toString();
}

export async function softDeleteCategoryForUser(
  userId: bigint,
  categoryId: bigint
) {
  const prisma = getPrismaClient();
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!category) {
    return false;
  }

  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.goal.updateMany({
      where: {
        categoryId: category.id
      },
      data: {
        categoryId: null
      }
    });

    await tx.category.update({
      where: {
        id: category.id
      },
      data: {
        deletedAt
      }
    });
  });

  return true;
}
