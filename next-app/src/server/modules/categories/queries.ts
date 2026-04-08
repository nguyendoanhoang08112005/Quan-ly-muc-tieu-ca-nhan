import "server-only";

import { categoryTypeFromPrisma } from "@/features/categories/category-helpers";
import type { CategoryFormValues, CategoryListItem } from "@/features/categories/types";
import { getPrismaClient } from "@/lib/db/prisma";

export async function listCategoriesForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const categories = await prisma.category.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      icon: true,
      type: true,
      _count: {
        select: {
          primaryGoals: true
        }
      }
    }
  });

  return categories.map<CategoryListItem>((category) => ({
    id: category.id.toString(),
    name: category.name,
    slug: category.slug,
    color: category.color ?? null,
    icon: category.icon ?? null,
    type: categoryTypeFromPrisma[category.type],
    goalsCount: category._count.primaryGoals
  }));
}

export async function getCategoryFormValuesForUser(
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
      id: true,
      name: true,
      color: true,
      icon: true,
      type: true
    }
  });

  if (!category) {
    return null;
  }

  const values: CategoryFormValues = {
    name: category.name,
    color: category.color ?? "",
    icon: category.icon ?? "",
    type: categoryTypeFromPrisma[category.type]
  };

  return values;
}
